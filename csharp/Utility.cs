namespace SdkSample
{
    public class Utility
    {
        public static void DumpObject(object obj, string name)
        {
            using (var writer = new System.IO.StringWriter())
            {
                ObjectDumper.Dumper.Dump(obj, name, writer);
                System.Console.Write(writer.ToString());
            }            
        }
    }
}