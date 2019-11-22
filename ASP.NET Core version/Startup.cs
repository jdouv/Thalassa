using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Thalassa.Business.Services;
using Thalassa.DataAccess;
using Thalassa.Models;
using Thalassa.Models.LegalEngineering;
using Thalassa.Models.LegalEngineering.Clauses;
using Thalassa.Models.LegalEngineering.Clauses.FixedClauses;

namespace Thalassa
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .Configure<KestrelServerOptions>(options => {options.AllowSynchronousIO = true;})
                .Configure<IISServerOptions>(options => {options.AllowSynchronousIO = true;})
                .Configure<CookiePolicyOptions>(options =>
                {
                    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                    options.CheckConsentNeeded = context => false;
                    options.MinimumSameSitePolicy = SameSiteMode.None;
                })
                .AddControllers();

            services
                .AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .Build());
                })
                .AddAuthentication(config =>
                {
                    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(config =>
                {
                    config.RequireHttpsMetadata = false;
                    config.SaveToken = true;
                    config.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey( Encoding.ASCII.GetBytes("demoSecretForJwtGeneration")),
                        ValidateIssuer = true,
                        ValidIssuer = "https://localhost:5001",
                        ValidateAudience = true,
                        ValidAudience = "https://localhost:5001",
                        RequireExpirationTime = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
            
            services
                .AddDistributedMemoryCache()
                .AddAntiforgery(options =>
                {
                    options.Cookie.Name = "Antiforgery";
                    options.HeaderName = "X-XSRF-TOKEN";
                })
                .AddSession(options =>
                {
                    options.Cookie.Name = "Session";
                    options.IdleTimeout = TimeSpan.FromMinutes(3600);
                })
                .AddScoped<IUserService, UserService>()
                .AddScoped<IBlockchainService, BlockchainService>()
                .AddScoped<ICompanyService, CompanyService>()
                .AddScoped<IVesselService, VesselService>()
                .AddScoped<IContractService, ContractService>()
                .AddScoped<UsersDataAccess>()
                .AddScoped<BlockchainDataAccess>()
                .AddScoped<CompaniesDataAccess>()
                .AddScoped<VesselsDataAccess>()
                .AddMvc()
                .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiForgery)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection()
                .UseSession()
                .UseFileServer()
                .UseCookiePolicy()
                .UseCors("CorsPolicy")
                .UseAuthentication()
                .UseAuthorization()
                .Use(next => context =>
                {
                    var jwToken = context.Session.GetString("JWToken");
                    if (string.IsNullOrEmpty(jwToken))
                        context.Request.Headers.Add("Authorization", "Bearer " + jwToken);
                    var tokens = antiForgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions { HttpOnly = false });
                    antiForgery.ValidateRequestAsync(context);
                    return next(context);
                })
                .UseRouting()
                .UseEndpoints(endpoints => { endpoints.MapControllers(); });
            
            // The following code is for demo purposes only.
            // In a production environment, only database initialization and
            // method blockchainService.InitializeBlockchain() are needed.

            using var serviceScope = app.ApplicationServices.CreateScope();
            var userService = serviceScope.ServiceProvider.GetService<IUserService>();
            var blockchainService = serviceScope.ServiceProvider.GetService<IBlockchainService>();
            var companyService = serviceScope.ServiceProvider.GetService<ICompanyService>();
            var vesselService = serviceScope.ServiceProvider.GetService<IVesselService>();

            // Set admin for demo purposes
            if (userService.FindByPosition("admin") == null)
                userService.Insert(new User
                {
                    PublicKey = "efa3036945807cc349ae55b2b503d8832c0250bb8782d32b74af6a63850fedaa",
                    FirstName = "Admin",
                    LastName = "Admin",
                    Email = "admin@example.com",
                    Position = "admin",
                    Enabled = true,
                    CorrespondingIndices = new Dictionary<string, string>()
                });

            // Set plain user for demo purposes
            var testUser = new User
            {
                PublicKey = "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446",
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Company = "1234567890",
                Position = "legalEngineer",
                Enabled = true,
                CorrespondingIndices = new Dictionary<string, string>()
            };

            // Set company vessels registry manager for demo purposes
            if (userService.FindByPosition("companyVesselsRegistryManager") == null)
                userService.Insert(new User {
                    PublicKey = "0783582ff507282b0ae01d2e1551530f347acb59180aabbbcc5ff359a7c3c323",
                    FirstName = "Bernard",
                    LastName = "Johnson",
                    Email = "bernard@example.com",
                    Company = "1234567890",
                    Position = "companyVesselsRegistryManager",
                    Enabled = true,
                    CorrespondingIndices = new Dictionary<string, string>()
                });

            // Insert dummy data (vessel) for demo purposes
            if (vesselService.FindByImoNumber("1234567890") == null)
                vesselService.Insert(new Vessel()
                {
                    ImoNumber = "1234567890",
                    Name = "e-Harmony",
                    Flag = "US",
                    Company = "1234567890",
                    YearBuilt = "2019",
                    Dwt = "300000",
                    UnderConstruction = false
                });
            
            //Set company for demo purposes
            if (companyService.FindByName("Maran Tankers Management Inc.") == null)
                companyService.Insert(new Company
                {
                    RegistryNumber = "1234567890",
                    Name = "Maran Tankers Management Inc.",
                    Type = "tankerManagementServices",
                    Email = "maran@example.com",
                    Address = "Maran Avenue 123, New York 133 00, NY, United States",
                    Vessels = new LinkedList<string>(new[] {vesselService.FindByName("e-Harmony").Id})
                });
            
            var dbUser = userService.FindByPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
            // If there is already a user with this public key
            if (dbUser != null)
                testUser = dbUser;
            else
                userService.Insert(testUser);

            blockchainService.InitializeBlockchain();

            // Insert dummy data (contract) for demo purposes
            if (blockchainService.FindLastBlock().Index != "0") return;
            var essentials = new Dictionary<string, dynamic>
            {
                ["type"] = "timeCharter",
                ["preamble"] = "THIS TIME CHARTER, made and concluded in the datetime mentioned above between the parties described in the contracting parties section, shall be performed subject to all the terms and conditions included in the clauses section along with any additional clauses and addenda.",
                ["vessel"] = "1234567890"
            };
            var clauses = new LinkedList<Clause>(new[] {FixedClausesFactory.GetOffHireClause()});
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