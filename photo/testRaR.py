'''
Author: suben 18565641627@163.com
Date: 2022-12-06 21:29:27
LastEditors: suben 18565641627@163.com
LastEditTime: 2022-12-07 11:41:13
FilePath: \terminal-node-tool\photo\testRaR.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import os

folder_name = input("C:\\software\\code\\terminal-node-tool\\photo")
os.chdir(folder_name)
file_names = os.listdir("./")
for name in file_names:
    print("是不是文件：", os.path.isfile(name))
    if os.path.isfile(name):
        name = os.path.abspath(name)
        # 返回一个元组，元组第二个元素是扩展名
        if os.path.splitext(name)[1] == ".zip":
            cmd = '\"C:\\Program Files\\7-Zip\\7z.exe\" x \"{0}\" -oe:/测试解压/new *.mp4 -r'.format(name)
            os.popen(cmd)