var myTheme = {
    init : function(){
		var ie_v = $exe.isIE();
		if (ie_v && ie_v<8) return false;
        $(window).resize(function() {
            myTheme.reset();
        });
		var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
        var l = $('<p id="nav-toggler"><a href="#" onclick="myTheme.toggleMenu()" class="hide-nav" id="toggle-nav" title="'+tit+'"><span>'+$exe_i18n.menu+'</span></a></p>');
        $("#siteNav").before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1) {
                myTheme.hideMenu();
            }
        }
    },
    hideMenu : function(){
        $("#siteNav").hide();
        $(document.body).addClass("no-nav");
        myTheme.params("add");
		var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
        $("#toggle-nav").attr("class","show-nav").attr("title",tit);
    },
    toggleMenu : function(){
        var l = $("#toggle-nav");
        if (l.attr("class")=='hide-nav') {  
			var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
            l.attr("class","show-nav").attr("title",tit);
            $("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
                $(document.body).addClass("no-nav");
                $("#siteFooter").show();
            }); 
            myTheme.params("add");
        } else {
            var tit = $exe_i18n.menu+" ("+$exe_i18n.hide.toLowerCase()+")";
			l.attr("class","hide-nav").attr("title",tit);
            $(document.body).removeClass("no-nav");
			$("#siteNav").slideDown();
            myTheme.params("delete");            
        }
    },
    param : function(e,act) {
        if (act=="add") {
            var ref = e.href;
            var con = "?";
            if (ref.indexOf(".html?")!=-1) con = "&";
            var param = "nav=false";
            if (ref.indexOf(param)==-1) {
                ref += con+param;
                e.href = ref;                    
            }            
        } else {
            // This will remove all params
            var ref = e.href;
            ref = ref.split("?");
            e.href = ref[0];
        }
    },
    params : function(act){
        $("A",".pagination").each(function(){
            myTheme.param(this,act);
        });
    },
    reset : function() {
        var tit = $exe_i18n.menu+" ("+$exe_i18n.show.toLowerCase()+")";
		$("#toggle-nav").attr("class","show-nav").attr("title",tit);
        myTheme.toggleMenu();        
    }    
}

$(function(){
    if (document.body.className=='exe-web-site') {
        myTheme.init();
    }
});