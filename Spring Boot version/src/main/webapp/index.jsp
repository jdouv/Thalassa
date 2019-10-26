<%@ page contentType="text/html;charset=UTF-8" %>

<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        });
    }
</script>

<html style="display: none;">
<head>
    <title data-localization-page-title="basicsHome"></title>
    <link rel="manifest" href="bin/manifest.json">
    <link rel="stylesheet" type="text/css" href="https://necolas.github.io/normalize.css/latest/normalize.css" />
    <link rel="stylesheet" type="text/css" href="bin/reset.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="bin/common.css" />
    <link rel="stylesheet" type="text/css" href="bin/light.css" class="lightStyle"/>
    <link rel="stylesheet" type="text/css" href="bin/dark.css" class="darkStyle"/>
    <link rel="shortcut icon" href="bin/favicon.ico" />
</head>
<%@ include file="extra.jsp" %>
<div class="bg-image"></div>
<body>
<header>
    <nav class="navbar fixed-top navbar-expand-md">
        <div class="navbar-brand navBut animate slideInLogo" style="display:none;"><span class="navLogoSpiral"></span><span class="navLogoName"></span></div>
        <button class="navbar-toggler order-first" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto navbarUsers">
                <%@ include file="navbar/navbarRegisterLogin.jsp" %>
            </ul>
            <ul class="navbar-nav mr-auto"></ul>
            <ul class="navbar-nav rightNavButtons navButBackground transition">
                <%@ include file="navbar/mainRightNav.jsp" %>
            </ul>
        </div>
    </nav>
</header>
<main>
    <%@ include file="welcome.jsp" %>
</main>
<footer></footer>
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script type="text/javascript" src="bin/qrcodegen.js"></script>
<script type="text/javascript" src="https://momentjs.com/downloads/moment-with-locales.js"></script>
<script type="text/javascript" src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script>
<script type="text/javascript" src="bin/main.js"></script>
</body>
</html>