<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="login-wrapper animate slideIn">
    <div class="login">
        <div class="title" data-localization="usersLogin"></div>
        <div class="bg-text">
            <div class="loginWithQRScan" data-localization="usersLoginWithQRScan"></div>
            <video id="loginQRScannerVideo"></video>
            <div class="orInputQRCodeLogin" data-localization="usersOrTypeQRCodeLogin"></div>
            <form:form class="loginForm" modelAttribute="user">
                <div class="form-row firstFormRow inputWrapper">
                    <div class="col">
                        <form:input path="privateKey" id="privateKey" type="password" required="required" />
                        <span class="passwordEye symbol" data-localization-title="usersRevealPrivateKey"></span>
                        <label for="privateKey" data-localization="usersPrivateKey"></label>
                        <div class="formErrors">
                            <div><form:errors path="privateKey" cssClass="formWarningServer"/></div>
                        </div>
                    </div>
                </div>
                <div class="text-center formButtons">
                    <div class="submitButtonWrapper formButton1" style="display:none;">
                        <button type="submit" class="button submitButton aaa loginButton" data-localization="usersLogin"></button>
                    </div>
                    <div class="resetButtonWrapper formButton2" style="display:none;">
                        <button class="button resetButton" data-localization="basicsFormReset" type="reset"></button>
                    </div>
                </div>
            </form:form>
        </div>
    </div>
</div>