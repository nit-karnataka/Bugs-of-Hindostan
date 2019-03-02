import urllib.request, json
import requests
import sys
def relevantWord(keyword):
    a = keyword + ""
    keyword = a.replace(' ','%20')
    page = "https://relatedwords.org/api/related?term=" + keyword


    r = requests.get(page)
    
    result = r.json()
    word_list = []
    score_list = []
    text = ""
    for i in range(10):
        word_list.append(result[i]["word"])
        score_list.append(result[i]["score"])
        text = text + ', ' + (result[i]["word"])
    return text

word = sys.argv[1]
result = relevantWord(word)
print(result)
