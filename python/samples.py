import ultracart
from ultracart import ApiClient


def api_client():
    config = ultracart.Configuration()
    # this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
    # Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    config.api_key['x-ultracart-simple-key'] \
        = '1a113c75e3c71d0196b190e432200101854560d799f1cc0196b190e432200101'
    config.debug = False
    config.verify_ssl = False  # Development only.  Set to True for production.

    client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
    return client

def channel_partner_api_client():
    config = ultracart.Configuration()
    # this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
    # Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    config.api_key['x-ultracart-simple-key'] \
        = '1a113c75e3c71d0196b190e432200101854560d799f1cc0196b190e432200101'
    config.debug = False
    config.verify_ssl = True  # Development only.  Set to True for production.

    client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
    return client
