import nltk
from typing import List, Dict

NONSENSE_LIST = ['first', 'much', 'other', 'same', 'last',
                 'sure', 'next', 'i', 'many', 'm',
                 'u', 'second', 'ur', 'own', 's',
                 'pretty']


def delete_punctuation(input: str) -> str:
    return ''.join(e for e in input if e.isalnum())


def to_adjectives(input: str) -> List[str]:
    """This method utilizes nltk and pick out all the adjective in input.
    """
    try:
        sentences = nltk.sent_tokenize(input)
    except TypeError:
        return []

    words = []
    for sent in sentences:
        words = nltk.pos_tag(nltk.word_tokenize(sent))

    adjectives = []
    for i in words:
        if i[1] == 'JJ' or i[1] == 'JJR' or i[1] == 'JJS':
            word = delete_punctuation(i[0])
            word = word.lower()
            if word != '' and 20 >= len(word) >= 5 and word not in NONSENSE_LIST:
                adjectives.append(word)
    return adjectives


def to_all_words(input: str) -> List[str]:
    # try:
    #     sentences = nltk.sent_tokenize(input)
    # except TypeError:
    #     return []

    words = input.split(' ')
    words_result = []
    for word in words:
        word = delete_punctuation(word)
        word = word.lower()
        if word != '' and 20 >= len(word) >= 5 and word not in NONSENSE_LIST:
            words_result.append(word)
    return words_result


def top_words(frequency: Dict[str, int], top: int) -> Dict[str, int]:
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




