from ultracart.apis import FraudApi
from ultracart.models import FraudDeclineEmailRequest
from samples import api_client


# decline_email is a shortcut for telling UltraCart to decline orders from a specific email
# address. It is the quick alternative to building a full "address email" fraud rule by hand.

def decline_email():
    fraud_api = FraudApi(api_client())

    decline_request = FraudDeclineEmailRequest()
    decline_request.email = 'chargeback-charlie@example.com'

    fraud_api.decline_email(decline_request)

    print(f"Declined email: {decline_request.email}")


if __name__ == "__main__":
    decline_email()
