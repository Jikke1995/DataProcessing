#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    movies = []
    names = []
    releases = []
    runtimes = []
    ratings = []
    all_actors = []

    # Scrape the actors of a movie
    for link in dom.find_all('div',attrs={'class':'lister-item-content'}):
        # Create list of actors for given movie
        actors = []
        http = link.find_all('p', class_ = "")[1]
        http = http.find_all('a')
        for link in http:
            if 'st' in link.get('href'):
                actor = link.get_text()
                actors.append(actor)
        all_actors.append(actors)

    # Scrape the name and release of a movie
    for link in dom.find_all('h3',attrs={'class':'lister-item-header'}):
        http = link.find('a')
        name = http.get_text()
        http = link.find('span',attrs={'class':'lister-item-year text-muted '
                         'unbold'})
        release = http.get_text().split()
        # Makes sure only the year is stored in the  release variable
        if len(release) > 1:
            release = release[1]
        else:
            release = release[0]
        # Deletes () characters from string
        release = release.translate({ord(c): None for c in '()'})
        releases.append(release)
        names.append(name)

    # Scrape the runtime of a movie
    for link in dom.find_all('span', attrs={'class':'runtime'}):
        # Extract only the number from the runtime
        runtime = link.get_text().split()[0]
        runtimes.append(runtime)

    # Scrape the rating of a movie
    for link in dom.find_all('div', attrs={'class':'inline-block '
                             'ratings-imdb-rating'}):
        http = link.find('strong')
        rating = http.get_text()
        ratings.append(rating)

    # Create dictionary for every movie with title, rating, year, actor and
    # runtime as values
    for i,name in enumerate(names):
        movie = {}
        movie['title'] = name
        movie['rating'] = ratings[i]
        movie['year'] = releases[i]
        movie['actors'] = all_actors[i]
        movie['runtime'] = runtimes[i]
        movies.append(movie)

    # Return the top 50 list of movies from IMDB
    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write movies to disk
    for movie in movies:
        actors = movie['actors']
        # Add b' to the movies list so that in the CSV file you can devide
        # colomns by comma
        string = "b'"
        for i, actor in enumerate(actors):
            if i == len(actors) - 1:
                string = string + actor + "'"
            else:
                string = string + actor + ", "
        # Write every movie entry (titel, rating, year, runtime) to csv file
        # per row
        writer.writerow([movie['title'], movie['rating'], movie['year'],
                        string, movie['runtime']])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : '
              '{1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
