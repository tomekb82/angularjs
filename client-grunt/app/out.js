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
    navbar.html = '<nav class="navbar navbar-default" role="navigation">    <div class="container">        <div class="navbar-header">            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">                <span class="sr-only">Toggle navigation</span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>                <span class="icon-bar"></span>            </button>            <a class="navbar-brand" href="#/"><span translate="global.title">MyApp</span> <span class="navbar-version">v{{VERSION}}</span></a>        </div>        <div class="collapse navbar-collapse" id="navbar-collapse" ng-switch="isAuthenticated()">            <ul class="nav navbar-nav nav-pills navbar-right">                <li ui-sref-active="active">                    <a ui-sref="home">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.home">Home</span>                    </a>                </li>                <li ui-sref-active="active">                    <a ui-sref="photo">                        <span class="glyphicon glyphicon-home"></span>                        <span translate="global.menu.photos">Photos</span>                    </a>                </li>                <li ui-sref-active="active" ng-switch-when="true" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-th-list"></span>                                    <span class="hidden-tablet" translate="global.menu.entities.main">                                        Entities                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ><a ui-sref="photo"><span class="glyphicon glyphicon-asterisk"></span>                        &#xA0;<span translate="global.menu.entities.photo">photo</span></a></li>                        <!-- JHipster will add entities to the menu here -->                    </ul>                </li>                <li ng-class="{active: $state.includes(\'account\')}" class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-user"></span>                                    <span class="hidden-tablet" translate="global.menu.account.main">                                        Account                                    </span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="settings"><span class="glyphicon glyphicon-wrench"></span>                            &#xA0;<span translate="global.menu.account.settings">Settings</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="password"><span class="glyphicon glyphicon-lock"></span>                            &#xA0;<span translate="global.menu.account.password">Password</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a ui-sref="sessions"><span class="glyphicon glyphicon-cloud"></span>                            &#xA0;<span translate="global.menu.account.sessions">Sessions</span></a></li>                        <li ui-sref-active="active" ng-switch-when="true"><a href="" ng-click="logout()"><span class="glyphicon glyphicon-log-out"></span>                            &#xA0;<span translate="global.menu.account.logout">Log out</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="login"><span class="glyphicon glyphicon-log-in"></span>                            &#xA0;<span translate="global.menu.account.login">Authenticate</span></a></li>                        <li ui-sref-active="active" ng-switch-when="false"><a ui-sref="register"><span class="glyphicon glyphicon-plus-sign"></span>                            &#xA0;<span translate="global.menu.account.register">Register</span></a></li>                    </ul>                </li>                <!--<li ng-class="{active: $state.includes(\'admin\')}"  ng-switch-when="true" has-role="ROLE_ADMIN" class="dropdown pointer">-->	        <li class="dropdown pointer">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-tower"></span>                                    <span class="hidden-tablet" translate="global.menu.admin.main">Administration</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                       <!-- <li ui-sref-active="active"><a ui-sref="tracker"><span class="glyphicon glyphicon-eye-open"></span>                                &nbsp;<span translate="global.menu.admin.tracker">User tracker</span></a></li>                        <li ui-sref-active="active"><a ui-sref="metrics"><span class="glyphicon glyphicon-dashboard"></span>                            &#xA0;<span translate="global.menu.admin.metrics">Metrics</span></a></li>                        <li ui-sref-active="active"><a ui-sref="health"><span class="glyphicon glyphicon-heart"></span>                            &#xA0;<span translate="global.menu.admin.health">Health</span></a></li>                        <li ui-sref-active="active"><a ui-sref="configuration"><span class="glyphicon glyphicon-list-alt"></span>                            &#xA0;<span translate="global.menu.admin.configuration">Configuration</span></a></li>                        <li ui-sref-active="active"><a ui-sref="audits"><span class="glyphicon glyphicon-bell"></span>                            &#xA0;<span translate="global.menu.admin.audits">Audits</span></a></li>-->                        <li ui-sref-active="active"><a ui-sref="logs"><span class="glyphicon glyphicon-tasks"></span>                            &#xA0;<span translate="global.menu.admin.logs">Logs</span></a></li>                       <!-- <li ui-sref-active="active"><a ui-sref="docs"><span class="glyphicon glyphicon-book"></span>                            &#xA0;<span translate="global.menu.admin.apidocs">API</span></a></li>-->                    </ul>                </li>                <li ui-sref-active="active" class="dropdown pointer" ng-controller="LanguageController">                    <a class="dropdown-toggle" data-toggle="dropdown" href="">                                <span>                                    <span class="glyphicon glyphicon-flag"></span>                                    <span class="hidden-tablet" translate="global.menu.language">Language2</span>                                    <b class="caret"></b>                                </span>                    </a>                    <ul class="dropdown-menu">                        <li active-menu="{{language}}" ng-repeat="language in languages">                            <a href="" ng-click="changeLanguage(language)">{{language | findLanguageFromKey}}</a>                        </li>                    </ul>                </li>            </ul>        </div>    </div></nav>';
})(navbar || (navbar = {}));
var logs;
(function (logs) {
    logs.html = '<div>    <h2 translate="logs.title">Logs</h2>    <p translate="logs.nbloggers" translate-values="{total: \'{{ loggers.length }}\'}">There are {{ loggers.length }} loggers.</p>    <span translate="logs.filter">Filter</span> <input type="text" ng-model="filter" class="form-control">    <table class="table table-condensed table-striped table-bordered table-responsive">        <thead>        <tr title="click to order">            <th ng-click="predicate = \'name\'; reverse=!reverse"><span translate="logs.table.name">Name</span></th>            <th ng-click="predicate = \'level\'; reverse=!reverse"><span translate="logs.table.level">Level</span></th>        </tr>        </thead>        <tr ng-repeat="logger in loggers | filter:filter | orderBy:predicate:reverse">            <td><small>{{logger.name | characters:140}}</small></td>            <td>                <button ng-click="changeLevel(logger.name, \'TRACE\')" ng-class="(logger.level==\'TRACE\') ? \'btn-danger\' : \'btn-default\'" class="btn btn-default btn-xs">TRACE</button>                <button ng-click="changeLevel(logger.name, \'DEBUG\')" ng-class="(logger.level==\'DEBUG\') ? \'btn-warning\' : \'btn-default\'" class="btn btn-default btn-xs">DEBUG</button>                <button ng-click="changeLevel(logger.name, \'INFO\')" ng-class="(logger.level==\'INFO\') ? \'btn-info\' : \'btn-default\'" class="btn btn-default btn-xs">INFO</button>                <button ng-click="changeLevel(logger.name, \'WARN\')" ng-class="(logger.level==\'WARN\') ? \'btn-success\' : \'btn-default\'" class="btn btn-default btn-xs">WARN</button>                <button ng-click="changeLevel(logger.name, \'ERROR\')" ng-class="(logger.level==\'ERROR\') ? \'btn-primary\' : \'btn-default\'" class="btn btn-default btn-xs">ERROR</button>            </td>        </tr>    </table></div>';
})(logs || (logs = {}));
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
    .factory('LogsService', function ($resource) {
    return $resource('api/logs', {}, {
        'findAll': { method: 'GET', isArray: true },
        'changeLevel': { method: 'PUT' }
    });
});
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('Auth', function Auth($rootScope, $state, $q, $translate, Principal, AuthServerProvider, Account, Register, Activate, Password, PasswordResetInit, PasswordResetFinish, Tracker) {
    return {
        login: function (credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();
            AuthServerProvider.login(credentials).then(function (data) {
                Principal.identity(true).then(function (account) {
                    $translate.use(account.langKey);
                    $translate.refresh();
                    Tracker.sendActivity();
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
angular.module('myApp')
    .directive('hasAnyRole', ['Principal', function (Principal) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var setVisible = function () {
                    console.log('hasAnyRole, setVisible');
                    element.removeClass('hidden');
                }, setHidden = function () {
                    console.log('hasAnyRole, setHidden');
                    element.addClass('hidden');
                }, defineVisibility = function (reset) {
                    console.log('hasAnyRole, defineVisibility');
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
                    console.log('hasRole, setVisible');
                    element.removeClass('hidden');
                }, setHidden = function () {
                    console.log('hasRole, setHidden');
                    element.addClass('hidden');
                }, defineVisibility = function (reset) {
                    console.log('hasRole, defineVisibility');
                    if (reset) {
                        setVisible();
                    }
                    Principal.isInRole(role)
                        .then(function (result) {
                        console.log('Principal isInRole: result=' + result);
                        if (result) {
                            setVisible();
                        }
                        else {
                            setHidden();
                        }
                    });
                }, role = attrs.hasRole.replace(/\s+/g, '');
                console.log('hasRole, defineVisibility, role=' + role);
                defineVisibility(true);
            }
        };
    }]);
/// <reference path='../../reference.ts' />
angular.module('myApp')
    .factory('Principal', function Principal($q) {
    var _identity, _authenticated = false;
    return {
        isIdentityResolved: function () {
            return angular.isDefined(_identity);
        },
        isAuthenticated: function () {
            return _authenticated;
        },
        isInRole: function (role) {
            console.log('Principal isInRole: true');
            return true;
            return this.identity().then(function (_id) {
                return _id.roles && _id.roles.indexOf(role) !== -1;
            }, function (err) {
                return false;
            });
        },
        isInAnyRole: function (roles) {
            // TODO: to change
            //if (!_authenticated || !_identity || !_identity.roles) {
            //    return false;
            //}
            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) {
                    return true;
                }
            }
            return true;
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
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);
                return deferred.promise;
            }
            return deferred.promise;
        }
    };
});
'use strict';
angular.module('myApp')
    .factory('AuthServerProvider', function loginService($http, localStorageService, $window, Tracker) {
    return {
        login: function (credentials) {
            var data = 'j_username=' + encodeURIComponent(credentials.username) +
                '&j_password=' + encodeURIComponent(credentials.password) +
                '&remember-me=' + credentials.rememberMe + '&submit=Login';
            return $http.post('api/authentication', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (response) {
                return response;
            });
        },
        logout: function () {
            Tracker.disconnect();
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
        .state('admin', {
        abstract: true,
        parent: 'site'
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
/// <reference path="core/admin/logs/logs.html.ts" />
/// <reference path="core/entities/photo/photo_detail.html.ts" />
/// <reference path="core/entities/photo/photo_dialog.html.ts" />
/// <reference path="core/entities/photo/photos.html.ts" />
/// <reference path="core/error/accessdenied.html.ts" />
/// <reference path="core/error/error.html.ts" />
/// <reference path="core/main/main.html.ts" />
/// <reference path="common/admin/logs.service.ts" />
/// <reference path="common/auth/auth.service.ts" />
/// <reference path="common/auth/authority.directive.ts" />
/// <reference path="common/auth/principal.service.ts" />
/// <reference path="common/auth/provider/auth.session.service.ts" />
/// <reference path="common/entities/photo/photo.service.ts" />
/// <reference path="common/interceptor/errorhandler.interceptor.ts" />
/// <reference path="common/interceptor/notification.interceptor.ts" />
/// <reference path="common/navbar/navbar.controller.ts" />
/// <reference path="common/util/dateutil.service.ts" />
/// <reference path="common/util/truncate.filter.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/TestController.ts" />
/// <reference path="controllers/annotations/AnnotationController.ts" />
/// <reference path="controllers/app.ts" />
/// <reference path="core/admin/admin.ts" />
/// <reference path="core/admin/logs/logs.controller.ts" />
/// <reference path="core/admin/logs/logs.ts" />
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