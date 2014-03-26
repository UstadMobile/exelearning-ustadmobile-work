'''
Created on Mar 2, 2014

@author: mike
'''
from exe.webui.common import strip_html_to_plaintext

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
