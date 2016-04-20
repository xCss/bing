/***
 * create date 2016-04-05
 * 
 * author @https://github.com/eary
 * 
 * Specific usage:
 * 
 * tools.get('https://api.ioliu.cn/bing/json',function(res){
 *     console.log(res);
 *     if(res){
 *         tools.getSelector('.bing').innerHTML = "<a target='_blank' href='"+res['copyrightlink']+"' >"+res['copyright']+"</a>";
 *     }
 * },'json');
 * 
 * 
 */

(function(win,doc){
    
    "use strict";
    
    var tools = {
        /***
         * Ajax Method
         * @param method    [request method: get / post]
         * @param url       [request url]
         * @param params    [request params: {'name':'zhangsan',...}]
         * @param callback  [callback function]
         * @param ctype     [result type: json / other]
         * @param sync      [asynchronous call: true / false]
         */
        ajax: function(method,url,params,callback,ctype,sync){
            method = method.toUpperCase();
            if(method !== 'POST' && method !=='GET' ) 
                method = 'GET';
            if(!sync) 
                sync = true;
            if(typeof params === 'function'){
                ctype = callback;
                callback = params;
            }
            var xhr = false;
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else if(window.ActiveXObject){
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    if(ctype === 'json'){
                        callback && callback(JSON.parse(xhr.responseText));
                    }else{
                        callback && callback(xhr.responseText);
                    }
                }
            };
            
            xhr.open(method,url,sync);
            if(params && method === 'POST'){
                var param = '';
                for(var k in params){
                    if(params.hasOwnProperty(k)){
                        var v = params[k];
                        param += "&"+k+"="+v;
                    }
                }
                //xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhr.send(param.slice(1,param.length));
            }else xhr.send();
        },
        
        post: function(url,params,callback,ctype,sync){
            tools.ajax('POST',url,params,callback,ctype,sync);
        },
        
        get: function(url,params,callback,ctype,sync){
            tools.ajax('GET',url,params,callback,ctype,sync);
        },
        
        getSelector: function(selector){
            return doc.querySelector(selector);
        }
    };
    
    win.tools = tools;
    
})(window,document);
