from exe                     import globals
from exe.engine.package          import Package
import sys, os
from exe.engine.config import Config
from exe.engine.path import Path
from subprocess import call
from exe                      import globals as G

import ConfigParser
try:
    from PIL import Image
except:
    import Image


ENGINE_IMAGE_SIZES = [ "100x100", "240x320", "320x240", "480x640", "640x480"]
ENGINE_AUDIO_FORMATS = ["WAV", "MP3", "OGG"]
ENGINE_VIDEO_FORMATS = ["MP4", "3GP", "OGV", "MPG"]

'''
This class is designed to go over through a given exported object
and according to the media profile will convert audio, video and
images to match formats and dimensions.

This can be particularly useful for export for mobile devices

@author: mike
'''

class ExportMediaConverter(object):
    '''
    classdocs
    '''
    currentMediaConverter = None
    appConfig = None
    workingDir = None
    currentPackage = None
    autoMediaOnly = False
    

    def __init__(self):
        '''
        Constructor
        '''
        self.resizedImages = {}
        
        ExportMediaConverter.currentMediaConverter = self
    
    def setCurrentPackage(self, pkg):
            
        self.currentPackage = pkg
        
    @classmethod
    def getInstance(cls):
        return ExportMediaConverter.currentMediaConverter
    
    @classmethod
    def setWorkingDir(cls, newWorkingDir):
        ExportMediaConverter.workingDir = newWorkingDir
    """
    This will remove the html tags in the list.  Takes a list
    of tags to remove, builds a regex, then does re.sub
    """
    @classmethod
    def removeHTMLTags(cls, html, tags):
        #myRegex == re.sub('<[/]?(dir|d)[^>]*>', '', text)
        myRegex = '<[/]?('
        for i in range(len(tags)):
            myRegex += tags[i]
            if i < (len(tags) - 1):
                myRegex += '|'
        myRegex += ')[^>]*>'
        import re
        return re.sub(myRegex, '', html, 0, re.MULTILINE | re.IGNORECASE)
    
    """
    This is here to remove "HTML Whitespace" e.g. empty <p>s and such
    which are added to space out feedback but on a mobile would actually
    push the feedback out of view
    """
    @classmethod 
    def trimHTMLWhiteSpace(cls, html):
        retVal = ""
        #be rid of any line that is really just a space
        retVal = html.replace("\n&nbsp;\n", "\n")
        retVal = retVal.replace("<p>&nbsp;</p>\r\n", "")
        import re
        
        #get rid of any empty paragraph tags
        retVal = re.sub("<p.?>\s*</p>", '', retVal, re.MULTILINE | re.IGNORECASE)
        return retVal
    
        
    
    def getProfileWidth(self):
        return int(self.configParser.get("media", "maxwidth"))
    
    def getProfileHeight(self):
        return int(self.configParser.get("media", "maxheight"))
    
    """
    Calculate what the new dimensions should be
    """
    def calcNewDimensions(self, origWidth, origHeight, profWidth, profHeight, resizeStrategy):
        if resizeStrategy == "none":
            return [origWidth, origHeight]
        elif resizeStrategy == "stretch":
            return [profWidth, profHeight]
        elif resizeStrategy == "scalefit":
            scaleX = float(profWidth) / float(origWidth)
            scaleY = float(profHeight) / float(origHeight)
            fitScale = min(scaleX, scaleY)
            return [int(fitScale * origWidth), int(fitScale * origHeight)]
        
        pass
    
    
    
    '''
    This will resize an image according to the rules of this media
    profile and save it.
    
    Will only act on this image if that has not already been done
    '''
    def resizeImg(self, imgPath, maxWidth = -1, maxHeight = -1, resizeInfo = {}, mediaParams = {}):
        #if imgPath in self.resizedImages:
        #    return None
        
        sizeResults = {}
         
        img = Image.open(imgPath)
        origWidth = img.size[0]
        origHeight = img.size[1]
        
        mediaSlide = False
        if "mode" in mediaParams:
            if mediaParams["mode"] == "mediaslide":
                mediaSlide = True
        
        
        """
        check and see if we were told something before
        e.g. this has a width/height attribute
        """
        if "width" in resizeInfo:
            origWidth = resizeInfo['width']
            
        if "height" in resizeInfo:
            origHeight = resizeInfo['height']
            
        
        #go through all sizes
        for profileName in ENGINE_IMAGE_SIZES:
            xPos = profileName.find('x')
            enabled = getattr(self.currentPackage, "ustadMobileIncRes"+profileName)
            profWidth = int(profileName[:xPos])
            profHeight = int(profileName[xPos+1:])
            
            resizeStrategy = self.currentPackage.ustadMobileImageResizeStrategy
            if mediaSlide:
                newDimension = self.calcNewDimensions(origWidth, origHeight, profWidth, profHeight, resizeStrategy)
            else:
                scaleX = float(profWidth) / float(origWidth)
                scaleY = float(profHeight) / float(origHeight)
                fitScale = min(scaleX, scaleY)
                strToEval = self.currentPackage.inlineImageResizeFormula % \
                    {"fitscale" : str(fitScale)}
                scale = eval(strToEval)
                newDimension = [int(origWidth * scale), int(origHeight * scale)]
                
            newFileName = imgPath.namebase + "-" + profileName + imgPath.ext
            newPath = imgPath.parent/newFileName
            sizeResults[profileName] = newDimension
            try:
                newImg = img.resize((newDimension[0], newDimension[1]), Image.ANTIALIAS)
                newImg.save(newPath)
            except:
                #because pyclipse does weird stuff....
                print "Unexpected error:", sys.exc_info()[0]
                print "Error resizing image " + newFileName + " to " + str(newDimension[0]) + "x" + str(newDimension[1]) + "\n"
            pass
        
        return sizeResults
        #now it's done    
        
         
    '''
    Handle the image modifications stored in longdesc 
    '''
    def handleImageVersions(self, htmlContent, mediaParams = {}):
        startIndex = 0
        htmlContentLower = htmlContent.lower()
        isMediaMode = False
        if "mode" in mediaParams:
            if mediaParams["mode"] == "mediaslide":
                isMediaMode = True
        
        #figure out which image version we are using in this profiles
        startIndex = self._findNextTagStart(htmlContentLower, startIndex, ['img'])
        
        while startIndex != -1:
            # Use a regex here - match inside the image tag and get the numbered
            # backreference
            
            imgSrc = self._getSrcForTag(htmlContent, startIndex)
            
            currentWidth = self._getTagAttribVal(htmlContent, "width", startIndex)
            currentHeight = self._getTagAttribVal(htmlContent, "height", startIndex)
            
            resizeParams = {}
            
            if currentWidth is not None:
                resizeParams['width'] = int(currentWidth)
            if currentHeight is not None:
                resizeParams['height'] = int(currentHeight)
            
            imgPath = ExportMediaConverter.workingDir/imgSrc
            resizeResult = None
            
            htmlContentLower = htmlContent.lower()
            endOfTagIndex = htmlContentLower.find(">", startIndex);
            tagContent = htmlContent[startIndex:endOfTagIndex+1]
            
             
            if imgPath in self.resizedImages:
                resizeResult = self.resizedImages[imgPath] #here should add the -res to it
            else:
                resizeResult = self.resizeImg(imgPath, -1, -1, resizeParams, mediaParams)
            
                    
            if resizeResult is not None:
                widthAttribInfo = {}
                heightAttribInfo = {}
                
                altSizeStr = ""
                for resProfileName, resProfileValue in resizeResult.iteritems():
                    altSizeStr += resProfileName + ":" + str(resProfileValue[0]) + "," + str(resProfileValue[1]) + ";" 
                
                altSizeStr = " data-ustadsizes='" + altSizeStr + "' "
                
                newTagContent = tagContent.strip()
                tagEnding = ">"
                if newTagContent[len(newTagContent)-2:] == "/>":
                    tagEnding = "/>"
                
                newTagContent = newTagContent[:len(newTagContent)-len(tagEnding)] \
                    + altSizeStr + tagEnding 
                
                htmlContent = htmlContent[:startIndex] + newTagContent + htmlContent[endOfTagIndex+1:]
                endOfTagIndex = startIndex + len(newTagContent)
                
                """
                widthAttr = self._getTagAttribVal(htmlContent, "width", startIndex, widthAttribInfo)
                if widthAttr is not None:
                    htmlContent = htmlContent[:widthAttribInfo['start']] \
                        + " width=\"" + str(resizeResult[0]) + "\" " \
                        + htmlContent[widthAttribInfo['stop']:]
                        
                heightAttr = self._getTagAttribVal(htmlContent, "height", startIndex, heightAttribInfo)
                if heightAttr is not None:
                    htmlContent = htmlContent[:heightAttribInfo['start']] \
                        + " height=\"" + str(resizeResult[1]) + "\" " \
                        + htmlContent[heightAttribInfo['stop']:]
                """
            
                    
            
            """ 
            import re
            longDesc = re.sub(re.compile(r'<img (.*) longdesc\s*?=\s*?(\'|")(.*)(\'|").*>', re.MULTILINE), r'\3', tagContent)
            
            quoteUsed = re.sub(re.compile(r'<img (.*) longdesc\s*?=\s*?(\'|")(.*)(\'|").*>', re.MULTILINE), r'\2', tagContent)
            
            if longDesc != tagContent:
                # We have found something - try and explode it into key/value pairs
                nextQuotePos = longDesc.find(quoteUsed, 2) 
                if nextQuotePos != -1:
                    longDesc = longDesc[:nextQuotePos]
                
                
                longDescParts = longDesc.split(";")
                #for cropping an image
                clipPropertyNames = ["x", "y", "width", "height"]
                clipParams = {"x" : -1, "y": -1, "width": -1, "height": -1}
                
                #scaling param
                scale = 1
                #if we need to change it to use some other image
                altSrc = None
                
                #split this value: value pair
                for currentPart in longDescParts:
                    currentKeyValPair = currentPart.split(":")
                    currentKey = currentKeyValPair[0].strip()
                    currentVal = currentKeyValPair[0].strip()
                    
                    #find out for which profile this is (e.g. portrait, landscape, or square)
                    dashPos = currentKey.find("-")
                    if dashPos == -1:
                        continue
                    
                    profileName = currentKey[:dashPos]
                    if profileName == screenProfile:
                        propertyName = currentKey[dashPos+1:]
                        if propertyName == "altsrc":
                            altSrc = currentVal
                        elif propertyName == "clip":
                            clipVals = currentVal.split(",")
                            for i in range(len(clipVals)):
                                clipParams[clipPropertyNames[i]] = int(clipVals[i])
                        elif propertyName == "scale":
                            scale = float(currentVal)        
                    
                    #if there is an alt src - no processing - just replace
                    if altSrc is not None:
                        
                        firstQuote = currentVal.find("'")
                        lastQuote = currentVal.rfind("'")
                        newSrc = currentVal[firstQuote:lastQuote]
                        if newSrc[:len('resources/')] == 'resources/':
                            newSrc = newSrc[len('resources/'):]
                            
                        replacedTagContent = tagContent.replace(imgSrc, newSrc)
                        lengthNow = len(htmlContent)
                        
                        htmlContent = htmlContent[:startIndex] + replacedTagContent \
                            + htmlContent[endOfTagIndex + 1]
                        endOfTagIndex = startIndex + len(replacedTagContent)
            """
            #do an else here to find those that don't have any special instructions
                    
            startIndex = endOfTagIndex + 1
            startIndex = self._findNextTagStart(htmlContentLower, startIndex, ['img'])
            
        return htmlContent
                    
    
    
    def reprocessHTML(self, html):        
        htmlContentMediaAdapted = self.handleAudioVideoTags(html)
        htmlContentMediaAdapted = self.handleImageVersions(htmlContentMediaAdapted)
        return htmlContentMediaAdapted
        
    
    def runConversionCmd(self, inFilePath, targetFormat, conversionCommandBase):
        workingDir = Path(inFilePath).parent
        mediaName = inFilePath.name
        import os
        mediaBaseName = os.path.splitext(mediaName)[0] 
        newFileName = mediaBaseName + "." + targetFormat
        outFilePath = workingDir + "/" + newFileName
        
        cmdEnv = {'PATH' : os.environ['PATH'] }
        
        exeDir = globals.application.config.exePath.parent
        mediaToolsDir = str(exeDir/"mediaconverters")
        if sys.platform[:3] == "win":
            cmdEnv['PATH'] = mediaToolsDir + os.pathsep + cmdEnv['PATH']
            cmdEnv['SYSTEMROOT'] = os.environ['SYSTEMROOT']
            
        conversionCommand = conversionCommandBase  \
                % {"infile" : mediaName, "outfile" : newFileName}
        print "Converting: run %s\n" % conversionCommand
        call(conversionCommand, shell=True, cwd=workingDir, env=cmdEnv)
        pass
    
    '''
    This should go through and detect audio and video tags,
    then perform the appropriate conversions.
    
    Will then rewrite the source attribute and return a corrected
    string with the html
    
    htmlContent - the content of the HTML to process
    workingDir - the directory where the input files will be and output files should
    be saved to
    '''
    def handleAudioVideoTags(self, htmlContent, mediaParams = {}):
        htmlContentLower = htmlContent.lower()
        
        tagNames = ['audio', 'video']
        
        countAudio = 0
        countVideo = 0
        audioInFile = ""
        videoInFile = ""
        videoOutFile = ""
        
        startIndex = 0
        while startIndex != -1:
            startIndex = self._findNextTagStart(htmlContentLower, startIndex, tagNames)
            if startIndex == -1:
                break
            
            tagName = htmlContentLower[startIndex+1:startIndex+6]
            
            mediaName = self._getSrcForTag(htmlContent, startIndex)
            
            #find the media base name without the extension and the current extension
            mediaNameParts = os.path.splitext(mediaName)
            if len(mediaNameParts) < 2:
                #does not have a file extension - confused!
                #TODO: More warning stuff here
                break
            
            mediaBaseName = mediaNameParts[0]
            mediaExtension = mediaNameParts[1][1:].lower()
            workingDir = ExportMediaConverter.workingDir
            conversionCommandBase = ""
            inFilePath = workingDir/mediaName
                
            
            #handle audio conversion
            if tagName == "audio":
                #new way of doing things - we go through all the formats - and then convert
                for formatName in ENGINE_AUDIO_FORMATS:
                    if formatName.lower() == mediaExtension:
                        #we already have it - this is the original format - skip
                        continue
                    
                    #is this included in package
                    propName = "ustadMobileAudio" + formatName
                    if getattr(self.currentPackage, propName):
                        #ok - we need to convert this
                        convertCmd = getattr(G.application.config, "audioMediaConverter_" + formatName.lower())
                        print "We should run %(cmd)s to convert %(infile)s\n" % \
                            {"cmd" : convertCmd, "infile" : str(inFilePath)}
                        self.runConversionCmd(inFilePath, formatName.lower(), convertCmd)
                
                
                
                countAudio = countAudio + 1
                """
                This is obsolete
                targetFormat = self.configParser.get("media", "audioformat")
                
                if targetFormat == "au":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_au
                elif targetFormat == "mp3":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_mp3
                elif targetFormat == "ogg":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_ogg
                elif targetFormat == "wav":
                    conversionCommandBase = ExportMediaConverter.appConfig.audioMediaConverter_wav
                """
            if tagName == "video":
                #new way of doing things - we go through all the formats - and then convert
                for formatName in ENGINE_VIDEO_FORMATS:
                    if formatName.lower() == mediaExtension:
                        #we already have it - this is the original format - skip
                        continue
                    
                    #is this included in package
                    propName = "ustadMobileVideo" + formatName
                    if getattr(self.currentPackage, propName):
                        #ok - we need to convert this
                        convertCmd = getattr(G.application.config, "videoMediaConverter_" + formatName.lower())
                        print "We should run %(cmd)s to convert %(infile)s\n" % \
                            {"cmd" : convertCmd, "infile" : str(inFilePath)}
                        self.runConversionCmd(inFilePath, formatName.lower(), convertCmd)
                
                countVideo = countVideo + 1
                """
                
                This part is obsolete
                targetFormat = self.configParser.get("media", "videoformat")
                
                if targetFormat == "3gp":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_3gp
                elif targetFormat == "mpg":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_mpg
                elif targetFormat == "ogv":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_ogv
                elif targetFormat == "avi":
                    conversionCommandBase = ExportMediaConverter.appConfig.videoMediaConverter_avi
                """
            
            """
            This is obsolete
            newFileName = mediaBaseName + "." + targetFormat
            outFilePath = workingDir + "/" + newFileName
            if tagName == "audio":
                audioInFile = mediaName
            elif tagName == "video":
                videoInFile = mediaName
                videoOutFile = newFileName
            
            workingDir = Path(inFilePath).parent
            
            cmdEnv = {'PATH' : os.environ['PATH'] }
            
            exeDir = globals.application.config.exePath.parent
            mediaToolsDir = str(exeDir/"mediaconverters")
            if sys.platform[:3] == "win":
                cmdEnv['PATH'] = mediaToolsDir + os.pathsep + cmdEnv['PATH']
                cmdEnv['SYSTEMROOT'] = os.environ['SYSTEMROOT']
                
            conversionCommand = conversionCommandBase  \
                    % {"infile" : mediaName, "outfile" : newFileName}
            print "Converting: run %s\n" % conversionCommand
            call(conversionCommand, shell=True, cwd=workingDir, env=cmdEnv)
            htmlContent = htmlContent.replace(mediaName, newFileName)
                    
            # go forward so we don't find the same one again
            """
            startIndex = startIndex + 1
        
        #see if we have one audio and one video - in which case auto mix them
        """
        Semi obsolete - the mixer
        
        if countVideo == 1 and countAudio == 1:
            audioInFileAbs = workingDir + "/" + audioInFile
            videoInFileAbs = workingDir + "/" + videoInFile
            combinedOutFile = workingDir + "/" + videoOutFile
            
            print "Mixing Video/Audio"
            mixCommand = ExportMediaConverter.appConfig.ffmpegPath + " -i %(audioin)s -i %(videoin)s -s qcif -vcodec h263 -acodec libvo_aacenc -ac 1 -ar 8000 -r 25 -ab 32 -y -aspect 4:3 %(videoout)s" \
                % { "audioin" : audioInFileAbs, "videoin" : videoInFileAbs, "videoout" : combinedOutFile}
                
            print "Running command %s \n" % mixCommand   
            
            call(mixCommand, shell=True)
        """
        
        #remove the <script part that exe made for FF3- compatibility
        #TODO: potential case sensitivity issue here -but exe always makes lower case...
        startScriptIndex = self._findNextTagStart(htmlContent, 0, ["script"])
        if startScriptIndex != -1:
            endScriptIndex = htmlContent.find("</script>") + 9
            htmlContent = htmlContent[:startScriptIndex] + htmlContent[endScriptIndex:]
        
        return htmlContent    
    
    '''
    Find the first auto play audio in a given set of HTML content and return the 
    URI -  assume that this is the audio that should be played for a given item.
    TODO: Fix me to check autoplay
    '''
    def findAutoAudio(self, htmlStr):
        tagNames = ['audio']
        startIndex = self._findNextTagStart(htmlStr.lower(), 0, tagNames)
        if startIndex != -1:
            return self._getSrcForTag(htmlStr, startIndex)
        else:
            return None
        
    """
    If the HTML string has an audio element in it return 
    audio="uri"
    else return blank
    """
    def makeAudioAttrs(self, htmlStr):
        audioSrc = self.findAutoAudio(htmlStr)
        if audioSrc is not None:
            return " audio=\"%s\" " % audioSrc
        else:
            return ""
        
        
    
    '''
    Fix me - make sure to put a loop in that will check there is an equals sign
    after the start pos of the attrib value
    '''
    def _getTagAttribVal(self, htmlStr, attribName, tagStartPos, attribSearchInfo = {}):
        htmlLCase = htmlStr.lower()
        
        foundStart = False
        while foundStart == False:
            srcAttribPos = htmlLCase.find(attribName, tagStartPos)
            equalSignPos = htmlLCase.find("=", srcAttribPos)
            
            if equalSignPos == -1:
                #something quite wrong - it's not really here
                return None
            
            endAttribPos = srcAttribPos + len(attribName)
            
            #if we find a character in between the end of the attrib name and 
            #  the equals sign it means we are in the wrong place really...
            foundBadChar = False
            
            for i in range(endAttribPos, equalSignPos):
                if not htmlLCase[i:i+1].isspace():
                    foundBadChar = True
                    
            
            if foundBadChar == False:
                foundStart = True
            else:
                tagStartPos = srcAttribPos + len(attribName) + 1
            
            
        
        
        if srcAttribPos == -1:
            return None
        
        singleQuotePos = htmlLCase.find("'", srcAttribPos)
        doubleQuotePos = htmlLCase.find("\"", srcAttribPos)
        
        """
        Go through the tag - find the first quote after 
        """
        startAttribVal = -1
        quoteUsed = ""
        if singleQuotePos != -1 and ( doubleQuotePos == -1 or singleQuotePos < doubleQuotePos ):
            startAttribVal = singleQuotePos
            quoteUsed = "'"
        
        if doubleQuotePos != -1 and ( singleQuotePos == -1 or doubleQuotePos < singleQuotePos ):
            startAttribVal = doubleQuotePos
            quoteUsed = "\""
        
        # This does not seem to have a src attribute    
        if startAttribVal == -1:
            return None
        
        endSrcVal = htmlLCase.find(quoteUsed, startAttribVal + 1)
        attribVal = htmlStr[startAttribVal+1:endSrcVal]
        
        attribSearchInfo['start'] = srcAttribPos
        attribSearchInfo['stop'] = endSrcVal + 1
        
        return attribVal
    
    '''
    Find the src attribute for an audio or video tag
    '''
    def _getSrcForTag(self, htmlStr, tagStartPos):
        htmlLCase = htmlStr.lower()
        srcAttribPos = htmlLCase.find("src", tagStartPos)
        
        singleQuotePos = htmlLCase.find("'", srcAttribPos)
        doubleQuotePos = htmlLCase.find("\"", srcAttribPos)
        
        """
        Go through the tag - find the first quote after 
        """
        startAttribVal = -1
        quoteUsed = ""
        if singleQuotePos != -1 and ( doubleQuotePos == -1 or singleQuotePos < doubleQuotePos ):
            startAttribVal = singleQuotePos
            quoteUsed = "'"
        
        if doubleQuotePos != -1 and ( singleQuotePos == -1 or doubleQuotePos < singleQuotePos ):
            startAttribVal = doubleQuotePos
            quoteUsed = "\""
        
        # This does not seem to have a src attribute    
        if startAttribVal == -1:
            return None
        
        endSrcVal = htmlLCase.find(quoteUsed, startAttribVal + 1)
        attribVal = htmlStr[startAttribVal+1:endSrcVal]
        return attribVal
        
        
    
    '''
    This will go through a set of html to find where a tag is 
    starting
    '''    
    def _findNextTagStart(self, htmlContent, startIndex, tagNames):
        htmlContent = htmlContent.lower()
        lowestFound = -1
        for tagName in tagNames:
            startThisTag = htmlContent.find("<" + tagName, startIndex)
            if startThisTag != -1 and ( startThisTag < lowestFound or lowestFound == -1 ): 
                lowestFound = startThisTag
        
        return lowestFound
        
        
