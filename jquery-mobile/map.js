// JavaScript Document

$(document).ready(function(e) {
	

	$('#test').append(' From Jquery');

});


// JavaScript // JavaScript Document
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    $('#test').append(' PG - Devide ready');
}
