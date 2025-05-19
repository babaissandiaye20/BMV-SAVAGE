'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">salvage-inspection-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' : 'data-bs-target="#xs-controllers-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' :
                                            'id="xs-controllers-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AppointmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PaymentModeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentModeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' : 'data-bs-target="#xs-injectables-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' :
                                        'id="xs-injectables-links-module-AppModule-e78da461db7bbb43d91f0293c6eb754d10071fe5f02b3637c26c2e0f1ab21ebbb77fc9c2bde6a6e2becbbc836d65dc9f0f3cca00724e7fa4f1d167bb6d176acc"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppointmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DocumentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ExceptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExceptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FirebaseAdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirebaseAdminService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PaymentModeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentModeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TwilioService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwilioService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ValidationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppointmentModule.html" data-type="entity-link" >AppointmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' : 'data-bs-target="#xs-controllers-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' :
                                            'id="xs-controllers-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' }>
                                            <li class="link">
                                                <a href="controllers/AppointmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' : 'data-bs-target="#xs-injectables-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' :
                                        'id="xs-injectables-links-module-AppointmentModule-e5ed75c0ae8a76e4cd824ff0bba4a56033e265d2b211e1477cdd852d3d410d214ef8dc171486058b08e3a97b229f2bdf960b4b3d280ba970ebbb94c7f6765a80"' }>
                                        <li class="link">
                                            <a href="injectables/AppointmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' :
                                            'id="xs-controllers-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' :
                                        'id="xs-injectables-links-module-AuthModule-d6273270d5f0187f5053cdf0607f657643ec827ed1823d19a2f02c179f547c121298a29e49b7f0c39a9f1463749312edf8aedc81617d13b19ec151e536d528f4"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BlacklistTokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlacklistTokenService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CacheModule.html" data-type="entity-link" >CacheModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CacheModule-f431471256a7d9a1cc20c7ebab55efc0bd7ba7694469a5b64eab6bd29fbbe05916366802a99eee961903e9855e497d57908831864fe8eaa564ce89f36d5e90ac"' : 'data-bs-target="#xs-injectables-links-module-CacheModule-f431471256a7d9a1cc20c7ebab55efc0bd7ba7694469a5b64eab6bd29fbbe05916366802a99eee961903e9855e497d57908831864fe8eaa564ce89f36d5e90ac"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CacheModule-f431471256a7d9a1cc20c7ebab55efc0bd7ba7694469a5b64eab6bd29fbbe05916366802a99eee961903e9855e497d57908831864fe8eaa564ce89f36d5e90ac"' :
                                        'id="xs-injectables-links-module-CacheModule-f431471256a7d9a1cc20c7ebab55efc0bd7ba7694469a5b64eab6bd29fbbe05916366802a99eee961903e9855e497d57908831864fe8eaa564ce89f36d5e90ac"' }>
                                        <li class="link">
                                            <a href="injectables/CacheService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CacheService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentModule.html" data-type="entity-link" >DocumentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' : 'data-bs-target="#xs-controllers-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' :
                                            'id="xs-controllers-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' }>
                                            <li class="link">
                                                <a href="controllers/DocumentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' : 'data-bs-target="#xs-injectables-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' :
                                        'id="xs-injectables-links-module-DocumentModule-a1da2c10411f6544694eaeafa0a73d3d1a2f2e7a9f122566ce54c6fba007a2935df61e94213d4d37b5964cd5f353280e8b88d8ae57a001fc8cd72754566ecccb"' }>
                                        <li class="link">
                                            <a href="injectables/DocumentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModeModule.html" data-type="entity-link" >PaymentModeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' : 'data-bs-target="#xs-controllers-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' :
                                            'id="xs-controllers-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' }>
                                            <li class="link">
                                                <a href="controllers/PaymentModeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentModeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' : 'data-bs-target="#xs-injectables-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' :
                                        'id="xs-injectables-links-module-PaymentModeModule-28314ff1ecfa3cd5a5411efcd53ce5aba8aac12498c9d2c8b443f40c57e5a1471b86c8edbbb577acaf2c0e1aa8b9b0df85bcf48e84cb674c07d10374b1ad36ae"' }>
                                        <li class="link">
                                            <a href="injectables/PaymentModeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentModeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' : 'data-bs-target="#xs-controllers-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' :
                                            'id="xs-controllers-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' }>
                                            <li class="link">
                                                <a href="controllers/PaymentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' : 'data-bs-target="#xs-injectables-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' :
                                        'id="xs-injectables-links-module-PaymentModule-265c11bcb542c58e4c3ed598ec40d6ad2603277d080e588702f8c0e451c0936bf171103390ed352a6c58928c967ce27067bff261db74889ce9536a89def6e647"' }>
                                        <li class="link">
                                            <a href="injectables/PaymentProcessorFactory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentProcessorFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PaymentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StripeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PrismaModule-40227a0ab6c09dd49e6ed4fd7d537ba0a551726c9bccc1637dabdbf722c07962e84411a9d71334969165702cbce10caf9a8c09fae8579939ee34d03f65857da7"' : 'data-bs-target="#xs-injectables-links-module-PrismaModule-40227a0ab6c09dd49e6ed4fd7d537ba0a551726c9bccc1637dabdbf722c07962e84411a9d71334969165702cbce10caf9a8c09fae8579939ee34d03f65857da7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-40227a0ab6c09dd49e6ed4fd7d537ba0a551726c9bccc1637dabdbf722c07962e84411a9d71334969165702cbce10caf9a8c09fae8579939ee34d03f65857da7"' :
                                        'id="xs-injectables-links-module-PrismaModule-40227a0ab6c09dd49e6ed4fd7d537ba0a551726c9bccc1637dabdbf722c07962e84411a9d71334969165702cbce10caf9a8c09fae8579939ee34d03f65857da7"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link" >RedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RedisModule-0995edcb7d3fa74be23ade3bc034e874644b8391a59a10262d9bb4fe27afcf0e1eba6be9441c03d4f4ec0d4872f84bddd4c819761ef8a8c9087298b64deb32bc"' : 'data-bs-target="#xs-injectables-links-module-RedisModule-0995edcb7d3fa74be23ade3bc034e874644b8391a59a10262d9bb4fe27afcf0e1eba6be9441c03d4f4ec0d4872f84bddd4c819761ef8a8c9087298b64deb32bc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RedisModule-0995edcb7d3fa74be23ade3bc034e874644b8391a59a10262d9bb4fe27afcf0e1eba6be9441c03d4f4ec0d4872f84bddd4c819761ef8a8c9087298b64deb32bc"' :
                                        'id="xs-injectables-links-module-RedisModule-0995edcb7d3fa74be23ade3bc034e874644b8391a59a10262d9bb4fe27afcf0e1eba6be9441c03d4f4ec0d4872f84bddd4c819761ef8a8c9087298b64deb32bc"' }>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmsModule.html" data-type="entity-link" >SmsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SmsModule-0b1af5f3efab88e052a768d85cf475cb9ec6944122c5fe95c66dd933212527933f62c4b6c4c5f65c5e3137ac34d9db9d33388a640327a5144c67ecbc987c14aa"' : 'data-bs-target="#xs-injectables-links-module-SmsModule-0b1af5f3efab88e052a768d85cf475cb9ec6944122c5fe95c66dd933212527933f62c4b6c4c5f65c5e3137ac34d9db9d33388a640327a5144c67ecbc987c14aa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmsModule-0b1af5f3efab88e052a768d85cf475cb9ec6944122c5fe95c66dd933212527933f62c4b6c4c5f65c5e3137ac34d9db9d33388a640327a5144c67ecbc987c14aa"' :
                                        'id="xs-injectables-links-module-SmsModule-0b1af5f3efab88e052a768d85cf475cb9ec6944122c5fe95c66dd933212527933f62c4b6c4c5f65c5e3137ac34d9db9d33388a640327a5144c67ecbc987c14aa"' }>
                                        <li class="link">
                                            <a href="injectables/EvolutionApiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvolutionApiService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TwilioService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwilioService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UploadModule-764038218ef1dadfea610dd7b1bc4fe9cefed045dcbe18b1dfdde19cee02b0d7feb787237601dade5d455c70f64f0f75ba7a1cdd24d769baa221f973b20f58e7"' : 'data-bs-target="#xs-injectables-links-module-UploadModule-764038218ef1dadfea610dd7b1bc4fe9cefed045dcbe18b1dfdde19cee02b0d7feb787237601dade5d455c70f64f0f75ba7a1cdd24d769baa221f973b20f58e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-764038218ef1dadfea610dd7b1bc4fe9cefed045dcbe18b1dfdde19cee02b0d7feb787237601dade5d455c70f64f0f75ba7a1cdd24d769baa221f973b20f58e7"' :
                                        'id="xs-injectables-links-module-UploadModule-764038218ef1dadfea610dd7b1bc4fe9cefed045dcbe18b1dfdde19cee02b0d7feb787237601dade5d455c70f64f0f75ba7a1cdd24d769baa221f973b20f58e7"' }>
                                        <li class="link">
                                            <a href="injectables/CloudinaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CloudinaryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' : 'data-bs-target="#xs-controllers-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' :
                                            'id="xs-controllers-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' : 'data-bs-target="#xs-injectables-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' :
                                        'id="xs-injectables-links-module-UserModule-f1a4451a869a270bbf2def2c4f151ff579ad87b5ab3845103203fbd836d7c80fe4f29df8b6cc6903c1a3a438d1867acebd2ae8127aff54a0e73502a7ef2ab04a"' }>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ValidationModule.html" data-type="entity-link" >ValidationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ValidationModule-824730b07e09222d78e9dfa7f46f04ab184dbb8027965997d267928467b507644d773d42631a8cb533e311030919ef2cfb19795757425b4653ad9714195b35c6"' : 'data-bs-target="#xs-injectables-links-module-ValidationModule-824730b07e09222d78e9dfa7f46f04ab184dbb8027965997d267928467b507644d773d42631a8cb533e311030919ef2cfb19795757425b4653ad9714195b35c6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ValidationModule-824730b07e09222d78e9dfa7f46f04ab184dbb8027965997d267928467b507644d773d42631a8cb533e311030919ef2cfb19795757425b4653ad9714195b35c6"' :
                                        'id="xs-injectables-links-module-ValidationModule-824730b07e09222d78e9dfa7f46f04ab184dbb8027965997d267928467b507644d773d42631a8cb533e311030919ef2cfb19795757425b4653ad9714195b35c6"' }>
                                        <li class="link">
                                            <a href="injectables/ExceptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExceptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ResponseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResponseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ValidationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateAppointmentDto.html" data-type="entity-link" >CreateAppointmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDocumentDto.html" data-type="entity-link" >CreateDocumentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGuestAppointmentDto.html" data-type="entity-link" >CreateGuestAppointmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentDto.html" data-type="entity-link" >CreatePaymentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentModeDto.html" data-type="entity-link" >CreatePaymentModeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentResponseDto.html" data-type="entity-link" >DocumentResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParamAppointmentIdDto.html" data-type="entity-link" >ParamAppointmentIdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParamDocumentIdDto.html" data-type="entity-link" >ParamDocumentIdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParamUserIdDto.html" data-type="entity-link" >ParamUserIdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParamUserIdDto-1.html" data-type="entity-link" >ParamUserIdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestPasswordResetDto.html" data-type="entity-link" >RequestPasswordResetDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAppointmentDto.html" data-type="entity-link" >UpdateAppointmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateDocumentDto.html" data-type="entity-link" >UpdateDocumentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePaymentModeDto.html" data-type="entity-link" >UpdatePaymentModeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpDto.html" data-type="entity-link" >VerifyOtpDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CacheInterceptor.html" data-type="entity-link" >CacheInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExistsConstraint.html" data-type="entity-link" >ExistsConstraint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OptionalJwtAuthGuard.html" data-type="entity-link" >OptionalJwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UniqueConstraint.html" data-type="entity-link" >UniqueConstraint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WhatsAppService.html" data-type="entity-link" >WhatsAppService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AuthenticatedRequest.html" data-type="entity-link" >AuthenticatedRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheableOptions.html" data-type="entity-link" >CacheableOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheEvictOptions.html" data-type="entity-link" >CacheEvictOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileStorageService.html" data-type="entity-link" >FileStorageService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploadResult.html" data-type="entity-link" >FileUploadResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaymentProcessor.html" data-type="entity-link" >PaymentProcessor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SmsServiceInterface.html" data-type="entity-link" >SmsServiceInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});