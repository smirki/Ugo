#driver_id, license_number, vehicle_info, ratings
# one to one wor one to many with user
class Driver(User):
    def __init__(self, user_id, name, email, password, gender, availability=None, preferences=None, location=None):
        super().__init__(user_id, name, email, password, gender, preferences, location)
        self.availability = availability or {}

    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['availability'] = self.availability
        return user_dict

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data['user_id'],
            name=data['name'],
            email=data['email'],
            password=data['password'],
            gender=data['gender'],
            availability=data.get('availability', {}),
            preferences=data.get('preferences', {}),
            location=data.get('location', {})
        )

