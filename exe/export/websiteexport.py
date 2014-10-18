# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
from exe.engine.resource import Resource
"""
WebsiteExport will export a package as a website of HTML pages
"""

import logging
import re
import imp
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.websitepage   import WebsitePage
from zipfile                  import ZipFile, ZIP_DEFLATED
from exe.webui                import common
from exe                      import globals as G
from exe.engine.exetincan     import *

import os
from exe.engine.persist import encodeObject
from exe.engine.persistxml import encodeObjectToXML

log = logging.getLogger(__name__)

# ===========================================================================
class WebsiteExport(object):
    
    
    #Track these variables so we can generate TinCan IDs as we go
    #Initialising the current Course's page's idevice id for the current package.   
    current_page = ""
    current_package_name = ""
    current_idevice_id = ""
    current_xapi_prefix = ""
    
    
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, config, styleDir, filename, prefix="", report=False, skipNavigation=False, ustadMobileMode=False, ustadMobileTestMode=False):
        #Added ustadMobileTestMode for Course Test Mode.
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        

        self.config       = config
        self.imagesDir    = config.webDir/"images"
        self.scriptsDir   = config.webDir/"scripts"
        self.cssDir       = config.webDir/"css"
        self.templatesDir = config.webDir/"templates"
        self.stylesDir    = Path(styleDir)
        self.filename     = Path(filename)
        self.pages        = []
        self.prefix       = prefix
        self.report       = report
        self.skipNavigation = skipNavigation
        self.ustadMobileMode = ustadMobileMode  
        self.ustadMobileTestMode = ustadMobileTestMode  #Added for Course Test Mode
        self.styleSecureMode = config.styleSecureMode

        self.config          = config
        self.imagesDir       = config.webDir/"images"
        self.scriptsDir      = config.webDir/"scripts"
        self.cssDir          = config.webDir/"css"
        self.templatesDir    = config.webDir/"templates"
        self.stylesDir       = Path(styleDir)
        self.filename        = Path(filename)
        self.pages           = []
        self.prefix          = prefix
        self.report          = report
       
       
    @staticmethod
    def getTinCanId(suffix = "", id_type="idevice", pagename = None):
        """Make a tin can activity ID - use a server prefix, the 
        package name, the page name, then the idevice id, and if
        needed another / and a question id or other depending on
        the idevice
        
        suffix: will be added to the tincan string
        id_type: can be idevice (default), page or
        pagename: the page file name (without .html etc). 
        
        """
        server_tincan_prefix = "http://www.ustadmobile.com/tincan"
        if pagename is None:
            pagename = WebsiteExport.current_package_name
        
        tin_can_prefix = "%(urlprefix)s/%(packagename)s" % {
                                "urlprefix" : server_tincan_prefix,
                                "packagename" :  WebsiteExport.current_package_name
                                }
        
        if id_type == EXETinCan.PAGE or id_type == EXETinCan.IDEVICE:
            tin_can_prefix += "/" + pagename
        
        if id_type == EXETinCan.IDEVICE:
            tin_can_prefix += "/" + WebsiteExport.current_idevice_id
        
        if suffix != "":
            tin_can_prefix += "/" + suffix
        
        return tin_can_prefix
 

    def exportZip(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        
        outputDir = TempDirPath()

        # Import the Website Page class , if the secure mode is off.  If the style has it's own page class
        # use that, else use the default one.
        if self.styleSecureMode=="0":
            if (self.stylesDir/"websitepage.py").exists():
                global WebsitePage
                module = imp.load_source("websitepage", 
                                         self.stylesDir/"websitepage.py")
                WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage("index", 0, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage
            

        thisPage.save(outputDir, prevPage, None, self.pages)
        
        
        self.copyFiles(package, outputDir)
        # Zip up the website package
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()

    def doZip(self, fileObj, outputDir):
        """
        Actually saves the zip data. Called by 'Path.safeSave'
        """
        zipped = ZipFile(fileObj, "w")
        for scormFile in outputDir.files():
            zipped.write(scormFile, scormFile.basename().encode('utf8'), ZIP_DEFLATED)
        zipped.close()

    def appendPageReport(self, page, package):
        if not page.node.idevices:self.report += u'"%s","%s",%d,"%s",,,,,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html')
        for idevice in page.node.idevices:
            if not idevice.userResources:self.report += u'"%s","%s",%d,"%s","%s","%s",,,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title)
            for resource in idevice.userResources:
                if type(resource) == Resource:
                    self.report += u'"%s","%s",%d,"%s","%s","%s","%s","%s","%s","%s"\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title, resource.storageName, resource.userName, resource.path, resource.checksum)
                else:
                    self.report += u'"%s",%d,"%s","%s","%s","%s",,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title, resource)

    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        if not self.report:
            outputDir = self.filename
            if not outputDir.exists():
                outputDir.mkdir()

        WebsiteExport.current_package_name = package.name
        WebsiteExport.current_xapi_prefix = \
            EXETinCan.get_tincan_prefix_for_pkg(package)
        
        # Import the Website Page class.  If the style has it's own page class
        # use that, else use the default one.
        if (self.stylesDir/"websitepage.py").exists():
            global WebsitePage
            module = imp.load_source("websitepage", 
                                     self.stylesDir/"websitepage.py")
            WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage(self.prefix + "index", 0, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]
        if self.report:
            self.report = u'"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s"\n' % ('File','Page Name', 'Level', 'Page File Name', 'Idevice Type', 'Idevice Title', 'Resource File Name', 'Resource User Name', 'Resource Path', 'Resource Checksum')
            self.appendPageReport(thisPage,package)

        for nextPage in self.pages[1:]:
            if self.report:
                self.appendPageReport(nextPage,package)
            else:
                thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        
        
        if not self.report:
            thisPage.save(outputDir, prevPage, None, self.pages)

            if self.prefix == "":
                self.copyFiles(package, outputDir)
        else:
            self.filename.write_text(self.report, 'utf-8')

    def copyFiles(self, package, outputDir, um_mode = False):
        """
        Copy all the files used by the website.
        Parameters
        ----------
        package : Package
            package that is being exported
        outputDir : Path
            The end directory being exported to
        """
        package.resourceDir.copyfiles2(outputDir)
        
        copy_list = package.make_system_copy_list(self.stylesDir,
                              self.scriptsDir, self.templatesDir,
                              self.imagesDir, self.cssDir, outputDir,
                              ustad_mobile_mode = um_mode)
        WebsiteExport.run_copy_list(copy_list)
        
        if hasattr(package, 'exportSource') and package.exportSource:
            (outputDir/'content.data').write_bytes(encodeObject(package))
            (outputDir/'contentv3.xml').write_bytes(encodeObjectToXML(package))
        

    
    @classmethod
    def run_copy_list(cls, copy_list):
        """
        Copy a list of files - preserve modification times
        Parameters
        copy_list : list
            List of arrays.  Item 0 of each array should be a source,1 
            should be the dest.  Source can be a list of paths or a path
            object itself.
            
            For a list the dest should be a path representing a directory
            For an individual path the destination should be a file path
        """
        
        for copy_item in copy_list:
            src = copy_item[0]
            dst = copy_item[1]
            
            
            if isinstance(src, Path):
                #this is a straight file to file copy
                src.copyfile2(dst)
            else:
                #this is a list of files to copy to dst which should be
                #a directory
                for src_file in src:
                    src_file.copyfile2(dst/src_file.basename())
    
    
    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """           
        for child in node.children:
            # assure lower pagename, without whitespaces or alphanumeric characters:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(WebsitePage(self.prefix + pageName, depth, child))
            self.generatePages(child, depth + 1)

