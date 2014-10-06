'''
Created on Oct 6, 2014

@author: mike
'''

from exe.webui.webservice.baseuserbackend import BaseUserBackend
from exe.engine.exetincan import EXETinCan


class TinCanUserBackend(BaseUserBackend):
    '''
    classdocs
    '''


    def __init__(self, base_server = None):
        '''
        Constructor
        '''
        
        
    def authenticate(self, username, password):
        '''
        Authenticate against a tincan server
        '''
        auth_result = EXETinCan().auth
        
        result = {'result' : BaseUserBackend.AUTH_FAIL}
        
        return result
    
    