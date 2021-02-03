# frozen_string_literal: true

class UltracartService
  require 'net/http'
  require 'json'
  require 'ultracart_api'
  # attr_reader :params
  #
  # def initialize(params)
  #   @account = params[:account]
  # end

  def retrieve_customer
    simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00'
    customer_api = UltracartClient::CustomerApi.new_using_api_key(simple_key, false, true)

    customer_profile_oid = 2_698_265
    # customer_profile_oid = @account.profile.ultracart_customer_profile_oid # Integer | The customer oid to retrieve.
    # opts = {_expand: "_expand_example"}
    opts = {}
    begin
      customer_api.get_customer(customer_profile_oid, opts)
    rescue UltracartClient::ApiError => e
      puts e.message
    end
  end
end

us = UltracartService.new
customer = us.retrieve_customer
puts customer.to_json

# on windows, if error of "Could not open library 'libcurl': The specified module could not be found."
# Take a libcurl.dll from one of the packages found here, https://curl.haxx.se/download.html#Win64, and put it on the PATH.
# I just put it under \ruby24\bin\
# Maybe for you it's C:\Ruby24-x64\bin
# rename the dll to just libcurl.dll if it contains _x64 in the filename.

