from __main__ import app
from Database.db import db

@app.route('/')
def default():
    return "Hello World, {}".format(db.Users.find_one())
