from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.snowball import PorterStemmer
import PyPDF2 
import nltk
import sys
#nltk.download('stopwords')

pdfFileObj = sys.argv[1] 
#pdfFileObj = './first-text (not working).pdf'

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

pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
text = ""
for i in range(pdfReader.numPages):
    pageObj = pdfReader.getPage(i)
    text = text + pageObj.extractText()
useful_words = allInOneFunction(text.lower())
print(useful_words)
sys.stdout.flush()