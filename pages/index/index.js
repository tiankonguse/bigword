// pages/main/index.js
Page({
    data: {
        title:"生成名言图片",
        desc:"by tiankonguse",
        btnText:"生成名言",
        lableName:"你的名言",
        imagePath: "../../image/default.jpg",
        defaultImagePath: "../../image/default.jpg",
        name: "",
        defaultName: "这里输入名言",
        maskHidden: true,
        canvasHidden: true,
        showHeight: 0,
        showWidth: 0,
        mycanvas: "mycanvas",
        systemInfo: {}
    },
    onLoad: function (options) {
    },
    onReady: function () {
        var that = this
        var systemInfo = wx.getSystemInfoSync();
        this.data.systemInfo = systemInfo
        this.data.showWidth = systemInfo.screenWidth
        this.data.showHeight = systemInfo.screenHeight 
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
        this.setData({
            canvasHidden: false
        });
        //var context = wx.createContext();
        var context = wx.createCanvasContext(that.data.mycanvas);
        context.setFillStyle('white')
        context.fillRect(0, 0, showWidth, showWidth)
        context.setFontSize(35)
        context.setFillStyle('black')
        context.setTextAlign("center");// 'left','center','right'
        context.fillText(that.data.name, showWidth / 2, showWidth / 2 );//必须为（0,0）原点
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

    }

})