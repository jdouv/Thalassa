<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<li class="nav-item navLogin-parent" style="display: none;">
    <button type="button" class="navBut navLogin"><spring:message code="users.switchToLogin"/></button>
</li>
<li class="nav-item navRegister-parent" style="display: none;">
    <button type="button" class="navBut navRegister"><spring:message code="users.switchToRegister"/></button>
</li>