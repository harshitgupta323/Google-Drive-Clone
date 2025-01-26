from flask import Flask, redirect
import requests
from pymongo import MongoClient
from flask_talisman import Talisman
import os
import socket


# def url_ok(host):
#     # exception block
#     try:
#         HOST_UP = True if os.system("ping -c 1 " + host) is 0 else False
#         return HOST_UP
#     except requests.ConnectionError as e:
#         return False

def url_ok(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex((host, port))
    if result == 0:
        print("Port is open")
        return True
    else:
        print("Port is not open")
        return False


def connect_db(db_name):
    client = MongoClient('mongodb+srv://ritul:ritul123@cluster0.ecwzof7.mongodb.net/?retryWrites=true&w=majority')
    db = client[db_name]
    return db


def obtain_servers():
    db = connect_db("cloud-project-db")
    collection = db["servers"]
    ipaddress = []
    for x in collection.find():
        ipaddress.append(x['ip_address'])
        print(x)
    return ipaddress


def return_redirect_link():
    server_addresses = obtain_servers()
    for address in server_addresses:
        url = 'https://{}:3000/'.format(address)
        print("URL = ", url)
        status = url_ok(address, 3000)
        print("Status = ", status)
        if status:
            return url
    return 'No server is currently available!!!'

# def return_redirect_link():
#     server_addresses = ['http://192.168.51.149:5000/link1', 'http://192.168.51.149:5000/link2']
#     for address in server_addresses:
#         status = url_ok(address)
#         print("Status = ", status)
#         if status:
#             return address
#     return 'No server is available for currently'


# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
Talisman(app, content_security_policy=None)


@app.route('/link1')
# ‘/’ URL is bound with hello_world() function.
def link1():
    return 'This is link 1'


@app.route('/link2')
# ‘/’ URL is bound with hello_world() function.
def link2():
    return 'This is link 2'

# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.
@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    # return 'Hello World'
    try:
        link = return_redirect_link()
        # link = 'https://192.168.54.4:3000/'
        if link.startswith('http'):
            return redirect(link, code=302)
        else:
            return 'No server available currently for serving this request'
    except Exception as e:
        return 'No server available currently for serving this request'


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(host='192.168.51.149', port=5000, debug=True)
