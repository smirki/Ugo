from flask import request, jsonify
from Database.db import supabase
import requests



@app.route('/find_driver', methods=['GET'])
def find_driver():
    user_id = requests.args.get('user_id')
    pass
   