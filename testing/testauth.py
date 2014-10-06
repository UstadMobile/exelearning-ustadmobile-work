'''
Created on Oct 6, 2014

@author: mike
'''
import unittest
from utils import TestSettingsHelper
from exe.engine.exetincan import EXETinCanAuthenticator
from exe.webui.webservice.exebackendservice import EXEBackEndService
from exe.webui.webservice.baseuserbackend import BaseUserBackend

class TestBackend(unittest.TestCase):


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
        

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testCanLoadAuth']
    unittest.main()