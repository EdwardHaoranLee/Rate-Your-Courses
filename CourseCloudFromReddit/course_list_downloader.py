import re
from typing import List, Tuple, Dict
import json


def UofT_course_generator_list_of_str() -> List[str]:
    """This method read from the UofT course calendar by a static html file from
    'https://fas.calendar.utoronto.ca/print/search-courses-print?' and convert
    to a list of string where each string is a course code."""
    path = 'Database/UofT_courses.html'
    html_file = open(path, 'r')
    html_handle = html_file.read()
    index = [m.start() for m in re.finditer('<span class="field-content views-title"><br /><h3>', html_handle)]
    courses = []
    c = len('<span class="field-content views-title"><br /><h3>')
    for i in index:
        courses.append(html_handle[(i+c):(i+c+6)])
    html_file.close()
    return courses


def UofT_course_generator_with_details() -> List[Tuple[str, str, str, str]]:
    """This method read from the UofT course calendar by a static html file from
    'https://fas.calendar.utoronto.ca/print/search-courses-print?' and convert
    to a list of tuple where the first string is course code; the second string
    is course name; the third is its description; the fourth is the number of
    BR."""
    path = 'Database/UofT_courses.html'
    html_file = open(path, 'r')
    html_handle = html_file.read()
    index = [m.start() for m in re.finditer('<div class="views-field views-field-title">', html_handle)]
    # test = [m.start() for m in re.finditer('<div class="views-field views-field-title">        <span class="field-content views-title"><br /><h3>', html_handle)]
    # print(len(index), len(test))
    courses = []
    length = len(index)
    c = len('<div class="views-field views-field-title">        <span class="field-content views-title"><br /><h3>')
    for i in range(length):
        try:
            block = html_handle[index[i]:index[i+1]]
        except IndexError:
            block = html_handle[index[i]:]
        tag = block.find(' </h3></span>  </div>')
        code = block[c:c + 6]
        name = block[c + 11: tag]
        br_index = block.find('Breadth Requirements: </strong>    <span class="field-content">')
        br = ''
        if br_index != -1:
            br = block[br_index + len('Breadth Requirements: </strong>    <span class="field-content">'):]
            br_index_tail = br.find('</span>')
            br = block[br_index + len('Breadth Requirements: </strong>    <span class="field-content">'):br_index + len('Breadth Requirements: </strong>    <span class="field-content">') + br_index_tail]
            br = re.sub("\D", "", br)
        description_index = block.find('<div class="field-content"><p>')
        c1 = len('<div class="field-content"><p>')
        description = ''
        if description_index != -1:
            description = block[description_index + c1:block.find('</p>')]
        courses.append((code, name, description, br))
    html_file.close()
    return courses


def UofT_course_generator_file() -> None:
    """This method is an expansion of UofT_course_generator_list_of_str(). This
    method will generate a file where each line of this file is a course code.
    """
    course_list = UofT_course_generator_list_of_str()
    f = open('Database/UofT_course_list.txt', 'w')
    for i in course_list:
        f.write(i)
        f.write('\n')
    f.close()


def UofT_course_generator_file_with_detail() -> None:
    """This method is an expansion of UofT_course_generator_with_details(). This
    method will generate a csv file where each line is consisting of a course
    code, course name, and its description."""
    course_list = UofT_course_generator_with_details()
    f = open('Database/UofT_course_detail.txt', 'w')
    for i in course_list:
        content = i[0] + '\n' + i[1] + '\n' + i[2] + '\n' + i[3] + '\n\n'
        f.write(content)
    f.close()


def offer_now_courses() -> List[str]:
    """This method returns all the course codes from the preliminary timetable.
    """
    course_list = UofT_course_generator_list_of_str()
    f = open('Database/offer_now_timetable.html', 'r')
    content = f.read()
    result = []
    for i in course_list:
        if i in content:
            result.append(i)
    return result


if __name__ == '__main__':
    print(len(offer_now_courses()))
