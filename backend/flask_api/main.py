# flask doesnt do a circular import even though it says it does
import os


from flask import Flask, request, abort
from flask_cors import CORS

app = Flask(__name__, static_url_path='', 
            static_folder='Tests',)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SECRET_KEY'] = 'mysecretkey'
import Database.db

import Routes.auth_routes
import Routes.classic_routes
import Routes.ride_routes
import Routes.payment_routes
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

