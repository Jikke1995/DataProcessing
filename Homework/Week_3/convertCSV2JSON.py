#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script converts a CSV file into a JSON file.
"""

import csv
import pandas as pd
import json

INPUT_CSV = "05.gediplomeerden-wo-2017.csv"
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
    reader = csv.DictReader(file, delimiter=';')
    data = {}
    # In this case, selects the data from the University of Amsterdam,
    # the amount of woman that was graduated for fulltime Psychology
    # over the years 2012 till 2016
    for row in reader:
        if row["INSTELLINGSNAAM ACTUEEL"] == 'Universiteit van Amsterdam' and row["OPLEIDINGSNAAM ACTUEEL"] == 'B Psychologie' and row["OPLEIDINGSVORM"] == 'voltijd onderwijs':
           data[2012] = row["2012 VROUW"]
           data[2013] = row["2013 VROUW"]
           data[2014] = row["2014 VROUW"]
           data[2015] = row["2015 VROUW"]
           data[2016] = row["2016 VROUW"]

    return data

if __name__ == "__main__":
    csv_file = open(INPUT_CSV, 'rU')
    data = select_data(csv_file)
    jsonfile = convert_into_json_file(data)
