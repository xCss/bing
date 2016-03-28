<?php

/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../lib/base.php');
$base = new Base();
$array = $base->getLastPic();

echo json_encode($array);
?>