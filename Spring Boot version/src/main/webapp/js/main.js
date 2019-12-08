const { h, Fragment, render } = window.preact;

$(document).ready(()=> {

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(() => {void(0);});
        });
    }

    window.main = $('main');
    window.mainSelector = document.querySelector('main');
    window.navbarUsersSelector = document.querySelector('.navbarUsers');
    window.lightCSS = $('.lightStyle');
    window.darkCSS = $('.darkStyle');
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
        window.changeLanguage = element => {
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
        };

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

        window.changeTitle = title => {
            let locale = getCookie('Locale');
            $('[data-localization-page-title]').attr('data-localization-page-title', title).text(localesJson[locale][title]);
        };

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
        window.openWait = () => {
            $('#gears').fadeIn();
        };

        // Closes the wait animated icon
        window.closeWait = () => {
            $('#gears').fadeOut();
        };

        // Opens the waiting dots
        window.openWaitDots = element => {
            element.find('.waitDots').slideDown(300);
        };

        // Closes the waiting dots
        window.closeWaitDots = element => {
            element.find('.waitDots').slideUp(300);
        };

        // Checks if error message is in json format
        function isTextErrorMessage(jqXHR) {
            return !jqXHR.toString().startsWith('[');
        }

        // Decodes JWT to JSON
        window.parseJWT = token => {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        };

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
        window.notifyError = (text, jqXHR) => {
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
        };

        // Sets the details message modal
        window.setErrorMessageModal = jqXHR => {
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
        };

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
        window.adjustGeneralTableAppearance = element => {
            element.find('.tableRowForm').each(function() {
                $(this).find('.rowFormTextElement').each(function() {
                    adjustElementWidth($(this));
                });
                $(this).find('input[type="checkbox"]').each(function() {
                    adjustCheckboxColor($(this));
                });
            });
            adjustTableAppearance();
        };

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

        window.isValidInput = element => {
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
        };

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
        window.toggleFormButtonsColor = element => {
            element.find('.formWithCloseButton svg path').each(function() {
                lightCSS.prop('disabled') === false ?
                    $(this).attr('fill', '#001755') :
                    $(this).attr('fill', '#fff');
            });
        };

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
                        localStorage.setItem('view', response['view']);
                        renderView();
                    } else if (response.hasOwnProperty('noUser')) {
                        if (response['noUser'] === 'noSuchCredentials') {
                            afterFormFailed(form, response);
                            form.find('.afterSubmitNotSaved').slideDown(400);
                        }
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
        function renderView() {
            if (localStorage.getItem('view') !== undefined)
                new Function(localStorage.getItem('view'))();
        }

        // Determines what happens when form submission fails
        window.afterFormFailed = (form, response) => {
            if (form.hasClass('registerForm') && form.find('.emailAlreadyInUse').is(':visible'))
                form.find('.emailAlreadyInUse').slideUp(300);
            if (response.hasOwnProperty('invalidFields')) {
                form.find('input').each(function () {
                    if (response['invalidFields'].hasOwnProperty($(this).attr('name'))) {
                        $(this).removeClass('validInput').addClass('invalidInput').css('border-bottom', 'solid 1px');
                        $(this).parents('.inputWrapper').find('.formWarning').slideUp(300);
                        $(this).parents('.inputWrapper').find('.formWarningServer').attr('data-localization', response['invalidFields'][$(this).attr('name')]);
                        changeLanguage($(this).parents('.inputWrapper').find('.formErrors'));
                        $(this).parents('.inputWrapper').find('.formWarningServer').slideDown(300);
                    }
                });
            }

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
        };

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
                renderView();
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
                localStorage.removeItem('view');
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

        window.resetForm = element => {
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
        };

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
        window.renderRightNavLogin = () => {
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
        };

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
                                        h(WaitDots),
                                        h("div", {class: "afterSubmitNotSaved", style: "display:none;"},
                                            h("span", {"data-localization": "errorNoUserWithSuchCredentials"})
                                        )
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

        window.WaitDots = () => {
            return(
                h("div", {class: "waitDots", style: "display:none;"},
                    h("h1", {class: "dot one"}, "."),
                    h("h1", {class: "dot two"}, "."),
                    h("h1", {class: "dot three"}, ".")
                )
            )
        };

        window.AfterUpdatedValidation = () => {
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

        // Check if user is logged in
        if (localStorage.getItem('JWT') != null) {
            setNavbarToggler();
            renderView();
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
        $('#splashScreen').delay(500).fadeOut(500);
    });
});