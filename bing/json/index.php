<?php

/**
* CopyRight Bitmoe · eary
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../../lib/base.php');
$base = new Base();
$array = $base->getLastPic();
echo json_encode($array);
?>