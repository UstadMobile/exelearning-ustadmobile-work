'''
Created on Jan 29, 2014

@author: mike
'''

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import ImageField
from exe.engine.field   import TextField
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from exe.engine.extendedfieldengine import *

log = logging.getLogger(__name__)


# ===========================================================================
class ImageMapIdevice(Idevice):
    
    persistenceVersion = 1
    
    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"Image Map"), 
             x_(u"Mike Dawson, Ustad Mobile"), 
             x_(u"""Image Map Idevice with tooltips, sound support."""), 
             "", "")
        self.emphasis = Idevice.SomeEmphasis
        self.message = ""
        
        mainFieldOrder = ["title", "instructions", "mapImg"]
        mainFieldsInfo = \
            {'title' : ['text', x_('Title'), x_('Title')],\
             'instructions' : ['textarea', x_('Instructions to show'), \
                               x_('Instructions')],\
             'mapImg' : ['image', x_('Image'), x_('Use for map background') ]
             }
        
        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldsInfo)
        self.mainFieldSet.makeFields()
        
        #The areas with coordinates
        self.map_areas = []
        
        self.add_map_area()
        
    """
    Get the scripts that we need 
    """
    def uploadNeededScripts(self):
        from exe import globals
        import os,sys
        scriptFileNames = ['imagemapidevice.js', 'jquery.imagemapster.js']
        for scriptName in scriptFileNames:
            from exe import globals 
            scriptSrcFilename = globals.application.config.webDir/"templates"/scriptName
            gameScriptFile = Path(scriptSrcFilename)
            if gameScriptFile.isfile():
                Resource(self, gameScriptFile)
        
    def add_map_area(self):
        self.map_areas.append(ImageMapAreaField(self))
   
   
class ImageMapAreaField(Field):
    
    persistenceVersion = 1
    
    def __init__(self, idevice):
        Field.__init__(self, x_("Image Map Area"), x_("Image Map Area"))
        self.idevice = idevice
        
        main_field_order = ["tooltip", "shape", "coords"]
        main_field_info = {\
           'tooltip' : ['textarea', x_('Popup tooltip'), x_('Popup tooltip')],\
           'shape' : ['choice', x_('Area Shape'), x_('Area Shape'),\
                                {'choices' : [['rect', x_('Rectangle')] ] }],\
           'coords' : ['text', "Coordinates", "Coordinates"]\
                       }
        
        self.main_fields = ExtendedFieldSet(self.idevice, \
                            main_field_order, main_field_info)
        