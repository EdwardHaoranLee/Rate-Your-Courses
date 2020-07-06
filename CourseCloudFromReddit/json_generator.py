from reddit_reader import *


class JSONGenerator:
    def generate_python_dict_one_course(self,
                                        course_complex: CoursePostsComplex,
                                        top_comments_limit=10) -> Dict:
        """This method will take a CoursePostComplex and generate a piece of
        dictionary that can ba convert to json file later. top_comments_limit is
        the number of most upvoted comments about this course."""
        result = dict()
        course = course_complex.course_code
        if course_complex.qualify_for_sentiment_analysis():
            score = course_complex.sentiment_analysis_score()
        else:
            score = -1.0
        top_reviews = course_complex.top_comments(top=top_comments_limit)
        result['wordcloud_path'] = '/Wordcloud_image/' + course + '.png'
        if score != -1.0:
            result['score'] = score * 500
        else:
            result['score'] = 'None'
        result['top_reviews'] = top_reviews
        return result

