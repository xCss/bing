
<?php

echo $_SERVER['SCRIPT_URI'];exit;

require_once('../lib/base.php');
$base = new Base();
$base->putQiniu();

//phpinfo();
?>