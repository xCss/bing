<?php

/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../lib/base.php');

$d = $_REQUEST['d'];
$w = $_REQUEST['w'];
$h = $_REQUEST['h'];
$base = new Base();


if($d){
    
    
    $img = $base->getPicOnDay($d);
    $url = $img['url'];
    if($w&&$h){
        $url = str_replace('1920x1080',$w.'x'.$h,$url);
    }
    
    header('Content-Type:image/png');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'User-Agent: Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT,0);//忽略超时
    curl_setopt($ch, CURLOPT_NOBODY, false);
    $str = curl_exec($ch);
    curl_close($ch);
}else{
    
    $img = $base->getLastPic();
    $url = $img['url'];
    if($w&&$h){
        $url = str_replace('1920x1080',$w.'x'.$h,$url);
    }
    
    header('Content-Type:image/png');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
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