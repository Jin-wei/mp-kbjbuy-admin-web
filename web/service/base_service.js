function _BaseBox(boxClass,iconClass,msg,setting) {
    setting = setting || {};
    var box = $('<div class="col-xs-12" style="">');

    var content = '';
    content += '<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove fa-2x"></i></button>';
    content += '<strong style="position: absolute;margin-top: -2px;"><i class="'+iconClass+'"></i></strong>';
    content += '<span style="display:inline-block;max-width:500px;margin:0px 0px 0px 35px;font-size: 18px;">';
    content += msg;
    content += '</span>';

    box.html(content);
    $(document).find('body').append(box);

    box.addClass(boxClass);
    box.css({position:'fixed','z-index':9999,display:'none',top:'0px'});
    //var rect = GetBoxPosition(box);
    //console.log(rect);
    //box.css(rect);
    box.fadeIn(500);

    var timeout = 3000;
    if(setting.timeout)
        timeout = setting.timeout;

    box.children('.close').click(function(){
        if(this && this.parentNode) {
            box[0].outerHTML = ''
        }
    });

    if(!setting.stick) {
        if(timeout>0) {
            setTimeout(function(){
                box.fadeOut(1000,function(){
                    if(this.parentNode)
                        this.outerHTML = '';
                });
            },timeout);
        }
    }
}
function WarningBox(msg,setting) {
    var boxClass = 'alert alert-block alert-warning center';
    var iconClass = 'fa fa-warning fa-2x';
    setting = setting || {};
    if(!setting.timeout)
        setting.timeout = 10000;
    _BaseBox(boxClass,iconClass,msg,setting);
}
function ErrorBox(msg,setting) {
    var boxClass = 'alert alert-block alert-danger center';
    var iconClass = 'fa fa-frown-o fa-2x';
    setting = setting || {};
    if(!setting.timeout)
        setting.timeout = 10000;
    _BaseBox(boxClass,iconClass,msg,setting);
}
function InfoBox(msg,setting) {
    var boxClass = 'alert alert-block alert-info center';
    var iconClass = 'fa fa-bullhorn fa-2x';
    _BaseBox(boxClass,iconClass,msg,setting);
}
function SuccessBox(msg,setting) {
    var boxClass = 'alert alert-block alert-success center';
    var iconClass = 'fa fa-check fa-2x';
    setting = setting || {};
    if(!setting.timeout)
        setting.timeout = 10000;
    _BaseBox(boxClass,iconClass,msg,setting);
}


function _BaseDialog(msg,confirmCallback) {
    bootbox.dialog({
        message: msg,
        buttons:
        {
            "click" :
            {
                "label" : "确认",
                "className" : "btn-sm btn-primary",
                "callback": confirmCallback
            },
            "button" :
            {
                "label" : "取消",
                "className" : "btn-sm"
            }
        }
    });
}

function DelConfirm(confirmCallback) {
    _BaseDialog("确认删除数据?",confirmCallback);
}
function Confirm(msg,confirmCallback) {
    _BaseDialog(msg,confirmCallback);
}

//for menu class
function changeClass(id,subId){
    $("#menuId li").removeClass("active");
    $("#"+id).addClass("active");
    if(subId != ""){
        $("#"+subId).addClass("active");
    }
};

//date format
function dateFormat(date){
    var d = new Date(date);
    var utc8 = d.getTime();
    var newTime = new Date(utc8);
    var Year = newTime.getFullYear();
    var Month = newTime.getMonth()+1;
    var myDate = newTime.getDate();
    var minute = newTime.getMinutes();
    if(minute<10){
        minute="0"+minute;
    }
    if(myDate<10){
        myDate="0"+myDate;
    }
    if(Month<10){
        Month="0"+Month;
    }
    var hour = newTime.getHours()+":"+minute;
    var time = Year+"-"+Month+"-"+myDate+" "+hour;

    return time;
};

//check IDCardNo
function isCardNo(idNo) {
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return reg.test(idNo);
};

//check phoneNo
function isPhoneNo(phoneNo){
    var reg = /^1[3|4|5|7|8]\d{9}$/;
    return reg.test(phoneNo);
};

//check license plate
function isLicNo(licNo){
    var reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4}[A-Z_0-9_\u4e00-\u9fa5]{1}$/;
    return reg.test(licNo);
};

//object to string
function objToStr(obj){
    var paramStr="";
    if(obj !=null){
        var keyStr = Object.keys(obj);
        for(var i=0; i<keyStr.length;i++){
            paramStr+="&"+keyStr[i]+"="+obj[keyStr[i]];
        }
        paramStr = paramStr.substr(1,paramStr.length);
        paramStr = "?"+paramStr;
    }
    return paramStr;
};

//get value of selected checkbox :checkbox's name is checkboxId
function getSelectCheckbox(){
    var spCodesTemp = null;
    $('input:checkbox[name=checkboxId]:checked').each(function(i){
        if(0==i){
            spCodesTemp = $(this).val();
        }else{
            spCodesTemp += (","+$(this).val());
        }
    });
    return spCodesTemp;
}

//check upload image
function checkUploadImage(filename,dom){
    var checkFlag=0;
    if((/\.(jpg|jpeg|png|bmp)$/i).test(filename)) {
        //check size
        //$file_input[0].files[0].size
        var max_size_str = "5M";
        var max_size = 2*1024*1024; //default: 2M
        var re = /\d+m/i;
        if(re.test(max_size_str))  {
            max_size = parseInt(max_size_str.substring(0,max_size_str.length-1))*1024*1024;
        }

        if($(dom)[0].files[0].size > max_size) {
            WarningBox('图片大小不符合要求,图片文件最大: '+max_size_str+',请重新上传.');
            checkFlag = 0;
        }else{
            checkFlag = 1;
        }

    }else if(filename && filename.length>0){
        $(dom).val('');
        ErrorBox('图片格式不符合要求,支持的图片类型为jpg,jpeg,bmp,png,请重新上传.');
        checkFlag = 0;
    }
    return checkFlag;
}
//check upload image
function checkUploadPak(filename,dom){
    var checkFlag=0;
    if((/\.(pak)$/i).test(filename)) {
        checkFlag = 1;

    }else if(filename && filename.length>0){
        $(dom).val('');
        ErrorBox('文件格式不符合要求,支持的图片类型为pak,请重新上传.');
        checkFlag = 0;
    }
    return checkFlag;
}


function getAddress($rootScope){
    var addressArr = [];
    $.getJSON('../service/address.json', function(data){
        addressArr = data;
        $rootScope.addressArr = data;
        $rootScope.cityArr = data[0].city;
    })
}

function getProvinceData(callback){
    $.getJSON('../service/address.json', function(data){
        callback(data);
    })
}

//筛选分类数据结构
function sortCategory(array){
    var finalArray = [];//[[],[],[],....]的存储格式
    var bigCategories = [];
    var smallCategories = [];

    //分离大类和小类
    for(var i in array){
        var c = array[i];
        if(c.parentTypeId == null){
            bigCategories.push(c);
        }else{
            smallCategories.push(c);
        }
    }

    //生成分类数组
    for(var i in bigCategories){
        finalArray.push([]);
    }

    //筛选相同大类
    for(var i in smallCategories){
        var c = smallCategories[i];
        for(var k in bigCategories){
            var bc = bigCategories[k];
            if(c.parentTypeId == bc.typeId){
                finalArray[k].push(c);
            }
        }
    }

    var categories = [];//[{id:大类id,name:大类名字,value:小类数组},{},....]
    for(var i in bigCategories){
        var obj = {
            id:bigCategories[i].typeId,
            name:bigCategories[i].name,
            displayOrder:bigCategories[i].displayOrder,
            value:finalArray[i]
        };
        categories.push(obj);
    }
    return categories;
}
//turn page for table start
function getTotalPages(totalNum,size,currentPage){
    var totalPage=Math.ceil(totalNum/size);
    if(totalPage < 2 || currentPage>=totalPage){
        $('#nextBtn').addClass('disabled');
        $('#nextBtn').attr('disabled',true);

        $('#lastBtn').addClass('disabled');
        $('#lastBtn').attr('disabled',true);
    }else{
        $('#nextBtn').removeClass('disabled');
        $('#nextBtn').attr('disabled',false);

        $('#lastBtn').removeClass('disabled');
        $('#lastBtn').attr('disabled',false);
    }
    if(currentPage>1){
        $('#preBtn').removeClass('disabled');
        $('#preBtn').attr('disabled',false);

        $('#firstBtn').removeClass('disabled');
        $('#firstBtn').attr('disabled',false);
    }else{
        $('#preBtn').addClass('disabled');
        $('#preBtn').attr('disabled',true);

        $('#firstBtn').addClass('disabled');
        $('#firstBtn').attr('disabled',true);
    }

    return totalPage;

}


function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}
function financialFormat(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("");
}

function getStart(turnFlag,size,specifiedPage,totalPage,start){
    if(turnFlag==1){
        //to previous page
        start-=size;
        if(start <=0){
            start=0;
        }

        return start;

    }else if(turnFlag==2){
        //to next page
        start+=size;

        return start;

    }else if(turnFlag==3 || turnFlag==9){
        //to specified page
        if(specifiedPage==null || specifiedPage=="" || isNaN(specifiedPage)){
            WarningBox("请输入要跳转的页数!");
            return -1;
        }else if(specifiedPage==0){
            WarningBox("请输入大于0的页数!");
            return -1;
        }else if(specifiedPage - totalPage>0){
            WarningBox("输入的页数不能大于总页数!");
            return -1;
        }else{
            start = size * (specifiedPage-1);

            return start;
        }
    }

};

//turn the page
//turnFlag:1:to previous page;2:to next page;3:to specified page;0:to first page;9:to last page
function turnPage (turnFlag,$scope,start,size){
    if(turnFlag==9){
        $scope.specifiedPage = $scope.totalPage;

    }
    var pageFlag = getStart(turnFlag,size,$scope.specifiedPage,$scope.totalPage,start);

    if(pageFlag != -1){
        if(turnFlag==1){
            $scope.currentPage--;
        }else if(turnFlag==2){
            $scope.currentPage++;
        }else if(turnFlag==3){
            $scope.currentPage = $scope.specifiedPage;
        }else if(turnFlag==9){
            $scope.currentPage = $scope.totalPage;
        }

    }
    return pageFlag;

};

//turn page for table end

//获取项目的tenant
function getTenant() {
    var hostName = window.location.hostname;
    hostName = hostName.replace(/www./,'');
    var splitArray = hostName.split('.');
    var defaultTenant = sys_config.defaultTenant;
    //本地调试
    if(hostName.indexOf('localhost')>=0){
        return defaultTenant;
    }
    //staging环境的ip i.e. 59.111.97.208
    if(splitArray.length == 4 && !(isNaN(splitArray[0]) || isNaN(splitArray[1]) || isNaN(splitArray[2]) || isNaN(splitArray[3])))
    {
        return defaultTenant;
    }
    //product环境
    if(splitArray.length == 4){//tenant.admin.domain.com
        return splitArray[0];
    }
    //product环境
    if(splitArray.length == 3){//tenantadmin.domain.com
        var temy='';
        if(splitArray[0].indexOf('admin')!=-1){
            temy=splitArray[0].replace('admin','');
            if(temy!==''){
                return temy;
            }
        }
    }
    //kbj
    return defaultTenant;
}

function importLoading (status) {
    if(status=='show'){
        if($('body  *').hasClass("loading-model")){
            $('.loading-model').css('display','block');
        }else{
            var retString ='<div class="loading-model">';
            retString+='<div class="overlay" style="">'
            retString+='<i class="fa fa-refresh fa-spin"></i>'
            retString+='</div>  </div>'
            $(document).find('body').append(retString);
        }
    }else{
        $('.loading-model').css('display','none');
    }

}

//check upload attachment
function checkUploadAttachment(filename,dom){
    var checkFlag=0;
    if((/\.(pdf|xls|xlsx|doc|docx|jpg|png|jpeg|bmp|eml|txt)$/i).test(filename)) {
        //check size
        //$file_input[0].files[0].size
        var max_size_str = "5M";
        var max_size = 5*1024*1024; //default: 5M
        var re = /\d+m/i;
        if(re.test(max_size_str))  {
            max_size = parseInt(max_size_str.substring(0,max_size_str.length-1))*1024*1024;
        }

        if($(dom)[0].files[0].size > max_size) {
            WarningBox('附件大小不符合要求,附件文件最大: '+max_size_str+',请重新上传.');
            checkFlag = 0;
        }else{
            checkFlag = 1;
        }

    }else if(filename && filename.length>0){
        $(dom).val('');
        ErrorBox('附件格式不符合要求,支持的附件类型为pdf,excel,word,jpg,png,jpeg,bmp,eml,txt请重新上传.');
        checkFlag = 0;
    }
    return checkFlag;
}

//附件object
function createAddonObject(href,name,id){//链接,文件名,图片Id
    return {'href': href,'name': name,'id': id};
}