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
		
		var defaultText = $(this).attr("data-defaulttext");
		if(typeof defaultText !== 'undefined' && $(this).val() == "") {
			$(this).val(defaultText);
		}
		
		if(!$(this).hasClass("mceEditor")) {
			if($(this).val() == "") {
				var overlayDiv = makeOverlayDiv($(this).attr("id"), 
						800, 2, 6, $(this).attr("data-defaultprompt"),
						"left");
				$(this).before(overlayDiv);
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
function hideDefaultPromptOverlay(edId) {
	 $("#" + edId + "_defaultprompt").css("display", "none");
	 $("#" + edId).removeClass("defaultpromptactive");
	 var nodeNameStr = new String(document.getElementById(edId).nodeName);
	 if(nodeNameStr.toLowerCase() == 'input') {
		 $("#" + edId).focus();
	 }
}

/**
 * 
 * @param elId id of the input element we are working with
 * @param width width of overlay
 * @param marginTop top margin
 * @param marginLeft left margin
 * @param defaultPrompt Text to show until clicked
 * @param textAlign Alignment (eg center)
 * @returns {String}
 */
function makeOverlayDiv(elId,  width, marginTop, marginLeft, defaultPrompt, textAlign) {
	var retVal = "<div id='" + elId + "_defaultprompt' "
	+ " class='default_prompt_mceoverlay' "
	+ " onclick='hideDefaultPromptOverlay(\"" + elId + "\")' "
	+ "style='z-index: 10; position: absolute; width: 900px; "
	+ "text-align: " + textAlign + "; margin-top : " + marginTop + "px; "
	+ "margin-left: " + marginLeft + "px'>"
	+ defaultPrompt + "</div>"
	return retVal;
}
