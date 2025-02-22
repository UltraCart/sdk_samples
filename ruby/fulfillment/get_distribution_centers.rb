require_relative '../constants'
require 'ultracart_api'

fulfillment_api = UltracartClient::FulfillmentApi.new_using_api_key(Constants::API_KEY)

# This method returns back a list of all distribution centers configured for a merchant.
#
# You will need the distribution center (DC) code for most operations.
# UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
# This method call is an easy way to determine what a DC code is for a particular distribution center.
#
# For more information about UltraCart distribution centers, please see:
# https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

begin
  result = fulfillment_api.get_distribution_centers
  puts result.inspect

  puts "done"
rescue UltracartClient::ApiException => e
  # update inventory failed.  examine the reason.
  puts "Exception when calling FulfillmentApi->getDistributionCenters: #{e.message}"
  exit
end