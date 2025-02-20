import ultracart
from ultracart import ApiClient


def api_client():
    config = ultracart.Configuration()
    # this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
    # Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    config.api_key['x-ultracart-simple-key'] \
        = '2314b35a44240c019249c739b5500100a88dd4aae0f872019249c739b5500100'
    config.debug = False
    config.verify_ssl = True  # Development only.  Set to True for production.

    client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
    return client
