
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../view/login/login_content.html',
            controller:'loginController'
        })
        .when('/login', {
            templateUrl: '../view/login/login_content.html',
            controller:'loginController'
        })
        .when('/product_list', {
            templateUrl: '../view/productManager/product_list.html',
            controller:'productController'
        })
        .when('/product_detail', {
            templateUrl: '../view/productManager/product_detail.html',
            controller:'productDetailController'
        })
        .when('/product_editor', {
            templateUrl: '../view/productManager/product_editor.html',
            controller:'productEditorController'
        })
        .when('/category_list', {
            templateUrl: '../view/productManager/category_list.html',
            controller:'categoryListController'
        })
        .when('/banner_list', {
            templateUrl: '../view/productManager/banner_list.html',
            controller:'bannerListController'
        })
        .when('/order_list', {
            templateUrl: '../view/orderManager/order_list.html',
            controller: 'orderController'
        }).when('/order_detail', {
            templateUrl: '../view/orderManager/order_detail.html',
            controller: 'orderDetailController'
        })
        .when('/userManger', {
            templateUrl: '../view/userManger/user_list.html',
            controller: 'userController'
        })
        .when('/userDetail', {
            templateUrl: '../view/userManger/user_detail.html',
            controller: 'userDetailController'
        }).when('/channelManger', {
            templateUrl: '../view/channel/channel_list.html',
            controller: 'channelController'
        }).when('/priceManger', {
            templateUrl: '../view/price/price_list.html',
            controller: 'priceController'
        }).when('/addUser', {
            templateUrl: '../view/userManger/add_user.html',
            controller: 'priceController'
        }).when('/addChannel', {
            templateUrl: '../view/channel/add_channel.html',
            controller: 'addChannelController'
        }).when('/dealerDetail', {
            templateUrl: '../view/channel/dealer_detail.html',
            controller: 'dealerDetailController'
        })
        .when('/providerList', {
            templateUrl: '../view/provider/provider_list.html',
            controller: 'providerListController'
        })
        .when('/providerDetail', {
            templateUrl: '../view/provider/provider_detail.html',
            controller: 'providerDetailController'
        })
        .when('/updateType', {
            templateUrl: '../view/productManager/update_type.html',
            controller: 'updateTypeController'
        })
        .when('/categoryAdd', {
            templateUrl: '../view/productManager/category_add.html',
            controller: 'categoryAddController'
        })
        .when('/purchaseList', {
            templateUrl: '../view/purchaseManager/purchase_list.html',
            controller: 'purchaseListController'
        })
        .when('/purchaseDetail', {
            templateUrl: '../view/purchaseManager/purchase_detail.html',
            controller: 'purchaseDetailController'
        })
        .when('/encyclopediaCategory', {
            templateUrl: '../view/contentManager/encyclopedia_category_list.html',
            controller: 'encyclopediaCategoryController'
        })
        .when('/encyclopediaList', {
            templateUrl: '../view/contentManager/encyclopedia_list.html',
            controller: 'encyclopediaListController'
        })
        .when('/encyclopediaEditorDetail', {
            templateUrl: '../view/contentManager/encyclopedia_editor_detail.html',
            controller: 'encyclopediaEditorListController'
        })
        .when('/footerList', {
            templateUrl: '../view/contentManager/footer_list.html',
            controller: 'footerListController'
        })
        .when('/footerEditorDetail', {
            templateUrl: '../view/contentManager/footer_editor.html',
            controller: 'footerEditorController'
        })
        .otherwise({
            templateUrl: '/view/NotFound.html'
        });
}]);
