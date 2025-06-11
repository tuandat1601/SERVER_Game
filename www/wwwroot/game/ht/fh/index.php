<?php 
include "../user/config.php";
?>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>荒野锤音H5-GM封号</title>
<link href="https://cdn.staticfile.org/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.staticfile.org/bootstrap-select/1.13.10/css/bootstrap-select.min.css" rel="stylesheet">
<link href="images/main.css" rel="stylesheet">
<script type="text/javascript" src="https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.staticfile.org/bootbox.js/4.4.0/bootbox.min.js"></script>
<script type="text/javascript" src="https://cdn.staticfile.org/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://cdn.staticfile.org/bootstrap-select/1.13.10/js/bootstrap-select.min.js"></script>
<script type="text/javascript" src="https://cdn.staticfile.org/bootstrap-select/1.13.10/js/i18n/defaults-zh_CN.js"></script>
</head>
<body>
  <div class="intro" style="margin-top:100px;">
  	 &nbsp;
    <div style="color:#F00" class="validator-tips"><b><?php echo $GAMENAME;?>-玩家封号</b></div>
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-sm-8 col-centered">
          <form method="post" id="register-form" autocomplete="off" action="#" class="nice-validator n-default" novalidate>
            &nbsp;
           
			<div class="form-group">
			  <select class="form-control" id="qu" name="qu" placeholder="区号" autocomplete="off">
				<option value="1">一区</option>
				
			  </select>
            </div>
			<div class="form-group">
			  <input type="text" class="form-control" id="usr" name="usr" placeholder="提交后台激活码" autocomplete="off">
            </div>
			<div class="form-group">
			  <input type="text" class="form-control" id="pass" name="pass" placeholder="GM密码" autocomplete="off">
            </div>
            <div class="form-center-button">
			  <input class="btn btn-danger" name='reg' id="1" value="提交封号" type="button" onclick= "submitForm()">
              <!-- 新增的按钮 -->
			  <input class="btn btn-primary" name='reg1' id="2" value="提交解封" type="button" onclick= "submitToPay1()">
			</div><br>
          </form>
        </div>
      </div>
    </div>
  </div>
<script>
function api(){
	$.ajaxSetup({contentType: "application/x-www-form-urlencoded; charset=utf-8"});
	$.post("pay.php", {
		usr:$("#usr").val(),
		pas:$("#pass").val(),
		cdk:$("#cdk").val(),
		qu:$("#qu").val()
	},function(data){ 
            $('input[name=reg]').attr('id','1');  
            $('input[name=reg]').attr('value','提交');
            bootbox.alert({message:data,title:"提示"});
	});
 }

function submitForm() {
    $('input[name=reg]').attr('id','0');  
    $('input[name=reg]').attr('value','正在提交...');
    api();
}

function submitToPay1() {
    $.ajax({
        type: "POST",
        url: "pay1.php",
        data: {
            usr: $("#usr").val(),
            pas: $("#pass").val(),
            qu: $("#qu").val()
        },
        success: function(data) {
            $('input[name=reg1]').attr('id','2');  
            $('input[name=reg1]').attr('value','提交解封');
            bootbox.alert({message:data,title:"提示"});
        }
    });
}

document.onkeydown = function(event) {
	var target, code, tag;
	if (!event) {
		event = window.event; //针对ie浏览器
		target = event.srcElement;
		code = event.keyCode;
		if (code == 13) {
			tag = target.tagName;
			if (tag == "TEXTAREA") { return true; }
			else { return false; }
		}
	}else {
		target = event.target; //针对遵循w3c标准的浏览器，如Firefox
		code = event.keyCode;
		if (code == 13) {
			tag = target.tagName;
			if (tag == "INPUT") { return false; }
			else { return true; }
		}
	}
};
</script>
</body>
</html>
