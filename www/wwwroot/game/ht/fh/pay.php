<?php
error_reporting(0);
include "../user/config.php";
if($_POST){
	$usr = $_POST['usr'];
	$quid = intval($_POST['qu']);
	$pas = trim($_POST['pas']);
	if(!$quid) die('请先选区');
	$usr =='' && (die('请输入账号'));
	$pas !=$gm_code && (die('GM密码错误'));

	$mysql1= new mysqli($PZ['DB_HOST'],$PZ['DB_USER'],$PZ['DB_PWD'],$PZ['DB_NAME'],$PZ['DB_PORT']); //cdk
     if ($mysql1->connect_errno) die('数据库连接失败');
     
     
     
	$mysql= new mysqli($PZ['DB_HOST'],$PZ['DB_USER'],$PZ['DB_PWD'],$PZ['DB_GAME'],$PZ['DB_PORT']); //游戏数据库
	if ($mysql->connect_errno) die('数据库连接失败');

	$x = $mysql1->query("select * from cdk where cdk='".$usr."'");
    $xx=$x->fetch_assoc();
    if(!$xx['uid']) {die('该激活码未授权账号');
	}else{
    $cid=$xx['uid'];   ///获取账号

}

	$sl = $mysql->query("select * from role where userid='".$cid."'");
    $cx=$sl->fetch_assoc();
    if(!$cx['id']) {die('账号无角色');
	}else{
    $rid=$cx['id'];}
    
    
 $urllogin = "http://127.0.0.1:668/api/login";

$datalogin = [
    'username' => 'admin',
    'password' => 'admin999',
];

// 初始化cURL会话
$chlogin = curl_init();

// 设置cURL选项
curl_setopt($chlogin, CURLOPT_URL, $urllogin);
curl_setopt($chlogin, CURLOPT_POST, true);
curl_setopt($chlogin, CURLOPT_POSTFIELDS, http_build_query($datalogin));
curl_setopt($chlogin, CURLOPT_RETURNTRANSFER, true);
curl_setopt($chlogin, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
]);

// 执行cURL请求
$responselogin = curl_exec($chlogin);

// 检查错误
if (curl_errno($chlogin)) {
    echo 'Error: ' . curl_error($chlogin);
} else {
    // 解析JSON响应
    $responseData = json_decode($responselogin, true);
    
    if (isset($responseData['success']) && $responseData['success'] === true) {
        // 登录成功，保存信息到文件
        $loginData = [
            'username' => $responseData['data']['username'],
            'nickname' => $responseData['data']['nickname'],
            'accessToken' => $responseData['data']['accessToken'],
            'refreshToken' => $responseData['data']['refreshToken'],
            'roles' => implode(',', $responseData['data']['roles']),
        ];
        file_put_contents('login_info.txt', json_encode($loginData, JSON_PRETTY_PRINT));
       // echo '登录成功，信息已保存到文件！';
    } else {
       // echo '登录失败：' . $responseData['message'];
    }
}

// 关闭cURL会话
curl_close($chlogin);   
    
    
$tokenFile = 'login_info.txt';
$tokenData = json_decode(file_get_contents($tokenFile), true);

// 使用accessToken进行后续请求beSendRechargeShop
$urldaoju = "http://127.0.0.1:668/api/customerservice/updateRoleStatus";

$datadaoju = [
    'gameid' => 1,
    'serverid' => 1,
    'roleid' => $rid,
    'status' => 1 //封号
];

// 初始化cURL会话
$chdaoju = curl_init();

// 设置cURL选项
curl_setopt($chdaoju, CURLOPT_URL, $urldaoju);
curl_setopt($chdaoju, CURLOPT_POST, true);
curl_setopt($chdaoju, CURLOPT_POSTFIELDS, json_encode($datadaoju));
curl_setopt($chdaoju, CURLOPT_RETURNTRANSFER, true);
curl_setopt($chdaoju, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $tokenData['accessToken'], // 使用accessToken
]);

// 执行cURL请求
$responsedaoju = curl_exec($chdaoju);
//var_dump($responsedaoju); die;

// Decode the JSON response
$responseArray = json_decode($responsedaoju, true);



	if (isset($responseArray['success']) && $responseArray['success'] === true){
	die($cid . $responseArray['message']);

	}else{
		die('封禁失败');
	}	
}	else{
	die('不支持的操作');
}
?>