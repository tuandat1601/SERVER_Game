<?php
ini_set('date.timezone','Asia/Shanghai');
date_default_timezone_set ( 'PRC' );//时区
header("Content-type:text/html;charset=utf-8"); 
error_reporting(0);
$sqm = $_POST['sqm'];
$num = $_POST['num'];
include "config.php";
$zame = 'PAY_';
$sqm != $d_gmrz && (die("<script>alert('授权码错误');window.history.back(-1); </script>")); 
$num > 1000 && (die("<script>alert('单次最多生成100条');window.history.back(-1); </script>")); 
$num == '' && ($num = 1);
$root=new mysqli($PZ['DB_HOST'],$PZ['DB_USER'],$PZ['DB_PWD'],$PZ['DB_NAME'],$PZ['DB_PORT']);
if (mysqli_connect_errno()){
	$db=new mysqli($PZ['DB_HOST'],$PZ['DB_USER'],$PZ['DB_PWD'],'',$PZ['DB_PORT']);
	$db->autocommit(true); //不使用事物
	if (mysqli_connect_errno()) {
		exit('数据库连接错误！错误代码：' . mysqli_connect_error());
	}
	$db->query("CREATE DATABASE IF NOT EXISTS `{$PZ['DB_NAME']}`;");
	$db->query("use `{$PZ['DB_NAME']}`");
	$db->set_charset("utf8");	
	$rs = $db->query("CREATE TABLE IF NOT EXISTS cdk (
	id int(11) NOT NULL AUTO_INCREMENT,
	  `cdk` varchar(50) CHARACTER SET utf8  NULL,
	  `type` int(11)  NULL DEFAULT '0',
	  `status` int(11)  NULL DEFAULT '0',
	  `uid` varchar(50) CHARACTER SET utf8  NULL DEFAULT '0',
	  `pass` varchar(50) CHARACTER SET utf8  NULL,
	  `qid` varchar(50) CHARACTER SET utf8  NULL,	
	PRIMARY KEY (id ))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");	
	$db->close();
	exit("<script>alert('在线福利数据表创建成功');window.location.reload();</script>");
}

if($root->connect_error){
	exit("数据库连接失败,请检查数据库密码是否正确!");
}
if (!$root->set_charset("utf8")) {
	printf("设置数据库编码utf8错误: %s\n", $root->error);
	exit();
}
for($i=1;$i<=$num;$i++){
	$cdk = cdkey('iguozicc');
	$txt .= $cdk."\n";
	if(!$root->query("INSERT INTO cdk (cdk) VALUES ('{$cdk}');")){die("<script>alert('生成失败,请查看数据库连接是否正常');window.history.back(-1); </script>");}
}
$root->close();
$ts = time().'.txt';
Header ( "Content-type: application/octet-stream" );
Header ( "Accept-Ranges: bytes" );
Header ( "Content-Disposition: attachment; filename=".$zame.$ts);
die($txt);

function cdkey($namespace = null) {  
    static $guid = '';  
    $uid = uniqid ( "", true );  
    $data = $namespace;  
    $data .= $_SERVER ['REQUEST_TIME']; 
    $data .= $_SERVER ['HTTP_USER_AGENT'];
    $data .= $_SERVER ['SERVER_ADDR'];
    $data .= $_SERVER ['SERVER_PORT'];
    $data .= $_SERVER ['REMOTE_ADDR'];
    $data .= $_SERVER ['REMOTE_PORT'];
    $hash = strtoupper (substr(md5($uid.$data), 8, 16));
    $guid = substr ( $hash, 0, 4 ) . '-' . substr ( $hash, 4, 4 ) . '-' . substr ( $hash, 8, 4 ) . '-' . substr ( $hash, 12, 4 );  
    return $guid;  
} 
?>