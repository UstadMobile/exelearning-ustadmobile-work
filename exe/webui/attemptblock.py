'''
Created on Nov 8, 2014

@author: mike
'''

from exe.webui.generichtmlblock import GenericHTMLBlock

class AttemptBlock(GenericHTMLBlock):
    
    def __init__(self, parent, idevice):
        GenericHTMLBlock.__init__(self, parent, idevice)
        
    

"""Register this block with the BlockFactory"""
from exe.engine.attemptidevice import AttemptIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(AttemptBlock, AttemptIdevice)    

