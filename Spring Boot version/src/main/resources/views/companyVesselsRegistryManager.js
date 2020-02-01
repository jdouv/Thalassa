const AddNewVesselForm = () => {
    return (
        html`<${Fragment}>
            <div class="addButton addNewVesselButton animate slideIn">
                <button data-localization-title="vesselsAddNew" class="plus">
                    <span>+</span>
                </button>
            </div>
            <div class="newVesselWrapper animate slideIn" style="display:none;">
                <div class="innerFormTitle" data-localization="vesselsAddNew" />
                <div class="bg-text formWithCloseButton">
                    <div class="formCloseButton">
                        <svg viewBox="0 0 20 20">
                            <path fill="#001755" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z" />
                        </svg>
                    </div>
                    <form class="newVesselForm formClass">
                        <div class="form-row firstFormRow">
                            <div class="col inputWrapper">
                                <input name="name" type="text" maxlength="100" id="newVesselName" required />
                                <label for="newVesselName" data-localization="vesselsName" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarning" data-localization="vesselsInvalidName" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col inputWrapper">
                                <input name="imoNumber" type="text" maxlength="100" id="newVesselImoNumber" required />
                                <label for="newVesselImoNumber" data-localization="vesselsImoNumber" />
                                <div class="formErrors">
                                    <div class="formWarning" data-localization="vesselsInvalidImoNumber" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                            </div>
                            <div class="col inputWrapper checkboxField">
                                <div class="col-auto">
                                    <span data-localization="vesselsUnderConstruction" />
                                </div>
                                <div class="col-auto">
                                    <label class="toggle">
                                        <input class="vesselUnderConstructionInput" name="underConstruction" data-value-type="boolean" type="checkbox" />
                                        <div />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col inputWrapper vesselFlagsWrapper dropdownItemsWrapper">
                               <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle dropdownButton" data-localization-title="vesselsFlag" id="newVesselVesselsFlag" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span data-vessel-flag="vesselsFlag" data-localization="vesselsFlag" />
                                        <span class="caret symbol">\uE011</span>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="newVesselVesselsFlag">
                                        <button class="dropdown-item navButSymbol vesselFlag dropdownItem" data-localization="vesselsFlagsGR" type="button" value="GR" />
                                        <button class="dropdown-item navButSymbol vesselFlag dropdownItem" data-localization="vesselsFlagsUS" type="button" value="US" />
                                    </div>
                                </div>
                                <input class="vesselFlagInput" name="flag" type="text" id="newVesselFlag" required hidden />
                                <label style="display:none;" for="newVesselFlag" data-localization="vesselsFlag" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col inputWrapper">
                                <input name="dwt" type="text" maxlength="10" id="newVesselDwt" required />
                                <label for="newVesselDwt" data-localization="vesselsDwt" />
                                <div class="formErrors">
                                    <div class="formWarning" data-localization="errorRequiredVesselDwt" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                            </div>
                            <div class="col inputWrapper">
                                <input name="yearBuilt" type="text" minlength="4" maxlength="4" id="newVesselYearBuilt" required />
                                <label for="newVesselYearBuilt" data-localization="vesselsYearBuilt" />
                                <div class="formErrors">
                                    <div class="formWarning" data-localization="errorSizeVesselYearBuilt" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                            </div>
                        </div>
                        <div class="text-center formButtons">
                            <div class="submitButtonWrapper formButton1" style="display:none;">
                                <button type="submit" class="button submitButton submitNewVesselButton" data-localization="basicsAdd" />
                            </div>
                            <div class="resetButtonWrapper formButton2" style="display:none;">
                                <button class="button resetButton" data-localization="basicsFormReset" type="reset" />
                            </div>
                        </div>
                        <${WaitDots} />
                    </form>
                </div>
            </div>
        <//>`
    )
};

renderDashboard();
renderNavbar();

function renderDashboard() {
    changeTitle('usersHome');
    renderRightNavLogin();
    main.fadeOut();
    setTimeout(() => {
        main.empty();
        render(html`<div class="welcomeMessage animate slideIn">
                    <div class="welcomeSpiral">
                        <svg viewBox="0 0 571 619" width="160px">
                            <path fill="#fff" d="M 218.84,619.00 C 163.23,619.50 105.52,609.09 54.61,586.37 48.11,583.47 42.11,579.87 36.21,575.87 31.41,572.66 26.10,569.56 22.20,565.16 14.50,556.45 22.90,545.04 33.41,550.54 38.31,553.15 42.31,557.15 47.11,560.05 52.81,563.56 58.71,566.66 64.81,569.46 77.41,575.26 90.62,579.67 104.02,583.07 131.82,590.18 160.73,594.18 189.33,596.08 218.44,597.98 247.84,596.98 276.65,592.18 330.56,583.07 382.47,560.05 426.27,527.53 468.08,496.50 501.79,455.67 524.69,408.83 549.30,358.39 558.70,302.14 548.60,246.70 539.49,196.96 516.29,148.22 482.28,110.79 446.68,71.66 397.97,46.74 347.66,32.23 323.46,25.22 298.75,20.42 273.55,20.42 249.54,20.42 225.64,24.42 202.84,31.63 157.23,46.14 116.02,73.56 84.51,109.39 56.21,141.61 35.91,181.05 25.80,222.68 16.00,263.41 16.30,307.65 33.91,346.28 53.51,389.11 92.92,418.44 136.52,433.85 186.33,451.36 241.34,451.97 291.85,437.35 317.36,429.95 341.96,419.44 361.86,401.62 380.47,385.01 393.67,363.19 399.27,338.87 410.07,292.34 392.27,243.50 360.46,209.17 345.26,192.86 326.56,179.75 305.45,172.44 282.15,164.33 255.44,163.83 231.24,167.54 204.34,171.54 179.93,183.55 162.83,204.97 148.23,223.38 140.52,246.00 145.73,269.42 150.93,293.14 164.03,314.85 182.53,330.57 201.24,346.38 228.14,357.59 252.94,353.39 277.15,349.28 297.15,327.36 301.85,303.55 306.05,281.93 295.75,258.21 277.95,245.50 269.85,239.69 259.45,236.29 249.44,238.29 240.84,240.09 232.84,245.70 227.04,252.20 221.74,258.21 217.14,266.62 219.74,274.82 223.14,285.53 236.74,289.73 245.74,294.24 249.44,296.04 254.94,298.14 256.64,302.24 258.55,306.85 254.64,312.05 249.94,312.25 244.54,312.55 238.34,309.15 233.54,307.05 227.74,304.55 222.14,301.64 217.14,297.74 207.74,290.53 200.74,280.33 201.84,268.12 202.94,255.71 209.54,243.50 218.54,234.99 236.04,218.38 262.55,216.47 283.05,228.58 303.25,240.49 316.66,263.11 319.16,286.23 321.96,311.65 310.85,336.77 291.65,353.39 272.65,369.80 248.14,375.40 223.74,370.40 198.53,365.19 174.93,351.68 158.03,332.37 141.12,313.05 128.42,286.93 126.22,261.21 121.52,206.87 169.13,164.93 218.04,152.82 265.75,141.11 316.96,152.32 356.06,181.85 395.17,211.37 419.97,257.01 420.97,306.25 421.57,331.27 416.17,356.59 404.37,378.71 392.57,401.02 374.07,419.14 352.26,431.75 304.45,459.47 247.44,471.68 192.53,465.88 142.42,460.57 90.52,441.36 53.71,406.03 16.70,370.20 -1.80,320.66 0.10,269.32 2.10,215.47 22.20,160.53 53.31,116.79 83.81,73.86 126.82,42.13 175.03,21.62 200.04,11.01 226.04,2.70 253.24,0.60 281.25,-1.50 309.55,2.00 336.76,8.81 386.87,21.42 436.08,43.44 475.58,77.16 513.59,109.69 540.69,153.32 556.10,200.76 571.50,248.10 575.10,299.34 566.10,348.38 556.80,399.02 533.19,444.86 500.09,483.99 466.08,524.22 424.07,558.25 376.87,581.87 327.86,606.29 273.55,618.80 218.84,619.00 Z" />
                        </svg>
                    </div>
                    <div class="welcomeName">
                        <span data-localization="usersWelcome" />
                        <span>, ${parseJWT(localStorage.getItem('JWT'))['firstName']}.</span>
                    </div>
                    <div class="welcomeSubtitle" data-localization="usersWelcomeSubtitle" />
                </div>`, mainSelector);
        changeLanguage(main);
        main.delay(450).fadeIn();
    }, 450);
}

function renderNavbar() {
    let navbarUsers = $('.navbarUsers');
    navbarUsers.fadeOut();
    setTimeout(() => {
        navbarUsers.empty();
        render(html`<li class="nav-item">
                    <button type="button" class="navBut navCompanyVesselsRegistryManager">
                        <span class="symbol navButSymbolInline">\uE7E3 </span>
                        <span data-localization="vesselsRegistry" />
                    </button>
                </li>`, navbarUsersSelector);
        changeLanguage(navbarUsers);
        navbarUsers.delay(450).fadeIn();
    }, 450);
}

// Determines what happens when user clicks on “Vessels registry” button
$(document).on('click', '.navCompanyVesselsRegistryManager', e => {
    e.stopImmediatePropagation();
    main.fadeOut();
    openWait();
    setTimeout(() => {
        $.post(serviceContextPath + '/vesselsRegistry', response => {
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
    render(json.length < 1 ?
        html`<div class="row">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter text-center">\uE946</div>
                    <div class="bgTextMessage text-center" data-localization="vesselsRegistryIsEmpty" />
                </div>
            </div>`
        :
        html`<div class="vesselAddedSuccessfully" data-localization="vesselsVesselSuccessfullyAdded" style="display:none;" />
            <div class="row marginBottom15">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter text-center">\uE7E3</div>
                    <div class="bgTextTitleText text-center" data-localization="vesselsRegistry" />
                </div>
            </div>
            <div class="hintEdit" data-localization="hintEdit" />
            <div class="table responsiveTable">
                <div class="row tableRowTitle marginBottom15 sticky-top transition">
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsName" />
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsFlag" />
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsImoNumber" />
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsDwt" />
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsYearBuilt" />
                    <div class="col-auto align-self-center text-center wordBreak" data-localization="vesselsUnderConstruction" />
                </div>
                ${json.map(vessel => {
                    return (
                        html`<form class="row justify-content-center vesselUpdateForm tableRowForm tableSimpleRow vesselRow">
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper">
                                <div class="smallTitle d-none" data-localization="vesselsName" />
                                <input class="rowFormTextElement" name="name" type="text" maxlength="100" value="${vessel['name']}" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarning" data-localization="vesselsInvalidName" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                                <${AfterUpdatedValidation} />
                            </div>
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper vesselFlagsWrapper dropdownItemsWrapper">
                                <div class="smallTitle d-none" data-localization="vesselsFlag" />
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle dropdownButton" data-localization-title="vesselsFlag" id="updateVesselVesselsFlag${vessel['id']}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span data-vessel-flag="${vessel['flag']}">${vessel['flag']}</span>
                                        <span class="caret symbol">\uE011</span>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="updateVesselVesselsFlag${vessel['id']}">
                                        <button class="dropdown-item navButSymbol vesselFlag dropdownItem" data-localization="vesselsFlagsGR" type="button" value="GR" />
                                        <button class="dropdown-item navButSymbol vesselFlag dropdownItem" data-localization="vesselsFlagsUS" type="button" value="US" />
                                    </div>
                                </div>
                                <input class="vesselFlagInput" name="flag" type="text" hidden value="${vessel['flag']}" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                                <${AfterUpdatedValidation} />
                            </div>
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper">
                                <div class="smallTitle d-none" data-localization="vesselsImoNumber" />
                                <input class="rowFormTextElement" name="imoNumber" type="text" maxlength="100" value="${vessel['imoNumber']}" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarning" data-localization="vesselsInvalidImoNumber" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                                <${AfterUpdatedValidation} />
                            </div>
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper">
                                <div class="smallTitle d-none" data-localization="vesselsDwt" />
                                <input class="rowFormTextElement" name="dwt" type="text" maxlength="10" value="${vessel['dwt']}" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarning" data-localization="errorRequiredVesselDwt" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                                <${AfterUpdatedValidation} />
                            </div>
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper">
                                <div class="smallTitle d-none" data-localization="vesselsYearBuilt" />
                                <input class="rowFormTextElement" name="yearBuilt" type="text" minlength="4" maxlength="4" value="${vessel['yearBuilt']}" />
                                <div class="formErrors formErrorsFull">
                                    <div class="formWarning" data-localization="errorSizeVesselYearBuilt" style="display:none;" />
                                    <div class="formWarningServer" style="display:none;" />
                                </div>
                                <${AfterUpdatedValidation} />
                            </div>
                            <div class="col-lg-auto col-md-4 col-sm-6 inputWrapper checkboxField">
                                <div class="smallTitle d-none" data-localization="vesselsUnderConstruction" />
                                <label class="toggle">
                                    <input class="vesselUnderConstructionInput" name="underConstruction" data-value-type="boolean" type="checkbox" checked="${vessel['underConstruction']}" value="${vessel['underConstruction']}" />
                                    <div />
                                </label>
                                <${AfterUpdatedValidation} />
                            </div>
                            <input name="id" value="${vessel['id']}" type="hidden" hidden style="display:none;" />
                            <input name="company" value="${vessel['company']}" type="hidden" hidden style="display:none" />
                        </form>`
                    )
                })}
            </div>`, document.getElementById('vesselsRegistry'));

    adjustGeneralTableAppearance($('main #vesselsRegistry'));
}

// Determines what happens when user clicks on “Add vessel” button
$(document).on('click', '.addNewVesselButton', function() {
    $(this).slideUp(300);
    $('.newVesselWrapper').slideDown(500);
});

$(document).on('click', '.submitNewVesselButton', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let submitVesselButton = $(this);
    let vesselsRegistry = $('main #vesselsRegistry');
    let form = $(this).parents('form');
    openWaitDots(form);

    $.post({
        url: serviceContextPath + '/insertVessel',
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
                    $.post(serviceContextPath + '/vesselsRegistry', secondResponse => {
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
        url: serviceContextPath + '/updateVessel',
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