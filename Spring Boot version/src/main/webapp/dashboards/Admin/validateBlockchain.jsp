<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="container bg-text blockchainValidationResults animate slideIn">
    <c:choose>
        <c:when test="${empty results}">
            <div class="row">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter"></div>
                    <div class="bgTextMessage"><spring:message code="admin.blockchainIsEmpty"/></div>
                </div>
            </div>
        </c:when>
        <c:otherwise>
            <c:choose>
                <c:when test="${empty results[0] && empty results[1]}">
                    <div class="row">
                        <div class="col">
                            <div class="symbol bgTextSymbolCenter successTextColor"></div>
                            <div class="bgTextMessage"><spring:message code="admin.blockchainIsValid"/></div>
                        </div>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="row">
                        <div class="col">
                            <div class="symbol bgTextSymbolCenter errorTextColor"></div>
                            <div><spring:message code="admin.blockchainIsInvalid"/></div>
                            <c:choose>
                                <c:when test="${not empty results[0]}">
                                    <div>
                                        <div class="invalidBlockchainResultsHead text-center">
                                            <spring:message code="admin.blockchainResultsCalculationMessage"/>
                                        </div>
                                        <div class="row tableTitleRow">
                                            <div class="col-2 align-self-center text-center wordBreak"><spring:message code="blockchain.blockNumber"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.timestamp"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.hashExpected"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.hashFound"/></div>
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
                                        <div class="invalidBlockchainResultsHead text-center">
                                            <spring:message code="admin.blockchainResultsReferenceMessage"/>
                                        </div>
                                        <div class="row tableTitleRow">
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.numberTimestampOfFirst"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.numberTimestampOfSecond"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.hashExpected"/></div>
                                            <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.hashFound"/></div>
                                        </div>
                                        <c:forEach items="${results[1]}" var="result">
                                            <div class="row tableSimpleRow blockchainValidationResultRow">
                                                <div class="col align-self-center text-center">${result.key} / ${result.value[0]}</div>
                                                <div class="col align-self-center text-center">${result.key + 1} / ${result.value[1]}</div>
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