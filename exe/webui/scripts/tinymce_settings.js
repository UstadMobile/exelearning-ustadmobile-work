/*
 * TinyMCE4 Settings for eXe.  Uses inline editing mode, places the
 * toolbar in #externalToolbarHolder at the top of the page.
 * 
 * To make the bundle from TinyMCE source code:
 * 
 * grunt --force
 * grunt bundle --themes modern --plugins advlist,autolink,lists,link,image,charmap,print,preview,anchor,searchreplace,visualblocks,code,fullscreen,insertdatetime,media,table,contextmenu,paste,textcolor
 * 
 * Built from TinyMCE from:
 * https://github.com/UstadMobile/tinymce
 * 
 * Forked to add support for Autoplay and Controls in HTML Media 
 * 
 */
var tinymceLinkListURL = document.location.href.substring(0,
		document.location.href.lastIndexOf('/')+1)
		+ "authoring_linklist";

tinymce.init({
	// General options
	selector: "div.mceEditor",	
	convert_urls : false,
	inline: true,
	fixed_toolbar_container: "#externalToolbarHolder",
	menubar: false,
    file_browser_callback : exe_tinymce.chooseImage,
    entity_encoding: 'raw',
    //see plugin note above if changing
    plugins: [
	      "advlist autolink lists link image charmap print preview anchor",
	      "searchreplace visualblocks code fullscreen",
	      "insertdatetime media table contextmenu paste textcolor",
	      "directionality"
	  ],
    toolbar: "undo redo | styleselect | fontselect | fontsizeselect | bold italic underline | ltr rtl | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | forecolor backcolor ",
    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 60pt 72pt 88pt 100pt 112pt 124pt",
    setup: function(ed) {
		ed.on("init", function(e) {
			EXEAuthoringDefaultPrompts.setupTinyMCEEditor(ed);
		});
	},
	link_list: tinymceLinkListURL,
	link_list_label: "Link to page"
});

$(function() {
	//Set the the height of the external toolbar holder to be fixed
	if($("div.mceEditor").length > 0) {
		$("#externalToolbarHolder").css("height", "36px").addClass("mce-panel");
		$("#main").css("margin-top", "32px");
	}
});
