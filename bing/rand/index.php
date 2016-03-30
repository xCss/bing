<?php
/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../../lib/base.php');

$r = $_REQUEST['r'];
$w = $_REQUEST['w'];
$h = $_REQUEST['h'];

$base = new Base();

$img = $base->getRandPic();

$url = $img['url'];

if($w&&$h){
    $url = str_replace('1920x1080',$w.'x'.$h,$url);
}

$base -> outputPic($url);


?>