'''
Created on Oct 6, 2014

@author: mike
'''
import unittest
import json
import os
import utils

from exe.engine.exetincan import EXETinCanAuthenticator
from testing.utils import TestSettingsHelper

class TestTinCan(unittest.TestCase):
    
    def setUp(self):
        pass


    def testTinCanAuthentication(self):
        test_settings = TestSettingsHelper().get_test_settings()
        
        valid_auth_result = EXETinCanAuthenticator().authenticate(
                                   test_settings['tincan_valid_user'], 
                                   test_settings['tincan_valid_pass'], 
                                   test_settings['xapi_base'])
        self.assertEqual(valid_auth_result, 200, 
                         "TinCan Valid username response=200")
        
        invalid_password = test_settings['tincan_valid_pass']+'wrong'
        
        invalid_auth_result = EXETinCanAuthenticator().authenticate(
                                   test_settings['tincan_valid_user'], 
                                   invalid_password, 
                                   test_settings['xapi_base'])
        self.assertEqual(invalid_auth_result, 401, 
                 "Invalid username want 401")
        
if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()