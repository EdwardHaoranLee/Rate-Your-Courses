from wordcloud import WordCloud
from reddit_reader import *


class WordCloud_Generator:
    def generate_wordcloud_dict(self, course_complex: CoursePostsComplex, width=400, height=200) -> None:
        keyword = course_complex.course_code
        g = WordFrequencyGenerator(keyword)
        content = g.generate_noun_adjective_frequency(
            course_complex.convert_to_string())
        if content == {}:
            content['No post found for this course.'] = 1
        wc = WordCloud(background_color="white", collocations=False, width=width, height=height, relative_scaling=1).generate_from_frequencies(content)
        wc.to_file('Wordcloud_image/' + keyword + '.png')


if __name__ == '__main__':
    reader = RedditReader('UofT', ['QCoNFSH3HMntdQ',
                                   'Wp0hdaBna71vtZ6SDqEgFUGczzk', 'Test'])
    courses = ['ECO101', 'ECO105']
    WCGenerator = WordCloud_Generator()
    for i in courses:
        c = reader.read_course(i)
        generator = WordFrequencyGenerator(i)
        result = generator.generate_noun_adjective_frequency(
            c.convert_to_string())
        # WCGenerator.generate_wordcloud_dict(i, result)
