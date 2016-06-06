'use strict';

(function(){
	function watch(value, func){
		if ( ROUTER == value && ROUTER != NOW_ROUTER ) {
			NOW_ROUTER = ROUTER;
			func();
		}
		setTimeout(watch, 200, value, func);
	}

	watch('/overview', insertHTML);

	function insertHTML(){
		$('#detail').html(`
			<div id="overview" class="row">
				<span>Overview</span>
			</div>
		`);
	}
})();

