import os
import Database.db

from flask import Flask, request, abort

app = Flask(__name__)

import Routes.auth_routes
import Routes.classic_routes

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    user, error = supabase.auth.sign_up({
    'email': email,
    'password': password
})

if __name__ == '__main__':
    app.run(debug=True)
