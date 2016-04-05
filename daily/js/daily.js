/***
 * create date 2016-04-05
 * author @https://github.com/eary
 * More usage please see @https://api.ioliu.cn/daily/js/tools.js
 */

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(9(l,n){"F R";b c={e:9(7,a,0,2,8,6){7=7.E();5(7!==\'h\'&&7!==\'g\')7=\'g\';5(!6)6=M;5(B 0===\'9\'){8=2;2=0}b 3=y;5(i.j){3=o j()}f 5(i.q){3=o q(\'A.D\')}3.x=9(){5(3.C===4&&3.s===w){5(8===\'t\'){2&&2(u.z(3.p))}f{2&&2(3.p)}}};3.T(7,a,6);5(0&&7===\'h\'){b d=\'\';P(b k O 0){5(0.Q(k)){b v=0[k];d+="&"+k+"="+v}}3.r(d.N(1,d.H))}f 3.r()},G:9(a,0,2,8,6){c.e(\'h\',a,0,2,8,6)},I:9(a,0,2,8,6){c.e(\'g\',a,0,2,8,6)},J:9(m){L n.K(m)}};l.c=c})(i,S);',56,56,'params||callback|xhr||if|sync|method|ctype|function|url|var|tools|param|ajax|else|GET|POST|window|XMLHttpRequest||win|selector|doc|new|responseText|ActiveXObject|send|status|json|JSON||200|onreadystatechange|false|parse|Microsoft|typeof|readyState|XMLHTTP|toUpperCase|use|post|length|get|getSelector|querySelector|return|true|slice|in|for|hasOwnProperty|strict|document|open'.split('|')));



tools.get('https://api.ioliu.cn/daily/api.php',function(res){
    console.log(res);
    if(res){
        tools.getSelector('.daily').innerHTML = res['text'];
    }
},'json');