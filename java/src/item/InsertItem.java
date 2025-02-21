package item;

public class InsertItem {
   public static void execute() {
       try {
           String itemId = ItemFunctions.insertSampleItem();
           ItemFunctions.deleteSampleItem(itemId);
       }
       catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           System.out.println(e.toString()); // handle gracefully
           System.exit(1);
       }
   }
}