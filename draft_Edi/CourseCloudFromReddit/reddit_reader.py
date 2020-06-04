import praw
from typing import Tuple, TextIO, List, Any, Dict
import word_categorizer


def read_config(config: TextIO) -> Tuple[str, List[str], List[str]]:
    """
    :param config: the configuration file
    :return: this method will return three parts: school name (subreddit name),
    the list of course code, and the list of reddit agent certification
    information.
    """
    pass


def comment_forest_to_str_list(comment_forest) -> List[str]:
    """Convert comment_forest to list of comment in string."""
    raw_comments = comment_forest.list()
    string_comments = []
    for comment in raw_comments:
        try:
            string_comments.append(comment.body)
        except AttributeError:
            string_comments.extend(comment.comments())
    return string_comments


class CoursePost:
    """The class of a single post about a course in a subreddit.
    """
    course_code: str
    subreddit_name: str
    id: str
    title: str
    self_text: str
    comments: List[str]
    num_upvotes: int
    upvote_ratio: float

    def __init__(self, course_code: str, subreddit_name: str, id: str,
                 title: str, self_text: str, comments: List[str], upvotes: int,
                 upvote_ratio: float):
        self.course_code = course_code
        self.subreddit_name = subreddit_name
        self.id = id
        self.title = title
        self.self_text = self_text
        self.comments = comments
        self.num_upvotes = upvotes
        self.upvote_ratio = upvote_ratio

    def __str__(self) -> str:
        return ' course: {} \n subreddit: {} \n id: {} \n title: {} \n ' \
               'text: {} \n comment: {} \n upvotes: {}'.format\
            (self.course_code, self.subreddit_name, self.id, self.title,
             self.self_text, self.comments, self.num_upvotes)

    def to_adjectives(self) -> List[str]:
        """This method utilizes nltk and pick out all the adjective in title,
        self_text and comments."""
        adjectives = []
        adjectives.extend(word_categorizer.to_adjectives(self.title))
        adjectives.extend(word_categorizer.to_adjectives(self.self_text))
        for comment in self.comments:
            adjectives.extend(word_categorizer.to_adjectives(comment))
        return adjectives


class CoursePostsComplex:
    """The class of all the information about a course in a subreddit.
    """

    course_code: str
    subreddit_name: str
    posts: List[CoursePost]

    def __init__(self, course_code: str, subreddit_name: str):
        self.course_code = course_code
        self.subreddit_name = subreddit_name
        self.posts = []

    def add_post(self, post: CoursePost) -> None:
        self.posts.append(post)

    def __str__(self) -> str:
        doc = ''
        for post in self.posts:
            doc += '\n\n * * * * * \n\n'
            doc += str(post)
        doc += '\n\n ******************************'
        return doc

    def to_adjectives(self) -> List[str]:
        """This method utilizes nltk and pick out all the adjective in title,
        self_text and comments of each post."""
        adjectives = []
        for post in self.posts:
            adjectives.extend(post.to_adjectives())
        return adjectives


class RedditReader:
    """The class that use praw library to gather raw data from reddit.com.
    """

    subreddit_name: str
    _course_list: List[str]
    _agent: praw.reddit.Reddit
    _subreddit: praw.reddit.models.subreddits.Subreddit

    def __init__(self, subreddit_name: str, course_list: List[str],
                 agent: List[str]) -> None:
        """Create a new RedditReader class with the name of subreddit, the list
        of courses, and the agent certification information."""
        self.subreddit_name = subreddit_name
        self._course_list = course_list.copy()
        self._agent = praw.Reddit(client_id=agent[0],
                                  client_secret=agent[1],
                                  user_agent=agent[2])
        self._subreddit = self._agent.subreddit(subreddit_name)

    def read(self, course_code: str, limit=1000) -> CoursePostsComplex:
        """Search the subreddit with the keyword <course_code>, and convert the
        search result to CoursePostsComplex."""
        allPosts = CoursePostsComplex(course_code, self.subreddit_name)
        search_result = list(self._subreddit.search(course_code, limit=limit))
        for post in search_result:
            comments = comment_forest_to_str_list(post.comments)
            course_post = CoursePost(course_code, self.subreddit_name, post.id,
                                     post.title, post.selftext, comments,
                                     post.score, post.upvote_ratio)
            allPosts.add_post(course_post)
        return allPosts

    def read_all(self, limit=1000) -> List[CoursePostsComplex]:
        """Search the subreddit with all the course codes, and convert all
        search result to a list of CoursePostsComplex."""
        posts_complex = []
        for code in self._course_list:
            posts_complex.append(self.read(code, limit))
        return posts_complex

    def to_adjectives(self, limit=1000) -> Dict[str, List[str]]:
        """This method utilizes nltk and pick out all the adjective in title,
        self_text and comments of each post of each course."""
        adjectives = dict()
        complexs = self.read_all(limit)
        for posts_complex in complexs:
            adjectives[posts_complex.course_code] = \
                posts_complex.to_adjectives()
        return adjectives

    def adjective_frequency(self, limit=1000) -> Dict[str, Dict[str, int]]:
        """Sum the frequency of adjectives for each course."""
        all_adjectives = self.to_adjectives(limit)
        frequencies = dict()
        for course in self._course_list:
            adjectives = all_adjectives[course]
            frequency = dict()
            for adjective in adjectives:
                frequency[adjective] = adjectives.count(adjective)
            frequencies[course] = frequency
        return frequencies


reader = RedditReader('UofT', ['MAT235', 'MAT237', 'MAT257',
                               'ECO200', 'ECO204', 'ECO206'],
                      ['QCoNFSH3HMntdQ','Wp0hdaBna71vtZ6SDqEgFUGczzk','Test'])
frequency = reader.adjective_frequency(limit=500)
for i in frequency:
    print(i)
    print(word_categorizer.top_adjectives(frequency[i], 50))
    print('\n\n')


