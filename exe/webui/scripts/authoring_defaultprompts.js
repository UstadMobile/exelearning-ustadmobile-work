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

