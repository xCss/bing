<?php

/**
* CopyRight Bitmoe · eary
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
header('Access-Control-Allow-Origin:*');  
header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
header('content-type: application/json; charset=utf-8');
require('../../lib/base.php');
$base = new Base();
$array = $base->getLastPic();
echo json_encode($array);
?>