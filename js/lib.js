'use strict';

var $HEAD = $(document.head);
var $BODY = $(document.body);

var EXTENSION_URL = chrome.extension.getURL('');
var ROUTER, NOW_ROUTER;
var isActiveUI = true;

var SiaAPIs = {};

document.onkeydown = function(e) {
	var theEvent = window.event || e;
	var code = theEvent.keyCode || theEvent.which;
	if (code == 13) {
		//alert('你按下了回车按钮 Enter. ');
		$('[data-keyboard="enter"]').click();
	}
}

function delSuffixes(str, decimal, num){
	var n = num || 22;
	var d = decimal || 2;
	var f;

	if (str.length > 22) {
		f = parseFloat( str.substring(0, str.length - n) );
	} else {
		f = parseFloat( str );
	}

	return f / Math.pow(10, d);
}

function callSiaAPI(apiType, api, serial, callback){
	var data;
	if (apiType == 'POST') { data = serial; } else { data = ''; }

	$.ajax({
		type: apiType,
		url: api,
		data: data,
		success: function(result){
			var obj;

			if (typeof(result) == 'object') { 
				obj = result; 
			} else {
				obj = JSON.parse(result);
			}
			
			if(typeof callback == "function") { callback(obj); }
		},
		error: function(result){
			var obj;

			if (typeof(result) == 'object') { 
				obj = result; 
			} else {
				obj = JSON.parse(result);
			}
			
			if(typeof callback == "function") { callback(obj); }
		}
	});
}


function showMsg(here, msg, type, fadeOutTime){
	var t = type || 'alert-warning';
	var time = fadeOutTime || 2*1000;

	$(here).prepend(`
		<div role="alert" class="alert ` + t + ` alert-dismissible fade in">
			<button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>
			<strong>` + msg + `</strong>
		</div>
	`);	

	setTimeout(function(){
		$('.alert-dismissible').remove();
	}, time);
}

function objMerger(obj1, obj2){
	for(var r in obj2){
		//eval("obj1."+r+" = obj2."+r);
		obj1[r] = obj2[r]; 
	}
	return obj1;
}


function ScientificToNum(str){
	var arr = String(str).split('e+');
	var m, n, t, pos = 0;

	if ( arr.length > 1 ) {
		m = arr[0];
		n = arr[1];
		pos = m.length - m.indexOf('.') - 1;
		t = m.replace('.', '');

		for (var i = 0; i < n - pos; i++) {
			t = t + '0';	
		}

		return t;

	} else {
		return String(str);
	}
}

function TimestampToDate(timestamp){
	var date = new Date(timestamp);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds(); 

	return (Y+M+D+h+m+s);
}

/*
 *	解决 JavaScript 浮点值运算 Bug
 *	From : http://www.cnblogs.com/slowsoul/archive/2013/06/12/3132821.html
 */
//加法  
function FloatAdd(arg1,arg2){  
	var r1,r2,m;  
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
	m=Math.pow(10,Math.max(r1,r2));  
	return (arg1*m+arg2*m)/m;  
}  

//减法  
function FloatSub(arg1,arg2){  
	var r1,r2,m,n;  
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
	m=Math.pow(10,Math.max(r1,r2));  
	//动态控制精度长度  
	n=(r1>=r2)?r1:r2;  
	return ((arg1*m-arg2*m)/m).toFixed(n);  
}  

//乘法  
function FloatMul(arg1,arg2)   {   
	var m=0,s1=arg1.toString(),s2=arg2.toString();   
	try{m+=s1.split(".")[1].length}catch(e){}   
	try{m+=s2.split(".")[1].length}catch(e){}   
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);   
}   


//除法  
function FloatDiv(arg1,arg2){   
	var t1=0,t2=0,r1,r2;   
	try{t1=arg1.toString().split(".")[1].length}catch(e){}   
	try{t2=arg2.toString().split(".")[1].length}catch(e){}   
	//with(Math){   
	r1=Number(arg1.toString().replace(".",""));

	r2=Number(arg2.toString().replace(".",""));   
	return (r1/r2)*Math.pow(10,t2-t1);   
	//}
}


(function(){
	function watch(){
		var req = {};
		req.Action = 'isActiveUI';
		chrome.runtime.sendMessage(req, function(result){
			isActiveUI = result;
		});

		setTimeout(watch, 200);
	}

	watch();
})();