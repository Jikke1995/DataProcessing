#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script converts a CSV file into a JSON file.
"""

import csv
import pandas as pd
import json

INPUT_CSV = ""


def load_csv_file(file):
    file = pd.read_csv(file)

    return file


def create_json_file(file):
    file = file.set_index('Country')
    file.to_json('eda.json', orient='index')

    return file


if __name__ == "__main__":
    csv_file = load_csv_file(INPUT_CSV)
    json_file = create_json_file(csv_file)
