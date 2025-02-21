package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ItemFunctions {

  public static String insertSampleItem() throws ApiException {
    Random random = new Random();
    String chars = "ABCDEFGH";
    char[] stringChars = new char[chars.length()];

    for (int i = 0; i < stringChars.length; i++) {
      stringChars[i] = chars.charAt(random.nextInt(chars.length()));
    }

    String rand = new String(stringChars);
    String itemId = "sample_" + rand;

    System.out.println("InsertSampleItem will attempt to create item " + itemId);
    ItemApi itemApi = new ItemApi(Constants.API_KEY);

    Item newItem = new Item();
    newItem.setMerchantItemId(itemId);

    ItemPricing pricing = new ItemPricing();
    pricing.setCost(BigDecimal.valueOf(9.99));
    newItem.setPricing(pricing);

    newItem.setDescription("Sample description for item " + itemId);

    ItemContentMultimedia multimedia = new ItemContentMultimedia();
    multimedia.setUrl("https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png");
    multimedia.setCode("default");
    multimedia.setDescription("Some random image i nabbed from wikipedia");

    ItemContent content = new ItemContent();
    List<ItemContentMultimedia> multimediaList = new ArrayList<>();
    multimediaList.add(multimedia);
    content.setMultimedia(multimediaList);
    newItem.setContent(content);

    String expand = "content.multimedia";

    System.out.println("InsertItem request object follows:");
    System.out.println(newItem);

    ItemResponse apiResponse = itemApi.insertItem(newItem, expand, false);

    System.out.println("InsertItem response object follows:");
    System.out.println(apiResponse);

    return apiResponse.getItem().getMerchantItemId();
  }

  public static int insertSampleItemAndGetOid() throws ApiException {
    Random random = new Random();
    String chars = "ABCDEFGH";
    char[] stringChars = new char[chars.length()];

    for (int i = 0; i < stringChars.length; i++) {
      stringChars[i] = chars.charAt(random.nextInt(chars.length()));
    }

    String rand = new String(stringChars);
    String itemId = "sample_" + rand;

    System.out.println("InsertSampleItem will attempt to create item " + itemId);
    ItemApi itemApi = new ItemApi(Constants.API_KEY);

    Item newItem = new Item();
    newItem.setMerchantItemId(itemId);

    ItemPricing pricing = new ItemPricing();
    pricing.setCost(BigDecimal.valueOf(9.99));
    newItem.setPricing(pricing);

    newItem.setDescription("Sample description for item " + itemId);

    ItemContentMultimedia multimedia = new ItemContentMultimedia();
    multimedia.setUrl("https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png");
    multimedia.setCode("default");
    multimedia.setDescription("Some random image i nabbed from wikipedia");

    ItemContent content = new ItemContent();
    List<ItemContentMultimedia> multimediaList = new ArrayList<>();
    multimediaList.add(multimedia);
    content.setMultimedia(multimediaList);
    newItem.setContent(content);

    String expand = "content.multimedia";

    System.out.println("InsertItem request object follows:");
    System.out.println(newItem);

    ItemResponse apiResponse = itemApi.insertItem(newItem, expand, false);

    System.out.println("InsertItem response object follows:");
    System.out.println(apiResponse);

    return apiResponse.getItem().getMerchantItemOid();
  }

  public static void deleteSampleItemByOid(int merchantItemOid) throws ApiException {
    ItemApi itemApi = new ItemApi(Constants.API_KEY);
    System.out.println("Calling DeleteItem(" + merchantItemOid + ")");
    itemApi.deleteItem(merchantItemOid);
  }

  public static void deleteSampleItem(String merchantItemId) throws ApiException {
    ItemApi itemApi = new ItemApi(Constants.API_KEY);
    int merchantItemOid = itemApi.getItemByMerchantItemId(merchantItemId, null, false).getItem().getMerchantItemOid();

    System.out.println("Calling DeleteItem(" + merchantItemOid + ")");
    itemApi.deleteItem(merchantItemOid);
  }

  public static int insertSampleDigitalItem(String externalId) throws ApiException {
    String imageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg";

    ItemDigitalItem digitalItem = new ItemDigitalItem();
    digitalItem.setImportFromUrl(imageUrl);
    digitalItem.setDescription("The Earth");
    digitalItem.setClickWrapAgreement("By purchasing this item, you agree that it is Earth");

    if (externalId != null) {
      digitalItem.setExternalId(externalId);
    }

    System.out.println("InsertDigitalItem request object follows:");
    System.out.println(digitalItem);

    ItemApi itemApi = new ItemApi(Constants.API_KEY);
    ItemDigitalItemResponse apiResponse = itemApi.insertDigitalItem(digitalItem);

    System.out.println("InsertDigitalItem response object follows:");
    System.out.println(apiResponse);

    return apiResponse.getDigitalItem().getDigitalItemOid();
  }

  public static void deleteSampleDigitalItem(int digitalItemOid) throws ApiException {
    ItemApi itemApi = new ItemApi(Constants.API_KEY);

    System.out.println("Calling DeleteDigitalItem(" + digitalItemOid + ")");
    itemApi.deleteDigitalItem(digitalItemOid);
  }
}