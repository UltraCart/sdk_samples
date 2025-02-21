from ultracart.apis import CustomerApi
from ultracart.models import EmailVerifyTokenRequest, EmailVerifyTokenValidateRequest

from samples import api_client


def email_verification_demo():
    """
    Demonstrates the email verification token process:
    1. Get an email verification token
    2. Validate the token

    In a real-world scenario, you would:
    - Email the token to the customer
    - Have the customer enter the token back into your system
    """
    # Create API client
    customer_api = CustomerApi(api_client())

    # Email and password for verification
    email = "test@ultracart.com"
    password = "squirrel"

    # Create token request
    token_request = EmailVerifyTokenRequest(
        email=email,
        password=password
    )

    try:
        # Get email verification token
        token_response = customer_api.get_email_verification_token(token_request)
        token = token_response.token

        # TODO: In a real application, email this token to the customer

        # Verify the token
        verify_request = EmailVerifyTokenValidateRequest(
            token=token
        )
        verify_response = customer_api.validate_email_verification_token(verify_request)

        # Print verification result
        print(f'Was the correct token provided? {verify_response.success}')

    except Exception as e:
        print("An error occurred during email verification:")
        print(e)


# Run the demo if script is executed directly
if __name__ == '__main__':
    email_verification_demo()