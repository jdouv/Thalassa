<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="login-parent animate slideIn">
    <div class="login">
        <div class="title"><spring:message code="users.login"/></div>
        <div class="bg-text">
            <div class="loginWithQRScan"><spring:message code="users.loginWithQRScan"/></div>
            <video id="loginQRScannerVideo"></video>
            <div class="orInputQRCodeLogin"><spring:message code="users.orTypeQRCodeLogin"/></div>
            <form:form class="loginForm" modelAttribute="user">
                <div class="form-row firstFormRow inputParent">
                    <div class="col">
                        <form:input path="privateKey" id="privateKey" type="password" required="required" />
                        <span class="passwordEye symbol" title="<spring:message code="users.revealPrivateKey"/>"><spring:message code="basics.eye"/></span>
                        <label for="privateKey"><spring:message code="users.privateKey"/></label>
                        <div class="formErrors">
                            <div><form:errors path="privateKey" cssClass="formWarningServer"/></div>
                        </div>
                    </div>
                </div>
                <div class="text-center formButtons">
                    <div class="submitButtonParent formButton1" style="display:none;">
                        <button type="submit" class="button submitButton loginButton"><spring:message code="users.login"/></button>
                    </div>
                    <div class="resetButtonParent formButton2" style="display:none;">
                        <button class="button resetButton" type="reset"><spring:message code="basics.formReset"/></button>
                    </div>
                </div>
            </form:form>
        </div>
    </div>
</div>