'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/files', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<style>
				#files .info { padding:10px;background:#545454; }
				#files .info > div span { padding:10px; display:block; float:left; border:1px #00CBA0 solid; color:#FFF; }
				#files .btn-group { padding:5px;}
			</style>

			<div id="files" class="row">
				<div class="col-md-12 info">
					<div class="col-md-4">
						<span>活动主机：<samp class="activehosts"></samp></span>
						<span>存储价格：<samp class="storageprice"></samp> S/GB/block</span>
					</div>
					<div class="col-md-8">
						<div class="btn-group btn-toolbar" role="group" aria-label="group">
							<button data-action="CreateDir" type="button" class="btn btn-default">新建文件夹</button>
							<button data-action="uploadFile" type="button" class="btn btn-default">上传文件</button>
							<button data-action="uploadDir" type="button" class="btn btn-default">上传文件夹</button>
							<button data-action="AddSiaFile" type="button" class="btn btn-default">添加 .Sia 文件</button>
							<button data-action="AddAsciiFile" type="button" class="btn btn-default">添加 ASCII 文件</button>
						</div>
					</div>
				</div>

				<div id="FilesDetail" class="col-md-12">
					<div class="row">
						<h1>文件列表</h1>
						<div class="table-responsive" style="height:30%;">
							<table class="table table-striped table-hover AddrTable">
								<thead>
									<tr>
									<th>文件名</th>
									<th>文件大小</th>
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
		'uploadFile' : function($that){
			if ( !$('#uploadFile').length ) {
				$('.alert').remove();
				$('#FilesDetail').prepend(`
					<form id="uploadFile" role="alert" class="alert alert-warning alert-dismissible fade in form-inline" enctype="multipart/form-data">
						<div class="form-group">
							<label>上传到：</label> <input id="siapath" type="text" class="form-control" placeholder="music">
							<label>选择本地文件：</label> <input name="source" type="text" class="form-control" placeholder="">
						</div>
						<button data-api="/renter/upload/" type="button" class="btn btn-primary" data-keyboard="enter">确定</button>
					</form>
				`);

			} else {
				$('#uploadFile').remove();
			}
		}
	};

	$BODY.on('click', '#files [data-action]', function(){
		var ActionName = $(this).attr('data-action');
		var Do = ActionLists[ActionName];
		if (typeof(Do) == 'function') { Do($(this)); }
	});
})();

(function(){
	var ApiLists = {
		'/renter/upload/' : function($that, param){
			var type = 'POST';
			var r = {};
			if (param == 'help') { r.Type = type; return r; }

			var api = $that.attr('data-api');
			var siapath = api + $('#siapath').val();
			var serial = $('#uploadFile').serialize();

			//alert(serial);
			callSiaAPI(type, siapath, serial, function(obj){
				console.log(obj);
			});
		}
	};

	$BODY.on('click', '#files [data-api]', function(){
		var ApiName = $(this).attr('data-api');
		var Call = ApiLists[ApiName];
		if (typeof(Call) == 'function') { Call($(this)); }
	});

	objMerger(SiaAPIs, ApiLists);
})();


(function(){
	function flush(){
		if ( isActiveUI && $('#files').length > 0 ) {

			$.get('/renter/hosts/active', function(data){
				var obj = JSON.parse(data);

				var len = obj.hosts.length;
				$('.activehosts').text(len);

				var sum = 0;
				for (var i = 0; i < len; i++) {
					sum = sum + parseFloat( obj.hosts[i].storageprice );
				}

				var average = 0;
				average = (sum/len) * 1024 * 1024 * 1024 * 10e-24 ;
				$('.storageprice').text(average.toFixed(4));
			});
		}

		setTimeout(flush, 10*1000);
	}

	flush();
})();