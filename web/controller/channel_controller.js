/**
 * Created by BaiBin on 16/8/11.
 */
app.controller("channelController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {
        changeClass('channelMenu','channelMenu1');

        $scope.dealerList = [];
        $scope.bizName = '';
        $scope.status = 1;

        var start = 0;
        var size = 20;
        var hasMore = false;

        $scope.addChannelClick = function (){
            window.location.href = 'index.html#/addChannel?type='+'经销商';
        };

        $scope.clickOperation = function (bizId){
            window.location.href = 'index.html#/dealerDetail?bizId='+bizId;
        };

        //删除经销商
        $scope.clickDelete = function (bizId){
            var url = $hostService.bizApi+'/biz/'+bizId;
            $httpService.delete(url).then(function(data){
                if (data) {
                    InfoBox('经销商删除成功');
                    $scope.getDealerList();
                } else {
                    //WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('删除经销商内部错误');
            })
        };

        //build
        function requestParams() {
            var params = {
                "bizType": '经销商'
            }
            if($scope.bizName.length>0){
                params.bizName = $scope.bizName;
            }
            if($scope.status>=0){
                params.active = $scope.status;
            }

            params.start = start;
            params.size = size+1;

            return objToStr(params);
        }

        //获取经销商列表
        $scope.getDealerList = function () {

            var url = $hostService.bizApi+'/biz'+requestParams();
            $httpService.get(url).then(function(data){
                if (data) {
                    $scope.dealerList = data.result.slice(0,size);
                    hasMore = (data.result.length > size)?true:false;
                    setBtnStatus();
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(data){
                ErrorBox('获取经销商列表内部错误');
            })
        };

        //状态查询
        $scope.statusSearch = function(status){
            start = 0;
            $scope.status = status;
            $scope.getDealerList();
        }

        //设置上下页可点状态
        function setBtnStatus() {
            //preBtn
            if (start > 0) {
                $('#preBtn').removeClass('disabled');
                $('#preBtn').attr('disabled',false);
            } else {
                $('#preBtn').attr('disabled',true);
            }
            //nextBtn
            if (hasMore) {
                $('#nextBtn').removeClass('disabled');
                $('#nextBtn').attr('disabled',false);
            } else {
                $('#nextBtn').attr('disabled',true);
            }
        }

        $scope.prePage = function(){
            start -= size;
            $scope.getDealerList();
            setBtnStatus();
        }

        $scope.nextPage = function(){
            start += size;
            $scope.getDealerList();
            setBtnStatus();
        }

        $scope.getDealerList();
    }]);
