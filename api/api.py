import requests
from bs4 import BeautifulSoup


def book_scrape(book_name):
    BASE_URL = 'https://1lib.in'
    response = requests.get(f'https://1lib.in/s/{book_name}?order=year').text
    soup = BeautifulSoup(response, 'html.parser')

    # the first result's url (for project anyway)
    most_relevant = soup.find('h3', {'itemprop': 'name'}).find('a')['href']

    response_ = requests.get(f'{BASE_URL+most_relevant}').text
    soup_ = BeautifulSoup(response_, 'html.parser')

    book_title = soup_.find('h1', {'itemprop': 'name'}).contents[0]
    book_author = soup_.find('a', {'itemprop': 'author'}).contents[0]
    book_publisher = soup_.find(
        'div', {'class': 'bookProperty property_publisher'}).find('div', {'class': {'property_value'}}).contents[0]
    book_release_yr = soup_.find('div', {'class': 'bookProperty property_year'}).find(
        'div', {'class': 'property_value'}).contents[0]
    book_summary = soup_.find('div', {'itemprop': 'reviewBody'}).contents
    book_img = soup_.find('div', {'class': 'z-book-cover'}).find('img')['src']

    # primary dwnld
    book_dwnld_primary = soup_.find('a', {'class': 'addDownloadedBook'})
    book_dwnld_title = book_dwnld_primary.contents[2]
    book_dwnld_src = BASE_URL + book_dwnld_primary['href']
    book_dwnld_lst = [book_dwnld_title, book_dwnld_src]

    RESULT = {
        'book': book_title,
        'author': book_author,
        'publisher': book_publisher,
        'release': book_release_yr,
        'summary': str(book_summary),
        'resources': {
            'image': book_img,
            'downloads': book_dwnld_lst
        }
    }
    return RESULT
