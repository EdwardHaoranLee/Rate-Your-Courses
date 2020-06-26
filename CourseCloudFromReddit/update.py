from json_generator import *
from wordcloud_generator import *
import course_list_downloader
import os.path
import json

TEST = 0  # for use in test with a few courses
REAL = 1  # for use in constructing the website


def course_list_file_reader(mode) -> List[str]:
    """Generate list of course based on mode."""
    if mode == TEST:
        return ['CSC265', 'ABP100', 'ECO200', 'MAT235', 'PSY100', 'ENV205']
    if mode == REAL:
        course_list_file = open("Database/UofT_course_list.txt", "r")
        return course_list_file.read().split('\n')


# Check if the course calendar file exists.
if not os.path.exists("Database/UofT_course_list.txt"):
    if not os.path.exists("Database/UofT_courses.html"):
        raise FileNotFoundError
    course_list_downloader.UofT_course_generator_file()

# Load the course list.
course_list = course_list_file_reader(TEST)

# Authorization
reader = RedditReader('UofT', ['QCoNFSH3HMntdQ',
                               'Wp0hdaBna71vtZ6SDqEgFUGczzk', 'Test'])

# Open the destination json file
json_file = open("Database/database.json", "w")
json_file.write("{")

# Main loop
last_course = course_list[len(course_list) - 1]
for course_code in course_list:

    # Console status update
    print("Working on the " + course_code + "...")

    # Connect reddit and download the posts related to this course.
    course_complex = reader.read_course(course_code)

    # Generate the wordcloud.
    wordcloud = WordCloudGenerator()
    wordcloud.generate_wordcloud_dict(course_complex, width=1200, height=600)

    # Generate the json piece for this very course.
    course_dict = JSONGenerator().generate_python_dict_one_course(course_complex, top_comments_limit=10)
    top_reviews = '['
    reviews = course_dict['top_reviews']
    if reviews:
        top_reviews = "[\n\t\t\t\t[\"" + \
                      reviews[0][0].replace('\n', '\\n').replace('"', '\\"') + \
                      "\",\"" + reviews[0][1] + "\"]"
        reviews.pop(0)
    for i in reviews:
        s = ",\n\t\t\t\t[\"" + i[0].replace('\n', '\\n').replace('"', '\\"') + \
            "\",\"" + i[1] + "\"]"
        top_reviews = top_reviews + s
    top_reviews = top_reviews + ']'
    j = "\n\t\"" + course_code + "\":\n\t\t{\n\t\t\t\"cloud_path\":\"" + \
        course_dict['wordcloud_path'] + "\",\n\t\t\t\"score\":\"" + \
        str(course_dict['score'] * 100) + "\",\n\t\t\t\"top_review\":" + \
        top_reviews + "\n\t\t}"
    if last_course != course_code:
        j = j + ','

    # Write in the json piece to destination file
    json_file.write(j)

json_file.write("\n}")
json_file.close()



