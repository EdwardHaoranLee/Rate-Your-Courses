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
        return ['CSC265', 'ABP100', 'ECO200']
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

# Main loop
for course_code in course_list:

    # Connect reddit and download the posts related to this course.
    course_complex = reader.read_course(course_code)

    # Generate the wordcloud.
    wordcloud = WordCloudGenerator()
    wordcloud.generate_wordcloud_dict(course_complex, width=400, height=200)

    # Generate the json piece for this very course.
    course_dict = dict()
    course_dict[course_code] = JSONGenerator().generate_python_dict_one_course(course_complex, top_comments_limit=10)
    j = json.dumps(course_dict)

    # Write in the json piece to destination file
    json_file.write(j)

json_file.close()



