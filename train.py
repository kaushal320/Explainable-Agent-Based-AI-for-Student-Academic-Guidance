# train.py

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("data/cs_students.csv")

# Basic preprocessing
df = df.drop(['Student ID', 'Name', 'Gender', 'Age'], axis=1)

mapping = {"Weak":1, "Average":2, "Strong":3}
df['Python'] = df['Python'].map(mapping)
df['SQL'] = df['SQL'].map(mapping)
df['Java'] = df['Java'].map(mapping)

# Encode categorical columns
le_domain = LabelEncoder()
df['Interested Domain'] = le_domain.fit_transform(df['Interested Domain'])

le_career = LabelEncoder()
df['Future Career'] = le_career.fit_transform(df['Future Career'])

# Feature engineering
df['programming_skill'] = (df['Python'] + df['Java'] + df['SQL']) / 3
df['academic_score'] = df['GPA'] * 5

# Features and target
X = df[['GPA','Python','SQL','Java','programming_skill','academic_score','Interested Domain']]
y = df['Future Career']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model
model = DecisionTreeClassifier(max_depth=6, random_state=42)
model.fit(X_train, y_train)

print("Accuracy:", model.score(X_test, y_test)*100)

# Save model
joblib.dump(model, "model/career_model.pkl")
joblib.dump(le_domain, "model/domain_encoder.pkl")
joblib.dump(le_career, "model/career_encoder.pkl")

print("Model saved successfully!")