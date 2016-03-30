<?php

/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../lib/base.php');

$d = $_REQUEST['d'];
$r = $_REQUEST['r'];
$w = $_REQUEST['w'];
$h = $_REQUEST['h'];
$base = new Base();


if($d){
    $img = $base->getPicOnDay($d);
    $url = $img['url'];
    $base -> outputPic($url);
}else{
    $img = $base->getLastPic();
    $url = $img['url'];
    $base -> outputPic($url);
}







?>