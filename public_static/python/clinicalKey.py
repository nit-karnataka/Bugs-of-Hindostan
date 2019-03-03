from bs4 import BeautifulSoup as bs
from selenium import webdriver as wd
import time
import sys
import urllib.request, json
import requests
from bs4 import BeautifulSoup

if not sys.warnoptions:
    import warnings
    warnings.simplefilter("ignore")

login_data = {
    'username': "library@hindujahospital.com", 
    'password': "rkmlib123#", 
    'remember_me': 'true', 
    'product': "CK_US" 
}

driver = wd.PhantomJS(executable_path="../phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe")


url = "https://www.clinicalkey.com/#!/login"
driver.get(url)
time.sleep(10)
r = bs(driver.page_source, 'html.parser')


user = driver.find_element_by_id('username')
user.clear()
user.send_keys('library@hindujahospital.com')
pwd = driver.find_element_by_id('password')
pwd.clear()
pwd.send_keys('rkmlib123#')
driver.find_element_by_name("submit").submit()
time.sleep(10)              #MOST IMPORTANT STATEMENT IN WHOLE OF THIS CODE, WAIT FOR THE SERVER TO ACTUALLY LOGIN



def clinicalSearch(keyword):
    keyword = keyword + ""
    keyword=keyword.replace(" ","+")
    
    json_url = "https://www.clinicalkey.com/ui/service/search?ckproduct=CK_US&fields=cid,itemtitle,eid,contenttype,hubeid,refimage,pdfeid,sourcetitle,pagerange,coverdatestart,authorlist,volumeissue,authorg,condition,intervention,copyrightyear,issn,pubdate,datecreatedtxt,daterevisedtxt,statustype,exactsourcetitle,label,sectionid,sourcecopyright,sourceeditor,sourcetype,toc,volume,issue,pagefirst,pagelast,pageinfo,chaptertitle,chapternumber,ngcsynthesisurl,altlangeid,provider,summary,ref,reftitle,altlang,lang,srcid,tradenames,subtype,sections,sectiontitle,chptitle,doctype,embargo,sectionids&fullTextOnly=true&group=true&nestMedlineData=true&nestStudyTypes=true&onlyEntitled=true&query="+keyword+"&rows=500&sections=results,facets,resultsanalysis,bestbets,topicpages,didyoumean,didyoumean,disambiguations&showExpandedResult=true&showSelectedContent=false&start=0"
    res = driver.get(json_url)
    time.sleep(10)
    res = BeautifulSoup(driver.page_source,'html.parser')
    jsonStr = res.find('pre')
  
#     json1_data = json.loads(json1_str)[0]
    myD = json.loads(jsonStr.contents[0])
    return myD

keywords = sys.argv[1]
results = clinicalSearch(keywords)
#url="https://www.clinicalkey.com/#!/search/kidney%252C%2520tumor"
#results = clinicalSearch2(url)


ls = results["results"]
#print(ls)
#print(len(ls))



eidlist = []
for i in range(len(ls)):
#     if(ls[i]["contenttype"] == "Book"):
    eidlist.append(ls[i]["eid"])


pdfList = []
j = 0
for i in range(len(ls)):
    if ls[i]["contenttype"] == "BOOK" or ls[i]["contenttype"] == "JOURNAL":
        if(j < 20):
            j = j+1
            pdfurl = "https://www.clinicalkey.com/service/content/pdf/watermarked/" + eidlist[i] + ".pdf?locale=en_US"
            pdfList.append(pdfurl)

text = ''
for pdf in pdfList:
   text = text + ' ' + pdf

print(text)
#print(pdfList)

