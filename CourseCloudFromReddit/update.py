from json_generator import *
from wordcloud_generator import *
import course_list_downloader
import os.path
import time

TEST = 0  # for use in test with a few courses
REAL = 1  # for use in constructing the website
OFFER_NOW = 3  # for use when only offer-now courses are analyzed

time_start = time.time()


def course_list_file_reader(mode) -> List[str]:
    """Generate list of course based on mode."""
    if mode == TEST:
        return ['VIC275']
        # return ['CSC265', 'ABP100', 'ECO200', 'MAT235', 'PSY100', 'ENV200']
    if mode == REAL:
        # course_list_file = open("Database/UofT_course_list.txt", "r")
        # course_list_file.close()
        # return course_list_file.read().split('\n')
        return course_list_downloader.UofT_course_generator_list_of_str()
    if mode == OFFER_NOW:
        return course_list_downloader.offer_now_courses()


def course_detail_content_generator() -> Dict[str, Tuple[str, str, str]]:
    """Read from file and generate a dictionary where the key is the course,
    the value is a list of two strings, where the first string is course name
    and the second is description."""
    file = open("Database/UofT_course_detail.txt", "r")
    content = file.read()
    each_courses = content.split('\n\n')
    result = dict()
    for i in each_courses:
        course = i.split('\n')
        if len(course) >= 2 and course[1].isalnum():
            result[course[0]] = ('', '', course[1])
        elif len(course) >= 3 and course[2].isalnum():
            result[course[0]] = (course[1], '', course[2])
        elif len(course) == 4 and course[3].isalnum():
            result[course[0]] = (course[1], course[2], course[3])
        else:
            result[course[0]] = ('', '', '')
        # except IndexError:
        #     try:
        #         result[course[0]] = (course[1], '', )
        #     except IndexError:
        #         result[course[0]] = ('', '')
    file.close()
    return result


# Check if the course calendar file exists.
if not os.path.exists("Database/UofT_course_list.txt"):
    if not os.path.exists("Database/UofT_courses.html"):
        raise FileNotFoundError
    course_list_downloader.UofT_course_generator_file()

# Load the course list.
course_list = course_list_file_reader(REAL)

# Load the course content file.
course_content = course_detail_content_generator()

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
    print("Working on the " + course_code + "...\t\t", end='')

    # Start to time it
    start = time.time()

    # Generate the name and description of the course
    try:
        content = course_content[course_code]
    except KeyError:
        print()
        continue

    # Connect reddit and download the posts related to this course.
    course_complex = reader.read_course(course_code)

    # Generate the heat of this course.
    heat = course_complex.course_heat()

    # Generate the wordcloud.
    wordcloud = WordCloudGenerator()
    wordcloud.generate_wordcloud_dict(course_complex, width=1200, height=600)

    # Generate the json piece for this very course.
    course_dict = JSONGenerator().generate_python_dict_one_course(
        course_complex, top_comments_limit=20)
    top_reviews = '['
    reviews = course_dict['top_reviews']
    if reviews:
        top_reviews = "[\n\t\t\t\t[\"" + reviews[0][2].replace('\n',
                                                               '\\n').replace(
            '"', '\\"').replace('\\[', '[').replace('\\]', ']') + \
                      "\",\"" + reviews[0][0].replace('\n', '\\n').replace('"',
                                                                           '\\"').replace(
            '\\[', '[').replace('\\]', ']') + \
                      "\",\"" + reviews[0][1] + "\"]"
        reviews.pop(0)
    for i in reviews:
        s = ",\n\t\t\t\t[\"" + i[2].replace('\n', '\\n').replace('"',
                                                                 '\\"').replace(
            '\\[', '[').replace('\\]', ']') + \
            "\",\"" + i[0].replace('\n', '\\n').replace('"', '\\"').replace(
            '\\[', '[').replace('\\]', ']') + \
            "\",\"" + i[1] + "\"]"
        top_reviews = top_reviews + s
    top_reviews = top_reviews + ']'
    j = "\n\t\"" + course_code + "\":\n\t\t{\n\t\t\t\"cloud_path\":\"" + \
        course_dict['wordcloud_path'] + "\",\n" + "\t\t\t\"name\":\"" + \
        content[0] + "\",\n\t\t\t\"description\":\"" + content[1] + \
        "\",\n\t\t\t\"br_category\":\"" + content[2] + \
        "\",\n\t\t\t\"score\":\"" + str(course_dict['score']) + \
        "\",\n\t\t\t\"heat\":\"" + str(heat) + \
        "\",\n\t\t\t\"top_review\":" + top_reviews + "\n\t\t}"
    if last_course != course_code:
        j = j + ','

    # Write in the json piece to destination file
    json_file.write(j)

    end = time.time()
    print("Finished in " + "%5.2f" % (end - start) + "s.")

json_file.write("\n}")
json_file.close()

time_end = time.time()
print("Total time: " + str(round(time_end - time_start, 2)) + "s.")
