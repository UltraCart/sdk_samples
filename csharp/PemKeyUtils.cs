using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace SdkSample {
  public class PemKeyUtils {
        
    public static RSACryptoServiceProvider GetRsaProviderFromPublicKey( string pemString )
    {
        var pemkey = DecodeOpenSslPublicKey( pemString );

        return pemkey == null ? null : DecodeX509PublicKey( pemkey );

    }



    //--------   Get the binary RSA PUBLIC key   --------
      private static byte[] DecodeOpenSslPublicKey( string instr )
    {
        const string pempubheader = "-----BEGIN PUBLIC KEY-----";
        const string pempubfooter = "-----END PUBLIC KEY-----";
        string pemString = instr.Trim();
        byte[] binkey;
        if (!pemString.StartsWith( pempubheader ) || !pemString.EndsWith( pempubfooter ))
            return null;
        StringBuilder sb = new StringBuilder( pemString );
        sb.Replace( pempubheader, "" );  //remove headers/footers, if present
        sb.Replace( pempubfooter, "" );

        string pubstr = sb.ToString().Trim();   //get string after removing leading/trailing whitespace

        try
        {
            binkey = Convert.FromBase64String( pubstr );
        }
        catch (FormatException)
        {       //if can't b64 decode, data is not valid
            return null;
        }
        return binkey;
    }

    static RSACryptoServiceProvider DecodeX509PublicKey(byte[] x509Key)
    {
        // encoded OID sequence for  PKCS #1 rsaEncryption szOID_RSA_RSA = "1.2.840.113549.1.1.1"
        byte[] seqOid = { 0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01, 0x05, 0x00 };
        // ---------  Set up stream to read the asn.1 encoded SubjectPublicKeyInfo blob  ------
        using (var mem = new MemoryStream(x509Key))
        {
            using (var binr = new BinaryReader(mem))    //wrap Memory Stream with BinaryReader for easy reading
            {
                try
                {
                    var twobytes = binr.ReadUInt16();
                    switch (twobytes)
                    {
                        case 0x8130:
                            binr.ReadByte();    //advance 1 byte
                            break;
                        case 0x8230:
                            binr.ReadInt16();   //advance 2 bytes
                            break;
                        default:
                            return null;
                    }

                    var seq = binr.ReadBytes(15);
                    if (!CompareByteArrays(seq, seqOid))  //make sure Sequence for OID is correct
                        return null;

                    twobytes = binr.ReadUInt16();
                    if (twobytes == 0x8103) //data read as little endian order (actual data order for Bit String is 03 81)
                        binr.ReadByte();    //advance 1 byte
                    else if (twobytes == 0x8203)
                        binr.ReadInt16();   //advance 2 bytes
                    else
                        return null;

                    var bt = binr.ReadByte();
                    if (bt != 0x00)     //expect null byte next
                        return null;

                    twobytes = binr.ReadUInt16();
                    if (twobytes == 0x8130) //data read as little endian order (actual data order for Sequence is 30 81)
                        binr.ReadByte();    //advance 1 byte
                    else if (twobytes == 0x8230)
                        binr.ReadInt16();   //advance 2 bytes
                    else
                        return null;

                    twobytes = binr.ReadUInt16();
                    byte lowbyte;
                    byte highbyte = 0x00;

                    if (twobytes == 0x8102) //data read as little endian order (actual data order for Integer is 02 81)
                        lowbyte = binr.ReadByte();  // read next bytes which is bytes in modulus
                    else if (twobytes == 0x8202)
                    {
                        highbyte = binr.ReadByte(); //advance 2 bytes
                        lowbyte = binr.ReadByte();
                    }
                    else
                        return null;
                    byte[] modint = { lowbyte, highbyte, 0x00, 0x00 };   //reverse byte order since asn.1 key uses big endian order
                    int modsize = BitConverter.ToInt32(modint, 0);

                    byte firstbyte = binr.ReadByte();
                    binr.BaseStream.Seek(-1, SeekOrigin.Current);

                    if (firstbyte == 0x00)
                    {   //if first byte (highest order) of modulus is zero, don't include it
                        binr.ReadByte();    //skip this null byte
                        modsize -= 1;   //reduce modulus buffer size by 1
                    }

                    byte[] modulus = binr.ReadBytes(modsize); //read the modulus bytes

                    if (binr.ReadByte() != 0x02)            //expect an Integer for the exponent data
                        return null;
                    int expbytes = binr.ReadByte();        // should only need one byte for actual exponent data (for all useful values)
                    byte[] exponent = binr.ReadBytes(expbytes);

                    // We don't really need to print anything but if we insist to...
                    //showBytes("\nExponent", exponent);
                    //showBytes("\nModulus", modulus);

                    // ------- create RSACryptoServiceProvider instance and initialize with public key -----
                    RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
                    RSAParameters rsaKeyInfo = new RSAParameters
                    {
                        Modulus = modulus,
                        Exponent = exponent
                    };
                    rsa.ImportParameters(rsaKeyInfo);
                    return rsa;
                }
                catch (Exception)
                {
                    return null;
                }
            }
        }
    }


      private static bool CompareByteArrays( byte[] a, byte[] b )
    {
        if (a.Length != b.Length)
            return false;
        var i = 0;
        foreach (var c in a)
        {
            if (c != b[i])
                return false;
            i++;
        }
        return true;
    }
   
    
  }
}