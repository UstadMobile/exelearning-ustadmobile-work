/**
 * Utility to run a simulation of what the interaction is like in a 
 * feature phone using the UstadJS MicroEmu.
 */

var $UstadMicro = {
    
	opfLocation : "",
	
		
    init: function() {
    	
    	//the default location
    	var queryArgs = $UstadMicro.getQueryVariables();
    	
    	$UstadMicro.opfLocation = queryArgs.opfsrc ? queryArgs.opfsrc : 
			"package.opf";
    	
        $("#ujs_microemu").microemu({
            menubutton_labels: {
                "left" : "Options",
                /* Default for the form in case no selectable item is focused */
                "middle" : "Next",
                "right" : "Back",
                "select" : "Select"
            },
            scale: 0.773972603
        });
        
        var jqmThemeSrc = encodeURIComponent(UstadJS.resolveURL(location.href,
        		"jquerymobiletheme.min.micro.css"));
        var jqmStructSrc = encodeURIComponent(UstadJS.resolveURL(location.href,
        		"jquery.mobile.structure.micro.css"));
        
        $("#ujs_microemu").microemu("loadmicroemuskin", 
            "microdevice/device.xml", {}, function() {
                var paintableScreenDiv = $("#ujs_microemu").microemu("paintablearea");
                var opubFrameChild = $("<div/>");
                opubFrameChild.attr("id", "micro_opubframe");
                $(paintableScreenDiv).empty();
                $(paintableScreenDiv).css("overflow", "hidden");
                $(paintableScreenDiv).append(opubFrameChild);
                
                
                $(opubFrameChild).opubframe();
                $(opubFrameChild).opubframe("option", "height", 
                    $(paintableScreenDiv).css("height"));
                $(opubFrameChild).opubframe("option", "page_query_params",
                    "jqmThemeLink=" + jqmThemeSrc + "&jqmStructLink=" +
                    jqmStructSrc);
                $("#ustad_epub_frame iframe").attr("scrolling","no");
                $(opubFrameChild).css("margin", "0px");
                $(opubFrameChild).children("iframe").attr("scrolling","no");
                $(opubFrameChild).on("pageloaded", 
                    $UstadMicro.handlePageLoaded.bind($UstadMicro));
                $(opubFrameChild).opubframe("loadfromopf", 
            		$UstadMicro.opfLocation);
                $("#ujs_microemu").on("phonebuttonpress", 
                    $UstadMicro.handlePhoneButtonPressed.bind(
                    $UstadMicro));
            }, function(err) {
                alert("Error : " + err);
            });
    },
    
    handlePageLoaded: function(evt, data) {
        var iframeEl = $("#micro_opubframe iframe");
        $("#ujs_microemu").microemu("setselectablecontainer",
            iframeEl.get(0).contentDocument);
    },
    
    handlePhoneButtonPressed: function(evt) {
        if(evt.isFormDefaultAction && evt.buttonName === "SELECT") {
            this.go(1);
        }else if(evt.buttonName === "SOFT2") {
            this.go(-1);
        }
    },
    
    
    go: function(increment,cell) {
        $('#micro_opubframe').opubframe('go', increment);
    },
    
    scrollFrame: function(increment) {
        var iFrameEl = $("#ustad_epub_frame iframe")[0];
        iFrameEl.contentWindow.scrollBy(0, increment);
    },
    
    /**
    * Turns search query variables into a dictionary - adapted from
    * http://css-tricks.com/snippets/javascript/get-url-variables/
    * 
    * @param {string} queryStr Input query string
    * @method getQueryVariable
    */
    getQueryVariables : function(queryStr) {
        var locationQuery = window.location.search.substring.length >= 1 ?
            window.location.search.substring(1) : "";
        var query = (typeof queryStr !== "undefined") ? queryStr : 
            locationQuery;
        
        var retVal = {};
        if(window.location.search.length > 2) {
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                retVal[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
        return retVal;
    }
    
};

$(function() {
    $UstadMicro.init();
});

