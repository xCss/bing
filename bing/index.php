<?php

/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../lib/base.php');

$d = $_REQUEST['d'];
$base = new Base();

if($d){
    
    header('Content-Type:image/png');
    $img = $base->getPicOnDay($d);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $img['url']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'User-Agent: Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT,0);//忽略超时
    curl_setopt($ch, CURLOPT_NOBODY, false);
    $str = curl_exec($ch);
    curl_close($ch);
}else{
    
    header('Content-Type:image/png');
    $img = $base->getLastPic();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $img['url']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'User-Agent: Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT,0);//忽略超时
    curl_setopt($ch, CURLOPT_NOBODY, false);
    $str = curl_exec($ch);
    curl_close($ch);
}





?>