import praw
import nltk
nltk.download('wordnet')
from nltk.corpus import wordnet
import wordcloud

def delete_punctuation(input: str) -> str:
    return ''.join(e for e in input if e.isalnum())


redditAgent = praw.Reddit(client_id='QCoNFSH3HMntdQ',
                          client_secret='Wp0hdaBna71vtZ6SDqEgFUGczzk',
                          user_agent='Test')

UofT_subreddit = redditAgent.subreddit('UofT')
MAT137_posts = list(UofT_subreddit.search("MAT137"))
text = MAT137_posts[0].selftext

print(MAT137_posts[0].selftext)


splittedText = text.split()
adjectiveWordList = []
for i in splittedText:
    tmp = wordnet.synsets(i)[0].pos()
    print(i, ":", tmp)
