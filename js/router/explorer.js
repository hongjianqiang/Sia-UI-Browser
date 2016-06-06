'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/explorer', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<div id="explorer" class="row">
				<span>Explorer</span>
			</div>
		`);
	}
})();

