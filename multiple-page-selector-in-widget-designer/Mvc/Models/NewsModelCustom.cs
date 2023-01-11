namespace SitefinityWebApp.Mvc.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Telerik.Sitefinity.Frontend.News.Mvc.Models;

    public class NewsModelCustom : NewsModel
    {
        public string SelectedPageLinksItems { get; set; }
        public string SelectedPageLinksIds { get; set; }
        public string StringifiedPageLinksIds { get; set; }
        public string StringifiedPageLinksItems { get; set; }
    }
}