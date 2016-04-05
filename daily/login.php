<?php
session_start();
header("Content-Type:text/html;charset=utf-8");

require_once('daily.php');

$daily = new Daily();

$name = $_POST['uname'];
$pwd = $_POST['upwd'];

if($name && $pwd){
    $res = $daily->login($name,$pwd);
    if(count($res) > 0){
       //echo '<script>alert("登陆成功")</script>';
        $_SESSION['user'] = $res;
        
        echo "<script>window.location='index.php';</script>";
        exit;
    }else{
        echo '<script>alert("用户名或密码不正确.")</script>';
    }
}

?>

<!DOCTYPE HTML>

<html>
	<head>
		<title>用户登录</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
	</head>
	<body class="index">
		<div id="page-wrapper">
			<!-- Banner -->
            <section id="banner">
                <div class="inner">
                    <header>
                        <h2>登录</h2>
                    </header>
                    <p>若忘记密码, 请致信 mail#xone.me</p>
                    <br>
                    
                    <form action="login.php" method="post" id="login">
                        <div class="row 50%">
                            <div class="12u 12u(mobile)">
                                <input type="text" name="uname" id="uname" placeholder="Username"  autocomplete="off" />
                            </div>
                            <div class="12u 12u(mobile)">
                                <input type="password" name="upwd" id="upwd" placeholder="Password" autocomplete="off" />
                            </div>
                        </div>
                        
                        <footer>
                            <ul class="buttons vertical">
                                <li><button type="submit" class="button fit scrolly">Tell Me More</button></li>
                            </ul>
                        </footer>
                    </form>
                </div>
            </section>
		</div>

<!-- Scripts -->
<script src="assets/js/jquery.min.js"></script>
<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->


	</body>
</html>