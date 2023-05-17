/**
 * Name:            Image.js
 * Desc:            图片操作类，压缩图片，图片转file/blob对象，灰度图转彩色
 * Author:          BulletYuan
 * Create-Time:     2018.09.23
 * Last-Time:       
 */
const
    Image = (function () {
        //初始化canvas画布
        function initImage(img) {
            if (!img) throw new Error(`initImage(img) 出现了错误！`);
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let anw = document.createAttribute("width");
            anw.nodeValue = img.width;
            let anh = document.createAttribute("height");
            anh.nodeValue = img.height;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            return { canvas, ctx };
        }
        //绘制图像
        function drawImage(ctx, img) {
            if (!ctx || !img) throw new Error(`drawImage(ctx,img) 出现了错误！`);
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        //获取图像ImageData数据
        function getImageData(ctx, img) {
            if (!ctx || !img) throw new Error(`getImageData(ctx,img) 出现了错误！`);
            return ctx.getImageData(0, 0, img.width, img.height);
        }
        //重设像素rgb值
        function resetPixel(data) {
            if (!data) throw new Error(`getPixel(data) 出现了错误！`);
            let uint8 = new Uint8ClampedArray(data);

            for (let i = 0; i < uint8.length; i++) {
                if (uint8[i] !== 0 && ((i + 1) % 4 === 2 || (i + 1) % 4 === 3)) {
                    uint8[i] = 0;
                }
            };
            return uint8;
        }
        //根据图像像素的uint8数组生成ImageData，然后重绘图像
        function updateImageData(ctx, px, width, height) {
            if (!ctx || !px) throw new Error(`updateImage(ctx,px) 出现了错误！`);
            ctx.clearRect(0, 0, width, height);
            let imgData = new ImageData(px, width, height);
            ctx.putImageData(imgData, 0, 0);
        }

        function A() { }
        A.prototype.zipImage = function (obj) {
            if (typeof document === 'undefined') throw new Error(`当前环境暂不支持DOM！`);
            if (!obj || !obj.imgSrc) return false;
            let img = new Image();
            img.src = obj.imgSrc;
            img.onload = () => {
                let w = img.width,
                    h = img.height,
                    scale = w / h;
                obj.width = w > 800 ? (w > 1200 ? 800 : (w / 2)) : 400;
                obj.height = w / scale;
                if (Number(obj.width) && Number(obj.width) == Number(obj.width)) {
                    obj.height = w / scale;
                }
                if (Number(obj.height) && Number(obj.height) == Number(obj.height)) {
                    scale = h / w;
                    obj.width = h / scale;
                }
                if (!obj.quality || obj.quality > 1 || obj.quality <= 0) obj.quality = 0.7;
                obj.fileType = obj.fileType || "jpeg"
                obj.done = obj.done || function (base64) { };
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                // 创建属性节点
                let anw = document.createAttribute("width");
                anw.nodeValue = w;
                let anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(img, 0, 0, w, h);
                let base64 = canvas.toDataURL('image/' + obj.fileType, obj.quality);
                obj.done(base64);
            };
        };
        A.prototype.toFileBlob = function (dataURI, type) {
            if (typeof document === 'undefined') throw new Error(`当前环境暂不支持DOM！`);
            if (dataURI) {
                type = type || 0;
                let arr = dataURI.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), fileExt = mime.split('/')[1], n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                if (type <= 0) {
                    return new Blob([u8arr], { type: mime });
                } else {
                    return new File([u8arr], "file_" + Date.parse(new Date()) + fileExt, { type: mime });
                }
            }
        };
        A.prototype.Gray2ColorImage = function (opt) {
            if (typeof document === 'undefined') throw new Error(`当前环境暂不支持DOM！`);
            let imageSrc = opt['imgSrc'];
            let doneFn = opt['done'] || ((base64) => { });
            if (!imageSrc) throw new Error(`没有图像输入！`);
            let image = new Image();
            image.src = imageSrc;
            let self = this;
            image.onload = async () => {
                let width = self.image.width;
                let height = self.image.height;
                let can = await initImage(self.image);
                await drawImage(can.ctx, self.image);
                let imgData = await getImageData(can.ctx, self.image);
                let uint8 = await resetPixel(imgData.data);
                await updateImageData(can.ctx, uint8, width, height);
                document.body.appendChild(can.canvas);
                doneFn(can.canvas.toDataURL);
            }
        }

        return A;
    })();

module.exports = Image;