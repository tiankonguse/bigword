// pages/main/index.js
var app = getApp()
Page({
    data: {
        title: "生成白色名言图片",
        desc: "by tiankonguse",
        btnText: "生成名言",
        lableName: "你的名言",
        imagePath: "../../image/white.jpg",
        defaultImagePath: "../../image/white.jpg",
        name: "",
        defaultName: "这里输入文字",
        maskHidden: true,
        canvasHidden: true,
        showHeight: 0,
        showWidth: 0,
        mycanvas: "mycanvas",
        systemInfo: {},
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        fontSize: 35
    },
    onShareAppMessage: function (options) {
        var that = this
        if (options.from === 'button') {
            // 来自页面内转发按钮
            console.log(options.target)
        }
        return {
            title: app.globalData.shareTitle,
            path: '/page/black/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    onLoad: function (options) {
    },
    onReady: function () {
        var that = this
        var systemInfo = app.globalData.systemInfo;
        var screenWidth = systemInfo.screenWidth 
        var screenHeight = systemInfo.screenHeight 
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                systemInfo: systemInfo,
                showWidth: screenWidth,
                showHeight: screenHeight
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    systemInfo: systemInfo,
                    showWidth: screenWidth,
                    showHeight: screenHeight
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
                        showWidth: screenWidth,
                        showHeight: screenHeight
                    })
                }
            })
        }
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
        wx.saveFile({
            tempFilePath: tempFilePath,
            success: function success(res) {
                console.log("success", res);
                that.setData({
                    imagePath: res.savedFilePath,
                    canvasHidden: true,
                });
                if (cb) {
                    cb()
                }
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
        var fontSize = that.data.fontSize
        var fontColor = "black"
        var fillColor = "white"

        var context = wx.createCanvasContext(that.data.mycanvas)
        context.setFillStyle(fillColor)
        context.fillRect(0, 0, showWidth, showWidth)
        context.setFontSize(fontSize)
        context.setFillStyle(fontColor)
        context.setTextAlign("center");
        context.fillText(that.data.name, showWidth / 2, (showWidth + fontSize) / 2);
        context.restore();
        context.draw()

        //wx.drawCanvas({
        //    canvasId: that.data.mycanvas,
        //    actions: context.getActions()
        //});
        //将生成好的图片保存到本地
        that.canvasToFile(cb)
    },
    previewImg: function (e) {
        var img = this.data.imagePath
        if (img == this.data.defaultImagePath) {
            wx.showToast({
                title: '请先生成图片',
                icon: 'loading',
                duration: 1000
            });
            return
        }
        wx.previewImage({
            current: img,
            urls: [img],
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
    },
    formSubmit: function (e) {
        var that = this;
        var name = e.detail.value.name
        var fontSize = e.detail.value.fontSize
        name = name == "" ? this.data.defaultName : name;
        this.setData({
            name: name,
            fontSize: fontSize,
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