'''
Created on Oct 6, 2014

@author: mike
'''

class BaseUserBackend(object):
    '''
    The base user backend class provides 
    '''
    
    AUTH_OK = 200
    
    AUTH_FAIL = 403
    
    AUTH_ERR = 500

    def __init__(self):
        '''
        Constructor
        '''
    def set_config(self, config):
        """
        Set the configuration parameters (e.g. from settings file)
        """
        pass
    
    
    def authenticate(self, username, password):
        '''
        Should return dictionary with
        result - AUTH_OK or AUTH_FAIL
        
        '''
        result = {'result' : BaseUserBackend.AUTH_FAIL}
        
        return result
    
    def get_base_path_for_user(self, username):
        """
        Should return the path to the base directory for the given
        user as a string
        """
        return None
    
        
    