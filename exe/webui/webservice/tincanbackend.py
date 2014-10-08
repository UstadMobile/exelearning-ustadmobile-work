'''
Created on Oct 6, 2014

@author: mike
'''

from exe.webui.webservice.baseuserbackend import BaseUserBackend
from exe.engine.exetincan import EXETinCan, EXETinCanAuthenticator 
from exe import globals as G



class TinCanUserBackend(BaseUserBackend):
    '''
    classdocs
    '''


    def __init__(self, base_server = None):
        '''
        Constructor
        '''
        self.xapi_base = ""
        self.user_dir_path = ""
    
    def set_config(self, config):
        """
        Set the configuration parameters (e.g. from settings file)
        """
        self.xapi_base = config["xapi_base"]
        self.user_dir_path = config["user_dir_path"]
        
        
    def authenticate(self, username, password):
        '''
        Authenticate against a tincan server
        '''
        auth_result = EXETinCanAuthenticator().authenticate(
                                   username, password, self.xapi_base)
        
        result = {'result' : auth_result, "userid" : username}
        
        return result
    
    
    def get_base_path_for_user(self, username):
        """
        Will return based on the configuration variable 
        user_dir_path where %(username)s will be replaced
        by the username, %(configpath) will be replaced with config
        path
        """
        return self.user_dir_path % {"username" : username } 
    
    