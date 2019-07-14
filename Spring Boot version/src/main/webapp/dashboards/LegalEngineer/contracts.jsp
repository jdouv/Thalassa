<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="container bg-text userContracts animate slideIn">
    <c:choose>
        <c:when test="${empty contracts}">
            <div class="row">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter text-center"></div>
                    <div class="bgTextMessage"><spring:message code="legal.contracts.empty"/></div>
                </div>
            </div>
        </c:when>
        <c:otherwise>
            <div class="row">
                <div class="col">
                    <div class="symbol bgTextSymbolCenter text-center"></div>
                    <div class="bgTextTitleText text-center"><spring:message code="legal.contracts"/></div>
                </div>
            </div>
            <div>
                <div class="row tableTitleRow">
                    <div class="col align-self-center text-center wordBreak"><spring:message code="legal.contracts.title"/></div>
                    <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.timestamp"/></div>
                    <div class="col align-self-center text-center wordBreak"><spring:message code="blockchain.hash"/></div>
                </div>
                <c:forEach items="${contracts}" var="contract">
                    <div class="row tableSimpleRow contractRow">
                        <div class="blockIndex" style="display:none;">${contract["index"]}</div>
                        <div class="col align-self-center text-center resultsBlockNumber"><spring:message code="legal.contracts.titles.lower.${contract.title}"/></div>
                        <div class="col align-self-center text-center">${contract["timestamp"]}</div>
                        <div class="col align-self-center text-center validationResultsHash">${contract["hash"]}</div>
                    </div>
                </c:forEach>
            </div>
        </c:otherwise>
    </c:choose>
</div>