app.controller('categoryAddController', ['$rootScope','$scope','$httpService','$hostService','$location', function($rootScope,$scope,$httpService,$hostService,$location) {
    $scope.categories = [];
    $scope.sCategories =[];
    $scope.supplierList = [];
    $scope.smallCategory = '';
    $scope.floorPrice = '';
    $scope.wholesalePrice = '';
    $scope.imageDes = $hostService.imageApi+'/images/';
    $scope.params={
        name:"",
        nameLang:'',
        bizId:0,
        parentTypeId:'',
        active:'1',
        externalId:'',
        displayOrder:"",
        description:"",
        nineShow:'',//九宫格
        imgUrl:''
    };
    $scope.typeId='';
    const typeId= $location.search().typeId;
    const PRODUCT_IMAGE_COVER='';
    const PRODUCT_IMAGE_BANNER = 4;//9宫格
    var nineData='';
    if(typeId){
        $scope.typeId=typeId;
    }

    $scope.categoryChanged = function(){
        if($scope.params.parentTypeId.length>0){
            for (var i in $scope.categories){
                var obj = $scope.categories[i];
                console.log(obj);
                if(obj.id == $scope.params.parentTypeId){
                    if(obj.value.length>0){
                        $scope.params.displayOrder = obj.value[obj.value.length-1].displayOrder+1;
                    }else{
                        $scope.params.displayOrder=1;
                    }
                }
            }
        }else{
            $scope.params.displayOrder=$scope.categories[$scope.categories.length-1].displayOrder+1;
        }
    };
    //获取分类信息
    function getAllCategories() {
        var url = $hostService.productApi+'/biz/0/prodTypes';
        $httpService.get(url).then(function(data){
            if (data.success) {
                if(data.result.length>0){
                    $scope.categories = sortCategory(data.result);

                    $scope.params.displayOrder=$scope.categories[$scope.categories.length-1].displayOrder+1;
                    window.setTimeout(function () {
                        if(typeId){
                            getDetail();
                            var temy=[];
                            for(var i=0;i< $scope.categories.length;i++){
                                if($scope.categories[i].id!=typeId){
                                    temy.push($scope.categories[i]);
                                }
                            }
                            $scope.categories=temy;
                        }
                    },100);
                }

            }else{
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });
    }

    //获取详情分类信息
    function getDetail() {
        var url = $hostService.productApi+'/biz/0/prodTypes/'+typeId;
        $httpService.get(url).then(function(data){
            if(data!={} && data!="" && data!=null){
                $scope.detailData=data;
                $scope.params.name=data.name;
                $scope.params.nameLang=data.nameLang;
                $scope.params.parentTypeId=data.parentTypeId;
                if($scope.params.parentTypeId!=null){
                    $scope.params.parentTypeId=$scope.params.parentTypeId.toString();
                }
                $scope.params.active=data.active;
                $scope.params.displayOrder=data.displayOrder;
                $scope.params.description=data.description;
                $scope.params.imgUrl=data.imgUrl;
                $scope.params.nineShow=data.nineShow;
                $scope.params.typeId=data.typeId;
                if(data.images){
                   $scope.imageArr=data.images;
                }else{
                    $scope.imageArr=[];
                }
                if($scope.detailData.tags){
                    nineData=$scope.detailData.tags;
                    if($scope.detailData.tags.length>0){
                        $scope.params.nineShow="1";
                    }else{
                        $scope.params.nineShow="0";
                    }
                }else{
                    nineData=[];
                    $scope.params.nineShow="0";
                }
            }else{
                $scope.params={
                    name:"",
                    nameLang:'',
                    bizId:0,
                    parentTypeId:'',
                    active:'1',
                    externalId:'',
                    displayOrder:"",
                    describe:"",
                    nineShow:'',//九宫格
                    imgUrl:''
                };
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });
    }


    function getCategories() {
        var url = $hostService.productApi+'/biz/0/tags/1/prodTypeProdCount';
        $httpService.get(url).then(function(data){
            if(data.success){
                $scope.categoryCount = data.result.length;
            }else{
                WarningBox(data.msg);
            }
        }).catch(function(error){
            ErrorBox('获取九宫格服务器内部错误');
        })
    };

    //请求参数
    function requestParams() {
        var params=$scope.params;
        if(params.parentTypeId===""){
            params.parentTypeId=null;
        }
        for(var key in params){
            if(params[key]===""){
                delete params[key];
            }
        }
        var paramsStr={
            prodType:[]
        };

        paramsStr.prodType.push(params);
        return paramsStr;

    }

    //新增 修改分类
    $scope.addCategory = function () {
        if(typeId){
            putProductType();
        }else{
            addproductType();
        }

    };

    //增加分类
    function addproductType() {
        var paramsStr=requestParams();
        var url = $hostService.productApi+'/biz/0/prodTypes';
        var typeId='';
        $httpService.post(url, paramsStr).then(function(data){
            if(data.success){
                if (data.result[0].success) {
                    typeId=data.result[0].id;
                    addNine(typeId,1);
                }else{
                    WarningBox(data.result[0].msg);
                }
            }else{
                WarningBox(data.msg);
            }
        }).catch(function (error) {
            ErrorBox('新增商品服务器内部错误');
        });
    }

    //增加九宫格
    function addNine(id,type) {
        var paramsStr=requestParams();
        var params={
            prodTypes:[]
        };
        params.prodTypes.push(id);
        var message='';
        if(type==1){
            message='新增分类成功！';
        }else{
            message='修改分类成功！';
        }
        if($scope.params.nineShow==1){
            $httpService.post($hostService.productApi+'/tags/1/prodTypes',params).then(function(data){
                if(data.success){
                    InfoBox(message);
                    return;
                    window.location.href = 'index.html#/category_list';

                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('服务器内部错误');
            })
        }else{
            InfoBox(message);
            window.location.href = 'index.html#/category_list'
        }
    }


    //修改分类
    function putProductType() {
        var paramsStr=requestParams();
        $httpService.put($hostService.productApi+'/prodTypes',paramsStr).then(function(data){
            if(data.success){
                InfoBox('更新信息成功');
                window.location.href = 'index.html#/category_list'
            }else{
                WarningBox(data.msg);
            }
        }).then(function () {
          if(nineData.length>0){
              if($scope.params.nineShow=='0'){
                  deleteNine(typeId);
              }
          }else{
              if($scope.params.nineShow=='1'){
                  addNine(typeId,2);
              }
          }
        }).catch(function(error){
            ErrorBox('修改分类服务器内部错误');
        })
    }

    function deleteNine(id) {
        var params = {
            prodTypes:[]
        };
        var numberId=parseInt(id);
        params.prodTypes.push(numberId);
        $httpService.delete($hostService.productApi+'/tags/1/prodTypes?',{data:params}).then(function(data){
            if(data.success){
            }else{
                WarningBox(data.msg);
            }
        }).catch(function(error){
            ErrorBox('删除九宫格服务器内部错误');
        })
    }



    //上传分类图片
    $scope.uploadImage = function(dom){
        var typeId = $scope.typeId;
        var filename = $(dom).val();
        $scope.$dom = $(dom).prev();
        if($scope.imageArr.length>0){
            WarningBox('9宫格图片唯一，请删除之前的图片！');
            $('#imgFile').val('');
            return
        }
        var checkFlag = checkUploadImage(filename,dom);
        if(checkFlag==1){
            var url = $hostService.imageApi+'/imageSets';
            $httpService.formPost($(dom).parent(),url,function(data){
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

    $rootScope.imageSize = function(size){
        return $hostService.imageApi+'/sizes/'+size+'/imageSets/';
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
                    getDetail();
                }else{
                    //WarningBox(data.msg);
                }
            }
        }).catch(function(error){
            ErrorBox('设置分类封面服务器内部错误');
        })
    }

    //删除图片
    $scope.deleteImage = function(imgId,index){
        //解除与product的关联
        var imgParams={
            typeId:parseInt(typeId),
            imgUrl:imgId
        };
        var url = $hostService.productApi+'/prodTypeImages';
        $httpService.delete(url,{data:imgParams}).then(function(data){
            if(data.success){
                InfoBox('删除分类图片成功');
            }
        }).then(function(){
            //从服务器中删除图片资源
            var imageIds = [];
            imageIds.push(imgId);
            var params = {
                "imageIds":imageIds
            };
            $httpService.delete($hostService.imageApi+'/images',{data:params}).then(function(data){
                if(data.success){
                    getDetail();
                }
            }).catch(function(){
                ErrorBox('删除图片资源服务器内部错误');
            });
        }).catch(function(error){
            ErrorBox('删除商品图片服务器内部错误');
        });
    };

    //取消推荐
    function removeTags (id){
        var url = $hostService.productApi+'/prodTypeImages?bizId=0'+'&imgId='+id;
        $httpService.delete(url).then(function(data){
            if (data.success) {
                InfoBox('已取消推荐');
            }else{
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('取消商品推荐服务器内部错误');
        })
    }

    //设置商品封面
    $scope.productCoverChanged = function(imageId){
        var url = $hostService.productApi+'/biz/'+bizId+'/prods/'+productId+'/prodImages/'+imageId+'/primaryImage';
        $httpService.put(url,{}).then(function(data){
            if(data.succeed){
                InfoBox('封面设置成功');
            }else{
                WarningBox(data.msg)
            }
        }).catch(function (error) {
            ErrorBox('设置商品封面服务器内部错误');
        });
    };



    getCategories();
    getAllCategories();


}]);
