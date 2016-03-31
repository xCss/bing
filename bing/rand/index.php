<?php
/**
* CopyRight Bitmoe · eary
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

$base -> outputPic($url,$w,$h);


?>