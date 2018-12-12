app.controller("purchaseListController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {

        var start = 0;
        var size = 10;

        $scope.currentPage=1;
        $scope.totalPage=1;
        $scope.totalNum=0;

        $scope.showDetail = function (itemId) {
            window.location.href = 'index.html#/purchaseDetail?itemId='+itemId;
        };

        $scope.purchaseList = [];

        //请求参数
        function buildRequestData(index){
            var params = {};
            if(index){
                start = 0;
            }
            if ($scope.purchaseId) {
                params.id = $scope.purchaseId;
            }
            if ($scope.supplierName) {
                params.supplierName = $scope.supplierName;
            }
            if ($scope.prodName) {
                params.prodName = $scope.prodName;
            }
            if ($scope.prodCode) {
                params.prodCode = $scope.prodCode;
            }
            if ($scope.startDate) {
                params.startDate = $scope.startDate;
            }
            if ($scope.endDate) {
                params.endDate = $scope.endDate;
            }
            params.start = start;
            params.size = size+1;
            return objToStr(params);
        }

        //获取商品采购列表
        $scope.getPurchaseList = function(index) {
            var url = $hostService.bizApi+'/poitems'+buildRequestData(index);
            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.totalNum = data.total;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                    if (data.result.length) {
                        $scope.purchaseList = data.result.slice(0,size);
                    }
                }else{
                    $scope.purchaseList = [];
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        };

        $('#startDate').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        $('#endDate').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        //turn the page
        //turnFlag:1:to previous page;2:to next page;3:to specified page;0:to first page;9:to last page
        $scope.turnPage = function (turnFlag){
            if(turnFlag==0){
                $scope.currentPage=1;
                start = 0;
                $scope.getPurchaseList()
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    $scope.getPurchaseList()
                }
            }
        };

        $scope.searchClick = function(){
            start= 0;
            size = 10;
            $scope.currentPage=1;
            $scope.totalPage=1;
            $scope.totalNum=0;
            $scope.getPurchaseList(1);
        };

        $scope.getPurchaseList();

    }
]);
