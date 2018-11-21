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

def convert_into_json_file(file):
    """
    This function opens the CSV file and writes a JSON file with CSV data.
    """
    # Open an empty json file
    jsonfile = open(OUTPUT_JSON, 'w')

    # Open the csv file
    csv_file = open(INPUT_CSV, 'rU')

    # Read csv file
    reader = csv.DictReader(csv_file, delimiter=';')
    data = {}
    for row in reader:
        if row["INSTELLINGSNAAM ACTUEEL"] == 'Universiteit van Amsterdam' and row["OPLEIDINGSNAAM ACTUEEL"] == 'B Psychologie' and row["OPLEIDINGSVORM"] == 'voltijd onderwijs':
           data[2012] = row["2012 VROUW"]
           data[2013] = row["2013 VROUW"]
           data[2014] = row["2014 VROUW"]
           data[2015] = row["2015 VROUW"]
           data[2016] = row["2016 VROUW"]

    # Create jsonfile
    out = json.dumps(data)
    jsonfile.write(out)

    return jsonfile

if __name__ == "__main__":
    jsonfile = convert_into_json_file(INPUT_CSV)
