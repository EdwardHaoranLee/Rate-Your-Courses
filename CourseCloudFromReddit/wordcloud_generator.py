from wordcloud import WordCloud
from reddit_reader import *
import random


class WordCloudGenerator:
    def generate_wordcloud_dict(self, course_complex: CoursePostsComplex,
                                width=400, height=200) -> None:
        """This method will draw the wordcloud picture with given course
        complex. This method will utilize the frequency from
        WordFrequencyGenerator to generate the needed information."""
        keyword = course_complex.course_code
        g = WordFrequencyGenerator(keyword)
        content = g.generate_noun_adjective_frequency(
            course_complex.convert_to_string())
        if content == {}:
            content['No post found for this course.'] = 1
        wc = WordCloud(
            background_color="white", collocations=False,
            width=width, height=height, relative_scaling=0,
                        ).generate_from_frequencies(content)
        wc.to_file('Wordcloud_image/' + keyword + '.png')


if __name__ == "__main__":
    reader = RedditReader('UofT', ['QCoNFSH3HMntdQ',
                                   'Wp0hdaBna71vtZ6SDqEgFUGczzk', 'Test'])
    courses = ['ABP100', 'CSC265', 'ECO200', 'ENV205', 'MAT235', 'PSY100']
    for i in courses:
        c = reader.read_course(i)
        wg = WordCloudGenerator()
        wg.generate_wordcloud_dict(c)

