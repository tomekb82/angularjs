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
            console.log("LANG = " + language);
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
        console.log('AlertService: get');
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
        console.log('AlertService: addAlert');
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
                var alertOptions = {
                    type: "info",
                    msg: "Witaj w mojej aplikacji...",
                    params: 2,
                    timeout: 0 };
                AlertService.add(alertOptions);
                $scope.alerts = AlertService.get();
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
    navbar.html = '<nav class="navbar navbar-default" role="navigation">    <div class="container">        <div class="navbar-header">            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">                <span class="sr-only">Toggle navigation</span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>            </button>            <a class="navbar-brand" href="#/"><span translate="global.title">MyApp</span> <span class="navbar-version">v{{VERSION}}</span></a>        </div>        <div class="collapse navbar-collapse" id="navbar-collapse" ng-switch="isAuthenticated()">            <ul class="nav navbar-nav nav-pills navbar-right">                <li ui-sref-active="active">                    <a ui-sref="home">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.home">Home2</span>                    </a>                </li>                <li ui-sref-active="active">                    <a ui-sref="photos">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.photos">Photos2</span>                    </a>                </li>                <li ui-sref-active="active" ng-switch-when="true" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-th-list"></span>                                    <span class="hidden-tablet" translate="global.menu.entities.main">                                        Entities                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ><a ui-sref="photo"><span class="glyphicon glyphicon-asterisk"></span>                        &#xA0;<span translate="global.menu.entities.photo">photo</span></a></li>                        <!-- JHipster will add entities to the menu here -->                    </ul>                </li>                <li ng-class="{active: $state.includes(\'account\')}" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-user"></span>                                    <span class="hidden-tablet" translate="global.menu.account.main">                                        Account2                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="settings"><span class="glyphicon glyphicon-wrench"></span>                            &#xA0;<span translate="global.menu.account.settings">Settings</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="password"><span class="glyphicon glyphicon-lock"></span>                            &#xA0;<span translate="global.menu.account.password">Password</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="sessions"><span class="glyphicon glyphicon-cloud"></span>                            &#xA0;<span translate="global.menu.account.sessions">Sessions</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a href="" ng-click="logout()"><span class="glyphicon glyphicon-log-out"></span>                            &#xA0;<span translate="global.menu.account.logout">Log out</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="login"><span class="glyphicon glyphicon-log-in"></span>                            &#xA0;<span translate="global.menu.account.login">Authenticate</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="register"><span class="glyphicon glyphicon-plus-sign"></span>                            &#xA0;<span translate="global.menu.account.register">Register</span></a></li>                    </ul>                </li>                <li ng-class="{active: $state.includes(\'admin\')}"  ng-switch-when="true" has-role="ROLE_ADMIN" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-tower"></span>                                    <span class="hidden-tablet" translate="global.menu.admin.main">Administration</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                       <!-- <li ui-sref-active="active"><a ui-sref="tracker"><span class="glyphicon glyphicon-eye-open"></span>                                &nbsp;<span translate="global.menu.admin.tracker">User tracker</span></a></li>                        <li ui-sref-active="active"><a ui-sref="metrics"><span class="glyphicon glyphicon-dashboard"></span>                            &#xA0;<span translate="global.menu.admin.metrics">Metrics</span></a></li>                        <li ui-sref-active="active"><a ui-sref="health"><span class="glyphicon glyphicon-heart"></span>                            &#xA0;<span translate="global.menu.admin.health">Health</span></a></li>                        <li ui-sref-active="active"><a ui-sref="configuration"><span class="glyphicon glyphicon-list-alt"></span>                            &#xA0;<span translate="global.menu.admin.configuration">Configuration</span></a></li>                        <li ui-sref-active="active"><a ui-sref="audits"><span class="glyphicon glyphicon-bell"></span>                            &#xA0;<span translate="global.menu.admin.audits">Audits</span></a></li>                        <li ui-sref-active="active"><a ui-sref="logs"><span class="glyphicon glyphicon-tasks"></span>                            &#xA0;<span translate="global.menu.admin.logs">Logs</span></a></li>                        <li ui-sref-active="active"><a ui-sref="docs"><span class="glyphicon glyphicon-book"></span>                            &#xA0;<span translate="global.menu.admin.apidocs">API</span></a></li>-->                    </ul>                </li>                <li ui-sref-active="active" class="dropdown pointer" ng-controller="LanguageController">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-flag"></span>                                    <span class="hidden-tablet" translate="global.menu.language">Language2</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li active-menu="{{language}}" ng-repeat="language in languages">                            <a href="" ng-click="changeLanguage(language)">{{language | findLanguageFromKey}}</a>                        </li>                    </ul>                </li>            </ul>        </div>    </div></nav>';
})(navbar || (navbar = {}));
var main;
(function (main) {
    main.html = '<div ng-cloak>    <div class="row">        <div class="col-md-4">            <span class="hipster img-responsive img-rounded"></span>        </div>        <div class="col-md-8">            <h1>Welcome, My App!</h1>	    <!--<h1 translate="main.title">Welcome, My App!</h1>-->            <!--<p class="lead" translate="main.subtitle">This is your homepage</p>            <div ng-switch="isAuthenticated()">                <div class="alert alert-success" ng-switch-when="true" translate="main.logged.message" translate-values="{username: \'{{account.login}}\'}">                    You are logged in as user "{{account.login}}".                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.authenticated">                    If you want to <a href="#/login">authenticate</a>, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and password="user").                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.register">                    You don\'t have an account yet? <a href="#/register">Register a new account</a>                </div>            </div>            <p translate="main.question">                If you have any question on JHipster 2:            </p>            <ul>                <li><a href="http://jhipster.github.io/" target="_blank" translate="main.link.homepage">JHipster homepage</a></li>                <li><a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" translate="main.link.stackoverflow">JHipster on Stack Overflow</a></li>                <li><a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" translate="main.link.bugtracker">JHipster bug tracker</a></li>                <li><a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" translate="main.link.chat">JHipster public chat room</a></li>                <li><a href="https://twitter.com/java_hipster" target="_blank"  translate="main.link.contact">contact @java_hipster on Twitter</a></li>            </ul>            <p>             <span translate="main.like">If you like JHipster, don\'t forget to give us a star on </span>&nbsp;<a href="https://github.com/jhipster/generator-jhipster" target="_blank" translate="main.github">Github</a>!            </p>-->	        </div>    </div></div>';
})(main || (main = {}));
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
    return {
        'responseError': function (response) {
            console.log('errorHandlerInterceptor');
            $rootScope.$emit('myApp.httpError', response);
            return $q.reject(response);
        }
    };
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
    return {
        response: function (response) {
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
    .controller('NavbarController', function ($scope) {
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
/// <reference path="core/main/main.html.ts" />
/// <reference path="common/interceptor/errorhandler.interceptor.ts" />
/// <reference path="common/interceptor/notification.interceptor.ts" />
/// <reference path="common/navbar/navbar.controller.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/TestController.ts" />
/// <reference path="controllers/annotations/AnnotationController.ts" />
/// <reference path="controllers/app.ts" />
/// <reference path="core/main/main.controller.ts" />
/// <reference path="core/main/main.ts" />
/// <reference path="directives/testme.html.ts" />
/// <reference path="directives/testme.ts" />
/// <reference path="model/Hello.ts" />
/// <reference path="services/LogService.ts" />
//# sourceMappingURL=out.js.map