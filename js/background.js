'use strict';

var UA = null;
var description = null;
var handler = function (details) {
	if (UA == null) { return; }

	for (var i = 0, l = details.requestHeaders.length; i < l; ++i) {
		if (details.requestHeaders[i].name === 'User-Agent') {
			details.requestHeaders[i].value = UA;
			break;
		}
	}

	return { requestHeaders: details.requestHeaders };
};
chrome.webRequest.onBeforeSendHeaders.addListener(handler, {urls: ["<all_urls>"]},  ["blocking", "requestHeaders"]);

function setUA(ua, desc) {    
    UA = ua;
    description = desc;
}

function clearUA() {
    UA = null;
    description = null;
}

function getUA() {
    return UA;
}

function getDescription() {
    return description;
}

// 当页面加载完成时，加载插件，以及注入相关脚本（content script）
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if ( tab.url.indexOf('/Sia-UI-Browser') > -1 && changeInfo.status === 'complete' ) {
		setUA('Sia-Agent', 'Custom');
		chrome.pageAction.show(tabId);
		chrome.tabs.executeScript(tabId, {file: "js/beautify.js"});	// 这个不写入 manifest.json 中是为了方便调试
		chrome.tabs.executeScript(tabId, {file: "js/ui.js"});	// 这个不写入 manifest.json 中是为了方便调试
		chrome.tabs.executeScript(tabId, {file: "js/event.js"});	// 这个不写入 manifest.json 中是为了方便调试
		chrome.tabs.executeScript(tabId, {file: "js/select_api.js"});	// 这个不写入 manifest.json 中是为了方便调试
	}
});

// 当浏览器tab改变时
chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab){
		if ( tab.url.indexOf('/Sia-UI-Browser') > -1 ) {
			setUA('Sia-Agent', 'Custom');
		} else {
			clearUA();
		}
	});
});
