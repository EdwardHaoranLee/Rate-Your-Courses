from json_generator import *
from wordcloud_generator import *
import course_list_downloader
import os.path
import json

TEST = 0
REAL = 1


def course_list_file_reader(mode) -> List[str]:
    if mode == TEST:
        return ['CSC265', 'ABP100', 'ECO200']
    if mode == REAL:
        course_list_file = open("Database/UofT_course_list.txt", "r")
        return course_list_file.read().split('\n')


if not os.path.exists("Database/UofT_course_list.txt"):
    if not os.path.exists("Database/UofT_courses.html"):
        raise FileNotFoundError
    course_list_downloader.UofT_course_generator_file()

course_list = course_list_file_reader(TEST)

reader = RedditReader('UofT', ['QCoNFSH3HMntdQ',
                               'Wp0hdaBna71vtZ6SDqEgFUGczzk', 'Test'])

json_file = open("Database/database.json", "w")
for course_code in course_list:
    course_complex = reader.read_course(course_code)
    wordcloud = WordCloud_Generator()
    wordcloud.generate_wordcloud_dict(course_complex, width=400, height=200)
    course_dict = dict()
    course_dict[course_code] = JSONGenerator().generate_python_dict_one_course(course_complex, top_comments_limit=10)
    j = json.dumps(course_dict)
    json_file.write(j)
json_file.close()



