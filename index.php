<?php

/**
* CopyRight Bitmoe · eary
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('./lib/base.php');

$p = $_REQUEST['p'];
$api = new Base();
$pics = $api -> getPicsByPagin($p);

?>

<!DOCTYPE HTML>
<html>
	<head>
		<title>
            <?php
            if($p>1){
                echo '第'.$p.'页 - 必应壁纸. ';
            }else {
                echo '首页 - 必应壁纸. ';
            }
            ?>
              
        </title>
		<meta charset="utf-8" />
        <meta property="wb:webmaster" content="4513019856d2091e" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
        <meta name="keywords" content="Bing,Bing壁纸,bing壁纸api,Bing最新壁纸,壁纸分享,壁纸下载,必应壁纸">
        <meta name="description" content="Bing每日壁纸:风景, 这边独好。">
	    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1">
        <meta name="author" content="Bitmoe · eary">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="renderer" content="webkit">
        <meta name="theme-color" content="#4F4F4F"/><link href="/assets/css/images/bing.ico" rel="shortcut icon"/>
        
    </head>
	<body>

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Header -->
					<header id="header">
						<!--<h1><a href="index.html"><strong>Bing Pictures.</strong> by ioliu.cn</a></h1>-->
						<h1><a href="/"><strong>&copy; Bing.</strong></a></h1>
						<nav>
							<ul>
								<li><a href="#footer" class="icon fa-info-circle">About</a></li>
								<li><a href="?p=<?php echo $pics['page']['prevNo'] ?>" class=""><i class="icon fa-chevron-circle-left"></i> PREV</a></li>
								<li><a href="?p=<?php echo $pics['page']['nextNo'] ?>" class="">NEXT <i class="icon fa-chevron-circle-right"></i></a></li>
							</ul>
						</nav>
					</header>

				<!-- Main -->
					<div id="main">
						<?php 
                        foreach($pics['images'] as $key=>$value){
                            
                            echo '<article class="thumb">
                                <a href="'.$value['img_url'].'" class="image"><img src="'.$value['img_url'].'" alt="" /></a>
                                <h2>#'.$value['date'].'# '.$value['copyright'].'</h2>
                                <p>
                                    <a target="_blank" href="'.$value['copyrightlink'].'" class="button">查看</a>
                                    <a target="_blank" href="'.$value['url'].'" class="button">下载</a>
                                    <a target="_blank" href="http://service.weibo.com/share/share.php?url=https%3A%2F%2Fapi.ioliu.cn&title='.urlencode('#Bing每日壁纸#'.$value['copyright'].',#'.$value['enddate'].'#').'&appkey=1833831541&pic='.urlencode($value['url']).'" class="button">分享</a>
                                </p>
                            </article>';
                            
                        }
                        ?>
					</div>

				<!-- Footer -->
					<footer id="footer" class="panel">
						<div class="inner ">
							<div>
								<section>
									<h2>Bing 壁纸 api 用法</h2>
									<p>1. 访问 <a href="/bing" target="_blank" >https://api.ioliu.cn/bing</a>, 返回bing每日最新背景图. 可选参数[w,h] </p>
									<p>2. 访问 <a href="/bing?d=0" target="_blank" >https://api.ioliu.cn/bing?d=n</a> (n>=0, max=<span class="max">00</span>), 返回以当日为起点n天前的壁纸. 可选参数[w,h] </p>
									<p>3. 访问 <a href="/bing/json" target="_blank" >https://api.ioliu.cn/bing/json</a> , 返回bing每日最新壁纸的相关(介绍、图片地址等)信息(json格式).</p>
                                    <p>4. 访问 <a href="/bing/rand" target="_blank" >https://api.ioliu.cn/bing/rand</a> , 返回随机图片. 可选参数[w,h]</p>
                                    <p>目前已知分辨率[w,h]请点击 → <a href="https://github.com/Eary/bing#目前已知分辨率">https://github.com/Eary/bing</a> </p>
                                </section>
								<section>
									<h2>Follow me on ...</h2>
									<ul class="icons">
										<!--<li><a target="_blank" href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
										<li><a target="_blank" href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
										<li><a target="_blank" href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
										<li><a target="_blank" href="#" class="icon fa-dribbble"><span class="label">Dribbble</span></a></li>-->
										<li><a target="_blank" href="http://github.com/eary/bing" class="icon fa-github"><span class="label">GitHub</span></a></li>
										<li><a target="_blank" href="http://weibo.com/1842336184" class="icon fa-weibo"><span class="label">Weibo</span></a></li>
										<li><a target="_blank" href="mailto:yy.liu@foxmail.com" class="icon fa-envelope"><span class="label">Mail</span></a></li>
									</ul>
								</section>
								<p class="copyright">
									<a href="http://www.miitbeian.gov.cn/">粤ICP备15050037号</a>
                                    &copy; 2016. <a href="/">ioliu.cn</a>. POWERED BY Bing.
                                </p>
							</div>
						</div>
					</footer>

			</div>

<!-- Scripts -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/jquery.poptrox.min.js"></script>
<script src="assets/js/skel.min.js"></script>
<script src="assets/js/util.js"></script>
<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
<script src="assets/js/main.js"></script>
<script>
$(function(){
    
    var start = "2016-03-04";
    
    var startDate = (new Date(start)).getTime();
    
    var now = new Date();
    
    var today = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    
    now = (new Date(today)).getTime();
    
    var calc = Math.floor((new Date(now - startDate)) / 1000 / 60 / 60 / 24);
    
    $('.max').html(calc);
    
    
    //百度统计
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?99d1e1ee6b085485bc6ec3e23b821b49";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    
});
</script>

</body>
</html>