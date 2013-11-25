/*
<!-- This file is part of Ustad Mobile.  
    
    Ustad Mobile Copyright (C) 2011-2013 Toughra Technologies FZ LLC.

    Ustad Mobile is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version with the following additional terms:
    
    All names, links, and logos of Ustad Mobile and Toughra Technologies FZ 
    LLC must be kept as they are in the original distribution.  If any new
    screens are added you must include the Ustad Mobile logo as it has been
    used in the original distribution.  You may not create any new 
    functionality whose purpose is to diminish or remove the Ustad Mobile 
    Logo.  You must leave the Ustad Mobile logo as the logo for the 
    application to be used with any launcher (e.g. the mobile app launcher).  
    
    If you want a commercial license to remove the above restriction you must
    contact us.  
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Ustad Mobile is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.




This program is free software.  It is licensed under the GNU GENERAL PUBLIC LICENSE ( http://www.gnu.org/copyleft/gpl.html ) with the following 

GPL License Additional Terms

All names, links, and logos of Ustad Mobile and Toughra Technologies FZ LLC must be kept as they are in the original distribution.  If any new screens are added you must include the Ustad Mobile logo as it has been used in the original distribution.  You may not create any new functionality whose purpose is to diminish or remove the Ustad Mobile Logo.  You must leave the Ustad Mobile logo as the logo for the application to be used with any launcher (e.g. the mobile app launcher).  

If you need a commercial license to remove these restrictions please contact us by emailing info@ustadmobile.com 

-->

*/

/* 

This javascript creates the header and footer of ustad mobile content in packages.

*/

//writeHeadElements
//document.writeLn
//document.writeln("Hello World");



$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});



function getAppLocation(){ //function to get the root of the device. Here or ustadmobile-common.js

}

function exePreviousPageOpen(){
    //var exePP= localStorage.getItem('exePreviousPage');   
    //window.open(exePreviousPage).trigger("create");
    var previousPageHREF = $(".ui-page-active #exePreviousPage").attr("href");
    $.mobile.changePage( previousPageHREF, { transition: "slideup" } );
}

function exeNextPageOpen(){
    //var exeNP= localStorage.getItem('exeNextPage');   
    //window.open(exeNextPage).trigger("create");
    var nextPageHREF = $(".ui-page-active #exeNextPage").attr("href");
    $.mobile.changePage( nextPageHREF, { transition: "slide" } );
}

function exeMenuPageOpen(){
    //var exeMP= localStorage.getItem('exeMenuPage');
    //window.open(exeMenuPage).trigger("create"); // Just opens the page in new window?
    //window.open(exeMenuPage); // Just opens the page (in new window).
    exeMenuLink = localStorage.getItem("baseURL") + "/" + exeMenuPage;
    $.mobile.changePage( exeMenuLink, { transition: "slideup" } );
    //$.mobile.loadPage( exeMenuPage );
    //$.mobile.load(exeMenuPage);
    
}

function openMenuLink(linkToOpen){
    //alert("in Open Menu Link!");
    //$.mobile.changePage( linkToOpen ).trigger("create");
    window.open(linkToOpen).trigger("create");
}

function exeLastPageOpen(){
    $.mobile.changePage( exeLastPage );
}

function umMenuLogout(){
    $.mobile.loading('show', {
    text: 'Ustad Mobile:Logging Out..',
    textVisible: true,
    theme: 'b',
    html: ""});
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    openPage("ustadmobile_login.html");
}  

function writeBodyStart(title) {
    document.writeln("<div data-role=\"page\" id=\"exemainpage\">");
    document.writeln("<div data-role=\"header\" data-position=\"fixed\">");
    document.writeln("<p style=\"background-image:url('res/umres/banne1.png'); background-repeat:repeat-x;margin-top:-8px;\" >.</p>");
    document.writeln("<a id=\"UMUsername\">");
    document.writeln("</a>");
    //document.writeln("<a></a>");    
    document.writeln("<a id=\"UMLogout\" data-role=\"button\" data-icon=\"home\" data-iconshadow=\"false\" data-direction=\"reverse\" onclick=\"umLogout()\" class=\"ui-btn-right\"></a>"); // might be added: rel=\"external\" so that it doesn't actually open a new page.
    document.writeln("<h3>" + title + "</h3>");
    document.writeln("</div>");
    document.writeln("<div data-role=\"content\">");
}

function writeBodyEnd() {
    document.writeln("<div data-role=\"footer\" data-position=\"fixed\" style=\"text-align: center;\">");


    document.writeln("<a id=\"umBack\" data-role=\"button\" data-icon=\"arrow-l\" class=\"ui-btn-left\" onclick=\"exePreviousPageOpen()\"  data-theme=\"a\" data-inline=\"true\">Back</a>");

    //onclick=\"exeMenuPageOpen()\"
    //href=\"ustadmobile_menuPage.html\"
    //rel=\"external\"
    document.writeln("<a onclick=\"exeMenuPageOpen()\"   style=\"text-align: center;\" data-transition=\"slideup\" data-inline=\"true\" data-icon=\"grid\" data-theme=\"a\">Menu</a>");

    //document.writeln("<a href=\"ustadmobile_menuPage.html\" data-rel=\"dialog\" style=\"text-align: center;\" data-inline=\"true\" data-icon=\"grid\" data-theme=\"a\">Menu</a>");
 
    document.writeln("<a id=\"umForward\" data-role=\"button\" data-icon=\"arrow-r\" class=\"ui-btn-right\" data-direction=\"reverse\" onclick=\"exeNextPageOpen()\" data-theme=\"a\" data-inline=\"true\">Forward</a>");

    document.writeln("</div>");

}


