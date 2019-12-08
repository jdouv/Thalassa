const { h, Fragment, render } = window.preact;

renderLegalEngineerDashboard();
renderLegalEngineerNavbar();

function renderLegalEngineerDashboard() {
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
                        h("span", {"data-localization": "usersWelcome"}), ", " + parseJWT(localStorage.getItem('JWT'))['firstName'] + "."),
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
