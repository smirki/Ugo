# driver_id, license_number, vehicle_info, ratings
# one to one or one to many with user
class Driver(User):
    def __init__(self, user_id, name, email, password, gender, is_available=False, location=None):
        super().__init__(user_id, name, email, password, gender, location=location)
        self.is_available = is_available

    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['is_available'] = self.is_available
        return user_dict

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data['user_id'],
            name=data['name'],
            email=data['email'],
            password=data['password'],
            gender=data['gender'],
            is_available=data.get('is_available', False),
            location=data.get('location', {})
        )
