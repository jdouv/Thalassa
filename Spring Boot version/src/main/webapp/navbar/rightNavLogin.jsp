<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<li class="nav-item">
    <div class="dropdown navButDropdown animate slideIn">
        <button class="btn btn-secondary dropdown-toggle dropdownButton navBut userIconButton" type="button" id="userOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="symbol navButSymbolUser"></span></button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
            <button class="dropdown-item dropdownItem navButSettings" type="button"><spring:message code="basics.settings"/></button>
            <button class="dropdown-item dropdownItem logoutButton" type="button"><spring:message code="users.logout"/></button>
        </div>
    </div>
</li>