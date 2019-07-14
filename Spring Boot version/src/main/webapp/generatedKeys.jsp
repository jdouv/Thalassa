<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="container">
    <div class="row copyKeysToClipboard" title="<spring:message code="users.copyKeysToClipboard"/>">
        <div class="col">
            <div class="generatedKeysTitle"><spring:message code="users.publicKey"/></div>
            <div id="publicKeyQR"></div>
            <div class="generatedPublicKey" style="display:none;">${publicKey}</div>
        </div>
        <div class="col">
            <div class="generatedKeysTitle"><spring:message code="users.privateKey"/></div>
            <div id="privateKeyQR"></div>
            <div class="generatedPrivateKey" style="display:none;">${privateKey}</div>
        </div>
    </div>
    <div class="keysCopiedToClipboard" style="display:none;"><spring:message code="users.keysCopiedToClipboard"/></div>
    <div class="messageBeforeRegister"><spring:message code="users.messageBeforeRegister"/></div>
</div>