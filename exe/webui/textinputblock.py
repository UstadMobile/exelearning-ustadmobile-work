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
"""
ExampleBlock can render and process ExampleIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.engine.extendedfieldengine import *
from exe.export.websiteexport import WebsiteExport

from exe.webui import common
log = logging.getLogger(__name__)


class TextInputBlock(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.mainElements = idevice.mainFieldSet.makeElementDict()

    def process(self, request):
        Block.process(self, request)
        field_engine_process_all_elements(self.mainElements, request)
        self.idevice.title = self.mainElements['title'].renderView()
    
    def renderEdit(self, style):
        html = u""
        html  = u"<div>\n"
        html += common.ideviceShowEditMessage(self)
        
        html += self.idevice.mainFieldSet.renderEditInOrder(
                    self.mainElements)
        
        html += self.renderEditButtons()
        html += u"</div>\n"
        
        return html
    
    def renderHTML(self, preview_mode = False):
        html = ""
        mainDict = self.idevice.mainFieldSet.getRenderDictionary(self.mainElements, "", preview_mode)
        
        pagename = WebsiteExport.current_page
        html += "<div class='exetextinput_container' data-exetextinput-questionid='%s'>\n" % self.id
        html += "<div class='exetextinput_instructions'>\n"
        html += mainDict['instructions']
        html += "</div>\n"
        
        html += """
        <textarea rows="%(rows)s" cols="%(cols)s"></textarea>
        """  % mainDict
        html += "</div>"
        return html
    
    def renderView(self, style):
        html = common.ideviceHeader(self, style, "view")
        html += self.renderHTML()
        html += common.ideviceFooter(self, style, "view")
        return html
    
    def renderPreview(self, style):
        html = common.ideviceHeader(self, style, "preview")
        html += self.renderHTML(preview_mode = True)
        html += common.ideviceFooter(self, style, "preview")
        return html
    
    
# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.textinputidevice import TextInputIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(TextInputBlock, TextInputIdevice)    

# ===========================================================================
