
  
#-*-coding:utf-8-*-
import cv2
import numpy as np

def cvtBackground(path,color):
    """
        功能：给证件照更换背景色（常用背景色红、白、蓝）
        输入参数：path:照片路径
                color:背景色 <格式[B,G,R]>
    """
    im=cv2.imread(path)
    im_hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
    aim=np.uint8([[im[0,0,:]]])
    hsv_aim=cv2.cvtColor(aim,cv2.COLOR_BGR2HSV)
    # 找出白色的点
    mask=cv2.inRange(im_hsv,np.array([hsv_aim[0,0,0],0,221]),np.array([hsv_aim[0,0,0]+180,30,255]))
    
    # 调整前景与背景相似的像素点
    mask[100:, 120:240] = 0
    mask[384:, 270: 347] = 0
    mask_inv=cv2.bitwise_not(mask)
    img1=cv2.bitwise_and(im,im,mask=mask_inv)
    bg=im.copy()
    rows,cols,channels=im.shape
    bg[:rows,:cols,:]=color
    img2=cv2.bitwise_and(bg,bg,mask=mask)
    img=cv2.add(img1,img2)
    kernel_size = (3, 3);
    sigma = 1.5;
    # 高斯模糊是为了去除前景边缘的白边
    img = cv2.GaussianBlur(img, kernel_size, sigma);
    image={'im':im,'im_1':img1, 'im_2':img2, 'im_hsv':im_hsv,'mask':mask,'img':img}
    # cv2.imwrite("/home/ubuntu/mt.jpg", img)
    for key in image:
        cv2.namedWindow(key)
        cv2.imshow(key,image[key])
    cv2.waitKey(0)
    return img
#test
if __name__=='__main__':
    # 天蓝色的bgr是[235,206,135]
    img=cvtBackground('./zjz3.jpg',[235,206,135])
