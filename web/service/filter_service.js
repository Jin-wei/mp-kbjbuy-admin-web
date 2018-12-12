app.filter('orderStatus',function(){
    return function(status) {
        if(status=="pending"){
            return "未付款"
        }else if(status=="payed"){
            return "已付款"
        }else if(status=="completed"){
            return "已完成"
        }else if(status=="canceled"){
            return "已取消"
        }
    };
});

app.filter('orderItemStatus',function(){
    return function(status) {
        if(status=="pending"){
            return "待发货"
        }else if(status=="shipped"){
            return "已发货"
        }else if(status=="canceled"){
            return "退货"
        }
    };
});

app.filter('purchaseItemStatus',function(){
    return function(status) {
        if(status=="pending"){
            return "待发货"
        }else if(status=="shipped"){
            return "已发货"
        }else if(status=="received"){
            return "已收货"
        }
    };
});

app.filter('company', function(){
   return function (type){
       if(type==0){
           return "金捷成"
       }
   };
});

app.filter('active', function(){
    return function (type) {
      if(type==0) {
          return "停用";
      } else if (type==1){
          return "活跃";
      }
    };
});

app.filter('parentType',function(){
    return function(type) {
        if(type==1){
            return "成品"
        }else if(type==2){
            return "产成品(咖啡类)"
        }else if(type==3){
            return "原材料"
        }else if(type==4){
            return "零配件"
        }
    };
});

app.filter('productType', function(){
    return function (type) {
        if (type == 101) {
            return '奶类'
        } else if (type == 103) {
            return '蜜露/糖浆类'
        } else if (type == 105) {
            return '糖类'
        } else if (type == 106) {
            return '机器类'
        } else if (type == 107) {
            return '器具类'
        } else if (type == 108) {
            return '果粉类'
        } else if (type == 109) {
            return '茶类'
        } else if (type == 301) {
            return '咖啡豆'
        } else if (type == 401) {
            return '配件类'
        }
    };
});

app.filter('verifyStatus',function(){
    return function(status) {
        if(status==1){
            return "待审核"
        }else if(status==2){
            return "已驳回"
        }else if(status==9){
            return "已审核"
        }
    };
});

app.filter('userType',function(){
    return function(type) {
        if(type==1){
            return "货主"
        }else if(type==2){
            return "货代"
        }else if(type==3){
            return "船公司"
        }else if(type==4){
            return "车队"
        }
    };
});

app.filter('truckType',function(){
    return function(type) {
        if(type==1){
            return "自有车队"
        }else if(type==2){
            return "挂靠车队"
        }
    };
});

app.filter('appealStatus',function(){
    return function(type) {
        if(type==1){
            return "新创建"
        }else if(type==2){
            return "已解决"
        }
    };
});

app.filter('transType',function(){
    return function(type) {
        if(type==1){
            return "进口"
        }else if(type==2){
            return "出口"
        }else if(type==3){
            return "配货"
        }
    };
});

app.filter('goodsWatcher',function(){
    return function(type) {
        if(type==0){
            return "非监管品"
        }else if(type==1){
            return "监管品"
        }
    };
});

app.filter('goodsFreezer',function(){
    return function(type) {
        if(type==0){
            return "非冻柜"
        }else if(type==1){
            return "冻柜不挂机"
        }else if(type==2){
            return "冻柜挂机"
        }
    };
});

app.filter('containerSize',function(){
    return function(type) {
        if(type==1){
            return "20"
        }else if(type==2){
            return "40"
        }else if(type==3){
            return "45"
        }else if(type==4){
            return "53"
        }
    };
});

app.filter('containerShape',function(){
    return function(type) {
        if(type==1){
            return "GP"
        }else if(type==2){
            return "HC"
        }else if(type==3){
            return "OT"
        }else if(type==4){
            return "RF"
        }else if(type==5){
            return "TK"
        }else if(type==6){
            return "FR"
        }
    };
});

app.filter('goodsWeight',function(){
    return function(type) {
        if(type==1){
            return "0-15T"
        }else if(type==2){
            return "15-25T"
        }
    };
});

app.filter('goodsType',function(){
    return function(type) {
        if(type==0){
            return "普通"
        }else if(type==1){
            return "危险品"
        }else if(type==2){
            return "高货值"
        }else if(type==4){
            return "海关监管货"
        }else if(type==3){
            return "危险品|高货值"
        }else if(type==5){
            return "危险品|海关监管货"
        }else if(type==6){
            return "高货值|海关监管货"
        }else if(type==7){
            return "危险品|高货值|海关监管货"
        }
    };
});

app.filter('containerCount',function(){
    return function(type) {
        if(type==1){
            return "单背"
        }else if(type==2){
            return "双背"
        }
    };
});

app.filter('doubleLoad',function(){
    return function(type) {
        if(type==0){
            return "单背"
        }else if(type==1){
            return "双背"
        }
    };
});

app.filter('gender',function(){
    return function(type) {
        if(type==1){
            return "男"
        }else{
            return "女"
        }
    };
});

app.filter('packType',function(){
    return function(type) {
        if(type==1){
            return "纸箱"
        }else if(type==2){
            return "托盘"
        }else if(type==3){
            return "袋装"
        }else if(type==4){
            return "桶装"
        }else if(type==5){
            return "裸装"
        }
    };
});

app.filter('itemStatus',function(){
    return function(type) {
        if(type==41){
            return "货代申请取消"
        }else if(type==51){
            return "已取消"
        }else if(type==42){
            return "车队申请取消"
        }else if(type==52){
            return "已取消"
        }else if(type==1){
            return "待发布"
        }else if(type==2){
            return "已发布"
        }else if(type==3){
            return "已接单"
        }else if(type==6){
            return "已确认"
        }else if(type==7){
            return "运输中"
        }else if(type==8){
            return "待评价"
        }else if(type==9){
            return "已完成"
        }
    };
});

app.filter('transStatus',function(){
    return function(type) {
        if(type==1){
            return "港口提箱"
        }else if(type==2){
            return "场站提箱"
        }else if(type==3){
            return "前往目的地"
        }else if(type==4){
            return "到达目的地"
        }else if(type==5){
            return "到达装货地"
        }else if(type==6){
            return "装货完成"
        }else if(type==7){
            return "到达卸货地"
        }else if(type==8){
            return "卸货完成"
        }else if(type==9){
            return "返回完成"
        }
    };
});

app.filter('billType',function(){
    return function(type) {
        if(type != null){
            if(type==2){
                return "收入"
            }else{
                return "支出"
            }
        }
    };
});

app.filter('paymentType',function(){
    return function(type) {
        if(type==1){
            return "在线支付"
        }else if(type==2){
            return "现金月结"
        }else if(type==3){
            return "银行转账"
        }
    };
});

app.filter('fullAddress',['$httpService','$hostService',function($httpService,$hostService){
    return function(type) {
        $httpService.get($hostService.loginApi+'/region/'+type+'/levelRegion').then(function(data){
            if(data.success){
                if(data.result!=null && data.result.length>0){
                    var fullAddress = data.result[0].r1_name+"-"+data.result[0].r2_name+"-"+data.result[0].r3_name;
                    return fullAddress;
                }
            }
        }).catch(function(error){
            ErrorBox('服务器内部错误');
        });
    };
}]);

//date format yyyy-mm-dd hh:mm
app.filter('dateFormat',function(){
    return function(date) {
        if(date == null || date==""){
            return null;
        }else {
            var d = new Date(date);
            var utc8 = d.getTime();
            var newTime = new Date(utc8);
            var Year = newTime.getFullYear();
            var Month = newTime.getMonth()+1;
            var myDate = newTime.getDate();
            var hour = newTime.getHours();
            var minute = newTime.getMinutes();
            if(minute<10){
                minute="0"+minute;
            }
            if(hour<10){
                hour="0"+hour;
            }
            if(myDate<10){
                myDate="0"+myDate;
            }
            if(Month<10){
                Month="0"+Month;
            }
            var allTime = hour+":"+minute;

            var time = Year+"-"+Month+"-"+myDate+" "+allTime;

            return time;
        }
    };
});

//date format yyyy-mm-dd
app.filter('dateFormat2',function(){
    return function(date) {
        if(date == null || date==""){
            return null;
        }else {
            var d = new Date(date);
            var utc8 = d.getTime();
            var newTime = new Date(utc8);
            var Year = newTime.getFullYear();
            var Month = newTime.getMonth() + 1;
            var myDate = newTime.getDate();

            if (myDate < 10) {
                myDate = "0" + myDate;
            }
            if (Month < 10) {
                Month = "0" + Month;
            }

            var time = Year + "-" + Month + "-" + myDate;

            return time;
        }
    };
});

//date format yyyy-mm-dd hh:mm:ss
app.filter('dateFormat3',function(){
    return function(date) {
        if(date == null || date==""){
            return null;
        }else {
            var d = new Date(date);
            var utc8 = d.getTime();
            var newTime = new Date(utc8);
            var Year = newTime.getFullYear();
            var Month = newTime.getMonth()+1;
            var myDate = newTime.getDate();
            var hour = newTime.getHours();
            var minute = newTime.getMinutes();
            var seconds = newTime.getSeconds();
            if(seconds<10){
                seconds="0"+seconds;
            }
            if(minute<10){
                minute="0"+minute;
            }
            if(hour<10){
                hour="0"+hour;
            }
            if(myDate<10){
                myDate="0"+myDate;
            }
            if(Month<10){
                Month="0"+Month;
            }
            var allTime = hour+":"+minute+":"+seconds;

            var time = Year+"-"+Month+"-"+myDate+" "+allTime;

            return time;
        }
    };
});


app.filter('prodType',function(){
    return function(type) {
        if(type==null){
            return "一级菜单"
        }else if(type!=null){
            return "二级菜单"
        }
    };
});


function outputdollars(number){
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }

}

function outputcents (amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}



app.filter('priceFormat',function(){
    return function(number) {
        //格式化金额
        if (isNaN(number) || number == "") return "";
        number = Math.round(number * 100) / 100;
        if (number < 0)
            return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
        else
            return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
    };
});