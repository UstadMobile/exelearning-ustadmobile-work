'''
Created on Nov 8, 2014

@author: mike
'''

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui import common

class GenericHTMLBlock(Block):
    
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.content_element = TextAreaElement(idevice.content_field)
        self.content_element.idevice = idevice
        
    def process(self, request):
        if self.id + "_htmlcontent" in request.args:
            request.args[self.content_element.id] = request.args[self.id+"_htmlcontent"]
        
        Block.process(self, request)
        self.content_element.process(request)
    
    
    def renderEdit(self, style):
        idevice_dir_name = self.idevice.get_idevice_dirname()
        html = u"<div>"
        html += common.ideviceShowEditMessage(self)
        
        html  = u"<div class='idevice_authoring_container' " \
            + "data-idevicetype='%s' " % idevice_dir_name \
            + "data-ideviceid='%s'>\n" % self.idevice.id
        
        
        # the content without wrapping div etc.
        content_html = self.content_element.field.content_w_resourcePaths
        
        html += content_html
        
        html += "</div>"
        html += "<input type='hidden' name='%s_htmlcontent'/>\n" % self.id
        html += "<input type='hidden' name='%s_resources'/>\n" % self.id
        html += self.renderEditButtons()
        html += u"</div>\n"
        
        return html

    def renderPreview(self, style):
        html = common.ideviceHeader(self, style, "preview")
        html += self.content_element.renderView()
        html += common.ideviceFooter(self, style, "preview")
        
        return html
    
    def renderView(self, style):
        html = common.ideviceHeader(self, style, "view")
        html += self.content_element.renderPreview()
        html += common.ideviceFooter(self, style, "view")
        
        return html
    
