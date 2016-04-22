

![](http://ww1.sinaimg.cn/large/0060lm7Tgw1f2crjs3pxmj31400n64h6.jpg)

## BING 壁纸 API 用法
 - 1. 访问 https://api.ioliu.cn/bing/ , 返回bing每日最新背景图, 可选参数`[w,h]`
 - 2. 访问 https://api.ioliu.cn/bing/?d=n (n>=0), 返回以当日为起点第n天前的壁纸, 可选参数`[w,h]`
 - 3. 访问 https://api.ioliu.cn/bing/json/ , 返回bing每日最新壁纸的相关(介绍、图片地址等)信息(json格式).  
 - 4. 访问 https://api.ioliu.cn/bing/rand/ , 返回随机图片, 可选参数`[w,h]`
 - 5. 访问 https://api.ioliu.cn/bing/blur/ , 返回`高斯模糊`图片, 可选参数`[d,w,h]`
 
带`[w,h]`用法： https://api.ioliu.cn/bing/rand/?w=1920&h=1200  

### 目前已知分辨率`[w,h]`
```   
1920x1200   
1920x1080    
1366x768   
1280x768    
1024x768    
800x600    
800x480
768x1280  
720x1280      
640x480   
480x800     
400x240     
320x240 
240x320  
```   

### api https://api.ioliu.cn/bing/json/ 返回的json格式如下(已支持跨域)：  
```
{
    id: "47",
    title: "有灵气的犄角",
    attribute: "大角羊",
    description: "头顶两只巨大羊角的大角羊喜欢生活在多岩石的干燥地区，它们尤为喜欢各种开阔、干燥的沙漠和岩石山上。在落基山脉，大角羊随处可见，行动敏捷、视力敏锐的它们为这片旷野增添了不少活力。",
    startdate: "20160419",
    enddate: "20160420",
    fullstartdate: "201604191600",
    url: "http://s.cn.bing.net/az/hprichbg/rb/BigHornSheep_ZH-CN6358178150_1920x1080.jpg",
    urlbase: "/az/hprichbg/rb/BigHornSheep_ZH-CN6358178150",
    copyright: "加拿大，阿尔伯塔，卡纳纳斯基斯行政区的落基山脉大角羊 (© Walter Nussbaumer/Corbis)",
    copyrightlink: "http://www.bing.com/search?q=%E5%A4%A7%E8%A7%92%E7%BE%8A&form=hpcapt&mkt=zh-cn",
    hsh: "7da649ef5e67013814d6b618d0a35ece",
    qiniu_url: "BigHornSheep_ZH-CN6358178150",
    date: "2016-04-20"
}
```  
可以配合 [tools.js](https://github.com/eary/tools) 使用 (不依赖jQuery)
 
## [更新日志 / Changelog](https://github.com/Eary/bing/wiki/%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97---Changelog )


--------------------------  
    如果您觉得还不错，请点击右上角的 Star ，反正又不花钱<(￣︶￣)↗[GO!]
--------------------------

[![Bitmoe](https://img.shields.io/badge/Powered%20By-Bitmoe-blue.svg?style=flat-square)](https://github.com/bitmoe) 
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)]()  


