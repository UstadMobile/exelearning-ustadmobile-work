'''
Created on Oct 6, 2014

@author: mike
'''
import unittest
from utils import TestSettingsHelper
from exe.webui.webservice.exebackendservice import EXEBackEndService
from exe.webui.webservice.baseuserbackend import BaseUserBackend
from exe.engine.path import Path

class TestBackend(unittest.TestCase):
    """
    Test Web Services Backend systems
    """

    def testCanLoadBackEndClass(self):
        """
        Test that the backend class loader works and loads
        """
        kls_name = "exe.webui.webservice.tincanbackend.TinCanUserBackend"
        kls = EXEBackEndService.load_backend_class_by_name(kls_name)
        self.assertTrue(isinstance(kls, BaseUserBackend))
        
    def testBackEndFromConfig(self):
        """
        Test that the backend can load and authenticate given settings
        """
        test_settings = TestSettingsHelper().get_test_settings()
        backend_service = EXEBackEndService(test_settings['auth_settings'])
        self.assertTrue(isinstance(backend_service.get_provider(), 
                                   BaseUserBackend), 
                                   "Backend provider loads from config")
        user_auth_result = backend_service.authenticate_user(
                                     test_settings["auth_valid_user"],
                                     test_settings["auth_valid_pass"])
        self.assertEqual(user_auth_result["result"], 200, 
                         "Valid user auth code 200")
        self.assertEqual(user_auth_result["userid"],
                         test_settings["auth_valid_user"],
                         "UserID matches provided valid user")
        
    def testBackEndUserDirs(self):
        """
        Test finding and auto creating user directories
        """
        
        test_settings = TestSettingsHelper().get_test_settings()
        backend_service = EXEBackEndService(test_settings['auth_settings'])
        
        user_dir = backend_service.get_base_path_for_user(
                                      test_settings['auth_valid_user'])
        dir_path = Path(user_dir)
        
        self.assertIsNotNone(user_dir, "Got something like a valid user dir")
        
        #test auto creating a directory
        test_settings['autocreate_user_path'] = "1"
        backend_service.set_config(test_settings)
        
        user_dir = backend_service.get_base_path_for_user(
                                      test_settings['auth_valid_user'])
        dir_exists= dir_path.isdir()
        self.assertTrue(dir_exists, "Auto created directory exists")
        dir_path.rmtree()
        
        self.assertFalse(dir_path.isdir(), 
                         "Directory removed after autocreate")
        
        test_settings['autocreate_user_path'] = "0"
        user_dir = backend_service.get_base_path_for_user(
                                      test_settings['auth_valid_user'])
        
        self.assertFalse(dir_path.exists(), 
                     "Directory not created with autocreate disabled")
        
        
        

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testCanLoadAuth']
    unittest.main()