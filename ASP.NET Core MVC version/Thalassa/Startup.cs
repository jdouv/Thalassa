using System;
using System.Collections.Generic;
using System.Globalization;
using Business;
using Common;
using Common.LegalEngineering;
using Common.LegalEngineering.Clauses;
using Common.LegalEngineering.Clauses.FixedClauses;
using DataAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebEssentials.AspNetCore.Pwa;

namespace Thalassa
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services
                .AddDistributedMemoryCache() 
                .AddSession(options => { options.IdleTimeout = TimeSpan.FromMinutes(3600); })
                .AddScoped<IBlockchainService, BlockchainService>()
                .AddScoped<IUserService, UserService>()
                .AddScoped<IVesselService, VesselService>()
                .AddScoped<IContractService, ContractService>()
                .AddScoped<UsersDataAccess>()
                .AddScoped<BlockchainDataAccess>()
                .AddScoped<VesselsDataAccess>()
                .AddLocalization(options => options.ResourcesPath = "App_GlobalResources")
                .AddMvc()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            
            services.AddProgressiveWebApp(new PwaOptions
            {
                CacheId = "Worker 1.1",
                Strategy = ServiceWorkerStrategy.NetworkFirst,
                RoutesToPreCache = "/User/Index",
                RegisterServiceWorker = true,
                RegisterWebmanifest = true
            });

            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("el"),
                    new CultureInfo("en")
                };
                options.DefaultRequestCulture = new RequestCulture("en");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app
                .UseSession()
                .UseHttpsRedirection()
                .UseStaticFiles()
                .UseCookiePolicy()
                .UseMvc(routes =>
            {
                routes.MapRoute(
                    "default",
                    "{controller=User}/{action=Index}/{id?}");
            });
            
            // The following code is for demo purposes only.
            // In a production environment, only database initialization and
            // method blockchainService.InitializeBlockchain() are needed.

            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var userService = serviceScope.ServiceProvider.GetService<IUserService>();
                var blockchainService = serviceScope.ServiceProvider.GetService<IBlockchainService>();
                var vesselService = serviceScope.ServiceProvider.GetService<IVesselService>();

                // Set admin for demo purposes
                if (userService.FindByPosition("Admin") == null)
                {
                    var admin = new User
                    {
                        PublicKey = "efa3036945807cc349ae55b2b503d8832c0250bb8782d32b74af6a63850fedaa",
                        FirstName = "Admin",
                        LastName = "Admin",
                        Email = "admin@example.com",
                        Position = "Admin",
                        Enabled = true,
                        CorrespondingIndices = new Dictionary<string, string>()
                    };
                    userService.Insert(admin);
                }

                // Set plain user for demo purposes
                var testUser = new User
                {
                    PublicKey = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446",
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john@example.com",
                    Position = "Legal engineer",
                    Enabled = true,
                    CorrespondingIndices = new Dictionary<string, string>()
                };

                var dbUser = userService.FindByPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
                // If there is already a user with this public key
                if (dbUser != null)
                    testUser = dbUser;
                else
                    userService.Insert(testUser);

                blockchainService.InitializeBlockchain();
                
                // Insert dummy data (vessel) for demo purposes
                if (vesselService.FindByImoNumber("1234567890") == null)
                    vesselService.Insert(new Vessel("1234567890", "e-Harmony", "US", "2019", "300000"));

                // Insert dummy data (contract) for demo purposes
                if (blockchainService.FindLastBlock().Index != "0") return;
                var essentials = new Dictionary<string, dynamic>
                {
                    ["type"] = "timeCharter",
                    ["preamble"] = "THIS TIME CHARTER, made and concluded in the datetime mentioned above between the parties described in the contracting parties section, shall be performed subject to all the terms and conditions included in the clauses section along with any additional clauses and addenda.",
                    ["vessel"] = "1234567890"
                };
                var clauses = new LinkedList<Clause>( new[] {FixedClausesFactory.GetOffHireClause()});
                var contractNoSignatures = JsonConvert.SerializeObject(new Contract("Contract", "timeCharter", essentials, clauses));
                var signature1 = new Dictionary<string, dynamic>
                {
                    ["signature"] = CryptographyService.Sign(contractNoSignatures, "d0b2df0582f262e50dccc9f3586ded1d0560ff4b46db82806a74b2493e9b92ad"),
                    ["signer"] = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446",
                    ["onBehalfOf"] = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446"
                };
                var signature2 = new Dictionary<string, dynamic>
                {
                    ["signature"] = CryptographyService.Sign(contractNoSignatures, "d0b2df0582f262e50dccc9f3586ded1d0560ff4b46db82806a74b2493e9b92ad"),
                    ["signer"] = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446",
                    ["onBehalfOf"] = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446"
                };
                essentials["signatures"] = new List<dynamic> {signature1, signature2};
                var contract = new Contract("Contract", "timeCharter", essentials, clauses);
                var encryptedData = CryptographyService.Encrypt(JsonConvert.SerializeObject(contract));
                var newLastBlock = blockchainService.FindLastBlock();
                blockchainService.InsertBlock(new Block((Convert.ToInt64(newLastBlock.Index) + 1).ToString(), encryptedData[0], newLastBlock.Hash));
                var encryptedSecret = CryptographyService.EncryptWithPublicKey(encryptedData[1], testUser.PublicKey);
                var userCorrespondingIndices = testUser.CorrespondingIndices;
                userCorrespondingIndices[(Convert.ToInt64(newLastBlock.Index) + 1).ToString()] = encryptedSecret;
                testUser.CorrespondingIndices = userCorrespondingIndices;
                userService.Update(testUser);
            }
        }
    }
}
