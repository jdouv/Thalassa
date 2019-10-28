$(document).ready(()=> {
    let main = $('main');
    let spiral = $('.spiral');
    let logoSpiral = $('.logoSpiral');
    let navLogoSpiral = $('.navLogoSpiral');
    let navLogoName = $('.navLogoName');
    let bgImage = $('.bg-image');
    let submitButtonWrapper = $('.submitButtonWrapper');
    let resetButtonWrapper = $('.resetButtonWrapper');
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

    // Fetch localized messages json
    $.getJSON('bin/locales.json').then((localesJson) => {

        // Sets locale cookie
        function setLocaleCookie() {
            if (getCookie('Locale') == null) {
                navigator.languages[0].substr(0, 2).length > 0 ?
                    setCookie('Locale', navigator.languages[0].substr(0, 2)) :
                    setCookie('Locale', 'en');
            }
        }

        setLocaleCookie();

        // Localizes given element
        function changeLanguage(element) {
            setLocaleCookie();
            let locale = getCookie('Locale');

            moment.locale(getCookie('Locale'));
            element.find('[data-localization-page-title]').text(localesJson[locale][$('[data-localization-page-title]').attr('data-localization-page-title')]);
            element.find('[data-localization]').each(function () {
                $(this).text(localesJson[locale][$(this).attr('data-localization')]);
                if ($(this).text().includes('\\'))
                    $(this).html($(this).text().replace(/[\\]/g, ''));
                if (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test($(this).text()))
                    $(this).html($(this).text());
            });
            element.find('[data-localization-title]').each(function () {
                $(this).attr('title', localesJson[locale][$(this).attr('data-localization-title')]);
            });
            element.find('[data-timestamp]').each(function () {
                $(this).text(datetimeFromTimestamp($(this).attr('data-timestamp')));
            });
            element.find('[data-localization-error]').each(function () {
                $(this).text(localesJson[locale][$(this).attr('data-localization-error')]);
            });
            element.find('[data-user-position]').each(function () {
                let text = $(this).attr('data-user-position') === 'usersPosition' ?
                    localesJson[locale]['usersPosition'] :
                    localesJson[locale]['usersPositions' + $(this).attr('data-user-position')];
                $('[data-user-position]').html(text);
            });
            return element;
        }

        // Converts block’s timestamp to readable datetime
        function datetimeFromTimestamp(timestamp) {
            timestamp = parseInt(timestamp);
            let day = moment.utc(timestamp).format('D');
            let month = moment.utc(timestamp).format('MMMM');
            let year = moment.utc(timestamp).format('YYYY');
            let time = moment.utc(timestamp).format('H:mm:ss');

            if (getCookie('Locale') === 'en') {
                if (window.navigator.language.substr(3) === 'US')
                    return month + ' ' + day + ', ' + year + ' - ' + time;
                else
                    return day + ' ' + month + ' ' + year + ' - ' + time;
            } else
                return moment.utc(timestamp).format('LL') + ' - ' + time;
        }

        changeLanguage($('html'));

        // Checks if anyone is logged in by calling the appropriate controller
        $.get({
            url: '/isLoggedIn',
            success: function (response) {
                if (response === true) {
                    setNavbarToggler();
                    toggleUsers('login');
                    doAjax('/dashboard', 'GET', main, main, 'errorWelcomePageNotFetched');
                    navbar_brand.show();
                    if (!bgImage.hasClass('bg-image-blurred'))
                        bgImage.addClass('bg-image-blurred');
                }
            },
            error: function (jqXHR) {
                notifyError('errorWelcomePageNotFetched', jqXHR);
            }
        });

        spiral.html(logoSpiral.html());
        navLogoSpiral.html(logoSpiral.html());
        $('.navLogoSpiral svg').attr('width', '41px');
        $('html').fadeIn(1000);

        function changeTitle(title) {
            let locale = getCookie('Locale');
            $('[data-localization-page-title]').attr('data-localization-page-title', title).text(localesJson[locale][title]);
        }

        function adjustWelcomeLogo() {
            $('.spiral').html($('.logoSpiral').html());
            adjustLogoLocale();
        }

        function setCookie(name, value) {
            document.cookie = name + '=' + value + ';';
        }

        function getCookie(name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            if (match) return match[2];
        }

        // Sets locale depending on current system or user language
        $('.locale').each(function () {
            if ($(this).val() === getCookie('Locale'))
                $('[data-user-position]').html($(this).html());
            adjustLogoLocale();
        });

        // Because the service is bilingual (for now), adjusts the logo width based on the given translated name of the service
        function adjustLogoWidthByLocalStorage() {
            getCookie('Locale') === 'el' ?
                $('.navLogoName svg').attr('width', '110px') :
                $('.navLogoName svg').attr('width', '105px');
        }

        // Same as above
        function adjustLogoWidthByNavigator() {
            navigator.languages[0].substr(0, 2) === 'el' ?
                $('.navLogoName svg').attr('width', '110px') :
                $('.navLogoName svg').attr('width', '105px');
        }

        // Adjusts logo locale based on given criteria
        function adjustLogoLocale() {
            if (getCookie('Locale') != null) {
                setLogoLanguage(getCookie('Locale').substr(0, 1).toUpperCase() + getCookie('Locale').substr(1, 1).toLowerCase());
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
            let lang = navigator.languages[0].substr(0, 2);
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
            let finalText = $(changeLanguage($.parseHTML(`<span data-localization="${text}"></span>`)));
            changeLanguage(finalText);
            $('[data-notification-status="success"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(finalText)
                .attr('data-notification-status', 'success')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show');
        }

        // Shows a push notification with red background (error)
        function notifyError(text, jqXHR) {
            let pushText = `
            <div class="notificationResponseText">
            <div class="notificationMessageTextInline" data-localization-error="${text}"></div>
            <div class="notificationDetails" data-localization="basicsDetails"></div></div>`;
            let details = `
            <div class="messageTitle" data-localization="basicsErrorDetails"></div>
            <div class="messageErrorStatus" style="font-size:16px;"><span data-localization="errorCode"></span> ${JSON.parse(jqXHR.responseText).status}</div>
            <div class="messageErrorMessage" style="font-size:16px;"><span data-localization="errorMessage"></span><br/>${JSON.parse(jqXHR.responseText).message}</div>`;
            let textModified = changeLanguage($($.parseHTML(pushText)));
            let detailsModified = changeLanguage($($.parseHTML(details)));
            $('[data-notification-status="error"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(textModified)
                .attr('data-notification-status', 'error')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show');
            $('.modal-overlay-message .modal-content').empty().append(detailsModified);
        }

        // Shows a neutral (with transparent background color) push notification
        function notifyNeutral(text) {
            let finalText = $(changeLanguage($.parseHTML(`<span data-localization="${text}"></span>`)));
            $('[data-notification-status="neutral"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(finalText)
                .attr('data-notification-status', 'neutral')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show');
        }

        // Closes push notification
        $(document).on('click', '.pushNotification', function (e) {
            if (e.clientX > $(this).offset().left + 280) {
                $(this).css('transition', '0s');
                $(this).fadeOut();
            }
        });

        // Changes site’s language
        $(document).on('click', '.locale', function (e) {
            e.preventDefault();
            setCookie('Locale', $(this).val());
            changeLanguage($('html'));
            adjustLogoLocale();
        });

        // Opens Settings
        $(document).on('click', '.navButSettings', () => {
            modalOverlay.removeClass('hidden');
            settingsModalElements.addClass('active');
        });

        // Opens message modal when user clicks on “Details” link of push notification
        $(document).on('click', '.notificationDetails', (e) => {
            e.preventDefault();
            modalOverlay.removeClass('hidden');
            messageModalElements.addClass('active');
        });

        // Closes Settings
        $(document).on('click', '.close-modal-settings', () => {
            settingsModalElements.removeClass('active');
            modalOverlay.addClass('hidden');
        });

        // Closes message modal
        $(document).on('click', '.close-modal-message', () => {
            messageModalElements.removeClass('active');
            modalOverlay.addClass('hidden');
        });

        // Animates dropdown at opening
        $(document).on('show.bs.dropdown', '.dropdown', function () {
            let dropdown = $(this).find('.dropdown-menu');
            let orig_margin_top = parseInt(dropdown.css('margin-top'));
            dropdown.css({
                'margin-top': (orig_margin_top - 10) + 'px',
                opacity: 0
            }).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, 300, function () {
                $(this).css({'margin-top': ''});
            });
        });

        // Animates dropdown at closing
        $(document).on('hide.bs.dropdown', '.dropdown', function () {
            let dropdown = $(this).find('.dropdown-menu');
            let orig_margin_top = parseInt(dropdown.css('margin-top'));
            dropdown.css({
                'margin-top': orig_margin_top + 'px',
                opacity: 1,
                display: 'block'
            }).animate({'margin-top': (orig_margin_top - 10) + 'px', opacity: 0}, 300, function () {
                $(this).css({'margin-top': '', display: ''});
                $('.dropdown .show').css('display', 'none');
            });
        });

        // Adjusts border-bottom of a dropdown item’s parents when user clicks on it
        $(document).on('click', '.dropdownItem', function () {
            if ($(this).parents('.dropdown').hasClass('navButDropdown'))
                $(this).parents('.dropdown').find('.navBut').not('.userIconButton').css('border-bottom', 'solid 3px');
        });

        // Determines what happens when user presses Esc button
        $(document).keyup((e) => {
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
            navbar.hasClass('navbarColored') ?
                $('.navbar-toggler-icon').removeClass('navbarTogglerColored') :
                $('.navbar-toggler-icon').addClass('navbarTogglerColored');
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
            navbar.hasClass('navbarColored') ?
                $('.navbar-toggler-icon').removeClass('navbarTogglerColored') :
                $('.navbar-toggler-icon').addClass('navbarTogglerColored');
            $('svg path').not('.welcomeSpiral svg path, #gears svg path').attr('fill', '#001755');
            $('.generatedKeys svg rect, .contract svg rect').attr('fill', 'none');
            $('.generatedKeys svg path, .contract svg path').attr('fill', '#001755');
        }

        function autoAdjustThemes() {
            if (getCookie('Theme') === 'light')
                enableLight();
            else if (getCookie('Theme') === 'dark')
                enableDark();
            else
                adjustThemeBasedOnNow();
        }

        autoAdjustThemes();

        // Auto-adjusts theme based on current month and hour
        function adjustThemeBasedOnNow() {
            let now = new Date().getHours();
            let month = new Date().getMonth() + 1;

            month >= 4 && month <= 10 ?
                now >= 6 && now <= 19 ? enableLight() : enableDark() :
                now >= 7 && now <= 17 ? enableLight() : enableDark();
        }

        $(document).on('mouseover', '.navbar-brand', function () {
            if (darkCSS.prop('disabled') === false)
                $(this).find('svg path').attr('fill', 'black');
        });

        $(document).on('mouseout', '.navbar-brand', function () {
            if (darkCSS.prop('disabled') === false)
                $(this).find('svg path').attr('fill', '#fff');
        });

        // Renders all functions below when user inputs something in a form
        $(document).on('input', 'form input', function () {
            if ($(this).parents('form').hasClass('registerForm')) {
                if ($(this).attr('id') === 'email' && validEmail($(this))) {
                    emailExists($(this));
                    if ($(this).hasClass('validInput')) {
                        $(this).parents('form').find('.submitButtonWrapper, .resetButtonWrapper').show(300);
                        $(this).parents('form').find('.submitButton').prop('disabled', false);
                    }
                }
                toggleValidationColors($(this));
            }
            $(this).parent().find('.formWarning, .formWarningServer').hide(300);
            toggleFormButtons($(this));
        });

        function toggleFormButtons(element) {
            element.val().length !== 0 ?
                isValidForm(element) ? enableFormButtons(element) : disableOnlySubmit(element) :
                element.parents('form').find('input').each(function () {
                    $(this).val().length === 0 ? disableFormButtons(element) : disableOnlySubmit(element);
                });
        }

        function enableFormButtons(element) {
            element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper').show(300);
            element.parents('form').find('.submitButton').prop('disabled', false);
        }

        function disableFormButtons(element) {
            element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper').hide(300);
            element.parents('form').find('.submitButton').prop('disabled', false);
        }

        function disableOnlySubmit(element) {
            element.parents('form').find('.submitButtonWrapper').hide(300);
            element.parents('form').find('.resetButtonWrapper').show(300);
            element.parents('form').find('.submitButton').prop('disabled', true);
        }

        // Toggles green or red color to the input (border-bottom) based on whether it is valid or not
        function toggleValidationColors(element) {
            if (element.val().length === 0)
                element.removeClass('validInput invalidInput');
            if (element.val().length > 0)
                element.removeClass('invalidInput').addClass('validInput');
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

        // Similar as above when user inputs something in a form (change event)
        $(document).on('change', 'input', function () {
            if ($(this).val().length === 0) {
                $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'});
                $(this).parent().find('.formWarning, .formWarningServer').hide(300);
            } else {
                if (!isValidInput($(this)))
                    $(this).parent().find('.formWarning').show(300);
                $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
            }
        });

        $(document).on('focus', 'input', function () {
            $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
        });

        $(document).on('blur', 'input', function () {
            $(this).val().length === 0 ?
                $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'}) :
                $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
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
            $.get({
                url: '/registerIsValid',
                data: $('.registerForm').serialize(),
                success: function (response) {
                    responseBoolean(response, element);
                },
                error: function (jqXHR) {
                    notifyError('errorRegisterFormNotValidated', jqXHR);
                }
            });
        }

        // Generates user’s public and private keys by calling the appropriate controller
        function generateKeys() {
            $('.generatedKeys').hide(300);
            $.post({
                url: '/generateKeys',
                data: $('.registerForm').serialize(),
                success: function (response) {
                    $('.generatedKeys').empty().append(response);
                    changeLanguage($('.generatedKeys'));
                    keysHaveBeenGenerated = true;
                    $('.registerForm .submitButtonWrapper').show(300);
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
                error: function (jqXHR) {
                    $('.generatedKeys').delay(450).show(300);
                    notifyError('errorKeysNotGenerated', jqXHR);
                    keysHaveBeenGenerated = false;
                }
            });
        }

        $(document).on('click', '.copyKeysToClipboard', function () {
            copyToClipboard($('.usersPublicKey').html() + ':\r\n' + $('.generatedPublicKey').html() + '\r\n' + $('.usersPrivateKey').html() + ':\r\n' + $('.generatedPrivateKey').html());
            $('.keysCopiedToClipboard').show(300).delay(4000).hide(300);
        });

        // Determines what happens when user clicks on a QR code image
        $(document).on('click', '.qrCode', function () {
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

        $(document).on('click', '.clipboardButton', function (e) {
            e.preventDefault();
        });

        // Sets the selected position as the value of the user’s position’s input of the registration form and validates the latter
        $(document).on('click', '.position', function () {
            $('.positionInput').val($(this).val());
            $('[data-user-position]').html($(this).html()).attr('data-user-position', $(this).val());
            $(this).parents('.positionsWrapper').find('.formWarningServer').hide(300);
            $(this).parents('form').find('.resetButtonWrapper').show(300);
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

        $(document).on('mouseout', '.passwordEye', function () {
            $(this).prev('#privateKey').prop('type', 'password');
        });

        $(document).on('mousedown', '.passwordEye', function () {
            $(this).prev('#privateKey').prop('type', 'text');
        });

        $(document).on('mouseup', '.passwordEye', function () {
            $(this).prev('#privateKey').prop('type', 'password');
        });

        // Enables or disables navbar’s background based on whether the main page (when no one is logged in) is visible
        function setNavbarToggler() {
            setTimeout(() => {
                if (!navbar.hasClass('navbarColored')) {
                    rightNavButtons.hasClass('navButBackground') ?
                        rightNavButtons.removeClass('navButBackground') :
                        rightNavButtons.addClass('navButBackground');
                }
                $('.navbar-toggler-icon').removeClass('navbarTogglerColored');
                navbar.addClass('navbarColored');
            }, 450);
            setTimeout(() => {
                lightCSS.prop('disabled') === false ?
                    navbar.removeClass('navbar-dark').addClass('navbar-light') :
                    navbar.removeClass('navbar-light').addClass('navbar-dark');
            }, 450);
        }

        // Determines what happens when user clicks on “Dark” button in Settings
        $(document).on('click', '[name="dark"]', () => {
            enableDark();
            setCookie('Theme', 'dark');
        });

        // Determines what happens when user clicks on “Light” button in Settings
        $(document).on('click', '[name="light"]', () => {
            enableLight();
            setCookie('Theme', 'light');
        });

        // Changes the border-bottom attribute of a navbar button when clicked
        $(document).on('click', '.mr-auto .navBut', function () {
            if (!($(this).hasClass('navLogin') || $(this).hasClass('navRegister') || $(this).hasClass('userIconButton') || $(this).parent().hasClass('dropdown'))) {
                navBut.not($(this)).css('border-bottom', 'solid 0');
                $(this).css('border-bottom', 'solid 3px');
            }
        });

        // Same as above for the left pane’s buttons of Settings (border-left)
        $(document).on('click', '.settingsButtonLeftPane', function () {
            $('.settingsButtonLeftPane').not($(this)).css('border-left', 'solid 0');
            $(this).css('border-left', 'solid 3px');
        });

        // Checks if the e-mail given by the user already exists by calling the appropriate controller
        function emailExists(element) {
            $.post({
                url: '/emailExists',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: element.val(),
                success: function (response) {
                    toggleRegisterFormElementExistsWarning(element, response);
                },
                error: function (jqXHR) {
                    notifyError('errorEmailNotChecked', jqXHR);
                }
            });
        }

        function toggleRegisterFormElementExistsWarning(element, response) {
            if (element.parents('form').hasClass('registerForm')) {
                if (response === true) {
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
            setTimeout(function () {
                $.ajax({
                    type: method,
                    url: URL,
                    success: function (response) {
                        closeWait();
                        emptyElement.empty().append(response);
                        changeLanguage(appendElement);
                        appendElement.delay(450).fadeIn();
                    },
                    error: function (jqXHR) {
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
            setTimeout(function () {
                $.ajax({
                    type: method,
                    url: URL,
                    success: function (response) {
                        emptyElement.empty().append(response);
                        changeLanguage(appendElement);
                        let loginScanner = new Instascan.Scanner({video: document.getElementById('loginQRScannerVideo')});
                        Instascan.Camera.getCameras().then(cameras => {
                            if (cameras.length > 0) {
                                loginScanner.addListener('scan', function (content) {
                                    $('.loginForm input').val(content);
                                    loginScanner.stop();
                                    registerLogin('login');
                                });
                                loginScanner.start(cameras[0]);
                            }
                        });
                        $(document).on('click', '.loginButton, .navbar-brand, .navRegister, .navbarUsers', function () {
                            loginScanner.stop();
                        });
                        appendElement.fadeIn();
                    },
                    error: function (jqXHR) {
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
                success: function (response) {
                    emptyElement.empty().append(response);
                    changeLanguage(appendElement);
                    adjustWelcomeLogo();
                    appendElement.fadeIn();
                },
                error: function (jqXHR) {
                    notifyError(onError, jqXHR);
                    appendElement.fadeIn();
                }
            });
        }

        // Calls register or login controller
        function registerLogin(text) {
            main.fadeOut();
            openWait();
            setTimeout(function () {
                $.post({
                    url: '/' + text,
                    data: $('.' + text + 'Form').serialize(),
                    success: function (response) {
                        closeWait();
                        main.empty().append(response);
                        changeLanguage(main);
                        if ($('.responseStatus').html() === 'success') {
                            toggleUsers(text);
                            main.delay(450).fadeIn();
                        } else if ($('.responseStatus').html() === 'error') {
                            afterRegisterLoginError($(this), text);
                            main.delay(450).fadeIn();
                        }
                    },
                    error: function (jqXHR) {
                        closeWait();
                        main.delay(450).fadeIn();
                        notifyError('error' + text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase() + 'Failed', jqXHR);
                    }
                });
            }, 450);
        }

        // Determines what happens when register or login fails
        function afterRegisterLoginError(text) {
            if (text === 'register' && $('.positionInput').val().length !== 0) {
                let position = $('.positionInput').val();
                let positionLocalized = null;
                $('.registerForm .positionsWrapper .dropdown-menu').find('button').each(function () {
                    if ($(this).val() === position)
                        positionLocalized = $(this).text();
                });
                $('.registerForm #userPosition').find('[data-user-position]')
                    .attr('data-user-position', position.substr(0, 1).toLowerCase() + position.substr(1))
                    .attr('data-localization', 'usersPositions' + position)
                    .text(positionLocalized);
            }
            $('.' + text + 'Form').find('.resetButtonWrapper').show(300);
            $('.' + text + 'Form').find('input').each(function () {
                $(this).removeClass('invalidInput').addClass('validInput');
                if ($(this).val().length > 0)
                    $(this).next().css({'top': '-12px', 'font-size': '14px'});
            });
            $('.formWarningServer').each(function () {
                $(this).parents('.inputWrapper').find('input').removeClass('validInput').addClass('invalidInput');
            });
            if (text === 'login') {
                let loginScanner = new Instascan.Scanner({video: document.getElementById('loginQRScannerVideo')});
                Instascan.Camera.getCameras().then(cameras => {
                    if (cameras.length > 0) {
                        loginScanner.addListener('scan', function (content) {
                            $('.loginForm input').val(content);
                            registerLogin('login');
                            loginScanner.stop();
                        });
                        loginScanner.start(cameras[0]);
                    }
                });
                $(document).on('click', '.loginButton, .navbar-brand, .navRegister, .navbarUsers', function () {
                    loginScanner.stop();
                });
            }
        }

        // Determines what happens when user clicks on “Register” or “Login” button
        $(document).on('click', '.registerButton, .loginButton', function (e) {
            main.fadeOut();
            e.preventDefault();
            registerLogin(($(this).hasClass('registerButton')) ? 'register' : 'login');
        });

        // Toggles users’ views based on their position
        function toggleUsers(text) {
            if (text === 'register' || text === 'login') {
                doAjax('/userNavbar', 'GET', $('.navbarUsers'), $('.navbarUsers'), 'errorNavbarLoadingFailed');
                changeTitle('usersHome');
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
            doAjax('/rightNavLogin', 'GET', $('.rightNavButtons'), $('.rightNavButtons'), 'errorNavbarLoadingFailed');
        }

        // Adjusts right navbar’s section after logout
        function renderRightNavLogout() {
            $('.rightNavButtons').fadeOut();
            doAjax('/rightNavLogout', 'GET', $('.rightNavButtons'), $('.rightNavButtons'), 'errorNavbarLoadingFailed');
        }

        // Adjusts navbar after logout
        function renderNavbarLogout() {
            doAjax('/logout', 'GET', $('.navbarUsers'), $('.navbarUsers'), 'errorNavbarLoadingFailed');
            $('.navbarUsers').fadeOut();
        }

        // Determines what happens when user clicks on “All contracts” button
        $(document).on('click', '.allContractsButton', function () {
            main.fadeOut();
            openWait();
            setTimeout(function () {
                $.get({
                    url: '/userContracts',
                    success: function (response) {
                        closeWait();
                        main.empty().append(response);
                        changeLanguage(main);
                        changeTitle('legalContracts');
                        main.delay(450).show();
                    },
                    error: function (jqXHR) {
                        closeWait();
                        main.delay(450).fadeIn();
                        notifyError('errorContractsNotFetched', jqXHR);
                    }
                });
            }, 450);
        });

        $(document).on('click', '.contractRow', function () {
            const index = $(this).children('.blockIndex').text();
            main.fadeOut();
            setTimeout(function () {
                $.get({
                    url: '/getContract/' + index,
                    success: function (response) {
                        main.empty().append(response);
                        changeLanguage(main);
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
                        $('.contract .signatureValid').each(function () {
                            $(this).text() === 'true' ? $(this).next().show() : $(this).next().next().show();
                        });
                        main.show();
                    },
                    error: function (jqXHR) {
                        main.fadeIn();
                        notifyError('errorContractNotFetched', jqXHR);
                    }
                });
            }, 450);
        });

        $(document).on('click', '.collapseButton', function () {
            !$(this).hasClass('collapsed') ?
                $(this).css('border-bottom', 'solid 2px') :
                $(this).css('border-bottom', 'none');
        });

        $(document).on('click', '.contractClause > .row', function () {
            $(this).find('.paragraphReadable').toggleClass('mr-3');
            $(this).find('.paragraphLegen, .clauseSubtitle').toggle();
        });

        // Tests off-hire clause
        $(document).on('click', '.enableClause', function () {
            $.get({
                url: '/testEnableClause',
                success: function (response) {
                    $('.testEnabledClause').hide(300).empty().append(response).show(300);
                }
            });
        });

        $(document).on('click', '.validateBlockchain', function () {
            openWait();
            doAjax('/validateBlockchain', 'GET', main, main, 'errorBlockchainNotValidated');
            document.title = 'Blockchain';
        });

        // Renders login view
        $(document).on('click', '[name="jumbotronLogin"], .navLogin', () => {
            main.fadeOut();
            $('.navLogin-parent').fadeOut();
            setNavbarToggler();
            doAjaxLogin('/login', 'GET', main, main, 'errorLoginPageNotFetched');
            changeTitle('usersLogin');
            navbar_brand.delay(450).fadeIn();
            $('.navRegister-wrapper').delay(450).fadeIn();
            if (!bgImage.hasClass('bg-image-blurred'))
                bgImage.delay(450).addClass('bg-image-blurred');
        });

        // Renders register view
        $(document).on('click', '[name="register"], .navRegister', () => {
            $('.navRegister-wrapper').fadeOut();
            setNavbarToggler();
            doAjax('/register', 'GET', main, main, 'errorRegisterPageNotFetched');
            changeTitle('usersRegister');
            navbar_brand.delay(450).fadeIn();
            $('.navLogin-wrapper').delay(450).fadeIn();
            if (!bgImage.hasClass('bg-image-blurred'))
                bgImage.delay(450).addClass('bg-image-blurred');
        });

        // Renders home page (different home page based on whether there is logged in user or not)
        $(document).on('click', '.navbar-brand', (e) => {
            e.preventDefault();
            $('.navBut').css('border-bottom', 'solid 0');
            $.get({
                url: '/isLoggedIn',
                success: function (response) {
                    if (response === true) {
                        doAjax('/dashboard', 'GET', main, main, 'errorWelcomePageNotFetched');
                        changeTitle('usersHome');
                    } else {
                        commonNavbarLogout();
                        setTimeout(() => {
                            doAjaxWelcome('/welcome', 'GET', main, main, 'errorWelcomePageNotFetched');
                            changeTitle('basicsHome');
                        }, 450);
                    }
                }
            });
        });

        // Renders logout
        $(document).on('click', '.logoutButton', (e) => {
            e.preventDefault();
            navBut.css('border-bottom', 'solid 0');
            commonNavbarLogout();
            toggleUsers('null');
            clearCookies();
            autoAdjustThemes();
            setLocaleCookie();
            changeLanguage($('html'));
            setTimeout(() => {
                setTimeout(() => {
                    doAjaxWelcome('/welcome', 'GET', main, main, 'errorWelcomePageNotFetched');
                }, 700);
                changeTitle('basicsHome');
            }, 450);
        });

        function commonNavbarLogout() {
            navbar_brand.fadeOut();
            $('.navbar-toggler-icon').addClass('navbarTogglerColored');
            main.fadeOut();
            $('.rightNavButtons').addClass('navButBackground');
            submitButtonWrapper.delay(450).hide();
            resetButtonWrapper.delay(450).hide();
            $('.navLogin-wrapper').fadeOut();
            $('.navRegister-wrapper').fadeOut();
            navbar.removeClass('navbarColored');
            if (bgImage.hasClass('bg-image-blurred'))
                bgImage.removeClass('bg-image-blurred');
        }

        // Clears cookies
        function clearCookies() {
            let cookies = document.cookie.split("; ");
            for (let c = 0; c < cookies.length; c++) {
                let d = window.location.hostname.split(".");
                while (d.length > 0) {
                    let cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                    let p = location.pathname.split('/');
                    document.cookie = cookieBase + '/';
                    while (p.length > 0) {
                        document.cookie = cookieBase + p.join('/');
                        p.pop();
                    }
                    d.shift();
                }
            }
        }

        // Determines what happens when user resets a form
        $(document).on('click', '.resetButton', function () {
            $(this).parents('form').find('.generatedKeys').hide(300);
            $(this).parents('form').find('input').attr('value', '');
            $(this).parents('form').find('.submitButtonWrapper, .resetButtonWrapper, .formWarning, .formWarningServer, .emailAlreadyInUse').hide(300);
            $(this).parents('form').find('.submitButton').prop('disabled', true);
            $(this).parents('form').find('input').removeClass('validInput invalidInput');
            $(this).parents().find('label').css({'top': '4px', 'font-size': '18px'});
            $('.keysCopiedToClipboard').hide(300);
            if ($(this).parents('form').hasClass('registerForm')) {
                $('.registerForm .positionInput').val('');
                $(this).parents('form').find('[data-user-position]').attr('data-user-position', 'usersPosition');
                $('[data-user-position]').html($('.usersPosition').html());
            }
        });
    });
});