import pandas as pd
from faker import Faker
import random

# Create Faker instance
fake = Faker()

# Generate fake data for users
users_list = []
for i in range(200):  # Generate 200 fake users
    users_list.append({
        'userId': i + 1,
        'name': fake.name(),
        'email': fake.email(),
        'password': fake.password(),
        'role': random.choice(['user', 'admin']),
        'department': random.choice(['Data Science', 'Data Engineering', 'Full-Stack', 'Testing', 'Devops', 'Consultancy']),
    })

# Generate fake data for courses
courses_list = []
for i in range(100):  # Generate 100 fake courses
    courses_list.append({
        'courseId': i + 1,
        'course_name': fake.sentence(nb_words=4),  # Random course name
        'course_details': fake.text(max_nb_chars=200),  # Random course details
        'author': fake.name(),
        'level': random.choice(['Beginner', 'Intermediate', 'Advanced']),
        'category': random.choice(['fullstack', 'data engineering', 'data science', 'gen AI']),
        'course_img': fake.image_url(),
        'author_img': fake.image_url(),
        'discussions': [],  # Start with no discussions
        'feedbacks': [],    # Start with no feedbacks
    })

# Generate fake data for sections
sections_list = []
for i in range(100):  # Generate 100 sections (you can adjust as needed)
    sections_list.append({
        'section_name': fake.word().capitalize() + " Section",
        'section_text': fake.text(max_nb_chars=200),
        'video_ids': [],  # Start with no video IDs
        'quiz_ids': [],   # Start with no quiz IDs
    })

# Generate fake data for videos
videos_list = []
for i in range(50):  # Generate 50 videos
    videos_list.append({
        'video_url': fake.url(),
        'video_title': fake.sentence(nb_words=4),
    })

# Generate fake data for quizzes
quizzes_list = []
for i in range(30):  # Generate 30 quizzes
    questions = []
    for j in range(random.randint(3, 5)):  # Each quiz has 3 to 5 questions
        questions.append({
            'question_text': fake.sentence(nb_words=6),
            'options': [fake.word() for _ in range(4)],  # 4 options per question
            'correct_answer': random.randint(0, 3),  # Random index for correct answer
        })
    quizzes_list.append({
        'quiz_title': fake.sentence(nb_words=3),
        'questions': questions,
    })

# Generate fake data for discussions
discussions_list = []
for i in range(300):  # Generate 300 discussions
    discussions_list.append({
        'courseId': random.randint(1, 100),  # Random courseId from existing courses
        'userId': random.randint(1, 200),    # Random userId from existing users
        'message': fake.sentence(),
        'createdAt': fake.date_time_this_year(),
    })

# Generate fake data for feedback
feedback_list = []
for i in range(1000):  # Generate 1000 fake feedback entries
    feedback_list.append({
        'userId': random.randint(1, 200),  # Random userId from existing users
        'feedback': fake.text(max_nb_chars=100),
        'createdAt': fake.date_time_this_year(),
    })

# Generate fake data for course engagements
engagements_list = []
for i in range(3000):  # Generate 3000 fake course engagement entries
    engagements_list.append({
        'userId': random.randint(1, 200),  # Random userId from existing users
        'courseId': random.randint(1, 100),  # Random courseId from existing courses
        'score': random.randint(0, 100),  # Score between 0 and 100
        'timeSpent': random.randint(0, 240),  # Time spent between 0 and 240 minutes
    })

# Create DataFrames for each collection
users_df = pd.DataFrame(users_list)
courses_df = pd.DataFrame(courses_list)
sections_df = pd.DataFrame(sections_list)
videos_df = pd.DataFrame(videos_list)
quizzes_df = pd.DataFrame(quizzes_list)
discussions_df = pd.DataFrame(discussions_list)
feedback_df = pd.DataFrame(feedback_list)
engagements_df = pd.DataFrame(engagements_list)

# Save DataFrames to CSV files
users_df.to_csv('raw_users.csv', index=False)
courses_df.to_csv('raw_courses.csv', index=False)
sections_df.to_csv('raw_sections.csv', index=False)
videos_df.to_csv('raw_videos.csv', index=False)
quizzes_df.to_csv('raw_quizzes.csv', index=False)
discussions_df.to_csv('raw_discussions.csv', index=False)
feedback_df.to_csv('raw_feedback.csv', index=False)
engagements_df.to_csv('raw_engagements.csv', index=False)

print("CSV files with thousands of records created successfully.")
