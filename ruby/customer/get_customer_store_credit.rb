#!/usr/bin/env ruby

require 'ultracart_api'
require_relative '../constants'
require_relative './customer_functions'

=begin
    getCustomerStoreCredit returns back the store credit for a customer, which includes:
    total - lifetime credit
    available - currently available store credit
    vesting - amount of store credit vesting
    expiring - amount of store credit expiring within 30 days
    pastLedgers - transaction history
    futureLedgers - future transactions including expiring entries
=end

begin
  # Initialize the customer API
  customer_api = UltracartClient::CustomerApi.new_using_api_key(Constants::API_KEY)

  # Create a customer
  customer_oid = insert_sample_customer

  # Add some store credit
  add_request = UltracartClient::CustomerStoreCreditAddRequest.new(
    description: 'First credit add',
    vesting_days: 10,
    expiration_days: 20, # that's not a lot of time!
    amount: 20
  )
  customer_api.add_customer_store_credit(customer_oid, add_request)

  # Add more store credit
  add_request = UltracartClient::CustomerStoreCreditAddRequest.new(
    description: 'Second credit add',
    vesting_days: 0, # immediately available
    expiration_days: 90,
    amount: 40
  )
  customer_api.add_customer_store_credit(customer_oid, add_request)

  # Retrieve store credit
  api_response = customer_api.get_customer_store_credit(customer_oid)
  store_credit = api_response.customer_store_credit

  # Output store credit details
  p store_credit # There's a lot of information inside this object

  # Clean up this sample
  delete_sample_customer(customer_oid)

rescue UltracartClient::ApiError => e
  puts 'An ApiError occurred. Please review the following error:'
  p e
  exit 1
end
