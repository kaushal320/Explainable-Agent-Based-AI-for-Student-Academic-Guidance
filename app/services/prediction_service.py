import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from ..core.lifespan import ml_models
from ..models.student import (
    StudentOnboarding,
    PredictionResponse,
    LearningPlan,
    SkillScores,
    CareerExplanation,
    FeatureContribution,
)
import logging

logger = logging.getLogger(__name__)

def _fallback_plan(career_name: str, skills_dict: Dict[str, float]) -> LearningPlan:
    weaknesses = analyze_student(skills_dict)
    return LearningPlan(
        advice=generate_advice(weaknesses),
        weakness_rank=weaknesses,
        beginner=f"Build core literacy toward {career_name}.",
        intermediate="Apply skills through small guided projects.",
        advanced="Tighten specialization and portfolio evidence.",
        projects="Capstone-style project aligned with your target role.",
        tools="VS Code, Git, documentation for your stack",
    )

def _build_career_explanation(
    sample: pd.DataFrame,
    pred_label_index: int,
) -> Optional[CareerExplanation]:
    model = ml_models.model
    le_career = ml_models.le_career
    if model is None or le_career is None:
        return None
    try:
        import shap
    except ImportError:
        logger.warning("shap not installed; skipping local explanations")
        return None

    names = list(sample.columns)
    try:
        proba = model.predict_proba(sample)[0]
        order = np.argsort(proba)[::-1]
        top_i, second_i = int(order[0]), int(order[1])
        confidence = float(proba[top_i])
        runner = le_career.inverse_transform([second_i])[0]
        runner_p = float(proba[second_i])

        explainer = shap.TreeExplainer(model)
        sv = explainer.shap_values(sample.astype(float))
        if isinstance(sv, list):
            block = np.asarray(sv[int(pred_label_index)])
            phi = block[0].ravel() if block.ndim == 2 else block.ravel()
        else:
            block = np.asarray(sv)
            phi = block[0].ravel() if block.ndim == 2 else block.ravel()
        if phi.size != len(names):
            phi = phi[: len(names)]

        row_vals = sample.iloc[0].to_dict()
        paired = list(zip(names, phi, [row_vals[n] for n in names]))
        paired.sort(key=lambda x: float(x[1]), reverse=True)
        top_pos = [
            FeatureContribution(feature=str(a), shap_value=float(b), value=c)
            for a, b, c in paired[:3]
        ]
        paired.sort(key=lambda x: float(x[1]))
        top_neg = [
            FeatureContribution(feature=str(a), shap_value=float(b), value=c)
            for a, b, c in paired[:3]
        ]

        fi = model.feature_importances_
        gsort = sorted(
            ({"feature": names[i], "importance": float(fi[i])} for i in range(len(names))),
            key=lambda x: -x["importance"],
        )[:7]

        return CareerExplanation(
            confidence=confidence,
            runner_up_career=runner,
            runner_up_confidence=runner_p,
            top_positive_drivers=top_pos,
            top_negative_drivers=top_neg,
            model_global_importance=gsort,
        )
    except Exception as e:
        logger.warning(f"Explanation generation failed: {e}")
        return None

exp_mapping = {
    "I have never used it": 1,
    "I know the basics (loops, functions)": 2,
    "I have built projects or use it frequently": 3,
    "I don't know what a database is": 1,
    "I can write basic SELECT queries": 2,
    "I can write complex queries (JOINs, Aggregations)": 3,
    "I have never programmed in Java": 1,
    "I know the syntax and basic Object-Oriented concepts": 2,
    "I have built applications with Java": 3
}

def analyze_student(skills: Dict[str, float]):
    weaknesses = {}
    weaknesses["Python"] = 3 - skills["Python"]
    weaknesses["SQL"] = 3 - skills["SQL"]
    weaknesses["Java"] = 3 - skills["Java"]
    weaknesses["GPA"] = 4 - skills["GPA"]
    return sorted(weaknesses.items(), key=lambda x: x[1], reverse=True)

def generate_advice(weaknesses: List[tuple]):
    advice_map = {
        "Python": "Improve Python programming with projects and practice",
        "SQL": "Strengthen database and SQL querying skills",
        "Java": "Work on Java fundamentals and OOP concepts",
        "GPA": "Focus on core academic concepts and consistency"
    }
    advice = []
    for skill, score in weaknesses:
        if score > 1:
            advice.append(advice_map.get(skill, ""))
    return advice

def get_learning_plan(career_name: str, skills: Dict[str, float]):
    if ml_models.content_df is None:
        return None
        
    row = ml_models.content_df[ml_models.content_df["career"] == career_name]
    if row.empty:
        return None

    row = row.iloc[0]
    weaknesses = analyze_student(skills)
    advice = generate_advice(weaknesses)

    return LearningPlan(
        advice=advice,
        weakness_rank=weaknesses,
        beginner=row["beginner"],
        intermediate=row["intermediate"],
        advanced=row["advanced"],
        projects=row["projects"],
        tools=row["tools"]
    )

class PredictionService:
    @staticmethod
    def predict_career(data: StudentOnboarding) -> PredictionResponse:
        try:
            # Domain transformation is the only one needing an encoder
            domain_encoded = ml_models.le_domain.transform([data.domain])[0]
        except (ValueError, AttributeError) as e:
            logger.error(f"Prediction failed: {e}")
            fd = {"Python": 1, "SQL": 1, "Java": 1, "GPA": data.gpa}
            return PredictionResponse(
                career="General IT Consultant",
                plan=LearningPlan(
                    beginner="Focus on core computer science foundations.",
                    intermediate="Explore various IT domains to find your fit.",
                    advanced="Specialize in your chosen area.",
                    advice=["Please select valid options in the UI."],
                    weakness_rank=[["Input Data", 1.0]],
                    projects="General technology projects",
                    tools="VS Code, Git",
                ),
                skills=SkillScores(**fd),
                explanation=None,
            )

        
        p_skill = exp_mapping.get(data.python_exp, 1)
        s_skill = exp_mapping.get(data.sql_exp, 1)
        j_skill = exp_mapping.get(data.java_exp, 1)
        
        prog_skill = (p_skill + s_skill + j_skill) / 3

        acad_score = data.gpa * 5
        
        sample = pd.DataFrame([{
            "GPA": data.gpa,
            "Python": p_skill,
            "SQL": s_skill,
            "Java": j_skill,
            "programming_skill": prog_skill,
            "academic_score": acad_score,
            "Interested Domain": domain_encoded
        }])
        
        pred = ml_models.model.predict(sample)
        career = ml_models.le_career.inverse_transform(pred)[0]
        pred_idx = int(pred[0])

        skills_dict = {"Python": p_skill, "SQL": s_skill, "Java": j_skill, "GPA": data.gpa}
        plan = get_learning_plan(career, skills_dict)
        if plan is None:
            plan = _fallback_plan(career, skills_dict)

        explanation = _build_career_explanation(sample, pred_idx)

        return PredictionResponse(
            career=career,
            plan=plan,
            skills=SkillScores(**skills_dict),
            explanation=explanation,
        )
