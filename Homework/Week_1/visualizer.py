#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Open CSV file for reading
with open(INPUT_CSV, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    # Iterate over every row in CSV file
    for row in reader:
        # Store year and rating of movie
        year = row['Year']
        rating = row['Rating']
        # Add rating to list of ratings of given year
        data_dict[year].append(rating)

# Create list for mean ratings
mean_ratings = []
for year in data_dict:
    # Add all ratings for given year, and divide by amount of movies that year
    mean_rating = sum(map(float, data_dict[year])) / len(data_dict[year])
    # Add the mean rating to the list
    mean_ratings.append(mean_rating)

if __name__ == "__main__":
    # Create plot for data
    x = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
    plt.plot(x, mean_ratings, marker='o', color='b')
    # Set axis
    plt.axis([START_YEAR, END_YEAR - 1, 0, 10])
    # Give axis and graphic labels
    plt.xlabel('Year')
    plt.ylabel('Rating')
    plt.suptitle('Mean rating IMDB on movies', fontsize=18)
    plt.title('Where there better years between 2007 and 2018?', fontsize=8)
    # Set fond for the text
    plt.text(60, .025, r'$\mu=100,\ \sigma=15$')
    plt.show()
