$(document).ready(()=> {
    let main = $('main');
    let spiral = $('.spiral');
    let logoSpiral = $('.logoSpiral');
    let navLogoSpiral = $('.navLogoSpiral');
    let navLogoName = $('.navLogoName');
    let bgimage = $('.bg-image');
    let submitButtonParent = $('.submitButtonParent');
    let resetButtonParent = $('.resetButtonParent');
    let light = $('[name="light"]');
    let dark = $('[name="dark"]');
    let lightCSS = $('.lightStyle');
    let darkCSS = $('.darkStyle');
    let navbar = $('.navbar-expand-md');
    let navbar_brand = $('.navbar-brand');
    let rightNavButtons = $('.rightNavButtons');
    let navBut = $('.mr-auto .navBut');
    let settingsModalElements = $('.modal-overlay-settings, .modal-settings');
    let messageModalElements = $('.modal-overlay-message, .modal-message');
    let modalOverlay = $('.modal-overlay');
    let validFormAjax;
    let keysHaveBeenGenerated;

    // Checks if anyone is logged in by calling the appropriate controller
    $.get({
        url: '/User/IsLoggedIn',
        success: function(response) {
            if (response === true) {
                setNavbarToggler();
                toggleUsers('login');
                doAjax('/User/Dashboard', 'GET', main, main, $('.errorWelcomePageNotFetched').text());
                navbar_brand.show();
                if (!bgimage.hasClass('bg-image-blurred'))
                    bgimage.addClass('bg-image-blurred');
            }
        },
        error: function(jqXHR) {
            notifyError($('.errorWelcomePageNotFetched').text(), jqXHR);
        }
    });

    spiral.html(logoSpiral.html());
    navLogoSpiral.html(logoSpiral.html());
    $('.navLogoSpiral svg').attr('width', '41px');
    $('html').fadeIn(1000);

    function changePageTitle(title) {
        document.title = title;
    }

    function adjustWelcomeLogo() {
        $('.spiral').html($('.logoSpiral').html());
        adjustLogoLocale();
    }

    // Sets locale depending on current system or user language
    $('.locale').each(function() {
        if ($(this).val() === localStorage.getItem('Locale'))
            $('#locales').html($(this).html() + '<span class="caret"></span>');
        adjustLogoLocale();
    });

    // Because the service is bilingual (for now), adjusts the logo width based on the given translated name of the service
    function adjustLogoWidthByLocalStorage() {
        if (localStorage.getItem('Locale') === 'el')
            $('.navLogoName svg').attr('width', '110px');
        else
            $('.navLogoName svg').attr('width', '105px');
    }

    // Same as above
    function adjustLogoWidthByNavigator() {
        if (navigator.languages[0].substr(0,2) === 'el')
            $('.navLogoName svg').attr('width', '110px');
        else
            $('.navLogoName svg').attr('width', '105px');
    }

    // Adjusts logo locale based on given criteria
    function adjustLogoLocale() {
        if (localStorage.getItem('Locale') != null) {
            setLogoLanguage(localStorage.getItem('Locale').substr(0,1).toUpperCase() + localStorage.getItem('Locale').substr(1,1).toLowerCase());
            adjustLogoWidthByLocalStorage();
        } else
            logoLangBasedOnNavigator();
    }

    function setLogoLanguage(text) {
        let languageSelector = $('.logo' + text);
        $('.logoName').html(languageSelector.html());
        navLogoName.html(languageSelector.html());
    }

    function logoLangBasedOnNavigator() {
        let lang = navigator.languages[0].substr(0,2);
        setLogoLanguage(lang.substr(0, 1).toUpperCase() + lang.substr(1, 1).toLowerCase());
        adjustLogoWidthByNavigator();
    }

    // Opens the wait animated icon
    function openWait() {
        $('#gears').fadeIn();
    }

    // Closes the wait animated icon
    function closeWait() {
        $('#gears').fadeOut();
    }

    // Shows a push notification with green background (success)
    function notifySuccess(text) {
        $('[data-notification-status="success"]')
            .css('transition', '.3s')
            .show()
            .removeClass()
            .attr('data-notification-status', 'success')
            .addClass('pushNotification' + ' notify')
            .addClass('do-show')
            .empty().append(text);
    }

    // Shows a push notification with red background (error)
    function notifyError(text, jqXHR) {
        $('[data-notification-status="error"]')
            .css('transition', '.3s')
            .show()
            .removeClass()
            .attr('data-notification-status', 'error')
            .addClass('pushNotification' + ' notify')
            .addClass('do-show')
            .empty().append(`
            <div class="notificationResponseText">
            <div class="notificationMessageTextInline">${text}</div>
            <div class="notificationDetails">${$('.messageDetailsText').text()}
            </div></div>`);
        $('.modal-overlay-message .modal-content').empty().append(`
            <div class="messageTitle">${$('.messageErrorDetailsText').text()}</div>
            <div class="messageErrorStatus" style="font-size:16px;">${$('.errorCode').text()} ${jqXHR.status}</div>
            <div class="messageErrorMessage" style="font-size:16px;">${$('.errorMessage').text()}<br/>${jqXHR.responseText}</div>`);
    }

    // Shows a neutral (with transparent background color) push notification
    function notifyNeutral(text) {
        $('[data-notification-status="neutral"]')
            .css('transition', '.3s')
            .show()
            .removeClass()
            .attr('data-notification-status', 'neutral')
            .addClass('pushNotification' + ' notify')
            .addClass('do-show')
            .empty().append(text);
    }

    // Closes push notification
    $(document).on('click', '.pushNotification', function(e) {
        if (e.clientX > $(this).offset().left + 280) {
            $(this).css('transition', '0s');
            $(this).fadeOut();
        }
    });

    // Changes site’s language
    $(document).on('click', '.locale', function(e) {
        e.preventDefault();
        localStorage.setItem('Locale', $(this).val());
        $.post({
            url: '/User/SetLanguage',
            data: $(this).val()
        });
        $(this).parents('section').find('.effectAfterRestart').show(300).delay(5000).hide(300);
    });

    // Opens Settings
    $(document).on('click', '.navButSettings', ()=> {
        modalOverlay.removeClass('hidden');
        settingsModalElements.addClass('active');
    });

    // Opens message modal when user clicks on “Details” link of push notification
    $(document).on('click', '.notificationDetails', (e)=> {
        e.preventDefault();
        modalOverlay.removeClass('hidden');
        messageModalElements.addClass('active');
    });

    // Closes Settings
    $(document).on('click', '.close-modal-settings', ()=> {
        settingsModalElements.removeClass('active');
        modalOverlay.addClass('hidden');
    });

    // Closes message modal
    $(document).on('click', '.close-modal-message', ()=> {
        messageModalElements.removeClass('active');
        modalOverlay.addClass('hidden');
    });

    // Animates dropdown at opening
    $(document).on('show.bs.dropdown', '.dropdown', function() {
        let dropdown = $(this).find('.dropdown-menu');
        let orig_margin_top = parseInt(dropdown.css('margin-top'));
        dropdown.css({'margin-top': (orig_margin_top - 10) + 'px', opacity: 0}).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, 300, function() {
            $(this).css({'margin-top':''});
        });
    });

    // Animates dropdown at closing
    $(document).on('hide.bs.dropdown', '.dropdown', function() {
        let dropdown = $(this).find('.dropdown-menu');
        let orig_margin_top = parseInt(dropdown.css('margin-top'));
        dropdown.css({'margin-top': orig_margin_top + 'px', opacity: 1, display: 'block'}).animate({'margin-top': (orig_margin_top - 10) + 'px', opacity: 0}, 300, function() {
            $(this).css({'margin-top':'', display:''});
            $('.dropdown .show').css('display', 'none');
        });
    });

    // Adjusts border-bottom of a dropdown item’s parents when user clicks on it
    $(document).on('click', '.dropdownItem', function() {
        if ($(this).parents('.dropdown').hasClass('navButDropdown'))
            $(this).parents('.dropdown').find('.navBut').not('.userIconButton').css('border-bottom', 'solid 3px');
    });

    // Determines what happens when user presses Esc button
    $(document).keyup((e)=> {
        if (e.keyCode === 27) {
            // Close Settings
            if (settingsModalElements.hasClass('active')) {
                settingsModalElements.removeClass('active');
                modalOverlay.addClass('hidden');
            }
            // Close message
            if (messageModalElements.hasClass('active')) {
                messageModalElements.removeClass('active');
                modalOverlay.addClass('hidden');
            }
        }
    });

    function enableDark() {
        dark.hide();
        lightCSS.prop('disabled', true);
        darkCSS.prop('disabled', false);
        light.show();
        navbar.removeClass('navbar-light').addClass('navbar-dark');
        if (navbar.hasClass('navbarColored')) {
            $('.navbar-toggler-icon').removeClass('navbarTogglerColored');
        } else {
            $('.navbar-toggler-icon').addClass('navbarTogglerColored');
        }
        $('svg path').not('.welcomeSpiral svg path, #gears svg path').attr('fill', '#fff');
        $('.generatedKeys svg rect, .contract svg rect').attr('fill', '#fff');
        $('.generatedKeys svg path, .contract svg path').not('.contractIcon svg path').attr('fill', '#000');
    }

    function enableLight() {
        light.hide();
        darkCSS.prop('disabled', true);
        lightCSS.prop('disabled', false);
        dark.show();
        navbar.removeClass('navbar-dark').addClass('navbar-light');
        if (navbar.hasClass('navbarColored')) {
            $('.navbar-toggler-icon').removeClass('navbarTogglerColored');
        } else {
            $('.navbar-toggler-icon').addClass('navbarTogglerColored');
        }
        $('svg path').not('.welcomeSpiral svg path, #gears svg path').attr('fill', '#001755');
        $('.generatedKeys svg rect, .contract svg rect').attr('fill', 'none');
        $('.generatedKeys svg path, .contract svg path').attr('fill', '#001755');
    }

    function autoAdjustThemes() {
        if (localStorage.getItem('Theme') === 'light') {
            enableLight();
        } else if (localStorage.getItem('Theme') === 'dark' || localStorage.getItem('Theme') === 'dark') {
            enableDark();
        } else {
            adjustThemeBasedOnNow();
        }
    }

    autoAdjustThemes();
    
    // Auto-adjusts theme based on current month and hour
    function adjustThemeBasedOnNow() {
        let now = new Date().getHours();
        let month = new Date().getMonth() + 1;

        if (month >= 4 && month <= 10) {
            if (now >= 6 && now <= 19)
                enableLight();
            else
                enableDark();
        } else {
            if (now >= 7 && now <= 17)
                enableLight();
            else
                enableDark();
        }
    }

    $(document).on('mouseover', '.navbar-brand', function() {
        if (darkCSS.prop('disabled') === false)
            $(this).find('svg path').attr('fill', 'black');
    });

    $(document).on('mouseout', '.navbar-brand', function() {
        if (darkCSS.prop('disabled') === false)
            $(this).find('svg path').attr('fill', '#fff');
    });
    
    // Renders all functions below when user inputs something in a form
    $(document).on('input', 'form input', function() {
        if ($(this).parents('form').hasClass('registerForm')) {
            if ($(this).attr('id') === 'email' && validEmail($(this))) {
                emailExists($(this));
                if ($(this).hasClass('validInput')) {
                    $(this).parents('form').find('.submitButtonParent, .resetButtonParent').show(300);
                    $(this).parents('form').find('.submitButton').prop('disabled', false);
                }
            }
            toggleValidationColors($(this));
        }
        $(this).parent().find('.formWarning, .formWarningServer').hide(300);
        toggleFormButtons($(this));
    });

    function toggleFormButtons(element) {
        if (element.val().length !== 0) {
            if (isValidForm(element))
                enableFormButtons(element);
            else
                disableOnlySubmit(element);
        } else {
            element.parents('form').find('input').each(function() {
                if ($(this).val().length === 0)
                    disableFormButtons(element);
                else
                    disableOnlySubmit(element);
            });
        }
    }

    function enableFormButtons(element) {
        element.parents('form').find('.submitButtonParent, .resetButtonParent').show(300);
        element.parents('form').find('.submitButton').prop('disabled', false);
    }

    function disableFormButtons(element) {
        element.parents('form').find('.submitButtonParent, .resetButtonParent').hide(300);
        element.parents('form').find('.submitButton').prop('disabled', false);
    }

    function disableOnlySubmit(element) {
        element.parents('form').find('.submitButtonParent').hide(300);
        element.parents('form').find('.resetButtonParent').show(300);
        element.parents('form').find('.submitButton').prop('disabled', true);
    }

    // Toggles green or red color to the input (border-bottom) based on whether it is valid or not
    function toggleValidationColors(element) {
        if (element.val().length === 0)
            element.removeClass('validInput invalidInput');
        else {
            if (element.parents('form').hasClass('registerForm') && element.attr('id') === 'email') {
                if (isValidInput(element)) {
                    element.removeClass('invalidInput');
                    element.addClass('validInput');
                } else {
                    element.removeClass('validInput');
                    element.addClass('invalidInput');
                }
            }
        }
    }

    // Similar as when user inputs something in a form
    $(document).on('change', 'input', function() {
        if ($(this).val().length === 0) {
            $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'});
            $(this).parent().find('.formWarning, .formWarningServer').hide(300);
        } else {
            if (!isValidInput($(this)))
                $(this).parent().find('.formWarning').show(300);
            $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
        }
    });

    $(document).on('focus', 'input', function() {
        $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
    });

    $(document).on('blur', 'input', function() {
        if ($(this).val().length === 0) {
            $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'});
        } else {
            $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
        }
    });

    function isValidInput(element) {
        if (element.parents('form').hasClass('registerForm')) {
            if (element.attr('id') === 'firstName')
                return validFirstName(element);
            else if (element.attr('id') === 'lastName')
                return validLastName(element);
            else if (element.attr('id') === 'email')
                return validEmail(element);
            else if (element.attr('id') === 'position')
                return validPosition(element);
        }
    }

    function isValidForm(element) {
        if (!(element.parents('form').find('.formWarning, .formWarningServer').is(':visible'))) {
            if (element.parents('form').hasClass('registerForm')) {
                validateRegister(element);
                return validFormAjax === true && keysHaveBeenGenerated === true;
            } else if (element.parents('form').hasClass('loginForm')) {
                return true;
            }
        }
    }

    function validateRegister(element) {
        $.post({
            url: '/User/RegisterIsValid',
            data: $('.registerForm').serialize(),
            success: function(response) {
                responseBoolean(response, element);
            },
            error: function(jqXHR) {
                notifyError($('.errorRegisterFormNotValidated').text(), jqXHR);
            }
        });
    }

    // Generates user’s public and private keys by calling the appropriate controller
    function generateKeys() {
        $('.generatedKeys').hide(300);
        $.post({
            url: '/User/GenerateKeys',
            data: $('.registerForm').serialize(),
            success: function(response) {
                $('.generatedKeys').empty().append(response);
                keysHaveBeenGenerated = true;
                $('.registerForm .submitButtonParent').show(300);
                $('.registerForm .submitButton').prop('disabled', false);

                // Generate relevant QR code
                $('#publicKeyQR').html(qrcodegen.QrCode.encodeText($('.generatedPublicKey').html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                $('#privateKeyQR').html(qrcodegen.QrCode.encodeText($('.generatedPrivateKey').html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                $('#publicKeyText').val($('.generatedPublicKey').text());
                $('#privateKeyText').val($('.generatedPrivateKey').text());

                // Adjust QR code’s colors based on current theme
                if (lightCSS.prop('disabled') === false) {
                    $('.generatedKeys svg rect').attr('fill', 'none');
                    $('.generatedKeys svg path').attr('fill', '#001755');
                } else if (darkCSS.prop('disabled') === false) {
                    $('.generatedKeys svg rect').attr('fill', '#fff');
                    $('.generatedKeys svg path').attr('fill', '#000');
                }
                $('.generatedKeys').show(300);
            },
            error: function(jqXHR) {
                $('.generatedKeys').delay(450).show(300);
                notifyError($('.errorKeysNotGenerated').text(), jqXHR);
                keysHaveBeenGenerated = false;
            }
        });
    }

    $(document).on('click', '.copyKeysToClipboard', function() {
        copyToClipboard($('.usersPublicKey').html() + ':\r\n' + $('.generatedPublicKey').html() + '\r\n' + $('.usersPrivateKey').html() + ':\r\n' + $('.generatedPrivateKey').html());
        $('.keysCopiedToClipboard').show(300).delay(4000).hide(300);
    });

    // Determines what happens when user clicks on a QR code image
    $(document).on('click', '.qrCode', function() {
        copyToClipboard($(this).next().next('.qrCodeText').html());
        $(this).next('.copiedQR').show(300).delay(4000).hide(300);
    });

    function copyToClipboard(str) {
        function listener(e) {
            e.clipboardData.setData('text/html', str);
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
    }

    $(document).on('click', '.clipboardButton', function(e) {
        e.preventDefault();
    });

    // Sets the selected position as the value of the user’s position’s input of the registration form and validates the latter
    $(document).on('click', '.position', function() {
        $('.positionInput').val($(this).val());
        $('#userPosition').html($(this).html() + '<span class="caret"></span>');
        $(this).parent().find('.formWarningServer').hide(300);
        $(this).parents('form').find('.resetButtonParent').show(300);
        validateRegister($(this));
    });

    // Sets a boolean value to the validFormAjax variable based on the Ajax response
    // Some functions use validFormAjax to determine their actions
    function responseBoolean(response, element) {
        if (response === true) {
            validFormAjax = true;
            if (element.parents('form').hasClass('registerForm')) {
                generateKeys();
            }
        } else if (response === false) {
            validFormAjax = false;
        }
    }

    function validFirstName(element) {
        let firstNameLength = element.parents('form').find('#firstName').val().length;
        return firstNameLength >= 1 && firstNameLength <= 30;
    }

    function validLastName(element) {
        let lastNameLength = element.parents('form').find('#lastName').val().length;
        return lastNameLength >= 1 && lastNameLength <= 30;
    }

    function validPosition(element) {
        let positionLength = element.parents('form').find('#position').val().length;
        return positionLength >= 1;
    }

    function validEmail(element) {
        let email = element.parents('form').find('#email').val();
        let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test(email);
    }

    $(document).on('mouseout', '.passwordEye', function() {
        $(this).prev('#privateKey').prop('type', 'password');
    });

    $(document).on('mousedown', '.passwordEye', function() {
        $(this).prev('#privateKey').prop('type', 'text');
    });

    $(document).on('mouseup', '.passwordEye', function() {
        $(this).prev('#privateKey').prop('type', 'password');
    });

    // Enables or disables navbar’s background based on whether the main page (when no one is logged in) is visible
    function setNavbarToggler() {
        setTimeout(()=> {
            if (!navbar.hasClass('navbarColored')) {
                if (rightNavButtons.hasClass('navButBackground')) {
                    rightNavButtons.removeClass('navButBackground');
                } else {
                    rightNavButtons.addClass('navButBackground');
                }
            }
            $('.navbar-toggler-icon').removeClass('navbarTogglerColored');
            navbar.addClass('navbarColored');
        }, 450);
        setTimeout(()=> {
            if (lightCSS.prop('disabled') === false) {
                navbar.removeClass('navbar-dark').addClass('navbar-light');
            } else {
                navbar.removeClass('navbar-light').addClass('navbar-dark');
            }
        }, 450);
    }

    // Determines what happens when user clicks on “Dark” button in Settings
    $(document).on('click', '[name="dark"]', ()=> {
        enableDark();
        localStorage.setItem('Theme', 'dark');
    });

    // Determines what happens when user clicks on “Light” button in Settings
    $(document).on('click', '[name="light"]', ()=> {
        enableLight();
        localStorage.setItem('Theme', 'light');
    });

    // Changes the border-bottom attribute of a navbar button when clicked
    $(document).on('click', '.mr-auto .navBut', function() {
        if (!($(this).hasClass('navLogin') || $(this).hasClass('navRegister') || $(this).hasClass('userIconButton') || $(this).parent().hasClass('dropdown'))) {
            navBut.not($(this)).css('border-bottom', 'solid 0');
            $(this).css('border-bottom', 'solid 3px');
        }
    });

    // Same as above for the left pane’s buttons of Settings (border-left)
    $(document).on('click', '.settingsButtonLeftPane', function() {
        $('.settingsButtonLeftPane').not($(this)).css('border-left', 'solid 0');
        $(this).css('border-left', 'solid 3px');
    });

    // Checks if the e-mail given by the user already exists by calling the appropriate controller
    function emailExists(element) {
        $.post({
            url: '/User/EmailExists',
            data: element.val(),
            success: function(response) {
                toggleRegisterFormElementExistsWarning(element, response);
            },
            error: function(jqXHR) {
                notifyError($('.errorEmailNotChecked').text(), jqXHR);
            }
        });
    }

    function toggleRegisterFormElementExistsWarning(element, response) {
        if (element.parents('form').hasClass('registerForm')) {
            if (response  === true) {
                $('.' + element.attr('id') + 'AlreadyInUse').show(300);
                element.removeClass('validInput');
                element.addClass('invalidInput');
            } else {
                $('.' + element.attr('id') + 'AlreadyInUse').hide(300);
                element.removeClass('invalidInput');
                element.addClass('validInput');
            }
        }
    }

    // A universal function used to process an Ajax call
    function doAjax(URL, method, emptyElement, appendElement, onError) {
        emptyElement.fadeOut();
        setTimeout(function() {
            $.ajax({
                type: method,
                url: URL,
                success: function(response) {
                    closeWait();
                    emptyElement.empty().append(response);
                    appendElement.delay(450).fadeIn();
                },
                error: function(jqXHR) {
                    closeWait();
                    notifyError(onError, jqXHR);
                    appendElement.delay(450).fadeIn();
                }
            });
        }, 450);
    }

    // Renders login page by calling the appropriate controller
    function doAjaxLogin(URL, method, emptyElement, appendElement, onError) {
        emptyElement.fadeOut();
        setTimeout(function() {
            $.ajax({
                type: method,
                url: URL,
                success: function(response) {
                    emptyElement.empty().append(response);
                    let loginScanner = new Instascan.Scanner({video: document.getElementById('loginQRScannerVideo')});
                    Instascan.Camera.getCameras().then(cameras => {
                        if (cameras.length > 0) {
                            loginScanner.addListener('scan', function(content) {
                                $('.loginForm input').val(content);
                                loginScanner.stop();
                                registerLogin('login');
                            });
                            loginScanner.start(cameras[0]);
                        }
                    });
                    $(document).on('click', '.loginButton, .navbar-brand, .navRegister, .navbarUsers', function() {
                        loginScanner.stop();
                    });
                    appendElement.fadeIn();
                },
                error: function(jqXHR) {
                    notifyError(onError, jqXHR);
                    appendElement.fadeIn();
                }
            });
        }, 450);
    }

    // Renders welcome (main) page by calling the appropriate controller
    function doAjaxWelcome(URL, method, emptyElement, appendElement, onError) {
        $.ajax({
            type: method,
            url: URL,
            success: function(response) {
                emptyElement.empty().append(response);
                adjustWelcomeLogo();
                appendElement.fadeIn();
            },
            error: function(jqXHR) {
                notifyError(onError, jqXHR);
                appendElement.fadeIn();
            }
        });
    }

    // Calls register or login controller
    function registerLogin(text) {
        main.fadeOut();
        openWait();
        setTimeout(function() {
            $.post({
                url: '/User/' + text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase(),
                data: $('.' + text + 'Form').serialize(),
                success: function(response) {
                    closeWait();
                    main.empty().append(response);
                    if ($('.responseStatus').html() === 'success') {
                        toggleUsers(text);
                        main.delay(450).fadeIn();
                    } else if ($('.responseStatus').html() === 'error') {
                        afterRegisterLoginError($(this), text);
                        main.delay(450).fadeIn();
                    }
                },
                error: function(jqXHR) {
                    closeWait();
                    main.delay(450).fadeIn();
                    notifyError($('.error' + text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase() + 'Failed').text(), jqXHR);
                }
            });
        }, 450);
    }

    // Determines what happens when register or login fails
    function afterRegisterLoginError(element, text) {
        $('.' + text + 'Form label').each(function() {
            element.css({'top': '-12px', 'font-size': '14px'});
            element.parents('form').find('.resetButtonParent').show(300);
        });
        $('.' + text + 'Form').find('input').each(function() {
            element.removeClass('invalidInput').addClass('validInput');
        });
        $('.formWarningServer').each(function() {
            element.parents('.inputParent').find('input').removeClass('validInput').addClass('invalidInput');
        });
        if (text === 'login') {
            let loginScanner = new Instascan.Scanner({video: document.getElementById('loginQRScannerVideo')});
            Instascan.Camera.getCameras().then(cameras => {
                if (cameras.length > 0) {
                    loginScanner.addListener('scan', function(content) {
                        $('.loginForm input').val(content);
                        registerLogin('login');
                        loginScanner.stop();
                    });
                    loginScanner.start(cameras[0]);
                }
            });
            $(document).on('click', '.loginButton, .navbar-brand, .navRegister, .navbarUsers', function() {
                loginScanner.stop();
            });
        }
    }

    // Determines what happens when user clicks on “Register” or “Login” button
    $(document).on('click', '.registerButton, .loginButton', function(e) {
        main.fadeOut();
        e.preventDefault();
        registerLogin(($(this).hasClass('registerButton')) ? 'register' : 'login');
    });

    // Toggles users’ views based on their position
    function toggleUsers(text) {
        if (text === 'register' || text === 'login') {
            doAjax('/User/UserNavbar', 'GET', $('.navbarUsers'), $('.navbarUsers'), $('.errorNavbarLoadingFailed').text());
            changePageTitle($('.usersHome').text());
            renderRightNavLogin();
        }
        if (text === 'null') {
            renderNavbarLogout();
            renderRightNavLogout();
        }
    }

    // Adjusts right navbar’s section after login
    function renderRightNavLogin() {
        $('.rightNavButtons').fadeOut();
        doAjax('/User/RightNavLogin', 'GET', $('.rightNavButtons'), $('.rightNavButtons'), $('.errorNavbarLoadingFailed').text());
    }

    // Adjusts right navbar’s section after logout
    function renderRightNavLogout() {
        $('.rightNavButtons').fadeOut();
        doAjax('/User/RightNavLogout', 'GET', $('.rightNavButtons'), $('.rightNavButtons'), $('.errorNavbarLoadingFailed').text());
    }

    // Adjusts navbar after logout
    function renderNavbarLogout() {
        doAjax('/User/MainNavbarLogout', 'GET', $('.navbarUsers'), $('.navbarUsers'), $('.errorNavbarLoadingFailed').text());
        $('.navbarUsers').fadeOut();
    }

    // Determines what happens when user clicks on “All contracts” button
    $(document).on('click', '.allContractsButton', function() {
        main.fadeOut();
        openWait();
        setTimeout(function() {
            $.get({
                url: '/Contracts/UserContracts',
                success: function(response) {
                    closeWait();
                    main.empty().append(response);
                    changePageTitle($('.legalContracts').text());
                    main.delay(450).show();
                },
                error: function(jqXHR) {
                    closeWait();
                    main.delay(450).fadeIn();
                    notifyError($('.errorContractsNotFetched').text(), jqXHR);
                }
            });
        }, 450);
    });

    $(document).on('click', '.contractRow', function() {
        const index = $(this).children('.blockIndex').text();
        main.fadeOut();
        setTimeout(function() {
            $.get({
                url: '/Contracts/GetContract/' + index,
                success: function(response) {
                    main.empty().append(response);
                    $('.contract .qrCodeText').each(function () {
                        $(this).prev().prev('.qrCode').html(qrcodegen.QrCode.encodeText($(this).html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                    });
                    if (lightCSS.prop('disabled') === false) {
                        $('.contract svg rect').attr('fill', 'none');
                        $('.contract svg path').attr('fill', '#001755');
                    } else if (darkCSS.prop('disabled') === false) {
                        $('.contract svg rect, .contractIcon svg path').attr('fill', '#fff');
                        $('.contract svg path').not('.contractIcon svg path').attr('fill', '#000');
                    }
                    $('.contract .signatureValid').each(function() {
                        if ($(this).text() === 'True')
                            $(this).next().show();
                        else
                            $(this).next().next().show();
                    });
                    main.show();
                },
                error: function(jqXHR) {
                    main.fadeIn();
                    notifyError($('.errorContractNotFetched').text(), jqXHR);
                }
            });
        }, 450);
    });

    $(document).on('click', '.collapseButton', function() {
        if (!$(this).hasClass('collapsed')) {
            $(this).css('border-bottom', 'solid 2px');
        } else {
            $(this).css('border-bottom', 'none');
        }
    });

    $(document).on('click', '.contractClause > .row', function() {
        $(this).find('.paragraphReadable').toggleClass('mr-3');
        $(this).find('.paragraphLegen, .clauseSubtitle').toggle();
    });

    // Tests off-hire clause
    $(document).on('click', '.enableClause', function() {
        $.get({
            url: '/Contracts/TestEnableClause',
            success: function(response) {
                $('.testEnabledClause').hide(300).empty().append(response).show(300);
            }
        });
    });

    $(document).on('click', '.validateBlockchain', function() {
        openWait();
        doAjax('/Admin/ValidateBlockchain', 'GET', main, main, $('.errorBlockchainNotValidated').text());
        changePageTitle('Blockchain');
    });

    // Renders login view
    $(document).on('click', '[name="jumbotronLogin"], .navLogin', ()=> {
        main.fadeOut();
        $('.navLogin-parent').fadeOut();
        setNavbarToggler();
        doAjaxLogin('/User/Login', 'GET', main, main, $('.errorLoginPageNotFetched').text());
        changePageTitle($('.pageTitleLogin').text());
        navbar_brand.delay(450).fadeIn();
        $('.navRegister-parent').delay(450).fadeIn();
        if (!bgimage.hasClass('bg-image-blurred'))
            bgimage.delay(450).addClass('bg-image-blurred');
    });

    // Renders register view
    $(document).on('click', '[name="register"], .navRegister', ()=> {
        $('.navRegister-parent').fadeOut();
        setNavbarToggler();
        doAjax('/User/Register', 'GET', main, main, $('.errorRegisterPageNotFetched').text());
        changePageTitle($('.pageTitleRegister').text());
        navbar_brand.delay(450).fadeIn();
        $('.navLogin-parent').delay(450).fadeIn();
        if (!bgimage.hasClass('bg-image-blurred'))
            bgimage.delay(450).addClass('bg-image-blurred');
    });

    // Renders home page (different home page based on whether there is logged in user or not)
    $(document).on('click', '.navbar-brand', (e)=> {
        e.preventDefault();
        $('.navBut').css('border-bottom', 'solid 0');
        $.get({
            url: '/User/IsLoggedIn',
            success: function(response) {
                if (response === true) {
                    doAjax('/User/Dashboard', 'GET', main, main, $('.errorWelcomePageNotFetched').text());
                    changePageTitle($('.usersHome').text());
                } else {
                    navbar_brand.fadeOut();
                    $('.navbar-toggler-icon').addClass('navbarTogglerColored');
                    main.fadeOut();
                    $('.rightNavButtons').addClass('navButBackground');
                    submitButtonParent.delay(450).hide();
                    resetButtonParent.delay(450).hide();
                    $('.navLogin-parent').fadeOut();
                    $('.navRegister-parent').fadeOut();
                    navbar.removeClass('navbarColored');
                    if (bgimage.hasClass('bg-image-blurred'))
                        bgimage.removeClass('bg-image-blurred');
                    setTimeout(()=> {
                        doAjaxWelcome('/User/Welcome', 'GET', main, main, $('.errorWelcomePageNotFetched').text());
                        changePageTitle($('.pageTitleHome').text());
                    }, 450);
                }
            }
        });
    });

    // Renders logout
    $(document).on('click', '.logoutButton', (e)=> {
        e.preventDefault();
        navBut.css('border-bottom', 'solid 0');
        navbar_brand.fadeOut();
        $('.navbar-toggler-icon').addClass('navbarTogglerColored');
        main.fadeOut();
        $('.rightNavButtons').addClass('navButBackground');
        submitButtonParent.delay(450).hide();
        resetButtonParent.delay(450).hide();
        toggleUsers('null');
        $('.navLogin-parent').fadeOut();
        $('.navRegister-parent').fadeOut();
        navbar.removeClass('navbarColored');
        if (bgimage.hasClass('bg-image-blurred'))
            bgimage.removeClass('bg-image-blurred');
        setTimeout(()=> {
            setTimeout(()=> {
                doAjaxWelcome('/User/Welcome', 'GET', main, main, $('.errorWelcomePageNotFetched').text());
            }, 700);
            changePageTitle($('.pageTitleHome').text());
        }, 450);
    });

    // Determines what happens when user resets a form
    $(document).on('click', '.resetButton', function() {
        $(this).parents('form').find('.generatedKeys').hide(300);
        $(this).parents('form').find('input').attr('value', '');
        $(this).parents('form').find('.submitButtonParent, .resetButtonParent, .formWarning, .formWarningServer, .emailAlreadyInUse').hide(300);
        $(this).parents('form').find('.submitButton').prop('disabled', true);
        $(this).parents('form').find('input').removeClass('validInput invalidInput');
        $(this).parents().find('label').css({'top': '4px', 'font-size': '18px'});
        $('.keysCopiedToClipboard').hide(300);
        if ($(this).parents('form').hasClass('registerForm')) {
            $('.registerForm .positionInput').val('');
            $('.registerForm #userPosition').html($('.usersPosition').html() + '<span class="caret"></span>');
        }
    });
});