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
XMLExport will export a package as a collection of XML files
Extends WebsiteExport for convenience

"""

import logging
import re
import imp
from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.websitepage   import WebsitePage
from zipfile                  import ZipFile, ZIP_DEFLATED
from exe.export.websiteexport import *
from exe.export.websitepage   import *
from exe.export.xmlpage         import XMLPage
from exe.export.exportmediaconverter    import *

import sys, os, fnmatch, glob, shutil, codecs, md5

log = logging.getLogger(__name__)

# ===========================================================================
class XMLExport(WebsiteExport):
    
    
    
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, config, styleDir, filename, langOverride=None, forceMediaOnly=False):
        WebsiteExport.__init__(self, config, styleDir, filename)
        self.langOverride = langOverride
        self.forceMediaOnly = forceMediaOnly
        self.ustadMobileMode = True
        self.skipNavigation = True
        self.pkgNodeToPageDict = None
    
    @staticmethod
    def encodeEntities(html):
        import cgi
        return  cgi.escape(html)
        

    def export(self, package):
        """ 
        Export to XML files
        Cleans up the previous packages pages and performs the export
        TODO: Make output directory for each type of export media profile
        """
        outputDir = self.filename
        currentOutputDir = Path(outputDir/package.name)
        
        #copy needed files
        if not outputDir.exists(): 
            outputDir.mkdir()
        
        if not currentOutputDir.exists():
            currentOutputDir.mkdir()
        
        #Command line option to override language for export
        if self.langOverride != None:
            package.dublinCore.language = self.langOverride
        
        #track the number of working idevices on a page
        #if 0 do not put page in TOC
        numDevicesByPage = {}
        
        #track idevices that dont really  export
        nonDevices = []
        
        #
        #This is passed from the command line export
        #
        if self.forceMediaOnly == True:
            package.mxmlforcemediaonly = "true"
        
        mediaConverter = ExportMediaConverter()
        

        
        mediaConverter.setCurrentPackage(package)
        ExportMediaConverter.autoMediaOnly = package.mxmlforcemediaonly
        
        ExportMediaConverter.setWorkingDir(currentOutputDir)

        indexPageXML = XMLPage("index", 1, package.root)
        self.pages = [ indexPageXML ]
        
        self.copyFilesXML(package, currentOutputDir)
        
        self.pkgNodeToPageDict = self.generatePagesXML(package.root, 1)
        self.pkgNodeToPageDict[package.root] = indexPageXML
        
        uniquifyNames(self.pages)
        
        self.generateJQueryMobileTOC(package.root, currentOutputDir)
    
        prevPage = None
        thisPage = self.pages[0]
        

        for nextPage in self.pages[1:]:
            pageDevCount = thisPage.save(currentOutputDir, prevPage, \
                                         nextPage, self.pages, nonDevices)
            numDevicesByPage[thisPage.name] = pageDevCount
            prevPage = thisPage
            thisPage = nextPage
             
        pageDevCount = thisPage.save(currentOutputDir, prevPage, None, self.pages, nonDevices)
        numDevicesByPage[thisPage.name] = pageDevCount
        
        self._writeTOCXML(currentOutputDir, numDevicesByPage, nonDevices, package)
        
        #now go through and make the HTML output
        self.pages = [ WebsitePage(self.prefix + "index", 0, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)
        
        prevPage = None
        thisPage = self.pages[0]
        
        for nextPage in self.pages[1:]:
            thisPage.save(currentOutputDir, prevPage, nextPage, self.pages, \
                          ustadMobileMode = True, skipNavLinks = True)
            prevPage = thisPage
            thisPage = nextPage
        
        #the last page
        thisPage.save(currentOutputDir, prevPage, None, self.pages, \
                      ustadMobileMode = True, skipNavLinks = True)
        
        #now make filelists
        self.generateContentListXML(currentOutputDir, package)
        
    """
    
    """    
    def generateJQueryMobileTOC(self, rootNode, outputDir):
        tocFile = open(outputDir + "/exetoc.html", "w")
        tocTitle = _("Table of Contents")
        output = "<html><head>"
        
        #add the CSS from EXE
        output += """
        <link rel="stylesheet" type="text/css" href="base.css" />
        <link rel="stylesheet" type="text/css" href="content.css" />
        <link rel="stylesheet" type="text/css" href="nav.css" />
        """
        
        #add the Javascript from EXE
        output += """
        <script type="text/javascript" src="exe_jquery.js"></script>
        <script type="text/javascript">$exe_i18n={show:"Show",hide:"Hide",menu:"Menu"}</script>
        <script type="text/javascript" src="common.js"></script>
        """

        output += WebsitePage.make_tincan_js_elements()
        output += WebsitePage.makeUstadMobileHeadElement(tocTitle)
        #this has to come after ustadmobile.js scripts load
        output += """
            <script type="text/javascript">
            initTableOfContents();
            </script>
            """
        output += "</head>"
        output += "<body class=\"exe-web-site\" onload='_onLoadFunction();' >"
        output += WebsitePage.makeUstadMobileHeader(tocTitle, None, None)
        output += self.generateJQueryMobileTOCNode(rootNode, 0)
        output += WebsitePage.makeUstadMobileFooter()
        output += "</body></html>"
        tocFile.write(output)
        tocFile.close()
        return output
        
        
    def generateJQueryMobileTOCNode(self, node, depth):
        html = ""
        page = self.pkgNodeToPageDict[node]
        if len(page.node.children) == 0:
            html += "<a href=\"%s\" data-inline=\"true\" data-role=\"button\" class=\"buttonLevel%s\">%s</a><br/>\n" \
                %  (page.name + ".html", str(depth), page.node.title) 
        else:
            #html += "<div data-role=\"collapsible\">\n"
            #html += "<h3 class='tocHeader' data-toc-pagename=\"%s\">%s</h3>\n" \
            # % (page.name + ".html", node.title)
            
            html += """
            <span id="tocButtonShowSpan%(nodeid)s">
            <input type="button" data-role="button" data-icon="arrow-d" data-inline="true" id="tocButtonShow%(nodeid)s" data-toc-showing="false" onclick="tocTrigger('%(nodeid)s', true)" data-iconpos="notext"/>
            </span>
            
            <span id="tocButtonHideSpan%(nodeid)s" style='display: none'>
            <input style="display: none" type="button" data-role="button" data-icon="arrow-u" data-inline="true" id="tocButtonHide%(nodeid)s" data-toc-showing="true" data-iconpos="notext"/>
            </span>
            
            <a href="%(nodeid)s.html" class="buttonLevel%(depth)s" data-role="button" data-inline="true" style="width: 300px" >%(title)s</a>
            <div id="tocDiv%(nodeid)s" style="display: none; padding-left: 35px">
            """ % {"nodeid" : page.name, "title" : page.node.title, "depth" : str(depth)}
            
            
            for child in node.children:
                html += self.generateJQueryMobileTOCNode(child, depth+1)
            html += "</div>\n"
        return html


    """
    
    """
    def generateContentListXML(self, outputDir, package):
        #first make the HTML5 list
        filelist = []
        incAllExtensions = ["js", "html", "css"]
        for extension in incAllExtensions:
            filelist += outputDir.files("*.%s" % extension)
        
        for file in package.resourceDir.files():
            filelist.append(file)
        
        #go through styles and see if there is anything else to mop up
        #bad - this was copy/pasted but should go in a util function at sometime
        styleFiles = []
        if os.path.isdir(self.stylesDir):
            # Copy the style sheet files to the output dir
            styleFiles  = [self.stylesDir/'..'/'base.css']
            styleFiles += [self.stylesDir/'..'/'popup_bg.gif']
            styleFiles += self.stylesDir.files("*.css")
            styleFiles += self.stylesDir.files("*.jpg")
            styleFiles += self.stylesDir.files("*.gif")
            styleFiles += self.stylesDir.files("*.png")
            styleFiles += self.stylesDir.files("*.js")
            styleFiles += self.stylesDir.files("*.html")
            styleFiles += self.stylesDir.files("*.ico")
            styleFiles += self.stylesDir.files("*.ttf")
            styleFiles += self.stylesDir.files("*.eot")
            styleFiles += self.stylesDir.files("*.otf")
            styleFiles += self.stylesDir.files("*.woff")
            
        filelist += styleFiles
        
        #now make it into strings
        fileStrList = []
        for currentFile in filelist:
            filename = currentFile.name
            if not filename in fileStrList:
                fileStrList.append(str(filename))

        html5ListFile = open(outputDir  + "/ustadpkg_html5.xml", "w")
        html5Content = u"<?xml version='1.0' encoding='UTF-8'?>\n"
        html5Content += "<ustadpackage>\n"
        for currentFile in fileStrList:
            html5Content += "<file>%s</file>\n" % currentFile 
        
        #now our only subdirectory - the jquery mobile theme
        jqmImageDir = outputDir/"images"
        for file in jqmImageDir.files():
            html5Content += "<file>images/%s</file>\n" % file.name
        
        html5Content += "</ustadpackage>"
        html5ListFile.write(html5Content)
        html5ListFile.close()
        
        #now make the J2ME version
        filelist = []
        incAllExtensions = ["xml"]
        for extension in incAllExtensions:
            filelist += outputDir.files("*.%s" % extension)
        
        for file in package.resourceDir.files():
            filelist.append(file)
        
        
        
        
        pass
        
        
    

    """
    Makes the table of contents XML file
    """
    def _writeTOCXML(self, outputDir, numDevicesByPage, nonDevices, package):
        xmlDirectoryFile = open(outputDir + "/exetoc.xml", "w")
        xmlDirectoryFile.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        
        lang = package.dublinCore.language
        langAttrib = ""
        
        
        if lang is not None and lang != '':
            langAttrib = " xml:lang='%s' " % lang 
        
        mediaAttrib = " audioformats='"
        
        for audioFormat in ENGINE_AUDIO_FORMATS:
            mediaAttrib += audioFormat + ","
        
        mediaAttrib += "' videoformats='"
        for videoFormat in ENGINE_VIDEO_FORMATS:
            mediaAttrib += videoFormat +  "," 
        
        mediaAttrib += "' resolutions='" 
        for screenRes in ENGINE_IMAGE_SIZES:
            mediaAttrib += screenRes  +  ","
        mediaAttrib += "' "
        
        xmlDirectoryFile.write("<exebase%s>\n" % (langAttrib + mediaAttrib))
        
        
        
        for page in self.pages:
            if len(page.node.idevices) == 0:
                continue
            #Check the real number of devices on the page
            if numDevicesByPage[page.name] == 0:
                continue
            
            lineStr = u"<page href='%(link)s.xml' title='%(title)s'>\n" \
                % {"link" : page.name, "title" : XMLExport.encodeEntities(page.node.titleShort) }
            xmlDirectoryFile.write(lineStr.encode("UTF-8"))
            xmlDirectoryFile.write("\n")
            for idevice in page.node.idevices:
                #TODO: Make sure that we do not have an idevice entry for 
                #something on a page with real idevices 
                if idevice.__class__.__name__ in nonDevices:
                    pass
                else:
                    ideviceLine = u"\t<idevice id='%(ideviceid)s' title='%(title)s'/>\n" % \
                    { "ideviceid" : idevice.id, "title" : XMLExport.encodeEntities(idevice.get_title())}
                    xmlDirectoryFile.write(ideviceLine.encode("UTF-8"))
            
            xmlDirectoryFile.write("</page>\n")    
                
            
        
        xmlDirectoryFile.write("</exebase>")
        xmlDirectoryFile.close()   
        
        
    def generatePagesXML(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """
        nodeToPageDict = {}           
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            newPage = XMLPage(pageName, depth, child)
            self.pages.append(newPage)
            nodeToPageDict[child] = newPage
            childNodeToPageDict = self.generatePagesXML(child, depth + 1)
            nodeToPageDict.update(childNodeToPageDict)
        
        return nodeToPageDict
            
    def copyFilesXML(self, package, outputDir):
        
        #copy defined items from the style directory for the mobile output
        styleFiles = self.stylesDir.files("icon_*.png")
        self.stylesDir.copylist(styleFiles, outputDir)
        
        styleFiles = self.stylesDir.parent.files("icon_*.png")
        self.stylesDir.copylist(styleFiles, outputDir)
        
        styleFiles = self.stylesDir.files("icon_*.gif")
        self.stylesDir.copylist(styleFiles, outputDir)
        
        
        #copy 
        self.templatesDir.copylist(["deviceframe.html", "mobiledevice.png"], outputDir)
        
        
        self.copy_sub_dir("ustad-jqmimages", "images", ['png', 'gif'], \
                          outputDir)
        self.copy_sub_dir("ustad-locale", "locale", ['js'], outputDir)
        
        #JQuery Mobile theme files
        """
        jqmImagesDirSrc = self.templatesDir/"ustad-jqmimages"
        jqmImagesDirDst = outputDir/"images"
        if not jqmImagesDirDst.isdir():
            jqmImagesDirDst.mkdir()
            
        jqmImagesDirSrc.copylist(jqmImagesDirSrc.files("*.png"),jqmImagesDirDst)
        jqmImagesDirSrc.copylist(jqmImagesDirSrc.files("*.gif"),jqmImagesDirDst)
        """
        
        #
        
        # copy the package's resource files
        #package.resourceDir.copyfiles(outputDir)
        self.copyFiles(package, outputDir)
        
    """
    Copy the contents of a subdirectory from templates into a sub directory
    of the output directory
    """
    def copy_sub_dir(self, template_src_subdir, target_subdir, extensions, out_dir):
        src_dir = self.templatesDir/template_src_subdir
        dst_dir = out_dir/target_subdir
        if not dst_dir.isdir():
            dst_dir.mkdir()
            
        for extension in extensions:
            src_dir.copylist(src_dir.files("*.%s" % extension), \
                             dst_dir)
        

    
"""
Utility method
"""            
def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)
 

