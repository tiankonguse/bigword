// pages/main/index.js
var app = getApp()
Page({
    data: {
        title: "图文速成工具",
        desc: "by tiankonguse",
        btnText: "一键速成",
        lableName: "你的图文",
        imagePath: "/image/black.jpg",
        defaultImagePath: "/image/black.jpg",
        name: "朋友圈专用图",
        defaultName: "在此输入",
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
            {
                "color": "White",
                "code_color": "white"
            },
            {
                "color": "Silver",
                "code_color": "Gray"
            },
            {
                "color": "Gray",
                "code_color": "Gray"
            },
            {
                "color": "Black",
                "code_color": "Gray"
            },
            {
                "color": "Pink",
                "code_color": "Red"
            },
            {
                "color": "Red",
                "code_color": "Red"
            },
            {
                "color": "Crimson",
                "code_color": "Red"
            },
            {
                "color": "Orange",
                "code_color": "Red"
            },
            {
                "color": "Yellow",
                "code_color": "Red"
            },
            {
                "color": "Blue",
                "code_color": "white"
            },
            {
                "color": "DarkBlue",
                "code_color": "white"
            },
            {
                "color": "Green",
                "code_color": "white"
            }
        ],
        toFrontColorView: 'White',
        toBackColorView: 'Black',
        sliderFontObj: {
            min: 10,
            max: 250,
            step: 5,
            value: 35
        },
        bigwordCode: "/image/logo_white.png",
        bigwordCodeSize: 80,
        bigwordText: "来自小程序 图文速成工具",
        bigwordTextSize: 12,
        bigwordTextColor: "Gray",
        nameList: []
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
    show: function (flag) {
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
            that.createNewImg(flag, function () {
                that.data.maskHidden = true
                that.data.canvasHidden = true
                that.setData(that.data);
                if (flag){
                    wx.showToast({
                        title: '点击图片后长按可保存',
                        icon: 'success',
                        duration: 2000
                    });
                }
            });
        }, 2000)
    },
    onReady: function () {
        var that = this
        var systemInfo = app.globalData.systemInfo
        var screenWidth = systemInfo.screenWidth
        var screenHeight = screenWidth



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
    findBigWordCode: function (fillColor) {
        var that = this
        var map = that.data.wordColorMap
        for(var i = 0; i< map.length;i++){
            if (map[i].color == fillColor){
                return "/image/logo_" + map[i].code_color+".png"
            }
        }
        return that.data.bigwordCode
    },
    createNewImg: function (flag, cb) {
        var that = this
        var showWidth = that.data.showWidth
        var showHeight = that.data.showHeight
        var context = wx.createCanvasContext(that.data.mycanvas)
        var fontSize = that.data.fontSize
        var fontColor = that.data.toFrontColorView
        var fillColor = that.data.toBackColorView
        var bigwordText = that.data.bigwordText
        var bigwordTextSize = that.data.bigwordTextSize
        var bigwordTextColor = that.data.bigwordTextColor
        var bigwordCodeSize = that.data.bigwordCodeSize
        var bigwordCode = that.findBigWordCode(fillColor)
        var nameList = that.data.nameList
        if (fillColor == bigwordTextColor){
            bigwordTextColor = fontColor;
        }

        console.log(bigwordCode)

        context.setFillStyle(fillColor)
        context.fillRect(0, 0, showWidth, showHeight)

        context.setFontSize(fontSize)
        context.setFillStyle(fontColor)
        context.setTextAlign("center")

        var wordNum = nameList.length
        var wordPad = 5
        var tmpSize = fontSize 
        var firstHeight = (showWidth - (wordNum * tmpSize + wordPad * (wordNum - 1) ))/2 + tmpSize / 2
        for (var i = 0; i < wordNum; i++){
            var name = nameList[i]
            context.fillText(name, showWidth / 2, firstHeight + tmpSize/4)
            firstHeight += tmpSize + wordPad
        }

        context.setFillStyle(bigwordTextColor)
        context.setFontSize(bigwordTextSize)
        context.setTextAlign("center")
        context.fillText(bigwordText, showWidth / 2, showHeight - 10)

        context.drawImage(bigwordCode, showWidth - bigwordCodeSize, showHeight - bigwordCodeSize, bigwordCodeSize, bigwordCodeSize)


        context.draw()

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
            },
            fail: function (res) {
                console.log("fail", res);
            },
            complete: function (res) {
                console.log("complete", res);
            }
        })
    },
    backColorClick: function (e) {
        var that = this
        that.data.toBackColorView = e.currentTarget.dataset.color
        that.setData(that.data);
    },
    frontColorClick: function (e) {
        var that = this
        that.data.toFrontColorView = e.currentTarget.dataset.color
        that.setData(that.data);
    },
    frontSizeClick: function (e) {
        var that = this
        that.data.fontSize = e.detail.value
        that.data.sliderFontObj.value = that.data.fontSize
    },
    textInputFinish: function (e) {
        var that = this
        that.data.name = e.detail.value
    },
    addLineClick: function (e) {
        var that = this
        that.data.nameList.push(that.data.name)
        that.show(false)
    },
    deleteLineClick: function () {
        var that = this
        if (that.data.nameList.length > 0) {
            that.data.nameList.pop()
            that.show(false)
        }else{
            wx.showToast({
                title: '请先添加文字',
                icon: 'loading',
                duration: 1000
            });
        }
    },
    resetLineClick: function () {
        var that = this
        that.data.nameList = []
        that.show(false)
    },
    formSubmit: function (e) {
        var that = this;
        if (that.data.nameList.length == 0) {
            wx.showToast({
                title: '请先添加文字',
                icon: 'loading',
                duration: 1000
            });
            return
        }
        that.show(true)
    }
})