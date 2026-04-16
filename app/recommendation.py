import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
content_df = pd.read_csv("data/career_content.csv")

def analyze_student(student_data):
    weaknesses = {}

    # Convert to scores (low = weak)
    weaknesses["Python"] = 3 - student_data["Python"]
    weaknesses["SQL"] = 3 - student_data["SQL"]
    weaknesses["Java"] = 3 - student_data["Java"]
    weaknesses["GPA"] = 4 - student_data["GPA"]

    # Sort by biggest weakness
    sorted_weakness = sorted(weaknesses.items(), key=lambda x: x[1], reverse=True)

    return sorted_weakness


def generate_advice(weaknesses):
    advice_map = {
        "Python": "Improve Python programming with projects and practice",
        "SQL": "Strengthen database and SQL querying skills",
        "Java": "Work on Java fundamentals and OOP concepts",
        "GPA": "Focus on core academic concepts and consistency"
    }

    advice = []

    for skill, score in weaknesses:
        if score > 1:  # threshold
            advice.append(advice_map[skill])

    return advice


def get_learning_plan(career_name, student_data):
    row = content_df[content_df["career"] == career_name]

    if row.empty:
        return None

    row = row.iloc[0]

    # 🔥 ANALYZE STUDENT
    weaknesses = analyze_student(student_data)

    # 🔥 GENERATE SMART ADVICE
    advice = generate_advice(weaknesses)

    return {
        "advice": advice,
        "weakness_rank": weaknesses,
        "beginner": row["beginner"],
        "intermediate": row["intermediate"],
        "advanced": row["advanced"],
        "projects": row["projects"],
        "tools": row["tools"]
    }

def explain_decision(model, sample_df, feature_names, le_domain):
    """Extracts the decision path from the Decision Tree to explain the prediction in a human-readable format."""
    node_indicator = model.decision_path(sample_df)
    leaf_id = model.apply(sample_df)
    
    sample_id = 0
    node_index = node_indicator.indices[node_indicator.indptr[sample_id] : node_indicator.indptr[sample_id + 1]]
    
    explanation = []
    skill_mapping = {1: "Weak", 2: "Average", 3: "Strong"}
    
    for node_id in node_index:
        if leaf_id[sample_id] == node_id:
            continue
            
        feature_id = model.tree_.feature[node_id]
        threshold = model.tree_.threshold[node_id]
        
        feature_name = feature_names[feature_id]
        sample_value = sample_df.iloc[sample_id, feature_id]
        
        if feature_name == "Interested Domain":
            domain_name = le_domain.inverse_transform([int(sample_value)])[0]
            explanation.append(f"**{feature_name}** is '{domain_name}'")
        elif feature_name in ["Python", "SQL", "Java"]:
            skill_label = skill_mapping.get(int(sample_value), str(sample_value))
            if sample_value <= threshold:
                explanation.append(f"**{feature_name} Skill** is {skill_label} (Below ideal threshold for other paths)")
            else:
                explanation.append(f"**{feature_name} Skill** is {skill_label} (Strong enough for this path)")
        else:
            if sample_value <= threshold:
                explanation.append(f"**{feature_name}** is {round(sample_value, 2)} (≤ {round(threshold, 2)})")
            else:
                explanation.append(f"**{feature_name}** is {round(sample_value, 2)} (> {round(threshold, 2)})")
            
    # Remove duplicates from decision path (e.g., Domain is X multiple times)
    seen = set()
    unique_explanation = []
    for exp in explanation:
        if exp not in seen:
            unique_explanation.append(exp)
            seen.add(exp)
            
    return unique_explanation

def generate_weekly_goals(weaknesses):
    """Generates a list of 4-week goals based on the top weakness."""
    if not weaknesses:
        return ["Keep up the good work!"]
    
    top_weakness = weaknesses[0][0]
    
    goals = {
        "Python": [
            "Week 1: Review basic data types and control structures.",
            "Week 2: Practice writing functions and using built-in libraries.",
            "Week 3: Complete a small project like a calculator.",
            "Week 4: Learn about Object-Oriented Programming in Python."
        ],
        "SQL": [
            "Week 1: Understand basic SELECT, WHERE, and sorting.",
            "Week 2: Practice JOINS (INNER, LEFT, RIGHT).",
            "Week 3: Learn aggregations (GROUP BY, HAVING).",
            "Week 4: Write complex nested queries and subqueries."
        ],
        "Java": [
            "Week 1: Review Java syntax, loops, and conditions.",
            "Week 2: Understand Classes, Objects, and methods.",
            "Week 3: Learn Inheritance and Polymorphism.",
            "Week 4: Build a small console-based Java application."
        ],
        "GPA": [
            "Week 1: Create a daily study schedule.",
            "Week 2: Focus on completing assignments 2 days before deadline.",
            "Week 3: Attend all lectures and take active notes.",
            "Week 4: Form a study group for your hardest subject."
        ]
    }
    
    return goals.get(top_weakness, ["Keep practicing to improve your skills!"])

def get_lesson_content(skill, week):
    """Returns educational content for a given skill and week."""
    lessons = {
        "Python": {
            1: "### Week 1: Python Basics & Fundamentals 🐍\n\n**Introduction to Python**\nPython is a high-level, interpreted programming language known for its readability and concise syntax. It is heavily used in Data Science, Web Development, and Automation. Before writing advanced scripts, you must master the building blocks: variables, data types, and control flow.\n\n**Variables and Data Types:**\nPython is dynamically typed, meaning you don't need to declare a variable's type explicitly. The core data types include `int` (integers), `float` (decimals), `str` (text), and `bool` (True/False).\n\n```python\n# Variable Assignment Example\nage = 20          # Integer\nheight = 5.9      # Float\nname = 'Alice'    # String\nis_student = True # Boolean\n```\n\n**Control Structures (If-Else & Loops):**\nLogic in programming relies on conditionals and loops.\n- `if`, `elif`, `else` let your code make decisions.\n- `for` loops iterate over a sequence (like a list or a string).\n- `while` loops run as long as a condition is true.\n\n```python\n# Conditional Logic\nif age >= 18:\n    print(f'{name} is an adult.')\nelse:\n    print(f'{name} is a minor.')\n\n# Looping\nfor i in range(3):\n    print(f'Counting: {i}')\n```\n\n**Action Item for this Week:** \nInstall Python and an IDE like VS Code. Write a script that asks the user for their age using `input()`, and prints out what year they will turn 100.",
            2: "### Week 2: Functions, Scope, and Standard Libraries 🛠️\n\n**Why Functions?**\nAs your scripts grow, writing all your code logic in one continuous flow becomes messy and unmanageable. Functions allow you to wrap code into reusable blocks. Think of them as mini-programs inside your main program that accept inputs (arguments) and return outputs.\n\n```python\ndef calculate_area(length, width):\n    \"\"\"Calculates the area of a rectangle.\"\"\"\n    area = length * width\n    return area\n\nroom_area = calculate_area(10, 15)\nprint(f'The room is {room_area} square feet.')\n```\n\n**Variable Scope:**\nVariables declared inside a function only exist *inside* that function (Local Scope). Variables declared outside exist everywhere (Global Scope). It is a best practice to avoid modifying global variables inside functions.\n\n**The Standard Library:**\nPython comes \"batteries included.\" This means you don't have to code everything from scratch. You can simply `import` built-in modules to handle complex math, date/time operations, or file reading.\n\n```python\nimport math\nimport random\n\nprint(math.sqrt(16))  # Output: 4.0\nprint(random.randint(1, 10))  # Prints a random number between 1 and 10\n```\n\n**Action Item for this Week:**\nWrite a function called `generate_password(length)` that imports the `random` module, generates a random string of characters of the given `length`, and returns it.",
            3: "### Week 3: Data Structures & File Handling 📂\n\n**Core Data Structures:**\nHandling single pieces of data is easy, but what if you have 1,000 users? You need Data Structures. Python provides four built-in structures:\n1. **Lists (`[]`)**: Ordered, mutable collections. Great for a sequence of items.\n2. **Tuples (`()`)**: Ordered, immutable collections. Used for fixed records (e.g., coordinates).\n3. **Dictionaries (`{}`)**: Unordered key-value pairs. Optimized for fast lookups.\n4. **Sets (`set()`)**: Unordered collections of unique items.\n\n```python\n# List\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('orange')\n\n# Dictionary\nstudent = {\n    'name': 'Bob',\n    'gpa': 3.5,\n    'courses': ['Math', 'CS']\n}\nprint(student['name'])\n```\n\n**File Handling:**\nA program isn't very useful if it forgets everything when it closes. You can read from and write to text files using the built-in `open()` function. We use the `with` statement to ensure the file is properly closed after we are done.\n\n```python\n# Writing to a file\nwith open('journal.txt', 'w') as file:\n    file.write('Today I learned about file handling!')\n\n# Reading from a file\nwith open('journal.txt', 'r') as file:\n    content = file.read()\n    print(content)\n```\n\n**Action Item for this Week:**\nCreate a script that takes a dictionary of student grades, calculates the average, and writes the final report to `report.txt`.",
            4: "### Week 4: Object-Oriented Programming (OOP) 🏗️\n\n**The OOP Paradigm**\nObject-Oriented Programming models real-world entities as \"Objects\". This is essential for building large-scale software systems because it groups data (attributes) and behaviors (methods) together cleanly.\n\n**Classes and Instances:**\nA `class` is a blueprint. An instance (or object) is the actual creation based on that blueprint. For example, `Car` is a class, but your specific red Toyota is an instance.\n\n**The `__init__` constructor:**\nWhen an object is created, the `__init__` method runs automatically to set up its initial state.\n\n```python\nclass Dog:\n    # The blueprint constructor\n    def __init__(self, name, breed):\n        self.name = name  # Attribute\n        self.breed = breed\n        self.energy = 100\n        \n    # A behavior (method)\n    def fetch(self):\n        if self.energy > 10:\n            self.energy -= 10\n            return f'{self.name} fetched the ball! Energy is now {self.energy}.'\n        else:\n            return f'{self.name} is too tired.'\n        \n# Creating Instances\nmy_dog = Dog('Buddy', 'Golden Retriever')\nprint(my_dog.fetch())\n```\n\n**Why use `self`?**\n`self` refers to the specific instance of the object calling the method. It allows `Buddy` to keep his energy level separate from another dog object like `Max`.\n\n**Action Item for this Week:**\nBuild a basic Zoo application. Create an `Animal` base class, and derive specific animals (like `Lion` or `Penguin`). Give them different eating and sleeping behaviors!"
        },
        "SQL": {
            1: "### Week 1: Relational Databases & Basic Queries 🗄️\n\n**What is SQL?**\nStructured Query Language (SQL) is the standard language for dealing with Relational Databases. A relational database stores data in tables (like Excel spreadsheets) that are related to one another.\n\n**The Foundation: SELECT, FROM, WHERE**\nThe most common task is extracting data.\n- `SELECT`: Which columns do you want to see?\n- `FROM`: Which table holds these columns?\n- `WHERE`: How do you want to filter the rows?\n\n```sql\n-- Retrieve all columns for students who have a high GPA\nSELECT * \nFROM Students \nWHERE GPA >= 3.5;\n\n-- Retrieve only specific columns\nSELECT FirstName, LastName, Major\nFROM Students\nWHERE GraduationYear = 2026;\n```\n\n**Sorting and Limiting:**\nYou often want data returned in a specific order, or you only want the top 5 results.\n```sql\nSELECT Title, ReleaseYear \nFROM Movies \nORDER BY ReleaseYear DESC \nLIMIT 5;\n```\n\n**Action Item for this Week:**\nSet up a local SQLite database or use an online SQL playground (like DB Fiddle). Create a simple table of your favorite books and practice writing `SELECT` statements with different `WHERE` conditions.",
            2: "### Week 2: SQL Joins - Connecting Your Data 🔗\n\n**The Power of Relations**\nDatabases avoid data duplication. Instead of storing a professor's name, email, and department in every single course record, we store the Professor's ID in the `Courses` table and link it to the `Professors` table. We use `JOIN`s to stitch this data back together!\n\n**Types of JOINS:**\n1. **INNER JOIN**: Returns records that have matching values in both tables.\n2. **LEFT JOIN**: Returns all records from the left table, and the matched records from the right table.\n3. **RIGHT JOIN**: Returns all records from the right table, and the matched records from the left.\n\n```sql\n-- Example of an INNER JOIN\nSELECT Students.FirstName, Courses.CourseName \nFROM Students\nINNER JOIN Enrollments ON Students.StudentID = Enrollments.StudentID\nINNER JOIN Courses ON Enrollments.CourseID = Courses.CourseID;\n```\n\n*Explanation:* We take the `Students` table, link it to the bridge table `Enrollments`, and then link that to `Courses`. This query tells us exactly who is taking what class.\n\n**Action Item:**\nVisualize a Venn diagram when practicing joins. Create two tables: `Customers` and `Orders`. Write an `INNER JOIN` to see customers who bought items, and a `LEFT JOIN` to see all customers even if they haven't bought anything.",
            3: "### Week 3: Aggregations & Grouping Data 🔢\n\n**Aggregate Functions:**\nSQL isn't just for retrieving raw data; it can perform math! The most common aggregate functions are `COUNT()`, `MAX()`, `MIN()`, `SUM()`, and `AVG()`.\n\n```sql\n-- Find the average GPA of the entire school\nSELECT AVG(GPA) AS Average_GPA FROM Students;\n```\n\n**The GROUP BY Clause:**\nUsually, you want aggregates broken down by category. For example, instead of the average GPA of the whole school, you want the average GPA *per department*.\n\n```sql\nSELECT Department, COUNT(StudentID) as Total_Students, AVG(GPA) as Avg_GPA\nFROM Students \nGROUP BY Department;\n```\n\n**HAVING vs WHERE:**\nWhat if you only want to see departments that have more than 100 students? You cannot use `WHERE` on aggregated columns. You must use `HAVING`.\n\n```sql\nSELECT Department, COUNT(StudentID)\nFROM Students \nGROUP BY Department\nHAVING COUNT(StudentID) > 100;\n```\n\n**Action Item:**\nWrite a query that groups an inventory table by `Category`, sums the `Price`, and uses `ORDER BY` to find the most expensive category of items.",
            4: "### Week 4: Subqueries and Advanced Techniques 🧠\n\n**What are Subqueries?**\nA subquery is a query nested inside another query. It allows you to use the result of one query dynamically as the filter for another.\n\nImagine you want to find all students who scored above the class average. You can't hardcode the average because it changes as new tests are graded.\n\n```sql\n-- The inner query calculates the average.\n-- The outer query uses that average to filter students.\nSELECT FirstName, LastName, TestScore\nFROM Students \nWHERE TestScore > (\n    SELECT AVG(TestScore) \n    FROM Students\n);\n```\n\n**Common Table Expressions (CTEs):**\nWhen subqueries get too large, they become hard to read. CTEs allow you to define a temporary result set using the `WITH` keyword, making your code clean and modular.\n\n```sql\nWITH HighAchievers AS (\n    SELECT StudentID, GPA \n    FROM Students \n    WHERE GPA > 3.8\n)\nSELECT HighAchievers.StudentID, Scholarships.Amount\nFROM HighAchievers\nINNER JOIN Scholarships ON HighAchievers.StudentID = Scholarships.StudentID;\n```\n\n**Action Item:**\nTake your most complex query from Week 3 and rewrite it using a `WITH` CTE block to improve its readability."
        },
        "Java": {
            1: "### Week 1: Java Syntax, Typing & Control Flow ☕\n\n**The Java Philosophy:**\nJava is an Object-Oriented, strongly typed, compiled language. Unlike Python, you must specify the exact type of a variable, and all code must live inside a `class`. The entry point of any Java application is the `public static void main(String[] args)` method.\n\n**Variables and Strict Typing:**\n```java\nint age = 20;               // 32-bit integer\ndouble accountBalance = 1500.50; // 64-bit decimal\nboolean isEnrolled = true;  // true or false\nString name = \"Alice\";      // Text (Note: String is capitalized because it is an Object, not a primitive!)\n```\n\n**Loops and Conditions:**\nJava uses curly braces `{}` to define blocks of code and semicolons `;` to end statements.\n\n```java\n// Standard For Loop\nfor (int i = 0; i < 5; i++) {\n    System.out.println(\"Count is: \" + i);\n}\n\n// If-Else Block\nif (age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}\n```\n\n**Action Item:**\nInstall the JDK (Java Development Kit) and an IDE like IntelliJ IDEA. Write a simple program that uses a `Scanner` object to read a user's name from the console and prints a personalized greeting.",
            2: "### Week 2: Classes, Objects & Memory 🏛️\n\n**Object-Oriented Core:**\nJava forces you into the OOP paradigm. A class defines the state (variables/fields) and behavior (methods) of an entity.\n\n```java\npublic class Car {\n    // Fields (State)\n    private String model;\n    public int speed;\n\n    // Constructor\n    public Car(String model) {\n        this.model = model;\n        this.speed = 0;\n    }\n\n    // Method (Behavior)\n    public void accelerate() {\n        this.speed += 10;\n        System.out.println(this.model + \" is going \" + this.speed + \" mph.\");\n    }\n}\n```\n\n**The `new` Keyword and Memory:**\nWhen you type `new Car(\"Tesla\")`, Java allocates memory in the \"Heap\" for that specific object. \n\n```java\nCar myCar = new Car(\"Tesla\");\nmyCar.accelerate();\n```\n\n**Access Modifiers:**\n- `public`: Accessible from any other class.\n- `private`: Accessible ONLY from within the class itself. Used for encapsulating data.\n\n**Action Item:**\nCreate a `BankAccount` class. Give it a `private double balance` field. Implement `public void deposit(double amount)` and `public void withdraw(double amount)` methods to safely modify the balance.",
            3: "### Week 3: Deep Dive into OOP Principles 🧬\n\n**Inheritance:**\nInheritance allows a new class (Subclass) to acquire the properties and methods of an existing class (Superclass) using the `extends` keyword. This promotes code reusability.\n\n```java\n// Superclass\nclass Animal {\n    public void eat() {\n        System.out.println(\"This animal eats food.\");\n    }\n}\n\n// Subclass\nclass Dog extends Animal {\n    public void bark() {\n        System.out.println(\"Woof!\");\n    }\n}\n\nDog myDog = new Dog();\nmyDog.eat();  // Inherited method!\nmyDog.bark(); // Its own method\n```\n\n**Polymorphism & Overriding:**\nPolymorphism means \"many forms.\" You can override a method in the subclass to provide a specific implementation.\n\n```java\nclass Cat extends Animal {\n    @Override\n    public void eat() {\n        System.out.println(\"The cat nibbles on fish.\");\n    }\n}\n\nAnimal mysteryAnimal = new Cat();\nmysteryAnimal.eat(); // Prints the Cat's overridden method!\n```\n\n**Action Item:**\nCreate a `Shape` class with an `area()` method. Create `Circle` and `Rectangle` subclasses that override the `area()` method with their specific mathematical formulas.",
            4: "### Week 4: Interfaces & Collections Framework 🚀\n\n**Interfaces:**\nAn interface is a completely abstract class that groups related methods with empty bodies. It serves as a \"contract\" that classes must sign and implement using the `implements` keyword. This is crucial for building large, decoupled systems.\n\n```java\ninterface Playable {\n    void play();\n    void pause();\n}\n\nclass MP3Player implements Playable {\n    public void play() { System.out.println(\"Playing MP3\"); }\n    public void pause() { System.out.println(\"Pausing MP3\"); }\n}\n```\n\n**Java Collections Framework:**\nArrays in Java are fixed-size, which is highly restrictive. The Collections framework provides dynamic data structures. The most common is the `ArrayList`.\n\n```java\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> groceries = new ArrayList<>();\n        groceries.add(\"Milk\");\n        groceries.add(\"Eggs\");\n        \n        for (String item : groceries) {\n            System.out.println(item);\n        }\n    }\n}\n```\n\n**Action Item:**\nCreate an interface `PaymentMethod` with a method `pay(double amount)`. Implement it in two classes: `CreditCard` and `PayPal`. Add multiple payment methods to a `List` and iterate through them to process a generic payment!"
        },
        "GPA": {
            1: "### Week 1: Elite Time Management Strategies ⏳\n\n**The Reality of College Workloads**\nYou are no longer studying just to pass tomorrow's test; you are building the foundation of your career. Academic success requires treating your studies like a full-time job.\n\n**The Block Scheduling Method:**\nMost students fail because they rely on motivation, which fluctuates. Instead, rely on discipline through \"Time Boxing\" or block scheduling.\n\n1. Use Google Calendar or Apple Calendar.\n2. Block out your fixed constants (Lectures, Commutes, Work, Sleep).\n3. Apply the 2:1 ratio: For every 1 hour you spend in a lecture, block out 2 hours of independent study time for that course.\n4. **Protect the Block:** Treat this study block exactly as you would an important meeting with a boss. Turn off notifications. Put your phone in another room.\n\n**The Pomodoro Technique:**\nDuring your blocked study hours, use the Pomodoro timer:\n- 25 Minutes of deep, intensely focused work.\n- 5 Minutes of stretching, walking, or resting.\n- After 4 cycles, take a 30-minute break.\n\n*Action Step for Today:* Map out your entire semester schedule in a digital calendar. Color code your lectures in Blue, and your dedicated study blocks in Red.",
            2: "### Week 2: Defeating Procrastination & Assignment Execution 🛡️\n\n**Understanding Procrastination:**\nProcrastination isn't a time-management issue; it is an emotional-regulation issue. We delay tasks because they make us feel overwhelmed, confused, or bored. \n\n**The Micro-Step Framework:**\nWhen a task looks too big (e.g., \"Write 10-page essay\"), your brain shuts down. You must break it into infinitesimally small steps so the friction to start is zero.\n- Bad: \"Work on essay.\"\n- Good: \"Open Word doc, write the title, and write 3 bullet points for the introduction.\"\n\n**The -2 Days Rule:**\nWrite down fake deadlines for yourself exactly 48 hours before the real deadline. This achieves two things:\n1. It creates an artificial panic that activates focus earlier.\n2. If disaster strikes (internet goes down, you get sick, the assignment is harder than expected), you have a safety buffer.\n\n*Action Step for Today:* Look at your syllabus. Take the biggest project due this semester and break it down into 10 \"Micro-Steps\". Enter those steps into your calendar as individual tasks.",
            3: "### Week 3: Active Recall & The Science of Learning 🧠\n\n**Why Re-reading Fails:**\nHighlighting textbooks and re-reading notes feels productive, but studies show it results in low retention. This is called the \"Illusion of Competence\"—you recognize the text, so you assume you know it.\n\n**Active Recall:**\nLearning happens when you *retrieve* information from your brain, not when you push it in. \n- **Flashcards:** Use digital tools like Anki or Quizlet.\n- **The Feynman Technique:** After learning a concept, close the book and explain it out loud as if you were teaching a 5-year-old. If you stumble, that is your knowledge gap.\n- **Practice Testing:** The absolute highest yield study method is taking mock exams or doing unassisted practice problems.\n\n**Spaced Repetition:**\nYour brain forgets information on an exponential curve (The Ebbinghaus Forgetting Curve). You must review material at increasing intervals (1 day later, 3 days later, 1 week, 1 month) to lock it into permanent memory.\n\n*Action Step for Today:* Stop highlighting. Take your notes from the last lecture and turn them into 10 question-and-answer flashcards. Test yourself immediately.",
            4: "### Week 4: Environmental Design & Office Hours 🤝\n\n**Context-Dependent Learning:**\nYour environment dictates your behavior. If you study on your bed, your brain associates that space with sleep, making you tired. If you study in front of your TV, your brain associates it with entertainment, killing focus.\n\n- **Create a \"Work Only\" Zone:** Go to the library, a coffee shop, or a specific desk in your room. When you sit there, you only work. Nothing else.\n\n**The Power of Office Hours:**\nProfessors and Teaching Assistants hold the keys to the exams. Most students never visit them. \nAttending office hours provides three massive advantages:\n1. You get customized help on topics you don't understand.\n2. Professors often drop hints about what is uniquely important for upcoming exams.\n3. By showing up, you demonstrate initiative. In borderline grading situations (e.g., you have an 89.4%), a professor is much more likely to round your grade to an A if they know you personally and see your effort.\n\n*Action Step for Today:* Identify one topic you struggled with this week. Find your professor's office hours on the syllabus, and go ask them to explain it to you."
        }
    }
    
    return lessons.get(skill, {}).get(week, "No lesson found for this topic.")


def get_mock_quiz(weakest_skill):
    """Returns a question, options, and the correct answer index."""
    quizzes = {
        "Python": {
            "question": "Which keyword is used to define a function in Python?",
            "options": ["func", "def", "function", "lambda"],
            "answer": 1,
            "explanation": "'def' is the correct keyword for defining a function in Python."
        },
        "SQL": {
            "question": "Which SQL statement is used to extract data from a database?",
            "options": ["GET", "OPEN", "EXTRACT", "SELECT"],
            "answer": 3,
            "explanation": "'SELECT' is the standard keyword to query data."
        },
        "Java": {
            "question": "Which of these is NOT a primitive data type in Java?",
            "options": ["int", "String", "boolean", "float"],
            "answer": 1,
            "explanation": "'String' is an object (class) in Java, not a primitive type."
        },
        "GPA": {
            "question": "What is the most effective way to retain information for classes?",
            "options": ["Cramming before exam", "Active recall and spaced repetition", "Highlighting text", "Re-reading notes"],
            "answer": 1,
            "explanation": "Active recall and spaced repetition are proven to be the most effective study techniques."
        }
    }
    return quizzes.get(weakest_skill, None)

def get_groq_response(query, chat_history, context):
    """Calls Groq API to provide AI tutoring based on student context."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        return "⚠️ **Groq API Key missing!** Please add your key to the `.env` file to enable AI Tutoring."
    
    try:
        client = Groq(api_key=api_key)
        
        system_prompt = f"""
        You are an elite AI Career Tutor. Your goal is to help the student achieve their goal of becoming a {context.get('career', 'Professional IT Specialist')}.
        
        Student Context:
        - Career Path: {context.get('career')}
        - Current Weakness being studied: {context.get('top_weakness')}
        - Current GPA: {context.get('skills', {}).get('GPA')}
        
        Guidelines:
        1. Be encouraging, professional, and highly educational.
        2. Use Markdown for formatting (bold, code blocks, bullet points).
        3. If the student asks a technical question (like 'how to install python'), provide clear, step-by-step instructions.
        4. If you mention code, always provide a small, clean code snippet.
        5. Keep responses concise but comprehensive.
        """
        
        # Prepare messages for Groq
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent chat history (limit to last 5 exchanges to save tokens/memory)
        for msg in chat_history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add current query
        messages.append({"role": "user", "content": query})
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
            stream=False
        )
        
        return completion.choices[0].message.content
    except Exception as e:
        return f"❌ **Error calling Groq API:** {str(e)}"

def get_kb_response(query):
    # This was a fallback, we are now using Groq, but keeping it as a backup or for very basic terms.
    # [Internal KB logic omitted for brevity as Groq is preferred]
    return None