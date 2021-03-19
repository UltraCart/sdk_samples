# frozen_string_literal: true

require 'json'
require 'ultracart_api'

simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00'
customer_api = UltracartClient::CustomerApi.new_using_api_key(simple_key, false, false)
email = 'test@test.com'
opts = {}
customer_response = customer_api.get_customer_by_email(email, opts)
puts customer_response.to_json
