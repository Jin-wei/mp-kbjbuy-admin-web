app.controller("orderDetailController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {
        var orderId = $location.search().orderId
        var start= 0;
        var size = 15;
        $scope.currentPage=1;
        $scope.totalPage=1;
        $scope.totalNum=0;

        $scope.orderItems = [];

        //根据orderId获取订单
        var url = $hostService.orderApi+'/orders?orderId='+orderId;
        $httpService.get(url).then(function(data){
            if (data.success) {
                for(var i=0;i<data.result.length;i++){
                    data.result[i].createdOn = new Date(data.result[i].createdOn).toLocaleString();
                    data.result[i].updatedOn = new Date(data.result[i].updatedOn).toLocaleString();
                    var status = data.result[i].status;
                    if(status == 'pending'){
                        data.result[i].status = '未付款'
                    }else if(status == 'payed'){
                        data.result[i].status = '已付款'
                    }else if(status == 'completed'){
                        data.result[i].status = '已完成'
                    }else if(status == 'canceled'){
                        data.result[i].status = '已取消'
                    }
                }
                $scope.order = data.result[0];
            }else{
                WarningBox(data.msg)
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });



        getOrderItem();
        function  getOrderItem(){
            $httpService.get($hostService.orderApi+'/orderitems?orderId='+orderId).then(function(data){
                if (data.success) {
                    $scope.totalNum = data.total-1;//-1  是去掉运费  运费也为一个orderItem
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                    for(var i in data.result){
                        if(data.result[i].productId != 0){
                            $scope.orderItems.push(data.result[i]);
                        }
                    }
                }else{
                    WarningBox(data.msg)
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }


        //turn the page
        //turnFlag:1:to previous page;2:to next page;3:to specified page;0:to first page;9:to last page
        $scope.turnPage = function (turnFlag){
            if(turnFlag==0){
                $scope.currentPage=1;
                start = 0;
                getOrderItem()
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    getOrderItem()
                    //get table data
                }
            }

        };
        $scope.selectIndex = 1;
        $scope.onSearch = function(index){
            $scope.selectIndex = index;
        }
    }
]);