'use strict';

var $head = $(document.head);
var $body = $(document.body);

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

(function(){
	function listInit($that) {
		$('.list a').removeClass('active');
		$that.find('a').addClass('active');

		var cls = $that.attr('data-action');
		$('.detail > div').hide();
		$('#'+cls).show();
	}

	/*
	 * Overview
	 */
	$body.on('click', '[data-action="overview"]', function(e){
		listInit( $(this) );
	});


	/*
	 * Files
	 */
	$body.on('click', '[data-action="files"]', function(e){
		listInit( $(this) );
	});


	/*
	 * Hosting
	 */
	$body.on('click', '[data-action="hosting"]', function(e){
		listInit( $(this) );
	});


	/*
	 * Wallet
	 */
	$body.on('click', '[data-action="wallet"]', function(e){
		listInit( $(this) );
	});

	$body.on('click', '[data-action="InitWallet"]', function(e){
		if ( !$('#InitWalletForm').length ) {
			$('.alert').remove();
			$('#WalletDetail').prepend(`
				<form id="InitWalletForm" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
					<div class="form-group">
						<label>设置新钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
						<label>再次输入密码：</label> <input type="password" class="form-control" placeholder="Password">
					</div>
					<button data-api="/wallet/init" type="button" class="btn btn-primary">确定</button>
				</form>
			`);
		} else {
			$('#InitWalletForm').remove();
		}
	});

	$body.on('click', '[data-action="unLockWallet"]', function(e){
		if ( !$('#unLockWallet').length ) {
			$('.alert').remove();
			$('#WalletDetail').prepend(`
				<form id="unLockWallet" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
					<div class="form-group">
						<label>输入钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
					</div>
					<button data-api="/wallet/unlock" type="button" class="btn btn-primary">确定</button>
				</form>
			`);
		} else {
			$('#unLockWallet').remove();
		}
	});

	$body.on('click', '[data-action="InputSeed"]', function(e){
		if ( !$('#InputSeed').length ) {
			$('.alert').remove();
			$('#WalletDetail').prepend(`
				<form id="InputSeed" role="alert" class="alert alert-warning alert-dismissible fade in form-inline">
					<div class="form-group">
						<label>输入钱包密码：</label> <input name="encryptionpassword" type="password" class="form-control" placeholder="Password">
						<label>输入 seed：</label> <input name="seed" type="text" class="form-control">
						<input name="dictionary" value="english" style="display:none;"/>
					</div>
					<button data-api="/wallet/seed" type="button" class="btn btn-primary">确定</button>
				</form>
			`);
		} else {
			$('#InputSeed').remove();
		}		
	});


	/*
	 * Explorer
	 */
	$body.on('click', '[data-action="explorer"]', function(e){
		listInit( $(this) );
	});


	/*
	 * Command
	 */
	$body.on('click', '[data-action="command"]', function(e){
		listInit( $(this) );
	});

	$body.on('click', '[data-action="commandExec"]', function(e){
		var apiType = $('#apiType').val();
		var api = $('#api').val() || $('#api').attr('placeholder') ;
		var data = $('#data').val();
		$('.CmdResult').val('');

		var selectApi = $('#selectApi').val();
		if (selectApi != 'API') {
			apiType = $('#selectApi').find('option:selected').attr('data-apiType');
			api = $('#selectApi').find('option:selected').attr('data-api');
		}

		$.ajax({
			type: apiType,
			url: api,
			data: data,
			success: function(result){
				var js_source_text;

				if (typeof(result) == 'object') { 
					js_source_text = JSON.stringify(result); 
				} else {
					js_source_text = result;
				}
				$('.CmdResult').val(js_source_text);
			},
			error: function(result){
				var js_source_text;

				if (typeof(result) == 'object') { 
					js_source_text = JSON.stringify(result); 
				} else {
					js_source_text = result;
				}

				$('.CmdResult').val(js_source_text);
			}
		});
	});

	$body.on('click', '[data-action="beautify"]', function(e){
		var js_source_text = $('.CmdResult').val();
		var output = js_beautify(js_source_text);

		$('.CmdResult').val(output);
	});


	/*
	 * About
	 */
	$body.on('click', '[data-action="about"]', function(e){
		listInit( $(this) );
	});

	function update(){
		$.get('/consensus', function(data){ 
			var obj = JSON.parse(data);
			if (obj.synced) { $('.synced').text('区块链同步完成') } else { $('.synced').text('正在同步区块链...'); }
			
			$('.height').text(obj.height);
			$('.currentblock').text(obj.currentblock);
		});

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

			$('.confirmedsiacoinbalance').text(obj.confirmedsiacoinbalance);
			$('.unconfirmedoutgoingsiacoins').text(obj.unconfirmedoutgoingsiacoins);
			$('.unconfirmedincomingsiacoins').text(obj.unconfirmedincomingsiacoins);
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

		setTimeout(update, 5*1000);
	}
	update();

	$.get('/daemon/version', function(data){ 
		var obj = JSON.parse(data);
		$('.version').text('v' + obj.version);
	});
})();



(function(){
	$body.on('click', '[data-api="/wallet/seed"]', function(e){
		var api = $(this).attr('data-api');
		var serial = $('#InputSeed').serialize();

		callSiaAPI('POST', api, serial, function(obj){
			console.log(obj);
			if (obj.Success == true) {
				showMsg('#WalletDetail', '已经导入 seed');
			} else {
				showMsg('#WalletDetail', obj.responseText);
			}
		});
	});

	$body.on('click', '[data-api="/wallet/lock"]', function(e){
		var api = $(this).attr('data-api');
		var serial = '';

		callSiaAPI('POST', api, serial, function(obj){
			console.log(obj);
			if (obj.Success == true) {
				showMsg('#WalletDetail', '钱包已锁');
			} else {
				showMsg('#WalletDetail', obj.responseText);
			}
		});
	});

	$body.on('click', '[data-api="/wallet/unlock"]', function(e){
		var api = $(this).attr('data-api');
		var serial = $('#unLockWallet').serialize();

		callSiaAPI('POST', api, serial, function(obj){
			console.log(obj);
			if (obj.Success == true) {
				showMsg('#WalletDetail', '钱包已解锁');
				$('#unLockWallet').remove();
			} else {
				showMsg('#WalletDetail', obj.responseText, '');
				$('#unLockWallet').remove();
			}
		});
	});

	$body.on('click', '[data-api="/wallet/init"]', function(e){
		var api = $(this).attr('data-api');
		var $input = $('#InitWalletForm').find('input');

		if ( $input.eq(0).val() && $input.eq(0).val() === $input.eq(1).val() ) {
			var serial = $('#InitWalletForm').serialize();
			callSiaAPI('POST', api, serial, function(obj){
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
	});
})();

