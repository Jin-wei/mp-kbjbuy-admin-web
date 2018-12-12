app.controller('categoryListController', ['$rootScope','$scope','$httpService','$hostService',
    function($rootScope,$scope,$httpService,$hostService) {

        $scope.categoryList = [];

        //获取九宫格信息
        function getCategories() {
            var url = $hostService.productApi+'/biz/0/tags/1/prodTypeProdCount';
            $httpService.get(url).then(function(data){
                if(data.success){
                    $scope.categoryList = data.result;
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('获取九宫格服务器内部错误');
            })
        }

        //获取分类
        function getProdTypes() {
            var url = $hostService.productApi+'/biz/0/prodTypes';
            $httpService.get(url).then(function(data){
                if(data.success){
                    $scope.prodTypesList = data.result;
                    var tempy=[];
                    for(var i=0;i<$scope.prodTypesList.length;i++){
                        if($scope.prodTypesList[i].parentTypeId==null){
                            tempy.push($scope.prodTypesList[i]);
                        }
                    }
                    for(var i=0;i<$scope.prodTypesList.length;i++){
                        for(var j=0;j<tempy.length;j++){
                            if($scope.prodTypesList[i].parentTypeId===tempy[j].typeId){
                                $scope.prodTypesList[i].parentTypeId=tempy[j].name;
                            }
                        }

                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('获取分类服务器内部错误');
            })
        }

        //上传分类图片
        $scope.uploadImage = function(dom){
            var index = $(dom).attr('id');
            var category = $scope.categoryList[index];
            var typeId = category.typeId;
            var filename = $(dom).val();
            var checkFlag = checkUploadImage(filename,dom);
            if(checkFlag==1){
                $scope.$dom = $(dom).prev();
                var url = $hostService.imageApi+'/imageSets';
                console.log($(dom).parent());
                console.log(filename);
                $httpService.formPost($(dom),url,function(data){
                    if(data.success){
                        $(dom).val('');
                        setCategoryCover(data.id,typeId);
                    }else{
                        WarningBox('上传图片失败');
                    }
                },function(error){
                    ErrorBox('上传图片服务器内部错误');
                })
            }
        };

        //设置分类封面
        function setCategoryCover(imageId,typeId){
            var url = $hostService.productApi+'/prodTypeImages?bizId=0';
            var params =
            {
                "prodTypeImages":
                    [
                        {
                            "typeId": typeId,
                            "imgUrl": imageId,
                            "active": 1,
                            "description": ''
                        }
                    ]
            }
            $httpService.post(url,params).then(function(data){
                if(data.success){
                    if(data.success){
                        setPrimaryFlag(imageId,typeId);
                    }else{
                        //WarningBox(data.msg);
                    }
                }
            }).catch(function(error){
                ErrorBox('设置分类封面服务器内部错误');
            })
        }

        $scope.clickOperation = function(typeId){
            window.location.href = 'index.html#/updateType?typeId='+typeId
        }

        function setPrimaryFlag(imageId,typeId){
            var url = $hostService.productApi+'/prodTypeImagesPrimFlag';
            var params = {
                "typeId": typeId,
                "imgUrl": imageId,
                "active": 1,
                "description": ''
            }
            $httpService.put(url,params).then(function(data){
                if(data.success){
                    if(data.success){
                        InfoBox('分类图片设置成功');
                        getCategories();
                    }else{
                       //WarningBox(data.msg);
                    }
                }
            }).catch(function(error){
                ErrorBox('设置分类封面服务器内部错误');
            })
        }

        $rootScope.imageSize = function(size){
            return $hostService.imageApi+'/sizes/'+size+'/imageSets/';
        };

        $scope.deleteCategory=function (id) {
            var url = $hostService.productApi+'/prodTypes/'+id;
            $httpService.delete(url).then(function(data){
                if(data.success){
                    if(data.success){
                        InfoBox('删除成功！');
                        getProdTypes();
                    }else{
                        //WarningBox(data.msg);
                    }
                }
            }).catch(function(error){
                ErrorBox('设置分类封面服务器内部错误');
            })
        };

        $scope.editProdTypes=function (id) {
            window.location.href = 'index.html#/categoryAdd?typeId='+id;
        };

        getProdTypes();
       /* getCategories();*/
    }
]);
