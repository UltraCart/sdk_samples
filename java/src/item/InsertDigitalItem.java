package item;

public class InsertDigitalItem {
   /// <summary>
   /// Execute method containing all business logic
   /// </summary>
   public static void execute() {
       try {
           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null);
           ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
       }
       catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           System.out.println(e.toString()); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}