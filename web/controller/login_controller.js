app.controller("loginController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {
        $scope.moduleName = '用户登录';
        App.init();
        var adminId = $httpService.getCookie($httpService.ADMIN_ID);
        var adminToken = $httpService.getCookie($httpService.ADMIN_AUTH_NAME);
        $httpService.setHeader($httpService.COMMON_AUTH_NAME,adminToken);
        $scope.refreshToken = function(){
            $httpService.post($hostService.loginApi+'/auth/refreshedtokens',{"token":adminToken}).then(function(data){
                if(data.success){
                    $rootScope.adminId = data.result.user.userId;
                    $rootScope.adminToken = data.result.accessToken;
                    $rootScope.userId = data.result.user.userId;
                    $httpService.setCookie($httpService.ADMIN_AUTH_NAME ,data.result.accessToken);
                    $httpService.setCookie($httpService.ADMIN_ID ,data.result.user.userId);
                    $httpService.setHeader($httpService.COMMON_AUTH_NAME,data.result.accessToken);
                    window.location.href="/index.html#/product_list";
                }else{
                    //WarningBox(data.msg);
                }
            }).catch(function(error){
                if(error.code != 'NotAuthorized'){
                    ErrorBox('服务器内部错误');
                }else{

                }
            });
        }
        if(adminId && adminToken){
            $scope.refreshToken();
        }
        $scope.onLogin = function(){
            if($scope.username ==null || $scope.username==""){
                WarningBox("请输入用户名");
                return;
            }
            if($scope.password ==null || $scope.password==""){
                WarningBox("请输入密码");
                return;
            }
            var params = {
                "method":'usernamepassword',
                "userName":$scope.username,
                "password":$scope.password
            }
            $httpService.post($hostService.loginApi+'/auth/tokens',params).then(function(data){
                if(data.success){
                    if(data.result.user.type == 'internal'){
                        $httpService.setCookie($httpService.ADMIN_AUTH_NAME ,data.result.accessToken);
                        $httpService.setCookie($httpService.ADMIN_ID ,data.result.user.userId);
                        $httpService.setCookie($httpService.USER_NAME ,data.result.user.userName);
                        $rootScope.userId = data.result.user.userId;
                        $rootScope.loginUserName = data.result.user.userName;
                        window.location.href="/index.html#/product_list";
                    }else{
                        InfoBox('用户权限不足无法登陆!');
                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function (error) {
                if (error.code != 'NotAuthorized') {
                    ErrorBox('服务器内部错误');
                } else {
                    WarningBox('用户名或密码错误!');
                }
            });

        }
    }
])