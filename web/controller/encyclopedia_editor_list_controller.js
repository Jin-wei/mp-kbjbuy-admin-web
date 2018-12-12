app.controller("encyclopediaEditorListController", ['$rootScope','$scope','$httpService','$location','$q','$hostService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService) {
        $scope.moduleName = '实时资讯编辑发布详情';

        $scope.addonArray = [];

        var contentId = $location.search().contentId;
        $scope.imageUrl = null;
        // 生成编辑器
        var editor = new wangEditor('textEditor');
        editor.create();

        //获取内容
        function getContent(){
            $httpService.get($hostService.cmsApi+'/content?contentId='+contentId).then(function(data){
                if(data.success){
                    $scope.content = data.result[0];
                    editor.$txt.html(data.result[0].content);
                    $('#shipInfo').val(data.result[0].ext1)
                    $('#secondCategory').val(data.result[0].type[0].t2);
                    $scope.content.keyword=data.result[0].type[0].keyword;

                    var addons = data.result[0].addons;
                    if(addons instanceof Array){
                        for(var i in addons){
                            var a = addons[i];
                            var addonHref = $hostService.cmsApi+'/file/'+a.url;
                            var addonName = a.name;
                            var addonId = a.url;
                            $scope.addonArray.push(createAddonObject(addonHref,addonName,addonId));
                        }
                    }
                }else{
                    WarningBox(data.msg);
                }
            }).catch(function(error){
                ErrorBox('获取咖啡百科务器内部错误');
            });
        }

        //添加
        function addNewContent(params){
            $httpService.post($hostService.cmsApi+'/content',params).then(function(data){
                if(data.success){
                    InfoBox('发布一条实时资讯');
                    window.setTimeout(function(){
                        $scope.cancel();
                    },100)
                }else{
                    WarningBox(data.msg);
                }
            }).then(function () {
                baiduPushLink(params.shortId,1);
            }).catch(function(error){
                ErrorBox('发布实时资讯服务器内部错误');
            });
        }
        //更新
        function updateContent(params){
            $httpService.put($hostService.cmsApi+'/content/'+contentId,params).then(function(data){
                if(data.success){
                    InfoBox('更新一条实时资讯');
                    window.setTimeout(function(){
                        $scope.cancel();
                    },100)
                }else{
                    WarningBox(data.msg);
                }
            }).then(function () {
                baiduPushLink(params.shortId,2);
            }).catch(function(error){
                ErrorBox('更新实时资讯服务器内部错误');
            });
        }

        //百度主动推送链接
        function baiduPushLink(shortId,type) {
            var paramsUrl = {
                link:'http://www.kbjbuy.com/api/contentId/' + shortId,
                type:type //1更新 2历史
            };
            $httpService.post($hostService.productApi+'/baiduPushLink',paramsUrl).then(function(data){
                if(data.success){
                }else{
                    console.log('data');
                }
            }).catch(function(error){
                console.log('历史百度链接推送服务器内部错误');
            });
        }

        //点击发布
        $scope.distribution = function () {
            var params = buildRequestParams();
            if(contentId){
                if($scope.content.short_id){
                    updateContent(params);
                }else{
                    params.contentInfo.short_id=$scope.content.seq;
                    updateContent(params);
                }
            }else{
                var  paramsStr = objToStr({t1:'1',status:1});
                $httpService.get($hostService.cmsApi+'/content'+paramsStr).then(function(data){
                    if(data.success){
                        if(data.result.length>0){
                            params.shortId = parseInt(data.result[0].short_id) + 1;
                        }else {
                            params.shortId =1;
                        }
                    }else{
                        WarningBox(data.msg);
                    }
                }).then(function () {
                    $httpService.get($hostService.cmsApi+'/contentCount'+paramsStr).then(function(data){
                        if(data.success){
                            params.seq = parseInt(data.result)+1;
                           /* params.shortId = parseInt(data.result)+1;*/
                            addNewContent(params);
                        }else{
                            WarningBox(data.msg);
                        }
                    }).catch(function(error){
                        ErrorBox('获取content页数服务器内部错误');
                    });
                }).catch(function(error){
                    ErrorBox('获取content列表服务器内部错误');
                });
            }
        }
        //构建请求参数
        function buildRequestParams() {
            //条件筛选
            var title = $('#noticeTitle').val();
            var content = editor.$txt.html();
            var category = $('#secondCategory').val();
            var abstract=$('#abstractText').val();
            var setTurn = 1;


            var Params = new Object();
            if(contentId){
                Params.contentInfo = new Object();
                if(title.length>0){
                    Params.contentInfo.title=title;
                }
                if(content.length>0){
                    Params.contentInfo.content=content;
                }
                if(abstract.length>0){
                    Params.contentInfo.abstract = abstract;
                }
                Params.contentInfo.turn = setTurn;
                Params.contentInfo.type = [];
                var type = new Object();
                type.t1 = '1';
                type.n1 = '咖啡百科管理';
                type.t2 = category;
                type.n2 = $('#secondCategory option:selected').text();
                type.keyword=$('#keyword').val();

                Params.contentInfo.type.push(type);

                Params.contentInfo.addons = [];
                for(var i in $scope.addonArray){
                    var a = $scope.addonArray[i];
                    var addon = new Object();
                    addon.url = a.id;
                    addon.name = a.name;
                    Params.contentInfo.addons.push(addon);
                }

            }else{
                if(title.length>0){
                    Params.title=title;
                }
                if(content.length>0){
                    Params.content=content;
                }
                if(abstract.length>0){
                    Params.abstract = abstract;
                }
                Params.turn = setTurn;
                Params.type = new Object();
                Params.type.t1 = '1';
                Params.type.n1 = '咖啡百科管理';
                Params.type.t2 = category;
                Params.type.n2 = $('#secondCategory option:selected').text();
                Params.type.keyword=$('#keyword').val();

                Params.addons = [];
                for(i in $scope.addonArray){
                    var a = $scope.addonArray[i];
                    var addon = new Object();
                    addon.url = a.id;
                    addon.name = a.name;
                    Params.addons.push(addon);
                }
            }
            return Params;
        }

        $scope.cancel = function(){
            window.location.href = '#/encyclopediaList';
        };

        //上传附件
        $scope.uploadAttachment = function(dom){
            var filename = $(dom).val();
            var splits = filename.split("\\");
            var absFileName = splits.slice(splits.length-1).shift();
            var checkFlag = checkUploadAttachment(filename,dom);

            if(checkFlag==1){
                $scope.$dom = $(dom).prev();
                for(var j=0;j<$scope.addonArray.length;j++){
                    if($scope.addonArray[j].name==absFileName){
                        WarningBox('警告：该文件已上传');
                        // return
                    }
                }
                lrz($(dom)[0].files[0],{quality:0.5})
                    .then(function (rst) {
                        // 处理成功会执行
                        console.log("压缩前图片大小:"+$(dom).parent().children()[0].files[0].size/1024+"K");
                        console.log("压缩后图片大小:"+rst.file.size/1024+"K");
                        $(dom).parent().children()[0].file = rst.file;
                        $httpService.formPost($(dom).parent(),$hostService.cmsApi+'/file',function(data){
                            $('#attachmentInput').val('');
                            if(data.success){
                                var addonId = data.result.id;
                                var addonHref = $hostService.cmsApi+'/file/'+data.result.id;
                                var addonName = absFileName;
                                $scope.addonArray=[];
                                $scope.addonArray.push(createAddonObject(addonHref,addonName,addonId));
                                $scope.$apply("addonArray");
                            }else{
                                WarningBox('上传附件失败');
                            }
                        },function(error){
                            ErrorBox('上传附件服务器内部错误');
                        })
                    })
                    .catch(function (err) {
                        // 处理失败会执行
                        console.log('lrz:'+err);
                    })
                    .always(function () {
                        // 不管是成功失败，都会执行
                    });
            }else{

            }
        };

        //删除附件
        $scope.removeAddon = function(index) {
            $scope.addonArray.splice(index,1);
        }

        //生成图片链接
        $scope.createImageUrl = function(dom){
            var filename = $(dom).val();
            var splits = filename.split("\\");
            var absFileName = splits.slice(splits.length-1).shift();
            var checkFlag = checkUploadImage(filename,dom);

            if(checkFlag==1){
                $scope.$dom = $(dom).prev();
                lrz($(dom)[0].files[0],{quality:0.5})
                    .then(function (rst) {
                        // 处理成功会执行
                        console.log("压缩前图片大小:"+$(dom).parent().children()[0].files[0].size/1024+"K");
                        console.log("压缩后图片大小:"+rst.file.size/1024+"K");
                        $(dom).parent().children()[0].file = rst.file;
                        $httpService.formPost($(dom).parent(),$hostService.cmsApi+'/file',function(data){
                            if(data.success){
                                $scope.imageUrl = $hostService.cmsApi+'/file/'+data.result.id;
                                $scope.$apply("imageUrl");
                            }else{
                                WarningBox('生成图片url失败');
                            }
                        },function(error){
                            ErrorBox('生成图片url服务器内部错误');
                        })
                    })
                    .catch(function (err) {
                        // 处理失败会执行
                        console.log('lrz:'+err);
                    })
                    .always(function () {
                        // 不管是成功失败，都会执行
                    });
            }else{
                $scope.imageUrl = null;
                $scope.$apply("iconUrl");

            }
        };

        //请求二级分类
        $scope.categoryChange = function(){
            var type = $('#secondCategory').val();
            $httpService.get($hostService.cmsApi + '/type?type=1&active=1').then(function (data) {
                if (data.success) {
                    $scope.secondCategory = data.result;
                } else {
                    WarningBox(data.msg);
                }
            }).catch(function (error) {
                ErrorBox('获取二级分类列表服务器内部错误');
            });
        }

        if(contentId){
            getContent();
        }
        $scope.categoryChange();
    }
]);

