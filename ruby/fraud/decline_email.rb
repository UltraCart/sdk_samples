# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# decline_email is a shortcut for telling UltraCart to decline orders from a specific email
# address.  It is the quick alternative to building a full "address email" fraud rule by hand.

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

decline_request = UltracartClient::FraudDeclineEmailRequest.new(
  email: 'chargeback-charlie@example.com'
)

fraud_api.decline_email(decline_request)

puts "Declined email: #{decline_request.email}"
