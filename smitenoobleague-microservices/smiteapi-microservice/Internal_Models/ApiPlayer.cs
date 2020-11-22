using System;
namespace smiteapi_microservice.Internal_Models
{
    public class ApiPlayer
    {
        public string Name { get; set; }
        public int player_id { get; set; }
        public ApiPlatformEnum portal_id { get; set; }
        public object ret_msg { get; set; }
    }
}
