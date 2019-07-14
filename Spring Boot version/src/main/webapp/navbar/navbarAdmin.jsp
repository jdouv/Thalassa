<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<li class="dropdown navButDropdown animate slideIn">
    <button class="btn btn-secondary dropdown-toggle dropdownButton navBut" type="button" id="blockchainOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="symbol navButSymbolInline"></span> Blockchain
        <span class="caret symbol"></span>
    </button>
    <div class="dropdown-menu" aria-labelledby="blockchainOptions">
        <button class="dropdown-item dropdownItem validateBlockchain" type="button"><spring:message code="admin.validateBlockchain"/></button>
    </div>
</li>