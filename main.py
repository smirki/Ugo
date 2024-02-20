import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request

app = Flask(__name__)
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

data, count = supabase.table('users').insert({"id":1, "username":"fire"}).execute()

@app.route('/')
def default():
    return "Hello World"


if __name__ == '__main__':
    app.run(debug=True)
