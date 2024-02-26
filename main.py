# flask doesnt do a circular import even though it says it does
import os


from flask import Flask, request, abort

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
import Database.db

import Routes.auth_routes
import Routes.classic_routes
import Routes.ride_routes
import Routes.payment_routes
if __name__ == '__main__':
    app.run(debug=True)
