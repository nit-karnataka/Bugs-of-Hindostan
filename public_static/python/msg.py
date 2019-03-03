import requests
import json
import sys

URL = 'http://www.way2sms.com/api/v1/sendCampaign'

# get request
def sendPostRequest(reqUrl, apiKey, secretKey, useType, phoneNo, senderId, textMessage):
  req_params = {
  'apikey':apiKey,
  'secret':secretKey,
  'usetype':useType,
  'phone': phoneNo,
  'message':textMessage,
  'senderid':senderId
  }
  return requests.post(reqUrl, req_params)

# get response
phoneNo = sys.argv[1]
response = sendPostRequest(URL, '4QRDKPEEI1RJJYTBBPGARZEIUZ2GHG5A', 'JORJ5Y5WCEZ1MAGH', 'stage', phoneNo, 'groovymav@gmail.com', 'Mails have been sent for your query, kindly check. :)' )

# print response if you want
print(response.text)
