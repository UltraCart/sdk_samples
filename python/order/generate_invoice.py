from ultracart.apis import OrderApi
from samples import api_client
import base64

# Create Order API instance
order_api = OrderApi(api_client())

# Define order ID
order_id = 'DEMO-0009104976'

# Generate invoice (returns a base64-encoded PDF)
api_response = order_api.generate_invoice(order_id)
base64_pdf = api_response.pdf_base64

# Decode and save the PDF
decoded_pdf = base64.b64decode(base64_pdf)
with open('invoice.pdf', 'wb') as pdf_file:
    pdf_file.write(decoded_pdf)

print("Invoice PDF saved as 'invoice.pdf'.")
