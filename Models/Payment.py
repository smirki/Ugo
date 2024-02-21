# python classes that repesent the data models
class Payment:
    def __init__(self, payment_id, amount, payment_date, payment_method, driver_id, passenger_id):
        self.payment_id = payment_id
        self.amount = amount
        self.payment_date = payment_date
        self.payment_method = payment_method
        self.driver_id = driver_id
        self.passenger_id = passenger_id

    def to_dict(self):
        return {
            'payment_id': self.payment_id,
            'amount': self.amount,
            'payment_date': self.payment_date,
            'payment_method': self.payment_method,
            'driver_id': self.driver_id,
            'passenger_id': self.passenger_id
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            payment_id=data['payment_id'],
            amount=data['amount'],
            payment_date=data['payment_date'],
            payment_method=data['payment_method'],
            driver_id=data['driver_id'],
            passenger_id=data['passenger_id']
        )


