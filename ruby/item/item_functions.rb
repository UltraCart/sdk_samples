require 'ultracart_api'
require_relative '../constants'

# Insert a sample item and return the newly created item id
def insert_sample_item
  # Generate a random item ID
  item_id = "sample_#{('A'..'H').to_a.shuffle.join}"
  puts "insertSampleItem will attempt to create item #{item_id}"

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Create a new item
  new_item = UltracartClient::Item.new
  new_item.merchant_item_id = item_id

  # Set pricing
  pricing = UltracartClient::ItemPricing.new
  pricing.cost = 9.99
  new_item.pricing = pricing

  # Set description
  new_item.description = "Sample description for item #{item_id}"

  # Create multimedia content
  multimedia = UltracartClient::ItemContentMultimedia.new
  multimedia.url = 'https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png'
  multimedia.code = 'default' # Use 'default' to make this the default item
  multimedia.description = 'Some random image i nabbed from wikipedia'

  # Set content
  content = UltracartClient::ItemContent.new
  content.multimedia = [multimedia] # Notice this is an array
  new_item.content = content

  # Prepare options hash with expand
  opts = { '_expand' => 'content.multimedia' }

  # Print request object
  puts 'insertItem request object follows:'
  p new_item

  # Insert item
  api_response = item_api.insert_item(new_item, opts)

  # Print response object
  puts 'insertItem response object follows:'
  p api_response

  # Return the item ID
  item_id
end

# Insert a sample item and return its OID (Object ID)
def insert_sample_item_and_get_oid
  # Generate a random item ID
  item_id = "sample_#{('A'..'H').to_a.shuffle.join}"
  puts "insertSampleItem will attempt to create item #{item_id}"

  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Create a new item
  new_item = UltracartClient::Item.new
  new_item.merchant_item_id = item_id

  # Set pricing
  pricing = UltracartClient::ItemPricing.new
  pricing.cost = 9.99
  new_item.pricing = pricing

  # Set description
  new_item.description = "Sample description for item #{item_id}"

  # Create multimedia content
  multimedia = UltracartClient::ItemContentMultimedia.new
  multimedia.url = 'https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png'
  multimedia.code = 'default' # Use 'default' to make this the default item
  multimedia.description = 'Some random image i nabbed from wikipedia'

  # Set content
  content = UltracartClient::ItemContent.new
  content.multimedia = [multimedia] # Notice this is an array
  new_item.content = content

  # Prepare options hash with expand
  opts = { '_expand' => 'content.multimedia' }

  # Print request object
  puts 'insertItem request object follows:'
  p new_item

  # Insert item
  api_response = item_api.insert_item(new_item, opts)

  # Print response object
  puts 'insertItem response object follows:'
  p api_response

  # Return the merchant item OID
  api_response.item.merchant_item_oid
end

# Delete a sample item by its OID
def delete_sample_item_by_oid(merchant_item_oid)
  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Print deletion message
  puts "calling deleteItem(#{merchant_item_oid})"

  # Delete the item
  item_api.delete_item(merchant_item_oid)
end

# Delete a sample item by its Item ID
def delete_sample_item(item_id)
  # Initialize the Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Print informational messages
  puts 'deleteItem takes the item oid (internal unique identifier), so we need to retrieve the item first to delete'
  puts "attempting to retrieve the item object for item id #{item_id}"

  # Retrieve the item
  opts = { '_expand' => nil }
  api_response = item_api.get_item_by_merchant_item_id(item_id, opts)
  item = api_response.item

  # Print retrieved item
  puts 'The following object was retrieved:'
  p item

  # Get the merchant item OID
  merchant_item_oid = item.merchant_item_oid

  # Print and perform deletion
  puts "calling deleteItem(#{merchant_item_oid})"
  item_api.delete_item(merchant_item_oid)
end

# Insert a sample digital item
def insert_sample_digital_item(external_id = nil)
  # Set image URL
  image_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg'

  # Create digital item
  digital_item = UltracartClient::ItemDigitalItem.new
  digital_item.import_from_url = image_url
  digital_item.description = "The Earth"
  digital_item.click_wrap_agreement = "By purchasing this item, you agree that it is Earth"

  # Set external ID if provided
  digital_item.external_id = external_id unless external_id.nil?

  # Print request object
  puts 'insertDigitalItem request object follows:'
  p digital_item

  # Initialize Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Insert digital item
  opts = { '_expand' => nil }
  api_response = item_api.insert_digital_item(digital_item, opts)

  # Print response object
  puts 'insertDigitalItem response object follows:'
  p api_response

  # Return the digital item OID
  api_response.digital_item.digital_item_oid
end

# Delete a sample digital item by its OID
def delete_sample_digital_item(digital_item_oid)
  # Initialize Item API
  item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

  # Print deletion message
  puts "calling deleteItem(#{digital_item_oid})"

  # Delete the digital item
  item_api.delete_digital_item(digital_item_oid)
end