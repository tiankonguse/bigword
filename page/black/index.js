// pages/main/index.js
var app = getApp()
Page({
    data: {
        title:"生成名言图片",
        desc:"by tiankonguse",
        btnText:"生成名言",
        lableName:"你的名言",
        imagePath: "../../image/black.jpg",
        defaultImagePath: "../../image/black.jpg",
        name: "图不重要看文字",
        defaultName: "在此输入文字",
        maskHidden: true,
        canvasHidden: true,
        showHeight: 0,
        showWidth: 0,
        mycanvas: "mycanvas",
        systemInfo: {},
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        fontSize: 35,
        wordFrontColorIndex: 0,
        wordBackColorIndex: 1,
        wordColorMap: [
            { "color": "Black" },
            { "color": "White" },
            { "color": "Gray" },
            { "color": "Green" },
            { "color": "Red" },
            { "color": "Yellow" },
            { "color": "Silver" },
            { "color": "Orange" },
            { "color": "Blue" },
            { "color": "Brown" },
            { "color": "Crimson" },
            { "color": "DarkBlue" },
            { "color": "Pink" }
        ],
        toFrontColorView: 'White',
        toBackColorView: 'Black'
    }, 
    backColorClick: function (e) {
        var that = this
        that.data.toBackColorView = e.currentTarget.dataset.color
        that.show()
    },
    frontColorClick: function (e) {
        var that = this
        that.data.toFrontColorView = e.currentTarget.dataset.color
        that.show()
    },
    frontSizeClick: function (e) {
        var that = this
        that.data.fontSize = e.detail.value
        that.show()
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
            },
            complete: function (res) {
                // 转发失败
            }
        }
    },
    show: function () {
        var that = this;

        that.data.maskHidden = false
        that.data.canvasHidden = false
        that.setData(that.data);
        wx.showToast({
            title: '生成中...',
            icon: 'loading',
            duration: 2000
        });
        setTimeout(function () {
            wx.hideToast()
            that.createNewImg(function () {
                that.setData({
                    maskHidden: true,
                    canvasHidden: true
                });

                wx.showToast({
                    title: '点击图片后长按可保存',
                    icon: 'success',
                    duration: 2000
                });
            });
        }, 2000)
    },
    onReady: function () {
        var that = this
        var systemInfo = app.globalData.systemInfo
        var screenWidth = systemInfo.screenWidth
        var screenHeight = systemInfo.screenHeight

        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                systemInfo: systemInfo,
                showWidth: screenWidth,
                showHeight: screenHeight
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                that.setData({
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
                    that.setData({
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
        var showHeight = showWidth
        var context = wx.createCanvasContext(that.data.mycanvas)
        var fontSize = that.data.fontSize
        var fontColor = that.data.toFrontColorView
        var fillColor = that.data.toBackColorView

        context.setFillStyle(fillColor)
        context.fillRect(0, 0, showWidth, showHeight)
        context.setFontSize(fontSize)
        context.setFillStyle(fontColor)
        context.setTextAlign("center");// 'left','center','right'
        context.fillText(that.data.name, showWidth / 2, (showHeight + fontSize) / 2 );//必须为（0,0）原点
        context.restore();
        context.draw()

        //将生成好的图片保存到本地
        that.canvasToFile(cb)
    },
    previewImg: function (e) {
        var img = this.data.imagePath
        if (img == this.data.defaultImagePath){
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
        that.data.name = e.detail.value.name || that.data.defaultName
        that.data.fontSize = e.detail.value.fontSize
        that.show()
    }
})