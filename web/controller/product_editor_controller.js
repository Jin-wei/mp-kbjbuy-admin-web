app.controller('productEditorController', ['$rootScope','$scope','$httpService','$hostService','$filter', function($rootScope,$scope,$httpService,$hostService,$filter) {


    $scope.categories = [];
    $scope.sCategories =[];
    $scope.supplierList = [];
    $scope.smallCategory = '';
    $scope.floorPrice = '';
    $scope.wholesalePrice = '';
    $scope.unitOfMeasure = '';

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

    //请求参数
    function requestParams() {
        var params = new Object();
        params.prods = [];
        var p = new Object();
        var productName = $('#productName').val();
        if(productName.length > 0){
            p.name = productName;
        }else{
            ErrorBox('商品名不能为空！');
            return false
        }

        var prodCode = $('#prodCode').val();
        if(prodCode.length > 0) {
            p.prodCode = prodCode;
        }else{
            var productCodeText="SKU";
            if($filter('translate')('product-code-label')!='product-code-label'){
                productCodeText=$filter('translate')('product-code-label');
            }
            ErrorBox(productCodeText+'不能为空！');
            return false
        }

        var typeId = $('#smallCategory').val();
        if(typeId.length > 0) {
            p.typeId = typeId;
        }else{
            ErrorBox('小类不能为空！');
            return false
        }

        var price = $('#price').val();
        if(price.length > 0) {
            p.price = price;
        }else{
            var productPriceLabel="公示零售价";
            if($filter('translate')('product-price-label')!='product-price-label'){
                productPriceLabel=$filter('translate')('product-price-label');
            }
            ErrorBox(productPriceLabel+'不能为空！');
            return false
        }

        var wholesalePrice = $('#wholesalePrice').val();
        var wholesalePriceShow=$filter('translate')('product-wholesale-price-show');
        if(wholesalePrice.length > 0) {
            p.wholesalePrice = wholesalePrice;
        }else{
            if(wholesalePriceShow!='false'){
                ErrorBox('采购价不能为空！');
                return false
            }
        }

        var floorPrice = $('#floorPrice').val();
        var floorPriceShow=$filter('translate')('product-floor-price-show');
        if(floorPrice.length > 0) {
            p.floorPrice = floorPrice;
        }else{
            if(floorPriceShow!='false'){
                ErrorBox('最低售价不能为空！');
                return false
            }
        }


        var description = $('#description').val();
        var productFactoryShow=$filter('translate')('product-factory-show');
        if(description.length > 0) {
            p.description = description;
        }
        var factory = $('#factory').val();
        if(factory.length>0){
            p.bizId = factory;
            p.bizName = $('#factory option:selected').text();
            p.supplierName = p.bizName;
        }else{
            if(productFactoryShow!='false'){
                ErrorBox('生产厂商不能为空！');
                return false
            }
        }

        var lableArr=$(".labelSearch").select2("data");
        var labelParams=[];
        for(var i in lableArr){
            var temy={
                labelId:lableArr[i].id,
                labelName:lableArr[i].text,
            }
            if(temy.labelId==temy.labelName){
                temy.labelId='';
            }
            labelParams.push(temy);
        }

        p.label=labelParams;
        p.floorPrice = $scope.floorPrice;
        p.wholesalePrice = $scope.wholesalePrice;
        p.unitOfMeasure = $scope.unitOfMeasure;
        p.active = 1;
        params.prods.push(p);

        return params;
    }

    //发布商品
    $scope.distribution = function () {
        var paramsStr = requestParams();
        if(paramsStr){
            var bizId = paramsStr.prods[0].bizId ? paramsStr.prods[0].bizId : '0';
            var url = $hostService.productApi+'/biz/'+bizId+'/prods';
            if(paramsStr){
                $httpService.post(url, paramsStr).then(function(data){
                    if(data.success){
                        if (data.result[0].success) {
                            InfoBox('新增商品');
                            window.location.href = '#/product_list';
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

    getAllCategories();
    $scope.getSupplierList();

    $(document).ready(function() {
        $('.labelSearch').select2({
            language : "zh-CN",// 指定语言为中文，国际化才起效
            placeholder: "搜所标签",
            width: '100%',
            multiple: true,
            minimumInputLength: 1,
            tags: false,
            ajax : {
                url : $hostService.productApi+'/allLabel?',
                dataType : 'json',
                delay : 250,// 延迟显示
                allowClear:true,
                data : function(params) {
                    return {
                        lableName : params.term // 搜索框内输入的内容，传递到后端的parameter为name
                    };
                },
                processResults : function(data, params) {
                    var labelArr=[];
                    for(var i=0;i<data.length;i++){
                        var temy={
                            id:data[i].id,
                            text:data[i].label_name
                        }
                        labelArr.push(temy);
                    }
                    if(labelArr.length>0){
                        return {
                            results : labelArr// 后台返回的数据集
                        };
                    }else{
                        var initLabel=[
                            {
                                id:params.term,
                                text:params.term
                            }
                        ]
                        return {
                            results : initLabel// 后台返回的数据集
                        };
                    }
                },
                cache : true
            },
            escapeMarkup : function(markup) {
                return markup;
            }, // let our custom formatter work
            templateSelection : function(repo) {
                /*$('.labelSearch').val('');*/
                return repo.text;
            }//
        });

    });

}]);
