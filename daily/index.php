<?php
session_start();

header("Content-Type:text/html;charset=utf-8");

if(empty($_SESSION['user'])){
    echo "<script>window.location='login.php';</script>";
    exit;
}

require_once('daily.php');

$daily = new Daily();

$p = $_REQUEST['p'];
$go = $_POST['go'];
$text = $_POST['text'];
$tid = $_POST['tid'];
$text = $_POST['text'];
if($go === 'del'){
    $flag = $daily -> delById($tid);
    echo $flag;
    exit;
}
if($go === 'changedate'){
    $flag = $daily -> updateShowdateById($tid,$text);
    echo $flag;
    exit;
}
if($go === 'changetext'){
    $flag = $daily -> updateTextById($tid,$text);
    echo $flag;
    exit;
}
if($go === 'addtext'){
    $flag = $daily -> addText($text);
    echo $flag;
    exit;
}

$res = $daily -> getAllDaily($p);



//print_r($res);exit;

?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>文字管理</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
        <link href="assets/css/datepicker.min.css" rel="stylesheet" type="text/css">
        <link href="assets/css/sweetalert.css" rel="stylesheet" type="text/css">
	</head>
	<body class="contact">
		<div id="page-wrapper">
			<!-- Main -->
				<article id="main">

					<header class="special container">
						<span class="icon fa-book"></span>
						<h2>Welcome <?php echo $_SESSION['user']['uname']?>.</h2>
						<p>仅提供修改自己添加的文字.</p>
					</header>

					<!-- One -->
						<section class="wrapper style4 special container 95%">

							<!-- Content -->
								<div class="content">
									<table class="default">
										<tbody>
                                            <tr>
                                                <td colspan="5">
                                                    <a href="#" class="add"><i class="fa fa-plus-square-o fa-2x"></i></a>
                                                    <a href="login.php" title="登出" class="loginout"><i class="fa fa-sign-out fa-2x"></i></a>
                                                </td>
                                            </tr>
                                        <?php
                                            if(empty($res['txts'])){
                                                echo "<tr>
                                                    <td>当前无数据,请尽快添加.</td>
                                                </tr>";
                                            }
                                            foreach($res['txts'] as $key=>$val){
                                                if($val['uid'] === $_SESSION['user']['id']){
                                                    $del = '<a href="#"  uid='.$val['uid'].'  tid='.$val['id'].' sid='.$_SESSION['user']['id'].'  class="del"><i class="fa fa-trash-o"></i></a>&nbsp;';
                                                    $edit = 'edit';
                                                }else{
                                                    $del = '';
                                                    $edit = '';
                                                }
                                                echo "<tr tid={$val['id']} >
                                                    <td class='{$edit}' tid={$val['id']} >{$val['text']}</td>
                                                    <td tid={$val['id']} class='changedate'>{$val['showdate']}</td>
                                                    <td>{$val['uname']}</td>
                                                    <td>{$del}</td>
                                                </tr>";
                                            }
                                        ?>
										</tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="5">
                                                   <a href="?p=<?php echo $res['page']['prevNo']?>">上一页</a>
                                                    共<?php echo $res['page']['sum']?>条数据
                                                    每页<?php echo $res['page']['pageSize']?>条
                                                    第<?php echo $res['page']['lastNo']?>/<?php echo $res['page']['lastNo']?>页
                                                    <a href="?p=<?php echo $res['page']['nextNo']?>">下一页</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th colspan="5">
                                                    <h2>Api 使用方法</h2>
                                                    <p>1.引入 &lt;script src="https://api.ioliu.cn/daily/js/daily.js"&gt;&lt;script&gt; 到你要展示的页面.
                                                    <br>2.将展示文字的元素加上 class="daily", 程序会自己查找class名为daily的元素并赋值 .
                                                    <br>3.目前依赖 jQuery, 程序算法上暂时随机, 后续会加入指定日期展示 .</p>
                                                </th>
                                            </tr>
                                        </tfoot>
									</table>
								</div>

						</section>

				</article>
                

		</div>

<!-- Scripts -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/datepicker.min.js"></script>
<script src="assets/js/i18n/datepicker.zh.js"></script>
<script src="assets/js/sweetalert.min.js"></script>

<script>
$(function(){
    
    
    var picker = $('input').datepicker({
        position:'bottom left',
        language:'zh',
        minDate: new Date(),
        autoClose:true,
        dateFormate:'YYYY-mm-dd'
    });
    
    $(document).off('click','.changedate,.edit,.del,.add').on('click','.changedate,.edit,.del,.add',function(e){
        
        e.preventDefault();
        
        var $this = $(this),
            val = $this.html(),
            tid = $this.attr('tid'),
            clazz = this.classList[0];
        switch(clazz){
            case 'changedate':
                swal({   
                    title: "切换展示日期",   
                    text: "请填写要展示的日期:",   
                    type: "input",   
                    showCancelButton: true,   
                    closeOnConfirm: false,   
                    animation: "slide-from-top",   
                    inputPlaceholder: val ,
                    showLoaderOnConfirm: true 
                }, function(inputValue){   
                    var reg = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
                    if (inputValue === false) return false;  
                    if(!reg.test(inputValue)){
                        swal.showInputError("Your input error!");     
                        return false ;  
                    }
                    if (inputValue === "") {     
                        swal.showInputError("You need to write something!");     
                        return false ;  
                    }      
                    
                    $.post('index.php',{
                        go:'changedate',
                        text:inputValue,
                        tid:tid
                    },function(res){
                        if(res>0){
                            swal("Nice!", "Successfully modified", "success"); 
                            window.history.go(0);
                        } else{
                            swal("failed!", "Failed to modified", "error"); 
                        }
                    });
                });
                picker.show();
                
                break;
            case 'edit':
                
                swal({   
                    title: "修改文字",   
                    text: "请填写展示的文字:",   
                    type: "input",   
                    showCancelButton: true,   
                    closeOnConfirm: false,   
                    showLoaderOnConfirm: true ,
                    animation: "slide-from-top",   
                    inputPlaceholder: val 
                }, function(inputValue){   
                   // var reg = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
                    if (inputValue === false) return false;  
                    // if(!reg.test(inputValue)){
                    //     swal.showInputError("Your input error!");     
                    //     return false ;  
                    // }
                    if (inputValue === "") {     
                        swal.showInputError("You need to write something!");     
                        return false ;  
                    }      
                    $.post('index.php',{
                        go:'changetext',
                        text:inputValue,
                        tid:tid
                    },function(res){
                        console.log(res);
                        if(res>0){
                            swal("Nice!", "Successfully modified", "success"); 
                            window.history.go(0);
                        } else{
                            swal("failed!", "Failed to modified", "error"); 
                        }
                    });
                });
                picker.hide();
                break;
            case 'del':
                swal({   
                    title: "删除",   
                    text: "确定要删除这条数据吗?",  
                    type: "warning",   
                    showCancelButton: true,   
                    closeOnConfirm: false,   
                    showLoaderOnConfirm: true 
                }, function(){   
                    // setTimeout(function(){     
                    //     swal("Ajax request finished!");   
                    // }, 2000); 
                    
                    $.post('index.php',{
                        go:'del',
                        tid:tid
                    },function(res){
                        console.log(res);
                        if(res>0){
                            swal("Nice!", "Successfully deleted", "success"); 
                            window.history.go(0);
                        } else{
                            swal("failed!", "Failed to delete", "error"); 
                        }
                    })
                });
                break;
            case 'add':
                
                swal({   
                    title: "新增文字",   
                    text: "请填写展示的文字:",   
                    type: "input",   
                    showCancelButton: true,   
                    closeOnConfirm: false,   
                    showLoaderOnConfirm: true ,
                    animation: "slide-from-top",   
                    inputPlaceholder: '请填写展示的文字' 
                }, function(inputValue){   
                   // var reg = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
                    if (inputValue === false) return false;  
                    // if(!reg.test(inputValue)){
                    //     swal.showInputError("Your input error!");     
                    //     return false ;  
                    // }
                    if (inputValue === "") {     
                        swal.showInputError("You need to write something!");     
                        return false ;  
                    }      
                    $.post('index.php',{
                        go:'addtext',
                        text:inputValue
                    },function(res){
                        console.log(res);
                        if(res>0){
                            swal("Nice!", "Added successfully", "success"); 
                            window.history.go(0);
                        } else{
                            swal("failed!", "Add failed", "error"); 
                        }
                    });
                });
                picker.hide();
                break;
        }
        
    });
});
</script>
	</body>
</html>