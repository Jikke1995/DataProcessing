#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script preprocesses data and visually analyses it.
"""

import csv
import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
import json

INPUT_CSV = 'input.csv'


def load_file(csv_file):
    """
    This function loads the file
    """
    # Reads csv file
    file = pd.read_csv(csv_file)

    return file


def preprocess_file(read_file):
    """
    Preprocesses the file before analyzing is possible
    """
    # Replace unknown numbers with NaN
    read_file = read_file.replace("unknown", np.nan)

    # Deletes 'dollars' string in GDP column
    read_file["GDP ($ per capita) dollars"] = read_file["GDP ($ per capita) "
                                              "dollars"].str.replace(' dollars',
                                              '')

    # Changes comma's in columns of interest into periods
    read_file["Pop. Density (per sq. mi.)"] = read_file["Pop. Density (per sq. "
                                              "mi.)"].str.replace(',','.')
    read_file["Infant mortality (per 1000 births)"] = read_file["Infant "
                                                      "mortality (per 1000 "
                                                      "births)"].str.replace(',','.')


    # Converts strings of columns of interest into integers
    read_file["Pop. Density (per sq. mi.)"] = pd.to_numeric(read_file["Pop. "
                                              "Density (per sq. mi.)"])
    read_file["Infant mortality (per 1000 births)"] = pd.to_numeric(read_file
                                                      ["Infant mortality (per "
                                                      "1000 births)"])
    read_file["GDP ($ per capita) dollars"] = pd.to_numeric(read_file["GDP ($ "
                                              "per capita) dollars"])

    return read_file


def central_tendency(data):
    """
    This function calculates the middle of a distribution of values.
    It measures the mean, median, mode and standard deviation and it plots
    a histogram with the data for visually analyzing.
    """

    # Drop rows with NaN value in given data
    data = data.dropna()

    # Calculate mean, median, mode and standard deviation of data.
    data_mean = data.mean()
    data_median = data.median()
    data_mode = data.mode()[0]
    data_std = np.std(data)

    # Removes outlier from data
    data = remove_outlier(data)

    # Creates a histogram of given data
    plt.hist(data, bins=50)
    plt.axis([0, 50000, 0, 70])
    plt.ylabel("Frequency")
    plt.grid(True)

    return f'Mean: {data_mean}, Median: {data_median}, Mode: {data_mode}, Standard Deviation: {data_std}'


def remove_outlier(data):
    """
    This function removes an outlier (maximum) value from given data.
    """
    outlier = data.idxmax()
    data = data.drop([outlier])

    return data


def five_number_summary(data):
    """
    The Five Number Summary is a set of descriptive statistics for analyzing data.
    To visualize this, a box plot is done.
    """

    # Drop rows with NaN value in given data
    data = data.dropna()
    # Stores the descriptives of the data
    descriptives = data.describe()

    return descriptives


def create_boxplot(column_name):
    """
    This function creates a boxplot of given data.
    """
    boxplot = file.boxplot(column = [column_name])
    plt.title("Boxplot of " f"{column_name}")
    plt.show()

    return boxplot


def create_json_file(file):
    """
    This function creates a json file.
    """
    file = file.set_index('Country')
    file.to_json('eda.json', orient='index')

if __name__ == "__main__":

    # Load file
    file = load_file(INPUT_CSV)
    # Preprocess file
    file = preprocess_file(file)

    # Calculate central tencency of GDP and show histogram of data
    ct = central_tendency(file["GDP ($ per capita) dollars"])
    # Name title and xlabel here (because in the general central_tendency function you
    # don't know which data you use)
    plt.title("Frequency of GDP value")
    plt.xlabel("Value of GDP")
    plt.show()

    # Use Five Number Summary for looking at distribution of Infant Mortality data
    descriptives = five_number_summary(file["Infant mortality (per 1000 births)"])

    # Create boxplot of Infant Mortality data
    boxplot = create_boxplot("Infant mortality (per 1000 births)")

    # Convert cleaned, preprocessed and analyzed data to .json file
    json_file = create_json_file(file)
