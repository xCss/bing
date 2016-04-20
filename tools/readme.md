# tools.js 迷你Ajax请求工具
`tools.js` 封装了`ajax`、`get`、`post` 三种请求方式，专为没有引用 `jQuery` 的网页而生。

# tools.js 使用方法  
1. 引入 `<script src="https://api.ioliu.cn/tools/tools.js"></script>` 到页面最底部`</body>`之前。
2. 使用方式和`$.ajax`/`$.get`/`$.post` 完全一样, 直接调用`tools.ajax`/`tools.get`/`tools.post`。  
```js
tools.get('https://api.ioliu.cn/bing/json',function(res){
    console.log(res);
    if(res){
        tools.getSelector('.bing').innerHTML = "<a target='_blank' href='"+res['copyrightlink']+"' >"+res['copyright']+"</a>";
    }
},'json');
```



