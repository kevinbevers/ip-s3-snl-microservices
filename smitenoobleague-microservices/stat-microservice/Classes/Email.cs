using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace stat_microservice.Classes
{
    public class Email
    {
        //Smtp settings
        private readonly string _emailSender;
        private readonly string _emailSenderPassword;
        private readonly string _emailSenderHost;
        private readonly int _emailSenderPort;
        private readonly bool _emailIsSSL;
        private readonly IWebHostEnvironment _env;

        public Email(EmailSettings s, IWebHostEnvironment env)
        {
            _env = env;
            _emailSender = s.emailSender;
            _emailSenderPassword = s.emailSenderPassword;
            _emailSenderHost = s.emailSenderHost;
            _emailSenderPort = s.emailSenderPort;
            _emailIsSSL = s.emailIsSSL;
        }

        public async Task<bool> SendMail(string receiver, string msg, string title)
        {
            //Fetching Email Body Text from EmailTemplate File.
            string _filePath = _env.ContentRootPath;
            StreamReader str = new StreamReader(_filePath + "/EmailTemplate.html");
            string MailText = str.ReadToEnd();
            str.Close();
            //Replace [placeholder] placeholder with the neccessary msg
            MailText = MailText.Replace("[text]", msg);
            MailText = MailText.Replace("[title]", title);
            //Base class for sending email  
            MailMessage mailmsg = new MailMessage();
            //Make TRUE because our body text is html  
            mailmsg.IsBodyHtml = true;
            mailmsg.From = new MailAddress(_emailSender);
            //Receiver of the email
            mailmsg.To.Add(receiver);
            mailmsg.Subject = title;
            mailmsg.Body = MailText;

            //Create Smtp mail client
            SmtpClient emailClient = new SmtpClient();
            emailClient.Host = _emailSenderHost;
            emailClient.Port = _emailSenderPort;
            emailClient.EnableSsl = _emailIsSSL;
            NetworkCredential _network = new NetworkCredential(_emailSender, _emailSenderPassword);
            emailClient.Credentials = _network;

            try
            {
                //Send email
                await emailClient.SendMailAsync(mailmsg);

                return true;
            }
            catch
            {
                //email not send because of error
                return false;
            }
        }
    }
}
