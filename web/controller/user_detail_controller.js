/**
 * Created by BaiBin on 16/8/10.
 */
app.controller("userDetailController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService ) {
        var userId = $location.search().userId;
        var relationId = $location.search().relationId;
        var oldBizId = 0;


        getAddress($rootScope);



        //选择省之后,更新市
        $('#province').change(function(e){
            var index = $(this).children('option:selected').val();
            $scope.cityArr = $scope.addressArr[index].city;
            $scope.$apply('cityArr');
        });


        $scope.saveClick = function(){
            var active = 0;
            if ($scope.user.active == '活跃'){
                active = 1;
            }

            var index = $("#province").children('option:selected').val();
            var province = $scope.addressArr[index].name;
            var param = {
                "bizCustomers": [
                    {
                        'phoneNo':$scope.user.phoneNo,
                        "name": $scope.user.name,
                        'bizId':oldBizId,
                        'relationId': relationId,
                        "active": active,
                        "address": $scope.user.address,
                        "city": $scope.user.city,
                        "province": province,
                        'zipcode':$scope.user.zipcode,
                        'description':$scope.user.description,
                        'ownerName':$scope.user.ownerName,
                        'longitude':$scope.user.longitude,
                        'latitude':$scope.user.latitude,
                        "note": $scope.user.note,
                        "custType": $scope.user.custType,
                        "chainName": $scope.user.chainName,
                        "supportPayLater": $scope.user.supportPayLater ? parseInt($scope.user.supportPayLater):1,
                        "custSince": $scope.user.custSince ? $scope.user.custSince.substring(0,10):'',
                        "contactName": $scope.user.contactName,
                        "ownerName": $scope.user.ownerName,
                        "ownerPhone": $scope.user.ownerPhone
                    }
                ]
            }
            $httpService.put($hostService.bizApi+'/customers',param).then(function(data){
                if (data.success) {
                    InfoBox('保存成功!');
                    //修改经销商
                    changeBiz();
                }else{
                    WarningBox(data.msg)
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }

        function changeBiz(){
            var biz = null;
            for(var i =0;i<$scope.channelList.length;i++) {
                if ($scope.user.channelName == $scope.channelList[i].bizName) {
                    biz = $scope.channelList[i];
                    break;
                }
            }
           var param = {
                "bizCustomers": [
                {
                    "bizId": biz.bizId,
                    "relationId": relationId
                }
            ]
            }
            $httpService.post($hostService.bizApi+'/customerbiz',param).then(function(data){
                if (data.success) {

                }else{
                    WarningBox(data.msg)
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }

        $scope.cancleClick = function(){
            window.history.go(-1);
        }


        //获取用户信息
        var url = $hostService.bizApi+'/customers?relationId='+relationId;
        $httpService.get(url).then(function(data){
            if (data.success) {
                if(data.result.length > 0){
                    oldBizId = data.result[0].bizId;
                    data.result[0].createdOn = new Date(data.result[0].createdOn).toLocaleString();
                    data.result[0].active = data.result[0].active == 0?'停用':'活跃';
                    $scope.user = data.result[0];
                    setBiz();

                    var state = data.result[0].province;
                    var city = data.result[0].city;
                    var nowProvinceIndex=0;
                    var nowCityIndex = 0;
                    for (var i=0;i<$scope.addressArr.length;i++){
                        if(state == $scope.addressArr[i].name){
                            nowProvinceIndex = i;
                            $scope.cityArr = $scope.addressArr[i].city;
                            for (var j=0;j<$scope.cityArr.length;j++){
                                if(city == $scope.cityArr[j].name){
                                    nowCityIndex = j;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    //设置选中当前省,市
                    window.setTimeout(function(){
                        var id1 = '#opt-p'+ nowProvinceIndex;
                        //var id2 = '#opt-c'+ nowCityIndex;
                        $(id1).attr("selected",'');
                        //$(id2).attr("selected",'');
                    },100);


                }
            }else{
                WarningBox(data.msg)
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });

        var start = 0;
        var size = 10;
        //getOrder()
        function getOrder(){
            var url = $hostService.orderApi+'/orders?start='+start+'&size='+(size+1)+'&relationId='+relationId;
            $httpService.get(url).then(function(data){
                if (data.success) {
                    if(start >= size){
                        $('#preBtn').removeClass('disabled');
                        $('#preBtn').attr('disabled',false);
                    }else{
                        $('#preBtn').attr('disabled',true);
                    }
                    if (data.result.length < size+1){
                        $('#nextBtn').attr('disabled',true);
                        hasMore = false;
                    }else{
                        $('#nextBtn').removeClass('disabled');
                        $('#nextBtn').attr('disabled',false);
                        hasMore = true;
                    }
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
                        }
                    }
                    $scope.orders = data.result.slice(0,size);
                }else{
                    WarningBox(data.msg)
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }
        $scope.prePage = function(){
            if(start >= size){
                start -= size;
                getOrder();
            }
        }

        $scope.nextPage = function(){
            if (hasMore){
                start += size;
                getOrder();
            }
        }

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

        //设置经销商内容
        function setBiz(){
            for(var i in $scope.channelList){
                var biz = $scope.channelList[i];
                if($scope.user.bizId == biz.bizId){
                    $scope.user.channelName = biz.bizName;
                    break;
                }
            }
        }

        $scope.detailClick = function(index){
            var orderId = $scope.orders[index].orderId;
            window.location.href = 'index.html#/order_detail?orderId='+orderId;
        }
        $scope.selectIndex = 1;
        $scope.onSearch = function(selectIndex){
            $scope.selectIndex = selectIndex;
        }

        $('#custSince').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        getchannelList();

    }]);