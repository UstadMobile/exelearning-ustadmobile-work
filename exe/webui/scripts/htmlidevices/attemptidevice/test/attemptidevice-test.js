/**
 * 
 */
QUnit.test( "Widget Creation", function( assert ) {
	AttemptIdeviceTests.testEditor(assert, "#test_attempt_device");
});


var AttemptIdeviceTests;

AttemptIdeviceTests = function() {
	
};

AttemptIdeviceTests.testEditor = function(assert, selector) {
	$(selector).attemptidevice({editable : true});
	assert.ok(
		$(selector).next().hasClass("attemptidevice_editor"),
		"Found editor div");
	var persistHTML = $(selector).attemptidevice("idevicehtml");
	assert.ok(persistHTML, "Persist HTML returned");
	
	
	
}
