import re
from typing import List


def UofT_course_generator_list_of_str() -> List[str]:
    path = 'UofT_courses.html'
    html_file = open(path, 'r')
    html_handle = html_file.read()
    index = [m.start() for m in re.finditer('<span class="field-content views-title"><br /><h3>', html_handle)]
    courses = []
    c = len('<span class="field-content views-title"><br /><h3>')
    for i in index:
        courses.append(html_handle[(i+c):(i+c+6)])
    html_file.close()
    return courses


def UofT_course_generator_file() -> None:
    coursr_list = UofT_course_generator_list_of_str()
    f = open('Database/UofT_course_list.txt', 'w')
    for i in coursr_list:
        f.write(i)
        f.write('\n')
    f.close()


if __name__ == '__main__':
    UofT_course_generator_file()
