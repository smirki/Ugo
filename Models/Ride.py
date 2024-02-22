#represents a ride sharing trip
#ride_id, pickup_location, destination, number_of_riders, estimated_cost, status, timestamp
# many to one with user
# one to many with payment
from datetime import datetime

class Ride:
    def __init__(self, ride_id, pickup_location, destination, number_of_riders, estimated_cost, status, user, driver):
        self.ride_id = ride_id
        self.pickup_location = pickup_location
        self.destination = destination
        self.number_of_riders = number_of_riders
        self.estimated_cost = estimated_cost
        self.status = status
        self.user = user 
        self.driver = driver
        

    def assign_user(self, user):
        self.user = user
    
    def assign_driver(self, driver):
        self.driver = driver


    def to_dict(self):
        ride_dict = {
            'ride_id': self.ride_id,
            'pickup_location': self.pickup_location,
            'destination': self.destination,
            'number_of_riders': self.number_of_riders,
            'estimated_cost': self.estimated_cost,
            'status': self.status,
            'user': self.user,
            'driver': self.driver,

        }
        return ride_dict
