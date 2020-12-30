using System;
namespace stat_microservice.Classes
{
    public class EmailSettings
    {
        //Smtp settings
        public string emailSender { get; set; }
        public string emailSenderPassword { get; set; }
        public string emailSenderHost { get; set; }
        public int emailSenderPort { get; set; }
        public bool emailIsSSL { get; set; }

        public EmailSettings(string email, string emailpw, string smtphost, int port, bool ssl)
        {
            emailSender = email;
            emailSenderPassword = emailpw;
            emailSenderHost = smtphost;
            emailSenderPort = port;
            emailIsSSL = ssl;
        }
    }
}
