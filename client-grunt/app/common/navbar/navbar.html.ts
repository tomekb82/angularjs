/* tslint:disable:max-line-length */
module navbar {
  export var html = '<nav class="navbar navbar-default" role="navigation">    <div class="container">        <div class="navbar-header">            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">                <span class="sr-only">Toggle navigation</span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>            </button>            <a class="navbar-brand" href="#/"><span translate="global.title">MyApp</span> <span class="navbar-version">v{{VERSION}}</span></a>        </div>        <div class="collapse navbar-collapse" id="navbar-collapse" ng-switch="isAuthenticated()">            <ul class="nav navbar-nav nav-pills navbar-right">                <li ui-sref-active="active">                    <a ui-sref="home">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.home">Home</span>                    </a>                </li>                <li ui-sref-active="active">                    <a ui-sref="photo">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.photos">Photos</span>                    </a>                </li>                <li ui-sref-active="active" ng-switch-when="true" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-th-list"></span>                                    <span class="hidden-tablet" translate="global.menu.entities.main">                                        Entities                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ><a ui-sref="photo"><span class="glyphicon glyphicon-asterisk"></span>                        &#xA0;<span translate="global.menu.entities.photo">photo</span></a></li>                        <!-- JHipster will add entities to the menu here -->                    </ul>                </li>                <li ng-class="{active: $state.includes(\'account\')}" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-user"></span>                                    <span class="hidden-tablet" translate="global.menu.account.main">                                        Account                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="settings"><span class="glyphicon glyphicon-wrench"></span>                            &#xA0;<span translate="global.menu.account.settings">Settings</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="password"><span class="glyphicon glyphicon-lock"></span>                            &#xA0;<span translate="global.menu.account.password">Password</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="sessions"><span class="glyphicon glyphicon-cloud"></span>                            &#xA0;<span translate="global.menu.account.sessions">Sessions</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a href="" ng-click="logout()"><span class="glyphicon glyphicon-log-out"></span>                            &#xA0;<span translate="global.menu.account.logout">Log out</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="login"><span class="glyphicon glyphicon-log-in"></span>                            &#xA0;<span translate="global.menu.account.login">Authenticate</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="register"><span class="glyphicon glyphicon-plus-sign"></span>                            &#xA0;<span translate="global.menu.account.register">Register</span></a></li>                    </ul>                </li>                <li ng-class="{active: $state.includes(\'admin\')}"  ng-switch-when="true" has-role="ROLE_ADMIN" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-tower"></span>                                    <span class="hidden-tablet" translate="global.menu.admin.main">Administration</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                       <!-- <li ui-sref-active="active"><a ui-sref="tracker"><span class="glyphicon glyphicon-eye-open"></span>                                &nbsp;<span translate="global.menu.admin.tracker">User tracker</span></a></li>-->                        <li ui-sref-active="active"><a ui-sref="metrics"><span class="glyphicon glyphicon-dashboard"></span>                            &#xA0;<span translate="global.menu.admin.metrics">Metrics</span></a></li>                        <li ui-sref-active="active"><a ui-sref="health"><span class="glyphicon glyphicon-heart"></span>                            &#xA0;<span translate="global.menu.admin.health">Health</span></a></li>                        <li ui-sref-active="active"><a ui-sref="configuration"><span class="glyphicon glyphicon-list-alt"></span>                            &#xA0;<span translate="global.menu.admin.configuration">Configuration</span></a></li>                        <li ui-sref-active="active"><a ui-sref="audits"><span class="glyphicon glyphicon-bell"></span>                            &#xA0;<span translate="global.menu.admin.audits">Audits</span></a></li>                        <li ui-sref-active="active"><a ui-sref="logs"><span class="glyphicon glyphicon-tasks"></span>                            &#xA0;<span translate="global.menu.admin.logs">Logs</span></a></li>                        <li ui-sref-active="active"><a ui-sref="docs"><span class="glyphicon glyphicon-book"></span>                            &#xA0;<span translate="global.menu.admin.apidocs">API</span></a></li>                    </ul>                </li>                <li ui-sref-active="active" class="dropdown pointer" ng-controller="LanguageController">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-flag"></span>                                    <span class="hidden-tablet" translate="global.menu.language">Language2</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li active-menu="{{language}}" ng-repeat="language in languages">                            <a href="" ng-click="changeLanguage(language)">{{language | findLanguageFromKey}}</a>                        </li>                    </ul>                </li>            </ul>        </div>    </div></nav>';
}
