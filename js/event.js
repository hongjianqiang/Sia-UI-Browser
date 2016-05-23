'use strict';

(function(){
	var $head = $(document.head);
	var $body = $(document.body);

	function listInit($that) {
		$('.list span').removeClass('active');
		$that.find('span').addClass('active');

		var cls = $that.attr('data-action');
		$('.detail > div').hide();
		$('#'+cls).show();
	}

	$body.on('click', '[data-action="overview"]', function(e){
		listInit( $(this) );
	});


	$body.on('click', '[data-action="files"]', function(e){
		listInit( $(this) );
	});


	$body.on('click', '[data-action="hosting"]', function(e){
		listInit( $(this) );
	});


	$body.on('click', '[data-action="wallet"]', function(e){
		listInit( $(this) );
	});


	$body.on('click', '[data-action="explorer"]', function(e){
		listInit( $(this) );
	});


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


	$body.on('click', '[data-action="about"]', function(e){
		listInit( $(this) );
	});


	$body.on('click', '[data-action="beautify"]', function(e){
		var js_source_text = $('.CmdResult').val();
		var output = js_beautify(js_source_text);

		$('.CmdResult').val(output);
	});


	function update(){
		$.get('/consensus', function(data){ 
			var obj = JSON.parse(data);
			if (obj.synced) { $('.synced').text('区块链同步完成') } else { $('.synced').text('正在同步区块链...'); }
			
			$('.height').text(obj.height);
			$('.currentblock').text(obj.currentblock);
		});

		setTimeout(update, 5*1000);
	}
	update();

	$.get('/daemon/version', function(data){ 
		var obj = JSON.parse(data);
		$('.version').text('v' + obj.version);
	});
})();

