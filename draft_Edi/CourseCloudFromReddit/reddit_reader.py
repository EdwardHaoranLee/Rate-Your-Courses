import nltk
import praw
from typing import Tuple, TextIO, List, Dict
from nltk.corpus import stopwords
from nltk.probability import FreqDist

NONSENSE_LIST = ['first', 'much', 'other', 'same', 'last',
                 'sure', 'next', 'i', 'many', 'm',
                 'u', 'second', 'ur', 'own', 's',
                 'pretty', 'course', 'of the', 'get', 'year',
                 'would', 'in the', 'take', 'one', 'really',
                 'like', 'i\'m', 'courses', 'also', 'you can',
                 'n\'t', '\'', '*', ]


def read_config(config: TextIO) -> Tuple[str, List[str], List[str]]:
    """
    :param config: the configuration file
    :return: this method will return three parts: school name (subreddit name),
    the list of course code, and the list of reddit agent certification
    information.
    """
    pass


def comment_forest_to_str_list(comment_forest) -> List[str]:
    """Convert comment_forest to list of comment in string.

    CommentForest is a class that defined in praw library. It represents all the
    comments below a post and it is in a form of tree.
    """
    raw_comments = comment_forest.list()
    string_comments = []
    for comment in raw_comments:
        try:
            string_comments.append(comment.body)
        except AttributeError:
            c = comment.comments()
            for i in c:
                string_comments.append(i.body)
    return string_comments


def convert_one_post_to_strings(post: praw.reddit.models.Submission) -> str:
    """Extract all text in a post, including title, text and comments,
    concatenate them into a single str."""
    title = post.title
    text = post.selftext
    comments = comment_forest_to_str_list(post.comments)
    result = ' '.join(comments)
    result = result + title
    result = result + text
    result = result.lower()
    return result


class CoursePostsComplex:
    """The class contains all the information about a course in a subreddit.
    """
    course_code: str
    _subreddit: praw.reddit.models.subreddits.Subreddit
    _posts: List[praw.reddit.models.Submission]

    def __init__(self, course_code: str,
                 subreddit: praw.reddit.models.subreddits.Subreddit):
        self.course_code = course_code
        self._subreddit = subreddit
        self._posts = []

    def append(self, post: praw.reddit.Submission) -> None:
        """Append a post to this complex."""
        self._posts.append(post)

    def convert_to_string(self) -> str:
        """Extract all the text from posts in <self.posts> and return as a
        single str."""
        texts = []
        for i in self._posts:
            texts.append(convert_one_post_to_strings(i))
        return ' '.join(texts)

    def get_subreddit_name(self) -> str:
        return self._subreddit.display_name


class RedditReader:

    subreddit_name: str
    _agent: praw.reddit.Reddit
    _subreddit: praw.reddit.models.subreddits.Subreddit

    def __init__(self, subreddit_name: str, agent: List[str]) -> None:
        """Create a new RedditReader class with the name of subreddit, the list
        of courses, and the agent certification information."""
        self.subreddit_name = subreddit_name
        self._agent = praw.Reddit(client_id=agent[0],
                                  client_secret=agent[1],
                                  user_agent=agent[2])
        self._subreddit = self._agent.subreddit(subreddit_name)

    def read_course(self, course_code: str, limit=100) -> CoursePostsComplex:
        """Search the subreddit with the keyword <course_code>, and convert the
        search result to CoursePostsComplex."""
        course_post_complex = CoursePostsComplex(course_code, self._subreddit)
        search_result = list(self._subreddit.search(course_code, limit=limit))
        for post in search_result:
            course_post_complex.append(post)
        # print("Course " + course_code + " in subreddit " +
        #       self._subreddit.display_name + " has been successfully read.")
        return course_post_complex


class WordFrequencyGenerator:
    """This class is a usage class which contains several methods of handling
    string data and convert them to frequency.
    """

    _keyword: str

    def __init__(self, key_word: str) -> None:
        self._keyword = key_word

    def noun_adjective_filter(self, content: str) -> List[str]:
        """This method is used to filter all the nouns and adjectives in
        <content> and return these words."""
        try:
            sentences = nltk.sent_tokenize(content)
        except TypeError:
            return []

        result = []
        for sent in sentences:
            words = nltk.pos_tag(nltk.word_tokenize(sent))
            for i in words:
                if i[1] in ['JJ', 'JJR', 'JJS',
                            'RB', 'RBR', 'RBS',
                            'NN', 'NNS', 'NNP', 'NNPS'] and i[0].isalnum():
                    result.append(i[0])
        return result

    def generate_phrases(self, content: str) -> List[str]:
        """This method is to generate phrases in single word, two words and
        three words from words in <content>

        >>> g = WordFrequencyGenerator('test')
        >>> test_text = "Some ice people want to eat ice cream"
        >>> test_result = g.generate_phrases(test_text)
        >>> test_result
        ['Some', 'Some ice', 'Some ice people', 'ice', 'ice people', 'ice people want', 'people', 'people want', 'people want to', 'want', 'want to', 'want to eat', 'to', 'to eat', 'to eat ice', 'eat', 'eat ice', 'eat ice cream', 'ice', 'ice cream', 'cream']
        """
        origin = content.split()
        origin_length = len(origin)
        result = []
        for i in range(origin_length):
            result.append(origin[i])
            try:
                result.append(origin[i] + ' ' + origin[i + 1])
            except IndexError:
                pass
            try:
                result.append(origin[i] + ' ' + origin[i + 1]
                              + ' ' + origin[i + 2])
            except IndexError:
                pass
        return result

    def generate_noun_adjective_frequency(self, content: str) -> Dict:
        """This method returns the frequency of nouns and adjective in <content>
        in a form of dictionary.

        >>> g = WordFrequencyGenerator('test')
        >>> test_text = "Some ice people want to eat ice cream"
        >>> test_result = g.generate_noun_adjective_frequency(test_text)
        >>> test_result
        {'ice': 2, 'people': 1, 'cream': 1}
        """
        tokens = self.noun_adjective_filter(content)
        clear_tokens = tokens[:]
        sr = stopwords.words('english')
        for token in tokens:
            if token in sr or \
                    token in NONSENSE_LIST or \
                    token in self._keyword.lower():
                clear_tokens.remove(token)
        freq = FreqDist(clear_tokens)
        return dict(freq)

    def top_words(self, frequency: Dict[str, int], top: int) -> Dict[str, int]:
        """This method returns the words which have the most occurrence from
        frequency.

        >>> g = WordFrequencyGenerator('test')
        >>> test_text = "Some ice people want to eat ice cream"
        >>> test_result = g.generate_noun_adjective_frequency(test_text)
        >>> g.top_words(test_result, 1)
        {'ice': 2}
        """
        copy = frequency.copy()
        tops = dict()
        for i in range(top):
            m = max(copy.values())
            for key, value in copy.items():
                if value == m and len(tops) < top:
                    tops[key] = value
                    copy[key] = 0
                    i += 1
        return tops


if __name__ == "__main__":
    reader = RedditReader('UofT', ['QCoNFSH3HMntdQ',
                                   'Wp0hdaBna71vtZ6SDqEgFUGczzk', 'Test'])
    courses = ['CSC373', 'FSL100']
    for i in courses:
        c = reader.read_course(i)
        generator = WordFrequencyGenerator(i)
        result = generator.generate_noun_adjective_frequency(c.convert_to_string())
        print(i)
        print(generator.top_words(result, 100))

    # test_str = "What are y'all opinions on both or either of the courses? Both are required for Cogsci but for different streams and I don't know which stream to do yet because these PHL courses are throwing me off a bit."
    # test_g = WordFrequencyGenerator("test")
    # test_result = test_g.generate_word_frequency(test_str)
    # print(test_g.top_words(test_result, 5))
