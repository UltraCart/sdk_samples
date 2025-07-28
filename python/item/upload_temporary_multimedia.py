import io
import pprint

from ultracart import ApiException
from ultracart.apis import ItemApi
from ultracart.model.item_content import ItemContent
from ultracart.model.item_content_multimedia import ItemContentMultimedia

from samples import api_client
from item_functions import insert_sample_item


def update_item():
    try:
        # Insert a sample item
        item_id = insert_sample_item()
        # Create Item API client
        item_api = ItemApi(api_client())

        with open('./ultracart_icon.png', 'rb') as file:


            file_blob = io.BytesIO(file.read())
            file_blob.name = 'ultracart_icon.png'

            # upload the file and get the resultant oid
            upload_response = item_api.upload_temporary_multimedia(file = file_blob)
            pprint.pprint(upload_response)

            temp_oid = upload_response['temp_multimedia']['temp_multimedia_oid']

            # Expand pricing information
            expand = "content.multimedia"
            get_response = item_api.get_item_by_merchant_item_id(merchant_item_id = item_id, expand = expand)
            item = get_response['item']

            content = item['content']
            if content is None:
                content = ItemContent()
                item['content'] = content

            multimedia = content['multimedia']
            if multimedia is None:
                multimedia = []
                content['multimedia'] = multimedia

            a_multimedia = ItemContentMultimedia()
            a_multimedia.file_name = 'ultracart_icon.png'
            a_multimedia.description = 'ultracart icon'
            a_multimedia.temp_multimedia_oid = temp_oid
            multimedia.append(a_multimedia)

            # this DOES work
            b_multimedia = ItemContentMultimedia()
            b_multimedia.file_name = 'universe.png'
            b_multimedia.code = 'universe'
            b_multimedia.description = 'some random NASA picture'
            b_multimedia.url = 'https://www.nasa.gov/wp-content/uploads/2022/07/web_first_images_release.png?resize=2000,1158'
            multimedia.append(b_multimedia)

            update_response = item_api.update_item(merchant_item_oid = item.merchant_item_oid, item = item, expand = expand)

            pprint.pprint(update_response)



    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        return "Error updating item", 500


if __name__ == '__main__':
    update_item()

