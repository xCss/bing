<?php

require_once('../lib/loadQiniu.php');
$qiniu = new LoadQiniu();
$qiniu->upload('http://s.cn.bing.net/az/hprichbg/rb/RabbitIsland_ZH-CN10320047201_1920x1080.jpg','az/hprichbg/rb/RabbitIsland_ZH-CN10320047201_1920x1080.jpg');

//phpinfo();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>
<script>
</script>
</body>
</html>