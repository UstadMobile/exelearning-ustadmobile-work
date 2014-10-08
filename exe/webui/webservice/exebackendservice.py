'''
Created on Oct 6, 2014

@author: mike
'''
from exe                         import globals as G
import os
import json
from exe.engine.path import Path


class EXEBackEndService(object):
    '''
    classdocs
    '''
    
    """
    Class variable holding a main instance
    """
    _main_instance = None
    
    @classmethod
    def get_instance(cls):
        """
        Return an instance of EXEBackEndServce
        """
        if cls._main_instance is None:
            cls._main_instance = EXEBackEndService()
            
        return cls._main_instance
    

    @classmethod
    def load_default_auth_settings(cls):
        '''
        Return default auth settings as dict
        Settings should be in configDir/auth-settings.json 
        '''
        
        config_dir = G.application.config.configDir
        config_file_path = os.path.join(config_dir, "auth-settings.json")
        config_file = open(config_file_path)
        auth_settings = json.load(config_file)
        config_file.close()
        return auth_settings
    
    @classmethod
    def load_backend_class_by_name(cls, class_name):
        '''
        Return an instance of the given class_name
        
        Parameters
        ----------
        class_name: str
            The fully qualified name of the backend class
        '''
        
        parts = class_name.split('.')
        module = ".".join(parts[:-1])
        m = __import__( module )
        for comp in parts[1:]:
            m = getattr(m, comp)
        
        backend = m()
        return backend
        

    def __init__(self, auth_config = None):
        '''
        Make the EXEAuthService run
        '''
        if auth_config is None:
            auth_config = EXEBackEndService.load_default_auth_settings()
        self.set_config(auth_config)
        
        backend_class_name = self.auth_config['auth_class_name']
        self.backend_provider = EXEBackEndService.load_backend_class_by_name(
                                                             backend_class_name)
        self.backend_provider.set_config(self.auth_config)
    
    def set_config(self, config):
        if "autocreate_user_path" not in config:
            config["autocreate_user_path"] = "0"
        
        self.auth_config = config

    
    def get_provider(self):
        """
        Return the backend provider
        """
        return self.backend_provider
    
    def authenticate_user(self, username, password):
        """
        Authenticate a user:  return dict with result and userid
        
        Parameters
        ---------
        username str
        password str
        """
        return self.backend_provider.authenticate(username, password)
        
    def authenticate_session(self, session, username, password):
        auth_result = self.authenticate_user(username, password)
        if auth_result['result'] == 200:
            session.webservice_user = auth_result['userid']
        else:
            session.webservice_user = None
            
        return auth_result
    
    def get_base_path_for_user(self, username):
        """
        Returns the base directory for the user
        """
        dir_path = self.backend_provider.get_base_path_for_user(username)
        if self.auth_config['autocreate_user_path'] == "1":
            path_obj = Path(dir_path)
            if not path_obj.exists():
                path_obj.makedirs()
        
        return dir_path
    
    def adjust_relative_path_for_user(self, username, relative_path):
        base_path = self.get_base_path_for_user(username)
        
        #Sanity check
        if relative_path == "/":
            relative_path = ""

        return os.path.join(base_path, relative_path)
        