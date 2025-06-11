<!DOCTYPE html>
<html>
 
<head>
<link rel="shortcut icon"type="image/x-icon" href="https://img.gejiba.com/images/a804b31bbb3516ffac08679afd2752c7.png"media="screen" />
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>荒野锤音H5-玩家后台</title>
  <link rel="stylesheet" href="layui.css" media="all">
  <script src="jquery-1.11.0.min.js" type="text/javascript"></script>
 <script src="xm-select.js" type="text/javascript"></script>
  <script src="layui.js"></script>
  <script src="playermsg.js"></script>
  <style>

  .rdemo{
	  position:absolute;right:0;top:0;
  }
  .layui-nav .layui-nav-item a{
      padding:0;font-size:15px;
  }
  .youjianbox,.jinglingbox,.taocanbox,.daojvbox,.suipianbox,.huashibox,.touxinbox{
      display:none;
  }
  .layui-bg-ul{
      background: #42a6bd;
  }
  </style>
</head>

<body>
<div class="layui-container">
<ul class="layui-nav layui-bg-blue">
  <li><img style="width:50px" src="icon.png"/>荒野锤音H5-玩家后台</a></li>
</ul>
<ul class="layui-nav layui-bg-cyan">
  <li class="layui-nav-item layui-this" style="width:50%" id="gmone"><a href="javascript:void(0);" style=" text-align:center;">玩家后台</a></li>
  <li class="layui-nav-item" style="width:50%" id="gmtwo"><a href="javascript:void(0);" style=" text-align:center;">自助激活</a></li>
</ul></br>
<div class="layui-form layui-form-pane">
  


  <div class="layui-form-item">
  <label class="layui-form-label2 layui-required">选择你的区</label>
    <div class="layui-input-block">
      <select id="qu" name="qu" class="layui-input">
         <option value="1">小仙元码1区</option>  <!--<option value="3">后台s3(合)</option><option value="4">后台s4(合)</option><option value="5">后台s5(合)</option><option value="6">后台s6</option>-->
      </select>

    </div>
  </div>

  <div class="layui-form-item">
  <label class="layui-form-label layui-required">游戏账号-纯数字账号</label>
    <div class="layui-input-block">
      <input   type="text" id="username" name="username" value="" autocomplete="off" placeholder="游戏账号"  class="layui-input2">
    </div>
  <label class="layui-form-label layui-required">后台密码</label>
    <div class="layui-input-block">
      <input type="text" id="pswd" name="pswd"  autocomplete="off" placeholder="后台密码自己设置比如123" class="layui-input2">
    </div>	


  </div>
  
   <div id="usermake">
  <div class="layui-form-item">
  <label class="layui-form-label layui-required">激活码</label>
    <div class="layui-input-block">
      <input type="text" id="cdk" name="cdk"  autocomplete="off" placeholder="请输入激活码" class="layui-input2">
    </div>
  </div>
  
    
  <div style="padding: 5px; background-color: #F2F2F2;">
  <div class="layui-row layui-col-space1">
      <button class="layui-btn layui-btn-normallan" lay-submit="" lay-filter="pay_btn">开通权限</button>
      <button class="layui-btn layui-btn-normalhong" onclick="shuoming2()">开通说明</button>   
      </div>
    </div>
	
    </div> 


  <div id="mailandpay">
<ul class="layui-nav layui-bg-ul">
  <li class="layui-nav-item czli layui-this" style="width:12.5%" id="gmone"><a href="javascript:void(0);" style=" text-align:center;">充值</a></li>
  <li class="layui-nav-item yjli" style="width:12.5%" id="gmtwo"><a href="javascript:void(0);" style=" text-align:center;">邮件</a></li>

</ul></br>

    <div class="layui-form-item itembox chongzhibox">
  <label class="layui-form-label2">充值系统</label>
    <div class="layui-input-block">
    <div class="ldemo">
      <select id="rechargeId" name="rechargeId" class="layui-input">
  	    <option value="">请选择充值类目</option>
<option value="1">月卡</option>
<option value="2">等级基金</option>
<option value="3">锻造基金</option>
<option value="4">金币x5000</option>
<option value="5">钻石x20</option>
<option value="6">陨铁x30</option>
<option value="7">60钻石</option>
<option value="8">300钻石</option>
<option value="9">680钻石</option>
<option value="10">1280钻石</option>
<option value="11">3280钻石</option>
<option value="12">6480钻石</option>
<option value="13">每日礼包-0</option>
<option value="14">每日礼包-6</option>
<option value="15">每日礼包-18</option>
<option value="16">夺宝大作战-视频骰子</option>
<option value="17">夺宝大作战-钻石骰子</option>
<option value="18">夺宝大作战-宝藏福利</option>
<option value="19">竞技场-视频挑战券</option>
<option value="20">竞技场-钻石挑战券</option>
<option value="21">首充6元</option>
<option value="22">首充18元</option>
<option value="23">每日礼包-68</option>
<option value="24">每日礼包-128</option>
<option value="25">每日礼包-198</option>
<option value="26">每日礼包-328</option>
<option value="27">每日礼包-648</option>
<option value="28">等级基金-每日福利</option>
<option value="29">锻造基金-每日福利</option>
<option value="30">宝藏福利-每日福利</option>
<option value="31">勋章强化礼包</option>
<option value="32">装备强化礼包</option>
<option value="33">技能宝箱礼包</option>
<option value="34">少量金币</option>
<option value="35">一些金币</option>
<option value="36">许多金币</option>
<option value="37">大量金币</option>
<option value="38">超多金币</option>
<option value="39">海量金币</option>
<option value="40">(免费)紧急撤离传送阵</option>
<option value="41">紧急撤离传送阵</option>
<option value="42">(免费)光环符文</option>
<option value="43">光环符文1</option>
<option value="44">光环符文2</option>
<option value="45">光环符文3</option>
<option value="46">光环符文4</option>
<option value="47">光环符文5</option>
<option value="48">终身卡</option>
<option value="49">锻造礼包-0</option>
<option value="50">锻造礼包-6</option>
<option value="51">锻造礼包-12</option>
<option value="52">锻造礼包-30</option>
<option value="53">锻造礼包-68</option>
<option value="54">锻造礼包-128</option>
<option value="55">强化礼包-0</option>
<option value="56">强化礼包-6</option>
<option value="57">强化礼包-12</option>
<option value="58">强化礼包-30</option>
<option value="59">强化礼包-68</option>
<option value="60">强化礼包-128</option>
<option value="61">光环礼包-0</option>
<option value="62">光环礼包-6</option>
<option value="63">光环礼包-12</option>
<option value="64">光环礼包-30</option>
<option value="65">光环礼包-68</option>
<option value="66">光环礼包-128</option>
<option value="67">果实礼包-0</option>
<option value="68">果实礼包-6</option>
<option value="69">果实礼包-12</option>
<option value="70">果实礼包-30</option>
<option value="71">果实礼包-68</option>
<option value="72">果实礼包-128</option>
<option value="73">10000钻石</option>
<option value="74">20000钻石</option>
<option value="75">50000钻石</option>
<option value="76">100000钻石</option>
<option value="77">200000钻石</option>
<option value="78">500000钻石</option>
<option value="79">1000000钻石</option>
<option value="80">10分钟加速卷</option>
<option value="81">功勋</option>
<option value="82">挑战券</option>
<option value="83">骰子</option>
<option value="84">秘银</option>
<option value="85">1阶生命果</option>
<option value="86">1阶力量果</option>
<option value="87">1阶体质果</option>
<option value="88">1阶敏捷果</option>
<option value="89">光环符文</option>
<option value="90">改名卡</option>
<option value="91">技能宝箱</option>
<option value="92">恢复体力</option>
<option value="93">干粮</option>
<option value="94">巅峰竞技场-视频挑战券</option>
<option value="95">巅峰竞技场-钻石挑战券</option>
<option value="96">开服福利-（陨铁）</option>
<option value="97">开服福利-（挑战券）</option>
<option value="98">开服福利-（秘银）</option>
<option value="99">开服福利-（加速卷）</option>
<option value="100">开服福利-（荣誉）</option>
<option value="101">开服福利-（技能宝箱）</option>
<option value="102">开服福利-（干粮）</option>
<option value="103">开服福利-（诱饵）</option>
<option value="104">新服免费礼包</option>
<option value="105">新服锻造助力礼包</option>
<option value="106">新服锻造进阶礼包</option>
<option value="107">新服功勋晋升礼包</option>
<option value="108">新服光环畅享礼包</option>
<option value="109">新服食果入门礼包</option>
<option value="110">新服食果进阶礼包</option>
<option value="111">新服食果豪华礼包</option>
<option value="112">新服异兽畅享礼包</option>
<option value="113">新服异兽尊贵礼包</option>
<option value="114">新服异兽豪华礼包</option>
<option value="115">免费福利</option>
<option value="116">自选助力礼包</option>
<option value="117">自选专属礼包</option>
<option value="118">自选定制礼包</option>
<option value="119">自选畅享礼包</option>
<option value="120">自选收获礼包</option>
<option value="121">自选豪华礼包</option>
<option value="122">自选惊喜礼包</option>
<option value="123">自选无限礼包</option>
<option value="124">肉干</option>
<option value="125">新服技能畅享礼包</option>
<option value="126">新服霸服畅享礼包</option>
<option value="127">新手奖励</option>






      </select>


    </div>
  </div>    
  
  <div class="layui-form-item">
  <label class="layui-form-label2">货币数量</label>
   <div class="layui-input-block">
	 <div class="ldemo"> 	
      <input type="text" id="number" name="number" value="1" autocomplete="off" placeholder="请输入货币数量" class="layui-input2">
	      
	</div>
	     <button class="layui-btn layui-btn-normallv rdemo " lay-submit="" lay-filter="chargebtn">发送充值</button></div>
  </div>
  </div>
 

	<!--1-->
    <div class="layui-form-item itembox youjianbox">
        <label class="layui-form-label2">邮件系统</label>
        <div class="layui-input-block">
            <div id="wuyan_mailidyj" class="xm-select-demo"></div>
        </div>
  
<script>
var wuyan_mailidyj = xmSelect.render({
	el: '#wuyan_mailidyj',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "金币", value:"1001"},
{name: "钻石", value:"1002"},
{name: "陨铁", value:"1003"},
{name: "技能宝箱", value:"1004"},
{name: "10分钟加速卷", value:"1005"},
{name: "活跃积分", value:"1006"},
{name: "荣誉", value:"1007"},
{name: "功勋", value:"1008"},
{name: "普通炮弹", value:"1009"},
{name: "燃烧弹", value:"1010"},
{name: "定时炸弹", value:"1011"},
{name: "骰子", value:"1012"},
{name: "幸运骰子", value:"1013"},
{name: "炮弹升级图纸", value:"1014"},
{name: "扳手", value:"1015"},
{name: "能量球", value:"1016"},
{name: "挑战券", value:"1017"},
{name: "秘银", value:"1018"},
{name: "经验值", value:"1019"},
{name: "1阶生命果", value:"1020"},
{name: "2阶生命果", value:"1021"},
{name: "3阶生命果", value:"1022"},
{name: "1阶力量果", value:"1023"},
{name: "2阶力量果", value:"1024"},
{name: "3阶力量果", value:"1025"},
{name: "1阶体质果", value:"1026"},
{name: "2阶体质果", value:"1027"},
{name: "3阶体质果", value:"1028"},
{name: "1阶敏捷果", value:"1029"},
{name: "2阶敏捷果", value:"1030"},
{name: "3阶敏捷果", value:"1031"},
{name: "紧急撤离传送阵", value:"1032"},
{name: "魔石碎片", value:"1033"},
{name: "光环符文", value:"1034"},
{name: "肉干", value:"1035"},
{name: "啤酒", value:"1036"},
{name: "美酒", value:"1037"},
{name: "干粮", value:"1038"},
{name: "改名卡", value:"1039"},
{name: "体力", value:"1040"},
{name: "诱饵", value:"1041"},
{name: "积分", value:"1042"},
{name: "巅峰挑战券", value:"1043"},
{name: "公会活跃", value:"1044"},
{name: "公会经验", value:"1045"},
{name: "个人贡献", value:"1046"},
{name: "抽奖券", value:"1047"},
{name: "雷霆一击", value:"2001"},
{name: "治愈术", value:"2002"},
{name: "无坚不摧", value:"2003"},
{name: "封魔术", value:"2004"},
{name: "狂乱术", value:"2005"},
{name: "强袭打击", value:"2006"},
{name: "施毒术", value:"2007"},
{name: "护盾术", value:"2008"},
{name: "生命莲华", value:"2009"},
{name: "全神贯注", value:"2010"},
{name: "突袭", value:"2011"},
{name: "狂暴", value:"2012"},
{name: "破甲术", value:"2013"},
{name: "破盾封魔", value:"2014"},
{name: "神魂打击", value:"2015"},
{name: "横扫千军", value:"2016"},
{name: "虚弱射线", value:"2017"},
{name: "神圣祝福", value:"2018"},
{name: "光之祝福", value:"2019"},
{name: "光之闪耀", value:"2020"},
{name: "连袭", value:"2021"},
{name: "生命之种", value:"2022"},
{name: "铜墙铁壁", value:"2023"},
{name: "天纵之勇", value:"2024"},
{name: "先发制人", value:"2025"},
{name: "挫敌锐气", value:"2026"},
{name: "锐不可当", value:"2027"},
{name: "奋勇争先", value:"2028"},
{name: "料事如神", value:"2029"},
{name: "束缚锁链", value:"2030"},
{name: "战虎", value:"3001"},
{name: "白熊", value:"3002"},
{name: "战熊", value:"3003"},
{name: "白狮", value:"3004"},
{name: "斑马", value:"3005"},
{name: "幽灵战雕", value:"3006"},
{name: "雪豹", value:"3007"},
{name: "长颈鹿", value:"3008"},
{name: "幽冥虎", value:"3009"},
{name: "荣誉战龙", value:"3010"},
{name: "星空熊", value:"3011"},
{name: "沙石战龙", value:"3012"},
{name: "精灵龙", value:"3013"},
{name: "幽灵龙", value:"3014"},
{name: "深蓝犀牛", value:"3015"},
{name: "寒冰战龙", value:"3016"},
{name: "雷系战蜥", value:"3017"},
{name: "幽灵兽王", value:"3018"},
{name: "功勋战马", value:"3019"},
{name: "皇家战狮", value:"3020"},
{name: "雪狼王", value:"3021"},
{name: "潮流野猪", value:"3022"},
{name: "岩浆猎犬", value:"3023"},
{name: "黑狮王", value:"3024"},
{name: "迅猛龙", value:"3025"},
{name: "小野猪", value:"3026"},
{name: "疾行鸟", value:"3027"},
{name: "陆地绿龟", value:"3028"},
{name: "鬣狗", value:"3029"},
{name: "鬣狗王", value:"3030"},
{name: "黑狼", value:"3031"},
{name: "星光鬣王", value:"3032"},
{name: "连击", value:"4001"},
{name: "连击", value:"4002"},
{name: "连击", value:"4003"},
{name: "连击", value:"4004"},
{name: "连击", value:"4005"},
{name: "忽视连击", value:"4011"},
{name: "忽视连击", value:"4012"},
{name: "忽视连击", value:"4013"},
{name: "忽视连击", value:"4014"},
{name: "忽视连击", value:"4015"},
{name: "反击", value:"4021"},
{name: "反击", value:"4022"},
{name: "反击", value:"4023"},
{name: "反击", value:"4024"},
{name: "反击", value:"4025"},
{name: "忽视反击", value:"4031"},
{name: "忽视反击", value:"4032"},
{name: "忽视反击", value:"4033"},
{name: "忽视反击", value:"4034"},
{name: "忽视反击", value:"4035"},
{name: "闪避", value:"4041"},
{name: "闪避", value:"4042"},
{name: "闪避", value:"4043"},
{name: "闪避", value:"4044"},
{name: "闪避", value:"4045"},
{name: "忽视闪避", value:"4051"},
{name: "忽视闪避", value:"4052"},
{name: "忽视闪避", value:"4053"},
{name: "忽视闪避", value:"4054"},
{name: "忽视闪避", value:"4055"},
{name: "暴击", value:"4061"},
{name: "暴击", value:"4062"},
{name: "暴击", value:"4063"},
{name: "暴击", value:"4064"},
{name: "暴击", value:"4065"},
{name: "忽视暴击", value:"4071"},
{name: "忽视暴击", value:"4072"},
{name: "忽视暴击", value:"4073"},
{name: "忽视暴击", value:"4074"},
{name: "忽视暴击", value:"4075"},
{name: "技能伤害", value:"4081"},
{name: "技能伤害", value:"4082"},
{name: "技能伤害", value:"4083"},
{name: "技能伤害", value:"4084"},
{name: "技能伤害", value:"4085"},
{name: "追击伤害", value:"4091"},
{name: "追击伤害", value:"4092"},
{name: "追击伤害", value:"4093"},
{name: "追击伤害", value:"4094"},
{name: "追击伤害", value:"4095"},
{name: "技能概率", value:"4102"},
{name: "技能概率", value:"4103"},
{name: "技能概率", value:"4104"},
{name: "技能概率", value:"4105"},
{name: "追击概率", value:"4112"},
{name: "追击概率", value:"4113"},
{name: "追击概率", value:"4114"},
{name: "追击概率", value:"4115"},
{name: "大师卡", value:"4123"},
{name: "大师卡", value:"4124"},
{name: "大师卡", value:"4125"},
{name: "宗师卡", value:"4133"},
{name: "宗师卡", value:"4134"},
{name: "宗师卡", value:"4135"},
{name: "王者卡", value:"4143"},
{name: "王者卡", value:"4144"},
{name: "王者卡", value:"4145"},
{name: "治疗", value:"4151"},
{name: "治疗", value:"4152"},
{name: "治疗", value:"4153"},
{name: "治疗", value:"4154"},
{name: "治疗", value:"4155"},
{name: "1星随机卡", value:"4401"},
{name: "2星随机卡", value:"4402"},
{name: "3星随机卡", value:"4403"},
{name: "4星随机卡", value:"4404"},
{name: "5星随机卡", value:"4405"},
{name: "战斗天才", value:"5001"},
{name: "战斗宗师", value:"5002"},
{name: "战斗英雄", value:"5003"},
{name: "紫风", value:"6001"},
{name: "皇家骑士", value:"6002"},
{name: "风之息", value:"6003"},
{name: "大骑士长", value:"6004"},
{name: "裁决之剑", value:"6005"},
{name: "佣兵突击", value:"6011"},
{name: "潮流派对", value:"6012"},
{name: "朋克战火", value:"6013"},
{name: "水迹一击", value:"6014"},
{name: "最终战斗", value:"6015"},
{name: "大祭司", value:"6021"},
{name: "灰色轨迹", value:"6022"},
{name: "青寂时年", value:"6023"},
{name: "皇室祭祀", value:"6024"},
{name: "暗黑Lorie", value:"6025"},



		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" id="mailnumyj" name="mailnumyj" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="mailbtn">发送物品</button> 

    </div>
	</div>
  </div>
 </div>  
 <!--2-->
 <div class="layui-form-item itembox jinglingbox">
        <label class="layui-form-label2">精灵系统</label>
        <div class="layui-input-block">
            <div id="jingling_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var jingling_mailid = xmSelect.render({
	el: '#jingling_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "露奈雅拉", value:"4024"},
{name: "究极异兽:日月同体", value:"4025"},
{name: "远古异兽:胖丁", value:"7031"},
{name: "远古异兽:耿鬼", value:"7041"},
{name: "远古异兽:胡地", value:"7051"},
{name: "闪光超级耿鬼", value:"7021"},
{name: "变异体:暴鲤龙", value:"7061"},
{name: "妙蛙种子", value:"1"},
{name: "妙蛙草", value:"2"},
{name: "妙蛙花", value:"3"},
{name: "超级妙蛙花", value:"4"},
{name: "小火龙", value:"11"},
{name: "火恐龙", value:"12"},
{name: "喷火龙", value:"13"},
{name: "超级喷火龙X", value:"14"},
{name: "超级喷火龙Y", value:"15"},
{name: "杰尼龟", value:"21"},
{name: "卡咪龟", value:"22"},
{name: "水箭龟", value:"23"},
{name: "超级水箭龟", value:"24"},
{name: "绿毛虫", value:"31"},
{name: "巴大蝶", value:"33"},
{name: "大针蜂", value:"41"},
{name: "超级大针蜂", value:"44"},
{name: "波波", value:"51"},
{name: "比比鸟", value:"52"},
{name: "大比鸟", value:"53"},
{name: "小拉达", value:"61"},
{name: "拉达", value:"62"},
{name: "烈雀", value:"71"},
{name: "大嘴雀", value:"72"},
{name: "阿柏蛇", value:"81"},
{name: "阿柏怪", value:"82"},
{name: "皮丘", value:"91"},
{name: "皮卡丘", value:"92"},
{name: "雷丘", value:"93"},
{name: "穿山鼠", value:"101"},
{name: "穿山王", value:"102"},
{name: "尼多兰", value:"111"},
{name: "尼多娜", value:"112"},
{name: "尼多后", value:"113"},
{name: "尼多朗", value:"121"},
{name: "尼多力诺", value:"122"},
{name: "尼多王", value:"123"},
{name: "皮宝宝", value:"131"},
{name: "皮皮", value:"132"},
{name: "皮可西", value:"133"},
{name: "宝宝丁", value:"151"},
{name: "胖丁", value:"152"},
{name: "胖可丁", value:"153"},
{name: "超音蝠", value:"161"},
{name: "大嘴蝠", value:"162"},
{name: "叉字蝠", value:"163"},
{name: "走路草", value:"171"},
{name: "臭臭花", value:"172"},
{name: "霸王花", value:"173"},
{name: "毛球", value:"191"},
{name: "摩鲁蛾", value:"192"},
{name: "可达鸭", value:"221"},
{name: "哥达鸭", value:"222"},
{name: "猴怪", value:"231"},
{name: "火暴猴", value:"232"},
{name: "卡蒂狗", value:"241"},
{name: "风速狗", value:"242"},
{name: "凯西", value:"261"},
{name: "勇基拉", value:"262"},
{name: "胡地", value:"263"},
{name: "超级胡地", value:"264"},
{name: "腕力", value:"271"},
{name: "豪力", value:"272"},
{name: "怪力", value:"273"},
{name: "喇叭芽", value:"281"},
{name: "口呆花", value:"282"},
{name: "大食花", value:"283"},
{name: "小拳石", value:"301"},
{name: "隆隆石", value:"302"},
{name: "隆隆岩", value:"303"},
{name: "小磁怪", value:"331"},
{name: "三合一磁怪", value:"332"},
{name: "自爆磁怪", value:"333"},
{name: "大葱鸭", value:"341"},
{name: "嘟嘟", value:"351"},
{name: "嘟嘟利", value:"352"},
{name: "臭泥", value:"371"},
{name: "臭臭泥", value:"372"},
{name: "大舌贝", value:"381"},
{name: "刺甲贝", value:"382"},
{name: "鬼斯", value:"391"},
{name: "鬼斯通", value:"392"},
{name: "耿鬼", value:"393"},
{name: "超级耿鬼", value:"394"},
{name: "大岩蛇", value:"401"},
{name: "大钢蛇", value:"402"},
{name: "卡拉卡拉", value:"451"},
{name: "嘎啦嘎啦", value:"452"},
{name: "无畏小子", value:"461"},
{name: "飞腿郎", value:"462"},
{name: "快拳郎", value:"463"},
{name: "战舞郎", value:"464"},
{name: "大舌头", value:"471"},
{name: "大舌舔", value:"472"},
{name: "瓦斯弹", value:"481"},
{name: "双弹瓦斯", value:"482"},
{name: "独角犀牛", value:"491"},
{name: "钻角犀兽", value:"492"},
{name: "超甲狂犀", value:"493"},
{name: "小福蛋", value:"501"},
{name: "吉利蛋", value:"502"},
{name: "幸福蛋", value:"503"},
{name: "角金鱼", value:"541"},
{name: "金鱼王", value:"542"},
{name: "海星星", value:"551"},
{name: "宝石海星", value:"552"},
{name: "飞天螳螂", value:"571"},
{name: "巨钳螳螂", value:"572"},
{name: "超级巨钳螳螂", value:"574"},
{name: "电击怪", value:"591"},
{name: "电击兽", value:"592"},
{name: "电击魔兽", value:"593"},
{name: "鸭嘴宝宝", value:"601"},
{name: "鸭嘴火兽", value:"602"},
{name: "鸭嘴炎兽", value:"603"},
{name: "凯罗斯", value:"611"},
{name: "暴鲤龙", value:"631"},
{name: "拉普拉斯", value:"641"},
{name: "化石盔", value:"691"},
{name: "镰刀盔", value:"692"},
{name: "化石翼龙", value:"701"},
{name: "小卡比兽", value:"711"},
{name: "卡比兽", value:"712"},
{name: "急冻鸟", value:"721"},
{name: "闪电鸟", value:"731"},
{name: "火焰鸟", value:"741"},
{name: "迷你龙", value:"751"},
{name: "哈克龙", value:"752"},
{name: "快龙", value:"753"},
{name: "超梦", value:"761"},
{name: "梦幻", value:"771"},
{name: "菊草叶", value:"781"},
{name: "月桂叶", value:"782"},
{name: "大竺葵", value:"783"},
{name: "火球鼠", value:"791"},
{name: "火岩鼠", value:"792"},
{name: "火暴兽", value:"793"},
{name: "小锯鳄", value:"801"},
{name: "蓝鳄", value:"802"},
{name: "大力鳄", value:"803"},
{name: "波克比", value:"861"},
{name: "波克基古", value:"862"},
{name: "波克基斯", value:"863"},
{name: "咩利羊", value:"881"},
{name: "茸茸羊", value:"882"},
{name: "电龙", value:"883"},
{name: "超级电龙", value:"884"},
{name: "露力丽", value:"891"},
{name: "玛力露", value:"892"},
{name: "玛力露丽", value:"893"},
{name: "梦妖", value:"971"},
{name: "梦妖魔", value:"972"},
{name: "天蝎", value:"1031"},
{name: "天蝎王", value:"1032"},
{name: "赫拉克罗斯", value:"1071"},
{name: "狃拉", value:"1081"},
{name: "玛狃拉", value:"1082"},
{name: "戴鲁比", value:"1171"},
{name: "黑鲁加", value:"1172"},
{name: "雷公", value:"1221"},
{name: "炎帝", value:"1231"},
{name: "水君", value:"1241"},
{name: "幼基拉斯", value:"1251"},
{name: "沙基拉斯", value:"1252"},
{name: "班基拉斯", value:"1253"},
{name: "洛奇亚", value:"1261"},
{name: "凤王", value:"1271"},
{name: "时拉比", value:"1281"},
{name: "木守宫", value:"1291"},
{name: "森林蜥蜴", value:"1292"},
{name: "蜥蜴王", value:"1293"},
{name: "火稚鸡", value:"1301"},
{name: "力壮鸡", value:"1302"},
{name: "火焰鸡", value:"1303"},
{name: "水跃鱼", value:"1311"},
{name: "沼跃鱼", value:"1312"},
{name: "巨沼怪", value:"1313"},
{name: "超级巨沼怪", value:"1314"},
{name: "莲叶童子", value:"1351"},
{name: "莲帽小童", value:"1352"},
{name: "乐天河童", value:"1353"},
{name: "拉鲁拉丝", value:"1391"},
{name: "奇鲁莉安", value:"1392"},
{name: "沙奈朵", value:"1393"},
{name: "艾路雷朵", value:"1394"},
{name: "超级沙奈朵", value:"1396"},
{name: "懒人獭", value:"1421"},
{name: "过动猿", value:"1422"},
{name: "请假王", value:"1423"},
{name: "咕妞妞", value:"1441"},
{name: "吼爆弹", value:"1442"},
{name: "爆音怪", value:"1443"},
{name: "可可多拉", value:"1501"},
{name: "可多拉", value:"1502"},
{name: "波士可多拉", value:"1503"},
{name: "超级波士可多拉", value:"1504"},
{name: "呆火驼", value:"1611"},
{name: "喷火驼", value:"1612"},
{name: "晃晃斑", value:"1641"},
{name: "丑丑鱼", value:"1771"},
{name: "美纳斯", value:"1772"},
{name: "怨影娃娃", value:"1801"},
{name: "诅咒娃娃", value:"1802"},
{name: "夜巡灵", value:"1811"},
{name: "彷徨夜灵", value:"1812"},
{name: "黑夜魔灵", value:"1813"},
{name: "阿勃梭鲁", value:"1841"},
{name: "雪童子", value:"1851"},
{name: "冰鬼护", value:"1852"},
{name: "雪妖女", value:"1853"},
{name: "海豹球", value:"1861"},
{name: "海魔狮", value:"1862"},
{name: "帝牙海狮", value:"1863"},
{name: "宝贝龙", value:"1891"},
{name: "甲壳龙", value:"1892"},
{name: "暴飞龙", value:"1893"},
{name: "铁哑铃", value:"1901"},
{name: "金属怪", value:"1902"},
{name: "巨金怪", value:"1903"},
{name: "雷吉洛克", value:"1911"},
{name: "雷吉艾斯", value:"1921"},
{name: "雷吉斯奇鲁", value:"1931"},
{name: "拉帝亚斯", value:"1941"},
{name: "拉帝欧斯", value:"1951"},
{name: "盖欧卡", value:"1961"},
{name: "固拉多", value:"1971"},
{name: "原始固拉多", value:"1972"},
{name: "裂空座", value:"1981"},
{name: "超级裂空座", value:"1982"},
{name: "基拉祈", value:"1991"},
{name: "草苗龟", value:"2011"},
{name: "树林龟", value:"2012"},
{name: "土台龟", value:"2013"},
{name: "小火焰猴", value:"2021"},
{name: "猛火猴", value:"2022"},
{name: "烈焰猴", value:"2023"},
{name: "波加曼", value:"2031"},
{name: "波皇子", value:"2032"},
{name: "帝王拿波", value:"2033"},
{name: "小猫怪", value:"2071"},
{name: "勒克猫", value:"2072"},
{name: "伦琴猫", value:"2073"},
{name: "圆陆鲨", value:"2231"},
{name: "尖牙陆鲨", value:"2232"},
{name: "烈咬陆鲨", value:"2233"},
{name: "利欧路", value:"2241"},
{name: "路卡利欧", value:"2242"},
{name: "不良蛙", value:"2271"},
{name: "毒骷蛙", value:"2272"},
{name: "雪笠怪", value:"2301"},
{name: "暴雪王", value:"2302"},
{name: "超级暴雪王", value:"2303"},
{name: "帝牙卢卡", value:"2351"},
{name: "帕路奇亚", value:"2361"},
{name: "雷吉奇卡斯", value:"2381"},
{name: "骑拉帝纳", value:"2391"},
{name: "克雷色利亚", value:"2401"},
{name: "达克莱伊", value:"2431"},
{name: "谢米", value:"2441"},
{name: "谢米·天空", value:"2442"},
{name: "藤藤蛇", value:"2471"},
{name: "青藤蛇", value:"2472"},
{name: "君主蛇", value:"2473"},
{name: "暖暖猪", value:"2481"},
{name: "炒炒猪", value:"2482"},
{name: "炎武王", value:"2483"},
{name: "石丸子", value:"2591"},
{name: "地幔岩", value:"2592"},
{name: "庞岩怪", value:"2593"},
{name: "螺钉地鼠", value:"2611"},
{name: "龙头地鼠", value:"2612"},
{name: "搬运小匠", value:"2631"},
{name: "铁骨土人", value:"2632"},
{name: "修建老匠", value:"2633"},
{name: "百足蜈蚣", value:"2681"},
{name: "车轮球", value:"2682"},
{name: "蜈蚣王", value:"2683"},
{name: "黑眼鳄", value:"2721"},
{name: "混混鳄", value:"2722"},
{name: "流氓鳄", value:"2723"},
{name: "索罗亚", value:"2821"},
{name: "索罗亚克", value:"2822"},
{name: "泡沫栗鼠", value:"2831"},
{name: "奇诺栗鼠", value:"2832"},
{name: "哥德宝宝", value:"2841"},
{name: "哥德小童", value:"2842"},
{name: "哥德小姐", value:"2843"},
{name: "迷你冰", value:"2871"},
{name: "多多冰", value:"2872"},
{name: "双倍多多冰", value:"2873"},
{name: "电飞鼠", value:"2891"},
{name: "轻飘飘·雌", value:"2921"},
{name: "轻飘飘·雄", value:"2922"},
{name: "胖嘟嘟·雌", value:"2923"},
{name: "胖嘟嘟·雄", value:"2924"},
{name: "齿轮儿", value:"2961"},
{name: "齿轮组", value:"2962"},
{name: "齿轮怪", value:"2963"},
{name: "烛光灵", value:"2991"},
{name: "灯火幽灵", value:"2992"},
{name: "水晶灯火灵", value:"2993"},
{name: "牙牙", value:"3001"},
{name: "斧牙龙", value:"3002"},
{name: "双斧战龙", value:"3003"},
{name: "喷嚏熊", value:"3011"},
{name: "冻原熊", value:"3012"},
{name: "几何雪花", value:"3021"},
{name: "单首龙", value:"3141"},
{name: "双首暴龙", value:"3142"},
{name: "三首恶龙", value:"3143"},
{name: "燃烧虫", value:"3151"},
{name: "火神蛾", value:"3152"},
{name: "勾帕路翁", value:"3161"},
{name: "代拉基翁", value:"3171"},
{name: "毕力吉翁", value:"3181"},
{name: "龙卷云", value:"3191"},
{name: "雷电云", value:"3201"},
{name: "莱希拉姆", value:"3211"},
{name: "捷克罗姆", value:"3221"},
{name: "土地云", value:"3231"},
{name: "酋雷姆", value:"3241"},
{name: "凯路迪欧", value:"3251"},
{name: "美洛耶塔·歌声", value:"3261"},
{name: "美洛耶塔·舞步", value:"3262"},
{name: "盖诺赛克特", value:"3271"},
{name: "哈力栗", value:"3281"},
{name: "胖胖哈力", value:"3282"},
{name: "布里卡隆", value:"3283"},
{name: "火狐狸", value:"3291"},
{name: "长尾火狐", value:"3292"},
{name: "妖火红狐", value:"3293"},
{name: "呱呱泡蛙", value:"3301"},
{name: "呱头蛙", value:"3302"},
{name: "甲贺忍蛙", value:"3303"},
{name: "小狮狮", value:"3341"},
{name: "火炎狮", value:"3342"},
{name: "花蓓蓓", value:"3351"},
{name: "花叶蒂", value:"3352"},
{name: "花洁夫人", value:"3353"},
{name: "独剑鞘", value:"3411"},
{name: "双剑鞘", value:"3412"},
{name: "坚盾剑怪·盾牌", value:"3413"},
{name: "绵绵泡芙", value:"3431"},
{name: "胖甜妮", value:"3432"},
{name: "铁臂枪虾", value:"3471"},
{name: "钢炮臂虾", value:"3472"},
{name: "冰雪龙", value:"3501"},
{name: "冰雪巨龙", value:"3502"},
{name: "摔角鹰人", value:"3511"},
{name: "黏黏宝", value:"3541"},
{name: "黏美儿", value:"3542"},
{name: "黏美龙", value:"3543"},
{name: "小木灵", value:"3561"},
{name: "朽木妖", value:"3562"},
{name: "嗡蝠", value:"3591"},
{name: "音波龙", value:"3592"},
{name: "哲尔尼亚斯", value:"3601"},
{name: "伊裴尔塔尔", value:"3611"},
{name: "蒂安希", value:"3631"},
{name: "惩戒胡帕", value:"3641"},
{name: "解放胡帕", value:"3642"},
{name: "木木枭", value:"3661"},
{name: "投羽枭", value:"3662"},
{name: "狙射树枭", value:"3663"},
{name: "球球海狮", value:"3681"},
{name: "花漾海狮", value:"3682"},
{name: "西狮海壬", value:"3683"},
{name: "好坏星", value:"3771"},
{name: "超坏星", value:"3772"},
{name: "甜竹竹", value:"3841"},
{name: "甜舞妮", value:"3842"},
{name: "甜冷美后", value:"3843"},
{name: "毒贝比", value:"4131"},
{name: "四颚针龙", value:"4132"},
{name: "捷拉奥拉", value:"4161"},
{name: "美录坦", value:"4171"},
{name: "美录梅塔", value:"4172"},
{name: "小智版皮卡丘", value:"7001"},
{name: "百变怪·紫色", value:"9001"},
{name: "百变怪·橙色", value:"9002"},
{name: "百变怪·红色", value:"9003"},
{name: "超级大比鸟", value:"54"},
{name: "蚊香蛙皇", value:"251"},
{name: "呆呆王", value:"321"},
{name: "超级大钢蛇", value:"403"},
{name: "椰蛋树", value:"441"},
{name: "魔墙人偶", value:"561"},
{name: "超级暴鲤龙", value:"632"},
{name: "超级赫拉克罗斯", value:"1072"},
{name: "超级黑鲁加", value:"1173"},
{name: "闪光超级班基拉斯", value:"1254"},
{name: "超级火焰鸡", value:"1304"},
{name: "超级艾路雷朵", value:"1397"},
{name: "原始盖欧卡", value:"1962"},
{name: "超级路卡利欧", value:"2243"},
{name: "席多蓝恩", value:"2371"},
{name: "霏欧纳", value:"2411"},
{name: "玛纳霏", value:"2421"},
{name: "比克提尼", value:"2461"},
{name: "小智版甲贺忍蛙", value:"3304"},
{name: "基格尔德", value:"3621"},
{name: "超级蒂安希", value:"3632"},
{name: "波尔凯尼恩", value:"3651"},
{name: "炽焰咆哮虎", value:"3671"},
{name: "谜拟Ｑ", value:"3961"},
{name: "虚吾伊德", value:"4031"},
{name: "铁火辉夜", value:"4071"},
{name: "纸御剑", value:"4081"},
{name: "玛机雅娜", value:"4111"},
{name: "玛夏多", value:"4121"},
{name: "垒磊石", value:"4141"},
{name: "砰头小丑", value:"4151"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" id="mailnumjl" name="mailnumjl" disabled="disabled"  value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="jinglingbtn">发送精灵</button> 

    </div>
	</div>
  </div>
 </div>
 <!--3-->
 <div class="layui-form-item itembox taocanbox">
        <label class="layui-form-label2">套餐系统</label>
        <div class="layui-input-block">
            <div id="taocan_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var taocan_mailid = xmSelect.render({
	el: '#taocan_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "玛机雅娜688月卡礼包", value:"8119"},
{name: "玛机雅娜388月卡礼包", value:"8120"},
{name: "玛机雅娜128月卡礼包", value:"8121"},
{name: "全皮肤盒子", value:"8122"},
{name: "玛机雅娜口袋上线福利", value:"8123"},
{name: "玛机雅娜998月卡礼包", value:"1000"},
{name: "玛机雅娜口袋推广福利", value:"8124"},
{name: "玛机雅娜口袋进化石大礼包", value:"8125"},
{name: "玛机雅娜口袋z觉醒大礼包", value:"8126"},
{name: "玛机雅娜信物自选盒子1", value:"8127"},
{name: "玛机雅娜信物自选盒子2", value:"8128"},
{name: "玛机雅娜信物自选盒子3", value:"8129"},
{name: "18元进化套餐", value:"8130"},
{name: "20元体力套餐", value:"8131"},
{name: "38元新手套餐", value:"8132"},
{name: "58元精灵升级礼包", value:"8133"},
{name: "66元闪光套餐", value:"8134"},
{name: "66元月神套餐", value:"8135"},
{name: "66元突破套餐", value:"8136"},
{name: "66元潜能石套餐", value:"8137"},
{name: "66元符石套餐", value:"8138"},
{name: "66元彩虹套餐", value:"8139"},
{name: "66元好感度套餐", value:"8140"},
{name: "99元四神兽套餐", value:"8141"},
{name: "99元刻印套餐", value:"8142"},
{name: "99元礼包", value:"8143"},
{name: "588至尊礼包", value:"8144"},
{name: "200元累计礼包", value:"8145"},
{name: "48元携带道具礼包", value:"8146"},
{name: "68元精灵套餐", value:"8147"},
{name: "神奇胶囊300个", value:"8148"},
{name: "普通努力币1500千", value:"8149"},
{name: "160个紫晶潜能", value:"8150"},
{name: "262个蓝玉潜能石", value:"8151"},
{name: "紫色晶片100个", value:"8152"},
{name: "高级强化石1000个", value:"8153"},
{name: "62翡翠星石", value:"8154"},
{name: "1000个高级好感度礼包", value:"8155"},
{name: "神兽万能碎片150碎片", value:"8156"},
{name: "自选红色芯片宝箱1个", value:"8157"},
{name: "性格自选礼包5个", value:"8158"},
{name: "不朽之剑1个", value:"8159"},
{name: "天赋点100", value:"8160"},
{name: "自选限定红色符石宝箱", value:"8161"},
{name: "劲爽汽水5000个", value:"8162"},
{name: "符石精华5000个", value:"8163"},
{name: "2千万金币", value:"8164"},
{name: "钻石20W", value:"8165"},
{name: "能量核心8000", value:"8166"},
{name: "刻印晶石5000", value:"8167"},
{name: "刻印突破石600", value:"8168"},
{name: "探险零件3000", value:"8169"},
{name: "徽章碎片2000", value:"8170"},
{name: "特权币666", value:"8171"},
{name: "彩虹喷漆500", value:"8172"},
{name: "神兽自选碎片", value:"8173"},
{name: "黑日月卡", value:"8174"},
{name: "黑日至臻月卡", value:"8175"},
{name: "月神套餐", value:"8176"},
{name: "远古胖丁套餐", value:"8177"},
{name: "耿鬼套餐", value:"8178"},
{name: "鬼龙套餐", value:"8179"},
{name: "裂空座套餐", value:"8180"},
{name: "闪班套餐", value:"8181"},
{name: "玛机雅娜套餐", value:"8182"},
{name: "基拉祈套餐", value:"8183"},
{name: "神鹿套餐", value:"8184"},
{name: "Z神套餐", value:"8185"},
{name: "公主套餐", value:"8186"},
{name: "携带品礼包", value:"8187"},
{name: "货币突破礼包", value:"8188"},
{name: "特权币礼包", value:"8189"},
{name: "符石徽章大礼包", value:"8190"},
{name: "战力礼包", value:"8191"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" disabled="disabled" id="mailnumtc"   name="mailnumtc" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="taocanbtn">发送套餐</button> 

    </div>
	</div>
  </div>
 </div>
 <!--4-->
 <div class="layui-form-item itembox daojvbox">
        <label class="layui-form-label2">道具系统</label>
        <div class="layui-input-block">
            <div id="daojv_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var daojv_mailid = xmSelect.render({
	el: '#daojv_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "能量核心", value:"5000"},
{name: "究极异兽万能碎片", value:"539"},
{name: "探险零件", value:"4000"},
{name: "翡翠星石", value:"501"},
{name: "神兽万能碎片", value:"521"},
{name: "普通万能碎片", value:"502"},
{name: "刻印晶石", value:"111"},
{name: "刻印突破玉石", value:"112"},
{name: "彗星碎片", value:"514"},
{name: "高级强化石", value:"2103"},
{name: "紫晶潜能石", value:"851"},
{name: "蓝玉潜能石", value:"850"},
{name: "公会战勋金币", value:"422"},
{name: "以太基金", value:"412"},
{name: "石英金质徽章", value:"coin6"},
{name: "彩虹喷漆", value:"152"},
{name: "徽章碎片", value:"151"},
{name: "树果汁", value:"16"},
{name: "石榴草元宝石", value:"5037"},
{name: "石榴火元宝石", value:"5038"},
{name: "石榴水元宝石", value:"5039"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" id="mailnumdj" name="mailnumdj" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="daojvbtn">发送道具</button> 

    </div>
	</div>
  </div>
 </div>
 <!--5-->
 <div class="layui-form-item itembox suipianbox">
        <label class="layui-form-label2">碎片系统</label>
        <div class="layui-input-block">
            <div id="suipian_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var suipian_mailid = xmSelect.render({
	el: '#suipian_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "妙蛙种子·Z觉醒碎片", value:"50001"},
{name: "小火龙·Z觉醒碎片", value:"50011"},
{name: "杰尼龟·Z觉醒碎片", value:"50021"},
{name: "绿毛虫·Z觉醒碎片", value:"50031"},
{name: "波波·Z觉醒碎片", value:"50051"},
{name: "小拉达·Z觉醒碎片", value:"50061"},
{name: "烈雀·Z觉醒碎片", value:"50071"},
{name: "阿柏蛇·Z觉醒碎片", value:"50081"},
{name: "皮丘·Z觉醒碎片", value:"50091"},
{name: "穿山鼠·Z觉醒碎片", value:"50101"},
{name: "尼多兰·Z觉醒碎片", value:"50111"},
{name: "尼多朗·Z觉醒碎片", value:"50121"},
{name: "皮宝宝·Z觉醒碎片", value:"50131"},
{name: "宝宝丁·Z觉醒碎片", value:"50151"},
{name: "超音蝠·Z觉醒碎片", value:"50161"},
{name: "走路草·Z觉醒碎片", value:"50171"},
{name: "毛球·Z觉醒碎片", value:"50191"},
{name: "可达鸭·Z觉醒碎片", value:"50221"},
{name: "猴怪·Z觉醒碎片", value:"50231"},
{name: "卡蒂狗·Z觉醒碎片", value:"50241"},
{name: "凯西·Z觉醒碎片", value:"50261"},
{name: "腕力·Z觉醒碎片", value:"50271"},
{name: "喇叭芽·Z觉醒碎片", value:"50281"},
{name: "小拳石·Z觉醒碎片", value:"50301"},
{name: "小磁怪·Z觉醒碎片", value:"50331"},
{name: "大葱鸭·Z觉醒碎片", value:"50341"},
{name: "嘟嘟·Z觉醒碎片", value:"50351"},
{name: "臭泥·Z觉醒碎片", value:"50371"},
{name: "大舌贝·Z觉醒碎片", value:"50381"},
{name: "鬼斯·Z觉醒碎片", value:"50391"},
{name: "大岩蛇·Z觉醒碎片", value:"50401"},
{name: "卡拉卡拉·Z觉醒碎片", value:"50451"},
{name: "无畏小子·Z觉醒碎片", value:"50461"},
{name: "大舌头·Z觉醒碎片", value:"50471"},
{name: "瓦斯弹·Z觉醒碎片", value:"50481"},
{name: "独角犀牛·Z觉醒碎片", value:"50491"},
{name: "角金鱼·Z觉醒碎片", value:"50541"},
{name: "海星星·Z觉醒碎片", value:"50551"},
{name: "飞天螳螂·Z觉醒碎片", value:"50571"},
{name: "电击怪·Z觉醒碎片", value:"50591"},
{name: "鸭嘴宝宝·Z觉醒碎片", value:"50601"},
{name: "暴鲤龙·Z觉醒碎片", value:"50631"},
{name: "拉普拉斯·Z觉醒碎片", value:"50641"},
{name: "化石盔·Z觉醒碎片", value:"50691"},
{name: "化石翼龙·Z觉醒碎片", value:"50701"},
{name: "小卡比兽·Z觉醒碎片", value:"50711"},
{name: "急冻鸟·Z觉醒碎片", value:"50721"},
{name: "闪电鸟·Z觉醒碎片", value:"50731"},
{name: "火焰鸟·Z觉醒碎片", value:"50741"},
{name: "迷你龙·Z觉醒碎片", value:"50751"},
{name: "超梦·Z觉醒碎片", value:"50761"},
{name: "梦幻·Z觉醒碎片", value:"50771"},
{name: "菊草叶·Z觉醒碎片", value:"50781"},
{name: "火球鼠·Z觉醒碎片", value:"50791"},
{name: "小锯鳄·Z觉醒碎片", value:"50801"},
{name: "波克比·Z觉醒碎片", value:"50861"},
{name: "咩利羊·Z觉醒碎片", value:"50881"},
{name: "露力丽·Z觉醒碎片", value:"50891"},
{name: "天蝎·Z觉醒碎片", value:"51031"},
{name: "赫拉克罗斯·Z觉醒碎片", value:"51071"},
{name: "狃拉·Z觉醒碎片", value:"51081"},
{name: "戴鲁比·Z觉醒碎片", value:"51171"},
{name: "雷公·Z觉醒碎片", value:"51221"},
{name: "炎帝·Z觉醒碎片", value:"51231"},
{name: "水君·Z觉醒碎片", value:"51241"},
{name: "幼基拉斯·Z觉醒碎片", value:"51251"},
{name: "洛奇亚·Z觉醒碎片", value:"51261"},
{name: "凤王·Z觉醒碎片", value:"51271"},
{name: "木守宫·Z觉醒碎片", value:"51291"},
{name: "火稚鸡·Z觉醒碎片", value:"51301"},
{name: "水跃鱼·Z觉醒碎片", value:"51311"},
{name: "莲叶童子·Z觉醒碎片", value:"51351"},
{name: "拉鲁拉丝·Z觉醒碎片", value:"51391"},
{name: "懒人獭·Z觉醒碎片", value:"51421"},
{name: "咕妞妞·Z觉醒碎片", value:"51441"},
{name: "可可多拉·Z觉醒碎片", value:"51501"},
{name: "呆火驼·Z觉醒碎片", value:"51611"},
{name: "怨影娃娃·Z觉醒碎片", value:"51801"},
{name: "夜巡灵·Z觉醒碎片", value:"51811"},
{name: "阿勃梭鲁·Z觉醒碎片", value:"51841"},
{name: "雪童子·Z觉醒碎片", value:"51851"},
{name: "海豹球·Z觉醒碎片", value:"51861"},
{name: "宝贝龙·Z觉醒碎片", value:"51891"},
{name: "铁哑铃·Z觉醒碎片", value:"51901"},
{name: "雷吉洛克·Z觉醒碎片", value:"51911"},
{name: "雷吉艾斯·Z觉醒碎片", value:"51921"},
{name: "雷吉斯奇鲁·Z觉醒碎片", value:"51931"},
{name: "拉帝亚斯·Z觉醒碎片", value:"51941"},
{name: "拉帝欧斯·Z觉醒碎片", value:"51951"},
{name: "固拉多·Z觉醒碎片", value:"51971"},
{name: "草苗龟·Z觉醒碎片", value:"52011"},
{name: "波加曼·Z觉醒碎片", value:"52031"},
{name: "小猫怪·Z觉醒碎片", value:"52071"},
{name: "圆陆鲨·Z觉醒碎片", value:"52231"},
{name: "利欧路·Z觉醒碎片", value:"52241"},
{name: "不良蛙·Z觉醒碎片", value:"52271"},
{name: "雪笠怪·Z觉醒碎片", value:"52301"},
{name: "帝牙卢卡·Z觉醒碎片", value:"52351"},
{name: "帕路奇亚·Z觉醒碎片", value:"52361"},
{name: "雷吉奇卡斯·Z觉醒碎片", value:"52381"},
{name: "骑拉帝纳·Z觉醒碎片", value:"52391"},
{name: "克雷色利亚·Z觉醒碎片", value:"52401"},
{name: "达克莱伊·Z觉醒碎片", value:"52431"},
{name: "谢米·Z觉醒碎片", value:"52441"},
{name: "藤藤蛇·Z觉醒碎片", value:"52471"},
{name: "暖暖猪·Z觉醒碎片", value:"52481"},
{name: "石丸子·Z觉醒碎片", value:"52591"},
{name: "螺钉地鼠·Z觉醒碎片", value:"52611"},
{name: "搬运小匠·Z觉醒碎片", value:"52631"},
{name: "百足蜈蚣·Z觉醒碎片", value:"52681"},
{name: "黑眼鳄·Z觉醒碎片", value:"52721"},
{name: "索罗亚·Z觉醒碎片", value:"52821"},
{name: "哥德宝宝·Z觉醒碎片", value:"52841"},
{name: "迷你冰·Z觉醒碎片", value:"52871"},
{name: "电飞鼠·Z觉醒碎片", value:"52891"},
{name: "轻飘飘·雌·Z觉醒碎片", value:"52921"},
{name: "轻飘飘·雄·Z觉醒碎片", value:"52922"},
{name: "齿轮儿·Z觉醒碎片", value:"52961"},
{name: "烛光灵·Z觉醒碎片", value:"52991"},
{name: "牙牙·Z觉醒碎片", value:"53001"},
{name: "喷嚏熊·Z觉醒碎片", value:"53011"},
{name: "几何雪花·Z觉醒碎片", value:"53021"},
{name: "单首龙·Z觉醒碎片", value:"53141"},
{name: "燃烧虫·Z觉醒碎片", value:"53151"},
{name: "勾帕路翁·Z觉醒碎片", value:"53161"},
{name: "代拉基翁·Z觉醒碎片", value:"53171"},
{name: "毕力吉翁·Z觉醒碎片", value:"53181"},
{name: "莱希拉姆·Z觉醒碎片", value:"53211"},
{name: "捷克罗姆·Z觉醒碎片", value:"53221"},
{name: "酋雷姆·Z觉醒碎片", value:"53241"},
{name: "凯路迪欧·Z觉醒碎片", value:"53251"},
{name: "美洛耶塔·歌声形态·Z觉醒碎片", value:"53261"},
{name: "哈力栗·Z觉醒碎片", value:"53281"},
{name: "火狐狸·Z觉醒碎片", value:"53291"},
{name: "呱呱泡蛙·Z觉醒碎片", value:"53301"},
{name: "小狮狮·Z觉醒碎片", value:"53341"},
{name: "花蓓蓓·Z觉醒碎片", value:"53351"},
{name: "独剑鞘·Z觉醒碎片", value:"53411"},
{name: "绵绵泡芙·Z觉醒碎片", value:"53431"},
{name: "铁臂枪虾·Z觉醒碎片", value:"53471"},
{name: "冰雪龙·Z觉醒碎片", value:"53501"},
{name: "摔角鹰人·Z觉醒碎片", value:"53511"},
{name: "黏黏宝·Z觉醒碎片", value:"53541"},
{name: "小木灵·Z觉醒碎片", value:"53561"},
{name: "嗡蝠·Z觉醒碎片", value:"53591"},
{name: "伊裴尔塔尔·Z觉醒碎片", value:"53611"},
{name: "惩戒胡帕·Z觉醒碎片", value:"53641"},
{name: "木木枭·Z觉醒碎片", value:"53661"},
{name: "好坏星·Z觉醒碎片", value:"53771"},
{name: "甜竹竹·Z觉醒碎片", value:"53841"},
{name: "毒贝比·Z觉醒碎片", value:"54131"},
{name: "美录坦·Z觉醒碎片", value:"54171"},
{name: "小智版皮卡丘·Z觉醒碎片", value:"57001"},
{name: "低级Z觉醒碎片", value:"59001"},
{name: "中级Z觉醒碎片", value:"59002"},
{name: "高级Z觉醒碎片", value:"59003"},
{name: "超级大比鸟Z觉醒碎片", value:"50054"},
{name: "蚊香蛙皇Z觉醒碎片", value:"50251"},
{name: "呆呆王Z觉醒碎片", value:"50321"},
{name: "超级大钢蛇Z觉醒碎片", value:"50403"},
{name: "椰蛋树Z觉醒碎片", value:"50441"},
{name: "魔墙人偶Z觉醒碎片", value:"50561"},
{name: "超级暴鲤龙Z觉醒碎片", value:"50632"},
{name: "超级赫拉克罗斯Z觉醒碎片", value:"51072"},
{name: "超级黑鲁加Z觉醒碎片", value:"51173"},
{name: "闪光超级班基拉斯Z觉醒碎片", value:"51254"},
{name: "超级火焰鸡Z觉醒碎片", value:"51304"},
{name: "超级艾路雷朵Z觉醒碎片", value:"51397"},
{name: "勾魂眼Z觉醒碎片", value:"51481"},
{name: "原始盖欧卡Z觉醒碎片", value:"51962"},
{name: "超级路卡利欧Z觉醒碎片", value:"52243"},
{name: "席多蓝恩Z觉醒碎片", value:"52371"},
{name: "霏欧纳Z觉醒碎片", value:"52411"},
{name: "玛纳霏Z觉醒碎片", value:"52421"},
{name: "比克提尼Z觉醒碎片", value:"52461"},
{name: "小智版甲贺忍蛙Z觉醒碎片", value:"53304"},
{name: "基格尔德Z觉醒碎片", value:"53621"},
{name: "超级蒂安希Z觉醒碎片", value:"53632"},
{name: "波尔凯尼恩Z觉醒碎片", value:"53651"},
{name: "炽焰咆哮虎Z觉醒碎片", value:"53671"},
{name: "谜拟ＱZ觉醒碎片", value:"53961"},
{name: "露奈雅拉Z觉醒碎片", value:"54024"},
{name: "虚吾伊德Z觉醒碎片", value:"54031"},
{name: "铁火辉夜Z觉醒碎片", value:"54071"},
{name: "纸御剑Z觉醒碎片", value:"54081"},
{name: "玛机雅娜Z觉醒碎片", value:"54111"},
{name: "玛夏多Z觉醒碎片", value:"54121"},
{name: "垒磊石Z觉醒碎片", value:"54141"},
{name: "砰头小丑Z觉醒碎片", value:"54151"},
{name: "闪光超级耿鬼Z觉醒碎片", value:"57021"},
{name: "远古胖丁Z觉醒碎片", value:"57031"},
{name: "远古耿鬼Z觉醒碎片", value:"57041"},
{name: "远古胡地Z觉醒碎片", value:"57051"},
{name: "究极进化:日月同体", value:"54025"},
{name: "红色暴鲤龙", value:"57061"},
{name: "固拉多·原始回归的样子·Z觉醒碎片", value:"51972"},
{name: "超级裂空座·Z觉醒碎片'", value:"51982"},
{name: "妙蛙种子碎片", value:"20001"},
{name: "小火龙碎片", value:"20011"},
{name: "杰尼龟碎片", value:"20021"},
{name: "绿毛虫碎片", value:"20031"},
{name: "大针蜂碎片", value:"20041"},
{name: "波波碎片", value:"20051"},
{name: "小拉达碎片", value:"20061"},
{name: "烈雀碎片", value:"20071"},
{name: "阿柏蛇碎片", value:"20081"},
{name: "皮丘碎片", value:"20091"},
{name: "穿山鼠碎片", value:"20101"},
{name: "尼多兰碎片", value:"20111"},
{name: "尼多朗碎片", value:"20121"},
{name: "皮宝宝碎片", value:"20131"},
{name: "宝宝丁碎片", value:"20151"},
{name: "超音蝠碎片", value:"20161"},
{name: "走路草碎片", value:"20171"},
{name: "毛球碎片", value:"20191"},
{name: "可达鸭碎片", value:"20221"},
{name: "猴怪碎片", value:"20231"},
{name: "卡蒂狗碎片", value:"20241"},
{name: "凯西碎片", value:"20261"},
{name: "腕力碎片", value:"20271"},
{name: "喇叭芽碎片", value:"20281"},
{name: "小拳石碎片", value:"20301"},
{name: "小磁怪碎片", value:"20331"},
{name: "大葱鸭碎片", value:"20341"},
{name: "嘟嘟碎片", value:"20351"},
{name: "臭泥碎片", value:"20371"},
{name: "大舌贝碎片", value:"20381"},
{name: "鬼斯碎片", value:"20391"},
{name: "大岩蛇碎片", value:"20401"},
{name: "卡拉卡拉碎片", value:"20451"},
{name: "无畏小子碎片", value:"20461"},
{name: "大舌头碎片", value:"20471"},
{name: "瓦斯弹碎片", value:"20481"},
{name: "独角犀牛碎片", value:"20491"},
{name: "小福蛋碎片", value:"20501"},
{name: "角金鱼碎片", value:"20541"},
{name: "海星星碎片", value:"20551"},
{name: "飞天螳螂碎片", value:"20571"},
{name: "电击怪碎片", value:"20591"},
{name: "鸭嘴宝宝碎片", value:"20601"},
{name: "凯罗斯碎片", value:"20611"},
{name: "暴鲤龙碎片", value:"20631"},
{name: "拉普拉斯碎片", value:"20641"},
{name: "化石盔碎片", value:"20691"},
{name: "化石翼龙碎片", value:"20701"},
{name: "小卡比兽碎片", value:"20711"},
{name: "急冻鸟碎片", value:"20721"},
{name: "闪电鸟碎片", value:"20731"},
{name: "火焰鸟碎片", value:"20741"},
{name: "快龙碎片", value:"20751"},
{name: "超梦碎片", value:"20761"},
{name: "梦幻碎片", value:"20771"},
{name: "菊草叶碎片", value:"20781"},
{name: "火球鼠碎片", value:"20791"},
{name: "小锯鳄碎片", value:"20801"},
{name: "波克比碎片", value:"20861"},
{name: "咩利羊碎片", value:"20881"},
{name: "露力丽碎片", value:"20891"},
{name: "梦妖碎片", value:"20971"},
{name: "天蝎碎片", value:"21031"},
{name: "赫拉克罗斯碎片", value:"21071"},
{name: "狃拉碎片", value:"21081"},
{name: "戴鲁比碎片", value:"21171"},
{name: "雷公碎片", value:"21221"},
{name: "炎帝碎片", value:"21231"},
{name: "水君碎片", value:"21241"},
{name: "幼基拉斯碎片", value:"21251"},
{name: "凤王碎片", value:"21271"},
{name: "木守宫碎片", value:"21291"},
{name: "火稚鸡碎片", value:"21301"},
{name: "水跃鱼碎片", value:"21311"},
{name: "莲叶童子碎片", value:"21351"},
{name: "拉鲁拉丝碎片", value:"21391"},
{name: "懒人獭碎片", value:"21421"},
{name: "咕妞妞碎片", value:"21441"},
{name: "可可多拉碎片", value:"21501"},
{name: "呆火驼碎片", value:"21611"},
{name: "晃晃斑碎片", value:"21641"},
{name: "丑丑鱼碎片", value:"21771"},
{name: "怨影娃娃碎片", value:"21801"},
{name: "夜巡灵碎片", value:"21811"},
{name: "阿勃梭鲁碎片", value:"21841"},
{name: "雪童子碎片", value:"21851"},
{name: "海豹球碎片", value:"21861"},
{name: "宝贝龙碎片", value:"21891"},
{name: "铁哑铃碎片", value:"21901"},
{name: "雷吉洛克碎片", value:"21911"},
{name: "雷吉艾斯碎片", value:"21921"},
{name: "雷吉斯奇鲁碎片", value:"21931"},
{name: "拉帝亚斯碎片", value:"21941"},
{name: "拉帝欧斯碎片", value:"21951"},
{name: "草苗龟碎片", value:"22011"},
{name: "小火焰猴碎片", value:"22021"},
{name: "波加曼碎片", value:"22031"},
{name: "小猫怪碎片", value:"22071"},
{name: "圆陆鲨碎片", value:"22231"},
{name: "利欧路碎片", value:"22241"},
{name: "不良蛙碎片", value:"22271"},
{name: "雪笠怪碎片", value:"22301"},
{name: "克雷色利亚碎片", value:"22401"},
{name: "藤藤蛇碎片", value:"22471"},
{name: "暖暖猪碎片", value:"22481"},
{name: "石丸子碎片", value:"22591"},
{name: "螺钉地鼠碎片", value:"22611"},
{name: "搬运小匠碎片", value:"22631"},
{name: "百足蜈蚣碎片", value:"22681"},
{name: "黑眼鳄碎片", value:"22721"},
{name: "索罗亚碎片", value:"22821"},
{name: "泡沫栗鼠碎片", value:"22831"},
{name: "哥德宝宝碎片", value:"22841"},
{name: "迷你冰碎片", value:"22871"},
{name: "电飞鼠碎片", value:"22891"},
{name: "轻飘飘·雌碎片", value:"22921"},
{name: "轻飘飘·雄碎片", value:"22922"},
{name: "齿轮儿碎片", value:"22961"},
{name: "烛光灵碎片", value:"22991"},
{name: "牙牙碎片", value:"23001"},
{name: "喷嚏熊碎片", value:"23011"},
{name: "几何雪花碎片", value:"23021"},
{name: "单首龙碎片", value:"23141"},
{name: "燃烧虫碎片", value:"23151"},
{name: "勾帕路翁碎片", value:"23161"},
{name: "代拉基翁碎片", value:"23171"},
{name: "毕力吉翁碎片", value:"23181"},
{name: "龙卷云碎片", value:"23191"},
{name: "雷电云碎片", value:"23201"},
{name: "土地云碎片", value:"23231"},
{name: "凯路迪欧碎片", value:"23251"},
{name: "哈力栗碎片", value:"23281"},
{name: "火狐狸碎片", value:"23291"},
{name: "呱呱泡蛙碎片", value:"23301"},
{name: "小狮狮碎片", value:"23341"},
{name: "花蓓蓓碎片", value:"23351"},
{name: "独剑鞘碎片", value:"23411"},
{name: "绵绵泡芙碎片", value:"23431"},
{name: "铁臂枪虾碎片", value:"23471"},
{name: "冰雪龙碎片", value:"23501"},
{name: "摔角鹰人碎片", value:"23511"},
{name: "黏黏宝碎片", value:"23541"},
{name: "小木灵碎片", value:"23561"},
{name: "嗡蝠碎片", value:"23591"},
{name: "木木枭碎片", value:"23661"},
{name: "球球海狮碎片", value:"23681"},
{name: "好坏星碎片", value:"23771"},
{name: "甜竹竹碎片", value:"23841"},
{name: "毒贝比碎片", value:"24131"},
{name: "小智版皮卡丘碎片", value:"27001"},
{name: "雷吉奇卡斯碎片", value:"22381"},
{name: "达克莱伊碎片", value:"22431"},
{name: "谢米碎片", value:"22441"},
{name: "蒂安希碎片", value:"23631"},
{name: "洛奇亚碎片", value:"21261"},
{name: "盖欧卡碎片", value:"21961"},
{name: "固拉多碎片", value:"21971"},
{name: "裂空座碎片", value:"21981"},
{name: "基拉祈碎片", value:"21991"},
{name: "美洛耶塔·歌声碎片", value:"23261"},
{name: "帝牙卢卡碎片", value:"22351"},
{name: "帕路奇亚碎片", value:"22361"},
{name: "骑拉帝纳碎片", value:"22391"},
{name: "莱希拉姆碎片", value:"23211"},
{name: "捷克罗姆碎片", value:"23221"},
{name: "酋雷姆碎片", value:"23241"},
{name: "惩戒胡帕碎片", value:"23641"},
{name: "索尔迦雷欧碎片", value:"24023"},
{name: "美录坦碎片", value:"24171"},
{name: "伊裴尔塔尔碎片", value:"23611"},
{name: "时拉比碎片", value:"21281"},
{name: "盖诺赛克特碎片", value:"23271"},
{name: "哲尔尼亚斯碎片", value:"23601"},
{name: "捷拉奥拉碎片", value:"24161"},
{name: "紫色百变怪碎片", value:"29001"},
{name: "橙色百变怪碎片", value:"29002"},
{name: "红色百变怪碎片", value:"29003"},
{name: "吃剩的苹果碎片", value:"28001"},
{name: "熔岩增幅器碎片", value:"28002"},
{name: "电力增幅器碎片", value:"28003"},
{name: "王者之证碎片", value:"28004"},
{name: "心灵香草碎片", value:"28005"},
{name: "气势头带碎片", value:"28006"},
{name: "柔软沙子碎片", value:"28007"},
{name: "丝绸围巾碎片", value:"28008"},
{name: "诅咒之符碎片", value:"28009"},
{name: "龙之牙碎片", value:"28010"},
{name: "硬石头碎片", value:"28011"},
{name: "黑带碎片", value:"28012"},
{name: "金属膜碎片", value:"28013"},
{name: "妖精内存碎片", value:"28014"},
{name: "力量负重碎片", value:"28015"},
{name: "奇异熏香碎片", value:"28016"},
{name: "心之水滴碎片", value:"28017"},
{name: "对战通讯器碎片", value:"28018"},
{name: "小智的帽子碎片", value:"28019"},
{name: "不朽之剑碎片", value:"28101"},
{name: "赤焰之爪碎片", value:"28102"},
{name: "不朽之盾碎片", value:"28103"},
{name: "高能护腕碎片", value:"28104"},
{name: "强力手环碎片", value:"28105"},
{name: "精灵之笛碎片", value:"28106"},
{name: "共鸣元素碎片", value:"28107"},
{name: "极巨腕带碎片", value:"28108"},
{name: "西尔佛检视镜碎片", value:"28109"},
{name: "博士面具碎片", value:"28110"},
{name: "宝石手镯碎片", value:"28111"},
{name: "超级眼镜碎片", value:"28112"},
{name: "超级领针碎片", value:"28113"},
{name: "防尘护目镜碎片", value:"28114"},
{name: "超能腕表碎片", value:"28115"},
{name: "探宝器碎片", value:"28116"},
{name: "现形镜碎片", value:"28117"},
{name: "神秘项链碎片", value:"28118"},
{name: "超能轮滑鞋碎片", value:"28119"},
{name: "武士头盔碎片", value:"28120"},
{name: "痛苦面具碎片", value:"28121"},
{name: "索尔合体器碎片", value:"28123"},
{name: "基因之楔碎片", value:"28124"},
{name: "洞察王冠碎片", value:"28125"},
{name: "蓝色万能石碎片", value:"28501"},
{name: "紫色万能石碎片", value:"28502"},
{name: "橙色万能石碎片", value:"28503"},
{name: "橙色探险器自选宝箱碎片", value:"28504"},
{name: "紫色携带道具自选宝箱碎片", value:"28505"},
{name: "随机橙色符石宝箱碎片", value:"28506"},
{name: "蚊香蛙皇碎片", value:"20251"},
{name: "呆呆王碎片", value:"20321"},
{name: "椰蛋树碎片", value:"20441"},
{name: "魔墙人偶碎片", value:"20561"},
{name: "闪光超级班基拉斯碎片", value:"21254"},
{name: "席多蓝恩碎片", value:"22371"},
{name: "菲欧娜碎片", value:"22411"},
{name: "玛娜菲碎片", value:"22421"},
{name: "比克提尼碎片", value:"22461"},
{name: "基格尔德100%碎片", value:"23621"},
{name: "波尔凯尼恩碎片", value:"23651"},
{name: "炽焰咆哮虎碎片", value:"23671"},
{name: "谜拟Ｑ碎片", value:"23961"},
{name: "露奈雅拉碎片", value:"24024"},
{name: "虚吾伊德碎片", value:"24031"},
{name: "铁火辉夜碎片", value:"24071"},
{name: "纸御剑碎片", value:"24081"},
{name: "玛机雅娜碎片", value:"24111"},
{name: "玛夏多碎片", value:"24121"},
{name: "垒磊石碎片", value:"24141"},
{name: "砰头小丑碎片", value:"24151"},
{name: "闪光耿鬼碎片", value:"27021"},
{name: "远古异兽:胖丁碎片", value:"27031"},
{name: "远古异兽:耿鬼碎片", value:"27041"},
{name: "远古异兽:胡地碎片", value:"27051"},
{name: "变异体:暴鲤龙碎片'", value:"27061"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" id="mailnumsp" name="mailnumsp" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="suipianbtn">发送碎片</button> 

    </div>
	</div>
  </div>
 </div>
 <!--6-->
 <div class="layui-form-item itembox huashibox">
        <label class="layui-form-label2">化石系统</label>
        <div class="layui-input-block">
            <div id="huashi_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var huashi_mailid = xmSelect.render({
	el: '#huashi_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "火之石", value:"3001"},
{name: "水之石", value:"3002"},
{name: "雷之石", value:"3003"},
{name: "叶之石", value:"3004"},
{name: "月之石", value:"3005"},
{name: "日之石", value:"3006"},
{name: "光之石", value:"3007"},
{name: "暗之石", value:"3008"},
{name: "觉醒之石", value:"3009"},
{name: "冰之石", value:"3010"},
{name: "一般进化石", value:"3011"},
{name: "火进化石", value:"3012"},
{name: "水进化石", value:"3013"},
{name: "草进化石", value:"3014"},
{name: "电进化石", value:"3015"},
{name: "冰进化石", value:"3016"},
{name: "格斗进化石", value:"3017"},
{name: "毒进化石", value:"3018"},
{name: "地面进化石", value:"3019"},
{name: "飞行进化石", value:"3020"},
{name: "超能进化石", value:"3021"},
{name: "虫进化石", value:"3022"},
{name: "岩石进化石", value:"3023"},
{name: "幽灵进化石", value:"3024"},
{name: "龙进化石", value:"3025"},
{name: "恶进化石", value:"3026"},
{name: "钢进化石", value:"3027"},
{name: "妖精进化石", value:"3028"},
{name: "紫色进化钥石", value:"3029"},
{name: "橙色进化钥石", value:"3030"},
{name: "红色进化钥石", value:"3031"},
{name: "不完美的钥石", value:"3032"},
{name: "神奇的进化石", value:"3033"},
{name: "究极进化钥石", value:"3034"},
{name: "妙蛙花进化石", value:"3101"},
{name: "喷火龙进化石X", value:"3102"},
{name: "喷火龙进化石Y", value:"3103"},
{name: "水箭龟进化石", value:"3104"},
{name: "大针蜂进化石", value:"3105"},
{name: "暴雪王进化石", value:"3106"},
{name: "耿鬼进化石", value:"3107"},
{name: "胡地进化石", value:"3108"},
{name: "电龙进化石", value:"3109"},
{name: "裂空座进化石", value:"3110"},
{name: "巨金怪进化石", value:"3111"},
{name: "巨沼怪进化石", value:"3112"},
{name: "巨钳螳螂进化石", value:"3113"},
{name: "沙奈朵进化石", value:"3114"},
{name: "艾路雷朵进化石", value:"3115"},
{name: "波士可多拉进化石", value:"3116"},
{name: "固拉多进化石", value:"3117"},
{name: "甲贺忍蛙进化石", value:"3118"},
{name: "路卡利欧进化石", value:"3119"},
{name: "暴鲤龙进化石", value:"3120"},
{name: "火焰鸡进化石", value:"3121"},
{name: "赫拉克罗斯进化石", value:"3122"},
{name: "黑鲁加进化石", value:"3123"},
{name: "盖欧卡进化石", value:"3124"},
{name: "大钢蛇进化石", value:"3125"},
{name: "比比鸟进化石", value:"3126"},
{name: "蒂安希进化石", value:"3127"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" id="mailnumhs" name="mailnumhs" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="huashibtn">发送化石</button> 

    </div>
	</div>
  </div>
 </div>
 <!--7-->
 <div class="layui-form-item itembox touxinbox">
        <label class="layui-form-label2">头信系统</label>
        <div class="layui-input-block">
            <div id="touxin_mailid" class="xm-select-demo"></div>
        </div>
  
<script>
var touxin_mailid = xmSelect.render({
	el: '#touxin_mailid',  
	tips: '请选择物品', 
	empty: '呀, 没有数据呢',//搜索为空的提示
	searchTips: '你要找什么呢?(模糊搜索)',//搜索框提示
	theme: {
		color: '#f37b1d',//颜色
	},
	filterable: true,//搜索
	radio: true,
	clickClose: true,
	paging: true,//分页 
	pageSize: 15,//分页条数
	filterMethod: function(val, item, index, prop){
		if(item.name.indexOf(val) != -1){//名称中包含的搜索出来
			return true;
		}
		return false;//不知道的就不管了
	},
	data: [
	    
	

{name: "黄金训练家头像框", value:"2000"},
{name: "草苗龟头像框", value:"2001"},
{name: "莲叶童子头像框", value:"2002"},
{name: "皮卡丘头像框", value:"2003"},
{name: "火焰鸡头像框", value:"2004"},
{name: "甲贺忍蛙头像框", value:"2005"},
{name: "超梦头像框", value:"2006"},
{name: "凤王头像框", value:"2007"},
{name: "圣诞专属头像框", value:"2008"},
{name: "新春专属头像框", value:"2009"},
{name: "洛奇亚头像框", value:"2010"},
{name: "S1通行证头像框", value:"2011"},
{name: "劳动最光荣", value:"2012"},
{name: "裂空座头像框", value:"2013"},
{name: "童真童趣", value:"2014"},
{name: "盖欧卡头像框", value:"2015"},
{name: "粽情端午", value:"2016"},
{name: "中秋月兔", value:"2017"},
{name: "庆典", value:"2018"},
{name: "万圣的恶魔", value:"2019"},
{name: "圣诞麋鹿2020", value:"2020"},
{name: "舞狮庆元旦", value:"2021"},
{name: "元宵贺岁", value:"2022"},
{name: "恭喜发大财", value:"2023"},
{name: "爱就在一起", value:"2024"},
{name: "1周年庆贺", value:"2025"},
{name: "超级烈空座头像框", value:"2026"},
{name: "劳动节2021限定", value:"2027"},
{name: "欢乐六一", value:"2028"},
{name: "粽游端午", value:"2029"},
{name: "夏日乐游游", value:"2030"},
{name: "团圆中秋", value:"2031"},
{name: "狂欢节日", value:"2032"},
{name: "原始固拉多头像框", value:"2033"},
{name: "头像框", value:"2034"},
{name: "达克莱伊头像框", value:"2040"},
{name: "雷吉奇卡斯头像框", value:"2041"},
{name: "帝牙卢卡头像框", value:"2042"},
{name: "帕路奇亚头像框", value:"2043"},
{name: "骑拉帝纳头像框", value:"2044"},
{name: "谢米头像框", value:"2045"},
{name: "惩戒胡帕头像框", value:"2046"},
{name: "莱希拉姆头像框", value:"2047"},
{name: "捷克罗姆头像框", value:"2048"},
{name: "酋雷姆头像框", value:"2049"},
{name: "美洛耶塔·歌声头像框", value:"2050"},
{name: "美洛耶塔·舞步头像框", value:"2051"},
{name: "基拉祈头像框", value:"2052"},
{name: "美录梅塔头像框", value:"2053"},
{name: "伊裴尔塔尔头像框", value:"2054"},
{name: "时拉比头像框", value:"2055"},
{name: "盖诺赛克特头像框", value:"2056"},
{name: "哲尔尼亚斯头像框", value:"2057"},
{name: "捷拉奥拉头像框", value:"2058"},
{name: "S2通行证头像框", value:"2071"},
{name: "S3通行证头像框", value:"2072"},
{name: "S4通行证头像框", value:"2073"},
{name: "S5通行证头像框", value:"2074"},
{name: "S6通行证头像框", value:"2075"},
{name: "S7通行证头像框", value:"2076"},
{name: "S8通行证头像框", value:"2077"},
{name: "S9通行证头像框", value:"2078"},
{name: "S10通行证头像框", value:"2079"},
{name: "初级强化石", value:"2101"},
{name: "中级强化石", value:"2102"},
{name: "高级强化石", value:"2103"},
{name: "蓝色万能石", value:"2151"},
{name: "紫色万能石", value:"2152"},
{name: "橙色万能石", value:"2153"},
{name: "通行证形象选择箱子", value:"2190"},
{name: "小智的信物", value:"2201"},
{name: "小霞的信物", value:"2202"},
{name: "拉普的信物", value:"2203"},
{name: "布尔美丽的信物", value:"2204"},
{name: "露美旦的信物", value:"2205"},
{name: "梅雅丽的信物", value:"2206"},
{name: "三色堇的信物", value:"2207"},
{name: "紫罗兰的信物", value:"2208"},
{name: "西子伊的信物", value:"2209"},
{name: "杜娟的信物", value:"2210"},
{name: "阿克罗玛的信物", value:"2211"},
{name: "亚莎的信物", value:"2212"},
{name: "修的信物", value:"2213"},
{name: "霍米加的信物", value:"2214"},
{name: "白露的信物", value:"2215"},
{name: "可尔妮的信物", value:"2216"},
{name: "兰昼妮的信物", value:"2217"},
{name: "露夕华的信物", value:"2218"},
{name: "兰妞夜的信物", value:"2219"},
{name: "芦荟的信物", value:"2220"},
{name: "斗子的信物", value:"2221"},
{name: "芽衣的信物", value:"2222"},
{name: "弥莉丝的信物", value:"2223"},
{name: "芙蓉的信物", value:"2224"},
{name: "水莲的信物", value:"2225"},
{name: "碧蓝的信物", value:"2226"},
{name: "小刚的信物", value:"2227"},
{name: "碧珂的信物", value:"2228"},
{name: "达帕的信物", value:"2229"},
{name: "艾岚的信物", value:"2231"},
{name: "大木博士的信物", value:"2232"},
{name: "小智(圣诞限定)的信物", value:"2237"},
{name: "小霞(圣诞限定)的信物", value:"2238"},
{name: "朗日的信物", value:"2239"},
{name: "美月的信物", value:"2240"},
{name: "小次郎的信物", value:"2241"},
{name: "武藏的信物", value:"2242"},
{name: "水莲(夏日限定)的信物", value:"2243"},
{name: "梅雅利的信物", value:"2244"},
{name: "格拉吉欧的信物", value:"2245"},
{name: "玛奥的信物", value:"2246"},
{name: "莉莉艾的信物", value:"2247"},
{name: "阿塞萝拉的信物", value:"2248"},
{name: "皮卡丘圣诞版", value:"2300"},
{name: "电电鼠新春版", value:"2301"},
{name: "波加曼", value:"2302"},
{name: "耿鬼", value:"2303"},
{name: "杰尼龟", value:"2304"},
{name: "喵喵", value:"2305"},
{name: "木木枭", value:"2306"},
{name: "妙蛙种子", value:"2307"},
{name: "皮卡丘", value:"2308"},
{name: "小火龙", value:"2309"},
{name: "伊布", value:"2310"},
{name: "月精灵", value:"2311"},
{name: "沼跃鱼", value:"2312"},
{name: "卡比兽劳动节限定", value:"2313"},
{name: "歌德宝宝61限定", value:"2314"},
{name: "妙蛙粽子", value:"2315"},
{name: "吃饼嘛", value:"2316"},
{name: "比心", value:"2317"},
{name: "伪装", value:"2318"},
{name: "穿着熊2020圣诞限定", value:"2319"},
{name: "吉利蛋2021元旦限定", value:"2320"},
{name: "大奶罐·2021", value:"2321"},
{name: "红包拿来", value:"2322"},
{name: "终成眷属·2021", value:"2323"},
{name: "1周年·皮卡丘", value:"2324"},
{name: "搬砖喵喵", value:"2325"},
{name: "六一·顽皮熊猫", value:"2326"},
{name: "粽叶童子", value:"2327"},
{name: "夏日·皮卡丘", value:"2328"},
{name: "夏日·杰尼龟", value:"2329"},
{name: "火球鼠·中秋", value:"2330"},
{name: "盛典·卡拉卡拉", value:"2331"},
{name: "头像", value:"2332"},
{name: "圣诞快乐", value:"2400"},
{name: "新春快乐", value:"2401"},
{name: "通行证S1", value:"2402"},
{name: "劳动最光荣", value:"2403"},
{name: "熊孩子", value:"2404"},
{name: "粽情端午", value:"2405"},
{name: "月圆佳时", value:"2406"},
{name: "庆典见证者", value:"2407"},
{name: "Skr小机灵鬼", value:"2408"},
{name: "2020圣诞限定", value:"2409"},
{name: "2021元旦快乐", value:"2410"},
{name: "圆圆满满", value:"2411"},
{name: "新年伊始", value:"2412"},
{name: "撒粮专业户", value:"2413"},
{name: "感恩有你", value:"2414"},
{name: "勇者觉醒", value:"2415"},
{name: "打工人最可爱", value:"2416"},
{name: "童心未泯", value:"2417"},
{name: "放粽一夏", value:"2418"},
{name: "宝藏猎人", value:"2419"},
{name: "盛夏光年", value:"2420"},
{name: "私奔到月球", value:"2421"},
{name: "狂欢盛宴", value:"2422"},
{name: "称号", value:"2423"},
{name: "通行证S2", value:"2471"},
{name: "通行证S3", value:"2472"},
{name: "通行证S4", value:"2473"},
{name: "通行证S5", value:"2474"},
{name: "通行证S6", value:"2475"},
{name: "通行证S7", value:"2476"},
{name: "通行证S8", value:"2477"},
{name: "通行证S9", value:"2478"},
{name: "通行证S10", value:"2479"},
{name: "天赋异禀", value:"2501"},
{name: "星路迢迢", value:"2502"},
{name: "星级达人", value:"2503"},
{name: "升星狂人", value:"2504"},
{name: "完美觉醒", value:"2505"},
{name: "稀有宝物", value:"2506"},
{name: "不可能任务", value:"2507"},
{name: "只是传说", value:"2508"},
{name: "斯巴达勇士", value:"2509"},
{name: "送人玫瑰", value:"2510"},
{name: "大力出奇迹", value:"2511"},
{name: "双黄蛋", value:"2512"},
{name: "帽子戏法", value:"2513"},
{name: "家里有矿", value:"2514"},
{name: "龙王喷水", value:"2515"},
{name: "不可思议の", value:"2516"},
{name: "征服者", value:"2517"},
{name: "渔夫", value:"2518"},
{name: "垂钓高手", value:"2519"},
{name: "垂钓达人", value:"2520"},
{name: "垂钓宗师", value:"2521"},
{name: "老人与海", value:"2522"},
{name: "道馆挑战者", value:"2523"},
{name: "主角光环", value:"2524"},
{name: "冒险王子", value:"2525"},




	    
		]
})
</script>
  <div class="layui-form-item">
  <label class="layui-form-label2">数量</label>
    <div class="layui-input-block">
	 <div class="ldemo"> 
      <input type="text" disabled="disabled"  id="mailnumtx" name="mailnumtx" value="1" autocomplete="off" placeholder="请输入物品数量" class="layui-input2">
	   <button class="layui-btn layui-btn-normallan rdemo " lay-submit="" lay-filter="touxinbtn">发送头信</button> 

    </div>
	</div>
  </div>
 </div>
 
  <div style=" background-color: #F2F2F2;">
  <div class="layui-row layui-col-space1">


			<div id="divMsg" style="color:#F00" class="validator-tips">游戏账号用纯数字-否则不到账</div>
				<div id="divMsg" style="color:#F00" class="validator-tips">物品数量用多少发多少</div>
<div id="divMsg" style="color:#F00" class="validator-tips">值有些能用有些不能用，有些只能用一次，自己尝试下</div>
<div id="divMsg" style="color:#F00" class="validator-tips">邮件不要刷多，用完再刷，不要刷炸了又来找，少刷多用</div>
    </div>
	
	

	
    
	
 
  
  </div>
 


  
  
<script>
function stop(){
return false;
}
document.oncontextmenu=stop;
window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
    if (event.keyCode === 123) {
        event.preventDefault(); 
        window.event.returnValue = false;
    }
}
function shuoming() {
    layer.open({
        content: '<font color="red">必看使用说明</font>：</br><font color="red">1.持续更新。后续更新V14版本</font>',
        btn: "我知道了"
    })
}
function shuoming2() {
    layer.open({
        content: '<font color="red">开通后台说明</font>：</br>复制激活码到上方输入，激活一次就可以一直用玩家后台了。</br>后台密码自己设置比如123456',
        btn: "我知道了"
    })
}

let options = { skin: skinChoose(), title: "提示", anim: animChoose() };
function isArray(o) {
	return Object.prototype.toString.call(o) == "[object Array]";
}
function animChoose() {
	let animArray = ["0", "1", "2", "3", "4", "5", "6"];
	return Math.floor(Math.random() * animArray.length);
}
function skinChoose() {
	let skinarray = [
		"layui-layer-molv",
		"layui-layer-lan",
		"",
		"demo-class",
		"demo-class2",
	];
	return skinarray[parseInt(Math.random() * skinarray.length, 10)];
}
function clearbag() {
		var pswd = $('#pswd').val();
        var username = $('#username').val();
        var qu = $('#qu').val();
	layer.confirm(
		'<font color="red"><h2>警告！</h2><br/>请确认是否要执行该操作！</font>',
		options,
		function () {
			if (username == "") {
            layer.msg("请输入角色名");
            return false
			}
			if (qu == "") {
            layer.msg("请选区");
            return false
			}
			$.ajaxSetup({
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
			});
			$.post(
				"user/playerapi.php",
				{
					type: "clearbag",
					username: username,
					qu: qu,
					pswd: pswd
				},
				function (data) {
					layer.closeAll();
					layer.msg(data.msg);
				}
			,"json");
		},
		function () {
			layer.msg("小伙子想好再来吧");
		}
	);
}
function clearmail() {
		var pswd = $('#pswd').val();
        var username = $('#username').val();
        var qu = $('#qu').val();
	layer.confirm(
		'<font color="red"><h2>警告！</h2><br/>请确认是否要执行该操作！</font>',
		options,
		function () {
			if (username == "") {
            layer.msg("请输入角色名");
            return false
			}
			if (qu == "") {
            layer.msg("请选区");
            return false
			}
			$.ajaxSetup({
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
			});
			$.post(
				"user/playerapi.php",
				{
					type: "clearmail",
					username: username,
					qu: qu,
					pswd: pswd
				},
				function (data) {
					layer.closeAll();
					layer.msg(data.msg);
				}
			,"json");
		},
		function () {
			layer.msg("小伙子想好再来吧");
		}
	);
}



</script>
<script type="text/javascript">
    $(".czli").click(function(){
        $('.itembox').hide();
        $('.chongzhibox').show();
    })
    $('.yjli').click(function(){
        $('.itembox').hide();
        $('.youjianbox').show();
    })
    $(".jlli").click(function(){
        $('.itembox').hide();
        $('.jinglingbox').show();
    })
    $('.tcli').click(function(){
        $('.itembox').hide();
        $('.taocanbox').show();
    })
    $(".djli").click(function(){
        $('.itembox').hide();
        $('.daojvbox').show();
    })
    $('.spli').click(function(){
        $('.itembox').hide();
        $('.suipianbox').show();
    })
    $(".hsli").click(function(){
        $('.itembox').hide();
        $('.huashibox').show();
    })
    $('.txli').click(function(){
        $('.itembox').hide();
        $('.touxinbox').show();
    })
</script>
</body>
</html>