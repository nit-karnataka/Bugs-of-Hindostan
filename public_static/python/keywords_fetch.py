import urllib.request, json
import requests
def scrape(keyword):
    a = keyword + ""
    keyword = a.replace(' ','%20')
    page = "https://relatedwords.org/api/related?term=" + keyword
    r = requests.get(page)
    
    result = r.json()
    word_list = []
    score_list = []
    for i in range(100):
        word_list.append(result[i]["word"])
        score_list.append(result[i]["score"])
    
    return word_list,score_list
    


# In[209]:


word_list,score_list = scrape("kidney")


# In[220]:


def scrapeList(list_of_words):
    size = len(list_of_words)
    words = []
    scores = []
    for i in range(size):
        word_list,score_list = scrape(list_of_words[i])
        words.append(word_list)
        scores.append(score_list)
    
    return words,scores


# In[227]:


words,score = scrapeList(["endothelial","kidney","kidney stone"])
print(words,score)


# In[210]:


print(word_list)


# In[208]:


print(score_list)


# In[ ]:




