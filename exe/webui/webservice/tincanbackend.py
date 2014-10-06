'''
Created on Oct 6, 2014

@author: mike
'''

from exe.webui.webservice.baseuserbackend import BaseUserBackend
from exe.engine.exetincan import EXETinCan, EXETinCanAuthenticator 



class TinCanUserBackend(BaseUserBackend):
    '''
    classdocs
    '''


    def __init__(self, base_server = None):
        '''
        Constructor
        '''
        self.xapi_base = ""
    
    def set_config(self, config):
        """
        Set the configuration parameters (e.g. from settings file)
        """
        self.xapi_base = config["xapi_base"]
        
        
    def authenticate(self, username, password):
        '''
        Authenticate against a tincan server
        '''
        auth_result = EXETinCanAuthenticator().authenticate(
                                   username, password, self.xapi_base)
        
        result = {'result' : auth_result, "userid" : username}
        
        return result
    
    