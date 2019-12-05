const { h, Fragment, render } = window.preact;

$(document).ready(()=> {

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(() => {void(0);});
        });
    }

    let main = $('main');
    let mainSelector = document.querySelector('main');
    let navbarUsersSelector = document.querySelector('.navbarUsers');
    let rightNavButtonsSelector = document.querySelector('.rightNavButtons');
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
    $.getJSON('/localization').done(localesJson => {

        // Pre-configure Ajax to send antiforgery and JWT tokens as headers on every request
        $.ajaxPrefilter((options, originalOptions, jqXhr) => {
            let token = getCookie('XSRF-TOKEN');
            if (token !== undefined)
                if (token.length > 0)
                    jqXhr.setRequestHeader('X-XSRF-TOKEN', token);

            if (localStorage.getItem('JWT') != null)
                jqXhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'));
        });

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
            element.find('[data-localization]').each(function() {
                $(this).text(localesJson[locale][$(this).attr('data-localization')]);
                if ($(this).text().includes('\\'))
                    $(this).html($(this).text().replace(/[\\]/g, ''));
                if (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test($(this).text()))
                    $(this).html($(this).text());
            });
            element.find('[data-localization-title]').each(function() {
                $(this).attr('title', localesJson[locale][$(this).attr('data-localization-title')]);
            });
            element.find('[data-timestamp]').each(function() {
                $(this).text(datetimeFromTimestamp($(this).attr('data-timestamp')));
            });
            element.find('[data-localization-error]').each(function() {
                $(this).text(localesJson[locale][$(this).attr('data-localization-error')]);
            });
            element.find('[data-user-position]').each(function() {
                let text = $(this).attr('data-user-position') === 'usersPosition' ?
                    localesJson[locale]['usersPosition'] :
                    localesJson[locale]['usersPositions' + $(this).attr('data-user-position')];
                $('[data-user-position]').html(text);
            });
            element.find('.formWarningServer').each(function() {
                if ($(this).text().length > 0)
                    $(this).text(localesJson[locale][$(this).text()]);
            });
            element.find('.numberSeparators').each(function() {
                window.navigator.language.substr(3) === 'US' ?
                    $(this).text($(this).text().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) :
                    $(this).text($(this).text().toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))
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

        // Check if user is logged in
        if (localStorage.getItem('JWT') != null) {
            setNavbarToggler();
            renderView(parseJWT(localStorage.getItem('JWT')));
            navbar_brand.show();
            if (!bgImage.hasClass('bg-image-blurred'))
                bgImage.addClass('bg-image-blurred');
        } else {
            renderNavbarRegisterLogin();
            renderMainRightNav();
            renderWelcome();
            if (bgImage.hasClass('bg-image-blurred'))
                bgImage.removeClass('bg-image-blurred');
        }

        spiral.html(logoSpiral.html());
        navLogoSpiral.html(logoSpiral.html());
        $('.navLogoSpiral svg').attr('width', '41px');

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
        $('.locale').each(function() {
            if ($(this).val() === getCookie('Locale'))
                $('[data-user-position]').html($(this).html());
            adjustLogoLocale();
        });

        // Because the service is bilingual (for now), adjusts the logo width based on the provided translated name of the service
        function adjustLogoWidthByCookie() {
            getCookie('Locale') === 'el' ?
                adjustLogoWidthLong() : adjustLogoWidthShort();
        }

        // Same as above
        function adjustLogoWidthByNavigator() {
            navigator.languages[0].substr(0, 2) === 'el' ?
                adjustLogoWidthLong() : adjustLogoWidthShort();
        }

        function adjustLogoWidthLong() {
            $('.navLogoName svg').attr('width', '110px');
        }

        function adjustLogoWidthShort() {
            $('.navLogoName svg').attr('width', '105px');
        }

        // Adjusts logo locale based on given criteria
        function adjustLogoLocale() {
            if (getCookie('Locale') != null) {
                setLogoLanguage(getCookie('Locale').substr(0, 1).toUpperCase() + getCookie('Locale').substr(1, 1).toLowerCase());
                adjustLogoWidthByCookie();
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

        // Opens the waiting dots
        function openWaitDots(element) {
            element.find('.waitDots').slideDown(300);
        }

        // Closed the waiting dots
        function closeWaitDots(element) {
            element.find('.waitDots').slideUp(300);
        }

        // Checks if error message is in json format
        function isTextErrorMessage(jqXHR) {
            return !jqXHR.toString().startsWith('[');
        }

        // Decodes JWT to JSON
        function parseJWT (token) {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        // Checks if given object is JSON
        function isJSON(object) {
            return object.constructor === ({}).constructor;
        }

        // Shows a push notification with green background (success)
        function notifySuccess(text) {
            let finalText = $.parseHTML(`<span class="notificationResponseText" data-localization="${text}">${localesJson[getCookie('Locale')][text]}</span>`);
            $('[data-notification-status="success"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(finalText)
                .attr('data-notification-status', 'success')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show')
                .css('transition', '0s');
        }

        // Shows a push notification with red background (error)
        function notifyError(text, jqXHR) {
            let pushText = `
            <div class="notificationResponseText">
            <div class="notificationMessageTextInline" data-localization-error="${text}"></div>
            <div class="notificationDetails" data-localization="basicsDetails"></div></div>`;

            let textModified = changeLanguage($($.parseHTML(pushText)));
            setErrorMessageModal(jqXHR);

            $('[data-notification-status="error"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(textModified)
                .attr('data-notification-status', 'error')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show');
        }

        // Sets the details message modal
        function setErrorMessageModal(jqXHR) {
            let message;

            if (isJSON(jqXHR)) {
                if (jqXHR.hasOwnProperty('responseJSON')) {
                    if (jqXHR['responseJSON'].hasOwnProperty('title'))
                        message = jqXHR['responseJSON']['title'];
                    else if (jqXHR['responseJSON'].hasOwnProperty('message'))
                        message = jqXHR['responseJSON']['message'];
                    else
                        message = jqXHR['statusText'];
                } else if (jqXHR.hasOwnProperty('responseText')) {
                    if (jqXHR['responseText'].hasOwnProperty('title'))
                        message = jqXHR['responseText']['title'];
                    else if (jqXHR['responseText'].hasOwnProperty('message'))
                        message = jqXHR['responseText']['message'];
                    else
                        message = jqXHR['statusText'];
                }
            } else
                message = jqXHR;

            let details;

            if (!isTextErrorMessage(jqXHR))
                details = `
            <div class="messageTitle" data-localization="basicsErrorDetails"></div>
            <div class="messageErrorStatus" style="font-size:16px;"><span data-localization="errorCode"></span> ${jqXHR.status}</div>
            <div class="messageErrorMessage" style="font-size:16px;"><span data-localization="errorMessage"></span><br/>${message}</div>`;
            else
                details = `
            <div class="messageTitle" data-localization="basicsErrorDetails"></div>
            <div class="messageErrorMessage" style="font-size:16px;"><span data-localization="errorMessage"></span><br/>${jqXHR.toString()}</div>`;

            let detailsModified = changeLanguage($($.parseHTML(details)));
            $('.modal-overlay-message .modal-content').empty().append(detailsModified);
        }

        // Shows a neutral (with transparent background color) push notification
        function notifyNeutral(text, fade) {
            let finalText = $.parseHTML(`<span class="notificationResponseText" data-localization="${text}">${localesJson[getCookie('Locale')][text]}</span>`);
            $('[data-notification-status="neutral"]')
                .css('transition', '.3s')
                .show()
                .removeClass()
                .empty().append(finalText)
                .attr('data-notification-status', 'neutral')
                .addClass('pushNotification' + ' notify')
                .addClass('do-show')
                .css('transition', '0s');

            if (fade === true)
                if ($('.pushNotification').is(':visible'))
                    setTimeout(() => { $('.pushNotification').fadeOut(); }, 5000)
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
            setCookie('Locale', $(this).val());
            changeLanguage($('html'));
            adjustLogoLocale();
        });

        // Opens Settings
        $(document).on('click', '.navButSettings', () => {
            modalOverlay.removeClass('hidden');
            settingsModalElements.addClass('active');
        });

        // Opens message modal when user clicks on “Details” link of push notification or error message
        $(document).on('click', '.notificationDetails, .tableRowForm .errorDetailsLink', (e) => {
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
        $(document).on('show.bs.dropdown', '.dropdown', function() {
            let dropdown = $(this).find('.dropdown-menu');
            let orig_margin_top = parseInt(dropdown.css('margin-top'));
            dropdown.css({
                'margin-top': (orig_margin_top - 10) + 'px',
                opacity: 0
            }).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, 300, function() {
                $(this).css({'margin-top': ''});
            });
        });

        // Animates dropdown at closing
        $(document).on('hide.bs.dropdown', '.dropdown', function() {
            let dropdown = $(this).find('.dropdown-menu');
            let orig_margin_top = parseInt(dropdown.css('margin-top'));
            dropdown.css({
                'margin-top': orig_margin_top + 'px',
                opacity: 1,
                display: 'block'
            }).animate({'margin-top': (orig_margin_top - 10) + 'px', opacity: 0}, 300, function() {
                $(this).css({'margin-top': '', display: ''});
                $('.dropdown .show').css('display', 'none');
            });
        });

        // Adjusts border-bottom of a dropdown item’s parents when user clicks on it
        $(document).on('click', '.dropdownItem', function() {
            if ($(this).parents('.dropdown').hasClass('navButDropdown'))
                $(this).parents('.dropdown').find('.navBut').not('.userIconButton').css('border-bottom', 'solid 3px');
        });

        // Determines what happens when user presses the Esc button
        $(document).keyup(e => {
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
            let togglerIcon = $('.navbar-toggler-icon');

            dark.hide();
            lightCSS.prop('disabled', true);
            darkCSS.prop('disabled', false);
            light.show();
            navbar.removeClass('navbar-light').addClass('navbar-dark');
            navbar.hasClass('navbarColored') ?
                togglerIcon.removeClass('navbarTogglerColored') :
                togglerIcon.addClass('navbarTogglerColored');
            $('svg path').not('.welcomeSpiral svg path, #gears svg path, #splashScreen svg path').attr('fill', '#fff');
            $('.generatedKeys svg rect, .contract svg rect').attr('fill', '#fff');
            $('.generatedKeys svg path, .contract svg path').not('.contractIcon svg path').attr('fill', '#000');
        }

        function enableLight() {
            let togglerIcon = $('.navbar-toggler-icon');

            light.hide();
            darkCSS.prop('disabled', true);
            lightCSS.prop('disabled', false);
            dark.show();
            navbar.removeClass('navbar-dark').addClass('navbar-light');
            navbar.hasClass('navbarColored') ?
                togglerIcon.removeClass('navbarTogglerColored') :
                togglerIcon.addClass('navbarTogglerColored');
            $('svg path').not('.welcomeSpiral svg path, #gears svg path, #splashScreen svg path').attr('fill', '#001755');
            $('.generatedKeys svg rect, .contract svg rect').attr('fill', 'none');
            $('.generatedKeys svg path, .contract svg path').attr('fill', '#001755');
            $('[type="checkbox"]').each(function() {
                $(this).is(':checked') ?
                    $(this).parent('.toggle').removeClass('toggleDisabled').addClass('toggleEnabled') :
                    $(this).parent('.toggle').removeClass('toggleEnabled').addClass('toggleDisabled');
            });
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
            $(this).parents('.inputWrapper').find('.emailAlreadyInUse, .formWarning, .formWarningServer, .changesNotSavedWrapper').slideUp(300);
            if ($(this).parents('form').find('.afterSubmitNotSaved').is(':visible'))
                $(this).parents('form').find('.afterSubmitNotSaved').slideUp(400);
            if ($(this).parents('form').hasClass('registerForm')) {
                if ($(this).attr('name') === 'email' && validEmail($(this))) {
                    emailExists($(this));
                    if ($(this).hasClass('validInput')) {
                        $(this).parents('form').find('.submitButtonWrapper, .resetButtonWrapper').slideDown(300);
                        $(this).parents('form').find('.submitButton').prop('disabled', false);
                    }
                }
                toggleValidationColors($(this));
            } else if ($(this).parents('form').hasClass('newVesselForm') || $(this).parents('form').hasClass('vesselUpdateForm'))
                toggleValidationColors($(this));
            toggleFormButtons($(this));
        });

        // Returns the width of the given element’s text
        function getTextWidth(element) {
            let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
            let context = canvas.getContext('2d');
            context.font = window.getComputedStyle(element, null).getPropertyValue('font');
            return Math.floor(context.measureText(element.value).width) + 10;
        }

        // Calls the getTextWidth function
        function adjustElementWidth(element) {
            element.width(getTextWidth(element[0]));
        }

        // Adjusts a general table’s appearance after rendering
        function adjustGeneralTableAppearance(element) {
            element.find('.tableRowForm').each(function() {
                $(this).find('.rowFormTextElement').each(function() {
                    adjustElementWidth($(this));
                });
                $(this).find('input[type="checkbox"]').each(function() {
                    adjustCheckboxColor($(this));
                });
            });
            adjustTableAppearance();
        }

        // Adjusts the tables’ appearance when called
        function adjustTableAppearance() {
            let table = $('.table');
            if (table.is(':visible'))
                if (!$('.smallTitle').is(':visible')) {
                    if (window.outerWidth > $('main').width())
                        if (!table.hasClass('responsiveTable'))
                            table.addClass('responsiveTable');
                } else {
                    if (table.hasClass('responsiveTable'))
                        table.removeClass('responsiveTable')
                }
        }

        window.onresize = adjustTableAppearance;

        // Adjusts the appearance of sticky-top elements when scrolling
        $(document).scroll(function () {
            $('.sticky-top').toggleClass('stickyTopEnabled', $(this).scrollTop() > 200);
        });

        // Determines what happens when user inputs something in a row form
        $(document).on('input', '.tableRowForm input', function() {
            adjustElementWidth($(this));
            adjustTableAppearance();
        });

        function toggleFormButtons(element) {
            element.val().length !== 0 ?
                isValidForm(element) ? enableFormButtons(element) : disableOnlySubmit(element) : void(0);
        }

        function enableFormButtons(element) {
            element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper').slideDown(300);
            element.parents('form').find('.submitButton').prop('disabled', false);
        }

        function disableFormButtons(element) {
            element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper').slideUp(300);
            element.parents('form').find('.submitButton').prop('disabled', false);
        }

        function disableOnlySubmit(element) {
            element.parents('form').find('.submitButtonWrapper').slideUp(300);
            element.parents('form').find('.resetButtonWrapper').slideDown(300);
            element.parents('form').find('.submitButton').prop('disabled', true);
        }

        // Toggles green or red color to the input (border-bottom) based on whether it is valid or not
        function toggleValidationColors(element) {
            if (element.val().length > 0)
                element.removeClass('invalidInput').addClass('validInput');
            if ((element.parents('form').hasClass('registerForm') && element.attr('name') === 'email') ||
                element.parents('form').hasClass('newVesselForm') || element.parents('form').hasClass('vesselUpdateForm')) {
                isValidInput(element) ?
                    element.removeClass('invalidInput borderBottomSolid').addClass('validInput') :
                    element.removeClass('validInput').addClass('invalidInput borderBottomSolid');
            }
            if (element.val().length === 0)
                element.removeClass('validInput invalidInput');
        }

        // Similar as above when user inputs something in a form (change event)
        $(document).on('change', 'input', function() {
            if ($(this).parents('form').find('.afterSubmitNotSaved').is(':visible'))
                $(this).parents('form').find('.afterSubmitNotSaved').slideUp(400);
            if ($(this).val().length === 0) {
                $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'});
                $(this).parent().find('.formWarning, .formWarningServer, .changesNotSavedWrapper').slideUp(300);
            } else {
                if (!isValidInput($(this)))
                    $(this).parent().find('.formWarning').slideDown(300);
                $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
            }
        });

        $(document).on('focus', 'input', function() {
            $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
        });

        $(document).on('blur', 'input', function() {
            $(this).val().length === 0 ?
                $(this).parent().find('label').css({'top': '4px', 'font-size': '18px'}) :
                $(this).parent().find('label').css({'top': '-12px', 'font-size': '14px'});
        });

        function isValidInput(element) {
            if (element.parents('form').hasClass('registerForm')) {
                if (element.attr('name') === 'firstName')
                    return validFirstName(element);
                else if (element.attr('name') === 'lastName')
                    return validLastName(element);
                else if (element.attr('name') === 'email')
                    return validEmail(element);
                else if (element.attr('name') === 'position')
                    return validPosition(element);
            } else if (element.parents('form').hasClass('newVesselForm') || element.parents('form').hasClass('vesselUpdateForm')) {
                if (element.attr('name') === 'name')
                    return validVesselName(element);
                else if (element.attr('name') === 'imoNumber')
                    return validVesselImoNumber(element);
                else if (element.attr('name') === 'flag')
                    return validVesselFlag(element);
                else if (element.attr('name') === 'dwt')
                    return validVesselDwt(element);
                else if (element.attr('name') === 'yearBuilt')
                    return validVesselYearBuilt(element);
                else if (element.attr('name') === 'underConstruction')
                    return true;
            }
        }

        function isValidForm(element) {
            if (!(element.parents('form').find('.formWarning, .formWarningServer').is(':visible'))) {
                if (element.parents('form').hasClass('registerForm')) {
                    validateRegister(element);
                    return validFormAjax === true && keysHaveBeenGenerated === true;
                } else if (element.parents('form').hasClass('loginForm'))
                    return true;
                else if (element.parents('form').hasClass('newVesselForm')) {
                    if (element.parents('form').find('.vesselUnderConstructionInput').is(':checked'))
                        return true;
                    else
                        return validVesselName(element) &&
                            validVesselImoNumber(element) &&
                            validVesselFlag(element) &&
                            validVesselDwt(element) &&
                            validVesselYearBuilt(element);
                }
            }
        }

        function validateRegister(element) {
            let json = {};
            json['type'] = 'register';
            json['fields'] = $('.registerForm').serializeJSON({checkboxUncheckedValue: 'false'});
            delete json['fields']['privateKey'];

            $.post({
                url: '/registerIsValid',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(json)}, response => {
                responseBoolean(response, element);
            }).fail(jqXHR => {
                notifyError('errorRegisterFormNotValidated', jqXHR);
            });
        }

        // Generates user’s public and private keys by calling the appropriate controller
        function generateKeys() {
            let generatingKeysMessage = $('.generatingKeysMessage');
            generatingKeysMessage.slideDown(300);
            $.post('/generateKeys', response => {
                generatingKeysMessage.slideUp(300);
                renderGeneratedKeys(response);
                keysHaveBeenGenerated = true;
                $('.registerForm .submitButtonWrapper').slideDown(300);
                $('.registerForm .submitButton').prop('disabled', false);

                // Generate relevant QR code
                let generatedPrivateKey = $('.generatedPrivateKey');
                $('#publicKeyQR').html(qrcodegen.QrCode.encodeText($('.generatedPublicKey').html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                $('#privateKeyQR').html(qrcodegen.QrCode.encodeText(generatedPrivateKey.html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                $('#privateKeyText').val(generatedPrivateKey.text());

                // Adjust QR code’s colors based on current theme
                if (lightCSS.prop('disabled') === false) {
                    $('.generatedKeys svg rect').attr('fill', 'none');
                    $('.generatedKeys svg path').attr('fill', '#001755');
                } else if (darkCSS.prop('disabled') === false) {
                    $('.generatedKeys svg rect').attr('fill', '#fff');
                    $('.generatedKeys svg path').attr('fill', '#000');
                }
                $('.generatedKeys').slideDown(500);
            }).fail(jqXHR => {
                $('.generatedKeys').delay(450).slideDown(500);
                notifyError('errorKeysNotGenerated', jqXHR);
                keysHaveBeenGenerated = false;
            });
        }

        $(document).on('click', '.copyKeysToClipboard', function() {
            copyToClipboard($('.usersPublicKey').html() + ':\r\n' + $('.generatedPublicKey').html() + '\r\n' + $('.usersPrivateKey').html() + ':\r\n' + $('.generatedPrivateKey').html());
            $('.keysCopiedToClipboard').slideDown(300).delay(4000).slideUp(300);
        });

        // Determines what happens when user clicks on a QR code image
        $(document).on('click', '.qrCode', function() {
            copyToClipboard($(this).next().next('.qrCodeText').html());
            $(this).next('.copiedQR').slideDown(300).delay(4000).slideUp(300);
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

        // Sets the selected dropdown item value as the input value
        $(document).on('click', '.dropdownItem', function() {
            if ($(this).hasClass('position')) {
                $(this).parents('.dropdownItemsWrapper').find('.positionInput').val($(this).val());
                $(this).parents('.dropdownItemsWrapper').find('[data-user-position]').html($(this).html()).attr('data-user-position', $(this).val());
                validateRegister($(this));
            }
            $(this).parents('.dropdownItemsWrapper').find('.formWarningServer, .changesNotSavedWrapper').slideUp(300);
            $(this).parents('form').find('.resetButtonWrapper').slideDown(300);
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

        function validVesselName(element) {
            if (element.parents('.vesselUpdateForm').find('.vesselUnderConstructionInput').is(':checked'))
                return true;
            else {
                let vesselNameLength = element.parents('form').find('[name="name"]').val().length;
                return vesselNameLength >= 1 && vesselNameLength <= 100;
            }
        }

        function validVesselImoNumber(element) {
            if (element.parents('.vesselUpdateForm').find('.vesselUnderConstructionInput').is(':checked'))
                return true;
            else {
                let vesselImoNumberLength = element.parents('form').find('[name="imoNumber"]').val().length;
                return vesselImoNumberLength >= 1 && vesselImoNumberLength <= 60;
            }
        }

        function validVesselDwt(element) {
            if (element.parents('.vesselUpdateForm').find('.vesselUnderConstructionInput').is(':checked'))
                return true;
            else {
                let vesselDwtLength = element.parents('form').find('[name="dwt"]').val().length;
                return vesselDwtLength >= 1 && vesselDwtLength <= 10;
            }
        }

        function validVesselYearBuilt(element) {
            if (element.parents('.vesselUpdateForm').find('.vesselUnderConstructionInput').is(':checked'))
                return true;
            else
                return element.parents('form').find('[name="yearBuilt"]').val().length === 4;
        }

        function validVesselFlag(element) {
            if (element.parents('.vesselUpdateForm').find('.vesselUnderConstructionInput').is(':checked'))
                return true;
            else
                return element.parents('form').find('[name="flag"]').val().length >= 1;
        }

        function validFirstName(element) {
            let firstNameLength = element.parents('form').find('#firstName').val().length;
            return firstNameLength >= 1 && firstNameLength <= 100;
        }

        function validLastName(element) {
            let lastNameLength = element.parents('form').find('#lastName').val().length;
            return lastNameLength >= 1 && lastNameLength <= 100;
        }

        function validPosition(element) {
            return element.parents('form').find('#position').val().length >= 1;
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

        $(document).on('change', '[type="checkbox"]', function() {
            $(this).val($(this).is(':checked'));
            toggleFormButtons($(this));
            adjustCheckboxColor($(this));
        });

        function adjustCheckboxColor(element) {
            if (lightCSS.prop('disabled') === false)
                element.is(':checked') ?
                    element.parent('.toggle').removeClass('toggleDisabled').addClass('toggleEnabled') :
                    element.parent('.toggle').removeClass('toggleEnabled').addClass('toggleDisabled');
        }

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

        // Checks if the e-mail provided by the user already exists by calling the appropriate controller
        function emailExists(element) {
            $.post({
                url: '/emailExists',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: element.val()}, response => {
                toggleRegisterFormElementExistsWarning(element, response);
            }).fail(jqXHR => {
                notifyError('errorEmailNotChecked', jqXHR);
            });
        }

        function toggleRegisterFormElementExistsWarning(element, response) {
            if (element.parents('form').hasClass('registerForm')) {
                if (response === true) {
                    $('.' + element.attr('id') + 'AlreadyInUse').slideDown(300);
                    element.removeClass('validInput');
                    element.addClass('invalidInput');
                } else {
                    $('.' + element.attr('id') + 'AlreadyInUse').slideUp(300);
                    element.removeClass('invalidInput');
                    element.addClass('validInput');
                }
            }
        }

        // Toggles forms’ buttons’ color
        function toggleFormButtonsColor(element) {
            element.find('.formWithCloseButton svg path').each(function() {
                lightCSS.prop('disabled') === false ?
                    $(this).attr('fill', '#001755') :
                    $(this).attr('fill', '#fff');
            });
        }

        // Calls register or login controller
        function registerLogin(text) {
            let form = $('.' + text + 'Form');
            openWaitDots(form);
            let json = {};
            json['type'] = text;
            json['fields'] = form.serializeJSON({checkboxUncheckedValue: 'false'});
            setTimeout(() => {
                $.post({
                    url: '/' + text,
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(json)}, response => {
                    closeWaitDots(form);
                    if (response.hasOwnProperty('token')) {
                        localStorage.setItem('JWT', response['token']);
                        renderView(parseJWT(localStorage.getItem('JWT')));
                    } else {
                        afterFormFailed(form, response);
                        if (text === 'register')
                            if (response.hasOwnProperty('saved'))
                                if (response['saved'] === false)
                                    form.find('.afterSubmitNotSaved').slideDown(400);
                    }
                }).fail(jqXHR => {
                    closeWaitDots(form);
                    notifyError('error' + text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase() + 'Failed', jqXHR);
                });
            }, 450);
        }

        // Renders user’s view after successful register/login
        function renderView(json) {
            switch(json['position']) {
                case 'admin':
                    adminView(json);
                    break;
                case 'legalEngineer':
                    legalEngineerView(json);
                    break;
                case 'companyVesselsRegistryManager':
                    companyVesselsRegistryManagerView(json);
                    break;
            }
        }

        // Determines what happens when form submission fails
        function afterFormFailed(form, response) {
            if (form.hasClass('registerForm') && form.find('.emailAlreadyInUse').is(':visible'))
                form.find('.emailAlreadyInUse').slideUp(300);
            form.find('input').each(function() {
                if (response['invalidFields'].hasOwnProperty($(this).attr('name'))) {
                    $(this).removeClass('validInput').addClass('invalidInput').css('border-bottom', 'solid 1px');
                    $(this).parents('.inputWrapper').find('.formWarning').slideUp(300);
                    $(this).parents('.inputWrapper').find('.formWarningServer').attr('data-localization', response['invalidFields'][$(this).attr('name')]);
                    changeLanguage($(this).parents('.inputWrapper').find('.formErrors'));
                    $(this).parents('.inputWrapper').find('.formWarningServer').slideDown(300);
                }
            });

            if (form.hasClass('registerForm') && form.find('.positionInput').val().length !== 0) {
                let position = $('.positionInput').val();
                let positionLocalized = null;
                $('.registerForm .positionsWrapper .dropdown-menu').find('button').each(function() {
                    if ($(this).val() === position)
                        positionLocalized = $(this).text();
                });
                $('.registerForm #userPosition').find('[data-user-position]')
                    .attr('data-user-position', position)
                    .attr('data-localization', 'usersPositions' + position)
                    .text(positionLocalized);
            }
            form.find('.resetButtonWrapper').slideDown(300);
            form.find('input').each(function() {
                if ($(this).val().length > 0)
                    $(this).next('label').css({'top': '-12px', 'font-size': '14px'});
            });
            if (form.hasClass('loginForm')) {
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
            e.preventDefault();
            registerLogin(($(this).hasClass('registerButton')) ? 'register' : 'login');
        });

        $(document).on('click', '.collapseButton', function() {
            !$(this).hasClass('collapsed') ?
                $(this).css('border-bottom', 'solid 2px') :
                $(this).css('border-bottom', 'none');
        });

        // Renders login view
        $(document).on('click', '[name="jumbotronLogin"], .navLogin', () => {
            main.fadeOut();
            $('.navLogin-wrapper').fadeOut();
            setNavbarToggler();
            renderLogin();
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
            renderRegister();
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

            if (localStorage.getItem('JWT') != null)
                renderView(parseJWT(localStorage.getItem('JWT')));
            else {
                commonNavbarLogout();
                setTimeout(() => {
                    renderWelcome();
                    changeTitle('basicsHome');
                }, 450);
            }
        });

        // Determines what happens when user closes a form
        $(document).on('click', '.formCloseButton', function() {
            $('.newVesselWrapper').slideUp(500);
            $('.addNewVesselButton').slideDown(500);
        });

        // Renders logout
        $(document).on('click', '.logoutButton', (e) => {
            e.preventDefault();
            $.post('/logout').then(() => {
                localStorage.removeItem('JWT');
                renderMainRightNav();
                renderNavbarRegisterLogin();
                navBut.css('border-bottom', 'solid 0');
                commonNavbarLogout();
                clearCookies();
                autoAdjustThemes();
                setLocaleCookie();
                changeLanguage($('html'));
                setTimeout(() => {
                    setTimeout(() => {
                        renderWelcome();
                    }, 700);
                    changeTitle('basicsHome');
                }, 450);
                notifyNeutral('usersLogoutSuccess', true);
            }).fail(jqXHR => {notifyError('errorLogoutFailed', jqXHR);});
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
        $(document).on('click', '.resetButton', function() {
            resetForm($(this));
        });

        function resetForm(element) {
            if (element.parents('form').find('.afterSubmitNotSaved').is(':visible'))
                element.parents('form').find('.afterSubmitNotSaved').slideUp(400);
            if (element.parents('form').find('.generatedKeys').is(':visible'))
                element.parents('form').find('.generatedKeys').slideUp(300).delay(350).empty();
            element.parents('form').find('input').val('');
            if (element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper, .formWarning, .formWarningServer, .emailAlreadyInUse, .changesNotSavedWrapper').is(':visible'))
                element.parents('form').find('.submitButtonWrapper, .resetButtonWrapper, .formWarning, .formWarningServer, .emailAlreadyInUse, .changesNotSavedWrapper').slideUp(300);
            element.parents('form').find('.submitButton').prop('disabled', true);
            element.parents('form').find('input').each(function() {
                $(this).removeClass('validInput invalidInput borderBottomSolid');
            });
            element.parents().find('label').css({'top': '4px', 'font-size': '18px'});
            if (element.parents('form').hasClass('registerForm')) {
                $('.registerForm .positionInput').val('');
                element.parents('form').find('[data-user-position]').attr('data-user-position', 'usersPosition');
                $('[data-user-position]').text($('.usersPosition').text());
            } else if (element.parents('form').hasClass('newVesselForm')) {
                element.parents('form').find('.vesselFlagInput').val('');
                element.parents('form').find('[data-vessel-flag]').attr('data-vessel-flag', 'vesselsFlag');
                element.parents('form').find('[data-vessel-flag]').text($('.vesselsFlag').text());
            }
            if (lightCSS.prop('disabled') === false)
                element.parents('form').find('[type="checkbox"]').each(function() {
                    $(this).parents('.toggle').removeClass('toggleEnabled').addClass('toggleDisabled');
                });
            element.parents('form').trigger('reset');
        }

        function renderWelcome() {
            main.empty();
            render(h(() => {
                return (
                    h("div", {class: "jumbotron animate slideIn"},
                        h("h1", {class: "display-4"},
                            h("span", {class: "spiral"}),
                            h("span", {class: "logoName"})
                        ),
                        h("p", {class: "lead", "data-localization": "basicsWelcomeUnderConstruction"}),
                        h("hr", {class: "my-4"}),
                        h("div", {class: "jumbotron-buttons"},
                            h("button", {type: "button", class: "button jumbotron-button", "data-localization": "usersLogin", name: "jumbotronLogin"}),
                            h("button", {type: "button", class: "button jumbotron-button", "data-localization": "usersRegister", name: "register"})
                        )
                    )
                )
            }), mainSelector);
            changeLanguage(main);
            adjustWelcomeLogo();
            main.fadeIn();
        }

        // Adjusts right navbar’s section after login
        function renderRightNavLogin() {
            rightNavButtons.fadeOut();
            setTimeout(function() {
                rightNavButtons.empty();
                render(h(() => {
                    return (
                        h("li", {class: "nav-item"},
                            h("div", {class: "dropdown navButDropdown animate slideIn"},
                                h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton navBut userIconButton", type: "button", id: "userOptions", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                    h("span", {class: "symbol navButSymbolUser"}, "\uE13D")
                                ),
                                h("div", {class: "dropdown-menu dropdown-menu-right", "aria-labelledby": "userOptions"},
                                    h("button", {class: "dropdown-item dropdownItem navButSettings", type: "button"},
                                        h("span", {class: "symbol navButSymbolInline"}, "\uE713" + "  "),
                                        h("span", {"data-localization": "basicsSettings"})
                                    ),
                                    h("button", {class: "dropdown-item dropdownItem logoutButton", type: "button"},
                                        h("span", {class: "symbol navButSymbolInline"}, "\uf3b1" + "  "),
                                        h("span", {"data-localization": "usersLogout"})
                                    )
                                )
                            )
                        )
                    )
                }), rightNavButtonsSelector);
                changeLanguage(rightNavButtons);
                rightNavButtons.delay(450).fadeIn();
            }, 450);
        }

        function renderNavbarRegisterLogin() {
            let navbarUsers = $('.navbarUsers');
            navbarUsers.fadeOut();
            setTimeout(function() {
                navbarUsers.empty();
                render(h(() => {
                    return (
                        h(Fragment, null,
                            h("li", {class: "nav-item navLogin-wrapper", style: "display: none;"},
                                h("button", {type: "button", class: "navBut navLogin", "data-localization": "usersSwitchToLogin"})
                            ),
                            h("li", {class: "nav-item navRegister-wrapper", style: "display: none;"},
                                h("button", {type: "button", class: "navBut navRegister", "data-localization": "usersSwitchToRegister"})
                            )
                        )
                    )
                }), navbarUsersSelector);
                changeLanguage(navbarUsers);
                navbarUsers.delay(450).fadeIn();
            }, 450);
        }

        function renderMainRightNav() {
            rightNavButtons.fadeOut();
            setTimeout(function() {
                rightNavButtons.empty();
                render(h(() => {
                    return (
                        h("li", {class: "nav-item animate slideIn"},
                            h("button", {type: "button", class: "nav-item navButSymbol lightSymbol navButSettings", "data-localization-title": "basicsSettings"}, "\uE713")
                        )
                    )
                }), rightNavButtonsSelector);
                changeLanguage(rightNavButtons);
                rightNavButtons.delay(450).fadeIn();
            }, 450);
        }

        function renderRegister() {
            main.fadeOut();
            setTimeout(function() {
                main.empty();
                render(h(() => {
                    return (
                        h("div", {class: "register-wrapper animate slideIn"},
                            h("div", {class: "register"},
                                h("div", {class: "title", "data-localization": "usersRegister"}),
                                h("div", {class: "bg-text"},
                                    h("form", {class: "registerForm formClass"},
                                        h("div", {class: "form-row firstFormRow"},
                                            h("div", {class: "col inputWrapper"},
                                                h("input", {name: "firstName", type: "text",  maxlength: "100", id: "firstName", required: true}),
                                                h("label", {for: "firstName", "data-localization": "usersFirstName"}),
                                                h("div", {class: "formErrors"},
                                                    h("div", {class: "formWarning", "data-localization": "usersInvalidFirstName", style: "display:none;"}),
                                                    h("div", {class: "formWarningServer", style: "display:none;"})
                                                )
                                            ),
                                            h("div", {class: "col inputWrapper"},
                                                h("input", {name: "lastName", type: "text", maxlength: "100", id: "lastName", required: true}),
                                                h("label", {for: "lastName", "data-localization": "usersLastName"}),
                                                h("div", {class: "formErrors"},
                                                    h("div", {class: "formWarning", "data-localization": "usersInvalidLastName", style: "display:none;"}),
                                                    h("div", {class: "formWarningServer", style: "display:none;"})
                                                )
                                            )
                                        ),
                                        h("div", {class: "form-row"},
                                            h("div", {class: "col inputWrapper positionsWrapper dropdownItemsWrapper"},
                                                h("div", {class: "dropdown"},
                                                    h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton", "data-localization-title": "usersPosition", id: "userPosition", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                                        h("span", {"data-user-position": "usersPosition", "data-localization": "usersPosition"}),
                                                        h("span", {class: "caret symbol"}, "\uE011")),
                                                    h("div", {class: "dropdown-menu", "aria-labelledby": "userPosition"},
                                                        h("button", {class: "dropdown-item navButSymbol position dropdownItem", "data-localization": "usersPositionscompanyVesselsRegistryManager", type: "button", value: "companyVesselsRegistryManager"}),
                                                        h("button", {class: "dropdown-item navButSymbol position dropdownItem", "data-localization": "usersPositionslegalEngineer", type: "button", value: "legalEngineer"})
                                                    )
                                                ),
                                                h("input", {class: "positionInput", name: "position", type: "text", id: "position", required: true, hidden: true}),
                                                h("label", {style: "display:none;", for: "position", "data-localization": "usersPosition"}),
                                                h("div", {class: "formErrors formErrorsFull"},
                                                    h("div", {class: "formWarningServer", style: "display:none;"
                                                    })
                                                )
                                            )
                                        ),
                                        h("div", {class: "form-row"},
                                            h("div", {class: "col inputWrapper"},
                                                h("input", {name: "email", class: "registerEmailInput", type: "text", id: "email", required: true}),
                                                h("label", {for: "email", "data-localization": "usersEmail"}),
                                                h("div", {class: "formErrors formErrorsFull"},
                                                    h("div", {class: "formWarning", "data-localization": "errorEmailInvalid", style: "display:none;"}),
                                                    h("div", {class: "emailAlreadyInUse", "data-localization": "errorEmailAlreadyInUse", style: "display:none;"}),
                                                    h("div", {class: "formWarningServer", style: "display:none;"
                                                    })
                                                )
                                            )
                                        ),
                                        h("div", {class: "form-row", style: "display:none;"},
                                            h("div", {class: "col inputWrapper"},
                                                h("input", {name: "privateKey", type: "password", id: "privateKeyText", required: true, hidden: true}),
                                                h("label", {for: "privateKeyText", "data-localization": "usersPrivateKey"}),
                                                h("div", {class: "formErrors formErrorsFull"},
                                                    h("div", {class: "formWarningServer", style: "display:none;"})
                                                )
                                            )
                                        ),
                                        h("div", {class: "generatingKeysMessage", "data-localization": "usersGeneratingKeysMessage", style: "display:none;"}),
                                        h("div", {class: "generatedKeys", style: "display:none;"}),
                                        h("div", {class: "text-center formButtons"},
                                            h("div", {class: "submitButtonWrapper formButton1", style: "display:none;"},
                                                h("button", {type: "submit", class: "button submitButton registerButton", "data-localization": "usersRegister"})
                                            ),
                                            h("div", {class: "resetButtonWrapper formButton2", style: "display:none;"},
                                                h("button", {class: "button resetButton", "data-localization": "basicsFormReset",type: "reset"})
                                            )
                                        ),
                                        h(WaitDots),
                                        h("div", {class: "afterSubmitNotSaved", style: "display:none;"},
                                            h("span", {"data-localization": "errorSubmittedNotSaved"})
                                        )
                                    )
                                )
                            )
                        )
                    )
                }), mainSelector);
                toggleFormButtonsColor($('.register-wrapper'));
                changeLanguage(main);
                main.delay(450).fadeIn();
            }, 450);
        }

        function renderLogin() {
            main.fadeOut();
            setTimeout(function() {
                main.empty();
                render(h(() => {
                    return (
                        h("div", {class: "login-wrapper animate slideIn"},
                            h("div", {class: "login"},
                                h("div", {class: "title", "data-localization": "usersLogin"}),
                                h("div", {class: "bg-text"},
                                    h("div", {class: "loginWithQRScan", "data-localization": "usersLoginWithQRScan"}),
                                    h("video", {id: "loginQRScannerVideo"}),
                                    h("div", {class: "orInputQRCodeLogin", "data-localization": "usersOrTypeQRCodeLogin"}),
                                    h("form", {class: "loginForm"},
                                        h("div", {class: "form-row firstFormRow inputWrapper"},
                                            h("div", {class: "col"},
                                                h("input", {name: "privateKey", id: "privateKey", type: "password", required: true}),
                                                h("span", {class: "passwordEye symbol", "data-localization-title": "usersRevealPrivateKey"}, "\uE052"),
                                                h("label", {for: "privateKey", "data-localization": "usersPrivateKey"}),
                                                h("div", {class: "formErrors"},
                                                    h("div", {class: "formWarningServer", style: "display:none;"})
                                                )
                                            )
                                        ),
                                        h("div", {class: "text-center formButtons"},
                                            h("div", {class: "submitButtonWrapper formButton1", style: "display:none;"},
                                                h("button", {type: "submit", class: "button submitButton loginButton", "data-localization": "usersLogin"})
                                            ),
                                            h("div", {class: "resetButtonWrapper formButton2", style: "display:none;"},
                                                h("button", {class: "button resetButton", "data-localization": "basicsFormReset", type: "reset"})
                                            )
                                        ),
                                        h(WaitDots)
                                    )
                                )
                            )
                        )
                    )
                }), mainSelector);
                changeLanguage(main);
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
                main.delay(450).fadeIn();
            }, 450);
        }

        function renderGeneratedKeys(keys) {
            let generatedKeys = $('.generatedKeys');
            generatedKeys.empty();
            render(h(() => {
                return (
                    h("div", {class: "container"},
                        h("div", {class: "row copyKeysToClipboard", "data-localization-title": "usersCopyKeysToClipboard"},
                            h("div", {class: "col"},
                                h("div", {class: "generatedKeysTitle", "data-localization": "usersPublicKey"}),
                                h("div", {id: "publicKeyQR"}),
                                h("div", {class: "generatedPublicKey", style: "display:none;"}, keys['publicKey'])
                            ),
                            h("div", {class: "col"},
                                h("div", {class: "generatedKeysTitle", "data-localization": "usersPrivateKey"}),
                                h("div", {id: "privateKeyQR"}),
                                h("div", {class: "generatedPrivateKey", style: "display:none;"}, keys['privateKey'])
                            )
                        ),
                        h("div", {class: "keysCopiedToClipboard", "data-localization": "usersKeysCopiedToClipboard", style: "display:none;"}),
                        h("div", {class: "messageBeforeRegister", "data-localization": "usersMessageBeforeRegister"})
                    )
                )
            }), document.querySelector('.generatedKeys'));
            changeLanguage(generatedKeys);
        }

        const WaitDots = () => {
            return(
                h("div", {class: "waitDots", style: "display:none;"},
                    h("h1", {class: "dot one"}, "."),
                    h("h1", {class: "dot two"}, "."),
                    h("h1", {class: "dot three"}, ".")
                )
            )
        };

        const AfterUpdatedValidation = () => {
            return(
                h(Fragment, null,
                    h("div", {class: "symbol bgTextSymbolCenter successTextColorSmall validationSymbolSmall", style: "display:none;"}, "\uE008"),
                    h("div", {class: "changesNotSavedWrapper", style: "display:none;"},
                        h("div", {class: "symbol bgTextSymbolCenter errorTextColor validationSymbolSmall"}, "\uE10A"),
                        h("div", {class: "changesNotSavedText", "data-localization": "errorChangesNotSaved"}),
                        h("div", {class: "errorDetailsLink", "data-localization": "basicsDetails"})
                    )
                )
            )
        };

        function adminView(responseJson) {
            renderAdminDashboard(responseJson['firstName']);
            renderAdminNavbar();

            function renderAdminDashboard(firstName) {
                changeTitle('usersHome');
                renderRightNavLogin();
                main.fadeOut();
                setTimeout(function() {
                    main.empty();
                    render(h(() => {
                        return (
                            h("div", {class: "welcomeMessage animate slideIn"},
                                h("div", {class: "welcomeSpiral"},
                                    h("svg", {viewBox: "0 0 571 619", width: "160px"},
                                        h("path", {fill: "#fff", d: "M 218.84,619.00 C 163.23,619.50 105.52,609.09 54.61,586.37 48.11,583.47 42.11,579.87 36.21,575.87 31.41,572.66 26.10,569.56 22.20,565.16 14.50,556.45 22.90,545.04 33.41,550.54 38.31,553.15 42.31,557.15 47.11,560.05 52.81,563.56 58.71,566.66 64.81,569.46 77.41,575.26 90.62,579.67 104.02,583.07 131.82,590.18 160.73,594.18 189.33,596.08 218.44,597.98 247.84,596.98 276.65,592.18 330.56,583.07 382.47,560.05 426.27,527.53 468.08,496.50 501.79,455.67 524.69,408.83 549.30,358.39 558.70,302.14 548.60,246.70 539.49,196.96 516.29,148.22 482.28,110.79 446.68,71.66 397.97,46.74 347.66,32.23 323.46,25.22 298.75,20.42 273.55,20.42 249.54,20.42 225.64,24.42 202.84,31.63 157.23,46.14 116.02,73.56 84.51,109.39 56.21,141.61 35.91,181.05 25.80,222.68 16.00,263.41 16.30,307.65 33.91,346.28 53.51,389.11 92.92,418.44 136.52,433.85 186.33,451.36 241.34,451.97 291.85,437.35 317.36,429.95 341.96,419.44 361.86,401.62 380.47,385.01 393.67,363.19 399.27,338.87 410.07,292.34 392.27,243.50 360.46,209.17 345.26,192.86 326.56,179.75 305.45,172.44 282.15,164.33 255.44,163.83 231.24,167.54 204.34,171.54 179.93,183.55 162.83,204.97 148.23,223.38 140.52,246.00 145.73,269.42 150.93,293.14 164.03,314.85 182.53,330.57 201.24,346.38 228.14,357.59 252.94,353.39 277.15,349.28 297.15,327.36 301.85,303.55 306.05,281.93 295.75,258.21 277.95,245.50 269.85,239.69 259.45,236.29 249.44,238.29 240.84,240.09 232.84,245.70 227.04,252.20 221.74,258.21 217.14,266.62 219.74,274.82 223.14,285.53 236.74,289.73 245.74,294.24 249.44,296.04 254.94,298.14 256.64,302.24 258.55,306.85 254.64,312.05 249.94,312.25 244.54,312.55 238.34,309.15 233.54,307.05 227.74,304.55 222.14,301.64 217.14,297.74 207.74,290.53 200.74,280.33 201.84,268.12 202.94,255.71 209.54,243.50 218.54,234.99 236.04,218.38 262.55,216.47 283.05,228.58 303.25,240.49 316.66,263.11 319.16,286.23 321.96,311.65 310.85,336.77 291.65,353.39 272.65,369.80 248.14,375.40 223.74,370.40 198.53,365.19 174.93,351.68 158.03,332.37 141.12,313.05 128.42,286.93 126.22,261.21 121.52,206.87 169.13,164.93 218.04,152.82 265.75,141.11 316.96,152.32 356.06,181.85 395.17,211.37 419.97,257.01 420.97,306.25 421.57,331.27 416.17,356.59 404.37,378.71 392.57,401.02 374.07,419.14 352.26,431.75 304.45,459.47 247.44,471.68 192.53,465.88 142.42,460.57 90.52,441.36 53.71,406.03 16.70,370.20 -1.80,320.66 0.10,269.32 2.10,215.47 22.20,160.53 53.31,116.79 83.81,73.86 126.82,42.13 175.03,21.62 200.04,11.01 226.04,2.70 253.24,0.60 281.25,-1.50 309.55,2.00 336.76,8.81 386.87,21.42 436.08,43.44 475.58,77.16 513.59,109.69 540.69,153.32 556.10,200.76 571.50,248.10 575.10,299.34 566.10,348.38 556.80,399.02 533.19,444.86 500.09,483.99 466.08,524.22 424.07,558.25 376.87,581.87 327.86,606.29 273.55,618.80 218.84,619.00 Z"})
                                    )
                                ),
                                h("div", {class: "welcomeName"},
                                    h("span", {"data-localization": "usersWelcome"}), ", " + firstName + "."),
                                h("div", {class: "welcomeSubtitle", "data-localization": "usersWelcomeSubtitle"})
                            )
                        )
                    }), mainSelector);
                    changeLanguage(main);
                    main.delay(450).fadeIn();
                }, 450);
            }

            function renderAdminNavbar() {
                let navbarUsers = $('.navbarUsers');
                navbarUsers.fadeOut();
                setTimeout(function() {
                    navbarUsers.empty();
                    render(h(() => {
                        return (
                            h("li", {class: "dropdown navButDropdown animate slideIn"},
                                h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton navBut", type: "button", id: "blockchainOptions", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                    h("span", {class: "symbol navButSymbolInline"}, "\uF22C"), " Blockchain",
                                    h("span", {class: "caret symbol"}, "\uE011")
                                ),
                                h("div", {class: "dropdown-menu", "aria-labelledby": "blockchainOptions"},
                                    h("button", {class: "dropdown-item dropdownItem validateBlockchain", "data-localization": "adminValidateBlockchain", type: "button"})
                                )
                            )
                        )
                    }), navbarUsersSelector);
                    changeLanguage(navbarUsers);
                    navbarUsers.delay(450).fadeIn();
                }, 450);
            }

            $(document).on('click', '.validateBlockchain', () => {
                openWait();
                document.title = 'Blockchain';
                main.fadeOut();
                openWait();
                setTimeout(() => {
                    $.post('/validateBlockchain', response => {
                        closeWait();
                        main.empty();
                        renderBlockchainValidation(response);
                        changeLanguage(main);
                        main.delay(450).show();
                    }).fail(jqXHR => {
                        closeWait();
                        main.delay(450).fadeIn();
                        notifyError('errorBlockchainNotValidated', jqXHR);
                    });
                }, 450);
            });

            function renderBlockchainValidation(array) {
                render(h(() => {
                    return (
                        h("div", {class: "container bg-text blockchainValidationResults animate slideIn"},
                            array[0].hasOwnProperty('emptyBlockchain') && array[0]['emptyBlockchain'][0] === 'y' ?
                                h("div", {class: "row"},
                                    h("div", {class: "col"},
                                        h("div", {class: "symbol bgTextSymbolCenter"}, "\uE946"),
                                        h("div", {class: "bgTextMessage text-center", "data-localization": "adminBlockchainIsEmpty"})
                                    )
                                )
                                :
                                $.isEmptyObject(array[0]) && $.isEmptyObject(array[1]) ?
                                    h("div", {class: "row"},
                                        h("div", {class: "col"},
                                            h("div", {class: "symbol bgTextSymbolCenter successTextColor"}, "\uE008"),
                                            h("div", {class: "bgTextMessage text-center", "data-localization": "adminBlockchainIsValid"})
                                        )
                                    )
                                    :
                                    h("div", {class: "row"},
                                        h("div", {class: "col"},
                                            h("div", {class: "symbol bgTextSymbolCenter errorTextColor"}, "\uE10A"),
                                            h("div", {"data-localization": "adminBlockchainIsInvalid"}),
                                            h(Fragment, null,
                                                !$.isEmptyObject(array[0]) ?
                                                    h(Fragment, null,
                                                        h("div", {class: "invalidBlockchainResultsHead text-center", "data-localization": "adminBlockchainResultsCalculationMessage"}),
                                                        h("div", {class: "table responsiveTable"},
                                                            h("div", {class: "row d-none d-lg-flex tableRowTitle"},
                                                                h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainBlockNumber"}),
                                                                h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainTimestamp"}),
                                                                h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainHashExpected"}),
                                                                h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainHashFound"})
                                                            ),
                                                            $.map(array[0], (element, index) => {
                                                                return (
                                                                    h("div", {class: "row tableSimpleRow blockchainValidationResultRow"},
                                                                        h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                            h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainBlockNumber"}),
                                                                            h("div", {class: " resultsBlockNumber"}, index)
                                                                        ),
                                                                        h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                            h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainTimestamp"}),
                                                                            h("div", {"data-timestamp": element[0]})
                                                                        ),
                                                                        h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                            h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainHashExpected"}),
                                                                            h("div", {class: "validationResultsHash"}, element[1])
                                                                        ),
                                                                        h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                            h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainHashFound"}),
                                                                            h("div", {class: "validationResultsHash"}, element[2]))
                                                                    )
                                                                )
                                                            })
                                                        )
                                                    )
                                                    :
                                                    void(0),
                                                h(Fragment, null,
                                                    !$.isEmptyObject(array[1]) ?
                                                        h(Fragment, null,
                                                            h("div", {class: "invalidBlockchainResultsHead text-center", "data-localization": "adminBlockchainResultsReferenceMessage"}),
                                                            h("div", {class: "table responsiveTable"},
                                                                h("div", {class: "row d-none d-lg-flex tableRowTitle"},
                                                                    h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainNumberTimestampOfFirst"}),
                                                                    h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainNumberTimestampOfSecond"}),
                                                                    h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainHashExpected"}),
                                                                    h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainHashFound"})
                                                                ),
                                                                $.map(array[1], (element, index) => {
                                                                    return (
                                                                        h("div", {class: "row tableSimpleRow blockchainValidationResultRow"},
                                                                            h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                                h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainNumberTimestampOfFirst"}),
                                                                                h("div", null, index + " / ",
                                                                                    h("span", {"data-timestamp": element[0]})
                                                                                )
                                                                            ),
                                                                            h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                                h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainNumberTimestampOfSecond"}),
                                                                                h("div", null, parseInt(index) + 1 + " / ",
                                                                                    h("span", {"data-timestamp": element[1]})
                                                                                )
                                                                            ),
                                                                            h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                                h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainHashExpected"}),
                                                                                h("div", {class: "validationResultsHash"}, element[2]),
                                                                            ),
                                                                            h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                                                h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainHashFound"}),
                                                                                h("div", {class: "validationResultsHash"}, element[3]))
                                                                        )
                                                                    )
                                                                })
                                                            )
                                                        )
                                                        :
                                                        void(0)
                                                )
                                            )
                                        )
                                    )
                        )
                    )
                }), mainSelector);
            }

            adjustGeneralTableAppearance($('main .blockchainValidationResults'));
        }

        function companyVesselsRegistryManagerView(responseJson) {
            const AddNewVesselForm = () => {
                return (
                    h(Fragment, null, h("div", {class: "addButton addNewVesselButton animate slideIn"},
                        h("button", {"data-localization-title": "vesselsAddNew", class: "plus"},
                            h("span", null, "+"))
                        ),
                        h("div", {class: "newVesselWrapper animate slideIn", style: "display:none;"},
                            h("div", {class: "innerFormTitle", "data-localization": "vesselsAddNew"}),
                            h("div", {class: "bg-text formWithCloseButton"},
                                h("div", {class: "formCloseButton"},
                                    h("svg", {viewBox: "0 0 20 20"},
                                        h("path", {fill: "#001755", d: "M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"})
                                    )
                                ),
                                h("form", {class: "newVesselForm formClass"},
                                    h("div", {class: "form-row firstFormRow"},
                                        h("div", {class: "col inputWrapper"},
                                            h("input", {name: "name", type: "text", maxlength: "100", id: "newVesselName", required: true}),
                                            h("label", {for: "newVesselName", "data-localization": "vesselsName"}),
                                            h("div", {class: "formErrors formErrorsFull"},
                                                h("div", {class: "formWarning", "data-localization": "vesselsInvalidName", style: "display:none;"}),
                                                h("div", {class: "formWarningServer", style: "display:none;"})
                                            )
                                        )
                                    ),
                                    h("div", {class: "form-row"},
                                        h("div", {class: "col inputWrapper"},
                                            h("input", {name: "imoNumber", type: "text", maxlength: "100", id: "newVesselImoNumber", required: true}),
                                            h("label", {for: "newVesselImoNumber", "data-localization": "vesselsImoNumber"}),
                                            h("div", {class: "formErrors"},
                                                h("div", {class: "formWarning", "data-localization": "vesselsInvalidImoNumber", style: "display:none;"}),
                                                h("div", {class: "formWarningServer", style: "display:none;"})
                                            )
                                        ),
                                        h("div", {class: "col inputWrapper checkboxField"},
                                            h("div", {class: "col-auto"},
                                                h("span", {"data-localization": "vesselsUnderConstruction"})
                                            ),
                                            h("div", {class: "col-auto"},
                                                h("label", {class: "toggle"},
                                                    h("input", {class: "vesselUnderConstructionInput", name: "underConstruction", "data-value-type": "boolean", type: "checkbox"}),
                                                    h("div", null)
                                                )
                                            )
                                        )
                                    ),
                                    h("div", {class: "form-row"},
                                        h("div", {class: "col inputWrapper vesselFlagsWrapper dropdownItemsWrapper"},
                                            h("div", {class: "dropdown"},
                                                h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton", "data-localization-title": "vesselsFlag", id: "newVesselVesselsFlag", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                                    h("span", {"data-vessel-flag": "vesselsFlag", "data-localization": "vesselsFlag"}),
                                                    h("span", {class: "caret symbol"}, "\uE011")),
                                                h("div", {class: "dropdown-menu", "aria-labelledby": "newVesselVesselsFlag"},
                                                    h("button", {class: "dropdown-item navButSymbol vesselFlag dropdownItem", "data-localization": "vesselsFlagsGR", type: "button", value: "GR"}),
                                                    h("button", {class: "dropdown-item navButSymbol vesselFlag dropdownItem", "data-localization": "vesselsFlagsUS", type: "button", value: "US"})
                                                )
                                            ),
                                            h("input", {class: "vesselFlagInput", name: "flag", type: "text", id: "newVesselFlag", required: true, hidden: true}),
                                            h("label", {style: "display:none;", for: "newVesselFlag", "data-localization": "vesselsFlag"}),
                                            h("div", {class: "formErrors formErrorsFull"},
                                                h("div", {class: "formWarningServer", style: "display:none;"})
                                            )
                                        )
                                    ),
                                    h("div", {class: "form-row"},
                                        h("div", {class: "col inputWrapper"},
                                            h("input", {name: "dwt", type: "text", maxlength: "10", id: "newVesselDwt", required: true}),
                                            h("label", {for: "newVesselDwt", "data-localization": "vesselsDwt"}),
                                            h("div", {class: "formErrors"},
                                                h("div", {class: "formWarning", "data-localization": "errorRequiredVesselDwt", style: "display:none;"}),
                                                h("div", {class: "formWarningServer", style: "display:none;"})
                                            )
                                        ),
                                        h("div", {class: "col inputWrapper"},
                                            h("input", {name: "yearBuilt", type: "text", minlength: "4", maxlength: "4", id: "newVesselYearBuilt", required: "required"}),
                                            h("label", {for: "newVesselYearBuilt", "data-localization": "vesselsYearBuilt"}),
                                            h("div", {class: "formErrors"},
                                                h("div", {class: "formWarning", "data-localization": "errorSizeVesselYearBuilt", style: "display:none;"}),
                                                h("div", {class: "formWarningServer", style: "display:none;"})
                                            )
                                        )
                                    ),
                                    h("div", {class: "text-center formButtons"},
                                        h("div", {class: "submitButtonWrapper formButton1", style: "display:none;"},
                                            h("button", {type: "submit", class: "button submitButton submitNewVesselButton", "data-localization": "basicsAdd"})
                                        ),
                                        h("div", {class: "resetButtonWrapper formButton2", style: "display:none;"},
                                            h("button", {class: "button resetButton", "data-localization": "basicsFormReset", type: "reset"})
                                        )
                                    ),
                                    h(WaitDots)
                                )
                            )
                        )
                    )
                )
            };

            renderCompanyVesselsRegistryManagerDashboard(responseJson['firstName']);
            renderCompanyVesselsRegistryManagerNavbar();

            function renderCompanyVesselsRegistryManagerDashboard(firstName) {
                changeTitle('usersHome');
                renderRightNavLogin();
                main.fadeOut();
                setTimeout(function() {
                    main.empty();
                    render(h(() => {
                        return (
                            h("div", {class: "welcomeMessage animate slideIn"},
                                h("div", {class: "welcomeSpiral"},
                                    h("svg", {viewBox: "0 0 571 619", width: "160px"},
                                        h("path", {fill: "#fff", d: "M 218.84,619.00 C 163.23,619.50 105.52,609.09 54.61,586.37 48.11,583.47 42.11,579.87 36.21,575.87 31.41,572.66 26.10,569.56 22.20,565.16 14.50,556.45 22.90,545.04 33.41,550.54 38.31,553.15 42.31,557.15 47.11,560.05 52.81,563.56 58.71,566.66 64.81,569.46 77.41,575.26 90.62,579.67 104.02,583.07 131.82,590.18 160.73,594.18 189.33,596.08 218.44,597.98 247.84,596.98 276.65,592.18 330.56,583.07 382.47,560.05 426.27,527.53 468.08,496.50 501.79,455.67 524.69,408.83 549.30,358.39 558.70,302.14 548.60,246.70 539.49,196.96 516.29,148.22 482.28,110.79 446.68,71.66 397.97,46.74 347.66,32.23 323.46,25.22 298.75,20.42 273.55,20.42 249.54,20.42 225.64,24.42 202.84,31.63 157.23,46.14 116.02,73.56 84.51,109.39 56.21,141.61 35.91,181.05 25.80,222.68 16.00,263.41 16.30,307.65 33.91,346.28 53.51,389.11 92.92,418.44 136.52,433.85 186.33,451.36 241.34,451.97 291.85,437.35 317.36,429.95 341.96,419.44 361.86,401.62 380.47,385.01 393.67,363.19 399.27,338.87 410.07,292.34 392.27,243.50 360.46,209.17 345.26,192.86 326.56,179.75 305.45,172.44 282.15,164.33 255.44,163.83 231.24,167.54 204.34,171.54 179.93,183.55 162.83,204.97 148.23,223.38 140.52,246.00 145.73,269.42 150.93,293.14 164.03,314.85 182.53,330.57 201.24,346.38 228.14,357.59 252.94,353.39 277.15,349.28 297.15,327.36 301.85,303.55 306.05,281.93 295.75,258.21 277.95,245.50 269.85,239.69 259.45,236.29 249.44,238.29 240.84,240.09 232.84,245.70 227.04,252.20 221.74,258.21 217.14,266.62 219.74,274.82 223.14,285.53 236.74,289.73 245.74,294.24 249.44,296.04 254.94,298.14 256.64,302.24 258.55,306.85 254.64,312.05 249.94,312.25 244.54,312.55 238.34,309.15 233.54,307.05 227.74,304.55 222.14,301.64 217.14,297.74 207.74,290.53 200.74,280.33 201.84,268.12 202.94,255.71 209.54,243.50 218.54,234.99 236.04,218.38 262.55,216.47 283.05,228.58 303.25,240.49 316.66,263.11 319.16,286.23 321.96,311.65 310.85,336.77 291.65,353.39 272.65,369.80 248.14,375.40 223.74,370.40 198.53,365.19 174.93,351.68 158.03,332.37 141.12,313.05 128.42,286.93 126.22,261.21 121.52,206.87 169.13,164.93 218.04,152.82 265.75,141.11 316.96,152.32 356.06,181.85 395.17,211.37 419.97,257.01 420.97,306.25 421.57,331.27 416.17,356.59 404.37,378.71 392.57,401.02 374.07,419.14 352.26,431.75 304.45,459.47 247.44,471.68 192.53,465.88 142.42,460.57 90.52,441.36 53.71,406.03 16.70,370.20 -1.80,320.66 0.10,269.32 2.10,215.47 22.20,160.53 53.31,116.79 83.81,73.86 126.82,42.13 175.03,21.62 200.04,11.01 226.04,2.70 253.24,0.60 281.25,-1.50 309.55,2.00 336.76,8.81 386.87,21.42 436.08,43.44 475.58,77.16 513.59,109.69 540.69,153.32 556.10,200.76 571.50,248.10 575.10,299.34 566.10,348.38 556.80,399.02 533.19,444.86 500.09,483.99 466.08,524.22 424.07,558.25 376.87,581.87 327.86,606.29 273.55,618.80 218.84,619.00 Z"})
                                    )
                                ),
                                h("div", {class: "welcomeName"},
                                    h("span", {"data-localization": "usersWelcome"}), ", " + firstName + "."),
                                h("div", {class: "welcomeSubtitle", "data-localization": "usersWelcomeSubtitle"})
                            )
                        )
                    }), mainSelector);
                    changeLanguage(main);
                    main.delay(450).fadeIn();
                }, 450);
            }

            function renderCompanyVesselsRegistryManagerNavbar() {
                let navbarUsers = $('.navbarUsers');
                navbarUsers.fadeOut();
                setTimeout(function() {
                    navbarUsers.empty();
                    render(h(() => {
                        return (
                            h("li", {class: "nav-item"},
                                h("button", {type: "button", class: "navBut navCompanyVesselsRegistryManager"},
                                    h("span", {class: "symbol navButSymbolInline"}, "\uE7E3"), " ",
                                    h("span", {"data-localization": "vesselsRegistry"})
                                )
                            )
                        )
                    }), navbarUsersSelector);
                    changeLanguage(navbarUsers);
                    navbarUsers.delay(450).fadeIn();
                }, 450);
            }

            // Determines what happens when user clicks on “Vessels registry” button
            $(document).on('click', '.navCompanyVesselsRegistryManager', function() {
                main.fadeOut();
                openWait();
                setTimeout(() => {
                    $.post('/vesselsRegistry', response => {
                        closeWait();
                        main.empty();
                        render(h(AddNewVesselForm), mainSelector);
                        $('main').append($('<div></div>').attr('id', 'vesselsRegistry').addClass('container bg-text vesselsRegistry animate slideIn marginTop20'));
                        renderVesselsRegistry(response);
                        changeLanguage(main);
                        toggleFormButtonsColor(main);
                        changeTitle('vesselsRegistry');
                        main.delay(450).show();
                    }).fail(jqXHR => {
                        closeWait();
                        main.delay(450).fadeIn();
                        notifyError('errorVesselsRegistryNotFetched', jqXHR);
                    });
                }, 450);
            });

            function renderVesselsRegistry(json) {
                render(h(() => {
                    return (
                        json.length < 1 ?
                            h("div", {class: "row"},
                                h("div", {class: "col"},
                                    h("div", {class: "symbol bgTextSymbolCenter text-center"}, "\uE946"),
                                    h("div", {class: "bgTextMessage text-center", "data-localization": "vesselsRegistryIsEmpty"})
                                )
                            )
                            :
                            h(Fragment, null,
                                h("div", {class: "vesselAddedSuccessfully", "data-localization": "vesselsVesselSuccessfullyAdded", style: "display:none;"}),
                                h("div", {class: "row marginBottom15"},
                                    h("div", {class: "col"},
                                        h("div", {class: "symbol bgTextSymbolCenter text-center"}, "\uE7E3"),
                                        h("div", {class: "bgTextTitleText text-center", "data-localization": "vesselsRegistry"})
                                    )
                                ),
                                h("div", {class: "table responsiveTable"},
                                    h("div", {class: "row d-none d-lg-flex tableRowTitle marginBottom15 sticky-top transition"},
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsName"}),
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsFlag"}),
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsImoNumber"}),
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsDwt"}),
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsYearBuilt"}),
                                        h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "vesselsUnderConstruction"})
                                    ),
                                    json.map(vessel => {
                                        return (
                                            h("form", {class: "row vesselUpdateForm tableRowForm tableSimpleRow vesselRow"},
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsName"}),
                                                    h("input", {class: "rowFormTextElement", name: "name", type: "text", maxlength: "100", value: vessel['name']}),
                                                    h("div", {class: "formErrors formErrorsFull"},
                                                        h("div", {class: "formWarning", "data-localization": "vesselsInvalidName", style: "display:none;"}),
                                                        h("div", {class: "formWarningServer", style: "display:none;"})
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper vesselFlagsWrapper dropdownItemsWrapper"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsFlag"}),
                                                    h("div", {class: "dropdown"},
                                                        h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton", "data-localization-title": "vesselsFlag", id: "updateVesselVesselsFlag" + vessel['id'], "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                                            h("span", {"data-vessel-flag": vessel['flag']}, vessel['flag']),
                                                            h("span", {class: "caret symbol"}, "\uE011")
                                                        ),
                                                        h("div", {class: "dropdown-menu", "aria-labelledby": "updateVesselVesselsFlag" + vessel['id']},
                                                            h("button", {class: "dropdown-item navButSymbol vesselFlag dropdownItem", "data-localization": "vesselsFlagsGR", type: "button", value: "GR"}),
                                                            h("button", {class: "dropdown-item navButSymbol vesselFlag dropdownItem", "data-localization": "vesselsFlagsUS", type: "button", value: "US"})
                                                        )
                                                    ),
                                                    h("input", {class: "vesselFlagInput", name: "flag", type: "text", hidden: true, value: vessel['flag']}),
                                                    h("div", {class: "formErrors formErrorsFull"},
                                                        h("div", {class: "formWarningServer", style: "display:none;"})
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsImoNumber"}),
                                                    h("input", {class: "rowFormTextElement", name: "imoNumber", type: "text", maxlength: "100", value: vessel['imoNumber']}),
                                                    h("div", {class: "formErrors formErrorsFull"},
                                                        h("div", {class: "formWarning", "data-localization": "vesselsInvalidImoNumber", style: "display:none;"}),
                                                        h("div", {class: "formWarningServer", style: "display:none;"})
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsDwt"}),
                                                    h("input", {class: "rowFormTextElement", name: "dwt", type: "text", maxlength: "10", value: vessel['dwt']}),
                                                    h("div", {class: "formErrors formErrorsFull"},
                                                        h("div", {class: "formWarning", "data-localization": "errorRequiredVesselDwt", style: "display:none;"}),
                                                        h("div", {class: "formWarningServer", style: "display:none;"})
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsYearBuilt"}),
                                                    h("input", {class: "rowFormTextElement", name: "yearBuilt", type: "text", minlength: "4", maxlength: "4", value: vessel['yearBuilt']}),
                                                    h("div", {class: "formErrors formErrorsFull"},
                                                        h("div", {class: "formWarning", "data-localization": "errorSizeVesselYearBuilt", style: "display:none;"}),
                                                        h("div", {class: "formWarningServer", style: "display:none;"})
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("div", {class: "col-lg-auto col-md-4 col-sm-6 inputWrapper checkboxField"},
                                                    h("div", {class: "smallTitle d-lg-none", "data-localization": "vesselsUnderConstruction"}),
                                                    h("label", {class: "toggle"},
                                                        h("input", {class: "vesselUnderConstructionInput", name: "underConstruction", "data-value-type": "boolean", type: "checkbox", checked: vessel['underConstruction'], value: vessel['underConstruction']}),
                                                        h("div", null)
                                                    ),
                                                    h(AfterUpdatedValidation)
                                                ),
                                                h("input", {name: "id", value: vessel['id'], type: "hidden", hidden: true, style: "display:none;"}),
                                                h("input", {name: "company", value: vessel['company'], type: "hidden", hidden: true, style: "display:none;"})
                                            )
                                        )
                                    })
                                )
                            )
                    )
                }), document.getElementById('vesselsRegistry'));

                adjustGeneralTableAppearance($('main #vesselsRegistry'));
            }

            // Determines what happens when user clicks on “Add vessel” button
            $(document).on('click', '.addNewVesselButton', function() {
                $(this).slideUp(300);
                $('.newVesselWrapper').slideDown(500);
            });

            $(document).on('click', '.submitNewVesselButton', function(e) {
                e.preventDefault();
                let submitVesselButton = $(this);
                let vesselsRegistry = $('main #vesselsRegistry');
                let form = $(this).parents('form');
                openWaitDots(form);

                $.post({
                    url: '/insertVessel',
                    contentType: 'application/json;charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(form.serializeJSON({checkboxUncheckedValue: 'false'}))}, firstResponse => {
                    closeWaitDots(form);
                    if (firstResponse.hasOwnProperty('invalidFields'))
                        afterFormFailed(form, firstResponse);
                    else {
                        if (firstResponse.hasOwnProperty('saved')) {
                            if (firstResponse['saved'] === true) {
                                $('main .newVesselWrapper').slideUp(500);
                                $('main .addNewVesselButton').slideDown(500);
                                resetForm(submitVesselButton);
                                $.post('/vesselsRegistry', secondResponse => {
                                    vesselsRegistry.empty();
                                    renderVesselsRegistry(secondResponse);
                                    changeLanguage(vesselsRegistry);
                                    $('#vesselsRegistry .vesselAddedSuccessfully').slideDown(400).delay(3500).slideUp(400);
                                }).fail(secondJqXHR => {
                                    notifyError('errorVesselUpdatedButVesselsRegistryNotFetched', secondJqXHR);
                                });
                            }
                            else
                                notifyError('errorVesselNotAdded', firstResponse['errorDetails']);
                        }
                    }
                }).fail(firstJqXHR => {
                    closeWaitDots(form);
                    notifyError('errorVesselNotAdded', firstJqXHR);
                });
            });

            $(document).on('change', '.vesselUpdateForm input', function(e) {
                e.stopImmediatePropagation();
                if (isValidInput($(this)))
                    updateVessel($(this));
            });

            // Updates the vessel’s data
            function updateVessel(element) {
                let form = element.parents('form');
                form.find('input').each(function() {
                    $(this).css('border-bottom', 'none');
                });
                form.find('.formWarning, .formWarningServer, .changesNotSavedWrapper').each(function() {
                    $(this).slideUp(300);
                });

                $.post({
                    url: '/updateVessel',
                    contentType: 'application/json;charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(form.serializeJSON({checkboxUncheckedValue: 'false'}))}, response => {
                    if (response.hasOwnProperty('invalidFields'))
                        afterFormFailed(form, response);
                    else if (response.hasOwnProperty('updated')) {
                        if (response['updated'] === true)
                            element.parents('.inputWrapper').find('.successTextColorSmall').slideDown(400).delay(3000).slideUp(400);
                        else {
                            setErrorMessageModal(response['errorDetails']);
                            element.parents('.inputWrapper').find('.changesNotSavedWrapper').slideDown(400);
                        }
                    }
                }).fail(jqXHR => {
                    notifyError('errorVesselNotUpdated', jqXHR);
                });
            }

            // Changes the vessel’s flag when user selects the relevant option
            $(document).on('click', '.dropdownItem', function() {
                if ($(this).hasClass('vesselFlag')) {
                    $(this).parents('.dropdownItemsWrapper').find('.vesselFlagInput').val($(this).val());
                    if ($(this).parents('form').hasClass('newVesselForm'))
                        $(this).parents('.dropdownItemsWrapper').find('[data-vessel-flag]').html($(this).html()).attr('data-vessel-flag', $(this).val());
                    else if ($(this).parents('form').hasClass('vesselUpdateForm')) {
                        $(this).parents('.dropdownItemsWrapper').find('[data-vessel-flag]').html($(this).html().substr(0, 2)).attr('data-vessel-flag', $(this).val());
                        updateVessel($(this));
                    }
                }
            });

            // Changes the vessel’s under construction state when user selects the relevant option
            $(document).on('click', 'main #vesselsRegistry .tableRowForm input[type="checkbox"]', function() {
                $(this).val($(this).is(':checked'));
            });
        }

        function legalEngineerView(responseJson) {
            renderLegalEngineerDashboard(responseJson['firstName']);
            renderLegalEngineerNavbar();

            function renderLegalEngineerDashboard(firstName) {
                changeTitle('usersHome');
                renderRightNavLogin();
                main.fadeOut();
                setTimeout(function() {
                    main.empty();
                    render(h(() => {
                        return (
                            h("div", {class: "welcomeMessage animate slideIn"},
                                h("div", {class: "welcomeSpiral"},
                                    h("svg", {viewBox: "0 0 571 619", width: "160px"},
                                        h("path", {fill: "#fff", d: "M 218.84,619.00 C 163.23,619.50 105.52,609.09 54.61,586.37 48.11,583.47 42.11,579.87 36.21,575.87 31.41,572.66 26.10,569.56 22.20,565.16 14.50,556.45 22.90,545.04 33.41,550.54 38.31,553.15 42.31,557.15 47.11,560.05 52.81,563.56 58.71,566.66 64.81,569.46 77.41,575.26 90.62,579.67 104.02,583.07 131.82,590.18 160.73,594.18 189.33,596.08 218.44,597.98 247.84,596.98 276.65,592.18 330.56,583.07 382.47,560.05 426.27,527.53 468.08,496.50 501.79,455.67 524.69,408.83 549.30,358.39 558.70,302.14 548.60,246.70 539.49,196.96 516.29,148.22 482.28,110.79 446.68,71.66 397.97,46.74 347.66,32.23 323.46,25.22 298.75,20.42 273.55,20.42 249.54,20.42 225.64,24.42 202.84,31.63 157.23,46.14 116.02,73.56 84.51,109.39 56.21,141.61 35.91,181.05 25.80,222.68 16.00,263.41 16.30,307.65 33.91,346.28 53.51,389.11 92.92,418.44 136.52,433.85 186.33,451.36 241.34,451.97 291.85,437.35 317.36,429.95 341.96,419.44 361.86,401.62 380.47,385.01 393.67,363.19 399.27,338.87 410.07,292.34 392.27,243.50 360.46,209.17 345.26,192.86 326.56,179.75 305.45,172.44 282.15,164.33 255.44,163.83 231.24,167.54 204.34,171.54 179.93,183.55 162.83,204.97 148.23,223.38 140.52,246.00 145.73,269.42 150.93,293.14 164.03,314.85 182.53,330.57 201.24,346.38 228.14,357.59 252.94,353.39 277.15,349.28 297.15,327.36 301.85,303.55 306.05,281.93 295.75,258.21 277.95,245.50 269.85,239.69 259.45,236.29 249.44,238.29 240.84,240.09 232.84,245.70 227.04,252.20 221.74,258.21 217.14,266.62 219.74,274.82 223.14,285.53 236.74,289.73 245.74,294.24 249.44,296.04 254.94,298.14 256.64,302.24 258.55,306.85 254.64,312.05 249.94,312.25 244.54,312.55 238.34,309.15 233.54,307.05 227.74,304.55 222.14,301.64 217.14,297.74 207.74,290.53 200.74,280.33 201.84,268.12 202.94,255.71 209.54,243.50 218.54,234.99 236.04,218.38 262.55,216.47 283.05,228.58 303.25,240.49 316.66,263.11 319.16,286.23 321.96,311.65 310.85,336.77 291.65,353.39 272.65,369.80 248.14,375.40 223.74,370.40 198.53,365.19 174.93,351.68 158.03,332.37 141.12,313.05 128.42,286.93 126.22,261.21 121.52,206.87 169.13,164.93 218.04,152.82 265.75,141.11 316.96,152.32 356.06,181.85 395.17,211.37 419.97,257.01 420.97,306.25 421.57,331.27 416.17,356.59 404.37,378.71 392.57,401.02 374.07,419.14 352.26,431.75 304.45,459.47 247.44,471.68 192.53,465.88 142.42,460.57 90.52,441.36 53.71,406.03 16.70,370.20 -1.80,320.66 0.10,269.32 2.10,215.47 22.20,160.53 53.31,116.79 83.81,73.86 126.82,42.13 175.03,21.62 200.04,11.01 226.04,2.70 253.24,0.60 281.25,-1.50 309.55,2.00 336.76,8.81 386.87,21.42 436.08,43.44 475.58,77.16 513.59,109.69 540.69,153.32 556.10,200.76 571.50,248.10 575.10,299.34 566.10,348.38 556.80,399.02 533.19,444.86 500.09,483.99 466.08,524.22 424.07,558.25 376.87,581.87 327.86,606.29 273.55,618.80 218.84,619.00 Z"})
                                    )
                                ),
                                h("div", {class: "welcomeName"},
                                    h("span", {"data-localization": "usersWelcome"}), ", " + firstName + "."),
                                h("div", {class: "welcomeSubtitle", "data-localization": "usersWelcomeSubtitle"})
                            )
                        )
                    }), mainSelector);
                    changeLanguage(main);
                    main.delay(450).fadeIn();
                }, 450);
            }

            function renderLegalEngineerNavbar() {
                let navbarUsers = $('.navbarUsers');
                navbarUsers.fadeOut();
                setTimeout(function() {
                    navbarUsers.empty();
                    render(h(() => {
                        return (
                            h("li", {class: "dropdown navButDropdown animate slideIn"},
                                h("button", {class: "btn btn-secondary dropdown-toggle dropdownButton navBut", type: "button", id: "navContractOptions", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"},
                                    h("span", {class: "symbol navButSymbolInline"}, "\uF571"), " ",
                                    h("span", {"data-localization": "legalContracts"}),
                                    h("span", {class: "caret symbol"}, "\uE011")
                                ),
                                h("div", {class: "dropdown-menu", "aria-labelledby": "navContractOptions"},
                                    h("button", {class: "dropdown-item contractOption dropdownItem allContractsButton", "data-localization": "legalContractsAllContracts", type: "button"}),
                                    h("button", {class: "dropdown-item contractOption dropdownItem draftNewContractButton", type: "button"},
                                        h("span", {"data-localization": "legalContractsNewContract"}), " (",
                                        h("span", {"data-localization": "basicsCurrentlyUnavailable"}), ")"
                                    )
                                )
                            )
                        )
                    }), navbarUsersSelector);
                    changeLanguage(navbarUsers);
                    navbarUsers.delay(450).fadeIn();
                }, 450);
            }

            function renderAllContracts(json) {
                render(h(() => {
                    return (
                        h("div", {class: "container bg-text userContracts animate slideIn"},
                            json.length < 1 ?
                                h("div", {class: "row"},
                                    h("div", {class: "col"},
                                        h("div", {class: "symbol bgTextSymbolCenter text-center"}, "\uF571"),
                                        h("div", {class: "bgTextMessage text-center", "data-localization": "legalContractsEmpty"})
                                    )
                                )
                                :
                                h(Fragment, null,
                                    h("div", {class: "row"},
                                        h("div", {class: "col"},
                                            h("div", {class: "symbol bgTextSymbolCenter text-center"}, "\uF571"),
                                            h("div", {class: "bgTextTitleText text-center", "data-localization": "legalContracts"})
                                        )
                                    ),
                                    h("div", {class: "table responsiveTable"},
                                        h("div", {class: "row d-none d-lg-flex tableRowTitle"},
                                            h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "legalContractsTitle"}),
                                            h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainTimestamp"}),
                                            h("div", {class: "col-auto align-self-center text-center wordBreak", "data-localization": "blockchainHash"})
                                        ),
                                        json.map(contract => {
                                            return (
                                                h("div", {class: "row tableSimpleRow contractRow"},
                                                    h("div", {class: "blockIndex", style: "display:none;"}, contract['index']),
                                                    h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                        h("div", {class: "smallTitle d-lg-none", "data-localization": "legalContractsTitle"}),
                                                        h("div", {class: "align-self-center text-center resultsBlockNumber"},
                                                            h("span", {"data-localization": "legalContractsTitlesLower" + contract['title']})
                                                        )
                                                    ),
                                                    h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                        h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainTimestamp"}),
                                                        h("div", {class: "align-self-center text-center", "data-timestamp": contract['timestamp']})
                                                    ),
                                                    h("div", {class: "col-lg-auto col-md-4 col-sm-6"},
                                                        h("div", {class: "smallTitle d-lg-none", "data-localization": "blockchainHash"}),
                                                        h("div", {class: "align-self-center text-center validationResultsHash"}, contract['hash'])
                                                    )
                                                )
                                            )
                                        })
                                    )
                                )
                        )
                    )
                }), mainSelector);

                adjustGeneralTableAppearance($('main .userContracts'));
            }

            // Determines what happens when user clicks on “All contracts” button
            $(document).on('click', '.allContractsButton', function() {
                main.fadeOut();
                openWait();
                setTimeout(function() {
                    $.post('/contracts', function(response) {
                            closeWait();
                            main.empty();
                            renderAllContracts(response);
                            changeLanguage(main);
                            changeTitle('legalContracts');
                            main.delay(450).show();
                        }
                    ).fail(function(jqXHR) {
                            closeWait();
                            main.delay(450).fadeIn();
                            notifyError('errorContractsNotFetched', jqXHR);
                        }
                    );
                }, 450);
            });

            $(document).on('click', '.contractRow', function() {
                const index = $(this).children('.blockIndex').text();
                main.fadeOut();
                setTimeout(function() {
                    $.post('/contract/' + index, function(response) {
                        main.empty();
                        renderContract(response);
                        changeLanguage(main);
                        $('.contract .qrCodeText').each(function() {
                            $(this).prev().prev('.qrCode').html(qrcodegen.QrCode.encodeText($(this).html(), qrcodegen.QrCode.Ecc.MEDIUM).toSvgString(0));
                        });
                        if (lightCSS.prop('disabled') === false) {
                            $('.contract svg rect').attr('fill', 'none');
                            $('.contract svg path').attr('fill', '#001755');
                        } else if (darkCSS.prop('disabled') === false) {
                            $('.contract svg rect, .contractIcon svg path').attr('fill', '#fff');
                            $('.contract svg path').not('.contractIcon svg path').attr('fill', '#000');
                        }
                        main.show();
                    }).fail(function(jqXHR) {
                            main.fadeIn();
                            notifyError('errorContractNotFetched', jqXHR);
                        }
                    );
                }, 450);
            });

            function renderContract(composedContract) {
                render(h(() => {
                    return (
                        h("div", {class: "contract bg-text container animate slideIn vw-100"},
                            h("section", {class: "row contractTitleGroup"},
                                h("div", {class: "col-lg-4 offset-lg-4 mr-auto align-self-center contractTitle"},
                                    h("span", {"data-localization": "legalContractsTitlesUpper" + composedContract['contract']['title']})
                                ),
                                h("div", {class: "col-lg-auto contractTitleQRGroup"},
                                    h("div", {class: "contractQR qrCode", "data-localization-title": "basicsCopyQR"}),
                                    h("div", {class: "copiedQR text-center", "data-localization": "basicsCopiedQR", style: "display:none;"}),
                                    h("div", {class: "contractHash qrCodeText", style: "display:none;"}, composedContract['hash']),
                                    h("div", {class: "contractTimestamp", "data-timestamp": composedContract['timestamp']})
                                )
                            ),
                            h("div", {class: "row"},
                                h("div", {class: "col"},
                                    h("button", {class: "collapseButton", "data-localization": "legalContractingParties", type: "button", "data-toggle": "collapse", "data-target": "#contractingParties", "aria-expanded": "false", "aria-controls": "contractingParties"}),
                                    h("div", {class: "collapse", id: "contractingParties"},
                                        h("div", {class: "card card-body"},
                                            h("div", {class: "row justify-content-center"},
                                                $.map(composedContract['contract']['essentials']['signatures'], signature => {
                                                    return (
                                                        h("div", {class: "col-auto infoBox contractSignature"},
                                                            h("div", { class: "signatureQRGroup"},
                                                                h("div", {class: "contractSignaturesQR qrCode", "data-localization-title": "basicsCopyQR"}),
                                                                h("div", {class: "copiedQR text-center", "data-localization": "basicsCopiedQR", style: "display:none;"}),
                                                                h("div", {class: "qrCodeText contractSignatureToValidate", style: "display:none;"}, signature['signature']),
                                                                signature['valid'] === true ?
                                                                    h("div", {class: "signatureValidationValid"},
                                                                        h("div", {class: "symbol bgTextSymbolCenter successTextColorSmall validationSymbolSmall"}, "\uE008"),
                                                                        h("div", {class: "copiedQR","data-localization": "blockchainSignatureValid"})
                                                                    )
                                                                    :
                                                                    h("div", {class: "signatureValidationInvalid"},
                                                                        h("div", {class: "symbol bgTextSymbolCenter errorTextColor validationSymbolSmall"}, "\uE10A"),
                                                                        h("div", {class: "copiedQR", "data-localization": "blockchainSignatureInvalid"})
                                                                    )
                                                            ),
                                                            h("div", {class: "rightInfo"},
                                                                h("div", null,
                                                                    h("span", {class: "bold signatureNameHighlight"}, signature['signer']['firstName'] + " " + signature['signer']['lastName'])),
                                                                h("div", null,
                                                                    h("span", {class: "bold"},
                                                                        h("span", {"data-localization": "usersPositions" + signature['signer']['position']})
                                                                    )
                                                                ),
                                                                signature['onBehalfOf'] != null ?
                                                                    h(Fragment, null,
                                                                        h("div", {"data-localization": "legalContractsOnBehalfOf"}),
                                                                        h("div", null,
                                                                            h("span", {class: "bold"}, signature['onBehalfOf']['firstName'] + " " + signature['onBehalfOf']['lastName'])
                                                                        )
                                                                    )
                                                                    :
                                                                    void(0)
                                                            )
                                                        )
                                                    )
                                                })
                                            )
                                        )
                                    ),
                                    h("button", {class: "collapseButton", "data-localization": "legalContractsEssentials", type: "button", "data-toggle": "collapse", "data-target": "#essentials", "aria-expanded": "false", "aria-controls": "essentials"}),
                                    h("div", {class: "collapse", id: "essentials"},
                                        h("div", {class: "card card-body"},
                                            composedContract['contract']['essentials']['type'] === 'timeCharter' ?
                                                h(Fragment, null,
                                                    h("span", null, composedContract['contract']['essentials']['preamble']),
                                                    h("div", {class: "row justify-content-center essentialsData"},
                                                        h("div", {class: "col-auto infoBox"},
                                                            h("div", {class: "contractIcon vesselIcon"},
                                                                h("svg", {viewBox: "0 0 542 281"},
                                                                    h("path", {fill: "#fff", d: "M 67.26,68.48 C 67.36,70.08 67.96,72.37 66.46,73.27 64.76,74.27 62.87,72.67 61.27,71.67 55.67,68.08 53.47,60.98 55.97,54.78 58.47,48.68 64.86,45.08 70.96,46.28 77.76,47.48 82.55,52.78 82.75,59.98 82.85,62.88 81.95,65.68 80.16,68.08 79.96,68.38 79.26,68.68 78.96,68.58 77.56,67.98 76.56,66.98 75.76,65.78 75.36,65.08 75.86,64.28 76.16,63.58 77.06,61.48 77.26,59.28 76.26,57.08 75.06,54.08 71.96,51.98 68.76,51.98 65.66,51.98 62.37,54.18 61.17,56.98 60.17,59.98 60.97,63.98 63.56,66.08 64.66,66.98 65.96,67.68 67.26,68.48 Z M 65.36,91.27 C 65.46,91.77 65.66,92.17 65.76,92.67 65.96,96.87 65.56,97.27 61.57,96.27 46.57,92.67 36.68,83.47 33.08,68.38 27.68,45.28 44.18,26.79 62.77,23.49 79.76,20.59 99.74,30.69 104.74,50.88 108.34,65.38 104.04,77.57 93.35,87.97 91.75,86.77 90.95,85.27 89.95,83.97 90.25,82.47 91.45,81.77 92.25,80.87 107.44,63.58 99.84,36.99 77.96,30.19 58.57,24.19 38.78,38.79 37.98,58.48 37.28,74.87 48.87,87.27 61.27,90.17 62.57,90.57 63.86,90.87 65.36,91.27 Z M 64.16,114.16 C 64.56,116.06 64.26,117.76 63.86,119.76 51.27,118.76 40.28,114.16 30.68,106.16 18.99,96.57 11.79,84.17 9.59,69.18 5.00,36.89 24.89,10.90 51.07,2.70 79.76,-6.30 110.74,7.40 123.33,34.59 136.52,63.08 124.83,93.77 105.24,107.36 105.04,107.06 104.74,106.66 104.54,106.16 103.94,105.06 103.24,103.96 102.64,102.96 128.63,80.37 126.53,49.38 114.84,31.09 101.54,10.30 76.16,1.00 52.57,8.30 31.48,14.79 13.39,35.79 14.89,62.88 15.59,76.37 20.69,87.97 29.98,97.67 39.28,107.46 50.77,112.66 64.16,114.16 Z M 49.57,281.00 C 49.77,280.50 49.77,280.20 49.17,280.00 43.18,277.30 41.08,272.20 40.78,266.11 40.48,259.81 41.68,253.71 43.28,247.71 44.98,241.71 47.07,235.82 49.67,230.22 50.77,227.92 50.57,225.92 49.47,223.82 47.67,220.22 44.88,217.72 41.48,215.82 36.68,213.12 31.38,211.82 25.99,211.12 19.59,210.33 13.29,210.13 6.90,210.82 3.30,211.22 2.40,210.53 1.30,207.13 1.00,206.03 0.70,204.93 0.50,203.83 -0.20,198.73 -0.30,193.63 -0.00,188.53 0.70,174.64 2.40,160.84 4.40,147.05 4.80,144.65 4.90,144.45 7.40,144.45 8.50,144.45 9.59,144.45 10.79,144.45 34.48,144.45 58.07,144.45 81.75,144.45 87.55,144.45 86.65,144.35 85.75,139.45 82.25,121.96 78.56,104.46 74.86,86.97 73.56,79.97 71.96,73.27 70.46,66.58 70.16,65.18 69.76,63.78 69.96,62.28 73.96,70.77 78.06,79.37 82.15,87.87 90.25,105.06 98.35,122.26 106.54,139.35 107.04,140.55 107.64,141.65 108.24,142.85 108.64,143.65 109.34,144.05 110.14,144.15 111.74,144.25 113.34,144.25 114.94,144.25 225.38,144.25 335.81,144.25 446.25,144.25 454.05,144.25 461.94,144.35 469.74,144.75 484.63,145.55 499.32,147.45 513.52,152.25 518.81,154.05 523.91,156.24 528.71,159.34 532.21,161.64 535.40,164.24 537.90,167.64 542.60,174.14 543.30,181.14 540.10,188.43 538.40,192.33 535.80,195.53 532.81,198.43 527.21,203.83 520.61,207.73 513.52,210.82 511.72,211.62 509.92,212.22 508.12,212.92 506.32,213.62 505.72,214.62 505.92,216.72 506.12,218.82 506.62,220.82 507.12,222.82 509.02,230.22 511.92,237.32 514.62,244.51 516.81,250.51 519.11,256.51 521.31,262.51 522.21,264.91 522.81,267.40 522.81,270.00 522.71,275.50 520.31,278.20 515.01,279.10 513.12,279.40 511.22,279.80 509.32,280.10 506.42,280.10 503.52,279.70 500.72,280.90 350.21,281.00 199.89,281.00 49.57,281.00 Z M 240.57,149.45 C 165.21,149.45 89.95,149.45 14.59,149.45 8.20,149.45 9.49,148.65 8.60,154.64 7.50,162.24 6.80,169.94 6.00,177.54 5.20,185.03 5.10,192.53 5.40,200.03 5.50,201.33 5.60,202.53 5.90,203.83 6.00,204.63 6.60,205.23 7.50,205.23 8.60,205.23 9.69,205.13 10.89,205.13 16.79,204.93 22.69,205.03 28.58,206.03 34.28,206.93 39.78,208.53 44.78,211.52 48.67,213.92 51.87,216.92 53.97,221.02 55.87,224.72 56.67,228.52 54.27,232.42 53.97,232.82 53.87,233.32 53.67,233.72 50.37,241.71 47.57,249.81 46.27,258.41 45.87,261.31 45.67,264.11 45.97,267.00 46.67,272.90 49.47,275.50 55.37,275.90 57.17,276.00 58.87,275.90 60.67,275.90 184.30,275.90 307.83,275.90 431.46,275.90 449.55,275.90 467.64,275.80 485.63,275.60 491.83,275.50 498.12,275.30 504.32,275.00 507.52,274.80 510.72,274.40 513.82,274.00 516.51,273.60 517.61,272.20 517.51,269.40 517.41,267.50 516.81,265.61 516.21,263.81 513.72,257.11 511.22,250.31 508.72,243.61 506.32,237.22 503.82,230.82 502.02,224.12 501.32,221.32 500.52,218.52 500.62,215.62 500.82,212.12 502.22,209.53 505.72,208.23 507.62,207.53 509.62,206.83 511.52,205.93 517.41,203.43 522.91,200.23 527.81,195.93 530.61,193.43 533.00,190.73 534.70,187.43 538.10,181.04 537.50,175.14 532.81,169.64 530.91,167.44 528.71,165.54 526.31,163.94 522.61,161.44 518.51,159.54 514.32,157.94 502.72,153.55 490.53,151.75 478.34,150.35 468.34,149.25 458.25,149.25 448.15,149.25 378.99,149.45 309.83,149.45 240.57,149.45 Z M 92.05,143.85 C 95.35,144.45 98.55,144.25 101.64,144.05 102.14,144.05 102.44,143.55 102.34,143.05 102.24,142.55 102.04,142.15 101.84,141.75 96.75,130.85 91.55,119.96 86.35,108.96 86.15,108.46 85.95,107.76 84.85,107.76 87.25,119.86 89.65,131.85 92.05,143.85 Z"})
                                                                )
                                                            ), h("div", {class: "rightInfo"},
                                                                h("div", null,
                                                                    h("span", {class: "bold"},
                                                                        h("span", { "data-localization": "vesselsName"}), ": "), composedContract['contract']['essentials']['vessel']['name']),
                                                                h("div", null,
                                                                    h("span", {class: "bold"},
                                                                        h("span", {"data-localization": "vesselsImoNumber"}), ": "), composedContract['contract']['essentials']['vessel']['imoNumber']),
                                                                h("div", null,
                                                                    h("span", {class: "bold"}, h("span", {"data-localization": "vesselsFlag"}), ": "), composedContract['contract']['essentials']['vessel']['flag']),
                                                                h("div", null,
                                                                    h("span", {class: "bold"},
                                                                        h("span", {"data-localization": "vesselsYearBuilt"}), ": "), composedContract['contract']['essentials']['vessel']['yearBuilt']),
                                                                h("div", null,
                                                                    h("span", {class: "bold"},
                                                                        h("span", {"data-localization": "vesselsDwt"}), ": "),
                                                                    h("span", {class: "numberSeparators"}, composedContract['contract']['essentials']['vessel']['dwt']),
                                                                    h("span", null, " M/T")
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                                :
                                                void(0)
                                        )
                                    )
                                )
                            ),
                            h("div", {class: "row"},
                                h("div", {class: "col"},
                                    composedContract['contract']['clauses'] != null ?
                                        h(Fragment, null,
                                            h("button", {class: "collapseButton", "data-localization": "legalContractsClauses", type: "button", "data-toggle": "collapse", "data-target": "#clauses", "aria-expanded": "false", "aria-controls": "clauses"}),
                                            h("div", {class: "collapse", id: "clauses"},
                                                h("div", {class: "card card-body"},
                                                    $.map(composedContract['contract']['clauses'], clause => {
                                                        return (
                                                            h("div", {class: "contractClause"},
                                                                h("div", {class: "clauseTitle"}, clause['title']),
                                                                h("div", {class: "testEnabledClause", style: "display:none;"}),
                                                                h("div", {class: "row justify-content-center", "data-localization-title": "legalContractsToggleLegen"},
                                                                    h("div", {class: "col paragraphReadable"},
                                                                        h("div", {class: "clauseSubtitle animate slideIn", "data-localization": "legalContractsReadable", style: "display:none;"}),
                                                                        $.map(clause['paragraphs'], paragraph => {
                                                                            return (
                                                                                h("div", {class: "paragraphGroup"},
                                                                                    h("div", {class: "paragraphNumber"}, paragraph['number'] + "."),
                                                                                    h("div", {class: "paragraphText"}, paragraph['readable'])
                                                                                )
                                                                            )
                                                                        })
                                                                    ),
                                                                    h("div", {class: "col paragraphLegen animate slideIn ", style: "display:none;"},
                                                                        h("div", {class: "clauseSubtitle animate slideIn", style: "display:none;"}, "Legen"),
                                                                        $.map(clause['paragraphs'], paragraph => {
                                                                            return (
                                                                                h("div", {class: "paragraphGroup"},
                                                                                    h("div", {class: "paragraphNumber"}, paragraph['number'] + "."),
                                                                                    h("div", {class: "paragraphText"}, paragraph['legen'])
                                                                                )
                                                                            )
                                                                        })
                                                                    )
                                                                ),
                                                                h("div", {style: "text-align:center;margin-top:10px;"},
                                                                    h("button", {type: "button", class: "button enableClause", "data-localization": "legalEnableClause"})
                                                                )
                                                            )
                                                        )
                                                    })
                                                )
                                            )
                                        )
                                        :
                                        void(0)
                                )
                            )
                        )
                    )
                }), mainSelector);
            }

            $(document).on('click', '.contractClause > .row', function() {
                $(this).find('.paragraphLegen, .clauseSubtitle').toggle();
                $(this).find('.paragraphReadable, .paragraphLegen').toggleClass('col col-md-6');
            });

            // Tests off-hire clause
            $(document).on('click', '.enableClause', () => {
                $.post('/testEnableClause', response => {
                        $('.testEnabledClause').slideUp(300).empty().append(response).slideDown(300);
                    }
                );
            });
        }
    });

    $('#splashScreen').delay(500).fadeOut(500);
});