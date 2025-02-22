require 'ultracart_api'
require_relative '../constants'

=begin
    getEmailVerificationToken and validateEmailVerificationToken are tandem functions that allow a merchant to verify
    a customer's email address. getEmailVerificationToken returns back a token that the merchant can use however
    they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
    it back into a website.  Once the customer enters the token back into a site (along with their email),
    validateEmailVerificationToken will validate the token.

    Notice that getEmailVerificationToken requires both the email and password.
=end

# Initialize the customer API
customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

# Set email and password
email = "test@ultracart.com"
password = "squirrel"

# Create token request
token_request = UltracartClient::EmailVerifyTokenRequest.new(
  email: email,
  password: password
)

# Get email verification token
token_response = customer_api.get_email_verification_token(token_request)
token = token_response.token

# TODO - email the token to the customer, have them enter it back into another page...
# TODO - verify the token with the following call

# Create verify request
verify_request = UltracartClient::EmailVerifyTokenValidateRequest.new(
  token: token
)

# Validate email verification token
verify_response = customer_api.validate_email_verification_token(verify_request)

# Print verification result
puts "Was the correct token provided? #{verify_response.success}"