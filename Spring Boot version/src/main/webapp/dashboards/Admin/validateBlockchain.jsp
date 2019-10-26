<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="container bg-text blockchainValidationResults animate slideIn">
    <c:choose>
        <c:when test="${empty results}">
            <div class="row">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter"></div>
                    <div class="bgTextMessage" data-localization="adminBlockchainIsEmpty"></div>
                </div>
            </div>
        </c:when>
        <c:otherwise>
            <c:choose>
                <c:when test="${empty results[0] && empty results[1]}">
                    <div class="row">
                        <div class="col">
                            <div class="symbol bgTextSymbolCenter successTextColor"></div>
                            <div class="bgTextMessage" data-localization="adminBlockchainIsValid"></div>
                        </div>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="row">
                        <div class="col">
                            <div class="symbol bgTextSymbolCenter errorTextColor"></div>
                            <div data-localization="adminBlockchainIsInvalid"></div>
                            <c:choose>
                                <c:when test="${not empty results[0]}">
                                    <div>
                                        <div class="invalidBlockchainResultsHead text-center" data-localization="adminBlockchainResultsCalculationMessage"></div>
                                        <div class="row tableTitleRow">
                                            <div class="col-2 align-self-center text-center wordBreak" data-localization="blockchainBlockNumber"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainTimestamp"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainHashExpected"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainHashFound"></div>
                                        </div>
                                        <c:forEach items="${results[0]}" var="result">
                                            <div class="row tableSimpleRow blockchainValidationResultRow">
                                                <div class="col-2 align-self-center text-center resultsBlockNumber">${result.key}</div>
                                                <div class="col align-self-center text-center">${result.value[0]}</div>
                                                <div class="col align-self-center text-center validationResultsHash">${result.value[1]}</div>
                                                <div class="col align-self-center text-center validationResultsHash">${result.value[2]}</div>
                                            </div>
                                        </c:forEach>
                                    </div>
                                </c:when>
                            </c:choose>
                            <c:choose>
                                <c:when test="${not empty results[1]}">
                                    <div>
                                        <div class="invalidBlockchainResultsHead text-center" data-localization="adminBlockchainResultsReferenceMessage"></div>
                                        <div class="row tableTitleRow">
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainNumberTimestampOfFirst"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainNumberTimestampOfSecond"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="blockchainHashExpected"></div>
                                            <div class="col align-self-center text-center wordBreak" data-localization="bBlockchainHashFound"></div>
                                        </div>
                                        <c:forEach items="${results[1]}" var="result">
                                            <div class="row tableSimpleRow blockchainValidationResultRow">
                                                <div class="col align-self-center text-center">${result.key} / <span data-timestamp="${result.value[0]}"></span></div>
                                                <div class="col align-self-center text-center">${result.key + 1} / <span data-timestamp="${result.value[1]}"></span></div>
                                                <div class="col align-self-center text-center validationResultsHash">${result.value[2]}</div>
                                                <div class="col align-self-center text-center validationResultsHash">${result.value[3]}</div>
                                            </div>
                                        </c:forEach>
                                    </div>
                                </c:when>
                            </c:choose>
                        </div>
                    </div>
                </c:otherwise>
            </c:choose>
        </c:otherwise>
    </c:choose>
</div>