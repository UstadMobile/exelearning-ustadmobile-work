/**
 * Test a MultiChoiceIdevice 
 */
function testMultichoiceIdevice(deviceId) {
	QUnit.test("MultiChoiceIdevice:" + deviceId, function(assert){
		assert.ok($("#" + deviceId + " INPUT").length > 0,
				"input options present");
	});
}