'''
Created on Mar 2, 2014

@author: mike
'''
from exe.webui.common import strip_html_to_plaintext
import urllib
import urllib2
from urllib2 import HTTPError
import base64

import json

class EXETinCan(object):
    
    def __init__(self):
        pass
    
    """Argument for WebsitePage to generate TinCan ID for an idevice"""
    IDEVICE = "idevice"
    
    """Argument for WebsitePage to generate TinCan ID for a page"""
    PAGE = "page"
    
    """Argument for WebsitePage to generate a TinCan ID for a package"""
    PACKAGE= "package"
    
    
    @classmethod
    def dump_json(cls, json_obj):
        """Dump TinCan data to JSON - do some cleanup to remove &nbsp; etc"""
        json_str = json.dumps(json_obj, ensure_ascii=False)
        json_str = json_str.replace("&nbsp", "&#160")
        
        return json_str
    
    @classmethod
    def get_tincan_prefix_for_pkg(cls, package):
        """Return the prefix/identifier"""
        return package.xapi_prefix + "/" + package.dublinCore.identifier
    
class EXETinCanAuthenticator(object):
    '''
    Authenticator against TinCan servers
    '''
    
    def __init__(self):
        pass
        
    
    def authenticate(self, username, password, xapi_url_base):
        '''
        Authenticate a user against a TinCan server - returns 200 
        OK, 403 or 500
        
        Parameters
        ----------
        username: str 
            Username to authenticate
        password: str
            Password to authenticate
        xapi_url_base : str
            The XAPI base location url e.g. http://server/xapi - should
            NOT have a trailing slash
        '''
        
        credentials = username + ":" + password
        auth_encoded = "Basic " + base64.b64encode(credentials)
        
        headers = {'X-Experience-API-Version': '1.0.1', 
                   'Authorization': auth_encoded}        
        
        url = "%s/statements?limit=1" % xapi_url_base
        
        request = urllib2.Request(url, None, headers)
        
        try:
            response = urllib2.urlopen(request)
            response_code = response.code
            return response_code
        except HTTPError as http_error:
            return http_error.code
            
    

def summarize_str_tincan(str, max_len = 64):
    """Turn a string into something that can be used for tincan
    
    keyword arguments:
    max_len -- the max
    """
    
    retval = strip_html_to_plaintext(str)
    if len(retval) > max_len:
        retval = str[0:max_len]
        
    return retval


def tincan_enclosure_header():
    """Javascript code that executes only if tincan is in use
    """
    
    return "\nif(EXETinCan){\n" 

def tincan_enclosure_footer():
    """End code that executes only if tincan is in use
    """
    
    return "\n}\n"
