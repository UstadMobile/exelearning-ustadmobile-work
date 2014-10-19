/*
 * TinyMCE4 Settings for eXe.  Uses inline editing mode, places the
 * toolbar in #externalToolbarHolder at the top of the page.
 * 
 * To make the bundle from TinyMCE source code:
 * 
 * grunt bundle --themes modern --plugins advlist,autolink,lists,link,image,charmap,print,preview,anchor,searchreplace,visualblocks,code,fullscreen,insertdatetime,media,table,contextmenu,paste,textcolor
 * 
 * Built from TinyMCE from:
 * https://github.com/UstadMobile/tinymce
 * 
 * Forked to add support for Autoplay and Controls in HTML Media 
 * 
 */

tinymce.init({
	// General options
	selector: "div.mceEditor",	
	convert_urls : false,
	inline: true,
	fixed_toolbar_container: "#externalToolbarHolder",
	menubar: false,
    file_browser_callback : exe_tinymce.chooseImage,
    //see plugin note above if changing
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