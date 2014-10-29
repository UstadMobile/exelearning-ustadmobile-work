/**
 * Initialization function 
 */
$(function() {
    setupTextPrompts();
});

var EXEAuthoringDefaultPrompts;


EXEAuthoringDefaultPrompts = {
		
	/**
	 * Attach the default prompt to a TinyMCE Editor instance
	 * 
	 * @param ed TinyMCE_Editor The TinyMCE editor object to work with
	 */
	setupTinyMCEEditor: function(ed) {
		if($("#"+ed.id).hasClass("defaultprompt")) {
			var defaultPrompt = $("#"+ed.id).attr('data-defaultprompt');
			var heightSet = "70";//eXe's default
			heightSet = parseInt($("#"+ed.id).height());
			var margin = Math.round(heightSet/2)-10;
			var width = 700;//default
			var textAreaWidth = $("#" + ed.id).width();
			if(textAreaWidth) {
				width = parseInt(textAreaWidth);
			}
			
			var overLayDivHTML =  makeOverlayDiv(ed.id, width, margin, 0, 
					defaultPrompt, "center");
			$('#' + ed.id).before(overLayDivHTML);
			checkMceEditorDefaultOverlay(ed);
			
			//attach an event handler to add/remove prompt
			ed.on("keyup", function() {
				checkMceEditorDefaultOverlay(ed);
			});
		}
	}
};


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
			var overlayDiv = makeOverlayDiv($(this).attr("id"), 
					800, 2, 6, $(this).attr("data-defaultprompt"),
					"left");
			$(this).before(overlayDiv);
			$(this).addClass("defaultpromptactive");
			if($(this).val() != "") {
				hideDefaultPromptOverlay($(this).attr("id"));
			}
			
		}
		var thisInputEl = this;
		$(this).on("keyup", function() {
			checkDefaultPromptShow($(thisInputEl).attr("id"))
		});
	});
}

/*
 * For text input fields- check if the prompt should be shown
 */
function checkDefaultPromptShow(elId) {
	var el = $("#" + elId);
	var contentVal = el.val();
	if(el.val() == "" && !el.hasClass("defaultpromptactive")){
		showDefaultPromptOverlay(elId);
	}else if(el.val() != "" && el.hasClass("defaultpromptactive")) {
		hideDefaultPromptOverlay(elId);
	}
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

/*
 * Show the prompt element
 * @param elId - the Element id we are talking about
 */
function showDefaultPromptOverlay(elId) {
	$("#" + elId + "_defaultprompt").css("display", "block");
	 $("#" + elId).addClass("defaultpromptactive");
}

/*
 * Here to focus the input text field when the prompt is clicked on
 * @param elId - ID of the text element to focus
 */
function focusInputField(elId) {
	el = $("#" + elId);
	if(!el.hasClass("mceEditor")) {
		el.focus();
	}else {
		tinyMCE.get(elId).focus();
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
	+ " onclick='focusInputField(\"" + elId + "\")' "
	+ "style='z-index: 10; position: absolute; width: " + width + "px; "
	+ "text-align: " + textAlign + "; margin-top : " + marginTop + "px; "
	+ "margin-left: " + marginLeft + "px'>"
	+ defaultPrompt + "</div>"
	return retVal;
}

function checkMceEditorDefaultOverlay(ed) {
	var textArea = $("#" + ed.id);
    var promptActive =textArea.hasClass("defaultpromptactive"); 
    var areaContent = ed.getContent({format : 'raw'});
    var contentIsBlank = false;
    if(areaContent.length < 50) {
    	var areaContentText =areaContent.replace(/<(?:.|\n)*?>/gm, ''); 
   		
   	 	var hasMedia = false;
   	 	var mediaTags = ["img", "audio", "video", "object"];
   	 	var areaContentLower = areaContent.toLowerCase();
   	 	for(mediaTagName in mediaTags) {
   	 		if(areaContentLower.indexOf("<" + mediaTagName) != -1) {
   	 			hasMedia = true;
   	 			break;
   	 		}
   	 	}
   	 	if(hasMedia == false && areaContentText == "") {
   	 		contentIsBlank=true;
   	 	}
    }
    
	if(!contentIsBlank && promptActive) {
		 hideDefaultPromptOverlay(ed.id);
	}else if(contentIsBlank && !promptActive) {
		 showDefaultPromptOverlay(ed.id);
	} 

}

