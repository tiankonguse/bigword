//app.js
const config = require('./config');
const openIdUrl = config.openIdUrl
const host = config.host

App({
    config: {
        host: host
    },
    globalData: {
        loginCode: "",
        hasLogin: false,
        openid: null,
        userInfo: null,
        AppID: "wxe9d370b20c760b2c",
        AppSecret: "4ffcf61f4e159300cb4edead77480b1a",
        shareTitle: "图文速成工具",
        systemInfo: {},
        bigwordText: "长按此图制作自己的图片"
    },
    getUserInfo: function (res){
        var app = this;
        wx.getUserInfo({
            success: function (res) {

                app.globalData.hasLogin = true
                app.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (app.userInfoReadyCallback) {
                    app.userInfoReadyCallback(res)
                }
            },
            fail: res => {
                //设置默认头像
                console.log("getUserInfo fail", res);
            },
            complete: res => {
            },
        })
    },
    _getUserInfo: function(res){
        var app = this;
        app.getUserInfo(res);
        //this._getSetting('scope.userInfo', function (res){
        //    app.getUserInfo(res);
        //})
    },
    authorize: function (scope, cb) {
        var app = this;
        wx.authorize({
            scope: scope,
            success: res => {
                console.log("authorize success", res);
                if (cb) {
                    cb(res);
                }
            },
            fail: res => {
                console.log("authorize fail", res);
            },
            complete: res => {
                console.log("authorize complete", res);
            }
        })
    },
    _getSetting: function (scope, cb) {
        var app = this;
        // 获取用户信息
        wx.getSetting({
            success: res => {
                console.log("getSetting success", res);
                if (res.authSetting[scope]) {
                    if (cb){
                        cb(res);
                    }
                }else{
                    app.authorize(scope, cb)
                }
            },
            fail: res => {
                console.log("getSetting fail", res);
            },
            complete: res => {
                console.log("getSetting complete", res);
            }
        })
    },
    onLaunch: function () {
        var app = this
        // 展示本地存储能力

        app.globalData.systemInfo = wx.getSystemInfoSync();
        
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        if (app.globalData.hasLogin === false) {
            wx.login({
                success: res=>{
                    app._getUserInfo(res)
                },
                fail: res => {
                    console.log("login fail", res);
                },
                complete: res => {
                    console.log("login complete", res);
                }
            })
        } else {
            app. _getUserInfo({ "errMsg": "login:ok", "code": app.globalData.loginCode })
        }

    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    getUserOpenId: function (callback) {
        var self = this

        if (self.globalData.openid) {
            callback && callback(null, self.globalData.openid)
        } else {
            wx.login({
                success: function (data) {
                    wx.request({
                        url: openIdUrl,
                        data: {
                            code: data.code
                        },
                        success: function (res) {
                            console.log('拉取openid成功', res)
                            self.globalData.openid = res.data.openid
                            callback(null, self.globalData.openid)
                        },
                        fail: function (res) {
                            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                            callback && callback(res)
                        }
                    })
                },
                fail: function (err) {
                    console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                    callback && callback(err)
                }
            })
        }
    }
})