# stores informaiton about users, drivers, and passengers
# user_id, first_name, last_name, nickname, email, phone_numer, emergency_contact, profile_picture, password_hash, etc.
# one to many with ride

class User:
    def __init__(self, user_id, name, email, password, gender, preferences=None, location=None):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.gender = gender
        self.preferences = preferences or {}
        self.location = location or {}

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'gender': self.gender,
            'preferences': self.preferences,
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
            preferences=data.get('preferences', {}),
            location=data.get('location', {})
        )

