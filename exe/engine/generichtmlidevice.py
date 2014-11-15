'''
Created on Nov 8, 2014

@author: mike
'''

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField


class GenericHTMLIdevice(Idevice):
    """This is a base class for idevices that use scripts to take 
    care of editing.
    """
    
    persistenceVersion = 1
    
    def __init__(self, title="", author="", instructions=""):
        Idevice.__init__(self, title, 
                         author, 
                         instructions, "", "")
        default_content = "<div data-idevice-type='%s'></div>" % \
            self.get_idevice_dirname()
        self.content_field = TextAreaField("content_field", "help", 
                                           content= default_content)
        self.message = ""
        self.emphasis = Idevice.SomeEmphasis
        device_name = self.get_idevice_dirname()
        #add this script to the list that needs copied
        script_src = "htmlidevices/%(name)s/%(name)s.js" % {
                                     "name" : device_name}
        self.system_scripts = [script_src]
        
    def get_idevice_dirname(self):
        """This should be overriden by the child"""
        return str(self.__class__.__name__).lower()
