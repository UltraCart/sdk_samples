# Import the os module, for the os.walk function
import os


# Set the directory you want to start from
rootDir = '.'
for dirName, subdirList, fileList in os.walk(rootDir):
    resource = dirName[2:]
    api = resource.capitalize() + 'Api'
    print('Found API: %s' % api)
    for fname in fileList:
        classname = fname[:len(fname) - 3]
        fullpath = dirName + '\\' + fname
        print('\t%s->%s, %s' %(api, classname, fullpath))

        is_empty = os.stat(fullpath).st_size == 0
        if(is_empty and fullpath.endswith('.cs') and dirName != '.'):

            # open the file.
            f = open(fullpath, "w")

            # write to it.
            f.write("""


using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.{pkg}
{{
    public class {classname}
    {{

        [Test]
        public void ExecuteTest()
        {{
            //TODO-PT
        }}

        public static void {classname}Call()
        {{
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
            var api = new {api}(simpleKey);
        }}


    }}
}}
""".format(pkg=resource, api=api, classname=classname))

            f.close()
