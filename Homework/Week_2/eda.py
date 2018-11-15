#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script ...
"""

import csv
import pandas as pd
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

INPUT_CSV = 'input.csv'

def load_file(file):
    file = pd.read_csv(file)
    return file

if __name__ == "__main__":
    data = load_file(INPUT_CSV)
    print(data)
