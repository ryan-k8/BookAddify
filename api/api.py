import requests
from bs4 import BeautifulSoup
import json


def book_search(book_name):
    '''returns 5 search items w/ scraped data'''
    SEARCH_RESULT = list()
    BASE_URL = 'https://3lib.net'
    response = requests.get(
        f'https://3lib.net/s/{book_name}/?order=year').text
    soup = BeautifulSoup(response, 'html.parser')
    search_items = soup.find_all('div', 'exactMatch')
    for item in search_items[0:5]:
        title = item.find('h3', {'itemprop': 'name'}).a.get_text()
        id = item.find('h3', {'itemprop': 'name'}).a['href'][6:].split('/')
        id = id[0]+'-'+id[1]
        try:
            img = item.find('img')['data-srcset'].split(',')[1].split()[0]
        except AttributeError:
            img = ''
        try:
            author = item.find('a', {'itemprop': 'author'}).get_text()
        except AttributeError:
            author = ''
        try:
            publisher = item.find(
                'div', {'title': 'Publisher'}).a.get_text()
        except AttributeError:
            publisher = ''

        try:
            year = item.find('div', {'class': 'property_year'}).find(
                'div', {'class': 'property_value'}).get_text()
        except AttributeError:
            year = ''
        try:
            language = item.find('div', {'class': 'property_language'}).find(
                'div', {'class': 'property_value'}).get_text()
        except AttributeError:
            language = ''
        SEARCH_ITEM = {
            'title': title,
            'id': id,
            'img': img,
            'author': author,
            'publisher': publisher,
            'year': year,
            'language': language

        }
        SEARCH_RESULT.append(SEARCH_ITEM)
    return json.dumps(SEARCH_RESULT)


def book_scrape(url):
    BASE_URL = 'https://3lib.net'
    response_ = requests.get(url).text
    soup_ = BeautifulSoup(response_, 'html.parser')

    book_title = soup_.find('h1', {'itemprop': 'name'}).contents[0].split()
    book_title_clean = ''
    for i in book_title:
        book_title_clean += f'{i} '

    book_author = soup_.find('a', {'itemprop': 'author'}).contents[0]
    book_publisher = soup_.find(
        'div', {'class': 'bookProperty property_publisher'})
    if (book_publisher is None):
        book_publisher_clean = ''
    else:
        book_publisher_clean = book_publisher.find(
            'div', {'class': {'property_value'}}).contents[0]
    book_release_yr = soup_.find('div', {'class': 'bookProperty property_year'}).find(
        'div', {'class': 'property_value'}).contents[0]
    book_summary = soup_.find('div', {'itemprop': 'reviewBody'})
    if (book_summary is None):
        book_summary_clean = ''
    else:
        book_summary = book_summary.contents[1:]
        book_summary_clean = ''
        for i in book_summary:
            book_summary_clean += f'{i} '
    book_img = soup_.find('div', {'class': 'z-book-cover'}).find('img')['src']
    # primary dwnld
    book_dwnld_primary = soup_.find('a', {'class': 'addDownloadedBook'})
    if (book_dwnld_primary is None):
        book_dwnld_title_clean = 'null'
        book_dwnld_src = 'null'
    else:
        book_dwnld_title = book_dwnld_primary.contents[2].split()
        book_dwnld_title_clean = ''
        for i in book_dwnld_title:
            book_dwnld_title_clean += f'{i} '
        book_dwnld_src = BASE_URL + book_dwnld_primary['href']

    book_dwnld_lst = [book_dwnld_title_clean, book_dwnld_src]

    RESULT = {
        'book': book_title_clean,
        'author': book_author,
        'publisher': book_publisher_clean,
        'release': book_release_yr,
        'summary': book_summary_clean,
        'resources': {
            'image': book_img,
            'downloads': book_dwnld_lst
        }
    }
    return RESULT


def book_add_quick(book_name):
    '''returns data of the most relevant & newest book'''
    BASE_URL = 'https://3lib.net'
    response = requests.get(f'https://3lib.net/s/{book_name}?order=year').text
    soup = BeautifulSoup(response, 'html.parser')

    # the first result's url (for project anyway)
    most_relevant = soup.find('h3', {'itemprop': 'name'}).find('a')['href']
    RESULT = book_scrape(f'{BASE_URL+most_relevant}')
    return RESULT
