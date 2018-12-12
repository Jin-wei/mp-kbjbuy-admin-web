app.factory('$hostService',['$rootScope','$filter',function($rootScope,$filter){
     var _this = {};
     _this.imageApi = sys_config.api.imageApi;
     _this.loginApi = sys_config.api.loginApi;
     _this.orderApi = sys_config.api.orderApi;
     _this.productApi =sys_config.api.productApi;
     _this.bizApi = sys_config.api.bizApi;
     _this.cmsApi = sys_config.api.cmsApi;
     _this.channelAdminRoleId = sys_config.channelAdminRoleId;

       //common functions
        setPageTitle();
        $rootScope.tenant = getTenant();
        $rootScope.staticContentURL = sys_config.staticContent.url;

      function setPageTitle(){
          window.setTimeout(function () {
              $('#html-title').text($filter('translate')('html-title'))
          },1000)
        }
    return _this;
}]);