
api https://api.ioliu.cn/bing/json 返回的json格式如下：  
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

# tools.js Usage
```
//import <script src="https://api.ioliu.cn/tools/tools.js"></script>
tools.get('https://api.ioliu.cn/bing/json',function(res){
    console.log(res);
    if(res){
        tools.getSelector('.bing').innerHTML = "<a target='_blank' href='"+res['copyrightlink']+"' >"+res['copyright']+"</a>";
    }
},'json');
```