# database connection
import os
from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv
from __main__ import app



load_dotenv()

uri = os.getenv("MONGODB_URI") 
client = MongoClient(uri)


db = client['UgoRideshare']