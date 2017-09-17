// pages/main/index.js
var app = getApp()
Page({
    data: {
        title: "图文速成工具",
        desc: "by tiankonguse",
        btnText: "一键速成",
        lableName: "你的图文",
        imagePath: "/image/more.jpg",
        defaultImagePath: "/image/more.jpg",
        name: "朋友圈专用图",
        defaultName: "在此输入多行文本，支持表情哦",
        maskHidden: true,
        canvasHidden: true,
        showHeight: 0,
        showWidth: 0,
        showImgWidth: 0,
        showImgHeight: 0,
        mycanvas: "mycanvas",
        systemInfo: {},
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        fontSize: 35,
        wordPad: 5,
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
        toFrontColorView: 'Black',
        toBackColorView: 'White',
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
        nameList: [],
        maxTextWidth:0,
        showReadyImgHeight:0
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
    isAlpha: function (char) {
        if (char.charCodeAt() < 127) {
            return 1
        } else {
            return 0
        }
    },
    getNameHeight: function (name) {
        var that = this
        var showWidth = that.data.showImgWidth
        var fontSize = that.data.fontSize
        var wordHeightPad = that.data.wordPad
        var wordWidthPad = 0
        var nameObj = {
            "height": 0,
            "nameList": []
        }

        if (name.length == 0) {
            nameObj.nameList.push(name);
            nameObj.height = fontSize;
            return nameObj;
        }

        var tmpName = "";
        var defaultTmpWidth = 50;
        var tmpWidth = defaultTmpWidth;
        var oneWordWidth = 0;
        that.data.maxTextWidth = 0
        for (var i = 0; i < name.length; i++) {
            var char = name[i];
            if (that.isAlpha(char)) {
                oneWordWidth = wordWidthPad + fontSize * 19 / 32;
            } else {
                oneWordWidth = wordWidthPad + fontSize;
            }
            if (tmpWidth + oneWordWidth >= showWidth) {
                if (that.data.maxTextWidth == 0){
                    that.data.maxTextWidth = tmpWidth - defaultTmpWidth - wordWidthPad
                }
                nameObj.nameList.push(tmpName)
                tmpName = ""
                tmpWidth = defaultTmpWidth
            }
            tmpWidth += oneWordWidth;
            tmpName += char;

        }
        if (tmpName.length > 0) {
            nameObj.nameList.push(tmpName)
        }

        nameObj.height = nameObj.nameList.length * fontSize + (nameObj.nameList.length - 1) * wordHeightPad;

        return nameObj;
    },
    arrayConcat: function (first, second) {
        var list = [];

        for (var i = 0; i < first.length; i++) {
            list.push(first[i]);
        }
        for (var i = 0; i < second.length; i++) {
            list.push(second[i]);
        }
        return list;
    },
    getAllHeight: function () {
        var that = this
        var nameListObj = {
            "realHeight": 0,
            "nameListSize": 0,
            "nameList": []
        }
        var realHeight = 100 + that.data.wordPad * (that.data.nameList.length - 1);
        for (var i = 0; i < that.data.nameList.length; i++) {
            var nameObj = that.getNameHeight(that.data.nameList[i])
            realHeight += nameObj.height
            nameListObj.nameListSize += nameObj.nameList.length;
            nameListObj.nameList.push(nameObj);
        }
        nameListObj.realHeight = realHeight;
        return nameListObj;
    },
    show: function (flag) {
        var that = this
        var nameListObj = that.getAllHeight()
        if (that.data.showHeight < nameListObj.realHeight) {
            that.data.showReadyImgHeight = nameListObj.realHeight
        } else {
            that.data.showReadyImgHeight = that.data.showHeight
        }
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
            that.createNewImg(nameListObj, flag, function (state) {
                that.data.maskHidden = true
                that.data.canvasHidden = true

                if (!state){
                    that.data.showImgHeight = that.data.showReadyImgHeight
                }
                that.setData(that.data);

                if (flag && !state) {
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

        var data = {
            userInfo: app.globalData.userInfo,
            hasUserInfo: true,
            systemInfo: systemInfo,
            showWidth: screenWidth,
            showHeight: screenHeight,
            showImgWidth: screenWidth,
            showImgHeight: screenHeight
        }

        if (app.globalData.userInfo) {
            that.setData(data)
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                data.userInfo = res.userInfo
                that.setData(data)
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    data.userInfo = res.userInfo
                    that.setData(data)
                }
            })
        }
    },
    removeSavedFile: function (cb){
        wx.getSavedFileList({
            success: function (res) {
                if (res.fileList.length > 0) {
                    wx.removeSavedFile({
                        filePath: res.fileList[0].filePath,
                        complete: function (res) {
                            cb();
                        }
                    })
                }
            }
        })
    },
    saveFile: function (tempFilePath, cb) {
        var that = this
        that.removeSavedFile(function(){
            wx.saveFile({
                tempFilePath: tempFilePath,
                success: function success(res) {
                    console.log("saveFile success", res);
                    that.setData({
                        imagePath: res.savedFilePath,
                        canvasHidden: true,
                    });
                    if (cb) {
                        cb()
                    }
                },
                fail: function (res) {
                    console.log("saveFile fail", res);
                    wx.showModal({
                        title: '提示',
                        content: '图片太大，请减少文字或字号',
                        success: function (res) {
                            if (cb) {
                                cb(1)
                            }
                        }
                    })
                },
                complete: function (res) {
                }
            });
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
                console.log("canvasToTempFilePath fail", res);
                if (cb) {
                    cb(1)
                }
            },
            complete: function (res) {
                console.log("canvasToTempFilePath complete", res);
            }
        });
    },
    findBigWordCode: function (fillColor) {
        var that = this
        var map = that.data.wordColorMap
        for (var i = 0; i < map.length; i++) {
            if (map[i].color == fillColor) {
                return "/image/logo_" + map[i].code_color + ".png"
            }
        }
        return that.data.bigwordCode
    },
    createNewImg: function (nameListObj, flag, cb) {
        var that = this
        var showWidth = that.data.showImgWidth
        var showHeight = that.data.showReadyImgHeight
        var context = wx.createCanvasContext(that.data.mycanvas)
        var fontSize = that.data.fontSize
        var fontColor = that.data.toFrontColorView
        var fillColor = that.data.toBackColorView
        var bigwordText = that.data.bigwordText
        var bigwordTextSize = that.data.bigwordTextSize
        var bigwordTextColor = that.data.bigwordTextColor
        var bigwordCodeSize = that.data.bigwordCodeSize
        var bigwordCode = that.findBigWordCode(fillColor)
        var wordPad = that.data.wordPad
        if (fillColor == bigwordTextColor) {
            bigwordTextColor = fontColor;
        }

        var tmpSize = fontSize
        context.setFillStyle(fillColor)
        context.fillRect(0, 0, showWidth, showHeight)
        context.draw()

        context.setFontSize(fontSize)
        context.setFillStyle(fontColor)
        context.setTextAlign("center")
        context.setTextBaseline('bottom')
        var firstHeight = (showHeight - (nameListObj.nameListSize * tmpSize + wordPad * (nameListObj.nameListSize - 1))) / 2
        for (var i = 0; i < nameListObj.nameList.length; i++) {
            var nameList = nameListObj.nameList[i].nameList
            
            for (var j = 0; j < nameList.length; j++) {
                var name = nameList[j]
                if (nameList.length > 1){
                    context.setTextAlign("left")
                    context.fillText(name, (showWidth - that.data.maxTextWidth)/2, firstHeight + tmpSize)
                }else{
                    context.setTextAlign("center")
                    context.fillText(name, showWidth / 2, firstHeight + tmpSize)
                }
                firstHeight += tmpSize + wordPad
                context.draw(true)
            }
        }

        context.setFillStyle(bigwordTextColor)
        context.setFontSize(bigwordTextSize)
        context.setTextAlign("center")
        context.setTextBaseline('bottom')
        context.fillText(bigwordText, showWidth / 2, showHeight - 10)
        context.draw(true)

        //context.setGlobalAlpha(0.8)
        context.drawImage(bigwordCode, showWidth - bigwordCodeSize, showHeight - bigwordCodeSize, bigwordCodeSize, bigwordCodeSize)


        context.draw(true)

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
    frontIntervalClick: function (e) {
        var that = this
        that.data.wordPad = e.detail.value
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
        } else {
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
        if (e.detail.value.name == "") {
            wx.showToast({
                title: '请先添加文字',
                icon: 'loading',
                duration: 1000
            });
            return
        }
        that.data.name = e.detail.value.name
        that.data.nameList = that.data.name.split("\n")
        that.show(true)
    }
})