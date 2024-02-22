from Models.Ride import Ride
from flask import request, jsonify
from Database.db import supabase
import requests
import json
from Services.MatchingService import MatchingService
from __main__ import app



USERS_FILE = 'Database/mock_db/users.json'
DRIVERS_FILE = 'Database/mock_db/drivers.json'

@app.route('/new_ride', methods=['POST'])
def new_ride():
    try:
        # Get JSON data from the POST request
        ride_data = request.get_json()

        # Extract ride attributes from the JSON data
        ride_id = ride_data.get('ride_id')
        pickup_location = ride_data.get('pickup_location')
        destination = ride_data.get('destination')
        number_of_riders = ride_data.get('number_of_riders')
        estimated_cost = ride_data.get('estimated_cost')
        status = ride_data.get('status')
        user_id = ride_data.get('user_id')
        

        driver_response = requests.get('http://127.0.0.1:5000/find_driver', params={'lat': pickup_location[0], 'long': pickup_location[1], 'user_id': user_id})
       
       
        if driver_response.status_code == 200:
            driver = driver_response.json()
            
            # Create a Ride instance after getting the response
            ride = Ride(
                ride_id=ride_id,
                pickup_location=pickup_location,
                destination=destination,
                number_of_riders=number_of_riders,
                estimated_cost=estimated_cost,
                status=status,
                user=user_id,
                driver=driver[0]['user_id'],
            )
            
            return jsonify(ride.to_dict())

        # ride.assign_driver(driver[0]['user_id'])

        # Return the ride details as a JSON response
        else:
            return jsonify({'error': 'Failed to find a driver'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 400




@app.route('/find_driver', methods=['GET'])
def find_driver():
    lat = request.args.get('lat')
    long = request.args.get('long')
    user_id = request.args.get('user_id')
    

    user_profile = requests.get('http://127.0.0.1:5000/find_user_profile', params={'user_id': user_id}).json()
    available_drivers = requests.get('http://127.0.0.1:5000/find_available_drivers').json()

    pickup_location = [float(lat),float(long)]
    matching_stack = MatchingService.find_matching_driver(user_profile, available_drivers, pickup_location)
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