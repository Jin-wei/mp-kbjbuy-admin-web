/**
 * Created by BaiBin on 16/7/7.
 */
app.directive('header', function() {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function($scope, $element,$httpService,$rootScope,$hostService){
            var tenant = getTenant();
            $httpService.setCookie($httpService.TENANT,tenant);
            var adminId = $httpService.getCookie($httpService.ADMIN_ID);
            var adminToken = $httpService.getCookie($httpService.ADMIN_AUTH_NAME);
            $rootScope.loginUserName = $httpService.getCookie($httpService.USER_NAME);

            App.init();
            $scope.logOut = function(){
                $httpService.removeCookie($httpService.ADMIN_ID);
                $httpService.removeCookie($httpService.ADMIN_AUTH_NAME);
                window.location.href='login.html';

                var param = {"token": adminToken};
                $httpService.delete($hostService.loginApi+'/auth/tokens',param).then(function(data){
                    if(data.success){

                    }else{
                        WarningBox(data.msg);
                    }
                }).catch(function (error) {
                    ErrorBox('服务器内部错误');
                });
            }

            if(adminId && adminToken){
                $rootScope.adminId = adminId;
                $rootScope.adminToken = adminToken;
                $httpService.setHeader($httpService.COMMON_AUTH_NAME,adminToken);
            }else{
                WarningBox("请先登录");
                window.setTimeout(function(){
                    window.location.href='login.html';
                },2000);

            }
        },
    };
});
app.directive('mpDateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function formatter(value) {
                return dateFilter(value, 'yyyy-MM-dd HH:mm:ss'); //format
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);

        }
    };
}]);

//province,city,district
app.directive('regionGroup',function(){
    return{
        restrict:'EA',
        replace:true,
        scope:{
            provinceId:'=provinceId',
            cityId:'=cityId',
            districtId:'=districtId'
        },
        template:'<form class="form-inline" style="width: 100%"> ' +
        '<div class="form-group" style="margin-right: 30px;">' +
        '<select id=provinceId class="form-control" style="width: 130px;">' +
        '<option ng-repeat="provinceRegion in provinceRegionArr" ' +
        'value="{{provinceRegion.id}}">{{provinceRegion.name}} </option>' +
        '</select>' +
        '</div>' +
        '<div class="form-group" style="margin-right: 30px;">' +
        '<select id=cityId class="form-control" style="width: 130px;">' +
        '<option ng-repeat="cityRegion in cityRegionArr" ' +
        'value="{{cityRegion.id}}">{{cityRegion.name}} </option>' +
        '</select>' +
        '</div>' +
        '<div class="form-group" ng-if="districtRegionArr != null && districtRegionArr.length>0">' +
        '<select id=districtId class="form-control" style="width: 130px;">' +
        '<option ng-repeat="districtRegion in districtRegionArr" ' +
        'value="{{districtRegion.id}}">{{districtRegion.name}} </option>' +
        '</select>' +
        '</div>' +
        '</form>',
        controller:function($rootScope,$scope,$httpService,$location,$q,$hostService){
            $httpService.get($hostService.loginApi+'/region/parent').then(function(data){
                if(data.success){
                    if(data.result!=null && data.result.length>0){
                        $scope.provinceRegionArr=data.result;
                    }
                }
            }).then(function(){
                if($scope.provinceRegionArr!=null && $scope.provinceRegionArr.length>0){
                    //var pid=$("#provinceId option:selected").val();
                    var pid = $scope.provinceRegionArr[0].id;
                    initChildRegion(pid,1);
                }

            }).then(function(){
                if($scope.cityRegionArr!=null && $scope.cityRegionArr.length>0){
                    var pid = $scope.cityRegionArr[0].id;
                    initChildRegion(pid,2);
                }

            }).catch(function(error){

            });

            //flag:1:get city region 2:get district region
            function initChildRegion(pId,flag){
                $httpService.get($hostService.loginApi+'/region?pid='+pId).then(function(data){
                    if(data.success){
                        if(flag==1){
                            $scope.cityRegionArr=data.result;
                        }else if(flag==2){
                            $scope.districtRegionArr=data.result;
                        }
                    }
                }).catch(function(error){

                });
            }

            $("#provinceId").change(function(){
                getChangeChildRegion(1);
            });

            $("#cityId").change(function(){
                getChangeChildRegion(2);
            });

            //flag:1:get city region 2:get district region
            function getChangeChildRegion(flag){
                var pid;
                if(flag==1){
                    pid=$("#provinceId option:selected").val();
                }else if(flag==2){
                    pid=$("#cityId option:selected").val();
                }

                $httpService.get($hostService.loginApi+'/region?pid='+pid).then(function(data){
                    if(data.success){
                        if(flag==1){
                            $scope.cityRegionArr=data.result;
                            if($scope.cityRegionArr!=null && $scope.cityRegionArr.length>0){
                                var pid1 = $scope.cityRegionArr[0].id;
                                $httpService.get($hostService.loginApi+'/region?pid='+pid1).then(function(data){
                                    if(data.success){
                                        $scope.districtRegionArr=data.result;
                                    }
                                }).catch(function(error){

                                });
                            }

                        }else if(flag==2){
                            $scope.districtRegionArr=data.result;
                        }
                    }
                }).catch(function(error){

                });
            }
        }
    }
});

//red * for required form
app.directive('require',function(){
    return{
        restrict:'EA',
        template:'<span style="color: red;">*&nbsp;</span>'
    }
});

//check dialog for user info pages
app.directive('checkDialog', function() {
    return {
        templateUrl: '/view/usermanage/check_dialog.html',
        replace: true,
        transclude: false,
        restrict: 'E',
    };
});

app.directive('tablePage',function(){
    return{
        restrict:'EA',
        template:'<span class="table-span">共</span>'+
        '<span class="table-span" ng-bind="totalPage" style="margin-left: 5px;margin-right: 5px;"></span>'+
        '<span class="table-span">页</span>'+
        '<button type="button" class="btn btn-white disabled" style="margin-left: 30px;margin-right: 10px;" id="firstBtn" ng-click="turnPage(0)" disabled><span>首页</span></button>'+
        '<button type="button" class="btn btn-white disabled" style="margin-right: 10px;" id="preBtn" ng-click="turnPage(1)" disabled><span>上一页</span></button>'+
        '<span ng-bind="currentPage" style="font-size: 14px;color: #2aabd2"></span>'+
        '<button type="button" class="btn btn-white" style="margin-left: 10px;" id="nextBtn" ng-click="turnPage(2)" disabled ><span>下一页</span></button>'+
        '<button type="button" class="btn btn-white" style="margin-left: 10px;margin-right: 30px;" id="lastBtn" ng-click="turnPage(9)" disabled><span>尾页</span></button>'+
        '<span class="table-span">跳转到&nbsp;&nbsp;第&nbsp;</span>'+
        '<input type="text" style="width: 35px;" id="specifiedPage" ng-model="specifiedPage" onkeyup="value=value.replace(/[^\\d]/g,\'\')"/>'+
        '<span class="table-span">&nbsp;页&nbsp;</span>'+
        '<button type="button" class="btn btn-white" style="margin-left: 10px;color: #2aabd2;" ng-click="turnPage(3)">GO</button>'

    }
});

//uploader
app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

