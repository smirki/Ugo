# stores information about users, drivers, and passengers
# user_id, first_name, last_name, nickname, email, phone_number, emergency_contact, profile_picture, password_hash, etc.
# one to many with ride

class User:
    def __init__(self, user_id, name, email, password, gender, num_passengers=None, location=None):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.gender = gender
        self.num_passengers = num_passengers
        self.location = location or {}

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'gender': self.gender,
            'num_passengers': self.num_passengers,
            'location': self.location
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data['user_id'],
            name=data['name'],
            email=data['email'],
            password=data['password'],
            gender=data['gender'],
            num_passengers=data.get('num_passengers'),
            location=data.get('location', {})
        )
