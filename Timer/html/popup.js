var alarmData={};
$(function(){
	chrome.storage.local.get("alarmData",function(items){
		if(items.alarmData){
			alarmData=JSON.parse(items.alarmData);
			chrome.alarms.getAll(dspAllAlarm)
		}
	})
	
	$("#day").val(0);
	$("#time").val("00:00");
	timeUpd()
	$(document).on("click","#fire",createAlarm)
	$(document).on("click","#clear",removeAllAlarm)
	$(document).on("click","#upd",timeUpd)
	$(document).on("change",".dev",timeUpd)
	$(document).on("input",".dev",timeUpd)
	$(document).on("change",".abs",timeCalc)
	$(document).on("input",".abs",timeCalc)
	$(document).on("click","span.hd",function(ev){
		var at=$(this).text();
		console.log(alarmData[at])
		$("#adate").val(cvdate(at.split(" ")[0]))
		$("#atime").val(cvtime(at.split(" ")[1]))
		timeCalc();
		$("#title").val(alarmData[at].title);
		$("#text").val(alarmData[at].mes);
		$("#link").val(alarmData[at].link);
	})
	$(document).on("click","button.d",function(ev){
		var at=$(this).parent("div").find("span.hd").text();
		chrome.alarms.clear(at);
		delete alarmData[at];
		chrome.alarms.getAll(dspAllAlarm)
		setIcon();		
	})

	chrome.tabs.query({"active":true},dspURL)


	function cvdate(dstr){
		var dt=dstr.split("/")
		return dt[0]+"-"+mod(Number(dt[1]))+"-"+mod(Number(dt[2]))
	}
	function cvtime(tstr){
		var dt=tstr.split(":")
		return mod(Number(dt[0]))+":"+mod(Number(dt[1]))+":"+mod(Number(dt[2]))
	}

	function removeAllAlarm(){
		chrome.alarms.clearAll(setIcon);
		alarmData={};
		chrome.storage.local.set({"alarmData":JSON.stringify(alarmData)});
		$("#sList").empty();		
	}

	function dspAllAlarm(alarms){
		$("#sList").empty();
		for(var k in alarms){
			$("#sList").append("<div><span class='hd'>"+alarms[k].name
			+"</span><span>"+alarmData[alarms[k].name].title
			+"</span><button class='d'>削除</button></div>")
		}
	}

	function dspURL(tabs){
		$("#link").val(tabs[0].url)
	}

	function timeCalc(){
		var dt,tt,tstr;
		var now=new Date();
		tstr=now.toLocaleString();
		dt=tstr.split(" ")[0].replace(/(\b)([0-9])(\b)/g,"$10$2$3").replace(/\//g,'-');
		tt=tstr.split(" ")[1].replace(/^([0-9])(\b)/g,"0$1$2");
		$("#ndate").val(dt);
		$("#ntime").val(tt);
		var a=new Date($("#adate").val()+" "+$("#atime").val())
		var delta=a.getTime()-now.getTime()
		if(delta>0){
			delta=Math.round(delta/1000);
			var sec=delta % 60;
			delta=(delta-sec)/60;
			var min=delta %60;
			delta=(delta-min)/60;
			var hour=delta % 24;
			delta=(delta-hour)/24;
			$("#time").val(mod(hour)+":"+mod(min)+":"+mod(sec));
			$("#day").val(delta);
		}
	}

	function mod(d){
		if(d<10)d="0"+d;
		return d;
	}

	function timeUpd(){
		var dt,tt,tstr;
		var now=new Date();
		tstr=now.toLocaleString();
		dt=tstr.split(" ")[0].replace(/(\b)([0-9])(\b)/g,"$10$2$3").replace(/\//g,'-');
		tt=tstr.split(" ")[1].replace(/^([0-9])(\b)/g,"0$1$2");
		$("#ndate").val(dt);
		$("#ntime").val(tt);
		var ta=$("#time").val().split(":");
		var delta=($("#day").val()*24+Number(ta[0]))*60+Number(ta[1]);
		delta=delta*60;
		if(ta.length==3) delta=delta+Number(ta[2]);
		if(delta>=0){
			now.setTime(now.getTime()+delta*1000);
			tstr=now.toLocaleString();
			dt=tstr.split(" ")[0].replace(/(\b)([0-9])(\b)/g,"$10$2$3").replace(/\//g,'-');
			tt=tstr.split(" ")[1].replace(/^([0-9])(\b)/g,"0$1$2");;
			$("#adate").val(dt);
			$("#atime").val(tt);
		}
	}

	function createAlarm(){
		var a=new Date($("#adate").val()+" "+$("#atime").val())
		var at=a.toLocaleString();
		chrome.alarms.create(at,{"when":a.getTime()})
		alarmData[at]={
			"name":at,
			"title":$("#title").val(),
			"mes":$("#text").val(),
			"link":$("#link").val()
		}
		chrome.storage.local.set({"alarmData":JSON.stringify(alarmData)});
		chrome.alarms.getAll(dspAllAlarm)
		setIcon();
	}

	function setIcon(){
		chrome.runtime.getBackgroundPage(function(bg){bg.setIcon();});
	}
})
