/**
无言专用QQ:1591473612
 */
$(document).ready(function() {
    $("#usermake").hide()
});
layui.use(["element", "table", "layer", "form"], function() {
    var table = layui.table;
    var layer = layui.layer;
    var element = layui.element;
    var form = layui.form;
    $("#gmone").click(function() {
        $("#mailandpay").show();
        $("#usermake").hide()
    });
    $("#gmtwo").click(function() {
        $("#usermake").show();
        $("#mailandpay").hide()
    });
    var cookie_uid = GetCookie("cookie_uid");
    var cookie_uid2 = GetCookie("cookie_uid2");
    var cookie_pswd = GetCookie("cookie_pswd");
    var cookie_qu = GetCookie("cookie_qu");
    if (cookie_uid != "") {
        $("#uid").val(cookie_uid)
    }
    if (cookie_uid2 != "") {
        $("#uid2").val(cookie_uid2)
    }
    if (cookie_pswd != "") {
        $("#pswd").val(cookie_pswd)
    }
    if (cookie_qu != "") {
        $("#qu option[value='" + cookie_qu + "']").prop("selected", true);
        form.render("select")
    }
    form.on("submit(pay_btn)", function(data) {
        var username = $('#username').val();
        var cdk = $('#cdk').val();
        var qu = $('#qu').val();
		var pswd = $('#pswd').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (username == "") {
            layer.msg("请输入角色ID");
            return false
        }
        if (cdk == "") {
            layer.msg("请输入cdk卡密");
            return false
        }
        if (qu == "") {
            layer.msg("请选区");
            return false
        }
		if (pswd == "") {
            layer.msg("请输入密码");
            return false
        }
        $.ajax({
            url: "user/playerapi.php",
            type: "post",
            data: {
            type: "pay",
            username: username,
            cdk: cdk,
            qu: qu,
			pswd:pswd,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
			gnxz: "9",
        }, 
            dataType: "json", 
		  success:function(data){
            msginfo(data)
		  },
		  error:function(){
            msgerror()
    }
        })
    });
     form.on("submit(qlbbbtn)", function(data) {
        var pswd = $('#pswd').val();
        var uid = $('#uid').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(uid, pswd, qu, uid2) == false) {
            return false
        }
        var qlbbid = $("#qlbbid").val();
        if (qlbbid == "") {
            layer.msg("请选择充值套餐");
            return false
        }
        var abc = {
            type: "qlbb",
            uid: uid,
            uid2: uid2,
            qlbbid: qlbbid,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            qlbb:$('#qlbb').val()
        };
        postinfo(abc)
    });
    form.on("submit(chargebtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var qu = $('#qu').val();
        var rechargezId = $('#rechargezId').val();
        var znumber = $('#znumber').val();
        var mailid = $('#mailid').val();
        var mailnum = $('#mailnum').val();
        if (checkdata(pswd, qu, username) == false) {
            return false
        }
        var rechargeId = $("#rechargeId").val();
        if (rechargeId == "") {
            rechargeId.msg("请选择充值套餐");
            return false
        }
        var number = $("#number").val();
        if (number == "" || isNaN(number)) {
            layer.msg("货币数量不能为空");
            return false
        }
        if (number < 1 || number > 9999999) {
            layer.msg("货币数量范围:1-999w");
            return false
        } 
        
        var abc = {
            type: "charge",
            username: username,
            qu: qu,
			rechargeId: rechargeId,
            number: number,
			rechargezId: rechargezId,
			znumber: znumber,
            mailid: mailid,
            mailnum: mailnum,
            pswd: pswd,
            rechargeId:$('#rechargeId').val()
        };
        postinfo(abc)
    });
    form.on("submit(chargebtn2)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var qu = $('#qu').val();
        var rechargezId = $('#rechargezId').val();
        var znumber = $('#znumber').val();
        var mailid = $('#mailid').val();
        var mailnum = $('#mailnum').val();
        if (checkdata(pswd, qu, username) == false) {
            return false
        }
        var rechargeId = $("#rechargeId").val();
        if (rechargeId == "") {
            rechargeId.msg("请选择充值套餐");
            return false
        }
        var znumber = $("#znumber").val();
        if (znumber == "" || isNaN(znumber)) {
            layer.msg("货币数量不能为空");
            return false
        }
        if (znumber < 1 || znumber > 9999) {
            layer.msg("货币数量范围:1-9999");
            return false
        } 
        
        var abc = {
            type: "charge2",
            username: username,
            qu: qu,
            rechargeId: rechargeId,
            znumber: znumber,
            rechargezId: rechargezId,
            znumber: znumber,
            mailid: mailid,
            mailnum: mailnum,
            pswd: pswd,
            rechargeId:$('#rechargeId').val()
        };
        postinfo(abc)
    });
    form.on("charge(chargetn)", function(data) {
        var pswd = $('#pswd').val();
        var uid = $('#uid').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(uid, pswd, qu, uid2) == false) {
            return false
        }
        var shuxingid = $("#chargeid").val();
        if (shuxingid == "") {
            layer.msg("请选择货币");
            return false
        }
        var shuxingnum = $("#chargenum").val();
        if (shuxingnum == "" || isNaN(shuxingnum)) {
            layer.msg("货币数量不能为空");
            return false
        }
        if (shuxingnum < 1 || shuxingnum > 9999) {
            layer.msg("货币数量范围:1-9999");
            return false
        }
        var abc = {
            type: "charge",
            uid: uid,
            uid2: uid2,
            shuxingid: chargeid,
            shuxingnum: chargenum,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd
        };
        postinfo(abc)
    });
    /*form.on("submit(mailbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var qu = $('#qu').val();
        var rechargezId = $('#rechargezId').val();
        var znumber = $('#znumber').val();
        var mailid = $('#mailid').val();
        var mailnum = $('#mailnum').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = wuyan_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnum = $("#mailnum").val();
        if (mailnum == "" || isNaN(mailnum)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnum < 1 || mailnum > 2000000000) {
            layer.msg("物品数量范围:1-20亿");
            return false
        }
        var abc = {
            type: "mail",
            charge: "3",
            username: username,
            qu: qu,
			rechargeId: rechargeId,
            number: number,
			rechargezId: rechargezId,
			znumber: znumber,
            mailid: mailid,
            mailnum: mailnum,
            pswd: pswd,
            rechargeId:$('#rechargeId').val()
        };
        postinfo(abc)
    });*/
	form.on("submit(mailbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = wuyan_mailidyj.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumyj = $("#mailnumyj").val();
        if (mailnumyj == "" || isNaN(mailnumyj)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumyj < 1 || mailnumyj > 9999) {
            layer.msg("物品数量范围:1-9999");
            return false
        }
        var abc = {
            type: "mail",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumyj: mailnumyj,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });

    form.on("submit(jinglingbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = jingling_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumjl = $("#mailnumjl").val();
        if (mailnumjl == "" || isNaN(mailnumjl)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumjl < 1 || mailnumjl > 2) {
            layer.msg("物品数量范围:1-1");
            return false
        }
        var abc = {
            type: "mailjl",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumjl: mailnumjl,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo1(abc)
    });
    
    form.on("submit(taocanbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = taocan_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumtc = $("#mailnumtc").val();
        if (mailnumtc == "" || isNaN(mailnumtc)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumtc < 1 || mailnumtc > 2) {
            layer.msg("物品数量范围:1-1");
            return false
        }
        var abc = {
            type: "mailtc",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumtc: mailnumtc,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });
    
    form.on("submit(daojvbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = daojv_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumdj = $("#mailnumdj").val();
        if (mailnumdj == "" || isNaN(mailnumdj)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumdj < 1 || mailnumdj > 99999) {
            layer.msg("物品数量范围:1-99999");
            return false
        }
        var abc = {
            type: "maildj",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumdj: mailnumdj,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });
	
	form.on("submit(suipianbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = suipian_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumsp = $("#mailnumsp").val();
        if (mailnumsp == "" || isNaN(mailnumsp)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumsp < 1 || mailnumsp > 999999) {
            layer.msg("物品数量范围:1-999999");
            return false
        }
        var abc = {
            type: "mailsp",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumsp: mailnumsp,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });
	
	form.on("submit(huashibtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = huashi_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumhs = $("#mailnumhs").val();
        if (mailnumhs == "" || isNaN(mailnumhs)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumhs < 1 || mailnumhs > 999) {
            layer.msg("物品数量范围:1-999");
            return false
        }
        var abc = {
            type: "mailhs",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumhs: mailnumhs,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });
    
    form.on("submit(touxinbtn)", function(data) {
        var pswd = $('#pswd').val();
        var username = $('#username').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(username, pswd, qu) == false) {
            return false
        }
		var mailid = touxin_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnumtx = $("#mailnumtx").val();
        if (mailnumtx == "" || isNaN(mailnumtx)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnumtx < 1 || mailnumtx > 2) {
            layer.msg("物品数量范围:1-1");
            return false
        }
        var abc = {
            type: "mailtx",
            username: username,
            uid2: uid2,
            mailid: mailid,
            mailnumtx: mailnumtx,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd,
            charge: "3",
        };
        postinfo(abc)
    });
	
    form.on("submit(clearbagbtn)", function(data) {
       var pswd = $('#pswd').val();
        var uid = $('#uid').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(uid, pswd, qu, uid2) == false) {
            return false
        }
		var mailid = wuyan_mailid.getValue('valueStr');
        if (mailid == "") {
            layer.msg("请选择物品");
            return false
        }
        var mailnum = $("#mailnum").val();
        if (mailnum == "" || isNaN(mailnum)) {
            layer.msg("物品数量不能为空");
            return false
        }
        if (mailnum < 1 || mailnum > 9999) {
            layer.msg("物品数量范围:1-9999");
            return false
        }
	//	
	{ layer.confirm('<font color="red"><h2>请确认！</h2><br/>是否要清理背包道具？</font>',
 {
  btn: ['是的','算了'] 
}, function(){//
        var abc = {
            type: "clearbag",
            uid: uid,
            uid2: uid2,
            mailid: mailid,
            mailnum: mailnum,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd
        };
        postinfo(abc)
		//
}, function(){
  layer.msg('小伙子想好再来吧');
});
}//
    });
	
    form.on("submit(levelbtn)", function(data) {
       var pswd = $('#pswd').val();
        var uid = $('#uid').val();
        var uid2 = $('#uid2').val();
        var qu = $('#qu').val();
        var wuyankey = $('#wuyankey').val();
        var wuyankey2 = $('#wuyankey2').val();
        var wuyankey3 = $('#wuyankey3').val();
        var wuyankey4 = $('#wuyankey4').val();
        var wuyankey5 = $('#wuyankey5').val();
        if (checkdata(uid, pswd, qu, uid2) == false) {
            return false
        }
        var mailnum = $("#mailnum").val();
        if (mailnum == "" || isNaN(mailnum)) {
            layer.msg("等级不能为空");
            return false
        }
	//	
	{ layer.confirm('<font color="red"><h2>请确认！</h2><br/>由高调低可能会出BUG，后果自负</font>',
 {
  btn: ['是的','算了'] 
}, function(){//
        var abc = {
            type: "level",
            uid: uid,
            uid2: uid2,
            mailnum: mailnum,
            qu: qu,
			wuyankey: wuyankey,
			wuyankey2: wuyankey2,
			wuyankey3: wuyankey3,
			wuyankey4: wuyankey4,
			wuyankey5: wuyankey5,
            pswd: pswd
        };
        postinfo(abc)
		//
}, function(){
  layer.msg('小伙子想好再来吧');
});
}//
    });
	
	
	
   
	
    function checkdata(a, b, c, d) {
        SetCookie("cookie_uid", a);
        SetCookie("cookie_pswd", b);
        SetCookie("cookie_qu", c);
        SetCookie("cookie_uid2", d);
		//SetCookie("cookie_uid2", e);
        if (a == "") {
            layer.msg("角色UID不能为空");
            return false
        }
        if (b == "") {
            layer.msg("游戏密码不能为空");
            return false
        }
        if (c == "") {
            layer.msg("请选区");
            return false
        }
        if (d == "") {
            layer.msg("角色ID不能为空");
            return false
        }
    }
});

function postinfo(a) {
    $.ajax({
        url: "user/playerapi.php",
        type: "post",
        data: a,
        dataType: "json",
        success: function (b) {
            msginfo(b)
        }, error: function () {
            msgerror()
        }
    })
}

function postinfo1(a) {
    $.ajax({
        url: "user/jlzf.php",
        type: "post",
        data: a,
        dataType: "json",
        success: function (b) {
            msginfo(b)
        }, error: function () {
            msgerror()
        }
    })
}

function msginfo(a) {
    if (a.info == 1) {
        layer.alert(a.msg, {
            icon: 1,
            skin: "layui-layer-btn0"
        })
    } else {
        layer.alert(a.msg, {
            icon: 2,
            skin: "layui-layer-btn0"
        })
    }
}

function msgerror() {
    layer.alert("系统异常", {
        icon: 2,
        skin: "layui-layer-molv"
    })
}

function fristload() {
    $("#newgame-list").usermake()
}

function SetCookie(name, value) {
    var key = "";
    var Days = 30;
    var exp = new Date();
    var domain = "";
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    if (key == null || key == "") {
        document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";"
    } else {
        var nameValue = GetCookie(name);
        if (nameValue == "") {
            document.cookie = name + "=" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";"
        } else {
            var keyValue = getCookie(name, key);
            if (keyValue != "") {
                nameValue = nameValue.replace(key + "=" + keyValue, key + "=" + encodeURI(value));
                document.cookie = name + "=" + nameValue + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";"
            } else {
                document.cookie = name + "=" + nameValue + "&" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;" + domain + ";"
            }
        }
    }
}

function GetCookie(name) {
    var nameValue = "";
    var key = "";
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        nameValue = decodeURI(arr[2])
    }
    if (key != null && key != "") {
        reg = new RegExp("(^| |&)" + key + "=([^(;|&|=)]*)(&|$)");
        if (arr = nameValue.match(reg)) {
            return decodeURI(arr[2])
        } else {
            return ""
        }
    } else {
        return nameValue
    }
};