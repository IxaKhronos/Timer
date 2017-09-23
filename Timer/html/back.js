var alarmData={};

chrome.runtime.onStartup.addListener(setIcon)
chrome.runtime.onInstalled.addListener(setIcon)

chrome.alarms.onAlarm.addListener(function(alarm){
	chrome.storage.local.get("alarmData",function(items){
		if(items.alarmData){
			alarmData=JSON.parse(items.alarmData);
			if(alarmData[alarm.name]){
				notify(alarmData[alarm.name]);
			}
		}
	})
	setIcon();
})
function setIcon(){
	chrome.alarms.getAll(function(alarms){
		console.log(alarms.length)
		if(alarms.length){
			chrome.browserAction.setIcon({path:"/icons/16.png"})
		}else{
			chrome.browserAction.setIcon({path:"/icons/16off.png"})
		}
	})
}

function notify(data){
	chrome.notifications.create(
		data.name,
		{
			iconUrl:"/icons/16.png",
			type:"basic",
			title:data.title,
			message:data.mes
		}
	)
	delete alarmData[data.name];
}