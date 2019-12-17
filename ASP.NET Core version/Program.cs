using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Thalassa
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            Host.CreateDefaultBuilder(args)
                .UseWindowsService()
                .UseSystemd()
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .Build().Run();
        }
    }
}