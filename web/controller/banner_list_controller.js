app.controller('bannerListController', ['$rootScope','$scope','$httpService','$hostService',
    function($rootScope,$scope,$httpService,$hostService) {

        $scope.bannerList = [];

        //获取banner信息
        function getBanners() {
            $httpService.get($hostService.productApi+'/biz/0/tags/2/prods').then(function(data){
                if(data.success){
                    $scope.bannerList = data.result
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('获取banner列表服务器内部错误');
            })
        }

        $rootScope.imageSize = function(size){
            return $hostService.imageApi+'/sizes/'+size+'/imageSets/';
        };

        getBanners();
    }
]);
