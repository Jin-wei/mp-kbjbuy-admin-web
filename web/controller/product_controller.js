app.controller('productController', ['$rootScope','$scope','$httpService','$hostService', function($rootScope,$scope,$httpService,$hostService) {

    $scope.products = [];
    $scope.categories = [];
    $scope.sCategories = [];
    $scope.bigCategory = '';
    $scope.smallCategory = '';
    $scope.productName = '';
    $scope.productFactory = '';
    $scope.supplierList = [];
    $scope.recommendList = [];
    $scope.recommend = '';

    var start= 0;
    var size = 20;
    $scope.currentPage=1;
    $scope.totalPage=1;
    $scope.totalNum=0;

    changeClass('productMenu','productMenu1');
    FormPlugins.init();

    var priceId ="";
    $scope.onClickChk = function(val,priceChk){
        if(priceChk == true){
            priceId += val+",";
        }else{
            priceId = priceId.replace(val+",","");
        }
    }


    //获取分类信息
    function getAllCategories() {
        var url = $hostService.productApi+'/biz/0/prodTypes';
        $httpService.get(url).then(function(data){
            if (data.success) {
                $scope.categories = sortCategory(data.result);
            }else{
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });
    }

    //获取大类的名称
    $scope.getBigCategoryName =function(id){
        var name = '';
        for(var i in $scope.categories){
            if(id == $scope.categories[i].id){
                name = $scope.categories[i].name;
                break;
            }
        }
        return name;
    }

    $scope.categoryChanged = function(){
        if($scope.bigCategory.length>0){
            for (var i in $scope.categories){
                var obj = $scope.categories[i];
                if(obj.id == $scope.bigCategory){
                    $scope.sCategories = obj.value;
                }
            }
        }else{
            $scope.smallCategory = '';
            $scope.sCategories =[];
        }
    };

    //搜索重置
    $scope.onReset = function(){
        $scope.bigCategory = '';
        $scope.smallCategory = '';
        $scope.productName = '';
        $scope.productFactory = '';
        $scope.recommend = '';
    };

    //请求参数
    function buildRequestData(){
        var params = {};
        if($scope.bigCategory.length>0){
            params.parentTypeId = $scope.bigCategory;
        }

        if($scope.smallCategory.length>0){
            params.typeId = $scope.smallCategory;
        }

        if($scope.productName.length>0){
            params.name = $scope.productName;
        }

        if($scope.productFactory.length>0){
            params.bizId = $scope.productFactory;
        }

        params.start = start;
        params.size = size;
        return objToStr(params);
    }

    //搜索点击
    $scope.clickSearch = function(){
        if($scope.recommend.length>0){
            $scope.products = $scope.recommendList;
        }else{
            start = 0;
            $scope.productRequest();
        }

    }

    //上架,下架
    var _active = -1
    $scope.activeFliter = function(active){
        start = 0;
        $scope.currentPage=1;
        _active = active;
        $scope.productRequest()
    }

    //获取商品列表
     $scope.productRequest = function() {
         var add = '';
         if(_active>=0){
             add = '&active='+_active;
         }
        var url = $hostService.productApi+'/prods'+buildRequestData()+add;
        $httpService.get(url).then(function(data){
            if (data.success) {
                $scope.totalNum = data.total;
                $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                $scope.products = data.result;
            }else{
                $scope.products = [];
            }
        }).catch(function(data){
            ErrorBox('服务器内部错误');
        });
    }

    //编辑
    $scope.clickEdit = function (prodId,bizId) {
        window.location.href = '#/product_detail?prodId='+prodId+'&bizId='+bizId;
    }

    function getSelects(){
        var spCodesTemp = [];
        $('input:checkbox[name=checkboxId]:checked').each(function(i){
            spCodesTemp.push($(this).val());
        });
        return spCodesTemp;
    }

    $scope.clickDelete = function () {
        $('#sure-dialog').modal('show');
    }

    $scope.operateDelete = function(){
        var deleteIds = getSelects();
        for(var i in deleteIds){
            var url = $hostService.productApi+'/biz/'+0+'/prods/'+deleteIds[i];
            $httpService.delete(url).then(function(data){
                if (data) {
                    InfoBox('商品停用成功');
                    $scope.productRequest();
                }else{
                }
            }).catch(function(data){
                ErrorBox('服务器内部错误');
            });
        }
    }

    //turn the page
    //turnFlag:1:to previous page;2:to next page;3:to specified page;0:to first page;9:to last page
    $scope.turnPage = function (turnFlag){
        if(turnFlag==0){
            $scope.currentPage=1;
            start = 0;
            $scope.productRequest()
        }else{
            var pageFlag = turnPage(turnFlag,$scope,start,size);
            if(pageFlag!=-1){
                start = pageFlag;
                $scope.productRequest()
                //get table data
            }
        }

    };

    //获取供应商列表
    $scope.getSupplierList = function () {
        var url = $hostService.bizApi+'/biz?bizType=供应商';
        $httpService.get(url).then(function(data){
            if (data.success) {
                $scope.supplierList = data.result;
            } else {
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('获取经销商列表内部错误');
        })
    };

    $scope.getSupplierName = function(id){
        for (var i in $scope.supplierList){
            if(id == $scope.supplierList[i].bizId){
                return $scope.supplierList[i].bizName;
            }
        }
        return '暂无';
    }

    //设置分类
    $scope.categorySetting = function(){
        window.location.href = 'index.html#/'
    }

    //获取推荐的类型
    function getTagsList () {
        var url = $hostService.productApi+'/tags';
        $httpService.get(url).then(function(data){
            if (data) {
                $scope.tags = data.result;
            } else {
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('推荐类型服务器内部错误');
        })
    };

    //获取首页推荐的商品列表
    function getRecommendList (tagId) {
        var url = $hostService.productApi+'/tags/'+tagId+'/prods'
        $httpService.get(url).then(function(data){
            if(data.success){
                $scope.recommendList = data.result;
            }
        }).catch(function(error){
            ErrorBox('获取首页推荐商品服务器内部错误');
        })
    }

    function getTagByProdductId(prodId){
        var bool = false;
        for(var i in $scope.recommendList){
            var obj = $scope.recommendList[i];
            if(prodId == obj.prodId){
                bool = true;
            }
        }
        return bool;
    }
    //编辑分类
    $scope.clickCategorySetting = function(){
        window.location.href = 'index.html#/category_list';
    }

    $scope.clickBannerSetting = function(){
        window.location.href = 'index.html#/banner_list';
    }

    getAllCategories();
    $scope.activeFliter(1);
    $scope.getSupplierList();
    getTagsList();
    getRecommendList(1);
}]);
