'use strict';

(function(){
	var extension_url = chrome.extension.getURL('');
	var $head = $(document.head);
	var $body = $(document.body);

	$head.html(`
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Sia-UI-Browser</title>
		<style>
			body { margin:0; }
			.list .active { color:#FFFFFF; background:#00caa0; font-weight:bold; }
			.list .active:hover { color:#FFFFFF; background:#00caa0; font-weight:bold; cursor:auto; }
			.list span { padding:20px;font-size:18px; cursor:pointer; display:block; }
			.list span:hover { background:#c4c2c4; }
			.detail > div { display:none; }
		</style>
	`);

	$body.html(`
		<div id="wrap" class="container-fluid">
			<div class="row">
				<div class="col-md-12 banner" style="overflow:auto;background:#000;width:100%;">
					<a href="http://sia.tech" target="_blank" style="display:block;float:left;padding:10px;width:100px;height:100px;">
						<img src="`+extension_url+`img/icon128.png" alt="icon" width="100%"/>
					</a>
					<span class="version" style="color:#FFF;float:right;padding:90px 10px 10px 10px;"></span>
					<span style="color:#FFF;float:right;padding:90px 5px 5px 5px;">|</span>
					<a style="color:#FFF;float:right;padding:90px 10px 10px 10px;">当前块：<span class="currentblock"></span></a>
					<span style="color:#FFF;float:right;padding:90px 5px 5px 5px;">|</span>
					<a style="color:#FFF;float:right;padding:90px 10px 10px 10px;">高度：<span class="height"></span></a>
					<span style="color:#FFF;float:right;padding:90px 5px 5px 5px;">|</span>
					<a style="color:#FFF;float:right;padding:90px 10px 10px 10px;">状态：<span class="synced"></span></a>
				</div>
			</div>
			
			<div class="row">
				<div class="col-md-2 list" style="background:#d4d2d4;width:15%;height:100%;float:left;display:block;">
					<div data-action="overview"><span>概述</span></div>
					<div data-action="files"><span>文件</span></div>
					<div data-action="hosting"><span>主机</span></div>
					<div data-action="wallet"><span>钱包</span></div>
					<div data-action="explorer"><span>查询</span></div>
					<div data-action="command"><span>命令</span></div>
					<div data-action="about"><span>关于</span></div>
				</div>
				
				<div class="col-md-10 detail" style="background:#f1f3f6;width:85%;height:100%;float:left;display:block;">
					<div id="overview" class="row"><span>Overview</span></div>
					<div id="files" class="row"><span>Files</span></div>
					<div id="hosting" class="row"><span>Hosting</span></div>
					<div id="wallet" class="row"><span>Wallet</span></div>
					<div id="explorer" class="row"><span>Explorer</span></div>
					<div id="command" class="row">
						<div class="col" style="width:400px;height:100%;background:#e3e3e3;float:left;">
							<p style="padding:10px;">
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">类型：</label>
							<select id="apiType" style="height:21px;">
								<option>GET</option><option>POST</option>
							</select>
							</p>

							<p style="padding:10px;">
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">API ：</label>
							<input id="api" type="text" style="width:300px;" placeholder="/consensus" />
							
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">选择：</label>
							<select id="selectApi" style="height:21px; width:300px;">
								<option>API</option>
							</select>
							</p>

							<p style="padding:10px;">
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">DATA：</label>
							<textarea id="data" type="text" style="width:300px;height:100px;" placeholder="amount=123&destination=abcd"></textarea>
							</p>

							<p style="padding:10px;">
							<button data-action="commandExec">执行</button>
							</p>
						</div>
						
						<div class="col" style="padding:5px;float:left;height:100%;">
							<p style="padding:10px;">
							<textarea class="CmdResult" style="width:800px;height:500px;"></textarea>
							<button data-action="beautify" style="">格式化</button>
							</p>
						</div>
					</div>
					<div id="about" class="row"><span>About</span></div>				
				</div>
			</div>
		</div>
	`);
})();