using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Business;
using CaseExtensions;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Thalassa.App_GlobalResources;

namespace Thalassa.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View("~/Views/Home/Index.cshtml");
        }

        [HttpGet]
        public IActionResult Welcome()
        {
            return PartialView("~/Views/Home/Index.cshtml");
        }
        
        // Checks if anyone is logged in
        [HttpGet]
        public bool IsLoggedIn()
        {
            return HttpContext.Session.GetString("loggedInPrivateKey") != null;
        }

        // Adjusts service’s language based on user’s selection
        [HttpPost]
        public void SetLanguage()
        {
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                Response.Cookies.Append(
                    CookieRequestCultureProvider.DefaultCookieName,
                    CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(reader.ReadToEnd())),
                    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
                );
            }
        }
        
        // Checks if the e-mail provided by the user during registration already exists and returns boolean
        [HttpPost]
        public bool EmailExists()
        {
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                return _userService.FindByEmail(reader.ReadToEnd()) != null;
            }
        }

        // Generates user’s public and private keys
        [HttpPost]
        public IActionResult GenerateKeys()
        {
            string[] keys;
            // Generate keys and check if public key is already used
            do keys = CryptographyService.GenerateKeys();
            while (_userService.FindByPublicKey(keys[0]) != null);
            ViewData["PublicKey"] = keys[0];
            ViewData["PrivateKey"] = keys[1];

            return PartialView("~/Views/Home/GeneratedKeys.cshtml");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return PartialView("~/Views/Home/Register.cshtml");
        }

        // Validates registration form before final registration
        [HttpPost]
        public bool RegisterIsValid()
        {
            ModelState.Remove("PublicKey");
            ModelState.Remove("PrivateKey");
            return ModelState.IsValid;
        }
        
        [HttpPost, ValidateAntiForgeryToken, ActionName("Register")]
        public IActionResult RegisterPost(User user)
        {
            // Check if e-mail is already in use
            if (user.Email != null)
            {
                if (_userService.FindByEmail(user.Email) != null)
                    ModelState.AddModelError(user.Email, Messages.Error_EmailAlreadyInUse);
            }

            if (ModelState.IsValid)
            {
                HttpContext.Session.SetString("loggedInPrivateKey", user.PrivateKey);
                HttpContext.Session.SetString("position", user.Position.ToPascalCase());
                ViewData["status"] = "success";
                _userService.Insert(user);
                return RedirectToAction("Dashboard", "User");
            }

            ViewData["status"] = "error";
            return PartialView("~/Views/Home/Register.cshtml", user);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return PartialView("~/Views/Home/Login.cshtml");
        }

        [HttpPost, ValidateAntiForgeryToken, ActionName("Login")]
        public IActionResult LoginPost(User user)
        {
            ModelState.Remove("FirstName");
            ModelState.Remove("LastName");
            ModelState.Remove("PublicKey");
            ModelState.Remove("Email");
            ModelState.Remove("Position");

            if (user.PrivateKey != null)
            {
                if (new Regex("^[0-9a-fA-F]+$").IsMatch(user.PrivateKey) && user.PrivateKey.Length % 2 == 0)
                {
                    if (_userService.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(user.PrivateKey)) == null)
                        ModelState.AddModelError(user.PrivateKey, Messages.Error_NoUserWithSuchCredentials);
                }
                else
                    ModelState.AddModelError(user.PrivateKey, Messages.Error_PrivateKeyInvalid);
            }

            if (ModelState.IsValid)
            {
                HttpContext.Session.SetString("loggedInPrivateKey", user.PrivateKey);
                var position = _userService.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(user.PrivateKey)).Position;
                HttpContext.Session.SetString("position", position.ToPascalCase());
                ViewData["status"] = "success";
                return RedirectToAction("Dashboard", "User");
            }

            ViewData["status"] = "error";
            return PartialView("~/Views/Home/Login.cshtml", user);
        }
        
        [HttpGet]
        public IActionResult Dashboard()
        {
            var privateKey = HttpContext.Session.GetString("loggedInPrivateKey");
            var user = _userService.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(privateKey));
            var firstName = user.FirstName;
            var position = user.Position.ToPascalCase();
            ViewData["status"] = "success";
            ViewData["FirstName"] = firstName;
            return PartialView("~/Views/Dashboards/" + position + "/Dashboard" + position + ".cshtml");
        }
        
        // Returns right navbar section after login
        [HttpGet, ActionName("RightNavLogin")]
        public IActionResult RenderRightNavLogin()
        {
            return PartialView("~/Views/Navbar/RightNavLogin.cshtml");
        }

        // Returns right navbar section after logout
        [HttpGet, ActionName("RightNavLogout")]
        public IActionResult RenderRightNavLogout()
        {
            return PartialView("~/Views/Navbar/MainRightNav.cshtml");
        }

        // Adjusts navbar after logout
        [HttpGet, ActionName("MainNavbarLogout")]
        public IActionResult RenderNavbarLogout()
        {
            HttpContext.Session.Remove("loggedInPrivateKey");
            HttpContext.Session.Remove("position");
            HttpContext.Session.Clear();
            foreach (var cookie in Request.Cookies.Keys)
                Response.Cookies.Delete(cookie);
            return PartialView("~/Views/Navbar/MainNavbar.cshtml");
        }

        // Returns basic navbar (when no one is logged in)
        [HttpGet, ActionName("NavbarRegisterLogin")]
        public IActionResult NavbarRegisterLogin()
        {
            return PartialView("~/Views/Navbar/NavbarRegisterLogin.cshtml");
        }

        // Returns logged in user’s navbar (if no one is logged in, returns register-login navbar)
        [HttpGet]
        public IActionResult UserNavbar()
        {
            var privateKey = HttpContext.Session.GetString("loggedInPrivateKey");
            if (privateKey == null)
                return PartialView("~/Views/Navbar/NavbarRegisterLogin.cshtml");

            var user = _userService.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(privateKey));
            var position = user.Position.ToPascalCase();
            return PartialView("~/Views/Navbar/Navbar" + position + ".cshtml");
        }
    }
}