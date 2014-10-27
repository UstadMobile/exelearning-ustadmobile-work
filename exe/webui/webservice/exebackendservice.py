'''
Created on Oct 6, 2014

@author: mike
'''
from exe                         import globals as G
import os
import json
from exe.engine.path import Path
import copy
import logging

log = logging.getLogger(__name__)

class EXEBackEndService(object):
    '''
    classdocs
    '''
    
    """
    Class variable holding a main instance
    """
    _main_instance = None
    
    """
    Relative path from user base directory to save preferences
    """
    PREF_PATH = ".exe/exe.conf"
    
    
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
            log.info("User Login user=%s" % session.webservice_user)
        else:
            session.webservice_user = None
            
        return auth_result
    
    def get_base_path_for_user(self, username):
        """
        Returns the base directory for the user
        Parameters
        ----------
        username : str
        The username to get the base path for
        """
        dir_path = self.backend_provider.get_base_path_for_user(username)
        if self.auth_config['autocreate_user_path'] == "1":
            path_obj = Path(dir_path)
            if not path_obj.exists():
                path_obj.makedirs()
        
        return dir_path
    
    def adjust_relative_path_for_user(self, username, relative_path):
        """
        Return the complete path for a path relative to a users base directory
        
        Parameters
        ----------
        username : str 
        relative_path : str
            Path from a user base directory eg. /dir/file.elp  no root
            file access allowed - all paths are joined to the base
        """
        base_path = self.get_base_path_for_user(username)
        
        #Sanity check - get rid of any separators at the start
        while len(relative_path) > 0 and relative_path[0] == "/":
            relative_path = relative_path[1:]

        return os.path.join(base_path, relative_path)
    
    def abs_path_to_user_path(self, username, abspath):
        """
        Strip out the prefix of the users file path
        
        Parameters
        ----------
        username : str
            Username to apply to
        abspath : str
            Absolute path in a users directory to be adjusted to be 
            relative
        """
        user_path = self.get_base_path_for_user(username)
        rel_path = Path(user_path).relpathto(abspath)
        return rel_path
    
    def get_user_preference_path(self, username):
        """
        Return the path to user preferences
        """
        return self.adjust_relative_path_for_user(username, 
                                       EXEBackEndService.PREF_PATH)
    
    def adjust_config_for_user(self, username, config):
        """
        Return config object adjusted for the user
        
        Parameters
        ----------
        username : str
        config : Config
            Main app configuration - will be copied
        """
        new_config = copy.copy(config)
        config_src = self.get_user_preference_path(username)
        config_path = Path(config_src)
        user_config_vals = {}
        if config_path.exists():
            config_file = open(config_path)
            user_config_vals = json.load(config_file)
            config_file.close()
             
        new_config.override_settings(user_config_vals)
        new_config.webservice_user = username
        new_config.configParser.set_on_write(new_config.onWriteWebUser)
        
        return new_config
    
    def save_user_preferences(self, config):
        """
        Save user specific preferences to the user specific location
        
        Parameters
        ----------
        config : Config
            Config that should have the webservice_user set
        """
        username = config.webservice_user
        pref_path = Path(self.get_user_preference_path(username))
        if not pref_path.parent.isdir():
            pref_path.parent.makedirs()
            
        user_pref_file = open(self.get_user_preference_path(username), "wb")
        json_vals = config.get_override_setting_json()        
        json.dump(json_vals, user_pref_file)
        user_pref_file.close()
        
    