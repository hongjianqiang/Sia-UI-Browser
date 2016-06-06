'use strict';

(function(){
	$HEAD.html(`
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Sia-UI-Browser</title>
		<link rel="shortcut icon" href="`+EXTENSION_URL+`img/icon16.png" >
		<link href="`+EXTENSION_URL+`css/bootstrap.css" rel="stylesheet">
		<style>
			body { margin:0; }
			
			#banner { background:#000; }

			#baseInfo { background:#000; }
			#baseInfo div { color:#FFF; }
			#baseInfo div a { color:#FFF; }

			#list .active { color:#FFFFFF; background:#00caa0; font-weight:bold; }
			#list .active:hover { color:#FFF; background:#00caa0; font-weight:bold; cursor:auto; }
			#list a { color:#000; padding:20px;font-size:18px; cursor:pointer; display:block; text-decoration:none; }
			#list a span { padding-right:5px; }
			#list a:hover { background:#c4c2c4; }

			#detail { background:#f1f3f6;height:100%; }
		</style>
	`);

	$BODY.html(`
		<div id="wrapper" class="container-fluid">
			<div id="banner" class="row">
				<div class="col-md-12">
					<a href="http://sia.tech" target="_blank">
						<img src="`+EXTENSION_URL+`img/icon128.png" alt="icon" width="100"/>
					</a>
				</div>
			</div>

			<div id="baseInfo" class="row">
				<div class="col-md-3"></div>
				<div class="col-md-9">
					<div class="col-md-2" style="width:200px;">状态：<samp class="synced"></samp></div>
					<div class="col-md-2" style="width:120px;">高度：<samp class="height"></samp></div>
					<div class="col-md-6" style="width:600px;"><a>当前块：<samp class="currentblock"></samp></a></div>	
					<div class="col-md-2" style="width:150px;">版本：<samp class="version"></samp></div>					
				</div>
			</div>
			
			<div class="row">
				<div id="list" class="col-md-2" style="background:#d4d2d4;height:100%;padding:0;">
					<div data-router="/overview"><a><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>概述</a></div>
					<div data-router="/files"><a><span class="glyphicon glyphicon-file" aria-hidden="true"></span>文件</a></div>
					<div data-router="/hosting"><a><span class="glyphicon glyphicon-hdd" aria-hidden="true"></span>主机</a></div>
					<div data-router="/wallet"><a><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span>钱包</a></div>
					<div data-router="/explorer"><a><span class="glyphicon glyphicon-search" aria-hidden="true"></span>查询</a></div>
					<div data-router="/command"><a><span class="glyphicon glyphicon-console" aria-hidden="true"></span>命令</a></div>
					<div data-router="/about"><a><span class="glyphicon glyphicon-user" aria-hidden="true"></span>关于</a></div>
				</div>
				
				<div id="detail" class="col-md-10">
					
				</div>
			</div>
		</div>
	`);

	$('#list').on('click', '[data-router]', function(){
		$('#list a').removeClass('active');
		$(this).find('a').addClass('active');

		ROUTER = $(this).attr('data-router');
	});
})();


(function(){
	function flush(){
		if (isActiveUI) {
			$.get('/consensus', function(data){ 
				var obj = JSON.parse(data);
				if (obj.synced) { $('.synced').text('区块链同步完成') } else { $('.synced').text('正在同步区块链...'); }
				
				$('.height').text(obj.height);
				$('.currentblock').text(obj.currentblock);
			});

		}

		setTimeout(flush, 5*1000);
	}

	flush();

	$.get('/daemon/version', function(data){ 
		var obj = JSON.parse(data);
		$('.version').text('v' + obj.version);
	});
})();