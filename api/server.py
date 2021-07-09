from types import MethodType
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return '<h1>api for use w/ BookAddify</h1>'


@app.route('/query/<book_name>')
def query(book_name):
    from api import book_add_quick
    result = book_add_quick(book_name)
    return result


@app.route('/search/<book_name>')
def search(book_name):
    from api import book_search
    result = book_search(book_name)
    return result


@app.route('/book/<id>')
def book_get(id):
    from api import book_scrape
    lst = id.split('-')
    ID = lst[0]+'/'+lst[1]
    result = book_scrape(f'https://3lib.net/book/{ID}')
    return result


if __name__ == '__main__':
    app.run()
