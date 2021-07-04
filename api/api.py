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

    book_title = soup_.find('h1', {'itemprop': 'name'}).contents[0].split()
    book_title_clean = ''
    for i in book_title:
        book_title_clean += f'{i} '

    book_author = soup_.find('a', {'itemprop': 'author'}).contents[0]
    book_publisher = soup_.find(
        'div', {'class': 'bookProperty property_publisher'}).find('div', {'class': {'property_value'}}).contents[0]
    book_release_yr = soup_.find('div', {'class': 'bookProperty property_year'}).find(
        'div', {'class': 'property_value'}).contents[0]
    book_summary = soup_.find('div', {'itemprop': 'reviewBody'})
    if (book_summary is None):
        book_summary = ''
    else:
        book_summary = book_summary.contents[1:]
        book_summary_clean = ''
        for i in book_summary:
            book_summary_clean += f'{i} '
    book_img = soup_.find('div', {'class': 'z-book-cover'}).find('img')['src']
    # primary dwnld
    book_dwnld_primary = soup_.find('a', {'class': 'addDownloadedBook'})
    if (book_dwnld_primary is None):
        book_dwnld_title = 'null'
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
        'publisher': book_publisher,
        'release': book_release_yr,
        'summary': book_summary_clean,
        'resources': {
            'image': book_img,
            'downloads': book_dwnld_lst
        }
    }
    return RESULT
