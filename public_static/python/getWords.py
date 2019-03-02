from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.snowball import PorterStemmer
import nltk
import sys


nltk.download('stopwords')
path = open(sys.argv[1], 'rb') 

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




class PdfConverter:

   def __init__(self, file_path):
       self.file_path = file_path
   def convert_pdf_to_txt(self):
       rsrcmgr = PDFResourceManager()
       retstr = StringIO()
       codec = 'utf-8'
       laparams = LAParams()
       device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
       fp = open(self.file_path, 'rb')
       interpreter = PDFPageInterpreter(rsrcmgr, device)
       password = ""
       maxpages = 0
       caching = True
       pagenos = set()
       for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
           interpreter.process_page(page)
       fp.close()
       device.close()
       str = retstr.getvalue()
       retstr.close()
       return str

   def save_convert_pdf_to_txt(self):
       content = self.convert_pdf_to_txt()
       txt_pdf = open('text_pdf.txt', 'wb')
       txt_pdf.write(content.encode('utf-8'))
       txt_pdf.close()
if __name__ == '__main__':
    pdfConverter = PdfConverter(file_path=path)
    text = pdfConverter.convert_pdf_to_txt()
    text = allInOneFunction(text)
    print(text)
