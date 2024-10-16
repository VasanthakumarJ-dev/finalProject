import pandas as pd

# Load your raw data
users_df = pd.read_csv('../raw/raw_users.csv')
courses_df = pd.read_csv('../raw/raw_courses.csv')
sections_df = pd.read_csv('../raw/raw_sections.csv')
videos_df = pd.read_csv('../raw/raw_videos.csv')
quizzes_df = pd.read_csv('../raw/raw_quizzes.csv')
discussions_df = pd.read_csv('../raw/raw_discussions.csv')
feedback_df = pd.read_csv('../raw/raw_feedback.csv')
engagements_df = pd.read_csv('../raw/raw_engagements.csv')

# Data Preparation Functions

def clean_users(users_df):
    # Remove duplicates
    users_df.drop_duplicates(subset='email', keep='first', inplace=True)
    
    # Handle missing values (if any)
    users_df['role'].fillna('user', inplace=True)
    
    # Standardize department names
    users_df['department'] = users_df['department'].str.lower()
    
    return users_df

def clean_courses(courses_df):
    # Remove duplicates
    courses_df.drop_duplicates(subset='course_name', keep='first', inplace=True)

    # Handle missing values (e.g., fill missing authors)
    courses_df['author'].fillna('Unknown', inplace=True)

    # Standardize category names
    courses_df['category'] = courses_df['category'].str.lower()

    return courses_df

def clean_sections(sections_df):
    # Remove duplicates
    sections_df.drop_duplicates(inplace=True)

    return sections_df

def clean_videos(videos_df):
    # Remove duplicates
    videos_df.drop_duplicates(subset='video_url', keep='first', inplace=True)

    return videos_df

def clean_quizzes(quizzes_df):
    # Remove duplicates
    quizzes_df.drop_duplicates(subset='quiz_title', keep='first', inplace=True)

    return quizzes_df

def clean_discussions(discussions_df):
    # Remove duplicates
    discussions_df.drop_duplicates(inplace=True)

    return discussions_df

def clean_feedback(feedback_df):
    # Remove duplicates
    feedback_df.drop_duplicates(inplace=True)

    # Handle missing values: fill missing feedback with 'No feedback provided'
    feedback_df['feedback'].fillna('No feedback provided', inplace=True)

    return feedback_df

def clean_engagements(engagements_df):
    # Remove duplicates
    engagements_df.drop_duplicates(inplace=True)

    # Handle missing values: set timeSpent and score to 0 if missing
    engagements_df['timeSpent'].fillna(0, inplace=True)
    engagements_df['score'].fillna(0, inplace=True)

    return engagements_df

def aggregate_feedback(feedback_df):
    # Aggregate feedback by user
    feedback_summary = feedback_df.groupby('userId').agg(
        total_feedback=('feedback', 'count'),
        latest_feedback_time=('createdAt', 'max')
    ).reset_index()

    return feedback_summary

def aggregate_engagements(engagements_df):
    # Aggregate engagements by user
    engagement_summary = engagements_df.groupby('userId').agg(
        total_courses_completed=('courseId', 'nunique'),
        total_time_spent=('timeSpent', 'sum'),
        average_score=('score', 'mean')
    ).reset_index()

    return engagement_summary

# Clean the data
cleaned_users_df = clean_users(users_df)
cleaned_courses_df = clean_courses(courses_df)
cleaned_sections_df = clean_sections(sections_df)
cleaned_videos_df = clean_videos(videos_df)
cleaned_quizzes_df = clean_quizzes(quizzes_df)
cleaned_discussions_df = clean_discussions(discussions_df)
cleaned_feedback_df = clean_feedback(feedback_df)
cleaned_engagements_df = clean_engagements(engagements_df)

# Aggregate data
feedback_summary = aggregate_feedback(cleaned_feedback_df)
engagement_summary = aggregate_engagements(cleaned_engagements_df)

# Save prepared data to new CSV files
cleaned_users_df.to_csv('prepared_users.csv', index=False)
cleaned_courses_df.to_csv('prepared_courses.csv', index=False)
cleaned_sections_df.to_csv('prepared_sections.csv', index=False)
cleaned_videos_df.to_csv('prepared_videos.csv', index=False)
cleaned_quizzes_df.to_csv('prepared_quizzes.csv', index=False)
cleaned_discussions_df.to_csv('prepared_discussions.csv', index=False)
cleaned_feedback_df.to_csv('prepared_feedback.csv', index=False)
cleaned_engagements_df.to_csv('prepared_engagements.csv', index=False)
feedback_summary.to_csv('prepared_feedback_summary.csv', index=False)
engagement_summary.to_csv('prepared_engagement_summary.csv', index=False)

print("Data preparation completed and files saved.")
