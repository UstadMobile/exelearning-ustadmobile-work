# ===========================================================================
# eXe 
#
# UstadMobile Export Unit Test, part of eXeLearning
#
# Copyright Michael Dawson, Ustad Mobile 2012-2014
#
# mike@mike-dawson.net
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
import unittest
from exe.engine.package       import Package
from exe.engine.path          import Path, TempDirPath
from exe                      import globals as G
from exe.export.xmlexport     import XMLExport
from exe.export.exportmediaconverter import ENGINE_IMAGE_SIZES, ENGINE_AUDIO_FORMATS, ENGINE_VIDEO_FORMATS

import sys

class TestUstadMobileExport(unittest.TestCase):


    def setUp(self):
        from exe.application import Application
        application = Application()
        application.standalone = True
        
        fake_file_arg = str(Path(__file__).parent.parent/'exe'/'exe') 
        sys.argv[0] = fake_file_arg
        application.loadConfiguration()


    def tearDown(self):
        pass
    
    def runChecksOnMediaSlide(self, mediaSlideEl):
        pass

    """
    
    """
    def checkImageVersionsExist(self, imgPath, package, exetocEl):
        imgResProfs = exetocEl.getAttribute("resolutions").split(",")
        
        for profileName in imgResProfs:
            if profileName == "":
                return 
            newFileName = imgPath.namebase + "-" + profileName + imgPath.ext
            profileImgPath = Path(imgPath.parent/newFileName)
            self.assertTrue(profileImgPath.exists(), "Image ")
    
    def checkMediaFiles(self, mediaPath, exetocEl, elementName):
        mediaFileList = exetocEl.getAttribute(elementName)
        mediaProfs = mediaFileList.split(",")
        originalExtension = mediaPath.ext
        
        for profileName in mediaProfs:
            if profileName == "":
                continue
            
            profExtension  = profileName.lower()
            if originalExtension == profileName:
                continue
            newFilename = mediaPath.namebase + "." + profExtension
            newPath = Path(mediaPath.parent/newFilename)
            self.assertTrue(newPath.exists(), "Media file " + newFilename + " does not exist")
    
    """
    foundIdeviceInPageEl - the DOM element of the idevice
    href - the page href
    mainFolder - Path object representing the main folder
    package - the package object we are working with
    exetocEl -the root dom element so we can lookup attributes 
    """
    def doCheckMediaSlide(self, foundIdeviceInPageEl, href, mainFolder, package, exetocEl):
        textVal = foundIdeviceInPageEl.firstChild.nodeValue
        videoElNodeList = foundIdeviceInPageEl.getElementsByTagName("video")
        if videoElNodeList is not None and len(videoElNodeList) > 0:
            # check video exists
            vidSrc = videoElNodeList[0].getAttribute("src")
            vidPath = Path(mainFolder/vidSrc)
            self.assertTrue(vidPath.exists(), "Video %s does not exist" % vidSrc)
            self.checkMediaFiles(vidPath, exetocEl, "videoformats") 
            
        else:
            # should be audio video
            imgElements = foundIdeviceInPageEl.getElementsByTagName("img")
            hasImg = False
            hasAudio = False
            
            if imgElements is not None and len(imgElements) > 0:
                imgSrc = imgElements[0].getAttribute("src")
                imgPath = Path(mainFolder / imgSrc)
                self.assertTrue(imgPath.exists(), \
                                "Image %s referred to in %s not exist! " % (imgSrc, href))
                hasImg = True
                self.checkImageVersionsExist(imgPath, package, exetocEl)
                
            audioElements = foundIdeviceInPageEl.getElementsByTagName("audio")
            if audioElements is not None and len(audioElements) > 0: 
                audSrc = audioElements[0].getAttribute("src")
                audPath = Path(mainFolder / audSrc)
                self.assertTrue(audPath.exists(), \
                                "Audio %s referred to in %s does not exist" % (audSrc, href))
                hasAudio = True
                self.checkMediaFiles(audPath, exetocEl, "audioformats")
                
            self.assertTrue(hasImg or hasAudio, \
                            "%s is a mediaslide with no audio, image or video!" % href)
    


    def testUstadMobileExport(self):
        # Delete the output dir
        outdir = TempDirPath()
        # Load a package
        filePath = Path("testing/ustad1.elp")
        
        package = Package.load('testing/ustad1.elp')
        self.assertIsNotNone(package, "Failed to load package")
        
        styles_dir = G.application.config.stylesDir / package.style
        xmlExport = XMLExport(G.application.config, styles_dir, outdir)
        xmlExport.export(package)
        
        mainFolder = Path(outdir/package.name)
        assert mainFolder.exists()
        
        exeTocPath = Path(mainFolder / "exetoc.xml")
        str = exeTocPath.open().read()
        from xml.dom.minidom import parse, parseString
        dom = parseString(str)
        self.assertIsNotNone(dom, "Did not parse exetoc.xml it seems")
        self.assertEqual(dom.documentElement.tagName, "exebase", "exebase is not the tag")
        audioFormatList = dom.documentElement.getAttribute("audioformats")
        videoFormatList = dom.documentElement.getAttribute("videoformats")
        resolutionList = dom.documentElement.getAttribute("resolutions")
        
        
        pageNodeList = dom.getElementsByTagName("page")
        for page in pageNodeList:
            href = page.getAttribute("href")
            pagePath = Path(mainFolder / href)
            self.assertTrue(pagePath.exists(), "FAILED: " + href + " does not exist")
            
            pageString = pagePath.open().read()
            pageDOM = parseString(pageString)
            self.assertIsNotNone(pageDOM, "Failed to read " + href + " into DOM") 
            
            ideviceListFromToc = page.getElementsByTagName("idevice")
            for ideviceEl in ideviceListFromToc:
                # look for the idevice in the DOM list of the page
                foundDeviceInPage = False
                foundIdeviceInPageEl = None
                ideviceIdFromToc = ideviceEl.getAttribute("id")
                
                ideviceListFromPage = pageDOM.getElementsByTagName("idevice")
                for ideviceElFromPage in ideviceListFromPage:
                    if ideviceElFromPage.getAttribute("id") == ideviceIdFromToc:
                        foundDeviceInPage = True
                        foundIdeviceInPageEl = ideviceElFromPage
                
                self.assertTrue(foundDeviceInPage, "idevice id " \
                                 + ideviceIdFromToc + " was not in page " + href)
            
            # procedure to check media slide
            if foundIdeviceInPageEl.getAttribute("type") == "mediaslide":
                self.doCheckMediaSlide(foundIdeviceInPageEl, href, mainFolder, package, dom.documentElement)
            
        
        
        pass


if __name__ == "__main__":
    # import sys;sys.argv = ['', 'Test.testName']
    unittest.main()
