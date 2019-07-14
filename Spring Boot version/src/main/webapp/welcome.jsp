<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="jumbotron animate slideIn">
    <h1 class="display-4"><span class="spiral"></span><span class="logoName"></span></h1>
    <p class="lead"><spring:message code="basics.welcomeUnderConstruction"/></p>
    <hr class="my-4">
    <div class="jumbotron-buttons">
        <button type="button" class="button jumbotron-button" name="jumbotronLogin"><spring:message code="users.login"/></button>
        <button type="button" class="button jumbotron-button" name="register"><spring:message code="users.register"/></button>
    </div>
</div>