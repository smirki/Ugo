from __main__ import app

@app.route('/')
def default():
    return "Hello World, {}".format(Database.db.test_response())
