<?php

require_once('../lib/base.php');
$base = new Base();
$d = $_REQUEST['d'];
$base->getMoreInfo($d);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>
<script>
    var i=<?php echo $d;?>;
    var timer = setInterval(function(){
        if(i>32){
            clearInterval(timer);
        }
        i++;
        window.location = 'test.php?d='+i;
    },1000);
</script>
</body>
</html>