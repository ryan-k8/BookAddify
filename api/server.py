from flask import Flask
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return '<h1>api for use w/ BookAddify</h1>'


@app.route('/query/<book_name>')
def main(book_name):
    from api import book_scrape
    result = book_scrape(book_name)
    return result


if __name__ == '__main__':
    app.run()
