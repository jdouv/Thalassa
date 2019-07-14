<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<li class="dropdown navButDropdown animate slideIn">
    <button class="btn btn-secondary dropdown-toggle dropdownButton navBut" type="button" id="navContractOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="symbol navButSymbolInline"></span> <spring:message code="legal.contracts"/>
        <span class="caret symbol"></span>
    </button>
    <div class="dropdown-menu" aria-labelledby="navContractOptions">
        <button class="dropdown-item contractOption dropdownItem allContractsButton" type="button"><spring:message code="legal.contracts.allContracts"/></button>
        <button class="dropdown-item contractOption dropdownItem draftNewContractButton" type="button"><spring:message code="legal.contracts.newContract"/> (<spring:message code="basics.currentlyUnavailable"/>)</button>
    </div>
</li>