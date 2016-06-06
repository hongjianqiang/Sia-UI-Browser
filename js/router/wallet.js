'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/wallet', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<style>
				#wallet .info { padding:10px;background:#545454; }
				#wallet .info > div span { padding:10px; display:block; float:left; border:1px #00CBA0 solid; color:#FFF; }
				#wallet .btn-group { padding:5px;}
			</style>
			
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
							<button data-action="InitWallet" type="button" class="btn btn-default">新建钱包</button>
							<button data-action="unLockWallet" type="button" class="btn btn-default">解锁钱包</button>
							<button data-api="/wallet/lock" type="button" class="btn btn-default">加锁钱包</button>
							<button data-action="InputSeed" type="button" class="btn btn-default">导入Seed</button>
							<button data-action="Sendsc" type="button" class="btn btn-default">转账</button>
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
									<th>方向</th>
									<th>TxID</th>
									<th>数量</th>
									<th>时间</th>
									<th>细节</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		`);
	}
})();


(function(){
	var ActionLists = {
		'InitWallet' : function($that){
			if ( !$('#InitWalletForm').length ) {
				$('.alert').remove();
				$('#WalletDetail').prepend(`
					<form id="InitWalletForm" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
						<div class="form-group">
							<label>设置新钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
							<label>再次输入密码：</label> <input type="password" class="form-control" placeholder="Password">
						</div>
						<button data-api="/wallet/init" type="button" class="btn btn-primary" data-keyboard="enter">确定</button>
					</form>
				`);

			} else {
				$('#InitWalletForm').remove();
			}
		},

		'unLockWallet' : function($that){
			if ( !$('#unLockWallet').length ) {
				$('.alert').remove();
				$('#WalletDetail').prepend(`
					<form id="unLockWallet" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
						<div class="form-group">
							<label>输入钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
							<input style="display:none;"/>
						</div>
						<button data-api="/wallet/unlock" type="button" class="btn btn-primary" data-keyboard="enter">确定</button>
					</form>
				`);
			} else {
				$('#unLockWallet').remove();
			}
		},

		'InputSeed' : function($that){
			if ( !$('#InputSeed').length ) {
				$('.alert').remove();
				$('#WalletDetail').prepend(`
					<form id="InputSeed" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
						<div class="form-group">
							<label>输入钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
							<label>输入 seed：</label> <input name="seed" type="text" class="form-control">
							<input name="dictionary" value="english" style="display:none;"/>
						</div>
						<button data-api="/wallet/seed" type="button" class="btn btn-primary" data-keyboard="enter">确定</button>
					</form>
				`);
			} else {
				$('#InputSeed').remove();
			}	
		},

		'Sendsc' : function($that){
			if ( !$('#Sendsc').length ) {
				$('.alert').remove();
				$('#WalletDetail').prepend(`
					<form id="Sendsc" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
						<div class="form-group">
							<label>转账数量(单位：S)：</label> <input name="amount" type="text" class="form-control">
							<label>对方地址：</label> <input name="destination" type="text" class="form-control" style="width:600px;">
						</div>
						<button data-api="/wallet/siacoins" type="button" class="btn btn-primary" data-keyboard="enter">确定</button>
					</form>
				`);				
			} else {
				$('#Sendsc').remove();
			}	
		}
	};

	$BODY.on('click', '#wallet [data-action]', function(){
		var ActionName = $(this).attr('data-action');
		var Do = ActionLists[ActionName];
		if (typeof(Do) == 'function') { Do($(this)); }
	});
})();


(function(){
	var ApiLists = {
		'/wallet/init' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var $input = $('#InitWalletForm').find('input');

			if ( $input.eq(0).val() && $input.eq(0).val() === $input.eq(1).val() ) {
				var serial = $('#InitWalletForm').serialize();
				callSiaAPI(type, api, serial, function(obj){
					console.log(obj);
					if (obj.primaryseed) {
						$('#InitWalletForm').after(`
							<div role="alert" class="alert alert-danger alert-dismissible fade in">
								<h4>钱包新建成功！请把以下单词保存好，不要泄露给任何人，用于忘记钱包密码时恢复（seed）</h4>
								<p><strong>` + obj.primaryseed + `</strong></p>
								<p><button class="btn btn-danger" type="button" data-dismiss="alert">是的，我已经保存好了</button></p>
							</div>
						`);

						$('#InitWalletForm').remove();	

					} else {
						showMsg('#WalletDetail', '钱包已经存在！');

						$('#InitWalletForm').remove();				
					}
				});

			} else {
				$('#InitWalletForm').append('<em>两次输入密码不一致，且密码不能为空。</em>');
				setTimeout(function(){
					$('#InitWalletForm').find('em').fadeOut('slow');
				}, 2*1000);

			}
		},

		'/wallet/lock' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var serial = '';

			callSiaAPI(type, api, serial, function(obj){
				console.log(obj);
				if (obj.Success == true) {
					showMsg('#WalletDetail', '钱包已锁');
				} else {
					showMsg('#WalletDetail', obj.responseText);
				}
			});

			console.log($that);
		},

		'/wallet/unlock' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var serial = $('#unLockWallet').serialize();

			callSiaAPI(type, api, serial, function(obj){
				console.log(obj);
				if (obj.Success === true) {
					showMsg('#WalletDetail', '钱包已解锁');
				} else {
					showMsg('#WalletDetail', obj.responseText, '');
				}
			});

			$('#unLockWallet').remove();			
		},

		'/wallet/seed' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var serial = $('#InputSeed').serialize();

			callSiaAPI(type, api, serial, function(obj){
				console.log(obj);
				if (obj.Success == true) {
					showMsg('#WalletDetail', '已经导入 seed');
				} else {
					showMsg('#WalletDetail', obj.responseText);
				}
			});			
		},

		'/wallet/siacoins' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var serial = $('#Sendsc').serialize();
			
			if(confirm("请核对好数量和地址后，然后确认发送")){
				alert(serial);
			}
		}
	};

	$BODY.on('click', '#wallet [data-api]', function(){
		var ApiName = $(this).attr('data-api');
		var Call = ApiLists[ApiName];
		if (typeof(Call) == 'function') { Call($(this)); }
	});

	objMerger(SiaAPIs, ApiLists);
})();


(function(){
	function flush(){
		if ( isActiveUI && $('#wallet').length > 0 ) {

			$.get('/wallet', function(data){
				var obj = JSON.parse(data);
				if (obj.unlocked) { 
					$('.unlocked').text('解锁');
					$('[data-action="unLockWallet"]').hide();
					$('[data-api="/wallet/lock"]').show();

				} else { 
					$('.unlocked').text('加锁');
					$('[data-api="/wallet/lock"]').hide();
					$('[data-action="unLockWallet"]').show();

				}

				var confirmedsiacoinbalance = delSuffixes(obj.confirmedsiacoinbalance);
				var unconfirmedoutgoingsiacoins = delSuffixes(obj.unconfirmedoutgoingsiacoins);
				var unconfirmedincomingsiacoins = delSuffixes(obj.unconfirmedincomingsiacoins);

				$('.confirmedsiacoinbalance').text(confirmedsiacoinbalance);
				$('.unconfirmedoutgoingsiacoins').text(unconfirmedoutgoingsiacoins);
				$('.unconfirmedincomingsiacoins').text(unconfirmedincomingsiacoins);
			});

			$.get('/wallet/addresses', function(data){
				var obj = JSON.parse(data);
				var len = obj.addresses.length;
				var $AddrTable = $('.AddrTable');

				if (  $AddrTable.find('tbody').find('tr').length != len ) {
					$AddrTable.find('tbody').html('');

					for (var i = 0; i < len; i++) {
						$AddrTable.find('tbody').append(`
							<tr>
							<th scope="row">` + (i+1) + `</th>
							<td>` + obj.addresses[i] + `</td>
							<td><a target="_blank" href="https://explore.sia.tech/hash.html?hash=` + obj.addresses[i] + `">
								<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
							</a></td>
							</tr>
						`);
					}				
				}
			});
		}

		setTimeout(flush, 1000);
	}

	flush();
})();

(function(){
	var height = 1;

	function flush(){
		if ( isActiveUI && $('#wallet').length > 0 &&  height < $('samp.height').text() ) {
			height = $('samp.height').text();

			var $TxTable = $('.TxTable');
			$TxTable.find('tbody').html('');

			$.get('/wallet/transactions?startheight=1&endheight='+height, function(data){
				var obj = JSON.parse(data);
				var transactions = obj.confirmedtransactions;

				for (var k in transactions) {
					var iSum = InputSum( transactions[k].inputs );
					var oSum = OutputSum( transactions[k].outputs );
					var result = iSum + oSum;
					var v = '';
					if (result < 0) { v = 'glyphicon-log-out'; } else { v = 'glyphicon-log-in'; }

					var r = delSuffixes( ScientificToNum( result ) ); // delSuffixes(result);
					var time = TimestampToDate( transactions[k].confirmationtimestamp * 1000 );

					if (result) {
						$TxTable.find('tbody').prepend(`
							<tr>
							<th><span class="glyphicon ` + v + `" aria-hidden="true"></span></th>
							<td>` + transactions[k].transactionid + `</td>
							<td>` + r + ` S</td>
							<td>` + time + `</td>
							<td><a target="_blank" href="https://explore.sia.tech/hash.html?hash=` + transactions[k].transactionid + `">
								<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
							</a></td>
							</tr>
						`);
					}
				}
			});
		}

		setTimeout(flush, 10*1000);
	}

	flush();

	function InputSum(arr){
		var sum = 0;

		for (var i in arr) {
			if ( !arr[i].walletaddress ) {
				// sum = sum + parseFloat( arr[i].value );
				sum = FloatAdd( sum, arr[i].value );
			}
		}

		return parseFloat(sum);
	}

	function OutputSum(arr){
		var sum = 0;

		for (var i in arr) {
			if ( !arr[i].walletaddress ) {
				// sum = sum - parseFloat( arr[i].value );
				sum = FloatSub( sum, arr[i].value );
			}
		}

		return parseFloat(sum);
	}
})();