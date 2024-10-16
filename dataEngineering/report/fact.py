import pandas as pd

# Load prepared data
users_df = pd.read_csv('../prep/prepared_users.csv')
courses_df = pd.read_csv('../prep/prepared_courses.csv')
sections_df = pd.read_csv('../prep/prepared_sections.csv')
videos_df = pd.read_csv('../prep/prepared_videos.csv')
quizzes_df = pd.read_csv('../prep/prepared_quizzes.csv')
discussions_df = pd.read_csv('../prep/prepared_discussions.csv')
feedback_df = pd.read_csv('../prep/prepared_feedback.csv')
engagement_summary_df = pd.read_csv('../prep/prepared_engagement_summary.csv')

# Initial fact table from engagement summary
fact_table = engagement_summary_df.copy()

# Check columns in fact_table and courses_df
print("Fact Table Columns: ", fact_table.columns)
print("Courses DataFrame Columns: ", courses_df.columns)

# Ensure courseId is in both fact_table and courses_df
if 'courseId' in fact_table.columns and 'courseId' in courses_df.columns:
    fact_table = fact_table.merge(courses_df[['courseId', 'course_name', 'category']], on='courseId', how='left')
else:
    print("Error: 'courseId' column is missing in one of the dataframes.")

# Add user details (role and department) from users_df
if 'userId' in fact_table.columns and 'userId' in users_df.columns:
    fact_table = fact_table.merge(users_df[['userId', 'role', 'department']], on='userId', how='left')
else:
    print("Error: 'userId' column is missing in one of the dataframes.")

# Merge feedback data if 'userId' and 'feedback' columns are available
if 'userId' in fact_table.columns and 'userId' in feedback_df.columns:
    feedback_summary = feedback_df.groupby('userId').agg(
        total_feedback=('feedback', 'count'),
        latest_feedback_time=('createdAt', 'max')
    ).reset_index()
    
    fact_table = fact_table.merge(feedback_summary[['userId', 'total_feedback', 'latest_feedback_time']], on='userId', how='left')
else:
    print("Error: 'userId' column or 'feedback' data is missing.")

# Final output and save to CSV
fact_table.to_csv('fact_table.csv', index=False)
print("Fact table has been successfully created and saved as 'fact_table.csv'.")
