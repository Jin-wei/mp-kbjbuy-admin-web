'use strict';

var app = angular.module("admin_module", ['ngRoute','angularFileUpload','pascalprecht.translate']);

app.config(['$httpProvider','$translateProvider',function($httpProvider,$translateProvider) {
    $httpProvider.defaults.headers.common["auth-token"] = $.cookie("auth-token");
    var tenant = getTenant();
    var staticContentURL=sys_config.staticContent.url;
    //i18n
    $translateProvider.useStaticFilesLoader({
        prefix: staticContentURL+'/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh-'+tenant);

    $translateProvider.useSanitizeValueStrategy('escapeParameters');
}]);
