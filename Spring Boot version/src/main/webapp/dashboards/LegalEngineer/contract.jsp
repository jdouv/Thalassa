<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="Thalassa.DataManagement.Utils" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="contract bg-text container animate slideIn vw-100">
    <section class="row contractTitleGroup">
        <div class="col-lg-4 offset-lg-4 mr-auto align-self-center contractTitle"><span data-localization="legalContractsTitlesUpper${composedContract['contract'].title}"></span></div>
        <div class="col-lg-auto contractTitleQRGroup">
            <div class="contractQR qrCode" data-localization-title="basicsCopyQR"></div>
            <div class="copiedQR text-center" data-localization="basicsCopiedQR" style="display:none;"></div>
            <div class="contractHash qrCodeText" style="display:none;">${composedContract["hash"]}</div>
            <div class="contractTimestamp" data-timestamp="${composedContract["timestamp"]}"></div>
        </div>
    </section>
    <div class="row">
        <div class="col">
            <button class="collapseButton" data-localization="legalContractingParties" type="button" data-toggle="collapse" data-target="#contractingParties" aria-expanded="false" aria-controls="contractingParties"></button>
            <div class="collapse" id="contractingParties">
                <div class="card card-body">
                    <div class="row justify-content-center">
                        <c:forEach items="${composedContract['contract'].essentials['signatures']}" var="signature">
                            <div class="col-auto infoBox contractSignature">
                                <div class="signatureQRGroup">
                                    <div class="contractSignaturesQR qrCode" data-localization-title="basicsCopyQR"></div>
                                    <div class="copiedQR text-center" data-localization="basicsCopiedQR" style="display:none;"></div>
                                    <div class="qrCodeText contractSignatureToValidate" style="display:none;">${signature["signature"]}</div>
                                    <div class="signatureValid" style="display:none;">${signature["valid"]}</div>
                                    <div class="signatureValidation" style="display:none;">
                                        <div class="symbol bgTextSymbolCenter successTextColorSmall signatureValidationSymbol"></div>
                                        <div class="copiedQR" data-localization="blockchainSignatureValid"></div>
                                    </div>
                                    <div class="signatureValidation" style="display:none;">
                                        <div class="symbol bgTextSymbolCenter errorTextColor signatureValidationSymbol"></div>
                                        <div class="copiedQR" data-localization="blockchainSignatureInvalid"></div>
                                    </div>
                                </div>
                                <div class="rightInfo">
                                    <div><span class="bold signatureNameHighlight">${signature["signer"].firstName} ${signature["signer"].lastName}</span></div>
                                    <div><span class="bold"><span data-localization="usersPositions${Utils.toPascalCase(signature['signer'].position)}"></span></span></div>
                                    <c:choose>
                                        <c:when test="${signature['onBehalfOf'] != null}">
                                            <div data-localization="legalContractsOnBehalfOf"></div>
                                            <div><span class="bold">${signature["onBehalfOf"].firstName} ${signature["onBehalfOf"].lastName}</span></div>
                                        </c:when>
                                    </c:choose>
                                </div>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </div>
            <button class="collapseButton" data-localization="legalContractsEssentials" type="button" data-toggle="collapse" data-target="#essentials" aria-expanded="false" aria-controls="essentials"></button>
            <div class="collapse" id="essentials">
                <div class="card card-body">
                    <c:choose>
                        <c:when test="${composedContract['contract'].essentials['type'] == 'timeCharter'}">
                            ${composedContract["contract"].essentials['preamble']}
                            <div class="row justify-content-center essentialsData">
                                <div class="col-auto infoBox">
                                    <div class="contractIcon vesselIcon"><svg viewBox="0 0 542 281"><path fill="#fff" d="M 67.26,68.48 C 67.36,70.08 67.96,72.37 66.46,73.27 64.76,74.27 62.87,72.67 61.27,71.67 55.67,68.08 53.47,60.98 55.97,54.78 58.47,48.68 64.86,45.08 70.96,46.28 77.76,47.48 82.55,52.78 82.75,59.98 82.85,62.88 81.95,65.68 80.16,68.08 79.96,68.38 79.26,68.68 78.96,68.58 77.56,67.98 76.56,66.98 75.76,65.78 75.36,65.08 75.86,64.28 76.16,63.58 77.06,61.48 77.26,59.28 76.26,57.08 75.06,54.08 71.96,51.98 68.76,51.98 65.66,51.98 62.37,54.18 61.17,56.98 60.17,59.98 60.97,63.98 63.56,66.08 64.66,66.98 65.96,67.68 67.26,68.48 Z M 65.36,91.27 C 65.46,91.77 65.66,92.17 65.76,92.67 65.96,96.87 65.56,97.27 61.57,96.27 46.57,92.67 36.68,83.47 33.08,68.38 27.68,45.28 44.18,26.79 62.77,23.49 79.76,20.59 99.74,30.69 104.74,50.88 108.34,65.38 104.04,77.57 93.35,87.97 91.75,86.77 90.95,85.27 89.95,83.97 90.25,82.47 91.45,81.77 92.25,80.87 107.44,63.58 99.84,36.99 77.96,30.19 58.57,24.19 38.78,38.79 37.98,58.48 37.28,74.87 48.87,87.27 61.27,90.17 62.57,90.57 63.86,90.87 65.36,91.27 Z M 64.16,114.16 C 64.56,116.06 64.26,117.76 63.86,119.76 51.27,118.76 40.28,114.16 30.68,106.16 18.99,96.57 11.79,84.17 9.59,69.18 5.00,36.89 24.89,10.90 51.07,2.70 79.76,-6.30 110.74,7.40 123.33,34.59 136.52,63.08 124.83,93.77 105.24,107.36 105.04,107.06 104.74,106.66 104.54,106.16 103.94,105.06 103.24,103.96 102.64,102.96 128.63,80.37 126.53,49.38 114.84,31.09 101.54,10.30 76.16,1.00 52.57,8.30 31.48,14.79 13.39,35.79 14.89,62.88 15.59,76.37 20.69,87.97 29.98,97.67 39.28,107.46 50.77,112.66 64.16,114.16 Z M 49.57,281.00 C 49.77,280.50 49.77,280.20 49.17,280.00 43.18,277.30 41.08,272.20 40.78,266.11 40.48,259.81 41.68,253.71 43.28,247.71 44.98,241.71 47.07,235.82 49.67,230.22 50.77,227.92 50.57,225.92 49.47,223.82 47.67,220.22 44.88,217.72 41.48,215.82 36.68,213.12 31.38,211.82 25.99,211.12 19.59,210.33 13.29,210.13 6.90,210.82 3.30,211.22 2.40,210.53 1.30,207.13 1.00,206.03 0.70,204.93 0.50,203.83 -0.20,198.73 -0.30,193.63 -0.00,188.53 0.70,174.64 2.40,160.84 4.40,147.05 4.80,144.65 4.90,144.45 7.40,144.45 8.50,144.45 9.59,144.45 10.79,144.45 34.48,144.45 58.07,144.45 81.75,144.45 87.55,144.45 86.65,144.35 85.75,139.45 82.25,121.96 78.56,104.46 74.86,86.97 73.56,79.97 71.96,73.27 70.46,66.58 70.16,65.18 69.76,63.78 69.96,62.28 73.96,70.77 78.06,79.37 82.15,87.87 90.25,105.06 98.35,122.26 106.54,139.35 107.04,140.55 107.64,141.65 108.24,142.85 108.64,143.65 109.34,144.05 110.14,144.15 111.74,144.25 113.34,144.25 114.94,144.25 225.38,144.25 335.81,144.25 446.25,144.25 454.05,144.25 461.94,144.35 469.74,144.75 484.63,145.55 499.32,147.45 513.52,152.25 518.81,154.05 523.91,156.24 528.71,159.34 532.21,161.64 535.40,164.24 537.90,167.64 542.60,174.14 543.30,181.14 540.10,188.43 538.40,192.33 535.80,195.53 532.81,198.43 527.21,203.83 520.61,207.73 513.52,210.82 511.72,211.62 509.92,212.22 508.12,212.92 506.32,213.62 505.72,214.62 505.92,216.72 506.12,218.82 506.62,220.82 507.12,222.82 509.02,230.22 511.92,237.32 514.62,244.51 516.81,250.51 519.11,256.51 521.31,262.51 522.21,264.91 522.81,267.40 522.81,270.00 522.71,275.50 520.31,278.20 515.01,279.10 513.12,279.40 511.22,279.80 509.32,280.10 506.42,280.10 503.52,279.70 500.72,280.90 350.21,281.00 199.89,281.00 49.57,281.00 Z M 240.57,149.45 C 165.21,149.45 89.95,149.45 14.59,149.45 8.20,149.45 9.49,148.65 8.60,154.64 7.50,162.24 6.80,169.94 6.00,177.54 5.20,185.03 5.10,192.53 5.40,200.03 5.50,201.33 5.60,202.53 5.90,203.83 6.00,204.63 6.60,205.23 7.50,205.23 8.60,205.23 9.69,205.13 10.89,205.13 16.79,204.93 22.69,205.03 28.58,206.03 34.28,206.93 39.78,208.53 44.78,211.52 48.67,213.92 51.87,216.92 53.97,221.02 55.87,224.72 56.67,228.52 54.27,232.42 53.97,232.82 53.87,233.32 53.67,233.72 50.37,241.71 47.57,249.81 46.27,258.41 45.87,261.31 45.67,264.11 45.97,267.00 46.67,272.90 49.47,275.50 55.37,275.90 57.17,276.00 58.87,275.90 60.67,275.90 184.30,275.90 307.83,275.90 431.46,275.90 449.55,275.90 467.64,275.80 485.63,275.60 491.83,275.50 498.12,275.30 504.32,275.00 507.52,274.80 510.72,274.40 513.82,274.00 516.51,273.60 517.61,272.20 517.51,269.40 517.41,267.50 516.81,265.61 516.21,263.81 513.72,257.11 511.22,250.31 508.72,243.61 506.32,237.22 503.82,230.82 502.02,224.12 501.32,221.32 500.52,218.52 500.62,215.62 500.82,212.12 502.22,209.53 505.72,208.23 507.62,207.53 509.62,206.83 511.52,205.93 517.41,203.43 522.91,200.23 527.81,195.93 530.61,193.43 533.00,190.73 534.70,187.43 538.10,181.04 537.50,175.14 532.81,169.64 530.91,167.44 528.71,165.54 526.31,163.94 522.61,161.44 518.51,159.54 514.32,157.94 502.72,153.55 490.53,151.75 478.34,150.35 468.34,149.25 458.25,149.25 448.15,149.25 378.99,149.45 309.83,149.45 240.57,149.45 Z M 92.05,143.85 C 95.35,144.45 98.55,144.25 101.64,144.05 102.14,144.05 102.44,143.55 102.34,143.05 102.24,142.55 102.04,142.15 101.84,141.75 96.75,130.85 91.55,119.96 86.35,108.96 86.15,108.46 85.95,107.76 84.85,107.76 87.25,119.86 89.65,131.85 92.05,143.85 Z"></path></svg></div>
                                    <div class="rightInfo">
                                        <div><span class="bold"><span data-localization="vesselsName"></span>:</span> ${composedContract["contract"].essentials["vessel"].name}</div>
                                        <div><span class="bold"><span data-localization="vesselsImoNumber"></span>:</span> ${composedContract["contract"].essentials["vessel"].imoNumber}</div>
                                        <div><span class="bold"><span data-localization="vesselsFlag"></span>:</span> ${composedContract["contract"].essentials["vessel"].flag}</div>
                                        <div><span class="bold"><span data-localization="vesselsYearBuilt"></span>:</span> ${composedContract["contract"].essentials["vessel"].yearBuilt}</div>
                                        <div><span class="bold"><span data-localization="vesselsDwt"></span>:</span> ${composedContract["contract"].essentials["vessel"].dwt} M/T</div>
                                    </div>
                                </div>
                            </div>
                        </c:when>
                    </c:choose>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <c:choose>
                <c:when test="${not empty composedContract['contract'].clauses}">
                    <button class="collapseButton" data-localization="legalContractsClauses" type="button" data-toggle="collapse" data-target="#clauses" aria-expanded="false" aria-controls="clauses"></button>
                    <div class="collapse" id="clauses">
                        <div class="card card-body">
                            <c:forEach items="${composedContract['contract'].clauses}" var="clause">
                                <div class="contractClause">
                                    <div class="clauseTitle">${clause.title}</div>
                                    <div class="testEnabledClause" style="display:none;"></div>
                                    <div class="row" data-localization-title="legalContractsToggleLegen">
                                        <div class="col paragraphReadable mr-lg-3">
                                            <div class="clauseSubtitle animate slideIn" data-localization="legalContractsReadable" style="display:none;"></div>
                                            <c:forEach items="${clause.paragraphs}" var="paragraph">
                                                <div class="paragraphGroup">
                                                    <div class="paragraphNumber"><c:out value="${paragraph['number']}"/>.</div>
                                                    <div class="paragraphText"><c:out value="${paragraph['readable']}"/></div>
                                                </div>
                                            </c:forEach>
                                        </div>
                                        <div class="col paragraphLegen animate slideIn ml-lg-3 " style="display:none;">
                                            <div class="clauseSubtitle animate slideIn" style="display:none;">Legen</div>
                                            <c:forEach items="${clause.paragraphs}" var="paragraph">
                                                <div class="paragraphGroup">
                                                    <div class="paragraphNumber"><c:out value="${paragraph['number']}"/>.</div>
                                                    <div class="paragraphText"><c:out value="${paragraph['legen']}"/></div>
                                                </div>
                                            </c:forEach>
                                        </div>
                                    </div>
                                    <div style="text-align:center;margin-top:10px;"><button type="button" class="button enableClause" data-localization="legalEnableClause"></button></div>
                                </div>
                            </c:forEach>
                        </div>
                    </div>
                </c:when>
            </c:choose>
        </div>
    </div>
</div>