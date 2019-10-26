<%@ page contentType="text/html;charset=UTF-8" %>

<li class="dropdown navButDropdown animate slideIn">
    <button class="btn btn-secondary dropdown-toggle dropdownButton navBut" type="button" id="navContractOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="symbol navButSymbolInline"></span> <span data-localization="legalContracts"></span>
        <span class="caret symbol"></span>
    </button>
    <div class="dropdown-menu" aria-labelledby="navContractOptions">
        <button class="dropdown-item contractOption dropdownItem allContractsButton" data-localization="legalContractsAllContracts" type="button"></button>
        <button class="dropdown-item contractOption dropdownItem draftNewContractButton" type="button"><span data-localization="legalContractsNewContract"></span> (<span data-localization="basicsCurrentlyUnavailable"></span>)</button>
    </div>
</li>