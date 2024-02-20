import os
from supabase import create_client, Client

from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def default():
    return "Hello World"


if __name__ == '__main__':
    app.run(debug=True)