'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/command', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<style>
				#command .col-md-4 { height:100%;background:#e3e3e3; }
				#command .col-md-8 { padding:5px;height:100%; }

				#command p { padding:10px; }
				#command label { font-weight:bold; display:inline-block; height:21px; font-size:14px; width:50px; }
			</style>

			<div id="command" class="row">
				<div class="col-md-4">
					<p>
					<label>类型：</label>
					<select id="apiType" style="height:21px;">
						<option>GET</option><option>POST</option>
					</select>
					</p>

					<p>
					<label>API ：</label>
					<input id="api" type="text" style="width:300px;" placeholder="/consensus" />
					</p>
					
					<p>
					<label>选择：</label>
					<select id="selectApi" style="height:21px; width:300px;">
						<option>API</option>
					</select>
					</p>

					<p>
					<label>DATA：</label>
					<textarea id="data" type="text" style="width:300px;height:100px;" placeholder="amount=123&destination=abcd"></textarea>
					</p>

					<p>
					<button data-action="commandExec">执行</button>
					</p>
				</div>
				
				<div class="col-md-8">
					<p>
					<textarea class="CmdResult" style="width:100%;height:500px;"></textarea>
					</p>
					<p>
					<button data-action="beautify" style="">格式化</button>
					</p>
				</div>
			</div>
		`);

		for(var key in SiaAPIs){
			var Call = SiaAPIs[key];
			if (typeof(Call) == 'function') { 
				var api = Call('', 'help');
				$('#selectApi').append(`<option data-apitype="`+api.Type+`" data-api="`+key+`">`+key+` [`+api.Type+`]</option>`);
			}
		}
	}
})();


(function(){
	var ActionLists = {
		'commandExec' : function($that){
			var apiType = $('#apiType').val();
			var api = $('#api').val() || $('#api').attr('placeholder') ;
			var data = $('#data').val();
			$('.CmdResult').val('');

			var selectApi = $('#selectApi').val();
			if (selectApi != 'API') {
				apiType = $('#selectApi').find('option:selected').attr('data-apitype');
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
		},
		'beautify' : function($that){
			var js_source_text = $('.CmdResult').val();
			var output = js_beautify(js_source_text);

			$('.CmdResult').val(output);
		}
	};

	$BODY.on('click', '#command [data-action]', function(){
		var ActionName = $(this).attr('data-action');
		var Do = ActionLists[ActionName];
		if (typeof(Do) == 'function') { Do($(this)); }
	});
})();