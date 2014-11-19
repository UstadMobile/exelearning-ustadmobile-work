'''
Created on Nov 8, 2014

@author: mike
'''

from exe.webui.generichtmlblock import GenericHTMLBlock
import re

class AttemptBlock(GenericHTMLBlock):
    
    def __init__(self, parent, idevice):
        GenericHTMLBlock.__init__(self, parent, idevice)
        
    
    def renderXML(self, style, previewMode = False):
        xml = ""
        html = self.content_element.renderView()
        html_inline = html.replace("\n", "").replace("\r", "")
        re_type = re.compile('.*data-attemptidevice-type=\\"([a-z]+)\\".*')
        val_type = re_type.search(html).group(1)
        
        re_mode = re.compile('.*data-attemptidevice-mode=\\"([a-z]+)\\".*')
        val_mode = re_mode.search(html).group(1)
        
        xml += '<idevice id="%s" type="attempt">' % self.id
        xml += "<attempt type='%(type)s' mode='%(mode)s'/>" % \
            {"type" : val_type, "mode" : val_mode}
            
            
        feedback_vals_start = html.find('class="feedback_vals"')
        if feedback_vals_start != -1:
            feedback_vals_start = html.find(">", feedback_vals_start)+1
            feedback_vals_finish = html.find("</div>", feedback_vals_start)
            feedback_vals = html[feedback_vals_start:feedback_vals_finish]
            x = 0
            xml += "<feedback>" + feedback_vals +"</feedback>"
        xml += "</idevice>"
        
        return xml

"""Register this block with the BlockFactory"""
from exe.engine.attemptidevice import AttemptIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(AttemptBlock, AttemptIdevice)    

