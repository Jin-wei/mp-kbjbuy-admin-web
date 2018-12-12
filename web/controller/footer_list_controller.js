app.controller("footerListController", ['$rootScope','$scope','$httpService','$location','$q','$hostService','$configService',
    function($rootScope,$scope,$httpService,$location,$q,$hostService,$configService ) {
        $scope.moduleName = '底部导航内容发布列表';
        changeClass('contentMenu','footerList');

        var start = 0;
        var size = 20;
        var hasMore = false;
        const maxCount = 10;

        $scope.infoList = [];//content列表数据源

        //设置datetimepicker
        $('#startDate').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });
        $('#endDate').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            language: 'zh-CN'
        });

        $scope.clickEdit = function (id) {
            window.location.href = '#/footerEditorDetail?contentId='+id;
        }

        $scope.clickAdd = function(){
            window.location.href = '#/footerEditorDetail';
        };

        //获取content列表
        $scope.getContentList = function(queryType) {
            if(queryType==10){
                start=0;
                $scope.currentPage=1;
                $scope.specifiedPage="";
            }
            //条件筛选
            var category = $('#secondCategory').val();
            var title = $('#noticeTitle').val();
            var startDate = $('#startDate').val();
            var endDate = $('#endDate').val();

            var Params = new Object();
            if(category.length>0){
                Params.t2 = category;
            }
            if(title.length>0){
                Params.titleKey = title;
            }
            if(startDate.length>0){
                var startDate = new Date(startDate);
                Params.startDate = startDate.toISOString();
            }
            if(endDate.length>0){
                var end = new Date(endDate);
                Params.endDate = end.toISOString();
            }
            Params.t1 = '2';
            Params.status = 1;
            Params.tenant = getTenant();
            var Params2 = $.extend(true,  {}, Params);
            Params.start = start;
            Params.size = size;
            var  ParamsStr = objToStr(Params);
            var  ParamsStr2 = objToStr(Params2);

            $httpService.get($hostService.cmsApi+'/content'+ParamsStr).then(function(data){
                if(data.success){
                    hasMore = (data.result.length > size)?true:false;

                     $scope.infoList =[];
                     for(var i in data.result){
                         var info = data.result[i];
                         if(info.seq == 0){
                             info.seq = parseInt(i)+1;
                         }
                         $scope.infoList.push(info);
                     }
                     sortListBySeq();
                }else{
                    WarningBox(data.msg);
                }
            }).then(function () {
                $httpService.get($hostService.cmsApi+'/contentCount'+ParamsStr2).then(function (data) {
                    $scope.totalNum = data.result;
                    $scope.totalPage = getTotalPages($scope.totalNum,size,$scope.currentPage);
                })
            }).catch(function(error){
                ErrorBox('获取content列表服务器内部错误');
            });
        }

        $scope.onReset = function(){
            $('#secondCategory').val('');
            $('#noticeTitle').val('');
            $('#startDate').val('');
            $('#endDate').val('');
            $('#shipInfo').val('');
        }

        //删除
        $scope.delete = function(){
            if(getSelectCheckbox()==null){
                WarningBox("请选择一条记录!");
                document.getElementById("delete").removeAttribute("href");
                return;
            }else{
                document.getElementById("delete").setAttribute("href","#sure-dialog");
                $scope.deleteIds = getSelectCheckbox().split(",");
            }
        }

        $scope.deleteConfirm = function(){
            for(i in $scope.deleteIds){
                var contentId = $scope.deleteIds[i];
                var params = {'contentId': contentId};
                $httpService.delete($hostService.cmsApi+'/content/'+contentId,params).then(function(data){
                    if(data.success){
                        $scope.getContentList();
                    }else{
                        WarningBox(data.msg);
                    }
                }).catch(function(error){
                    ErrorBox('删除Id服务器内部错误');
                });
            }
        }

        //请求二级分类
        $scope.categoryChange = function(){
            $scope.secondCategory = $configService.contentCategory;
        }


        $scope.turnPage = function (turnFlag){
            if(turnFlag==0){
                $scope.getContentList(10);
            }else{
                var pageFlag = turnPage(turnFlag,$scope,start,size);
                if(pageFlag!=-1){
                    start = pageFlag;
                    $scope.getContentList(20);
                }
            }
        };


        //列表seq的升序排列
        function sortListBySeq (){
            $scope.infoList.sort(function (a, b) {
                if (a.seq < b.seq) return 1;
                if (a.seq > b.seq) return -1;
                return 0;
            });
        }

        //排序
        $scope.clickUp = function(index){
            if (index>0){
                var sel = $scope.infoList[index];
                sel.seq += 1;
                var before = $scope.infoList[index-1];
                before.seq -=1;
                sortListBySeq();
                sendSeqToSever([sel, before]);
            }
        }

        $scope.clickDown = function(index){
            if (index<$scope.infoList.length-1){
                var sel = $scope.infoList[index];
                sel.seq -= 1;
                var after = $scope.infoList[index+1];
                after.seq +=1;
                sortListBySeq();
                sendSeqToSever([sel,after]);
            }
        }

        //同步列表顺序
        function sendSeqToSever(array) {
            for(var i in array){
                var obj = array[i];
                var params = {
                    'contentInfo':{
                        'seq': obj.seq
                    }
                };
                $httpService.put($hostService.cmsApi+'/content/'+obj._id,params).then(function(data){
                    if(data.success){
                    }else{
                        WarningBox(data.msg);
                    }
                }).catch(function(error){
                    ErrorBox('顺序同步服务器内部错误');
                });
            }
        }

        $scope.getContentList(10);
        $scope.categoryChange();
    }
]);