import requests
import json

# Define the Overpass API endpoint
api_endpoint = "http://overpass-api.de/api/interpreter"

# Define your Overpass query
overpass_query = """
[out:json];
area[name="Charlotte"][admin_level=8];
(node["amenity"="restaurant"](area);
 way["amenity"="restaurant"](area);
 rel["amenity"="restaurant"](area););
out center;

"""

# Make the API request
response = requests.get(api_endpoint, params={'data': overpass_query})

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Save the data to a JSON file
    with open('charlotte_restaurants.json', 'w') as outfile:
        json.dump(data, outfile)
    print("Data successfully saved to charlotte_data.json.")
else:
    print("Failed to retrieve data. Status code:", response.status_code)
