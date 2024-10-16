import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Load prepared data
users_df = pd.read_csv('../prep/prepared_users.csv')
courses_df = pd.read_csv('../prep/prepared_courses.csv')
sections_df = pd.read_csv('../prep/prepared_sections.csv')
videos_df = pd.read_csv('../prep/prepared_videos.csv')
quizzes_df = pd.read_csv('../prep/prepared_quizzes.csv')
discussions_df = pd.read_csv('../prep/prepared_discussions.csv')
feedback_df = pd.read_csv('../prep/prepared_feedback.csv')
engagements_df = pd.read_csv('../prep/prepared_engagements.csv')

# Set visual style
sns.set_theme(style="whitegrid")

# Insight 1: Total number of users
total_users = users_df.shape[0]
print(f"Total Number of Users: {total_users}")

# Insight 2: Total number of courses
total_courses = courses_df.shape[0]
print(f"Total Number of Courses: {total_courses}")

# Insight 3: Average engagement score
average_engagement_score = engagements_df['score'].mean()
print(f"Average Engagement Score: {average_engagement_score:.2f}")

# Insight 4: Total feedback entries
total_feedback = feedback_df.shape[0]
print(f"Total Feedback Entries: {total_feedback}")

# Insight 5: Most popular course by engagement
most_popular_course_id = engagements_df.groupby('courseId').agg({'score': 'mean'}).idxmax().iloc[0]
most_popular_course_name = courses_df[courses_df['courseId'] == most_popular_course_id]['course_name'].values[0]
print(f"Most Popular Course (by average engagement score): {most_popular_course_name} (ID: {most_popular_course_id})")

# Insight 6: User with the highest engagement score
highest_engagement_user_id = engagements_df.groupby('userId').agg({'score': 'mean'}).idxmax().iloc[0]
highest_engagement_score = engagements_df.groupby('userId').agg({'score': 'mean'}).max().values[0]  # Extract scalar value
print(f"User with Highest Engagement Score: User ID {highest_engagement_user_id} with a score of {highest_engagement_score:.2f}")

# Insight 7: Course category distribution
plt.figure(figsize=(10, 6))
sns.countplot(data=courses_df, x='category', palette='viridis')  # Added palette
plt.title('Number of Courses by Category')
plt.xlabel('Category')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.savefig('courses_by_category.png')
plt.show()

# Check the columns in feedback_df
print("Columns in feedback_df:", feedback_df.columns)

# Insight 8: Average feedback rating by course
if 'courseId' in feedback_df.columns:
    user_courses_df = engagements_df[['userId', 'courseId']].drop_duplicates()
    feedback_with_courses = feedback_df.merge(user_courses_df, on='userId', how='left')

    # Check for necessary columns
    if 'feedback' in feedback_with_courses.columns and 'courseId' in feedback_with_courses.columns:
        feedback_avg_rating = feedback_with_courses.groupby('courseId').agg({'feedback': 'count'}).reset_index()
        feedback_avg_rating.columns = ['courseId', 'total_feedback_count']
        courses_with_feedback = courses_df.merge(feedback_avg_rating, on='courseId', how='left')

        plt.figure(figsize=(10, 6))
        sns.barplot(data=courses_with_feedback, x='courseId', y='total_feedback_count', palette='viridis', hue='courseId')  # Added hue
        plt.title('Total Feedback Count by Course')
        plt.xlabel('Course ID')
        plt.ylabel('Total Feedback Count')
        plt.xticks(rotation=90)
        plt.savefig('total_feedback_by_course.png')
        plt.show()
    else:
        print("Feedback DataFrame does not contain required columns.")
else:
    print("Feedback DataFrame does not have 'courseId' column.")

# Insight 9: Total time spent on courses
total_time_spent = engagements_df.groupby('courseId').agg({'timeSpent': 'sum'}).reset_index()
total_time_spent.columns = ['courseId', 'total_time_spent']
courses_with_time = courses_df.merge(total_time_spent, on='courseId', how='left')
plt.figure(figsize=(10, 6))
sns.barplot(data=courses_with_time, x='courseId', y='total_time_spent', palette='magma', hue='courseId')  # Added hue
plt.title('Total Time Spent by Course')
plt.xlabel('Course ID')
plt.ylabel('Total Time Spent (minutes)')
plt.xticks(rotation=90)
plt.savefig('total_time_spent_by_course.png')
plt.show()

# Insight 10: Engagement trend over time
if 'createdAt' in engagements_df.columns:
    engagements_df['createdAt'] = pd.to_datetime(engagements_df['createdAt'], errors='coerce')
    engagements_df['date'] = engagements_df['createdAt'].dt.date
    engagement_trend = engagements_df.groupby('date').agg({'score': 'mean', 'timeSpent': 'sum'}).reset_index()

    plt.figure(figsize=(12, 6))
    sns.lineplot(data=engagement_trend, x='date', y='score', label='Average Score', marker='o')
    sns.lineplot(data=engagement_trend, x='date', y='timeSpent', label='Total Time Spent', marker='o')
    plt.title('Engagement Trend Over Time')
    plt.xlabel('Date')
    plt.ylabel('Scores and Time Spent')
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.savefig('engagement_trend.png')
    plt.show()
else:
    print("Engagements DataFrame does not have 'createdAt' column.")

# Insight 11: Course completion rates
completion_threshold = 60
completed_courses = engagements_df[engagements_df['score'] > completion_threshold].groupby('courseId').size()
completion_rate = completed_courses.count() / total_courses * 100
print(f"Course Completion Rate (score > {completion_threshold}): {completion_rate:.2f}%")

# Insight 12: Feedback sentiment analysis
positive_keywords = ['good', 'great', 'excellent', 'love', 'best']
negative_keywords = ['bad', 'poor', 'terrible', 'hate', 'worst']

def sentiment_analysis(feedback):
    if any(keyword in feedback.lower() for keyword in positive_keywords):
        return 'Positive'
    elif any(keyword in feedback.lower() for keyword in negative_keywords):
        return 'Negative'
    return 'Neutral'

feedback_df['sentiment'] = feedback_df['feedback'].apply(sentiment_analysis)

# Sentiment distribution
sentiment_distribution = feedback_df['sentiment'].value_counts()
plt.figure(figsize=(8, 5))
sns.barplot(x=sentiment_distribution.index, y=sentiment_distribution.values, palette='pastel')
plt.title('Feedback Sentiment Distribution')
plt.xlabel('Sentiment')
plt.ylabel('Count')
plt.savefig('feedback_sentiment_distribution.png')
plt.show()

# Summary of insights
print("\nSummary of Insights:")
print(f"- Total Users: {total_users}")
print(f"- Total Courses: {total_courses}")
print(f"- Average Engagement Score: {average_engagement_score:.2f}")
print(f"- Total Feedback Entries: {total_feedback}")
print(f"- Most Popular Course: {most_popular_course_name} (ID: {most_popular_course_id})")
print(f"- User with Highest Engagement Score: User ID {highest_engagement_user_id} with a score of {highest_engagement_score:.2f}")
print(f"- Course Completion Rate (score > {completion_threshold}): {completion_rate:.2f}%")

print("Enhanced reports generated successfully and saved as images.")
