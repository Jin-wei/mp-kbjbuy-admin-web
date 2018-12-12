/**
 * Created by Cici on 2018/7/9.
 */
app.controller("encyclopediaCategoryController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {
        $scope.moduleName = '咖啡百科分类管理';
        changeClass('contentMenu','encyclopediaCategory');


        const CLICK_NEW = 1;//点击添加
        const CLICK_EDIT = 2;//点击编辑

        $scope.selectedInfos = [];

        var start = 0;
        var size = 20;
        var hasMore = false;

        //获取选中记录
        function selected(){
            var selArray = [];
            $('input:checkbox[name=checkboxId]:checked').each(function(i){
                selArray.push($(this).val());
            });
            $scope.selectedInfos = selArray;
            return selArray;
        }

        //获取咖啡百科
        function getInfoList (queryType) {
            if(queryType==10){
                start=0;
                $scope.currentPage=1;
                $scope.specifiedPage="";
            }
            $httpService.get($hostService.cmsApi+'/type?type=1&status=11&start=' + start + '&size=' + size).then(function(data){
                if(data.success){
                    hasMore = (data.result.length > size)?true:false;
                    $scope.infoList = data.result;
                    $scope.totalNum = data.result.total;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                    // setBtnStatus();
                }else{
                    WarningBox(data.msg);
                }
            }).then(function () {
                $httpService.get($hostService.cmsApi+'/typeCount?type=1&status=11&start=' + start + '&size=' + size).then(function (data) {
                    $scope.totalNum = data.result.count;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                })
            }).catch(function(error){
                ErrorBox('获取咖啡百科列表服务器内部错误');
            });
        }

        //添加
        $scope.clickNew = function(){
            $scope.clickType = CLICK_NEW;
            $scope.newInfo = '';
            document.getElementById("new").setAttribute("href","#edit-dialog");
        };

        $scope.addAnNewInfo = function(){
            if($scope.newInfo.length>0){
                var params = {
                    'name': $scope.newInfo,
                    'type': 1,
                    'shortId':parseInt($scope.totalNum)+1
                };

                $httpService.post($hostService.cmsApi+'/type',params).then(function(data){
                    if(data.success){
                        getInfoList();
                    }else{
                        WarningBox(data.msg);
                    }
                }).catch(function(error){
                    ErrorBox('发布咖啡百科服务器内部错误');
                });
            }else{
                WarningBox('创建的分类的名称不能为空');
            }
        }

        //停用
        $scope.stop = function(){
            selected();
            if($scope.selectedInfos.length<=0){
                WarningBox("请选择一条记录!");
                document.getElementById("stop").removeAttribute("href");
            }else{
                document.getElementById("stop").setAttribute("href","#sure-dialog");
            }
        };

        $scope.stopAnInfo = function(){
            for(var i=0;i<$scope.selectedInfos.length;i++){
                var jsonStr = $scope.selectedInfos[i];
                var obj = JSON.parse(jsonStr);
                var typeId = obj._id;
                var params = {
                    'typeId': typeId
                };

                $httpService.delete($hostService.cmsApi+'/type/'+typeId,params).then(function(data){
                    if(data.success){
                        getInfoList();
                    }else{
                        WarningBox(data.msg);
                    }
                }).catch(function(error){
                    ErrorBox('停用状态服务器内部错误');
                });
            }
        };

        //编辑
        $scope.edit = function(){
            $scope.clickType = CLICK_EDIT;
            selected();
            if($scope.selectedInfos.length<=0){
                WarningBox("请选择一条记录!");
                document.getElementById("edit").removeAttribute("href");
            }else{
                if($scope.selectedInfos.length<=1){
                    document.getElementById("edit").setAttribute("href","#edit-dialog");
                }else{
                    document.getElementById("edit").removeAttribute("href");
                    WarningBox('只能同时编辑一条记录!');
                }
                $scope.newInfo = JSON.parse($scope.selectedInfos[0]).name;
            }
        };

        $scope.editAnInfo = function(){
            for(var i=0;i<$scope.selectedInfos.length;i++) {
                var jsonStr = $scope.selectedInfos[i];
                var obj = JSON.parse(jsonStr);
                var params = {
                    'typeId': obj._id,
                    'typeInfo':{
                        'name': $scope.newInfo
                    }
                };
                $httpService.put($hostService.cmsApi+'/type/'+obj._id,params).then(function(data){
                    if(data.success){
                        InfoBox('更新一条咖啡百科分类');
                        getInfoList();
                    }else{
                        WarningBox(data.msg);
                    }
                }).then(function(){
                    updateCategoryName(obj);
                }).catch(function(error){
                    ErrorBox('更新咖啡百科分类服务器内部错误');
                });
            }
        }

        //更新二级分类名字
        function updateCategoryName(obj) {
            var params = {
                originType:{
                    "t1": "1",
                    "n1": "咖啡百科管理",
                    "t2": obj._id,
                    "n2": obj.name
                },
                newType:{
                    "t1": "1",
                    "n1": "咖啡百科管理",
                    "t2": obj._id,
                    "n2": $scope.newInfo
                }
            }
            $httpService.put($hostService.cmsApi+'/content/',params).then(function(data) {
                if (data.success) {
                    InfoBox('更新一条咖啡百科');
                    getInfoList();
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('更新咖啡百科务器内部错误');
            });
        }

        //设置启用状态
        $scope.setActiveStatus = function(info) {
            var active = info.active;
            if(active==1){
                $httpService.get($hostService.cmsApi+'/content?t1='+info._id).then(function(data){
                    if(data.success){
                        var array = data.result;
                        return array;
                    }else{
                        WarningBox(data.msg);
                    }
                }).then(function(array){
                    if(array.length>0){
                        WarningBox('该分类下有正在使用的咖啡百科，请移除后再停用。')
                    }else{
                        changeStatus(info);
                    }
                }).catch(function(error){
                    ErrorBox('咖啡百科列表服务器内部错误');
                });
            }else{
                changeStatus(info);
            }
        };

        function changeStatus(info){
            var active = info.active?0:1;
            var params = {
                'typeId': info._id,
                'active': active
            };

            $httpService.put($hostService.cmsApi+'/type/'+info._id+'/active/'+active,params).then(function(data){
                if(data.success){
                    getInfoList();
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('设置状态服务器内部错误');
            });
        }


        $scope.turnPage = function (turnFlag){
            if(turnFlag==0){
                getInfoList(10);
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    getInfoList(20);
                }
            }
        };

        getInfoList(10);
    }
]);