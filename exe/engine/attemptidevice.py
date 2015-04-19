'''
Created on Nov 8, 2014

@author: mike
'''
from exe.engine.generichtmlidevice import GenericHTMLIdevice

class AttemptIdevice(GenericHTMLIdevice):
    
    persistenceVersion = 1
    
    def __init__(self):
        GenericHTMLIdevice.__init__(self, _("Start/Finish Scoring"), 
                                "Mike Dawson, UstadMobile", 
                                "Used to start/finish TinCan scoring")
        
    def get_idevice_dirname(self):
        return str(self.__class__.__name__).lower()
    
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(AttemptIdevice())
    