using System;
using System.Collections.Generic;
using System.Text;

namespace smiteapi_microservice.Internal_Models
{
    public partial class ApiItem
    {
        public string ActiveFlag { get; set; }
        public long ChildItemId { get; set; }
        public string DeviceName { get; set; }
        public long IconId { get; set; }
        public ItemDescription ItemDescription { get; set; }
        public int ItemId { get; set; }
        public long ItemTier { get; set; }
        public int Price { get; set; }
        public string RestrictedRoles { get; set; }
        public long RootItemId { get; set; }
        public string ShortDesc { get; set; }
        public bool StartingItem { get; set; }
        public string Type { get; set; }
        public Uri ItemIcon_Url { get; set; }
        public object ret_msg { get; set; }
    }

    public partial class ItemDescription
    {
        public string Description { get; set; }
        public List<Menuitem> Menuitems { get; set; }
        public object SecondaryDescription { get; set; }
    }

    public partial class Menuitem
    {
        public string Description { get; set; }
        public string Value { get; set; }
    }
}
