<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="register-parent animate slideIn">
    <div class="register">
        <div class="title"><spring:message code="users.register"/></div>
        <div class="bg-text">
            <form:form class="registerForm formClass" modelAttribute="user">
                <div class="form-row firstFormRow">
                    <div class="col inputParent">
                        <form:input path="firstName" type="text" maxlength="30" id="firstName" required="required" />
                        <label for="firstName"><spring:message code="users.firstName"/></label>
                        <div class="formErrors">
                            <div class="formWarning" style="display:none;"><spring:message code="users.invalidFirstName"/></div>
                            <form:errors path="firstName" cssClass="formWarningServer"/>
                        </div>
                    </div>
                    <div class="col inputParent">
                        <form:input path="lastName" type="text" maxlength="30" id="lastName" required="required" />
                        <label for="lastName"><spring:message code="users.lastName"/></label>
                        <div class="formErrors">
                            <div class="formWarning" style="display:none;"><spring:message code="users.invalidLastName"/></div>
                            <form:errors path="lastName" cssClass="formWarningServer"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col inputParent positionsParent">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle dropdownButton" id="userPosition" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="<spring:message code="users.position"/>"><spring:message code="users.position"/>
                                <span class="caret symbol"></span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="userPosition">
                                <button class="dropdown-item navButSymbol position dropdownItem" type="button" value="LegalEngineer"><spring:message code="users.positions.legalEngineer"/></button>
                                <button class="dropdown-item navButSymbol position dropdownItem" type="button" value="Shipbroker"><spring:message code="users.positions.shipbroker"/></button>
                            </div>
                        </div>
                        <form:input class="positionInput" path="position" type="text" id="position" required="required" hidden="hidden" />
                        <label style="display:none;" for="position"><spring:message code="users.position"/></label>
                        <div class="formErrors formErrorsFull">
                            <form:errors path="position" cssClass="formWarningServer"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col inputParent">
                        <form:input class="registerEmailInput" path="email" type="text" id="email" required="required" />
                        <label for="email"><spring:message code="users.email"/></label>
                        <div class="formErrors formErrorsFull">
                            <div class="formWarning" style="display:none;"><spring:message code="error.emailInvalid"/></div>
                            <div class="emailAlreadyInUse" style="display:none;"><spring:message code="error.emailAlreadyInUse"/></div>
                            <form:errors path="email" cssClass="formWarningServer"/>
                        </div>
                        <form:input path="publicKey" type="text" id="publicKeyText" required="required" hidden="hidden" />
                        <form:input path="privateKey" type="password" id="privateKeyText" required="required" hidden="hidden" />
                    </div>
                </div>
                <div class="generatedKeys" style="display:none;"></div>
                <div class="text-center formButtons">
                    <div class="submitButtonParent formButton1" style="display:none;">
                        <button type="submit" class="button submitButton registerButton"><spring:message code="users.register"/></button>
                    </div>
                    <div class="resetButtonParent formButton2" style="display:none;">
                        <button class="button resetButton" type="reset"><spring:message code="basics.formReset"/></button>
                    </div>
                </div>
            </form:form>
            <label style="display:none;" class="toggle"> <!-- For future usage -->
                <input style="display:none;" type="checkbox" />
                <div style="display:none;"></div>
            </label>
        </div>
    </div>
</div>