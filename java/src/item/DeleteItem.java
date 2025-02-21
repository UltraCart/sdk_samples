package item;

public class DeleteItem {
  public static void execute() {
    try {
      int itemOid = ItemFunctions.insertSampleItemAndGetOid();
      ItemFunctions.deleteSampleItemByOid(itemOid);

    } catch (Exception e) {
      System.err.println("An Exception occurred. Please review the following error:");
      e.printStackTrace();
      System.exit(1);
    }
  }
}