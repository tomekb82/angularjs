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
angular.module('myApp')
    .controller('NavbarController', function ($scope) {
    console.log('NavbarController');
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
var main;
(function (main) {
    main.html = '<div ng-cloak>    <div class="row">        <div class="col-md-4">            <span class="hipster img-responsive img-rounded"></span>        </div>        <div class="col-md-8">            <h1>Welcome, My App!</h1>	    <!--<h1 translate="main.title">Welcome, My App!</h1>-->            <!--<p class="lead" translate="main.subtitle">This is your homepage</p>            <div ng-switch="isAuthenticated()">                <div class="alert alert-success" ng-switch-when="true" translate="main.logged.message" translate-values="{username: \'{{account.login}}\'}">                    You are logged in as user "{{account.login}}".                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.authenticated">                    If you want to <a href="#/login">authenticate</a>, you can try the default accounts:<br/>- Administrator (login="admin" and password="admin") <br/>- User (login="user" and password="user").                </div>                <div class="alert alert-warning" ng-switch-when="false" translate="global.messages.info.register">                    You don\'t have an account yet? <a href="#/register">Register a new account</a>                </div>            </div>            <p translate="main.question">                If you have any question on JHipster 2:            </p>            <ul>                <li><a href="http://jhipster.github.io/" target="_blank" translate="main.link.homepage">JHipster homepage</a></li>                <li><a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" translate="main.link.stackoverflow">JHipster on Stack Overflow</a></li>                <li><a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" translate="main.link.bugtracker">JHipster bug tracker</a></li>                <li><a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" translate="main.link.chat">JHipster public chat room</a></li>                <li><a href="https://twitter.com/java_hipster" target="_blank"  translate="main.link.contact">contact @java_hipster on Twitter</a></li>            </ul>            <p>             <span translate="main.like">If you like JHipster, don\'t forget to give us a star on </span>&nbsp;<a href="https://github.com/jhipster/generator-jhipster" target="_blank" translate="main.github">Github</a>!            </p>-->	        </div>    </div></div>';
})(main || (main = {}));
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
/// <reference path="common/navbar/navbar.controller.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/TestController.ts" />
/// <reference path="controllers/annotations/AnnotationController.ts" />
/// <reference path="controllers/app.ts" />
/// <reference path="core/main/main.controller.ts" />
/// <reference path="core/main/main.html.ts" />
/// <reference path="core/main/main.ts" />
/// <reference path="directives/testme.html.ts" />
/// <reference path="directives/testme.ts" />
/// <reference path="model/Hello.ts" />
/// <reference path="services/LogService.ts" />
//# sourceMappingURL=out.js.map