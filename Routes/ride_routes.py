from flask import request, jsonify
from Database.db import supabase
import requests
import json
from Services.MatchingService import MatchingService
from __main__ import app



USERS_FILE = 'Database/mock_db/users.json'
DRIVERS_FILE = 'Database/mock_db/drivers.json'

@app.route('/find_driver', methods=['GET'])
def find_driver():
    user_id = request.args.get('user_id')
    

    user_profile = requests.get('http://127.0.0.1:5000/find_user_profile', params={'user_id': user_id}).json()
    available_drivers = requests.get('http://127.0.0.1:5000/find_available_drivers').json()

    matching_stack = MatchingService.find_matching_driver(user_profile, available_drivers)
    return jsonify(matching_stack)


@app.route('/find_user_profile', methods=['GET'])
def find_user_profile():

    user_id = request.args.get('user_id')
    with open(USERS_FILE, 'r') as users_file:
        users = json.load(users_file)
    

    user_profile = next((user for user in users if user['user_id'] == int(user_id)), None)
    
    return jsonify(user_profile)


@app.route('/find_available_drivers', methods=['GET'])
def find_available_drivers():

    with open(DRIVERS_FILE, 'r') as drivers_file:
        drivers = json.load(drivers_file)
    

    available_drivers = [driver for driver in drivers if driver['is_available']]
    
    return jsonify({"available_drivers": available_drivers})