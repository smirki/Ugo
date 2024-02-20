# flask doesnt do a circular import even though it says it does
import os
import Database.db

from flask import Flask, request, abort

app = Flask(__name__)

import Routes.auth_routes
import Routes.classic_routes

if __name__ == '__main__':
    app.run(debug=True)
