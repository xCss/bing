<?php
header('Access-Control-Allow-Origin:*');  
header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
header('content-type: application/json; charset=utf-8');

require_once('daily.php');
$daily = new Daily();

$data = $daily -> getDailyOnRand();
echo json_encode($data[0]);
?>