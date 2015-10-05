var at_angular;
(function (at_angular) {
    'use strict';
    var directiveProperties = [
        'compile',
        'controller',
        'controllerAs',
        'bindToController',
        'link',
        'name',
        'priority',
        'replace',
        'require',
        'restrict',
        'scope',
        'template',
        'templateUrl',
        'terminal',
        'transclude'
    ];
    function instantiate(moduleName, name, mode) {
        return function (target) {
            angular.module(moduleName)[mode](name, target);
        };
    }
    function attachInjects(target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (target.$inject || []).forEach(function (item, index) {
            target.prototype[(item.charAt(0) === '$' ? '$' : '$$') + item] = args[index];
        });
        return target;
    }
    at_angular.attachInjects = attachInjects;
    function inject() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return function (target, key, index) {
            if (angular.isNumber(index)) {
                target.$inject = target.$inject || [];
                target.$inject[index] = args[0];
            }
            else {
                target.$inject = args;
            }
        };
    }
    at_angular.inject = inject;
    function service(moduleName, serviceName) {
        return instantiate(moduleName, serviceName, 'service');
    }
    at_angular.service = service;
    function controller(moduleName, ctrlName) {
        return instantiate(moduleName, ctrlName, 'controller');
    }
    at_angular.controller = controller;
    function directive(moduleName, directiveName) {
        return function (target) {
            var config;
            if (target.controller) {
                controller(moduleName, target.controller.split(' ').shift())(target);
            }
            config = directiveProperties.reduce(function (config, property) {
                return angular.isDefined(target[property]) ? angular.extend(config, (_a = {}, _a[property] = target[property], _a)) :
                    config;
                var _a;
            }, { controller: target, scope: Boolean(target.templateUrl) });
            angular.module(moduleName).directive(directiveName, function () { return (config); });
        };
    }
    at_angular.directive = directive;
    function classFactory(moduleName, className) {
        return function (target) {
            function factory() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return at_angular.attachInjects.apply(at_angular, [target].concat(args));
            }
            if (target.$inject && target.$inject.length > 0) {
                factory.$inject = target.$inject.slice(0);
            }
            angular.module(moduleName).factory(className, factory);
        };
    }
    at_angular.classFactory = classFactory;
})(at_angular || (at_angular = {}));
/// <reference path='../reference.ts' />
angular.module('controllers', [])
    .controller(Controllers);
/// <reference path='../reference.ts' />
var services = angular.module('services', []);
/// <reference path='../reference.ts' />
var directives = angular.module('directives', []);
/// <reference path='./reference.ts' />
angular.module('constants', [])
    .constant('ENV', 'dev')
    .constant('VERSION', '0.0.1-SNAPSHOT');
/// <reference path='../../reference.ts' />
angular.module('language', [])
    .controller('LanguageController', function ($scope, $translate, Language, tmhDynamicLocale) {
    $scope.changeLanguage = function (languageKey) {
        $translate.use(languageKey);
        console.log("lang=" + languageKey);
        tmhDynamicLocale.set(languageKey);
    };
    Language.getAll().then(function (languages) {
        $scope.languages = languages;
    });
})
    .filter('findLanguageFromKey', function () {
    return function (lang) {
        return {
            "ca": "Català",
            "da": "Dansk",
            "de": "Deutsch",
            "en": "English",
            "es": "Español",
            "fr": "Français",
            "hu": "Magyar",
            "it": "Italiano",
            "ja": "日本語",
            "kr": "한국어",
            "nl": "Nederlands",
            "pl": "Polski",
            "pt-br": "Português (Brasil)",
            "ro": "Română",
            "ru": "Русский",
            "sv": "Svenska",
            "tr": "Türkçe",
            "zh-cn": "中文（简体）",
            "zh-tw": "繁體中文"
        }[lang];
    };
});
/// <reference path='../../reference.ts' />
angular.module('language')
    .factory('Language', function ($q, $http, $translate, LANGUAGES) {
    return {
        getCurrent: function () {
            var deferred = $q.defer();
            var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            if (angular.isUndefined(language)) {
                language = 'en';
            }
            deferred.resolve(language);
            return deferred.promise;
        },
        getAll: function () {
            var deferred = $q.defer();
            deferred.resolve(LANGUAGES);
            return deferred.promise;
        }
    };
})
    .constant('LANGUAGES', [
    'en', 'pl', 'fr'
]);
/// <reference path='./reference.ts' />
angular.module('myApp', ['LocalStorageModule', 'tmh.dynamicLocale', 'pascalprecht.translate', 'ui.bootstrap', 'ngResource', 'ui.router', 'ngCookies',
    'ngCacheBuster', 'ngFileUpload', 'infinite-scroll',
    'controllers', 'services', 'directives', 'constants', 'language',
])
    .run(function ($rootScope, $location, $window, $http, $state, $translate, Language, ENV, VERSION, tmhDynamicLocale) {
    $rootScope.ENV = ENV;
    $rootScope.VERSION = VERSION;
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        Language.getCurrent().then(function (language) {
            $translate.use(language);
        });
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        var titleKey = 'global.title';
        $rootScope.previousStateName = fromState.name;
        $rootScope.previousStateParams = fromParams;
        if (toState.data.pageTitle) {
            titleKey = toState.data.pageTitle;
        }
        $translate(titleKey).then(function (title) {
            $window.document.title = title;
        });
    });
    $rootScope.back = function () {
        if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
            $state.go('home');
        }
        else {
            $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
        }
    };
})
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider) {
    $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('site', {
        'abstract': true,
        views: {
            'navbar@': {
                templateUrl: 'app/common/navbar/navbar.html',
                controller: 'NavbarController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
        }
    });
    $httpProvider.interceptors.push('errorHandlerInterceptor');
    $httpProvider.interceptors.push('notificationInterceptor');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{lang}/{part}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage();
    tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('AlertService', function ($timeout, $sce, $translate) {
    var exports = {
        factory: factory,
        add: addAlert,
        closeAlert: closeAlert,
        closeAlertByIndex: closeAlertByIndex,
        clear: clear,
        get: get,
        success: success,
        error: error,
        info: info,
        warning: warning
    }, alertId = 0, alerts = [], timeout = 5000;
    function clear() {
        alerts = [];
    }
    function get() {
        return alerts;
    }
    function success(msg, params) {
        this.add({
            type: "success",
            msg: msg,
            params: params,
            timeout: timeout
        });
    }
    function error(msg, params) {
        this.add({
            type: "danger",
            msg: msg,
            params: params,
            timeout: timeout
        });
    }
    function warning(msg, params) {
        this.add({
            type: "warning",
            msg: msg,
            params: params,
            timeout: timeout
        });
    }
    function info(msg, params) {
        this.add({
            type: "info",
            msg: msg,
            params: params,
            timeout: timeout
        });
    }
    function factory(alertOptions) {
        return alerts.push({
            type: alertOptions.type,
            msg: $sce.trustAsHtml(alertOptions.msg),
            id: alertOptions.alertId,
            timeout: alertOptions.timeout,
            close: function () {
                return exports.closeAlert(this);
            }
        });
    }
    function addAlert(alertOptions) {
        alertOptions.alertId = alertId++;
        alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
        var that = this;
        this.factory(alertOptions);
        if (alertOptions.timeout && alertOptions.timeout > 0) {
            $timeout(function () {
                that.closeAlert(alertOptions.alertId);
            }, alertOptions.timeout);
        }
    }
    function closeAlert(id) {
        return this.closeAlertByIndex(alerts.indexOf(id));
    }
    function closeAlertByIndex(index) {
        return alerts.splice(index, 1);
    }
    return exports;
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .directive('tbAlertToast', function (AlertService, $rootScope, $translate) {
    return {
        restrict: 'E',
        template: '<div class="alerts" ng-cloak="">' +
            '<alert ng-cloak="" ng-repeat="alert in alerts" type="{{alert.type}}" close="alert.close()"><pre>{{ alert.msg }}</pre></alert>' +
            '</div>',
        controller: ['$scope',
            function ($scope) {
                var addErrorAlert = function (message, key, data) {
                    AlertService.error(key, data);
                };
                var cleanHttpErrorListener = $rootScope.$on('myApp.httpError', function (event, httpResponse) {
                    var i;
                    switch (httpResponse.status) {
                        case 0:
                            addErrorAlert("", "Server not reachable", 'error.serverNotReachable');
                            break;
                        case 400:
                            if (httpResponse.data && httpResponse.data.fieldErrors) {
                                for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
                                    var fieldError = httpResponse.data.fieldErrors[i];
                                    var convertedField = fieldError.field.replace(/\[\d*\]/g, "[]");
                                    var fieldName = $translate.instant('error.fieldName.' + fieldError.objectName + '.' + convertedField);
                                    addErrorAlert(fieldError.field + ' should not be empty', 'error.' + fieldError.message, { fieldName: fieldName });
                                }
                            }
                            else if (httpResponse.data && httpResponse.data.message) {
                                addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
                            }
                            else {
                                addErrorAlert("", "", httpResponse.data);
                            }
                            break;
                        default:
                            if (httpResponse.data && httpResponse.data.message) {
                                addErrorAlert("", httpResponse.data.message, httpResponse.data);
                            }
                            else {
                            }
                    }
                });
                $scope.$on('$destroy', function () {
                });
            }
        ]
    };
});
var navbar;
(function (navbar) {
    navbar.html = '<nav class="navbar navbar-default" role="navigation">    <div class="container">        <div class="navbar-header">            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">                <span class="sr-only">Toggle navigation</span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>            </button>            <a class="navbar-brand" href="#/"><span translate="global.title">MyApp</span> <span class="navbar-version">v{{VERSION}}</span></a>        </div>        <div class="collapse navbar-collapse" id="navbar-collapse" ng-switch="isAuthenticated()">            <ul class="nav navbar-nav nav-pills navbar-right">                <li ui-sref-active="active">                    <a ui-sref="home">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.home">Home</span>                    </a>                </li>                <li ui-sref-active="active">                    <a ui-sref="photo">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.photos">Photos</span>                    </a>                </li>                <li ui-sref-active="active" ng-switch-when="true" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-th-list"></span>                                    <span class="hidden-tablet" translate="global.menu.entities.main">                                        Entities                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ><a ui-sref="photo"><span class="glyphicon glyphicon-asterisk"></span>                        &#xA0;<span translate="global.menu.entities.photo">photo</span></a></li>                        <!-- JHipster will add entities to the menu here -->                    </ul>                </li>                <li ng-class="{active: $state.includes(\'account\')}" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-user"></span>                                    <span class="hidden-tablet" translate="global.menu.account.main">                                        Account                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="settings"><span class="glyphicon glyphicon-wrench"></span>                            &#xA0;<span translate="global.menu.account.settings">Settings</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="password"><span class="glyphicon glyphicon-lock"></span>                            &#xA0;<span translate="global.menu.account.password">Password</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="sessions"><span class="glyphicon glyphicon-cloud"></span>                            &#xA0;<span translate="global.menu.account.sessions">Sessions</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a href="" ng-click="logout()"><span class="glyphicon glyphicon-log-out"></span>                            &#xA0;<span translate="global.menu.account.logout">Log out</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="login"><span class="glyphicon glyphicon-log-in"></span>                            &#xA0;<span translate="global.menu.account.login">Authenticate</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="register"><span class="glyphicon glyphicon-plus-sign"></span>                            &#xA0;<span translate="global.menu.account.register">Register</span></a></li>                    </ul>                </li>                <li ng-class="{active: $state.includes(\'admin\')}"  ng-switch-when="true" has-role="ROLE_ADMIN" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-tower"></span>                                    <span class="hidden-tablet" translate="global.menu.admin.main">Administration</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                       <!-- <li ui-sref-active="active"><a ui-sref="tracker"><span class="glyphicon glyphicon-eye-open"></span>                                &nbsp;<span translate="global.menu.admin.tracker">User tracker</span></a></li>-->                        <li ui-sref-active="active"><a ui-sref="metrics"><span class="glyphicon glyphicon-dashboard"></span>                            &#xA0;<span translate="global.menu.admin.metrics">Metrics</span></a></li>                        <li ui-sref-active="active"><a ui-sref="health"><span class="glyphicon glyphicon-heart"></span>                            &#xA0;<span translate="global.menu.admin.health">Health</span></a></li>                        <li ui-sref-active="active"><a ui-sref="configuration"><span class="glyphicon glyphicon-list-alt"></span>                            &#xA0;<span translate="global.menu.admin.configuration">Configuration</span></a></li>                        <li ui-sref-active="active"><a ui-sref="audits"><span class="glyphicon glyphicon-bell"></span>                            &#xA0;<span translate="global.menu.admin.audits">Audits</span></a></li>                        <li ui-sref-active="active"><a ui-sref="logs"><span class="glyphicon glyphicon-tasks"></span>                            &#xA0;<span translate="global.menu.admin.logs">Logs</span></a></li>                        <li ui-sref-active="active"><a ui-sref="docs"><span class="glyphicon glyphicon-book"></span>                            &#xA0;<span translate="global.menu.admin.apidocs">API</span></a></li>                    </ul>                </li>                <li ui-sref-active="active" class="dropdown pointer" ng-controller="LanguageController">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-flag"></span>                                    <span class="hidden-tablet" translate="global.menu.language">Language2</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li active-menu="{{language}}" ng-repeat="language in languages">                            <a href="" ng-click="changeLanguage(language)">{{language | findLanguageFromKey}}</a>                        </li>                    </ul>                </li>            </ul>        </div>    </div></nav>';
})(navbar || (navbar = {}));
var login;
(function (login) {
    login.html = '<div>    <div class="row">        <div class="col-md-4 col-md-offset-4">            <h1 translate="login.title">Authentication</h1>            <div class="alert alert-danger" ng-show="authenticationError" translate="login.messages.error.authentication">                <strong>Authentication failed!</strong> Please check your credentials and try again.            </div>            <form class="form" role="form" ng-submit="login($event)">                <div class="form-group">                    <label for="username" translate="global.form.username">Login</label>                    <input type="text" class="form-control" id="username" placeholder="{{\'global.form.username.placeholder\' | translate}}" ng-model="username">                </div>                <div class="form-group">                    <label for="password" translate="login.form.password">Password</label>                    <input type="password" class="form-control" id="password" placeholder="{{\'login.form.password.placeholder\' | translate}}"                           ng-model="password">                </div>                <div class="form-group">                    <label for="rememberMe">                        <input type="checkbox" id="rememberMe" ng-model="rememberMe" checked>                        <span translate="login.form.rememberme">Automatic Login</span>                    </label>                </div>                <button type="submit" class="btn btn-primary" translate="login.form.button">Authenticate</button>            </form>            <p></p>            <div class="alert alert-warning">                <a href="#/reset/request" translate="login.password.forgot">Did you forget your password?</a>            </div>            <div class="alert alert-warning" translate="global.messages.info.register">                You don\'t have an account yet? <a href="#/register">Register a new account</a>            </div>        </div>    </div></div>';
})(login || (login = {}));
var register;
(function (register) {
    register.html = '<div>    <div class="row">        <div class="col-md-8 col-md-offset-2">            <h1 translate="register.title">Registration</h1>            <div class="alert alert-success" ng-show="success" translate="register.messages.success">                <strong>Registration saved!</strong> Please check your email for confirmation.            </div>            <div class="alert alert-danger" ng-show="error" translate="register.messages.error.fail">                <strong>Registration failed!</strong> Please try again later.            </div>            <div class="alert alert-danger" ng-show="errorUserExists" translate="register.messages.error.userexists">                <strong>Login name already registered!</strong> Please choose another one.            </div>            <div class="alert alert-danger" ng-show="errorEmailExists" translate="register.messages.error.emailexists">                <strong>E-mail is already in use!</strong> Please choose another one.            </div>            <div class="alert alert-danger" ng-show="doNotMatch" translate="global.messages.error.dontmatch">                The password and its confirmation do not match!            </div>            <form ng-show="!success" name="form" role="form" novalidate ng-submit="register()" show-validation>                <div class="form-group">                    <label for="login" translate="global.form.username">Login</label>                    <input type="text" class="form-control" id="login" name="login" placeholder="{{\'global.form.username.placeholder\' | translate}}"                           ng-model="registerAccount.login" ng-minlength=1 ng-maxlength=50 ng-pattern="/^[a-z0-9]*$/" required>                    <div ng-show="form.login.$dirty && form.login.$invalid">                        <p class="help-block"                               ng-show="form.login.$error.required" translate="register.messages.validate.login.required">                            Your login is required.                        </p>                        <p class="help-block"                               ng-show="form.login.$error.minlength" translate="register.messages.validate.login.minlength">                            Your login is required to be at least 1 character.                        </p>                        <p class="help-block"                               ng-show="form.login.$error.maxlength" translate="register.messages.validate.login.maxlength">                            Your login cannot be longer than 50 characters.                        </p>                        <p class="help-block"                               ng-show="form.login.$error.pattern" translate="register.messages.validate.login.pattern">                            Your login can only contain lower-case letters and digits.                    </p>                    </div>                </div>                <div class="form-group">                    <label for="email" translate="global.form.email">E-mail</label>                    <input type="email" class="form-control" id="email" name="email" placeholder="{{\'global.form.email.placeholder\' | translate}}"                           ng-model="registerAccount.email" ng-minlength=5 ng-maxlength=100 required>                    <div ng-show="form.email.$dirty && form.email.$invalid">                        <p class="help-block"                               ng-show="form.email.$error.required" translate="global.messages.validate.email.required">                            Your e-mail is required.                        </p>                        <p class="help-block"                               ng-show="form.email.$error.email" translate="global.messages.validate.email.invalid">                            Your e-mail is invalid.                        </p>                        <p class="help-block"                               ng-show="form.email.$error.minlength" translate="global.messages.validate.email.minlength">                            Your e-mail is required to be at least 5 characters.                        </p>                        <p class="help-block"                               ng-show="form.email.$error.maxlength" translate="global.messages.validate.email.maxlength">                            Your e-mail cannot be longer than 100 characters.                        </p>                    </div>                </div>                <div class="form-group">                    <label for="password" translate="global.form.newpassword">New password</label>                    <input type="password" class="form-control" id="password" name="password" placeholder="{{\'global.form.newpassword.placeholder\' | translate}}"                           ng-model="registerAccount.password" ng-minlength=5 ng-maxlength=50 required>                    <div ng-show="form.password.$dirty && form.password.$invalid">                        <p class="help-block"                               ng-show="form.password.$error.required" translate="global.messages.validate.newpassword.required">                            Your password is required.                        </p>                        <p class="help-block"                               ng-show="form.password.$error.minlength" translate="global.messages.validate.newpassword.minlength">                            Your password is required to be at least 5 characters.                        </p>                        <p class="help-block"                               ng-show="form.password.$error.maxlength" translate="global.messages.validate.newpassword.maxlength">                            Your password cannot be longer than 50 characters.                        </p>                    </div>                    <password-strength-bar password-to-check="registerAccount.password"></password-strength-bar>                </div>                <div class="form-group">                    <label for="confirmPassword" translate="global.form.confirmpassword">New password confirmation</label>                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="{{\'global.form.confirmpassword.placeholder\' | translate}}"                           ng-model="confirmPassword" ng-minlength=5 ng-maxlength=50 required>                    <div ng-show="form.confirmPassword.$dirty && form.confirmPassword.$invalid">                        <p class="help-block"                               ng-show="form.confirmPassword.$error.required" translate="global.messages.validate.confirmpassword.required">                            Your confirmation password is required.                        </p>                        <p class="help-block"                               ng-show="form.confirmPassword.$error.minlength" translate="global.messages.validate.confirmpassword.minlength">                            Your confirmation password is required to be at least 5 characters.                        </p>                        <p class="help-block"                               ng-show="form.confirmPassword.$error.maxlength" translate="global.messages.validate.confirmpassword.maxlength">                            Your confirmation password cannot be longer than 50 characters.                        </p>                    </div>                </div>                <button type="submit" ng-disabled="form.$invalid" class="btn btn-primary" translate="register.form.button">Register</button>            </form>            <p></p>            <div class="alert alert-warning" translate="global.messages.info.authenticated">                If you want to <a href="#/login">authenticate</a>, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and password="user").            </div>        </div>    </div></div>';
})(register || (register = {}));
var audits;
(function (audits) {
    audits.html = '<div>    <h2 translate="audits.title">Audits</h2>    <div class="row">        <div class="col-md-5">            <h4 translate="audits.filter.title">Filter by date</h4>            <p class="input-group">                <span class="input-group-addon" translate="audits.filter.from">from</span>                <input type="date" class="input-sm form-control" name="start" ng-model="fromDate" ng-change="onChangeDate()" required/>                <span class="input-group-addon" translate="audits.filter.to">to</span>                <input type="date" class="input-sm form-control" name="end" ng-model="toDate" ng-change="onChangeDate()" required/>            </p>        </div>    </div>    <table class="table table-condensed table-striped table-bordered table-responsive">        <thead>        <tr>            <th ng-click="predicate = \'timestamp\'; reverse=!reverse"><span translate="audits.table.header.date">Date</span></th>            <th ng-click="predicate = \'principal\'; reverse=!reverse"><span translate="audits.table.header.principal">User</span></th>            <th ng-click="predicate = \'type\'; reverse=!reverse"><span translate="audits.table.header.status">State</span></th>            <th ng-click="predicate = \'data.message\'; reverse=!reverse"><span translate="audits.table.header.data">Extra data</span></th>        </tr>        </thead>        <tr ng-repeat="audit in audits | filter:filter | orderBy:predicate:reverse" ng-hide="audit.filtered">            <td><span>{{audit.timestamp| date:\'medium\'}}</span></td>            <td><small>{{audit.principal}}</small></td>            <td>{{audit.type}}</td>            <td>                <span ng-show="audit.data.message">{{audit.data.message}}</span>                <span ng-show="audit.data.remoteAddress"><span translate="audits.table.data.remoteAddress">Remote Address</span> {{audit.data.remoteAddress}}</span>            </td>        </tr>    </table></div>';
})(audits || (audits = {}));
var configuration;
(function (configuration) {
    configuration.html = '<div>    <h2 translate="configuration.title">configuration</h2>    <span translate="configuration.filter">Filter (by prefix)</span> <input type="text" ng-model="filter" class="form-control">    <table class="table table-condensed table-striped table-bordered table-responsive" style="table-layout:fixed">        <thead>        <tr>            <th ng-click="predicate = \'prefix\'; reverse=!reverse" class="col-sm-4"><span translate="configuration.table.prefix">Prefix</span></th>            <th translate="configuration.table.properties" class="col-sm-8">Properties</th>        </tr>        </thead>        <tr ng-repeat="entry in configuration | filter:filter | orderBy:predicate:reverse">            <td><span>{{entry.prefix}}</span></td>            <td>                <div class="row" ng-repeat="(key, value) in entry.properties">                    <div class="col-md-4">{{key}}</div>                    <div class="col-md-8"><span class="pull-right label label-info" style="white-space: normal;word-break:break-all">{{value}}</span></div>                </div>            </td>        </tr>    </table></div>';
})(configuration || (configuration = {}));
var docs;
(function (docs) {
    docs.html = '<iframe src="swagger-ui.html" frameborder="0" marginheight="0" marginwidth="0"        width="100%" height="900" scrolling="auto" target=\'_top\'></iframe>';
})(docs || (docs = {}));
var health;
(function (health) {
    health.html = '<div>    <h2 translate="health.title">Health Checks</h2>    <p>        <button type="button" class="btn btn-primary" ng-click="refresh()"><span class="glyphicon glyphicon-refresh"></span>&nbsp;<span translate="health.refresh.button">Refresh</span>        </button>    </p>    <table id="healthCheck" class="table table-striped">        <thead>            <tr>                <th class="col-md-7" translate="health.table.service">Service Name</th>                <th class="col-md-2 text-center" translate="health.table.status">Status</th>                <th class="col-md-2 text-center" translate="health.details.details">Details</th>            </tr>        </thead>        <tbody>            <tr ng-repeat="health in healthData">                <td>{{\'health.indicator.\' + baseName(health.name) | translate}} {{subSystemName(health.name)}}</td>                <td class="text-center">                    <span class="label" ng-class="getLabelClass(health.status)">                        {{\'health.status.\' + health.status | translate}}                    </span>                </td>                <td class="text-center">                    <a class="hand" ng-click="showHealth(health)" ng-show="health.details || health.error">                        <i class="glyphicon glyphicon-eye-open"></i>                    </a>                </td>            </tr>        </tbody>    </table></div>';
})(health || (health = {}));
var health;
(function (health) {
    var modal;
    (function (modal) {
        modal.html = '<div class="modal-header">    <button aria-label="Close" data-dismiss="modal" class="close" type="button" ng-click="cancel()"><span aria-hidden="true">&times;</span>    </button>    <h4 class="modal-title" id="showHealthLabel">		{{\'health.indicator.\' + baseName(currentHealth.name) | translate}}        {{subSystemName(currentHealth.name)}}    </h4></div><div class="modal-body pad">    <div ng-show="currentHealth.details">        <h4 translate="health.details.properties">Properties</h4>        <table class="table table-striped">            <thead>                <tr>                    <th class="col-md-6 text-left" translate="health.details.name">Name</th>                    <th class="col-md-6 text-left" translate="health.details.value">Value</th>                </tr>            </thead>            <tbody>                <tr ng-repeat="(k,v) in currentHealth.details">                    <td class="col-md-6 text-left">{{k}}</td>                    <td class="col-md-6 text-left">{{v}}</td>                </tr>            </tbody>        </table>    </div>    <div ng-show="currentHealth.error">        <h4 translate="health.details.error">Error</h4>            <pre>{{currentHealth.error}}</pre>    </div></div><div class="modal-footer">    <button data-dismiss="modal" class="btn btn-default pull-left" type="button" ng-click="cancel()">Done</button></div>';
    })(modal = health.modal || (health.modal = {}));
})(health || (health = {}));
var logs;
(function (logs) {
    logs.html = '<div>    <h2 translate="logs.title">Logs</h2>    <p translate="logs.nbloggers" translate-values="{total: \'{{ loggers.length }}\'}">There are {{ loggers.length }} loggers.</p>    <span translate="logs.filter">Filter</span> <input type="text" ng-model="filter" class="form-control">    <table class="table table-condensed table-striped table-bordered table-responsive">        <thead>        <tr title="click to order">            <th ng-click="predicate = \'name\'; reverse=!reverse"><span translate="logs.table.name">Name</span></th>            <th ng-click="predicate = \'level\'; reverse=!reverse"><span translate="logs.table.level">Level</span></th>        </tr>        </thead>        <tr ng-repeat="logger in loggers | filter:filter | orderBy:predicate:reverse">            <td><small>{{logger.name | characters:140}}</small></td>            <td>                <button ng-click="changeLevel(logger.name, \'TRACE\')" ng-class="(logger.level==\'TRACE\') ? \'btn-danger\' : \'btn-default\'" class="btn btn-default btn-xs">TRACE</button>                <button ng-click="changeLevel(logger.name, \'DEBUG\')" ng-class="(logger.level==\'DEBUG\') ? \'btn-warning\' : \'btn-default\'" class="btn btn-default btn-xs">DEBUG</button>                <button ng-click="changeLevel(logger.name, \'INFO\')" ng-class="(logger.level==\'INFO\') ? \'btn-info\' : \'btn-default\'" class="btn btn-default btn-xs">INFO</button>                <button ng-click="changeLevel(logger.name, \'WARN\')" ng-class="(logger.level==\'WARN\') ? \'btn-success\' : \'btn-default\'" class="btn btn-default btn-xs">WARN</button>                <button ng-click="changeLevel(logger.name, \'ERROR\')" ng-class="(logger.level==\'ERROR\') ? \'btn-primary\' : \'btn-default\'" class="btn btn-default btn-xs">ERROR</button>            </td>        </tr>    </table></div>';
})(logs || (logs = {}));
var metrics;
(function (metrics) {
    metrics.html = '<div><h2 translate="metrics.title">Application Metrics</h2><p>    <button type="button" class="btn btn-primary" ng-click="refresh()"><span class="glyphicon glyphicon-refresh"></span>&nbsp;<span translate="metrics.refresh.button">Refresh</span></button></p><h3 translate="metrics.jvm.title">JVM Metrics</h3><div class="row" ng-hide="updatingMetrics">    <div class="col-md-4">        <b translate="metrics.jvm.memory.title">Memory</b>        <p><span translate="metrics.jvm.memory.total">Total Memory</span> ({{metrics[\'jvm.memory.total.used\'] / 1000000 | number:0}}M / {{metrics[\'jvm.memory.total.max\'] / 1000000 | number:0}}M)</p>        <progressbar min="0" max="metrics[\'jvm.memory.total.max\']" value="metrics[\'jvm.memory.total.used\']" class="progress-striped active" type="success">            <span>{{metrics[\'jvm.memory.total.used\'] * 100 / metrics[\'jvm.memory.total.max\']  | number:0}}%</span>        </progressbar>        <p><span translate="metrics.jvm.memory.heap">Heap Memory</span> ({{metrics[\'jvm.memory.heap.used\'] / 1000000 | number:0}}M / {{metrics[\'jvm.memory.heap.max\'] / 1000000 | number:0}}M)</p>        <progressbar min="0" max="metrics[\'jvm.memory.heap.max\']" value="metrics[\'jvm.memory.heap.used\']" class="progress-striped active" type="success">            <span>{{metrics[\'jvm.memory.heap.used\'] * 100 / metrics[\'jvm.memory.heap.max\']  | number:0}}%</span>        </progressbar>        <p><span translate="metrics.jvm.memory.nonheap">Non-Heap Memory</span> ({{metrics[\'jvm.memory.non-heap.used\'] / 1000000 | number:0}}M / {{metrics[\'jvm.memory.non-heap.committed\'] / 1000000 | number:0}}M)</p>        <progressbar min="0" max="metrics[\'jvm.memory.non-heap.committed\']" value="metrics[\'jvm.memory.non-heap.used\']" class="progress-striped active" type="success">            <span>{{metrics[\'jvm.memory.non-heap.used\'] * 100 / metrics[\'jvm.memory.non-heap.committed\']  | number:0}}%</span>        </progressbar>    </div>    <div class="col-md-4">        <b translate="metrics.jvm.threads.title">Threads</b> (Total: {{metrics[\'jvm.threads.count\']}}) <a class="hand" ng-click="refreshThreadDumpData()" data-toggle="modal" data-target="#threadDump"><i class="glyphicon glyphicon-eye-open"></i></a>        <p><span translate="metrics.jvm.threads.runnable">Runnable</span> {{metrics[\'jvm.threads.runnable.count\']}}</p>        <progressbar min="0" value="metrics[\'jvm.threads.runnable.count\']" max="metrics[\'jvm.threads.count\']" class="progress-striped active" type="success">            <span>{{metrics[\'jvm.threads.runnable.count\'] * 100 / metrics[\'jvm.threads.count\']  | number:0}}%</span>        </progressbar>        <p><span translate="metrics.jvm.threads.timedwaiting">Timed Waiting</span> ({{metrics[\'jvm.threads.timed_waiting.count\']}})</p>        <progressbar min="0" value="metrics[\'jvm.threads.timed_waiting.count\']" max="metrics[\'jvm.threads.count\']" class="progress-striped active" type="warning">            <span>{{metrics[\'jvm.threads.timed_waiting.count\'] * 100 / metrics[\'jvm.threads.count\']  | number:0}}%</span>        </progressbar>        <p><span translate="metrics.jvm.threads.waiting">Waiting</span> ({{metrics[\'jvm.threads.waiting.count\']}})</p>        <progressbar min="0" value="metrics[\'jvm.threads.waiting.count\']" max="metrics[\'jvm.threads.count\']" class="progress-striped active" type="warning">            <span>{{metrics[\'jvm.threads.waiting.count\'] * 100 / metrics[\'jvm.threads.count\']  | number:0}}%</span>        </progressbar>        <p><span translate="metrics.jvm.threads.blocked">Blocked</span> ({{metrics[\'jvm.threads.blocked.count\']}})</p>        <progressbar min="0" value="metrics[\'jvm.threads.blocked.count\']" max="metrics[\'jvm.threads.count\']" class="progress-striped active" type="success">            <span>{{metrics[\'jvm.threads.blocked.count\'] * 100 / metrics[\'jvm.threads.count\']  | number:0}}%</span>        </progressbar>    </div>    <div class="col-md-4">        <b translate="metrics.jvm.gc.title">Garbage collections</b>        <div class="row">            <div class="col-md-9" translate="metrics.jvm.gc.marksweepcount">Mark Sweep count</div>            <div class="col-md-3 text-right">{{metrics[\'jvm.garbage.PS-MarkSweep.count\']}}</div>        </div>        <div class="row">            <div class="col-md-9" translate="metrics.jvm.gc.marksweeptime">Mark Sweep time</div>            <div class="col-md-3 text-right">{{metrics[\'jvm.garbage.PS-MarkSweep.time\']}}ms</div>        </div>        <div class="row">            <div class="col-md-9" translate="metrics.jvm.gc.scavengecount">Scavenge count</div>            <div class="col-md-3 text-right">{{metrics[\'jvm.garbage.PS-Scavenge.count\']}}</div>        </div>        <div class="row">            <div class="col-md-9" translate="metrics.jvm.gc.scavengetime">Scavenge time</div>            <div class="col-md-3 text-right">{{metrics[\'jvm.garbage.PS-Scavenge.time\']}}ms</div>        </div>    </div></div><div class="well well-lg" ng-show="updatingMetrics" translate="metrics.updating">Updating...</div><h3 translate="metrics.jvm.http.title">HTTP requests (events per second)</h3>    <p><span translate="metrics.jvm.http.active">Active requests</span> <b>{{metrics.counters[\'com.codahale.metrics.servlet.InstrumentedFilter.activeRequests\'].count | number:0}}</b> - <span translate="metrics.jvm.http.total">Total requests</span> <b>{{metrics.timers[\'com.codahale.metrics.servlet.InstrumentedFilter.requests\'].count | number:0}}</b></p><div class="table-responsive">    <table class="table table-striped">        <thead>        <tr>            <th translate="metrics.jvm.http.table.code">Code</th>            <th translate="metrics.jvm.http.table.count">Count</th>            <th class="text-right" translate="metrics.jvm.http.table.mean">Mean</th>            <th class="text-right"><span translate="metrics.jvm.http.table.average">Average</span> (1 min)</th>            <th class="text-right"><span translate="metrics.jvm.http.table.average">Average</span> (5 min)</th>            <th class="text-right"><span translate="metrics.jvm.http.table.average">Average</span> (15 min)</th>        </tr>        </thead>        <tbody>        <tr>            <td translate="metrics.jvm.http.code.ok">OK</td>            <td>                <progressbar min="0" max="metrics.timers[\'com.codahale.metrics.servlet.InstrumentedFilter.requests\'].count" value="metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].count" class="progress-striped active" type="success">                    <span>{{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].count}}</span>                </progressbar>            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].mean_rate | number:2}}            </td>            <td class="text-right">{{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].m1_rate | number:2}}            </td>            <td class="text-right">{{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].m5_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.ok\'].m15_rate | number:2}}            </td>        </tr>        <tr>            <td translate="metrics.jvm.http.code.notfound">Not Found</td>            <td>                <progressbar min="0" max="metrics.timers[\'com.codahale.metrics.servlet.InstrumentedFilter.requests\'].count" value="metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].count" class="progress-striped active" type="success">                    <span>{{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].count}}</span>                </progressbar>            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].mean_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].m1_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].m5_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.notFound\'].m15_rate | number:2}}            </td>        </tr>        <tr>            <td translate="metrics.jvm.http.code.servererror">Server error</td>            <td>                <progressbar min="0" max="metrics.timers[\'com.codahale.metrics.servlet.InstrumentedFilter.requests\'].count" value="metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].count" class="progress-striped active" type="success">                    <span>{{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].count}}</span>                </progressbar>            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].mean_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].m1_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].m5_rate | number:2}}            </td>            <td class="text-right">                {{metrics.meters[\'com.codahale.metrics.servlet.InstrumentedFilter.responseCodes.serverError\'].m15_rate | number:2}}            </td>        </tr>        </tbody>    </table></div><h3 translate="metrics.servicesstats.title">Services statistics (time in millisecond)</h3><div class="table-responsive">    <table class="table table-striped">        <thead>        <tr>            <th translate="metrics.servicesstats.table.name">Service name</th>            <th class="text-right" translate="metrics.servicesstats.table.count">Count</th>            <th class="text-right" translate="metrics.servicesstats.table.mean">Mean</th>            <th class="text-right" translate="metrics.servicesstats.table.min">Min</th>            <th class="text-right" translate="metrics.servicesstats.table.p50">p50</th>            <th class="text-right" translate="metrics.servicesstats.table.p75">p75</th>            <th class="text-right" translate="metrics.servicesstats.table.p95">p95</th>            <th class="text-right" translate="metrics.servicesstats.table.p99">p99</th>            <th class="text-right" translate="metrics.servicesstats.table.max">Max</th>        </tr>        </thead>        <tbody>        <tr ng-repeat="(k, v) in servicesStats">            <td>{{k}}</td>            <td class="text-right">{{v.count}}</td>            <td class="text-right">{{v.meanRate * 1000 | number:0}}</td>            <td class="text-right">{{v.min * 1000 | number:0}}</td>            <td class="text-right">{{v.p50 * 1000 | number:0}}</td>            <td class="text-right">{{v.p75thPercentile75 * 1000 | number:0}}</td>            <td class="text-right">{{v.95thPercentile * 1000 | number:0}}</td>            <td class="text-right">{{v.99thPercentile * 1000 | number:0}}</td>            <td class="text-right">{{v.max * 1000 | number:0}}</td>        </tr>        </tbody>    </table></div><h3 translate="metrics.datasource.title" ng-show="metrics[\'HikariPool-0.pool.TotalConnections\'] > 0">DataSource statistics (time in millisecond)</h3><div class="table-responsive" ng-show="metrics[\'HikariPool-0.pool.TotalConnections\'] > 0">    <table class="table table-striped">        <thead>            <tr>                <th><span translate="metrics.datasource.usage">Usage</span> ({{metrics[\'HikariPool-0.pool.ActiveConnections\']}} / {{metrics[\'HikariPool-0.pool.TotalConnections\']}})</th>                <th class="text-right" translate="metrics.datasource.count">Count</th>                <th class="text-right" translate="metrics.datasource.mean">Mean</th>                <th class="text-right" translate="metrics.datasource.min">Min</th>                <th class="text-right" translate="metrics.datasource.p50">p50</th>                <th class="text-right" translate="metrics.datasource.p75">p75</th>                <th class="text-right" translate="metrics.datasource.p95">p95</th>                <th class="text-right" translate="metrics.datasource.p99">p99</th>                <th class="text-right" translate="metrics.datasource.max">Max</th>            </tr>        </thead>        <tbody>            <tr>                <td>                    <div class="progress progress-striped">                        <progressbar min="0" max="metrics[\'HikariPool-0.pool.TotalConnections\']" value="metrics[\'HikariPool-0.pool.ActiveConnections\']" class="progress-striped active" type="success">                            <span>{{metrics[\'HikariPool-0.pool.ActiveConnections\'] * 100 / metrics[\'HikariPool-0.pool.TotalConnections\']  | number:0}}%</span>                        </progressbar>                    </div>                </td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].count}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].mean | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].min | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].p50 | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].p75 | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].p95 | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].p99 | number:2}}</td>                <td class="text-right">{{metrics.histograms[\'HikariPool-0.pool.Usage\'].max | number:2}}</td>            </tr>        </tbody>    </table></div></div>';
})(metrics || (metrics = {}));
var metrics;
(function (metrics) {
    var modal;
    (function (modal) {
        modal.html = '<!-- Modal used to display the threads dump --><div class="modal-header">    <button type="button" class="close" ng-click="cancel()">&times;</button>    <h4 class="modal-title" translate="metrics.jvm.threads.dump.title">Threads dump</h4></div><div class="modal-body pad">    <span class="label label-primary" ng-click="threadDumpFilter = {}">All&nbsp;<span class="badge">{{threadDumpAll}}</span></span>&nbsp;    <span class="label label-success" ng-click="threadDumpFilter = {threadState: \'RUNNABLE\'}">Runnable&nbsp;<span class="badge">{{threadDumpRunnable}}</span></span>&nbsp;    <span class="label label-info" ng-click="threadDumpFilter = {threadState: \'WAITING\'}">Waiting&nbsp;<span class="badge">{{threadDumpWaiting}}</span></span>&nbsp;    <span class="label label-warning" ng-click="threadDumpFilter = {threadState: \'TIMED_WAITING\'}">Timed Waiting&nbsp;<span class="badge">{{threadDumpTimedWaiting}}</span></span>&nbsp;    <span class="label label-danger" ng-click="threadDumpFilter = {threadState: \'BLOCKED\'}">Blocked&nbsp;<span class="badge">{{threadDumpBlocked}}</span></span>&nbsp;    <div class="voffset2">&nbsp;</div>    Filter    <input type="text" ng-model="threadDumpFilter" class="form-control">    <div class="row pad" ng-repeat="(k, v) in threadDump | filter:threadDumpFilter">        <h5><span class="label" ng-class="getLabelClass(v.threadState)">{{v.threadState}}</span>&nbsp;{{v.threadName}} (ID {{v.threadId}})             <a ng-click="show = !show">               <span ng-show="!show" translate="metrics.jvm.threads.dump.show">Show StackTrace</span>               <span ng-show="show" translate="metrics.jvm.threads.dump.hide">Hide StackTrace</span>            </a>        </h5>        <div class="well" ng-show="show">            <div ng-repeat="(stK, stV) in v.stackTrace">                {{stV.className}}.{{stV.methodName}}({{stV.fileName}}:{{stV.lineNumber}})                <span class="voffset1"></span>            </div>        </div>        <table class="table table-condensed">            <thead>                <tr>                    <th class="text-right" translate="metrics.jvm.threads.dump.blockedtime">Blocked Time</th>                    <th class="text-right" translate="metrics.jvm.threads.dump.blockedcount">Blocked Count</th>                    <th class="text-right" translate="metrics.jvm.threads.dump.waitedtime">Waited Time</th>                    <th class="text-right" translate="metrics.jvm.threads.dump.waitedcount">Waited Count</th>                    <th translate="metrics.jvm.threads.dump.lockname">Lock Name</th>                </tr>            </thead>            <tbody>                <tr>                    <td>{{v.blockedTime}}</td>                    <td>{{v.blockedCount}}</td>                    <td>{{v.waitedTime}}</td>                    <td>{{v.waitedCount}}</td>                    <td>{{v.lockName}}</td>                </tr>            </tbody>        </table>    </div></div><div class="modal-footer">    <button type="button" class="btn btn-default  pull-left" data-dismiss="modal" ng-click="cancel()">Done</button></div>';
    })(modal = metrics.modal || (metrics.modal = {}));
})(metrics || (metrics = {}));
var photo_detail;
(function (photo_detail) {
    photo_detail.html = '<div>    {{photo.name}}    {{photo.type}}    {{photo.description}}</div>';
})(photo_detail || (photo_detail = {}));
var photo_dialog;
(function (photo_dialog) {
    photo_dialog.html = '<form name="editForm" role="form" novalidate ng-submit="save()">    <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"                ng-click="clear()">&times;</button>        <h4 class="modal-title" id="myPhotoLabel" translate="myApp.photo.home.createOrEditLabel">Create or edit a Photo</h4>    </div>    <div class="modal-body">        <div class="form-group">            <label for="id" translate="global.field.id">ID</label>            <input type="text" class="form-control" id="id" name="id"                    ng-model="photo.id" readonly>        </div>        <div class="form-group">            <label translate="myApp.photo.name" for="field_name">Name</label>            <input type="text" class="form-control" name="name" id="field_name"                    ng-model="photo.name">        </div>        <div class="form-group">            <label translate="myApp.photo.type" for="field_type">Type</label>            <input type="text" class="form-control" name="type" id="field_type"                    ng-model="photo.type">        </div>	<div class="form-group">            <label translate="myApp.photo.description" for="field_description">Description</label>            <input type="text" class="form-control" name="description" id="field_description"                    ng-model="photo.description">        </div>    </div>    <div class="modal-footer">        <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="clear()">            <span class="glyphicon glyphicon-ban-circle"></span>&nbsp;<span translate="entity.action.cancel">Cancel</span>        </button>        <button type="submit" ng-disabled="editForm.$invalid || editForm.$submitted" class="btn btn-primary">            <span class="glyphicon glyphicon-save"></span>&nbsp;<span translate="entity.action.save">Save</span>        </button>    </div></form>';
})(photo_dialog || (photo_dialog = {}));
var photos;
(function (photos) {
    photos.html = '<div>    <h2 translate="myApp.photo.home.title">Photos</h2>    <div class="container">        <div class="row">            <div class="col-md-4">                <button class="btn btn-primary" ui-sref="photo.new">                    <span class="glyphicon glyphicon-flash"></span> <span translate="myApp.photo.home.createLabel">Create a new Photo</span>                </button>            </div>        </div>    </div>    <div class="modal fade" id="deletePhotoConfirmation">        <div class="modal-dialog">            <div class="modal-content">                <form name="deleteForm" ng-submit="confirmDelete(photo.id)">                    <div class="modal-header">                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"                                ng-click="clear()">&times;</button>                        <h4 class="modal-title" translate="entity.delete.title">Confirm delete operation</h4>                    </div>                    <div class="modal-body">                        <p translate="myApp.photo.delete.question" translate-values="{id: \'{{photo.id}}\'}">Are you sure you want to delete this Photo?</p>                    </div>                    <div class="modal-footer">                        <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="clear()">                            <span class="glyphicon glyphicon-ban-circle"></span>&nbsp;<span translate="entity.action.cancel">Cancel</span>                        </button>                        <button type="submit" ng-disabled="deleteForm.$invalid" class="btn btn-danger">                            <span class="glyphicon glyphicon-remove-circle"></span>&nbsp;<span translate="entity.action.delete">Delete</span>                        </button>                    </div>                </form>            </div>        </div>    </div>    <div class="table-responsive">        <table class="table table-striped">            <thead>                <tr>                    <th translate="global.field.id">ID</th>                    <th translate="myApp.photo.name">Name</th>	            <th translate="myApp.photo.type">Type</th>                    <th translate="myApp.photo.description">Description</th>                    <th></th>                </tr>            </thead>            <tbody>                <tr ng-repeat="photo in photos">                    <td>{{photo.id}}</td>                    <td>{{photo.name}}</td>		    <td>{{photo.type}}</td>                    <td>{{photo.description}}</td>                    <td>                        <button type="submit"                                ui-sref="photo.detail({id:photo.id})"                                class="btn btn-info btn-sm">                            <span class="glyphicon glyphicon-eye-open"></span>&nbsp;<span translate="entity.action.view"> View</span>                        </button>                        <button type="submit"                                ui-sref="photo.edit({id:photo.id})"                                class="btn btn-primary btn-sm">                            <span class="glyphicon glyphicon-pencil"></span>&nbsp;<span translate="entity.action.edit"> Edit</span>                        </button>                        <button type="submit"                                ng-click="delete(photo.id)"                                class="btn btn-danger btn-sm">                            <span class="glyphicon glyphicon-remove-circle"></span>&nbsp;<span translate="entity.action.delete"> Delete</span>                        </button>                    </td>                </tr>            </tbody>        </table>    </div></div>';
})(photos || (photos = {}));
var accessdenied;
(function (accessdenied) {
    accessdenied.html = '<div ng-cloak>    <div class="row">        <div class="col-md-4">            <span class="hipster img-responsive img-rounded"></span>        </div>        <div class="col-md-8">            <h1 translate="error.title">Error Page!</h1>            <div class="alert alert-danger" translate="error.403">You are not authorized to access the page.            </div>        </div>    </div></div>';
})(accessdenied || (accessdenied = {}));
var error;
(function (error) {
    error.html = '<div ng-cloak>    <div class="row">        <div class="col-md-4">            <span class="hipster img-responsive img-rounded"></span>        </div>        <div class="col-md-8">            <h1 translate="error.title">Error Page!</h1>            <div ng-show="errorMessage">                <div class="alert alert-danger">{{errorMessage}}                </div>            </div>        </div>    </div></div>';
})(error || (error = {}));
var main;
(function (main) {
    main.html = '<div ng-cloak>    <div class="row">        <div class="col-md-4">            <span class="hipster img-responsive img-rounded"></span>        </div>        <div class="col-md-8">            <h1>Welcome, My App!</h1>	    <!--<h1 translate="main.title">Welcome, My App!</h1>-->            <!--<p class="lead" translate="main.subtitle">This is your homepage</p>            <div ng-switch="isAuthenticated()">                <div class="alert alert-success" ng-switch-when="true" translate="main.logged.message" translate-values="{username: \'{{account.login}}\'}">                    You are logged in as user "{{account.login}}".                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.authenticated">                    If you want to <a href="#/login">authenticate</a>, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and password="user").                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.register">                    You don\'t have an account yet? <a href="#/register">Register a new account</a>                </div>            </div>            <p translate="main.question">                If you have any question on JHipster 2:            </p>            <ul>                <li><a href="http://jhipster.github.io/" target="_blank" translate="main.link.homepage">JHipster homepage</a></li>                <li><a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" translate="main.link.stackoverflow">JHipster on Stack Overflow</a></li>                <li><a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" translate="main.link.bugtracker">JHipster bug tracker</a></li>                <li><a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" translate="main.link.chat">JHipster public chat room</a></li>                <li><a href="https://twitter.com/java_hipster" target="_blank"  translate="main.link.contact">contact @java_hipster on Twitter</a></li>            </ul>            <p>             <span translate="main.like">If you like JHipster, don\'t forget to give us a star on </span>&nbsp;<a href="https://github.com/jhipster/generator-jhipster" target="_blank" translate="main.github">Github</a>!            </p>-->	        </div>    </div></div>';
})(main || (main = {}));
'use strict';
angular.module('myApp')
    .factory('AuditsService', function ($http) {
    return {
        findAll: function () {
            return $http.get('api/audits/all').then(function (response) {
                return response.data;
            });
        },
        findByDates: function (fromDate, toDate) {
            var formatDate = function (dateToFormat) {
                if (dateToFormat !== undefined && !angular.isString(dateToFormat)) {
                    return dateToFormat.getYear() + '-' + dateToFormat.getMonth() + '-' + dateToFormat.getDay();
                }
                return dateToFormat;
            };
            return $http.get('api/audits/byDates', { params: { fromDate: formatDate(fromDate), toDate: formatDate(toDate) } }).then(function (response) {
                return response.data;
            });
        }
    };
});
'use strict';
angular.module('myApp')
    .factory('ConfigurationService', function ($rootScope, $filter, $http) {
    return {
        get: function () {
            return $http.get('configprops').then(function (response) {
                var properties = [];
                angular.forEach(response.data, function (data) {
                    properties.push(data);
                });
                var orderBy = $filter('orderBy');
                return orderBy(properties, 'prefix');
            });
        }
    };
});
'use strict';
angular.module('myApp')
    .factory('LogsService', function ($resource) {
    return $resource('api/logs', {}, {
        'findAll': { method: 'GET', isArray: true },
        'changeLevel': { method: 'PUT' }
    });
});
'use strict';
angular.module('myApp')
    .factory('MonitoringService', function ($rootScope, $http) {
    return {
        getMetrics: function () {
            return $http.get('metrics').then(function (response) {
                return response.data;
            });
        },
        checkHealth: function () {
            return $http.get('health').then(function (response) {
                return response.data;
            });
        },
        threadDump: function () {
            return $http.get('dump').then(function (response) {
                return response.data;
            });
        }
    };
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('Auth', function Auth($rootScope, $state, $q, $translate, Principal, AuthServerProvider, Account, Register, Activate, Password, PasswordResetInit, PasswordResetFinish) {
    return {
        login: function (credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();
            AuthServerProvider.login(credentials).then(function (data) {
                Principal.identity(true).then(function (account) {
                    $translate.use(account.langKey);
                    $translate.refresh();
                    deferred.resolve(data);
                });
                return cb();
            }).catch(function (err) {
                this.logout();
                deferred.reject(err);
                return cb(err);
            }.bind(this));
            return deferred.promise;
        },
        logout: function () {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        },
        authorize: function (force) {
            return Principal.identity(force)
                .then(function () {
                var isAuthenticated = Principal.isAuthenticated();
                if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                    if (isAuthenticated) {
                        $state.go('accessdenied');
                    }
                    else {
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;
                        $state.go('login');
                    }
                }
            });
        },
        createAccount: function (account, callback) {
            var cb = callback || angular.noop;
            return Register.save(account, function () {
                return cb(account);
            }, function (err) {
                this.logout();
                return cb(err);
            }.bind(this)).$promise;
        },
        updateAccount: function (account, callback) {
            var cb = callback || angular.noop;
            return Account.save(account, function () {
                return cb(account);
            }, function (err) {
                return cb(err);
            }.bind(this)).$promise;
        },
        activateAccount: function (key, callback) {
            var cb = callback || angular.noop;
            return Activate.get(key, function (response) {
                return cb(response);
            }, function (err) {
                return cb(err);
            }.bind(this)).$promise;
        },
        changePassword: function (newPassword, callback) {
            var cb = callback || angular.noop;
            return Password.save(newPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        },
        resetPasswordInit: function (mail, callback) {
            var cb = callback || angular.noop;
            return PasswordResetInit.save(mail, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        },
        resetPasswordFinish: function (key, newPassword, callback) {
            var cb = callback || angular.noop;
            return PasswordResetFinish.save(key, newPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }
    };
});
/// <reference path='../../reference.ts' />
directives
    .directive('hasAnyRole', ['Principal', function (Principal) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setVisible = function () {
                    element.removeClass('hidden');
                }, setHidden = function () {
                    element.addClass('hidden');
                }, defineVisibility = function (reset) {
                    var result;
                    if (reset) {
                        setVisible();
                    }
                    result = Principal.isInAnyRole(roles);
                    if (result) {
                        setVisible();
                    }
                    else {
                        setHidden();
                    }
                }, roles = attrs.hasAnyRole.replace(/\s+/g, '').split(',');
                if (roles.length > 0) {
                    defineVisibility(true);
                }
            }
        };
    }])
    .directive('hasRole', ['Principal', function (Principal) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setVisible = function () {
                    element.removeClass('hidden');
                }, setHidden = function () {
                    element.addClass('hidden');
                }, defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }
                    console.log('hasRole');
                    Principal.isInRole(role)
                        .then(function (result) {
                        if (result) {
                            setVisible();
                        }
                        else {
                            setHidden();
                        }
                    });
                }, role = attrs.hasRole.replace(/\s+/g, '');
                if (role.length > 0) {
                    defineVisibility(true);
                }
            }
        };
    }]);
'use strict';
angular.module('myApp')
    .factory('Principal', function Principal($q, Account) {
    var _identity, _authenticated = false;
    return {
        isIdentityResolved: function () {
            return angular.isDefined(_identity);
        },
        isAuthenticated: function () {
            return _authenticated;
        },
        isInRole: function (role) {
            return this.identity().then(function (_id) {
                return _id.roles && _id.roles.indexOf(role) !== -1;
            }, function (err) {
                return false;
            });
        },
        isInAnyRole: function (roles) {
            if (!_authenticated || !_identity || !_identity.roles) {
                return false;
            }
            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) {
                    return true;
                }
            }
            return false;
        },
        authenticate: function (identity) {
            _identity = identity;
            _authenticated = identity !== null;
        },
        identity: function (force) {
            var deferred = $q.defer();
            if (force === true) {
                _identity = undefined;
            }
            console.log('Principal: identity()');
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);
                return deferred.promise;
            }
            console.log('Principal: identity() 2');
            Account.get().$promise
                .then(function (account) {
                _identity = account.data;
                _authenticated = true;
                console.log('Principal: identity() 3 ');
                deferred.resolve(_identity);
            })
                .catch(function () {
                console.log('Principal: identity() 4');
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            });
            return deferred.promise;
        }
    };
});
'use strict';
angular.module('myApp')
    .factory('AuthServerProvider', function loginService($http, localStorageService, $window) {
    return {
        login: function (credentials) {
            var data = 'j_username=' + encodeURIComponent(credentials.username) +
                '&j_password=' + encodeURIComponent(credentials.password) +
                '&remember-me=' + credentials.rememberMe + '&submit=Login';
            console.log('AuthServerProvider: login() success');
            return $http.post('api/authentication', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (response) {
                console.log('AuthServerProvider: login() success');
                return response;
            });
        },
        logout: function () {
            $http.post('api/logout').success(function (response) {
                localStorageService.clearAll();
                $http.get('api/account');
                return response;
            });
        },
        getToken: function () {
            var token = localStorageService.get('token');
            return token;
        },
        hasValidToken: function () {
            var token = this.getToken();
            return !!token;
        }
    };
});
/// <reference path='../../../reference.ts' />
angular.module('myApp')
    .factory('Account', function Account($resource) {
    return $resource('api/account', {}, {
        'get': { method: 'GET', params: {}, isArray: false,
            interceptor: {
                response: function (response) {
                    return response;
                }
            }
        }
    });
});
'use strict';
angular.module('myApp')
    .factory('Activate', function ($resource) {
    return $resource('api/activate', {}, {
        'get': { method: 'GET', params: {}, isArray: false }
    });
});
'use strict';
angular.module('myApp')
    .factory('Password', function ($resource) {
    return $resource('api/account/change_password', {}, {});
});
angular.module('myApp')
    .factory('PasswordResetInit', function ($resource) {
    return $resource('api/account/reset_password/init', {}, {});
});
angular.module('myApp')
    .factory('PasswordResetFinish', function ($resource) {
    return $resource('api/account/reset_password/finish', {}, {});
});
'use strict';
angular.module('myApp')
    .factory('Register', function ($resource) {
    return $resource('api/register', {}, {});
});
'use strict';
angular.module('myApp')
    .factory('Photo', function ($resource, DateUtils) {
    return $resource('api/photos/:id', {}, {
        'query': { method: 'GET', isArray: true },
        'get': {
            method: 'GET',
            transformResponse: function (data) {
                data = angular.fromJson(data);
                return data;
            }
        },
        'update': { method: 'PUT' }
    });
})
    .factory('Description', function ($resource) {
    return $resource('api/photos/description/:filename', {}, {
        'query': { method: 'GET', isArray: true },
        'get': {
            method: 'GET',
            transformResponse: function (data) {
                console.log("ff=" + data);
                data = angular.fromJson(data);
                return data;
            }
        },
        'update': { method: 'PUT' }
    });
});
'use strict';
angular.module('myApp')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService) {
    return {
        responseError: function (response) {
            console.log('authExpiredInterceptor');
            if (response.status == 401 && response.data.path !== undefined && response.data.path.indexOf("/api/account") == -1) {
                var Auth = $injector.get('Auth');
                var $state = $injector.get('$state');
                var to = $rootScope.toState;
                var params = $rootScope.toStateParams;
                Auth.logout();
                $rootScope.returnToState = to;
                $rootScope.returnToStateParams = params;
                $state.go('login');
            }
            return $q.reject(response);
        }
    };
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
    return {
        'responseError': function (response) {
            console.log('errorHandlerInterceptor');
            if (!(response.status == 401 && response.data.path.indexOf("/api/account") == 0)) {
                $rootScope.$emit('myApp.httpError', response);
            }
            return $q.reject(response);
        }
    };
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
    return {
        response: function (response) {
            console.log('notificationInterceptor');
            var alertKey = response.headers('X-myApp-alert');
            if (angular.isString(alertKey)) {
                AlertService.success(alertKey, { param: response.headers('X-myApp-params') });
            }
            return response;
        },
    };
});
'use strict';
angular.module('myApp')
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal) {
    $scope.isAuthenticated = Principal.isAuthenticated;
    $scope.$state = $state;
    $scope.logout = function () {
        Auth.logout();
        $state.go('home');
    };
});
'use strict';
angular.module('myApp')
    .factory('User', function ($resource) {
    return $resource('api/users/:login', {}, {
        'query': { method: 'GET', isArray: true },
        'get': {
            method: 'GET',
            transformResponse: function (data) {
                data = angular.fromJson(data);
                return data;
            }
        }
    });
});
'use strict';
angular.module('myApp')
    .service('DateUtils', function () {
    this.convertLocaleDateToServer = function (date) {
        if (date) {
            var utcDate = new Date();
            utcDate.setUTCDate(date.getDate());
            utcDate.setUTCMonth(date.getMonth());
            utcDate.setUTCFullYear(date.getFullYear());
            return utcDate;
        }
        else {
            return null;
        }
    };
    this.convertLocaleDateFromServer = function (date) {
        if (date) {
            var dateString = date.split("-");
            return new Date(dateString[0], dateString[1] - 1, dateString[2]);
        }
        return null;
    };
    this.convertDateTimeFromServer = function (date) {
        if (date) {
            return new Date(date);
        }
        else {
            return null;
        }
    };
});
'use strict';
angular.module('myApp')
    .filter('characters', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) {
            return input;
        }
        if (chars <= 0) {
            return '';
        }
        if (input && input.length > chars) {
            input = input.substring(0, chars);
            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            }
            else {
                while (input.charAt(input.length - 1) === ' ') {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input + '...';
        }
        return input;
    };
})
    .filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '...';
            }
        }
        return input;
    };
});
var Controllers;
(function (Controllers) {
    var MainController = (function () {
        function MainController($scope, logService) {
            this.message = "asdasd";
            $scope.vm = this;
            logService.log("Message from MainController=" + $scope.vm.message);
        }
        return MainController;
    })();
    Controllers.MainController = MainController;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    var TestController = (function () {
        function TestController() {
            this.vm = this;
            this.message = "foo";
        }
        return TestController;
    })();
    Controllers.TestController = TestController;
})(Controllers || (Controllers = {}));
/// <reference path='../../reference.ts' />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var annotations;
(function (annotations) {
    annotations.controller = at_angular.controller;
    var AnnotationController = (function () {
        function AnnotationController($scope, logService) {
            this.message = "aaaaaa";
            $scope.vm = this;
            logService.log("Message from AnnotationController=" + $scope.vm.message);
        }
        AnnotationController = __decorate([
            annotations.controller('controllers', 'AnnotationController'), 
            __metadata('design:paramtypes', [Object, LogService])
        ], AnnotationController);
        return AnnotationController;
    })();
    annotations.AnnotationController = AnnotationController;
    ;
})(annotations || (annotations = {}));
/// <reference path='../reference.ts' />
var app = angular.module('jaas', []);
app.controller('MainCtrl', function ($scope, someService) {
    $scope.foo = 'foo';
    $scope.bar = 'bar';
    $scope.test1 = function () {
        $scope.foo = $scope.foo + '!!!';
    };
    $scope.$watch('bar', function (v) {
        $scope.baz = v + 'baz';
    });
    $scope.test2 = function () {
        someService.someAsyncCall($scope.foo)
            .then(function (data) {
            $scope.fizz = data;
        });
    };
});
app.factory('someService', function ($timeout, $q) {
    return {
        someAsyncCall: function (x) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(x + '_async');
            }, 100);
            return deferred.promise;
        }
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('account', {
        abstract: true,
        parent: 'site'
    });
});
'use strict';
angular.module('myApp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth) {
    $scope.user = {};
    $scope.errors = {};
    $scope.rememberMe = true;
    $timeout(function () { angular.element('[ng-model="username"]').focus(); });
    $scope.login = function (event) {
        event.preventDefault();
        Auth.login({
            username: $scope.username,
            password: $scope.password,
            rememberMe: $scope.rememberMe
        }).then(function () {
            $scope.authenticationError = false;
            if ($rootScope.previousStateName === 'register') {
                $state.go('home');
            }
            else {
                $rootScope.back();
            }
        }).catch(function () {
            $scope.authenticationError = true;
        });
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('login', {
        parent: 'account',
        url: '/login',
        data: {
            roles: [],
            pageTitle: 'login.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/account/login/login.html',
                controller: 'LoginController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('login');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('LogoutController', function (Auth) {
    Auth.logout();
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('logout', {
        parent: 'account',
        url: '/logout',
        data: {
            roles: []
        },
        views: {
            'content@': {
                templateUrl: 'app/core/main/main.html',
                controller: 'LogoutController'
            }
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('RegisterController', function ($scope, $translate, $timeout, Auth) {
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.errorUserExists = null;
    $scope.registerAccount = {};
    $timeout(function () { angular.element('[ng-model="registerAccount.login"]').focus(); });
    $scope.register = function () {
        if ($scope.registerAccount.password !== $scope.confirmPassword) {
            $scope.doNotMatch = 'ERROR';
        }
        else {
            $scope.registerAccount.langKey = $translate.use();
            $scope.doNotMatch = null;
            $scope.error = null;
            $scope.errorUserExists = null;
            $scope.errorEmailExists = null;
            Auth.createAccount($scope.registerAccount).then(function () {
                $scope.success = 'OK';
            }).catch(function (response) {
                $scope.success = null;
                if (response.status === 400 && response.data === 'login already in use') {
                    $scope.errorUserExists = 'ERROR';
                }
                else if (response.status === 400 && response.data === 'e-mail address already in use') {
                    $scope.errorEmailExists = 'ERROR';
                }
                else {
                    $scope.error = 'ERROR';
                }
            });
        }
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('register', {
        parent: 'account',
        url: '/register',
        data: {
            roles: [],
            pageTitle: 'register.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/account/register/register.html',
                controller: 'RegisterController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('register');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('admin', {
        abstract: true,
        parent: 'site'
    });
});
'use strict';
angular.module('myApp')
    .controller('AuditsController', function ($scope, $filter, AuditsService) {
    $scope.onChangeDate = function () {
        var dateFormat = 'yyyy-MM-dd';
        var fromDate = $filter('date')($scope.fromDate, dateFormat);
        var toDate = $filter('date')($scope.toDate, dateFormat);
        AuditsService.findByDates(fromDate, toDate).then(function (data) {
            $scope.audits = data;
        });
    };
    $scope.today = function () {
        var today = new Date();
        $scope.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    };
    $scope.previousMonth = function () {
        var fromDate = new Date();
        if (fromDate.getMonth() === 0) {
            fromDate = new Date(fromDate.getFullYear() - 1, 0, fromDate.getDate());
        }
        else {
            fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
        }
        $scope.fromDate = fromDate;
    };
    $scope.today();
    $scope.previousMonth();
    $scope.onChangeDate();
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('audits', {
        parent: 'admin',
        url: '/audits',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'audits.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/audits/audits.html',
                controller: 'AuditsController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('audits');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('ConfigurationController', function ($scope, ConfigurationService) {
    ConfigurationService.get().then(function (configuration) {
        $scope.configuration = configuration;
    });
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('configuration', {
        parent: 'admin',
        url: '/configuration',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'configuration.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/configuration/configuration.html',
                controller: 'ConfigurationController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('configuration');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('docs', {
        parent: 'admin',
        url: '/docs',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'global.menu.admin.apidocs'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/docs/docs.html'
            }
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('HealthController', function ($scope, MonitoringService, $modal) {
    $scope.updatingHealth = true;
    $scope.separator = '.';
    $scope.refresh = function () {
        $scope.updatingHealth = true;
        MonitoringService.checkHealth().then(function (response) {
            $scope.healthData = $scope.transformHealthData(response);
            $scope.updatingHealth = false;
        }, function (response) {
            $scope.healthData = $scope.transformHealthData(response.data);
            $scope.updatingHealth = false;
        });
    };
    $scope.refresh();
    $scope.getLabelClass = function (statusState) {
        if (statusState === 'UP') {
            return 'label-success';
        }
        else {
            return 'label-danger';
        }
    };
    $scope.transformHealthData = function (data) {
        var response = [];
        $scope.flattenHealthData(response, null, data);
        return response;
    };
    $scope.flattenHealthData = function (result, path, data) {
        angular.forEach(data, function (value, key) {
            if ($scope.isHealthObject(value)) {
                if ($scope.hasSubSystem(value)) {
                    $scope.addHealthObject(result, false, value, $scope.getModuleName(path, key));
                    $scope.flattenHealthData(result, $scope.getModuleName(path, key), value);
                }
                else {
                    $scope.addHealthObject(result, true, value, $scope.getModuleName(path, key));
                }
            }
        });
        return result;
    };
    $scope.getModuleName = function (path, name) {
        var result;
        if (path && name) {
            result = path + $scope.separator + name;
        }
        else if (path) {
            result = path;
        }
        else if (name) {
            result = name;
        }
        else {
            result = '';
        }
        return result;
    };
    $scope.showHealth = function (health) {
        var modalInstance = $modal.open({
            templateUrl: 'app/core/admin/health/health.modal.html',
            controller: 'HealthModalController',
            size: 'lg',
            resolve: {
                currentHealth: function () {
                    return health;
                },
                baseName: function () {
                    return $scope.baseName;
                },
                subSystemName: function () {
                    return $scope.subSystemName;
                }
            }
        });
    };
    $scope.addHealthObject = function (result, isLeaf, healthObject, name) {
        var healthData = {
            'name': name
        };
        var details = {};
        var hasDetails = false;
        angular.forEach(healthObject, function (value, key) {
            if (key === 'status' || key === 'error') {
                healthData[key] = value;
            }
            else {
                if (!$scope.isHealthObject(value)) {
                    details[key] = value;
                    hasDetails = true;
                }
            }
        });
        if (hasDetails) {
            angular.extend(healthData, { 'details': details });
        }
        if (isLeaf || hasDetails) {
            result.push(healthData);
        }
        return healthData;
    };
    $scope.hasSubSystem = function (healthObject) {
        var result = false;
        angular.forEach(healthObject, function (value) {
            if (value && value.status) {
                result = true;
            }
        });
        return result;
    };
    $scope.isHealthObject = function (healthObject) {
        var result = false;
        angular.forEach(healthObject, function (value, key) {
            if (key === 'status') {
                result = true;
            }
        });
        return result;
    };
    $scope.baseName = function (name) {
        if (name) {
            var split = name.split('.');
            return split[0];
        }
    };
    $scope.subSystemName = function (name) {
        if (name) {
            var split = name.split('.');
            split.splice(0, 1);
            var remainder = split.join('.');
            return remainder ? ' - ' + remainder : '';
        }
    };
});
'use strict';
angular.module('myApp')
    .controller('HealthModalController', function ($scope, $modalInstance, currentHealth, baseName, subSystemName) {
    console.log('HealthModalController');
    $scope.currentHealth = currentHealth;
    $scope.baseName = baseName, $scope.subSystemName = subSystemName;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('health', {
        parent: 'admin',
        url: '/health',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'health.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/health/health.html',
                controller: 'HealthController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('health');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('LogsController', function ($scope, LogsService) {
    $scope.loggers = LogsService.findAll();
    $scope.changeLevel = function (name, level) {
        LogsService.changeLevel({ name: name, level: level }, function () {
            $scope.loggers = LogsService.findAll();
        });
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('logs', {
        parent: 'admin',
        url: '/logs',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'logs.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/logs/logs.html',
                controller: 'LogsController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('logs');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('MetricsController', function ($scope, MonitoringService, $modal) {
    $scope.metrics = {};
    $scope.updatingMetrics = true;
    $scope.refresh = function () {
        $scope.updatingMetrics = true;
        MonitoringService.getMetrics().then(function (promise) {
            $scope.metrics = promise;
            $scope.updatingMetrics = false;
        }, function (promise) {
            $scope.metrics = promise.data;
            $scope.updatingMetrics = false;
        });
    };
    $scope.$watch('metrics', function (newValue) {
        $scope.servicesStats = {};
        $scope.cachesStats = {};
        angular.forEach(newValue, function (value, key) {
            if (key.indexOf('web.controller') !== -1 || key.indexOf('service') !== -1) {
                $scope.servicesStats[key] = value;
            }
            if (key.indexOf('net.sf.ehcache.Cache') !== -1) {
                var index = key.lastIndexOf('.');
                var newKey = key.substr(0, index);
                index = newKey.lastIndexOf('.');
                $scope.cachesStats[newKey] = {
                    'name': newKey.substr(index + 1),
                    'value': value
                };
            }
        });
    });
    $scope.refresh();
    $scope.refreshThreadDumpData = function () {
        MonitoringService.threadDump().then(function (data) {
            var modalInstance = $modal.open({
                templateUrl: 'app/core/admin/metrics/metrics.modal.html',
                controller: 'MetricsModalController',
                size: 'lg',
                resolve: {
                    threadDump: function () {
                        return data;
                    }
                }
            });
        });
    };
});
'use strict';
angular.module('myApp')
    .controller('MetricsModalController', function ($scope, $modalInstance, threadDump) {
    $scope.threadDump = threadDump;
    $scope.threadDumpRunnable = 0;
    $scope.threadDumpWaiting = 0;
    $scope.threadDumpTimedWaiting = 0;
    $scope.threadDumpBlocked = 0;
    angular.forEach(threadDump, function (value) {
        if (value.threadState === 'RUNNABLE') {
            $scope.threadDumpRunnable += 1;
        }
        else if (value.threadState === 'WAITING') {
            $scope.threadDumpWaiting += 1;
        }
        else if (value.threadState === 'TIMED_WAITING') {
            $scope.threadDumpTimedWaiting += 1;
        }
        else if (value.threadState === 'BLOCKED') {
            $scope.threadDumpBlocked += 1;
        }
    });
    $scope.threadDumpAll = $scope.threadDumpRunnable + $scope.threadDumpWaiting +
        $scope.threadDumpTimedWaiting + $scope.threadDumpBlocked;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.getLabelClass = function (threadState) {
        if (threadState === 'RUNNABLE') {
            return 'label-success';
        }
        else if (threadState === 'WAITING') {
            return 'label-info';
        }
        else if (threadState === 'TIMED_WAITING') {
            return 'label-warning';
        }
        else if (threadState === 'BLOCKED') {
            return 'label-danger';
        }
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('metrics', {
        parent: 'admin',
        url: '/metrics',
        data: {
            roles: ['ROLE_ADMIN'],
            pageTitle: 'metrics.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/admin/metrics/metrics.html',
                controller: 'MetricsController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('metrics');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('entity', {
        abstract: true,
        parent: 'site'
    });
});
'use strict';
angular.module('myApp')
    .controller('PhotoDetailController', function ($scope, $rootScope, $stateParams, entity, Photo) {
    $scope.photo = entity;
    $scope.load = function (id) {
        console.log('PhotoDetailController: load()');
        Photo.get({ id: id }, function (result) {
            $scope.photo = result;
        });
    };
    $rootScope.$on('myApp:photoUpdate', function (event, result) {
        $scope.photo = result;
    });
});
'use strict';
angular.module('myApp').controller('PhotoDialogController', ['$scope', '$stateParams', '$modalInstance', 'entity', 'Photo',
    function ($scope, $stateParams, $modalInstance, entity, Photo) {
        $scope.photo = entity;
        $scope.load = function (id) {
            Photo.get({ id: id }, function (result) {
                $scope.photo = result;
            });
        };
        var onSaveFinished = function (result) {
            $scope.$emit('myApp:photoUpdate', result);
            $modalInstance.close(result);
        };
        $scope.save = function () {
            console.log("==================  save()");
            if ($scope.photo.id != null) {
                Photo.update($scope.photo, onSaveFinished);
            }
            else {
                Photo.save($scope.photo, onSaveFinished);
            }
        };
        $scope.clear = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
'use strict';
angular.module('myApp')
    .controller('PhotoController', function ($scope, Photo) {
    $scope.photos = [];
    $scope.loadAll = function () {
        Photo.query(function (result) {
            $scope.photos = result;
        });
    };
    $scope.loadAll();
    $scope.delete = function (id) {
        Photo.get({ id: id }, function (result) {
            $scope.photo = result;
            $('#deletePhotoConfirmation').modal('show');
        });
    };
    $scope.confirmDelete = function (id) {
        Photo.delete({ id: id }, function () {
            $scope.loadAll();
            $('#deletePhotoConfirmation').modal('hide');
            $scope.clear();
        });
    };
    $scope.refresh = function () {
        $scope.loadAll();
        $scope.clear();
    };
    $scope.clear = function () {
        $scope.photo = { name: null, opinions: null, id: null };
    };
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('photo', {
        parent: 'entity',
        url: '/photos',
        data: {
            roles: ['ROLE_USER'],
            pageTitle: 'myApp.photo.home.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/entities/photo/photos.html',
                controller: 'PhotoController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('photo');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
        }
    })
        .state('photo.detail', {
        parent: 'entity',
        url: '/photo/{id}',
        data: {
            roles: ['ROLE_USER'],
            pageTitle: 'myApp.photo.detail.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/entities/photo/photo_detail.html',
                controller: 'PhotoDetailController'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('photo');
                    return $translate.refresh();
                }],
            entity: ['$stateParams', 'Photo', function ($stateParams, Photo) {
                    return Photo.get({ id: $stateParams.id });
                }]
        }
    })
        .state('photo.new', {
        parent: 'photo',
        url: '/new',
        data: {
            roles: ['ROLE_USER'],
        },
        onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'app/core/entities/photo/photo_dialog.html',
                    controller: 'PhotoDialogController',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return { name: null, opinions: null, id: null };
                        }
                    }
                }).result.then(function (result) {
                    $state.go('photo', null, { reload: true });
                }, function () {
                    $state.go('photo');
                });
            }]
    })
        .state('photo.edit', {
        parent: 'photo',
        url: '/{id}/edit',
        data: {
            roles: ['ROLE_USER'],
        },
        onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'app/core/entities/photo/photo_dialog.html',
                    controller: 'PhotoDialogController',
                    size: 'lg',
                    resolve: {
                        entity: ['Photo', function (Photo) {
                                return Photo.get({ id: $stateParams.id });
                            }]
                    }
                }).result.then(function (result) {
                    $state.go('photo', null, { reload: true });
                }, function () {
                    $state.go('^');
                });
            }]
    });
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('error', {
        parent: 'site',
        url: '/error',
        data: {
            roles: [],
            pageTitle: 'error.title'
        },
        views: {
            'content@': {
                templateUrl: 'app/core/error/error.html'
            }
        },
        resolve: {
            mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('error');
                    return $translate.refresh();
                }]
        }
    })
        .state('accessdenied', {
        parent: 'site',
        url: '/accessdenied',
        data: {
            roles: []
        },
        views: {
            'content@': {
                templateUrl: 'app/core/error/accessdenied.html'
            }
        },
        resolve: {
            mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('error');
                    return $translate.refresh();
                }]
        }
    });
});
'use strict';
angular.module('myApp')
    .controller('MainController', function ($scope) {
});
'use strict';
angular.module('myApp')
    .config(function ($stateProvider) {
    $stateProvider
        .state('home', {
        parent: 'site',
        url: '/',
        data: {
            roles: []
        },
        views: {
            'content@': {
                templateUrl: 'app/core/main/main.html',
                controller: 'MainController'
            }
        }
    });
});
var testme;
(function (testme) {
    testme.html = '<div>Hey wassup!</div>';
})(testme || (testme = {}));
/// <reference path='../reference.ts' />
directives.directive('testme', function () {
    return {
        restrict: 'EAC',
        template: testme.html
    };
});
/// <reference path='../reference.ts' />
var test;
(function (test) {
    var Hello = (function () {
        function Hello(name) {
            this._name = name;
        }
        Object.defineProperty(Hello.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Hello;
    })();
    test.Hello = Hello;
})(test || (test = {}));
var LogService = (function () {
    function LogService() {
    }
    LogService.prototype.log = function (msg) {
        console.log(msg);
    };
    return LogService;
})();
services.service('logService', LogService);
/// <reference path="vendor.d.ts" />
/// <reference path="controllers/controllers.ts" />
/// <reference path="services/services.ts" />
/// <reference path="directives/directives.ts" />
/// <reference path="constants.ts" />
/// <reference path="common/language/language.controller.ts" />
/// <reference path="common/language/language.service.ts" />
/// <reference path="main.ts" />
/// <reference path="common/alert/alert.service.ts" />
/// <reference path="common/alert/alert.directive.ts" />
/// <reference path="common/navbar/navbar.html.ts" />
/// <reference path="core/account/login/login.html.ts" />
/// <reference path="core/account/register/register.html.ts" />
/// <reference path="core/admin/audits/audits.html.ts" />
/// <reference path="core/admin/configuration/configuration.html.ts" />
/// <reference path="core/admin/docs/docs.html.ts" />
/// <reference path="core/admin/health/health.html.ts" />
/// <reference path="core/admin/health/health.modal.html.ts" />
/// <reference path="core/admin/logs/logs.html.ts" />
/// <reference path="core/admin/metrics/metrics.html.ts" />
/// <reference path="core/admin/metrics/metrics.modal.html.ts" />
/// <reference path="core/entities/photo/photo_detail.html.ts" />
/// <reference path="core/entities/photo/photo_dialog.html.ts" />
/// <reference path="core/entities/photo/photos.html.ts" />
/// <reference path="core/error/accessdenied.html.ts" />
/// <reference path="core/error/error.html.ts" />
/// <reference path="core/main/main.html.ts" />
/// <reference path="common/admin/audits.service.ts" />
/// <reference path="common/admin/configuration.service.ts" />
/// <reference path="common/admin/logs.service.ts" />
/// <reference path="common/admin/monitoring.service.ts" />
/// <reference path="common/auth/auth.service.ts" />
/// <reference path="common/auth/authority.directive.ts" />
/// <reference path="common/auth/principal.service.ts" />
/// <reference path="common/auth/provider/auth.session.service.ts" />
/// <reference path="common/auth/services/account.service.ts" />
/// <reference path="common/auth/services/activate.service.ts" />
/// <reference path="common/auth/services/password.service.ts" />
/// <reference path="common/auth/services/register.service.ts" />
/// <reference path="common/entities/photo/photo.service.ts" />
/// <reference path="common/interceptor/auth.interceptor.ts" />
/// <reference path="common/interceptor/errorhandler.interceptor.ts" />
/// <reference path="common/interceptor/notification.interceptor.ts" />
/// <reference path="common/navbar/navbar.controller.ts" />
/// <reference path="common/user/user.service.ts" />
/// <reference path="common/util/dateutil.service.ts" />
/// <reference path="common/util/truncate.filter.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/TestController.ts" />
/// <reference path="controllers/annotations/AnnotationController.ts" />
/// <reference path="controllers/app.ts" />
/// <reference path="core/account/account.ts" />
/// <reference path="core/account/login/login.controller.ts" />
/// <reference path="core/account/login/login.ts" />
/// <reference path="core/account/logout/logout.controller.ts" />
/// <reference path="core/account/logout/logout.ts" />
/// <reference path="core/account/register/register.controller.ts" />
/// <reference path="core/account/register/register.ts" />
/// <reference path="core/admin/admin.ts" />
/// <reference path="core/admin/audits/audits.controller.ts" />
/// <reference path="core/admin/audits/audits.ts" />
/// <reference path="core/admin/configuration/configuration.controller.ts" />
/// <reference path="core/admin/configuration/configuration.ts" />
/// <reference path="core/admin/docs/docs.ts" />
/// <reference path="core/admin/health/health.controller.ts" />
/// <reference path="core/admin/health/health.modal.controller.ts" />
/// <reference path="core/admin/health/health.ts" />
/// <reference path="core/admin/logs/logs.controller.ts" />
/// <reference path="core/admin/logs/logs.ts" />
/// <reference path="core/admin/metrics/metrics.controller.ts" />
/// <reference path="core/admin/metrics/metrics.modal.controller.ts" />
/// <reference path="core/admin/metrics/metrics.ts" />
/// <reference path="core/entities/entity.ts" />
/// <reference path="core/entities/photo/photo-detail.controller.ts" />
/// <reference path="core/entities/photo/photo-dialog.controller.ts" />
/// <reference path="core/entities/photo/photo.controller.ts" />
/// <reference path="core/entities/photo/photo.ts" />
/// <reference path="core/error/error.ts" />
/// <reference path="core/main/main.controller.ts" />
/// <reference path="core/main/main.ts" />
/// <reference path="directives/testme.html.ts" />
/// <reference path="directives/testme.ts" />
/// <reference path="model/Hello.ts" />
/// <reference path="services/LogService.ts" />
//# sourceMappingURL=out.js.map