from __main__ import app
import Database.db

@app.route('/')
def default():
    return "Hello World, {}".format(Database.db.test_response())
