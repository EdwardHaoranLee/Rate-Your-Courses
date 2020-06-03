#! usr/bin/env python3
import praw
import pandas as pd
import datetime as dt


# ================================ functions ===============================

def get_date(created):
    return dt.datetime.fromtimestamp(created)


def search_subreddit(sub, keyword):
    return sub.search(keyword, limit=20)


# ============================== other code ==================================


def run(course_code):
    reddit = praw.Reddit(client_id='jMmjs9ls9zytyg',
                         client_secret='LtnpWjI7kyTlhQaxFTD54fACmJQ',
                         user_agent='reddit_scrapper',
                         username='jajajajass',
                         password='Lemonbird230')
    subreddit = reddit.subreddit('UofT')

    search_result = search_subreddit(subreddit, course_code)

    topics_dict = {"title": [], \
                   "score": [], \
                   "id": [], "url": [], \
                   "comms_num": [], \
                   "created": [], \
                   "body": []}

    for submission in search_result:
        topics_dict["title"].append(submission.title)
        topics_dict["score"].append(submission.score)
        topics_dict["id"].append(submission.id)
        topics_dict["url"].append(submission.url)
        topics_dict["comms_num"].append(submission.num_comments)
        topics_dict["created"].append(submission.created)
        topics_dict["body"].append(submission.selftext)

    topics_data = pd.DataFrame(topics_dict)

    _timestamp = topics_data["created"].apply(get_date)
    topics_data = topics_data.assign(timestamp=_timestamp)

    for post_id in topics_dict["id"]:
        # print comments from one post, get post by id
        submission = reddit.submission(id=post_id)
        print('=' * 20 + 'post title' + '=' * 20)
        print(submission.title)
        print('-' * 20 + 'comments below' + '-' * 20)

        for top_level_comment in submission.comments:
            print(top_level_comment.body)
            print('-' * 20)



if __name__ == '__main__':
    while True:
        course = input("Enter a Course Code:   ")
        if True:
            run(course)
        else:
            print("not valid,try again")



