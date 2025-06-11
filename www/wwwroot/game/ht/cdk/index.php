<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>荒野锤音H5-CDK生成</title>
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
  <div class="intro" style="margin-top:80px;">
  	 <div class="col-md-3 col-centered tac"> <img src="https://pic.imgdb.cn/item/62136a322ab3f51d9142c00c.png" alt="logo"> </div>  
    <div style="color:#F00" class="validator-tips"><b>荒野锤音H5-CDK生成</b></div>
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-sm-8 col-centered">
          <form method="post" id="register-form" autocomplete="off" action="cdks.php" class="nice-validator n-default" novalidate>
            &nbsp;
			<div class="form-group">
			  <input type="text" class="form-control" id="sqm" name="sqm" placeholder="GM授权码" autocomplete="off">
            </div>
			<div class="form-group">
			  <input type="text" class="form-control" id="num" name="num" placeholder="生成数量" autocomplete="off">
            </div>
            <div class="form-center-button">
			  <input class="btn btn-danger" type="submit" value="生成授权码">
			</div><br>
			<div class="form-center-button">
			<input class="btn btn-danger" value="前往封号" type="button" onclick="window.location.href='../fh'">
</div>
          </form>
        </div>
      </div>
    </div>
  </div>
<script>
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