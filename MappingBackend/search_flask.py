from sortedcontainers import SortedDict
import json

# Load the JSON data
with open('charlotte_total_node_data.json') as f:
    charlotte_data = json.load(f)

# Extract elements for easier access
elements = charlotte_data.get("elements", [])

# Build a SortedDict with location names and their corresponding data
all_locations = SortedDict()
for element in elements:
    if 'tags' in element and 'name' in element['tags']:
        location_name = element['tags']['name'].lower()  # Use lower for case-insensitive comparison
        all_locations[location_name] = element

# Function to find closest matches
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

# Example usage:
closest_matches = find_closest_matches(all_locations, "colville", num_matches=4)
print(closest_matches[1])
for match in closest_matches:
    print(match)


