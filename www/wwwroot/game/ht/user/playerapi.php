<?php
 //error_reporting(0);
session_start();
// 获取当前时间的毫秒数
list($msec, $sec) = explode(' ', microtime());
$msectime = (float)sprintf('%.0f', (floatval($msec) + floatval($sec)) * 1000);

// 检查是否已经记录了上一次请求的时间
if (!isset($_SESSION['lasttime'])) {
    $_SESSION['lasttime'] = $msectime; // 如果没有记录，则设置当前时间为上次请求时间
}

// 计算两次请求之间的时间差
$timeDiff = $msectime - (float)$_SESSION['lasttime'];

// 如果两次请求之间的时间小于2秒，则返回错误信息
if ($timeDiff < 2000) {
    echo json_encode(array('info' => 0, 'msg' => '2秒发送一次'));
    die;
} else {
    $_SESSION['lasttime'] = $msectime; // 更新最后一次请求的时间为当前时间
}
//date_default_timezone_set('PRC');
header("Content-type: text/html; charset=utf8");
//var_dump($_POST);die;
	//include 'config.php';
	$type = $_POST['type'];
	$checknum = $_POST['pswd'];
    $dbip = $qu['host'];
    $zoneid = $qu['zoneid'];
    $quname = $qu['name'];
    $url = $qu['url'];
	$quid = $_POST['qu'];	
    $qu        =  $quarr[$quid];
	$uid = $_POST['username'];	
    $url       =  $qu['url'];
    $srv_name  =  $qu['srv_name'];
    $adm_user  =  $qu['user'];
	$adm_pswd  =  $qu['pswd'];
	$namecol='角色ID';	
	$qid=($_POST['qu']);
	$qu11=$quarr[strval($qid)];



$uid=$_POST['username'];

if(!$uid){
	echo json_encode(array('info'=>0,msg=>'游戏账号不能为空'));die;
}
$pswd=$_POST['pswd'];

if(!$pswd){
	echo json_encode(array('info'=>0,msg=>'后台密码不能为空'));die;
}

// 创建数据库连接
$dbid = mysqli_connect('127.0.0.1', 'root', '123456', 'lyz_webgame', 3306) or  die(json_encode(['code' => 200, 'msg' => '连接失败！']));
$dbid->query('SET NAMES utf8');

// 准备 SQL 查询
$sqlid = "SELECT id FROM role WHERE userid = ?";

// 使用预处理语句以防止 SQL 注入
$stmtid = $dbid->prepare($sqlid);

if ($stmtid) {
    // 绑定参数
    $stmtid->bind_param('i', $uid); // 'i' 表示将 $uid 作为整数绑定

    // 执行查询
    $stmtid->execute();

    // 获取结果
    $resultid = $stmtid->get_result();

    if ($resultid->num_rows > 0) {
		$rowid = $resultid->fetch_assoc(); // 只有一行
    } else {
        // echo json_encode(array('info'=>0,msg=>'该游戏账号没有角色'));die;
         die(json_encode(['code' => 200, 'msg' => '该游戏账号没有角色！']));
    }

    // 关闭预处理语句
    $stmtid->close();
} else {
   // echo json_encode(array('info'=>0,msg=>'查询失败'));die;
    die(json_encode(['code' => 200, 'msg' => '查询失败！']));
}

//var_dump($rowid['id']);die;

$db2 = mysqli_connect('127.0.0.1','root','123456','cdks',3306) or die("数据库连接错误1");


$db2->query('set names utf8');
//var_dump($mysql);die;
//$ss = mysqli_fetch_assoc($mysql->query("SELECT FROM cdk WHERE uid = '$rid' limit 1"));
$ss = mysqli_fetch_assoc($db2->query("SELECT * FROM cdks.cdk WHERE uid = '{$uid}' "));
//var_dump($ss);die;
if($ss['status'] != 1 && $type != 'pay'){
    //echo json_encode(array('info'=>0,msg=>'角色未授权'));die;
    die(json_encode(['code' => 200, 'msg' => '角色未授权！']));
}
if($ss['pass'] != $checknum && $type != 'pay'){
    //echo json_encode(array('info'=>0,msg=>'后台密码错误'));die;
    die(json_encode(['code' => 200, 'msg' => '后台密码错误！']));
}



$urllogin = "http://127.0.0.1:668/api/login";

$datalogin = [
    'username' => 'admin',
    'password' => 'sourcegamevn',
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

switch($_POST['type']){

	case 'charge':

	
	$rechargeId = $_POST['rechargeId'];
// 读取保存的token信息
$tokenFile = 'login_info.txt';
$tokenData = json_decode(file_get_contents($tokenFile), true);

// 使用accessToken进行后续请求beSendRechargeShop
$urlcharge = "http://192.168.200.129:891/ln1/shop/beSendRechargeShop";
$gameId = 1;
$mains_serverid = 1;
$shopid = $rechargeId;
$roleid = $rowid['id'];
$secret = "webapi2023yd99";
$time=time();
$sgin = $gameId . $mains_serverid . $shopid . $roleid . $secret . $time;
 $key = strtolower(md5($sgin));
//$urlcharge = "http://127.0.0.1:668/api/games-mgr/beSendRechargeShop";
$datacharge = [
    'gameId' => 1,
    'key' => $key, // 这里需要填写实际的key
    'num' => 1,
    'roleid' => $rowid['id'],
    'serverid' => 1,
    'shopid' => intval($rechargeId),
    'time' => time(), // 当前时间戳
];

// 初始化cURL会话
$chcharge = curl_init();
//var_dump($datacharge); die;
// 设置cURL选项
curl_setopt($chcharge, CURLOPT_URL, $urlcharge);
curl_setopt($chcharge, CURLOPT_POST, true);
curl_setopt($chcharge, CURLOPT_POSTFIELDS, json_encode($datacharge));
curl_setopt($chcharge, CURLOPT_RETURNTRANSFER, true);
curl_setopt($chcharge, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $tokenData['accessToken'], // 使用accessToken
]);

// 执行cURL请求
$responseCharge = curl_exec($chcharge);
//var_dump($responseCharge); die;

// Decode the JSON response
$responseArray = json_decode($responseCharge, true);

if ($responseArray) {
    die(json_encode(['code' => 200, 'msg' => '充值成功，游戏里锤下更新数据！']));
} else {
    die(json_encode(['code' => 400, 'msg' => '充值失败: ' . $responseArray['message']]));
}
// 关闭cURL会话
curl_close($chcharge);
	break;
						
						
						
	case 'mail':
$mailid = $_POST['mailid'];
$mailnumyj = $_POST['mailnumyj'];	   
// 读取保存的token信息
$tokenFile = 'login_info.txt';
$tokenData = json_decode(file_get_contents($tokenFile), true);

// 使用accessToken进行后续请求
$urldaoju = "http://127.0.0.1:668/api/games-mgr/sendEmail";

$datadaoju = [
    'content' => "你查收邮件，自己不控制数量刷炸不理！",
    'gameId' => 1,
    'items' => [
        ['i' => $mailid, 'n' => $mailnumyj]
    ],
    'key' => "123",
    'owner' => $rowid['id'],
    'sender' => "GM",
    'serverid' => 1,
    'title' => "GM邮件"
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

if (isset($responseArray['success']) && $responseArray['success'] === true) {
    die(json_encode(['code' => 200, 'msg' => '发送成功，点信封领取！']));
} else {
    die(json_encode(['code' => 400, 'msg' => '发送失败: ' . $responseArray['message']]));
}
// 关闭cURL会话
curl_close($chdaoju);
break;
                        case 'mailjl':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];


							$mailnum = $_POST['mailnumjl'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 2) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumjl'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$title,$content,$srv_name);
							//$result = sendMail($url,$uid,$cookie,$chargetype,$chargenum,$srv_name);
							//var_dump($result);die;
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;

                        case 'mailtc':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];

                           

							$mailnum = $_POST['mailnumtc'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 2) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumtc'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$srv_name,$title,$content);
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;

                        case 'maildj':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];

                       

							$mailnum = $_POST['mailnumdj'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 99999) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumdj'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$srv_name,$title,$content);
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;

                        case 'mailsp':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];

                          
							$mailnum = $_POST['mailnumsp'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 999999) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumsp'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$srv_name,$title,$content);
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;

                        case 'mailhs':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];

                    

							$mailnum = $_POST['mailnumhs'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 999) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumhs'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$srv_name,$title,$content);
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;

                        case 'mailtx':
						//防止f12
						$cookie     =  loginGetCookie($url,$adm_user,$adm_pswd);
							$mailid = $_POST['mailid'];


							$mailnum = $_POST['mailnumtx'];
                            if ($mailnum == '' || $mailnum < 0 || $mailnum > 2) {
                                echo json_encode(array('info'=>0,msg=>'物品数量错误！'));die;
                            }
							$item = $_POST['mailid'];
							$itemnum = $_POST['mailnumtx'];
							$title = $_POST['title'];
							$content = $_POST['content'];
							sendMail($url,$uid,$cookie,$item,$itemnum,$srv_name,$title,$content);
							 echo json_encode(array('info'=>1,'msg'=>'发送成功！'));
                        break;


case 'pay':{
	$cdk = $_POST['cdk'];
	$pswd = $_POST['pswd'];

    $xxs = mysqli_fetch_assoc($db2->query("SELECT * FROM cdk WHERE uid = '$uid' limit 1"));

    if($xxs['id'] !=''){
        echo json_encode(array('info'=>0,'msg'=>'角色已授权,无需再次授权'));die;
    }
    $xxx = mysqli_fetch_assoc($db2->query("SELECT * FROM cdk WHERE cdk = '$cdk' limit 1"));
    if($xxx['cdk'] ==''){
        echo json_encode(array('info'=>0,'msg'=>'无此授权卡'));die;
    }
    if($xxx['status'] != 0){
        echo json_encode(array('info'=>0,'msg'=>'此授权卡已被使用'));die;
    }
    if($db2->query("UPDATE cdk SET status = 1 , qid = '$quid' ,uid = '$uid', pass = '$pswd' WHERE cdk = '$cdk';")){
        echo json_encode(array('info'=>1,'msg'=>'角色授权成功'));die;
    }else{
        echo json_encode(array('info'=>0,'msg'=>'授权失败.请联系管理员'));die;
    }

}
break;


} 

?>