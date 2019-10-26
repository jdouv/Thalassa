<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="responseStatus" style="display:none;">${status}</div>

<div class="register-wrapper animate slideIn">
    <div class="register">
        <div class="title" data-localization="usersRegister"></div>
        <div class="bg-text">
            <form:form class="registerForm formClass" modelAttribute="user">
                <div class="form-row firstFormRow">
                    <div class="col inputWrapper">
                        <form:input path="firstName" type="text" maxlength="30" id="firstName" required="required" />
                        <label for="firstName" data-localization="usersFirstName"></label>
                        <div class="formErrors">
                            <div class="formWarning" data-localization="usersInvalidFirstName" style="display:none;"></div>
                            <form:errors path="firstName" cssClass="formWarningServer"/>
                        </div>
                    </div>
                    <div class="col inputWrapper">
                        <form:input path="lastName" type="text" maxlength="30" id="lastName" required="required" />
                        <label for="lastName" data-localization="usersLastName"></label>
                        <div class="formErrors">
                            <div class="formWarning" data-localization="usersInvalidLastName" style="display:none;"></div>
                            <form:errors path="lastName" cssClass="formWarningServer"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col inputWrapper positionsWrapper">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle dropdownButton" data-localization-title="usersPosition" id="userPosition" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span data-user-position="usersPosition" data-localization="usersPosition"></span>
                                <span class="caret symbol"></span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="userPosition">
                                <button class="dropdown-item navButSymbol position dropdownItem" data-localization="usersPositionsLegalEngineer" type="button" value="LegalEngineer"></button>
                                <button class="dropdown-item navButSymbol position dropdownItem" data-localization="usersPositionsShipbroker" type="button" value="Shipbroker"></button>
                            </div>
                        </div>
                        <form:input class="positionInput" path="position" type="text" id="position" required="required" hidden="hidden" />
                        <label style="display:none;" for="position" data-localization="usersPosition"></label>
                        <div class="formErrors formErrorsFull">
                            <form:errors path="position" cssClass="formWarningServer"/>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col inputWrapper">
                        <form:input class="registerEmailInput" path="email" type="text" id="email" required="required" />
                        <label for="email" data-localization="usersEmail"></label>
                        <div class="formErrors formErrorsFull">
                            <div class="formWarning" data-localization="errorEmailInvalid" style="display:none;"></div>
                            <div class="emailAlreadyInUse" data-localization="errorEmailAlreadyInUse" style="display:none;"></div>
                            <form:errors path="email" cssClass="formWarningServer"/>
                        </div>
                        <form:input path="publicKey" type="text" id="publicKeyText" required="required" hidden="hidden" />
                        <form:input path="privateKey" type="password" id="privateKeyText" required="required" hidden="hidden" />
                    </div>
                </div>
                <div class="generatedKeys" style="display:none;"></div>
                <div class="text-center formButtons">
                    <div class="submitButtonWraper formButton1" style="display:none;">
                        <button type="submit" class="button submitButton registerButton" data-localization="usersRegister"></button>
                    </div>
                    <div class="resetButtonWrapper formButton2" style="display:none;">
                        <button class="button resetButton" data-localization="basicsFormReset" type="reset"></button>
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