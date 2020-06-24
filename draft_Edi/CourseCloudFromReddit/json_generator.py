from reddit_reader import *
import json


class JSONGenerator:
    def generate_python_dict_one_course(self,
                                        course_complex: CoursePostsComplex,
                                        top_comments_limit=10) -> Dict:
        result = dict()
        course = course_complex.course_code
        if course_complex.qualify_for_sentiment_analysis():
            score = course_complex.sentiment_analysis_score()
        else:
            score = -1.0
        top_reviews = course_complex.top_comments(top_comments_limit)
        result['wordcloud_path'] = 'Wordcloud_image/' + course + '.txt'
        result['score'] = score
        result['top_reviews'] = top_reviews
        # j = json.dumps(result)
        return result

    # def generate_json_file(self, reader: RedditReader, courses: List[str]) -> Dict[str, Dict]:
    #     result = dict()
    #     for course in courses:
    #         course_complex = reader.read_course(course)
    #         if course_complex.qualify_for_sentiment_analysis():
    #             course_score = course_complex.sentiment_analysis_score()
    #         else:
    #             course_score = -1.0
    #         top_reviews = course_complex.top_comments()
    #         dict_course = self.generate_python_dict_one_course(course, course_score, top_reviews)
    #         result[course] = dict_course
    #     return result
