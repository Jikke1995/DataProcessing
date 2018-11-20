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
OUTPUT_JSON = "05.gediplomeerden-wo-2017.json"

def convert_into_json_file(file):
    """
    This function opens the CSV file and writes a JSON file with CSV data.
    """
    # Open an empty json file
    jsonfile = open(OUTPUT_JSON, 'w')

    # Open the csv file
    csv_file = open(INPUT_CSV, 'rU')

    # Read csv file
    reader = csv.DictReader(csv_file)

    # Create jsonfile
    out = json.dumps([row for row in reader])
    jsonfile.write(out)

    return jsonfile

if __name__ == "__main__":
    jsonfile = convert_into_json_file(INPUT_CSV)
