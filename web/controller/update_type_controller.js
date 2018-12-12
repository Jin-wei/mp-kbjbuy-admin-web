/**
 * Created by BaiBin on 2017/4/19.
 */
app.controller('updateTypeController', ['$rootScope','$scope','$httpService','$hostService','$location',
    function($rootScope,$scope,$httpService,$hostService,$location) {

        //获取大类信息
        $httpService.get($hostService.productApi+'/biz/0/prodTypes').then(function(data){
            if(data.success){

            }else{
                WarningBox(data.msg);
            }
        }).catch(function(error){
            ErrorBox('获取九宫格服务器内部错误');
        })
        //获取九宫格信息
        var typeId = $location.search().typeId;
        var url = $hostService.productApi+'/biz/0/tags/1/prodTypeProdCount';
        $httpService.get(url).then(function(data){
            if(data.success){
                for(var i=0;i<data.result.length;i++){
                    if(data.result[i].typeId == typeId){
                        $scope.type = data.result[i];
                        break;
                    }
                }
            }else{
                WarningBox(data.msg);
            }
        }).catch(function(error){
            ErrorBox('获取九宫格服务器内部错误');
        })


        $scope.cancleClick = function(){
            window.location.href = 'index.html#/category_list'
        }
        $scope.saveClick = function(){
            var params = {
                'name':$scope.type.name,
                'description':$scope.type.description,
            }
            //获取大类信息
            $httpService.put($hostService.productApi+'/biz/0/prodTypes/'+typeId,params).then(function(data){
                if(data.success){
                    InfoBox('更新信息成功')
                    window.location.href = 'index.html#/category_list'
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('服务器内部错误');
            })
        }
    }
]);