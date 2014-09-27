# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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
from exe.export.exportmediaconverter import ExportMediaConverter
from exe.export.xmlpage import XMLPage
"""
HangmanBlock can render and process HangmanIdevices as XHTML and Javascript to
make a game
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element                 import ImageElement
from exe.webui                  import common
from exe.webui.element          import TextElement
from exe.engine.extendedfieldengine import field_engine_is_delete_request

log = logging.getLogger(__name__)


# ===========================================================================
class HangmanBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.titleElement = TextElement(idevice.titleField)
        self.contentElement = TextAreaElement(idevice.content)
        self.contentElement.height = 250
        self.chanceImageElements = []

        #go through all image fields in the list and create an image element linked to that field
        for chanceImageField in idevice.chanceImageFields:
            newImgElement = ImageElement(chanceImageField)
            self.chanceImageElements.append(newImgElement)

        self.wordElements = []
        self.hintElements = []
        #go through all of the word fields and hint fields and create an 
        for wordIndex, word in enumerate(idevice.wordTextFields):
            newWordElement = TextElement(word)
            self.wordElements.append(newWordElement)
            newHintElement = TextElement(idevice.hintTextFields[wordIndex])
            self.hintElements.append(newHintElement)

        #make an element for the alphabet
        self.alphabetElement = TextElement(idevice.alphabet)

        #element for the messages that are shown to the player
        self.wrongGuessTextElement = TextAreaElement(self.idevice.wrongGuessMessageField)
        self.lostLevelTextElement = TextAreaElement(self.idevice.lostLevelMessageField)
        self.levelPassedTextElement = TextAreaElement(self.idevice.levelPasssedMessageField)
        self.gameWonTextElement = TextAreaElement(self.idevice.gameWonMessageField)
        
        self.letterButtonStyleElement = TextElement(self.idevice.letterButtonStyle)
        self.wrongLetterButtonStyleElement = TextElement(self.idevice.wrongLetterButtonStyle)
        self.rightLetterButtonStyleElement = TextElement(self.idevice.rightLetterButtonStyle)

        self.hintFieldStyleElement = TextElement(self.idevice.hintFieldStyle)
        self.wordAreaStyleElement = TextElement(self.idevice.wordAreaStyle)

        self.resetButtonTextElement = TextElement(self.idevice.resetButtonText)
        self.resetButtonStyleElement = TextElement(self.idevice.resetButtonStyle)
            

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        
        #Make sure that we don't do anything when it's time to die...
        Block.process(self, request)
        self.idevice.message = ""
        
        if field_engine_is_delete_request(request):
            return
        
        self.idevice.addGameScript()

        self.titleElement.process(request)
        self.idevice.title = self.titleElement.renderView()
        self.alphabetElement.process(request)
        self.wrongGuessTextElement.process(request)
        self.lostLevelTextElement.process(request)
        self.levelPassedTextElement.process(request)
        self.gameWonTextElement.process(request)

        self.letterButtonStyleElement.process(request)
        self.wrongLetterButtonStyleElement.process(request)
        self.rightLetterButtonStyleElement.process(request)
        self.hintFieldStyleElement.process(request)
        self.wordAreaStyleElement.process(request)

        self.resetButtonTextElement.process(request)
        self.resetButtonStyleElement.process(request)
        
        #see if we need to delete a word
        blankWords = False
        for wordIndex in range(0, len(self.wordElements)):
            if self.wordElements[wordIndex].renderView() == "":
                blankWords = True
            elif self.hintElements[wordIndex].renderView() == "":
                blankWords = True
        
        if blankWords is True:
            self.idevice.message = _("One or more words or hints are blank.  Please do not have any blank hints or words - you can delete unused ones.")
            self.idevice.edit = True
        
        
        #see if we need to add another chance
        if ("addChance"+unicode(self.id)) in request.args: 
            self.idevice.addChance()
            self.idevice.edit = True
            # disable Undo once a question has been added:
            self.idevice.undo = False
        
        if("addWord"+unicode(self.id)) in request.args:
            self.idevice.addWord()
            self.idevice.edit = True
            self.idevice.undo = False

        content = self.contentElement.process(request)
        for imgElement in self.chanceImageElements:
            imgElement.process(request)
            if "action" in request.args and request.args["action"][0] == imgElement.id:
                self.idevice.chanceImageFields.remove(imgElement.field)
                imgElement.field.idevice.undo = False
                imgElement.field.idevice.edit = True
            

        for wordElement in self.wordElements:
            wordElement.process(request)
            if "action" in request.args and request.args["action"][0] == wordElement.id:
                wordIdx = self.wordElements.index(wordElement)
                self.idevice.wordTextFields.remove(wordElement.field)
                self.idevice.hintTextFields.remove(self.hintElements[wordIdx].field)
                wordElement.field.idevice.undo = False
                wordElement.field.idevice.edit = True
        
        for hintElement in self.hintElements:
            hintElement.process(request)

        if content:
            self.idevice.content = content

    #
    # Get an TextArea render back according to mode
    def _renderHTMLElement(self, mode, element, containerId = None):
        retVal = ""
        idStr = ""
        if containerId is not None:
            idStr = " id='%s' " % containerId
        retVal += "<div %s >" % idStr
        if mode == "preview":
            retVal += element.renderPreview()
        else:
            retVal += element.renderView()
        
        retVal += "</div>"
        return retVal
    #
    # This will generate the HTML elements and javascript that will be required
    # for this to be shown as a Javascript game in the web browser
    # 
    def _renderGame(self, style, mode = "view"):
        hangmanGameId = "hangman" + self.id
        
        resPath = ""
        if mode ==  "preview":
            resPath = "/scripts/"       
        
        html = u"<script src='" + resPath + "hangman.js' type='text/javascript'></script>\n"
        html += common.ideviceHeader(self, style, mode)
        html += "<div id='hangman%(gameId)smessageStore' style='display: none'>" % {"gameId" : hangmanGameId}
        html += self._renderHTMLElement(mode, self.wrongGuessTextElement, "hmwrong" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.lostLevelTextElement, "hmlost" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.levelPassedTextElement, "hmpassed" + hangmanGameId)
        html += self._renderHTMLElement(mode, self.gameWonTextElement, "hmwon" + hangmanGameId)
        
        html += "</div>"
        

        #Go through the images and find out the max height and maxwidth
        imgMaxHeight = 0
        imgMaxWidth = 0

        for imgElement in self.chanceImageElements:
            if imgElement.field.imageResource and imgElement.field.imageResource is not None:
                if(int(imgElement.field.width) > imgMaxWidth):
                    imgMaxWidth = int(imgElement.field.width)

                if(imgElement.field.height > imgMaxHeight):
                    imgMaxHeight = int(imgElement.field.height)
        

        #Makes a javascript array of the list of words that the user has given
        #This assigned as data-hangman-words
        
        num_words = len(self.wordElements)
        word_attr = "["
        for wordIndex, word in enumerate(self.wordElements):
            word_attr += "[&#34;%(word)s&#34;, &#34;%(hint)s&#34;]" % {
                "word" : word.renderView(),
                "hint" : self.hintElements[wordIndex].renderView(), 
                }
            if wordIndex < num_words -1:
                word_attr += ","
            
        word_attr += "]"
        
        
        """Make main element to hold values for the exercise """
        html += """<div class='exehangmanblock' id=\"exe%(id)s\"
            data-hangman-id=\"%(id)s\"
            data-hangman-words=\"%(words)s\"
            data-buttonstyle-before="%(button_style_before)s"
            data-buttonstyle-correct="%(button_style_correct)s"
            data-buttonstyle-wrong="%(button_style_wrong)s"
            data-alphabet="%(alphabet)s">
            """ % {
                "id" : hangmanGameId, "words" : word_attr,
                "button_style_before" : 
                    self.letterButtonStyleElement.renderView(),
                "button_style_correct" :
                    self.rightLetterButtonStyleElement.renderView(),
                 "button_style_wrong" :
                    self.wrongLetterButtonStyleElement.renderView(),
                "alphabet":
                    self.alphabetElement.renderView()
                }
        
        html += "<div class=\"hangmanimage_series\">"
        
        #render view of these images
        for imgElement in self.chanceImageElements:
            if imgElement.field.imageResource and imgElement.field.imageResource is not None:
                
                img_str = None
            
                if mode == "view":
                    img_str = imgElement.renderView() 
                else:       
                    img_str = imgElement.renderPreview()
                
                #make it stay within what it should do on a phone
                img_str = img_str[:4] + " style='max-width: 100%' " + img_str[4:]
                
                html += img_str
       
        html += "</div>"

        messageTopMargin = (imgMaxHeight - 30) / 2
        gameWidth = max(600, imgMaxWidth)
        game_area_dict = { "gameId" : hangmanGameId, "width" : gameWidth, "height": imgMaxHeight, \
                "messagetopmargin" : messageTopMargin, 'hintStyle' : self.hintFieldStyleElement.renderView(), \
                'wordStyle' : self.wordAreaStyleElement.renderView(), 'resetText' : self.resetButtonTextElement.renderView(), \
                'resetStyle' : self.resetButtonStyleElement.renderView() }
        game_area_str ="""
<div id="%(gameId)s_gamearea" style='width: %(width)dpx; max-width: 100%%; overflow-x: hidden; margin-bottom: 130px;' class='exehangman_gamearea'>
        <div class='exehangman_alertarea' id="%(gameId)s_alertarea" 
        style='position: absolute; z-index: 10; text-align: center; border: 1px; background-color: white; width: %(width)dpx; margin-top: %(messagetopmargin)dpx; visibility: hidden'>
        &#160;
        </div>
        <div id="%(gameId)s_imgarea" style='height: %(height)dpx; z-index: 1;' class='exehangman_imgarea'>
        </div>

        <input type='text' id='%(gameId)s_hintarea' style='%(hintStyle)s width: %(width)dpx; max-width: 100%%;' class='exehangman_hintarea'/>
        <input type='text' id='%(gameId)s_wordarea' style='%(wordStyle)s width: %(width)dpx; max-width: 100%%' class='exehangman_wordarea'/>
        <div id="%(gameId)s_letterarea" class='exehangman_letterarea'>
        </div>
        <input class='exehangman_resetbutton' type='button' value='%(resetText)s' style='%(resetStyle)s' onclick='restartLevel("%(gameId)s")'/>
</div>

        """ 
        gameAreaHTML = game_area_str % game_area_dict
        html += gameAreaHTML

        return html



    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += common.ideviceShowEditMessage(self)
        
        html += """<div class='edit_inline_hint'>The Hangman activity 
        creates a game where the learner has to guess the letters in a
        word from a hint.  Everytime a letter is guessed incorrectly they
        lose a life, represented by an image (e.g. a series of pictures
        with less and less apples on a tree)
        </div>
        """
        
        html += self.titleElement.renderEdit()
        
        #show words to be guessed
        html += _("<h2>Words to Guess</h2>")
        for wordIndex in range(0, len(self.wordElements)):
            html += "<div class='idevice_item_container' style='width: 500px;'>"
            word = self.wordElements[wordIndex]
            
            html += "<table width='99%'><tr><td valign='top'>"
            html += "<strong>"
            html += _("Word %s" % str(wordIndex+1))
            html += "</strong>"
            html += self.hintElements[wordIndex].renderEdit()
            html += word.renderEdit()
            html += "</td><td valign='top' style='text-align: right'>"
            if wordIndex > 0:
                html += common.submitImage(word.id, word.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Remove This Word")) + "<br/>"
            html += "</td></tr></table>"
            html += "</div>"
        html += common.submitButton("addWord"+unicode(self.id),\
                         _("Add Word"), extra_classes="add_item_button")
        
        #render edit of these images
        for img_count in range(0, len(self.chanceImageElements)):
            imgElement = self.chanceImageElements[img_count]
            html += "<div class='idevice_item_container' style='width: 700px;'>"
            html += "<table><tr><td valign='top'>"
            html += "<strong>"
            html += "Chance %s" % str(img_count+1)
            html += "</strong>"
            html += imgElement.renderEdit()
            html += "</td><td valign='top' style='text-align: right'>"
            html += common.submitImage(imgElement.id, imgElement.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Remove This Chance"))
            html += "</td></tr></table>"
            html += "</div>"
            
        addChanceButtonLabel = _("Add Chance")
        html += common.submitButton("addChance"+unicode(self.id), \
                            addChanceButtonLabel, extra_classes="add_item_button")     
        
        html += self.contentElement.renderEdit()
        html += self.alphabetElement.renderEdit()

        #messages to show the user for different events
        html += self.wrongGuessTextElement.renderEdit()
        html += self.lostLevelTextElement.renderEdit()
        html += self.levelPassedTextElement.renderEdit()
        html += self.gameWonTextElement.renderEdit()
        html += self.resetButtonTextElement.renderEdit()

        divId = "fieldtype_advanced"  + self.id
        html += "<input name='showbox" + divId + "' type='checkbox' onchange='$(\"#" + divId + "\").toggle()'/>"
        
        html += _("Show Advanced Options") + "<br/>"
        html += "<div id='" + divId + "' style='display: none' "
        html += ">"
        
        #styles for buttons
        html += self.letterButtonStyleElement.renderEdit()
        html += self.wrongLetterButtonStyleElement.renderEdit()
        html += self.rightLetterButtonStyleElement.renderEdit()

        #style of the text fields
        html += self.hintFieldStyleElement.renderEdit()
        html += self.wordAreaStyleElement.renderEdit()

        html += self.resetButtonStyleElement.renderEdit()
        html += "</div>"
        
        

        
        html += "<br/>"

           
        html += "<br/>"
        html += self.renderEditButtons()
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self.contentElement.renderView()
        html += self._renderGame(style, mode = "preview")

        html += self.renderViewButtons()
        html += "</div>\n"
        return html

    def renderXML(self, style):
        xml = u""
        
        mediaConverter = ExportMediaConverter.getInstance()
        width = mediaConverter.getProfileWidth()
        height = mediaConverter.getProfileHeight()
        
        if mediaConverter is not None:
            for imgElement in  self.chanceImageElements:
                if imgElement.field.imageResource is not None:
                    mediaConverter.resizeImg(XMLPage.currentOutputDir/imgElement.field.imageResource.storageName, \
                         width, height, {}, {"resizemethod" : "stretch"})
        
        xml += "<idevice type='hangman' id='%s'>\n" % self.idevice.id
        xml += "<chanceimages>\n"
        for imgElement in  self.chanceImageElements:
            if imgElement.field.imageResource is not None:
                xml += "<img src='%s'/>\n" % imgElement.field.imageResource.storageName
            
        xml += "</chanceimages>\n"
        
        xml += "<alphabet>%s</alphabet>\n" % self.alphabetElement.renderView()
        xml += "<wrongguessmessage><![CDATA[ %s ]]></wrongguessmessage>\n" % self.wrongGuessTextElement.renderView()
        xml += "<lostlevelmessage><![CDATA[ %s ]]></lostlevelmessage>\n" % self.lostLevelTextElement.renderView()
        xml += "<levelpassedmessage><![CDATA[ %s ]]></levelpassedmessage>\n" % self.levelPassedTextElement.renderView()
        xml += "<gamewonmessage><![CDATA[ %s ]]></gamewonmessage>\n" % self.gameWonTextElement.renderView()
        
        xml += "<words>"
        for wordIndex in range(0, len(self.wordElements)):
            word = self.wordElements[wordIndex]
            if word != "":
                xml += "<word>\n<hint>%(hint)s</hint>\n<answer>%(answer)s</answer>\n</word>\n" \
                    % {"answer" : word.renderView() , "hint" : self.hintElements[wordIndex].renderView()}
            
        xml += "</words>\n"
        
        xml += "</idevice>\n"
        return xml


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += self.contentElement.renderView()
        html += self._renderGame(style, mode = "view")
        html += u"</div>\n"
        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.hangmanidevice import HangmanIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(HangmanBlockInc, HangmanIdeviceInc)    

# ===========================================================================
