app.controller('productDetailController', ['$rootScope','$location','$scope','$httpService','$hostService', 'FileUploader',function($rootScope,$location,$scope,$httpService,$hostService,FileUploader) {

    const PRODUCT_IMAGE_COVER = 1;//封面
    const PRODUCT_IMAGE_DESCRIPTION = 2;//商品描述图
    const PRODUCT_IMAGE_BANNER = 3;//商品的推广banner
    const PRODUCT_FILE = 4;//商品附件

    const IMAGE_TYPE_COVER = 'cover';
    const IMAGE_TYPE_DESCRIPTION = 'description';
    const IMAGE_TYPE_BANNER = 'banner';
    const IMAGE_FILE = 'file';


    var productId = $location.search().prodId;
    var bizId = $location.search().bizId;

    $scope.imageM = $hostService.imageApi+'/sizes/m/imageSets/';
    $scope.imageL = $hostService.imageApi+'/sizes/l/imageSets/';
    $scope.imageDes = $hostService.imageApi+'/images/';

    $scope.imageArr = [];
    $scope.descriptionImages = [];
    $scope.banners = [];
    $scope.categories = [];
    $scope.sCategories =[];
    $scope.supplierList = [];
    $scope.smallCategory = '';
    $scope.active = 1;
    $scope.pSku = '';
    $scope.pSize = '';
    $scope.pWeight = '';
    $scope.price = 0;
    $scope.wholesalePrice = 0;
    $scope.floorPrice = 0;
    $scope.pFactory = '';
    $scope.recommend = 0;
    $scope.recommendList = [];
    $scope.bigCategory=[];

    $scope.labelList=[];
    $scope.checkedLabelArr=[];
    $scope.labelParams=[];
    $scope.selectedLabel=[];
    $scope.File=[];
    $scope.addPordImagesId = '';

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
        window.setTimeout(function () {

        })
    };

    //商品详情
    function getProductDetail(){
        $scope.imageArr=[];
        $scope.descriptionImages=[];
        $scope.banners = [];
        $scope.productData = [];
        $httpService.get($hostService.productApi+'/biz/'+bizId+'/prods/'+productId).then(function(data){
            if(data.success) {
                $scope.productData = data.result;
                for(var i in data.result.images){
                    var image = data.result.images[i];
                    if(image.img_type == IMAGE_TYPE_COVER){
                        $scope.imageArr.push(data.result.images[i].img_url);
                    }else if(image.img_type == IMAGE_TYPE_DESCRIPTION){
                        $scope.descriptionImages.push(data.result.images[i].img_url)
                    }else if(image.img_type == IMAGE_TYPE_BANNER){
                        $scope.banners.push(data.result.images[i].img_url)
                    }else if(image.img_type == IMAGE_FILE){
                        var temy={};
                        temy.id=data.result.images[i].img_url;
                        temy.fileName=data.result.images[i].file_name;
                        $scope.File.push(temy)
                    }
                }
                setDefault();
            } else {
                WarningBox(data.msg);
            }
        }).catch(function(error){
            ErrorBox('服务器内部错误');
        });
    }

    function setDefault () {
        $scope.bigCategory = $scope.productData.parentTypeId ? $scope.productData.parentTypeId.toString():'';
        for(var i=0;i<$scope.categories.length;i++){
            if($scope.categories[i].id==$scope.bigCategory){
                $scope.sCategories = $scope.categories[i].value;
            }
        }
        $scope.smallCategory = $scope.productData.typeId ? $scope.productData.typeId.toString():'';
        $scope.active = $scope.productData.active.toString();
        $scope.pFactory = $scope.productData.bizId;
        $scope.pSku = $scope.productData.prodCode ? $scope.productData.prodCode:'';
        $scope.pSize = $scope.productData.measurement ? $scope.productData.measurement:'';
        $scope.pWeight = $scope.productData.unitOfMeasure ? $scope.productData.unitOfMeasure:'';
        $scope.price = parseInt($scope.productData.price);
        //$scope.wholesalePrice = parseInt($scope.productData.wholesalePrice);
        //$scope.floorPrice = parseInt($scope.productData.floorPrice);
        var selectedId = $scope.productData.imgUrl;
        $scope.productCover = selectedId;
        $scope.pFactory = $scope.productData.bizId ? $scope.productData.bizId.toString():'';
        $scope.recommend = getTagByProdductId($scope.productData.prodId)? '1':'';
        var getLabel=$scope.productData.label;
        var formatLabel=[];
        var labelIdArr=[];
        if(getLabel.length>0){
            for(var i in getLabel){
                var temy={
                    id:getLabel[i].id,
                    text:getLabel[i].label_name
                }
                labelIdArr.push(getLabel[i].id);
                formatLabel.push(temy);
            }
            /*$('.labelSearch').select2({
                data: formatLabel,
                language : "zh-CN",// 指定语言为中文，国际化才起效
                placeholder: "搜所标签",
                width: '100%',
                multiple: true,
                minimumInputLength: 1,
                tags: false
            });*/
            $scope.labelSelect2(formatLabel);
            window.setTimeout(function () {
                $('.labelSearch').val(labelIdArr).trigger('change');
            },200)
        }


    }

    //请求参数
    function requestParams() {
        var params = new Object();
        var productName = $('#name').val();
        if(productName.length > 0){
            params.name = productName;
        }

        var parentId = $scope.bigCategory;
        if(parentId.length > 0) {
            params.parentTypeId = parentId;
        }

        var typeId = $scope.smallCategory;
        if(typeId.length > 0) {
            params.typeId = typeId;
        }

        var description = $('#description').val();
        if(description.length > 0) {
            params.description = description;
        }

        var active = $scope.active;
        if(active.length > 0) {
            params.active = parseInt(active);
        }
        var prodCode = $scope.pSku;
        if(prodCode && prodCode.length > 0){
            params.prodCode = prodCode;
        }

        var weight = $scope.pWeight;
        if(weight && weight.length > 0){
            params.unitOfMeasure = weight;
        }

        var size = $scope.pSize;
        if(size && size.length > 0){
            params.measurement = size;
        }

        var lableArr=$(".labelSearch").select2("data");
        var labelParams=[];
        for(var i in lableArr){
            var temy={
                labelId:lableArr[i].id,
                labelName:lableArr[i].text
            }
            if(temy.labelId==temy.labelName){
                temy.labelId='';
            }
            labelParams.push(temy);
        }

        params.label=labelParams;
        params.price = $scope.price;
        params.wholesalePrice = $scope.wholesalePrice;
        params.floorPrice = $scope.floorPrice;
        if($scope.pFactory.length > 0){
            params.bizId = $scope.pFactory;
        }
        params.minPurchaseQuantity = $scope.minPurchaseQuantity;
        params.tax = $scope.tax;
        params.transportFeePayee = $scope.transportFeePayee;
        params.taxIncluded = $scope.taxIncluded;

        return params;
    }

    //更新商品
    $scope.updateProduct = function () {
        var paramsStr = requestParams();
        var url = $hostService.productApi+'/biz/'+bizId+'/prods/'+productId;
        $httpService.put(url, paramsStr).then(function(data){
            if(data.succeed){
                InfoBox('更新商品成功!');
                window.location.href = '#/product_list';
            }else{
                WarningBox(data.msg)
            }
        }).catch(function (error) {
            ErrorBox('更新商品服务器内部错误');
        });
    };

    //获取商品的图片
    function getProdImages(){
        var url = $hostService.productApi+'/biz/0/prods/'+productId+'/prodImages';
        $httpService.get(url).then(function(data){
            if(data.success){

            }
        }).catch(function(error){

        });
    }

    //同步商品图片
    function updatePordImages(imageUrl,type,name,description){
        var imageType = '';
        if(type == PRODUCT_IMAGE_COVER){
            imageType = 'cover';
        } else if(type == PRODUCT_IMAGE_DESCRIPTION){
            imageType = 'description';

        } else if(type == PRODUCT_IMAGE_BANNER){
            imageType = 'banner';
        } else if(type == PRODUCT_FILE){
            imageType = 'file';
        }

        var param =
        {
            "prodImages":
                [
                    {
                        "prodId":productId,
                        "imgUrl":imageUrl,
                        "description":description,
                        "active":'1',
                        "imgType": imageType
                    }
                ]
        };
        if(name){
            param.prodImages[0].fileName=name;
        }
        var url = $hostService.productApi+'/biz/'+bizId+'/prodImages';
        $httpService.post(url,param).then(function(data){
            if(data.success){
                if(type == 'FILE'){
                    InfoBox('同步商品文件成功');
                }else {
                    InfoBox('同步商品图片成功');
                }
                if(type == PRODUCT_IMAGE_BANNER){
                    setTags(2,'banner');
                }
            }
        }).catch(function(error){
            ErrorBox('同步商品图片出现错误');
        });
    }

    function uploadImageUrl(imageType) {
        var imageUrl = '';
        if(imageType == PRODUCT_IMAGE_COVER){
            imageUrl = $hostService.imageApi+'/imageSets';
        }else if(imageType == PRODUCT_IMAGE_DESCRIPTION){
            imageUrl = $hostService.imageApi+'/images';
        }else if(imageType == PRODUCT_IMAGE_BANNER){
            imageUrl = $hostService.imageApi+'/images';
        }
        return imageUrl;
    }

    //上传图片
    $scope.uploadImage = function(dom,type,flag){
        var filename = $(dom).val();
        var checkFlag = checkUploadImage(filename,dom);

        if(checkFlag==1){
            $scope.$dom = $(dom).prev();
            $httpService.formPost($(dom).parent(),uploadImageUrl(type),function(data){
                if(data.success){
                    if(type == PRODUCT_IMAGE_COVER){

                    }else if(type == PRODUCT_IMAGE_DESCRIPTION){

                    }else if(type == PRODUCT_IMAGE_BANNER){
                        $scope.banners = [];
                        $scope.banners.push(data.id);
                        $scope.$apply("banners");
                    }

                    if(flag === undefined){
                        updatePordImages(data.id,type);
                    }else{
                        $scope.addPordImagesId = data.id;
                    }
                }else{
                    WarningBox('上传图片失败');
                }
            },function(error){
                ErrorBox('服务器内部错误');
            })
        }else{

        }
    };

    $scope.addImage = function (id,type,dom) {
        var description = '';
        var temy = '';
        description = $('#'+dom).val();
        if(description && id){
            if(type == PRODUCT_IMAGE_COVER){
                $scope.imageArr.push(id);
                temy={
                    img_url:id,
                    img_type:'cover',
                    description:description,
                    prod_id:productId
                }
                document.getElementById('attachmentForm').reset();
            } else if(type == PRODUCT_IMAGE_DESCRIPTION){
                $scope.descriptionImages.push(id);
                temy={
                    img_url:id,
                    img_type:'description',
                    description:description,
                    prod_id:productId
                }
                document.getElementById('descriptionImage').reset();
            }
            if($scope.productData.images){
                $scope.productData.images.push(temy);
            }else{
                $scope.productData.images=[];
                $scope.productData.images.push(temy);
            }
            $('#'+dom).val('');
            updatePordImages(id,type,'',description);
            $scope.addPordImagesId='';
        }else {
            WarningBox('图片及图片描述信息不能为空！');
        }
    };

    //删除图片
    $scope.deleteImage = function(index,type){
        var imgId;
        if(type == PRODUCT_IMAGE_COVER){
            imgId = $scope.imageArr[index];
            $scope.imageArr.splice(index,1);
        } else if(type == PRODUCT_IMAGE_DESCRIPTION){
            imgId = $scope.descriptionImages[index];
            $scope.descriptionImages.splice(index,1);
        } else if(type == PRODUCT_IMAGE_BANNER){
            imgId = $scope.banners[index];
            $scope.banners.splice(index,1);
        }
        //解除与product的关联
        var url = $hostService.productApi+'/biz/'+bizId+'/prods/'+productId+'/prodImages?imgUrl='+imgId;
        $httpService.delete(url).then(function(data){
            if(data.success){
                if(type == PRODUCT_IMAGE_BANNER){
                    removeTags(2);
                    InfoBox('删除banner图片成功');
                }else {
                    InfoBox('删除商品图片成功');
                }
            }
        }).then(function(){
            //从服务器中删除图片资源
            var imageIds = [];
            imageIds.push(imgId);
            var params = {
                "imageIds":imageIds
            };
            $httpService.delete(uploadImageUrl(type),{data:params}).then(function(data){
                if(data.success){
                }
            }).catch(function(){
                ErrorBox('删除图片资源服务器内部错误');
            });
        }).catch(function(error){
            ErrorBox('删除商品图片服务器内部错误');
        });
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
    }

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
            ErrorBox('获取经销商列表服务器内部错误');
        })
    };

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

    //设置商品推荐
    function setTags(tagId,type){
        var url = $hostService.productApi+'/tags/'+tagId+'/prods';
        var params =
        {
            "prodTags":
                [
                    {
                        "bizId": bizId,
                        "prodId": productId,
                        "tagId": tagId,
                        "active": 1
                    }
                ]
        }
        $httpService.post(url,params).then(function(data){
            if (data.success) {
                if(data.result[0].success){
                    if(type){
                        InfoBox('Banner设置成功');
                    } else {
                        InfoBox('推荐设置成功');
                    }
                }else{
                    WarningBox(data.result[0].msg);
                }
            } else {
                WarningBox(data.msg);
            }
        }).catch(function(data){
            ErrorBox('设置商品推荐服务器内部错误');
        })
    }
    //取消推荐
    function removeTags (tagId){
        var url = $hostService.productApi+'/tags/'+tagId+'/prods?bizId='+bizId+'&prodId='+productId;
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

    $scope.recommendSelected = function () {
        if($scope.recommend.length>0){
            setTags($scope.recommend);
        }else{
            //TODO:目前只有首页推荐(tag=1),以后将会是个tag的数组
            removeTags(1);
        }
    }

    //获取采购价和最低售价
    function getPrice () {
        var url = $hostService.productApi+'/prodextras/'+productId;
        $httpService.get(url).then(function(data){
            if(data.success){
                $scope.wholesalePrice = data.result.wholesalePrice;
                $scope.floorPrice = data.result.floorPrice;
                $scope.minPurchaseQuantity = data.result.minPurchaseQuantity;
                $scope.tax = data.result.tax;
                $scope.transportFeePayee = data.result.transportFeePayee;
                $scope.taxIncluded = data.result.taxIncluded == 1 ? true : false;
            }
        }).catch(function(error){
            ErrorBox('获取商品价格服务器内部错误');
        })
    }

    $scope.labelSelect2=function (data) {
        $('.labelSearch').select2({
            language : "zh-CN",// 指定语言为中文，国际化才起效
            placeholder: "搜所标签",
            width: '100%',
            multiple: true,
            minimumInputLength: 1,
            tags: false,
            data:data,
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
    }

    //上传nca文件
    $scope.uploadFile = function(dom){
        var filename = $(dom).val();
        var url=$hostService.imageApi+'/imagesOther';
        $scope.$dom = $(dom).prev();
        importLoading('show');
        if(filename!=''){
            $httpService.formPost($(dom).parent(),url,function(data){
                if(data.success){
                    var temy={};
                    temy.fileName=data.fileName;
                    temy.id=data.id;
                    $scope.File = [];
                    $scope.File.push(temy);
                    $scope.$apply("File");
                    $(dom).val('')
                    updatePordImages(temy.id,PRODUCT_FILE,temy.fileName);
                    importLoading('hide');
                }else{
                    WarningBox('上传文件失败');
                }
            },function(error){
                ErrorBox('服务器内部错误');
            })
        }

    };

    $scope.downFile = function (imgId) {
        var url=$hostService.imageApi+'/images/'+imgId;
        window.open(url);
    };

    //删除nca文件
    $scope.deleteFile = function(index,imgId){
        var fileId;
        fileId = $scope.File[index];
        $scope.File.splice(index,1);
        //解除与product的关联
        var url = $hostService.productApi+'/biz/'+bizId+'/prods/'+productId+'/prodImages?imgUrl='+imgId;
        $httpService.delete(url).then(function(data){
            if(data.success){
                $('#ncaPak').val('');
                InfoBox('删除文件成功');
            }
        }).then(function(){
            //从服务器中删除图片资源
            var fileIds = [];
            fileIds.push(fileId);
            var params = {
                "imageIds":fileIds
            };
            var url=$hostService.imageApi+'/images';
            $httpService.delete(url,{data:params}).then(function(data){
                if(data.success){
                }
            }).catch(function(){
                ErrorBox('删除文件资源服务器内部错误');
            });
        }).catch(function(error){
            ErrorBox('删除文件服务器内部错误');
        });
    }


    var imgDescribeId='';
    $scope.showDescriptionDialog = function (image) {
        $('#description-dialog').modal('show');
        imgDescribeId=image;
        for(var i in $scope.productData.images){
            if($scope.productData.images[i].img_url==image){
                $scope.describeText=$scope.productData.images[i].description;
            }
        }
    }

    $scope.changeDescription = function () {
        var url=$hostService.productApi + '/updateImageDescription';
        var params = {
            imgUrl:imgDescribeId,
            tenant:$scope.productData.tenant,
            prodId:$scope.productData.prodId,
            description:$scope.describeText,
            bizId:$scope.productData.bizId
        }
        $httpService.put(url,params).then(function(data){
            if(data.succeed){
                InfoBox('编辑成功！');
                $('#description-dialog').modal('hide');
                getProductDetail();
            }
        }).catch(function(){
            ErrorBox('更新图片描述服务器内部错误');
        });

    }

    getAllCategories();
    $scope.getSupplierList();
    getTagsList();
    getRecommendList(1);
    getProductDetail();
    getPrice();

    $(document).ready(function() {
        $scope.labelSelect2();
    });


}]);
