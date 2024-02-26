from Routes.auth_routes import token_required
from __main__ import app
from flask import request, jsonify

@app.route('/make_payment', methods=['POST'])
@token_required
def make_payment():
    return jsonify({'message': 'payment made'})