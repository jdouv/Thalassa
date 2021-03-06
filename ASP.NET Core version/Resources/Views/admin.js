﻿renderDashboard();
renderNavbar();

function renderDashboard() {
    renderRightNavLogin();
    changeTitle('usersHome');
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
                        <span data-localization="usersWelcome"></span>
                        <span>, ${parseJWT(localStorage.getItem('JWT'))['firstName']}.</span>
                    </div>
                    <div class="welcomeSubtitle" data-localization="usersWelcomeSubtitle"></div>
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
        render(html`<li class="dropdown navButDropdown animate slideIn">
                    <button class="btn btn-secondary dropdown-toggle dropdownButton navBut" type="button" id="blockchainOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="symbol navButSymbolInline">\uF22C</span>
                        <span> Blockchain</span>
                        <span class="caret symbol">\uE011</span>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="blockchainOptions">
                        <button class="dropdown-item dropdownItem validateBlockchain" data-localization="adminValidateBlockchain" type="button"></button>
                    </div>
                </li>`, navbarUsersSelector);
        changeLanguage(navbarUsers);
        navbarUsers.delay(450).fadeIn();
    }, 450);
}

$(document).on('click', '.validateBlockchain', e => {
    e.stopImmediatePropagation();
    openWait();
    document.title = 'Blockchain';
    main.fadeOut();
    openWait();
    setTimeout(() => {
        $.post('/Admin/ValidateBlockchain', response => {
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
    render(html`<div class="container bg-text blockchainValidationResults animate slideIn">
                ${array[0].hasOwnProperty('emptyBlockchain') && array[0]['emptyBlockchain'][0] === 'y' ?
                    html`<div class="row">
                        <div class="col">
                            <div class="symbol bgTextSymbolCenter">\uE946"</div>
                            <div class="bgTextMessage text-center" data-localization="adminBlockchainIsEmpty"></div>
                        </div>
                    </div>`
                    :
                    $.isEmptyObject(array[0]) && $.isEmptyObject(array[1]) ?
                        html`<div class="row">
                            <div class="col">
                                <div class="symbol bgTextSymbolCenter successTextColor">\uE008</div>
                                <div class="bgTextMessage text-center" data-localization="adminBlockchainIsValid"></div>
                            </div>
                        </div>`
                        :
                        html`<div class="row">
                            <div class="col">
                                <div class="symbol bgTextSymbolCenter errorTextColor">\uE10A</div>
                                <div data-localization="adminBlockchainIsInvalid"></div>
                                ${!$.isEmptyObject(array[0]) ?
                                    html`<div class="invalidBlockchainResultsHead text-center" data-localization="adminBlockchainResultsCalculationMessage"></div>
                                        <div class="table responsiveTable">
                                            <div class="row tableRowTitle">
                                                <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainBlockNumber"></div>
                                                <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainTimestamp"></div>
                                                <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainHashExpected"></div>
                                                <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainHashFound"></div>
                                            </div>
                                            ${$.map(array[0], (element, index) => {
                                                return (
                                                    html`<div class="row justify-content-center tableSimpleRow blockchainValidationResultRow">
                                                        <div class="col-lg-auto col-md-4 col-sm-6">
                                                            <div class="smallTitle d-none" data-localization="blockchainBlockNumber"></div>
                                                            <div class="resultsBlockNumber">${index}</div>
                                                        </div>
                                                        <div class="col-lg-auto col-md-4 col-sm-6">
                                                            <div class="smallTitle d-none" data-localization="blockchainTimestamp"></div>
                                                            <div data-timestamp="${element[0]}"></div>
                                                        </div>
                                                        <div class="col-lg-auto col-md-4 col-sm-6">
                                                            <div class="smallTitle d-none" data-localization="blockchainHashExpected"></div>
                                                            <div class="validationResultsHash">${element[1]}</div>
                                                        </div>
                                                        <div class="col-lg-auto col-md-4 col-sm-6">
                                                            <div class="smallTitle d-none" data-localization="blockchainHashFound"></div>
                                                            <div class="validationResultsHash">${element[2]}</div>
                                                        </div>
                                                    </div>`
                                                )
                                            })}
                                        </div>`
                                    :
                                    void(0)}
                                    ${!$.isEmptyObject(array[1]) ?
                                        html`<div class="invalidBlockchainResultsHead text-center" data-localization="adminBlockchainResultsReferenceMessage"></div>
                                            <div class="table responsiveTable">
                                                <div class="row tableRowTitle">
                                                    <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainNumberTimestampOfFirst"></div>
                                                    <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainNumberTimestampOfSecond"></div>
                                                    <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainHashExpected"></div>
                                                    <div class="col-auto align-self-center text-center wordBreak" data-localization="blockchainHashFound"></div>
                                                </div>
                                                ${$.map(array[1], (element, index) => {
                                                    return (
                                                        html`<div class="row justify-content-center tableSimpleRow blockchainValidationResultRow">
                                                            <div class="col-lg-auto col-md-4 col-sm-6">
                                                                <div class="smallTitle d-none" data-localization="blockchainNumberTimestampOfFirst"></div>
                                                                <div>
                                                                    <span>${index} / </span>
                                                                    <span data-timestamp="${element[0]}"></div>
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-auto col-md-4 col-sm-6">
                                                                <div class="smallTitle d-none" data-localization="blockchainNumberTimestampOfSecond"></div>
                                                                <div>
                                                                    <span>${parseInt(index) + 1} / </span>
                                                                    <span data-timestamp="${element[1]}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-auto col-md-4 col-sm-6">
                                                                <div class="smallTitle d-none" data-localization="blockchainHashExpected"></div>
                                                                <div class="validationResultsHash">${element[2]}</div>
                                                            </div>
                                                            <div class="col-lg-auto col-md-4 col-sm-6">
                                                                <div class="smallTitle d-none" data-localization="blockchainHashFound"></div>
                                                                <div class="validationResultsHash">${element[3]}</div>
                                                            </div>
                                                        </div>`
                                                    )
                                                })}
                                            </div>`
                                        :
                                        void(0)
                                     }   
                            </div>
                        </div>`
                }
            </div>`, mainSelector);

    adjustGeneralTableAppearance($('main .blockchainValidationResults'));
}