using System;  
using System.Text;  
using System.Security.Cryptography;  
namespace HashConsoleApp  
{  
    class Program  
    {  
        static void Main(string[] args)  
        {  
            string plainData = "Test";  
            Console.WriteLine("Raw data: {0}", plainData);  
            Console.WriteLine("Raw data length: {0}", plainData.Length);
            string hashedData = ComputeSha256Hash(plainData);  
            Console.WriteLine("Hash {0}", hashedData);  
            Console.WriteLine("Hash length: {0}", hashedData.Length);
            Console.WriteLine(ComputeSha256Hash("Test"));  
            Console.ReadLine();  
        }  
  
        static string ComputeSha256Hash(string rawData)  
        {  
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())  
            {  
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));  
  
                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();  
                for (int i = 0; i < bytes.Length; i++)  
                {  
                    builder.Append(bytes[i].ToString("x2"));  
                }  
                return builder.ToString();  
            }  
        }  
                 
    }  
  
} 