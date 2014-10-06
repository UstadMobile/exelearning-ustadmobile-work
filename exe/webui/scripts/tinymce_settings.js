/*
 * TinyMCE4 Settings for eXe.  Uses inline editing mode, places the
 * toolbar in #externalToolbarHolder at the top of the page.
 */

tinymce.init({
	// General options
	selector: "div.mceEditor",	
	convert_urls : false,
	inline: true,
	fixed_toolbar_container: "#externalToolbarHolder",
	menubar: false,
    file_browser_callback : exe_tinymce.chooseImage,
    plugins: [
	      "advlist autolink lists link image charmap print preview anchor",
	      "searchreplace visualblocks code fullscreen",
	      "insertdatetime media table contextmenu paste textcolor"
	  ],
    toolbar: "undo redo | styleselect | fontselect | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | forecolor backcolor "
});

$(function() {
	//Set the the height of the external toolbar holder to be fixed
	if($("div.mceEditor").length > 0) {
		$("#externalToolbarHolder").css("height", "36px").addClass("mce-panel");
		$("#main").css("margin-top", "32px");
	}
});
