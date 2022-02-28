package common;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSON {

  public static String toJSON(Object obj){
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    return gson.toJson(obj);
  }

}
