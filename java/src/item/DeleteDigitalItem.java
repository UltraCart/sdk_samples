package item;

public class DeleteDigitalItem {
   public static void execute() {
       try {
           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null);
           ItemFunctions.deleteSampleDigitalItem(digitalItemOid);

       } catch (Exception e) {
           System.err.println("An Exception occurred. Please review the following error:");
           e.printStackTrace();
           System.exit(1);
       }
   }
}