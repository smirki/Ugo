from flask import Flask, jsonify, render_template, request
from sortedcontainers import SortedDict
import json

app = Flask(__name__)

# Load the JSON data
with open('charlotte_restaurants.json') as f:
    charlotte_data = json.load(f)

# Extract elements for easier access and build a SortedDict with location names
all_locations = SortedDict()
for element in charlotte_data.get("elements", []):
    if 'tags' in element and 'name' in element['tags']:
        location_name = element['tags']['name'].lower()  # Use lower for case-insensitive comparison
        all_locations[location_name] = element


@app.route('/')
def index():
    return render_template('index.html')

# Endpoint for autocomplete search
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    search_term = request.args.get('term', '')
    matches = find_closest_matches(all_locations, search_term, num_matches=10)
    #print(matches)
    return jsonify(matches)

def find_closest_matches(sorted_dict, search_term, num_matches=3):
    search_term = search_term.lower()  # Use lower for case-insensitive comparison
    closest_matches = []
    
    # Find the index of the closest match
    index = sorted_dict.bisect_left(search_term)
    
    # Get the closest match and the next 2-3 closest matches
    for i in range(max(0, index - 1), min(index + num_matches, len(sorted_dict))):
        key = sorted_dict.iloc[i]
        closest_matches.append((key, sorted_dict[key]))
    
    return closest_matches

if __name__ == '__main__':
    app.run(debug=True)
