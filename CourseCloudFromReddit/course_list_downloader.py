import re
from typing import List


def UofT_course_generator_list_of_str() -> List[str]:
    """This method read from the UofT course calendar by a static html file from
    'https://fas.calendar.utoronto.ca/print/search-courses-print?' and convert
    to a list of string where each string is a course code."""
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
    """This method is an expansion of the one above. This method will generate a
    file where each line of this file is a course code."""
    coursr_list = UofT_course_generator_list_of_str()
    f = open('Database/UofT_course_list.txt', 'w')
    for i in coursr_list:
        f.write(i)
        f.write('\n')
    f.close()
