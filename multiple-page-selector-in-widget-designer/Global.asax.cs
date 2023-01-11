namespace SitefinityWebApp
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Security;
    using System.Web.SessionState;
    using System.Web.UI;
    using System.Web.UI.HtmlControls;
    using Telerik.Sitefinity.Abstractions;
    using Telerik.Sitefinity.Frontend.Navigation.Mvc.Models;
    using Telerik.Sitefinity.Frontend;
    using Telerik.Sitefinity.Services;
    using Telerik.Sitefinity.Web.Events;
    using Telerik.Sitefinity.Frontend.News.Mvc.Models;
    using SitefinityWebApp.Mvc.Models;
    using SitefinityWebApp.PropertyDescriptors;
    using Telerik.Sitefinity.Frontend.Mvc.Infrastructure.Controllers;

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            Bootstrapper.Bootstrapped += this.Bootstrapper_Bootstrapped;
        }
        private void Bootstrapper_Bootstrapped(object sender, EventArgs e)
        {
            // PropertyDescriptor
            ControllerSettingsPropertyDescriptorCustom.Install("Telerik.Sitefinity.Mvc.Proxy.MvcControllerProxy.Settings");
            ControllerSettingsPropertyDescriptorCustom.Install(string.Format("{0}.{1}", typeof(Telerik.Sitefinity.Mvc.Proxy.MvcProxyBase).FullName, "Settings"));
            ControllerSettingsPropertyDescriptorCustom.Install(string.Format("{0}.{1}", typeof(MvcWidgetProxy).FullName, "Settings"));

            FrontendModule.Current.DependencyResolver.Rebind<INewsModel>().To<NewsModelCustom>();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}