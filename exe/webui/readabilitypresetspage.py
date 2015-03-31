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
import uuid

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
    
    def render_POST(self, request):
        action = None
        result = {}
        if 'action' in request.args:
            action = request.args['action'][0]
        
        if action == "savepreset":
            json_str = request.args['presetval'][0]
            json_obj = json.loads(json_str, "utf-8")
            json_obj = ReadabilityUtil().save_readability_preset(json_obj)
            
            result = {
                        "success" : True,
                        "uuid" : json_obj['uuid']
                      }
        
        return json.dumps(result)
    
    def _check_is_clean_filename(self, filename):
        """Check a filename is only letters, numbers and dots - no slashes etc"""
        filename_clean = re.sub("[^a-z0-9A-Z\\-\\.]+", "", filename)
        if filename_clean != filename:
            raise ValueError("Invalid chars in filename")
    
    def render_GET(self, request):
        action = None
        
        if 'action' in request.args:
            action = request.args['action'][0]
        
        #result that will be put into json and sent back
        result = {}
        
        if action == "list_params_by_lang":
            result = self.list_params_by_lang(request)
        elif action == "list_presets":
            result = ReadabilityUtil().list_readability_preset_ids("erp2")
        elif action == "get_preset_by_id":
            preset_id = request.args['presetid'][0]
            result = ReadabilityUtil().get_readability_preset_by_id(preset_id)
        elif action == "delete_preset_by_id":
            preset_id = request.args['presetid'][0]
            self._check_is_clean_filename(preset_id)
            result = ReadabilityUtil().delete_readability_preset_by_id(preset_id)
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
        
            