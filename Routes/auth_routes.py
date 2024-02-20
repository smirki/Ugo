#each file contains routes related to different features of the app

from flask import request, jsonify
from Database.db import supabase
from __main__ import app

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    user, error = supabase.auth.sign_up({
    'email': email,
    'password': password,
    })
    if error:
        return jsonify({'error': error}), 400
    return jsonify({'message': 'User registered successfully!', 'user':user}), 200


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user, error = supabase.auth.sign_in_with_password({'email':email, 'password':password})
    if error:
        return jsonify({'error': error.message}), 400
    return jsonify({'message': 'User Login successfully!', 'user':user}), 200

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    if token:
        supabase.auth.api.sign_out(token)
    return jsonify({'message': 'Logged out'}), 200