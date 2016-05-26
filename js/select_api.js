'use strict';

/*
 * v0.6.0 API
 */

 (function(){
	var $head = $(document.head);
	var $body = $(document.body);

	$('#selectApi').append(`
		<option data-aipType="GET" data-api="/daemon/constants">/daemon/constants [GET]</option>
		<option data-aipType="GET" data-api="/daemon/stop">/daemon/stop [GET]</option>
		<option data-aipType="GET" data-api="/daemon/version">/daemon/version [GET]</option>
		<option data-aipType="GET" data-api="/wallet">/wallet [GET]</option>
	`);
 })();