[![Bitmoe](https://img.shields.io/badge/Powered%20By-Bitmoe-blue.svg?style=flat-square)](https://github.com/bitmoe) 
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)]()  

## BING 壁纸 API 用法  
 - 1. 访问 https://api.ioliu.cn/bing , 返回bing每日最新背景图.  
 - 2. 访问 https://api.ioliu.cn/bing?d=n (n>=0), 返回以当日为起点第n天前的壁纸.  
 - 3. 访问 https://api.ioliu.cn/bing/json , 返回bing每日最新壁纸的相关(介绍、图片地址等)信息(json格式).  
 - 4. 提供分辨率接口.
``` 
https://api.ioliu.cn/bing?&w=1920&h=1200    //返回Bing每日最新宽`1920`高`1200`的分辨率背景图片
https://api.ioliu.cn/bing?d=1&w=1920&h=1200  //返回以当日为起点1天前的宽`1920`高`1200`的分辨率背景图片
//目前已知分辨率     
1920x1200   
1920x1080    
1366x768   
1280x768    
1024x768    
800x600    
800x480    
640x480    
400x240    
320x240   
```   
 
<a href="https://api.ioliu.cn" target="_blank">预览地址</a> 