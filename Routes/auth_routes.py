#each file contains routes related to different features of the app

from flask import request, jsonify
from Database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from __main__ import app

## have to enable JWT authentication

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    if 'edu' in email:
        
        if db.Users.find_one({'email': email}):
            return jsonify({'error': 'User already exists'}), 409
        
    
        hashed_password = generate_password_hash(password)
        print(hashed_password)
        
        db.Users.insert_one({'email': email, 'password': hashed_password})
        return jsonify({'message': 'User registered successfully!'}), 200
        
    else:
        return jsonify({'error': 'Not a school email'}), 400
    
@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = db.Users.find_one({'email':email})

    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'User Logged in Successfully!'}), 200
    else: 
        return jsonify({'error': 'Invalid login credentials'}), 400

