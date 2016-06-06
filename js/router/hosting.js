'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/hosting', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<div id="hosting" class="row">
				<span>Hosting</span>
			</div>
		`);
	}
})();

