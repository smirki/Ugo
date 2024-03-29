from math import radians, sin, cos, sqrt, atan2


class MatchingService:
    @staticmethod
    def haversine_distance(loc1, loc2):
        #TODO NEED TO UPDATE THIS SO IT USES API CALL TO CALCLUATE THE DISTANCE
        # Calculate the Haversine distance between two locations in kilometers
        R = 6371  # Earth radius in kilometers

        lat1, lon1 = radians(loc1[0]), radians(loc1[1])
        lat2, lon2 = radians(loc2[0]), radians(loc2[1])

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = R * c
        return distance

    @staticmethod
    def find_matching_driver(user_profile, available_drivers_json, pickup_location):

        user_profile = user_profile
        available_drivers_list = available_drivers_json
        pickup_location = pickup_location
        print(pickup_location)
        sorted_available_drivers_list = sorted(
            available_drivers_list['available_drivers'],
            key=lambda driver: MatchingService.haversine_distance(pickup_location, 
            (driver['location']['latitude'], 
            driver['location']['longitude']))
        )
       

        matching_stack = sorted_available_drivers_list[::-1]

        return matching_stack
        return None
       

