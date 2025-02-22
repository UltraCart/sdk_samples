require 'ultracart_api'
require_relative '../constants'

# Possible expansion values for PricingTier object:
# - approval_notification
# - signup_notification

begin
  # Initialize the item API using the API key from constants
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Define expand options in the opts hash
  opts = {
    '_expand' => 'approval_notification,signup_notification'
  }

  # Get pricing tiers with expand options
  api_response = item_api.get_pricing_tiers(opts)

  # Print the pricing tiers
  p api_response.pricing_tiers

rescue UltracartClient::ApiError => e
  puts 'ApiException occurred.'
  p e
  exit(1)
end