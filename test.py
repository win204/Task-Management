import urllib.request
import json

def test():
    req = urllib.request.Request('http://localhost:8080/api/auth/login', 
                                 data=json.dumps({"username": "admin", "password": "Password@123"}).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'},
                                 method='POST')
    try:
        with urllib.request.urlopen(req) as f:
            print("Login with Password@123 Status:", f.status)
            data = json.loads(f.read().decode('utf-8'))
            print("Token:", data.get('data', {}).get('token'))
    except Exception as e:
        print("Login with Password@123 failed:", e)

    req2 = urllib.request.Request('http://localhost:8080/api/auth/login', 
                                 data=json.dumps({"username": "admin", "password": "123123"}).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'},
                                 method='POST')
    try:
        with urllib.request.urlopen(req2) as f:
            print("Login with 123123 Status:", f.status)
            data = json.loads(f.read().decode('utf-8'))
            print("Token:", data.get('data', {}).get('token'))
    except Exception as e:
        print("Login with 123123 failed:", e)

test()
