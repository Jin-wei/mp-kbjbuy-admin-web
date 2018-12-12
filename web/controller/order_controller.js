app.controller("orderController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {

        changeClass('orderMenu','orderMenu1');

        var start= 0;
        var size = 10;
        $scope.currentPage=1;
        $scope.totalPage=1;
        $scope.totalNum=0;
        var nowStatus = 1;

        function getchannelList(){
            //获取供应商列表
            var url = $hostService.bizApi+'/biz?bizType=经销商';
            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.channelList = data.result;
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('获取经销商列表内部错误');
            })
        }

        $scope.onSearch = function (status) {
            nowStatus = status;
            getNowOrderArr(status)
        }

        $scope.searchClick = function(){
            start= 0;
            size = 10;
            $scope.currentPage=1;
            $scope.totalPage=1;
            $scope.totalNum=0;
            nowStatus = 1;
            getOrder();
        }

        function getNowOrderArr(status){
            var nowArr = [];
            for(var i=0;i<$scope.orders.length;i++){
                if(status == 1){
                    if($scope.orders[i].status == '未付款' || $scope.orders[i].status == '已付款' || $scope.orders[i].status == '货到付款'){
                        nowArr.push($scope.orders[i]);
                    }
                }else if(status == 2){
                    if($scope.orders[i].status == '已完成' || $scope.orders[i].status == '已取消'){
                        nowArr.push($scope.orders[i]);
                    }
                }else{
                    nowArr = $scope.orders;
                    break;
                }
            }
            $scope.nowArr = nowArr;
        }

        getOrder()
        function getOrder(){
            var url = $hostService.orderApi+'/orders?start='+start+'&size='+size;
            var startDate = $('#startDate2').val();
            if(startDate!=null && startDate!=""){
                url+='&startDate='+new Date($('#startDate2').val()).toLocaleDateString();;
            }
            var endDate = $('#endDate2').val();
            if(endDate!=null && endDate!=""){
                url+='&endDate='+new Date($('#endDate2').val()).toLocaleDateString();
            }
            var orderId = $('#orderId').val();
            if(orderId!=null && orderId!=""){
                url+='&orderId='+orderId
            }
            var name = $('#userName').val();
            if(name!=null && name!=""){
                url+='&name='+name
            }
            var phone = $('#phone').val();
            if(phone!=null && phone!=""){
                url+='&phone='+phone
            }
            var channel = $('#channel').val();
            if(channel!=null && channel!=""){
                url+='&bizName='+channel;
            }
            $httpService.get(url).then(function(data){
                if (data.success) {
                    $scope.totalNum = data.total;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                    for(var i=0;i<data.result.length;i++){
                        data.result[i].createdOn = new Date(data.result[i].createdOn).toLocaleString();
                        var status = data.result[i].status;
                        if(status == 'pending'){
                            data.result[i].status = '未付款'
                        }else if(status == 'payed'){
                            data.result[i].status = '已付款'
                        }else if(status == 'completed'){
                            data.result[i].status = '已完成'
                        }else if(status == 'canceled'){
                            data.result[i].status = '已取消'
                        }else if(status == 'confirmed'){
                            data.result[i].status = '货到付款'
                        }
                    }
                    $scope.orders = data.result;
                    getNowOrderArr(nowStatus);
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
                getOrder()
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    getOrder()
                    //get table data
                }
            }

        };

        $scope.detailClick = function(orderId){
            window.location.href = 'index.html#/order_detail?orderId='+orderId;
        }


        $('#startDate2').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        $('#endDate2').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        //FormPlugins.init();

        //reset
        $scope.onReset = function(){
            $('#userName').val("");
            $('#orderId').val("");
            $('#startDate2').val("");
            $('#endDate2').val("");
            $('#channel').val("");
        };

        getchannelList();
    }
]);