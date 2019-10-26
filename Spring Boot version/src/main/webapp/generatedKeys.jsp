<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="container">
    <div class="row copyKeysToClipboard" data-localization-title="usersCopyKeysToClipboard">
        <div class="col">
            <div class="generatedKeysTitle" data-localization="usersPublicKey"></div>
            <div id="publicKeyQR"></div>
            <div class="generatedPublicKey" style="display:none;">${publicKey}</div>
        </div>
        <div class="col">
            <div class="generatedKeysTitle" data-localization="usersPrivateKey"></div>
            <div id="privateKeyQR"></div>
            <div class="generatedPrivateKey" style="display:none;">${privateKey}</div>
        </div>
    </div>
    <div class="keysCopiedToClipboard" data-localization="usersKeysCopiedToClipboard" style="display:none;"></div>
    <div class="messageBeforeRegister" data-localization="usersMessageBeforeRegister"></div>
</div>