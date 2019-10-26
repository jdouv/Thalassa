<%@ page contentType="text/html;charset=UTF-8" %>

<li class="nav-item">
    <div class="dropdown navButDropdown animate slideIn">
        <button class="btn btn-secondary dropdown-toggle dropdownButton navBut userIconButton" type="button" id="userOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="symbol navButSymbolUser"></span></button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
            <button class="dropdown-item dropdownItem navButSettings" data-localization="basicsSettings" type="button"></button>
            <button class="dropdown-item dropdownItem logoutButton" data-localization="usersLogout" type="button"></button>
        </div>
    </div>
</li>