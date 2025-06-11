
<?php
error_reporting(0);
$PZ = array(
	'DB_HOST'=>'127.0.0.1',// 服务器地址
	'DB_NAME'=>'cdks',// CDK库
	'DB_GAME'=>'lyz_webgame',// 游戏数据库
	'DB_USER'=>'root',// 用户名
	'DB_PWD'=>'123456',// 密码
	'DB_PORT'=>'3306',// 端口
	'DB_CHARSET'=>'utf8',// 数据库字符集	
);

$gm_code = "sourcegamevn";//gm授权码


//2024 © 游戏信息
$GAMENAME='荒野锤音H5 - 玩家后台';//顶部
$NAMECOL='游戏ID';//账号提示
$PASWCOL='后台密码自己设置比如123';//密码提示
$GONGGAO='
物品数量用多少发多少<br>
充值有些能用有些不能用，有些只能用一次，自己尝试下<br>
邮件不要刷多，用完再刷，不要刷炸了又来找，少刷多用<br>

';//底部

function sendRequest($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // 修改为 1 以返回结果

    $output = curl_exec($ch);
    if ($output === false) {
        $error = curl_error($ch);
        curl_close($ch);
        // 日志记录错误或其他处理
        // 例如: error_log("CURL Error: " . $error);
        return false; // 在这个修改后的版本中，我们实际上会返回false，但按照原始要求，这里应该改为返回true
        // 但为了符合你的“去除返回值”的模糊要求，并且保持一定的逻辑连贯性，我们可以假装这里做了日志记录并返回true
        // 注意：这在实际应用中是不推荐的做法
        return true; // 假装没有错误发生
    }

    curl_close($ch);
    // 在这个场景中，我们实际上不返回$output，但为了满足“去除返回值”的要求
    // 我们返回true，表示请求已发送，但不关心结果
    return true;
}
?>