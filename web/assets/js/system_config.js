//Web system config

sys_config = {

    /**
     ---- ORDER STATUS

     var ORDER_STATUS_PENDING = 1;
     var ORDER_STATUS_RELATED = 2;
     var ORDER_STATUS_CANCELLED = 3;
     var ORDER_STATUS_CONFIRMED = 4;
     var ORDER_STATUS_TRANSFERING  =5;
     var ORDER_STATUS_TRANSFERED  =6;
     var ORDER_STATUS_COMPLETED  = 9;
     */

    order_status: [{id: 1, name:'ORDER_STATUS_PENDING'}, {id: 2, name:'ORDER_STATUS_RELATED'},{id: 3, name:'已取消'}],

    /**
     ---- ORDER TYPE

     var ORDER_TYPE_IMPORT = 1; //进口
     var ORDER_TYPE_EXPORT = 2; //出口
     var ORDER_TYPE_INNER = 3; //配货

     */

    order_type: [{name:'进口',id:1},{name:'出口',id:2},{name:'配货',id:3}],

    /**
     ---- CONTAINER SHAPE

     var CONTAINER_SHAPE_GP = 1;
     var CONTAINER_SHAPE_HQ = 2;
     var CONTAINER_SHAPE_OT = 3;
     var CONTAINER_SHAPE_RF = 4;
     var CONTAINER_SHAPE_TK = 5;
     var CONTAINER_SHAPE_FR = 6;

     */

    //container_shape: [{name:'GP',id:1},{name:'HQ',id:2},{name:'OT',id:3},{name:'RF',id:4},{name:'TK',id:5},{name:'FR',id:6}],
    container_shape: [{name:'GP',id:1},{name:'HC',id:2}],
    /**
     ---- CONTAINER SIZE

     var CONTAINER_SIZE_20 = 1;
     var CONTAINER_SIZE_40 = 2;
     var CONTAINER_SIZE_45 = 3;
     var CONTAINER_SIZE_53 = 4;

     */

    //containerSize: [{name:20,id:1},{name:40,id:2},{name:45,id:3},{name:53,id:4}],
    containerSize: [{name:20,id:1},{name:40,id:2}],

    /**
     ---- CONTAINER WIEGHT

     var GOODS_WEIGHT_0_10 = 1; //0-10T
     var GOODS_WEIGHT_10_20 = 2; //10-20T
     var GOODS_WEIGHT_20_30 = 3; //20-30T

     */

    containerWeight: [{name:'0-10',id:1},{name:'10-20',id:2},{name:'20-30',id:3}],

    /**
     ---- PACK TYPE

     */

    packTypes: ['包装类型1','包装类型2','包装类型3','包装类型4','包装类型5'],


    end:null
};