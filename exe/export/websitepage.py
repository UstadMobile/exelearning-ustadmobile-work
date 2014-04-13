# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
This class transforms an eXe node into a page on a self-contained website
"""

import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.engine.version       import release
from exe.export.pages         import Page, uniquifyNames
from exe.webui                import common
from exe                      import globals as G

log = logging.getLogger(__name__)


# ===========================================================================
class WebsitePage(Page):
    """
    This class transforms an eXe node into a page on a self-contained website
    """

    def save(self, outputDir, prevPage, nextPage, pages, ustadMobileMode = False, skipNavLinks = False):
        """
        This is the main function. It will render the page and save it to a
        file.  'outputDir' is the directory where the filenames will be saved
        (a 'path' instance)
        """
        outfile = open(outputDir / self.name+".html", "wb")
        outfile.write(self.render(prevPage, nextPage, pages, ustadMobileMode = ustadMobileMode, skipNavLinks = skipNavLinks))
        outfile.close()
        

    def render(self, prevPage, nextPage, pages, ustadMobileMode = False, skipNavLinks = False):
        """
        Returns an XHTML string rendering this page.
        """
        lenguaje = G.application.config.locale
        if self.node.package.dublinCore.language!="":
            lenguaje = self.node.package.dublinCore.language
        
        dT = common.getExportDocType()
        themeHasXML = common.themeHasConfigXML(self.node.package.style)
        lb = "\n" #Line breaks
        sectionTag = "div"
        headerTag = "div"
        navTag = "div"
        if dT == "HTML5":
            html = '<!doctype html>'+lb
            html += '<html lang="'+lenguaje+'">'+lb
            sectionTag = "section"
            headerTag = "header"
            navTag = "nav"
        else:
            html = u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+lb
            html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb    
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"nav.css\" />"+lb
        html += u"<title>"
        if self.node.id=='0':
            if self.node.package.title!='':
                html += escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        else:
            if self.node.package.title!='':
                html += escape(self.node.titleLong)+" | "+escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        html += u" </title>"+lb
        html += u"<link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\" />"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; "
        html += u" charset=utf-8\" />"+lb
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += '<meta name="generator" content="eXeLearning '+release+' - exelearning.net" />'+lb
        if self.node.id=='0':
            if self.node.package.description!="":
                html += '<meta name="description" content="'+self.node.package.description+'" />'+lb
        if dT == "HTML5" or common.nodeHasMediaelement(self.node):
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        
        # jQuery
        if style.hasValidConfig:
            if style.get_jquery()==True:
                html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            else:
                html += u'<script type="text/javascript" src="'+style.get_jquery()+'"></script>'+lb
        else:
            html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
        
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        html += common.getJavaScriptStrings()+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        
        
        # Some styles might have their own JavaScript files (see their config.xml file)
        
        html += WebsitePage.make_tincan_js_elements()
        
        if ustadMobileMode == True:
            html += WebsitePage.makeUstadMobileHeadElement(escape(self.node.titleLong))
        
        if style.hasValidConfig:
            #html += style.get_extra_head()
            #experiment
            pass
        html += u"</head>"+lb
        
        onLoadFunction = ""
        if ustadMobileMode == True:
            onLoadFunction = " onload='_onLoadFunction();' "
        
        html += u"""<body class="exe-web-site" %s>
            <script type="text/javascript">
            document.body.className+=" js" 
            </script>""" % onLoadFunction
        html += lb
        
        if ustadMobileMode == True:
            #do the header another way
            html += WebsitePage.makeUstadMobileHeader(escape(self.node.titleLong), nextPage, prevPage)
        
        
        
        html += u"<"+sectionTag+" id=\"content\">"+lb
        html += '<p id="skipNav"><a href="#main" class="sr-av">'+_('Skip navigation')+'</a></p>'+lb

        if self.node.package.backgroundImg or self.node.package.title:
            html += u"<"+headerTag+" id=\"header\" "

            if self.node.package.backgroundImg:
                html += u" style=\"background-image: url("
                html += quote(self.node.package.backgroundImg.basename())
                html += u"); "

                if self.node.package.backgroundImgTile:
                    html += "background-repeat: repeat-x;"
                else:
                    html += "background-repeat: no-repeat;"

                html += u"\""
            html += u">"
            html += escape(self.node.package.title)
            html += u"</"+headerTag+">"+lb
        else:
            html += "<"+sectionTag+" id=\"emptyHeader\"></"+sectionTag+">"+lb
        
        # add left navigation html

        if skipNavLinks == False:
            html += u"<"+navTag+" id=\"siteNav\">"+lb
            html += self.leftNavigationBar(pages)
            html += u"</"+navTag+">"+lb
            html += "<"+sectionTag+" id='topPagination'>"+lb
            html += self.getNavigationLink(prevPage, nextPage)
            html += "</"+sectionTag+">"+lb
            
        html += u"<"+sectionTag+" id=\"main-wrapper\">"+lb
        html += u"<"+sectionTag+" id=\"main\"><a name=\"main\"></a>"+lb
        
        
        if ustadMobileMode == False:
            html += '<'+headerTag+' id=\"nodeDecoration\">'
            html += '<h1 id=\"nodeTitle\">'
            html += escape(self.node.titleLong)
            html += '</h1>'
            html += '</'+headerTag+'>'+lb

        for idevice in self.node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""
                html += u'<'+sectionTag+' class="iDevice_wrapper %s%s" id="id%s">%s' %  (idevice.klass, e, idevice.id, lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForWeb()
                if idevice.title != "Forum Discussion":
                    html += self.processInternalLinks(self.node.package,
                        block.renderView(self.node.package.style))
                html += u'</'+sectionTag+'>'+lb # iDevice div


        if not themeHasXML and ustadMobileMode is False:
            html += "<"+sectionTag+" id='bottomPagination'>"+lb
            html += self.getNavigationLink(prevPage, nextPage)
            html += "</"+sectionTag+">"+lb
        # writes the footer for each page 
        if ustadMobileMode is False:
            html += self.renderLicense()
        
        if not themeHasXML and ustadMobileMode is False:
        #if not style.hasValidConfig:
            html += self.renderFooter()
        html += u"</"+sectionTag+">"+lb # /main
        html += u"</"+sectionTag+">"+lb # /main-wrapper
        if themeHasXML and ustadMobileMode is False:
        #if style.hasValidConfig:
            html += "<"+sectionTag+" id='bottomPagination'>"+lb
            html += self.getNavigationLink(prevPage, nextPage)
            html += "</"+sectionTag+">"+lb        
            html += self.renderFooter()
        html += u"</"+sectionTag+">"+lb # /content
        if themeHasXML and ustadMobileMode is False:
        #if style.hasValidConfig:
            html += style.get_extra_body()
            
        if ustadMobileMode == True:
            html += WebsitePage.makeUstadMobileFooter()
        
        html += u'</body></html>'
        html = html.encode('utf8')
        # JR: Eliminamos los atributos de las ecuaciones
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
        html = aux.sub("", html)
        aux = re.compile("exe_math_size=\"[^\"]*\"")
        html = aux.sub("", html)
        #JR: Cambio el & en los enlaces del glosario
        html = html.replace("&concept", "&amp;concept")
        # Remove "resources/" from data="resources/ and the url param
        html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
        html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
        html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
        html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")

        return html

    def indent(self,level):
        i = 0
        indent_text = ""
        while i < level:
            indent_text += "   "
            i+=1
        return indent_text
        
    def leftNavigationBar(self, pages, inSameLevelTitle = True, excludeTitle = False):
        """
        Generate the left navigation string for this page
        """
        lb = "\n" #Line breaks
        if inSameLevelTitle:
            depth = 1
        else:
            depth = 0
        nodePath = [None] + list(self.node.ancestors()) + [self.node]

        html = "<ul>"+lb
        
        for page in pages:
            if page.node.parent == None and not inSameLevelTitle:
                page.depth = 0
            if page.node.parent == None and excludeTitle:
                depth = 1
                continue
            while depth < page.depth:
                html += lb+"<ul"

                if page.node.parent not in nodePath:
                    html += " class=\"other-section\""
                html += ">"+lb
                depth += 1

            while depth > page.depth:
                html += "</ul>"+lb+"</li>"+lb
                depth -= 1
            
            if page.node == self.node:
                html += "<li id=\"active\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"active daddy"
                else:
                    html += "class=\"active no-ch"

            elif page.node in nodePath and page.node.parent != None:
                html += "<li class=\"current-page-parent\"><a href=\""+quote(page.name)+".html\" "

                if page.node.children:
                    html += "class=\"current-page-parent daddy"

            else:
                html += "<li><a href=\""+quote(page.name)+".html\" class=\""
                if page.node.children:
                    html += "daddy"
                else:
                    html += "no-ch"

            if page.node.id=="0":
                html += " main-node"

            html += "\">"
            html += escape(page.node.titleShort)
            html += "</a>"

            if inSameLevelTitle and page.node.id=="0":
                html += "</li>"+lb

            if not page.node.children and page.node.id!="0":
                html += "</li>"+lb

        if excludeTitle or inSameLevelTitle:
            html += "</ul>"+lb
        else:
            html += "</ul>"+lb+"</li>"+lb+"</ul>"+lb
        
        return html
        
    def getNavigationLink(self, prevPage, nextPage):
        """
        return the next link url of this page
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        sectionTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
        html = "<"+sectionTag+" class=\"pagination noprt\">"+lb

        if prevPage:
            html += "<a href=\""+quote(prevPage.name)+".html\" class=\"prev\">"
            html += "<span>&laquo; </span>%s</a>" % _('Previous')

        if nextPage:
            if prevPage:
                html += " | "
            html += "<a href=\""+quote(nextPage.name)+".html\" class=\"next\">"
            html += " %s<span> &raquo;</span></a>" % _('Next')
            
        html += lb+"</"+sectionTag+">"+lb
        return html



    def processInternalLinks(self, package, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this WebSite Export, go ahead and process the link entirely,
        using the fully exported (and unique) file names for each node.
        """
        return common.renderInternalLinkNodeFilenames(package, html)
    
    @classmethod
    def make_tincan_js_elements(cls):
        """"Make string of HTML script elements for needed tincan javascript
        """
        # tin can javascript files
        tin_can_scripts = ['tincan.js', 'tincan_queue.js', 'exe_tincan.js']
        html = u""
        
        for tc_script in tin_can_scripts:
            html += u'<script type="text/javascript" src="%s">' % tc_script
            html += u'</script>\n'
        
            
        return html
        
    
    """
    Make a header with all the needed scripts and stylesheets etc.
    make sure to get rid of main-wrapper extra padding
    
    To add JS/CSS files see getUstadMobileScriptList and getUstadMobileCSSList
    respectively
    """
    @classmethod
    def makeUstadMobileHeadElement(cls, title):
        html = u""
        html += """<style type='text/css'>
                #main-wrapper { padding: 0px; }
                </style>
            """
        for scriptName in WebsitePage.getUstadMobileScriptList():
            html += "<script src=\"%s\" type=\"text/javascript\"></script>\n" \
            % scriptName
        for cssName in WebsitePage.getUstadMobileCSSList():
            html += "<link type=\"text/css\" rel=\"stylesheet\" href=\"%s\"/>\n" \
             % cssName
        
        html += """<meta name=\"viewport\" content=\"width=device-width, 
            initial-scale=1\"/> \n"""
        
        return html
    
    """
    Genetates a JQuery Mobile style div (div data-role=content)
    """
    @classmethod
    def makeUstadMobileHeader(cls, title, nextPage, prevPage):
        html = u""
        

        #set the next and back links
        nextlink = ""
        prevlink = ""
        if nextPage:
            nextlink = quote(nextPage.name)+".html"
        else:
            nextlink = "#"
        
        if prevPage:
            prevlink  = quote(prevPage.name)+".html"
        else:
            prevlink = "#"
            
        
        html += """
        <div data-role="header" data-position="fixed" data-id="exeheader" class= "exeTranslated" data-exe-translation = "%s" data-tap-toggle="false">
        <h3>%s</h3> <!-- Note the page title that needs to be replaced with the Page Tite -->
        </div>
        <div data-role="content">
        """ % (title, title)
        
        html += """
        <a href='%s' style='display: none' id='exeNextPage'>&nbsp;</a>
        """ % nextlink
        
        html += """
        <a href='%s' style='display: none' id='exePreviousPage'>&nbsp;</a>
        """ % prevlink
        
        return html
    
    """
    Make the JQuery Mobile footer for the page
    """
    @classmethod
    def makeUstadMobileFooter(cls):
        html = u""
        html += """

        <div data-role="footer" data-position="fixed" 
            style="text-align: center;" data-id="exefooter" 
            data-tap-toggle="false">
            
            <a id="umBack" data-role="button" data-icon="arrow-l" 
                class="ui-btn-left exeTranslated" 
                onclick="exePreviousPageOpen()" data-exe-translation="Back"
                data-theme="a" data-inline="true">Back</a>
            
            <a onclick="exeMenuPageOpen()"   style="text-align: center;" 
                data-exe-translation="Menu" class="exeTranslated"
                data-transition="slideup" data-inline="true" data-icon="grid" 
                data-theme="a">Menu</a>
                     
            <a id="umForward" data-role="button" data-icon="arrow-r" 
                class="ui-btn-right exeTranslated" data-direction="reverse"
                data-exe-translation="Forward" 
                onclick="exeNextPageOpen()" data-theme="a" 
                data-inline="true">Forward</a>
        </div>
        </div>   """
        
        return html
    
    """
    List of .js files that are needed by UstadMobile pages
    """
    @classmethod
    def getUstadMobileScriptList(cls):
        #Temp: Qunit removed due to conflict with imagemapster - "qunit-1.12.0.js",  "ustadmobile-test.js", 
        return ["ustadmobile-settings.js", "ustadmobile.js", "jquery.mobile-1.3.2.min.js",\
                 "ustadmobile-common.js", "ustadmobile-constants.js",\
                 "ustadmobile-booklist.js", "jquery.touchSwipe.min.js"]
    
    """
    List of .css files that are needed by UstadMobile Pages
    """
    @classmethod
    def getUstadMobileCSSList(cls):
        return ["jquery.mobile-1.3.2.css"]
    
