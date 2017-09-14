// pages/main/index.js
var app = getApp()
Page({
    data: {
        title: "个人主页",
        desc: "by tiankonguse",
        userInfo: {
            avatarUrl: "/image/account-filling.png",
            nickName: ""
        },
        nickDefaultName: "你拒接了我",
        hasUserInfo: false,
        bigwordCode: "/image/logo_white.png",
        imagePath: "",
        bigwordCodeText: "保存小程序码，快速进入图文速成工具",
        maskHidden: true,
        canvasHidden: true,
        systemInfo: {},
        showHeight: 0,
        showWidth: 0,
        mycanvas: "mycanvas",
    },
    onShareAppMessage: function (options) {
        var that = this
        if (options.from === 'button') {
            // 来自页面内转发按钮
            console.log(options.target)
        }
        return {
            title: app.globalData.shareTitle,
            path: '/page/about/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            },
            complete: function (res) {
                // 转发失败
            }
        }
    },
    onLoad: function (options) {
        var that = this
        var systemInfo = app.globalData.systemInfo;
 
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                systemInfo: systemInfo,
                showWidth: systemInfo.screenWidth,
                showHeight: systemInfo.screenHeight
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    systemInfo: systemInfo,
                    showWidth: systemInfo.screenWidth,
                    showHeight: systemInfo.screenHeight
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                        systemInfo: systemInfo,
                        showWidth: systemInfo.screenWidth,
                        showHeight: systemInfo.screenHeight
                    })
                }
            })
        }
    },
    onReady: function () {
      
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    hideCanva: function () {
        this.setData({
            maskHidden: true
        });
    },
    saveFile: function (tempFilePath, cb) {
        var that = this
        wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res) {
                console.log("success", res);
                if (cb){
                    cb();
                }
            },
            fail: function (res) {
                console.log("fail", res);
            },
            complete: function (res) {
                console.log("complete", res);
            }
        })
    },
    canvasToFile: function (cb) {
        var that = this
        wx.canvasToTempFilePath({
            canvasId: that.data.mycanvas,
            success: function success(res) {
                console.log("success", res);
                that.saveFile(res.tempFilePath, cb)
            },
            fail: function (res) {
                console.log("fail", res);
                if (cb) {
                    cb()
                }
            },
            complete: function (res) {
                console.log("complete", res);
            }
        });
    },
    createNewImg: function (cb) {
        var that = this
        var showWidth = that.data.showWidth
        var showHeight = that.data.showHeight
        
        var context = wx.createCanvasContext(that.data.mycanvas);
        context.setFillStyle('white')
        context.fillRect(0, 0, showWidth, showWidth)
        context.drawImage(that.data.bigwordCode, 0, 0, showWidth, showWidth)
        context.draw()

        //将生成好的图片保存到本地
        that.canvasToFile(cb)
    },
    saveImg: function (e) {
        var that = this;
        this.setData({
            maskHidden: false,
            canvasHidden: false
        });
        wx.showToast({
            title: '保存中...',
            icon: 'loading',
            duration: 2000
        }); 
        setTimeout(function () {
            that.createNewImg(function () {
                that.setData({
                    maskHidden: true,
                    canvasHidden: true
                });
                wx.showToast({
                    title: '已保存',
                    icon: 'success',
                    duration: 2000
                });
            });
        }, 2000)

    },
    previewImg: function (e) {
        var img = this.data.bigwordCode
        wx.downloadFile({
            url: img,
            success: function (res) {
                var path = res.tempFilePath
                console.log(res)
                wx.previewImage({
                    current: path,
                    urls: [path],
                    success: function (res) {
                        console.log("success", res);
                    },
                    fail: function (res) {
                        console.log("fail", res);
                    },
                    complete: function (res) {
                        console.log("complete", res);
                    }
                })
            }
        })


    },
    formSubmit: function (e) {
        var that = this;
        var name = e.detail.value.name;
        name = name == "" ? this.data.defaultName : name;
        this.setData({
            name: name,
            maskHidden: false,
            canvasHidden: false
        });
        wx.showToast({
            title: '生成中...',
            icon: 'loading',
            duration: 2000
        });
        setTimeout(function () {
            wx.hideToast()
            that.createNewImg(function () {
                that.hideCanva()

                wx.showToast({
                    title: '点击图片后长按可保存',
                    icon: 'success',
                    duration: 2000
                });
            });
        }, 2000)

    },
    getUserInfo: function () {
        var that = this

        if (app.globalData.hasLogin === false) {
            wx.login({
                success: _getUserInfo
            })
        } else {
            _getUserInfo()
        }

        function _getUserInfo() {
            wx.getUserInfo({
                success: function (res) {
                    that.setData({
                        hasUserInfo: true,
                        userInfo: res.userInfo
                    })
                    that.update()
                }
            })
        }
    },
    clear: function () {
        this.setData({
            hasUserInfo: false,
            userInfo: {}
        })
    }

})