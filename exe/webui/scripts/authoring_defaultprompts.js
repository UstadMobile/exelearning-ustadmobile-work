/**
 * 
 */
$(function() {
    setupTextPrompts();
});

/*
 * Function to manage  
 */
function setupTextPrompts() {
	$(".defaultprompt").each(function() {
		if(!$(this).hasClass("mceEditor")) {
			if($(this).val() == "") {
				$(this).val($(this).attr("data-defaultprompt"));
			}
		}
		
		$(this).on("focus", function() {
			if($(this).val() == $(this).attr("data-defaultprompt")) {
				$(this).val("");
			}
		});
	});
}

/*
 * Hide the overlay for a tinyMCE field based on the id
 */
function hideTinyMCEOverlay(edId) {
	$("#" + edId + "_defaultprompt").css("display", "none");
	 textArea.removeClass("defaultpromptactive");
}