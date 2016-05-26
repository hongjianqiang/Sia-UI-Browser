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
		<link href="`+extension_url+`css/bootstrap.css" rel="stylesheet">
		<style>
			body { margin:0; }
			
			.banner { background:#000; }

			.baseInfo { background:#000; }
			.baseInfo div { color:#FFF; }
			.baseInfo div a { color:#FFF; }

			.list .active { color:#FFFFFF; background:#00caa0; font-weight:bold; }
			.list .active:hover { color:#FFF; background:#00caa0; font-weight:bold; cursor:auto; }
			.list a { color:#000; padding:20px;font-size:18px; cursor:pointer; display:block; text-decoration:none; }
			.list a span { padding-right:5px; }
			.list a:hover { background:#c4c2c4; }

			.detail { background:#f1f3f6;height:100%; }
			.detail > div { display:none; }

			.detail #wallet .info { padding:10px;background:#545454; }
			.detail #wallet .info > div span { padding:10px; display:block; float:left; border:1px #00CBA0 solid; color:#FFF; }
			.detail #wallet .btn-group { padding:5px;}
		</style>
	`);

	$body.html(`
		<div id="wrapper" class="container-fluid">
			<div class="row banner">
				<div class="col-md-12">
					<a href="http://sia.tech" target="_blank">
						<img src="`+extension_url+`img/icon128.png" alt="icon" width="100"/>
					</a>
				</div>
			</div>

			<div class="row baseInfo">
				<div class="col-md-3"></div>
				<div class="col-md-9">
					<div class="col-md-2" style="width:200px;">状态：<samp class="synced"></samp></div>
					<div class="col-md-2" style="width:120px;">高度：<samp class="height"></samp></div>
					<div class="col-md-6" style="width:600px;"><a>当前块：<samp class="currentblock"></samp></a></div>	
					<div class="col-md-2" style="width:150px;">版本：<samp class="version" ></samp></div>					
				</div>
			</div>
			
			<div class="row">
				<div class="col-md-2 list" style="background:#d4d2d4;height:100%;padding:0;">
					<div data-action="overview"><a><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>概述</a></div>
					<div data-action="files"><a><span class="glyphicon glyphicon-file" aria-hidden="true"></span>文件</a></div>
					<div data-action="hosting"><a><span class="glyphicon glyphicon-hdd" aria-hidden="true"></span>主机</a></div>
					<div data-action="wallet"><a><span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span>钱包</a></div>
					<div data-action="explorer"><a><span class="glyphicon glyphicon-search" aria-hidden="true"></span>查询</a></div>
					<div data-action="command"><a><span class="glyphicon glyphicon-console" aria-hidden="true"></span>命令</a></div>
					<div data-action="about"><a><span class="glyphicon glyphicon-user" aria-hidden="true"></span>关于</a></div>
				</div>
				
				<div class="col-md-10 detail">
					<div id="overview" class="row"><span>Overview</span></div>
					<div id="files" class="row"><span>Files</span></div>
					<div id="hosting" class="row"><span>Hosting</span></div>
					<div id="wallet" class="row">
						<div class="col-md-12 info">
							<div class="col-md-6">
								<span>余额：<samp class="confirmedsiacoinbalance"></samp> S</span>
								<span>未确认收入：<samp class="unconfirmedincomingsiacoins"></samp> S</span>
								<span>未确认支出：<samp class="unconfirmedoutgoingsiacoins"></samp> S</span>
								<span>钱包状态：<samp class="unlocked"></samp></span>
							</div>
							<div class="col-md-6">
								<div class="btn-group btn-toolbar" role="group" aria-label="group">
									<!--
									<button data-api="/wallet/siagkey" type="button" class="btn btn-default">导入 Siag Key</button>
									-->
									<button data-action="InitWallet" type="button" class="btn btn-default">新建钱包</button>
									<button data-action="unLockWallet" type="button" class="btn btn-default">解锁钱包</button>
									<button data-api="/wallet/lock" type="button" class="btn btn-default">加锁钱包</button>
									<button data-action="InputSeed" type="button" class="btn btn-default">导入 Seed</button>
									<!--
									<button data-api="/wallet/033x" type="button" class="btn btn-default">导入 Legacy 钱包</button>
									-->
								</div>
							</div>
						</div>
						<div id="WalletDetail" class="col-md-12">
							<div class="row">
								<h1>钱包地址</h1>
								<div class="table-responsive" style="height:30%;">
									<table class="table table-striped table-hover AddrTable">
										<thead>
											<tr>
											<th>序号</th>
											<th>地址</th>
											<th>细节</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
							<div class="row">
								<h1>交易细节</h1>
								<div class="table-responsive" style="height:30%;">
									<table class="table table-striped table-hover TxTable">
										<thead>
											<tr>
											<th>TxID</th>
											<th>地址</th>
											<th>数量</th>
											<th>收入/支出</th>
											</tr>
										</thead>
										<tbody>
											<tr>
											<th>TxID</th>
											<td>地址</td>
											<td>数量</td>
											<td>收入/支出</td>
											</tr>
											<tr>
											<th>TxID</th>
											<td>地址</td>
											<td>数量</td>
											<td>收入/支出</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div id="explorer" class="row"><span>Explorer</span></div>
					<div id="command" class="row">
						<div class="col-md-4" style="height:100%;background:#e3e3e3;">
							<p style="padding:10px;">
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">类型：</label>
							<select id="apiType" style="height:21px;">
								<option>GET</option><option>POST</option>
							</select>
							</p>

							<p style="padding:10px;">
							<label style="font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px;">API ：</label>
							<input id="api" type="text" style="width:300px;" placeholder="/consensus" />
							</p>
							
							<p style="padding:10px;">
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
						
						<div class="col-md-8" style="padding:5px;height:100%;">
							<p style="padding:10px;">
							<textarea class="CmdResult" style="width:100%;height:500px;"></textarea>
							</p>

							<p style="padding:10px;">
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