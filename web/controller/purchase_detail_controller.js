app.controller("purchaseDetailController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {
        var itemId = $location.search().itemId;

        $scope.opItem = null;

        //获取商品采购列表
        $scope.getPurchaseItem = function() {
            var url = $hostService.bizApi+'/poitems?id='+itemId;
            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.opItem = data.result[0];
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        };

        //保存采购单信息
        $scope.savePurchaseItem = function() {
        };

        //取消
        $scope.backToList = function() {
            window.history.back();
        };

        $('#createTime').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        $scope.getPurchaseItem();
    }
]);
