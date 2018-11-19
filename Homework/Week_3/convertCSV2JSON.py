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

    # Opens CSV file
    with open(file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        # Iterate over every row in CSV file
        for row in reader:
            # Writes rows into json file
            json.dump(row, jsonfile)

            #jsonfile.write('\n')

    return jsonfile

if __name__ == "__main__":
    jsonfile = convert_into_json_file(INPUT_CSV)
