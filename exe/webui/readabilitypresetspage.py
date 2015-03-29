'''
Created on Sep 30, 2014

@author: mike
'''

import logging
import json
from twisted.web.resource      import Resource
from exe.webui.renderable      import RenderableResource
from exe.engine.readabilityutil import ReadabilityUtil
from exe.engine.path import Path
import os.path
from exe import globals as G
import re

class ReadabilityPresetsPage(RenderableResource):
    '''
    This page delivers AJAX for the ReadabilityBoundariesPanel to list
    the installed readability presets for levelled and decodeable 
    readers
    '''
    name = 'readabilitypresets'

    def __init__(self, parent):
        '''
        Constructor
        '''
        RenderableResource.__init__(self, parent)
        
    def render_GET(self, request):
        action = None
        
        if 'action' in request.args:
            action = request.args['action'][0]
        
        #result that will be put into json and sent back
        result = {}
        
        if action == "list_params_by_lang":
            result = self.list_params_by_lang(request)
        else:
            extension_req = request.args['type'][0]
            extension_clean = re.sub("[^a-z0-9]+", "", extension_req)
            if extension_clean != extension_req:
                raise ValueError("Can only allow letters and numbers in extension")
             
            readability_presets = ReadabilityUtil().list_readability_presets(extension_req)
            
            result['rootList'] = []
            for preset_name in readability_presets:
                result['rootList'].append({"filename" : preset_name, "basename" : preset_name})
            
        return json.dumps(result)
    
    def list_params_by_lang(self, request):
        lang_code = request.args['lang'][0]
        return ReadabilityUtil.get_params_by_lang(lang_code)
        
            