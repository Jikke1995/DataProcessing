#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script converts a CSV file into a JSON file.
"""

import csv
import pandas as pd
import json

INPUT_CSV = "alcohol_consumption.csv"
OUTPUT_JSON = "data.json"

def convert_into_json_file(data):
    """
    This writes a JSON file with given CSV data.
    """
    # Open an empty json file
    jsonfile = open(OUTPUT_JSON, 'w')

    # Write csv data into new json file
    out = json.dumps(data)
    jsonfile.write(out)

    return jsonfile

def select_data(file):
    """
    This function selects the data of interest from the csv file.
    """
    # Read csv file
    reader = csv.DictReader(file)
    data = {}
    years = {}
    # In this case, selects the data from Australia, the number of Alcohol
    # Consumption for the years 1960 to 2015.
    for row in reader:
        if row['ï»¿"LOCATION"'] in data:
            years[row["TIME"]] = row["Value"]
            data[row['ï»¿"LOCATION"']] = years
        else:
            years = {}
            years[row["TIME"]] = row["Value"]
            data[row['ï»¿"LOCATION"']] = years


    return data

if __name__ == "__main__":
    csv_file = open(INPUT_CSV, 'rU')
    data = select_data(csv_file)
    jsonfile = convert_into_json_file(data)
