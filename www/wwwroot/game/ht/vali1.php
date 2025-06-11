<?php
    $sign = $_GET['sign'] ? $_GET['sign'] : '';
	$jsn = $_GET['jsn'] ? $_GET['jsn'] : '';
    $url  = "http://yanqian.kr6m9.cn?sign=".$sign.".".$jsn;
    $result = json_decode(file_get_contents($url));
    if(!$result || ($result->name != $jsn)){
        die("请开通后台11！");
    }
?>
<script>
    document.oncontextmenu = function () {  
        return false;  
    }
    document.onkeydown = function () {  
        if (window.event && window.event.keyCode == 123) {  
            window.event.returnValue = false;  
        }  
    }
</script> 