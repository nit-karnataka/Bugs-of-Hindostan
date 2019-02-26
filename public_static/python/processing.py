from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.snowball import PorterStemmer
import nltk
import sys
#nltk.download('stopwords')

keywords = sys.argv[1]

def doTokenisation(text):
    tokenizer = RegexpTokenizer("[a-zA-Z]+")
    tokens = tokenizer.tokenize(text)
    return tokens

def removeStopWords(tokens):
    sw = set(stopwords.words('english'))
    useful_tokens = [w for w in tokens if w not in sw]
    return useful_tokens

def doStemming(tokens):
    ps = PorterStemmer()
    stemmed_tokens = []
    for w in tokens:
        stemmed_tokens.append(ps.stem(w))
    
    return stemmed_tokens

def allInOneFunction(text):
    tokens = doTokenisation(text)
    useful_tokens = removeStopWords(tokens)
    stemmed_tokens = doStemming(useful_tokens)
    return stemmed_tokens

text = ""
for word in keywords:
    text = text + word
useful_words = allInOneFunction(text.lower())
useful_text = ""
for word in useful_words:
    useful_text = useful_text + word + ' '
print(useful_text)
sys.stdout.flush()