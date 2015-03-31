'''
Created on Sep 29, 2014

@author: mike
'''

from textstatistics.textstatistics import TextStatistics
from exe.webui.common import strip_html_to_plaintext
from exe import globals as G
import copy
import os
import json
import uuid


class ReadabilityUtil(object):
    '''
    classdocs
    '''
    
    text_idevices = {"FreeTextIdevice" : ["content"]
                     }
    
    """
    Readability parameters available in all languages - array of
    dictionaries in order they will be presented to users.  Each has an
    id field corresponding with how info is communicated to the client
    and a unit.
    """
    base_params = [{
                        "id": "word_count",
                        "unit" : "words"
                    },
                   {
                        "id" : "words_per_page_max",
                        "unit" : "words"
                    },
                    {
                        "id" : "word_length_max",
                        "unit" : "letters"
                    },
                    {
                        "id" : "sentence_length_max",
                        "unit" : "words"
                    },
                    {
                        "id" : "word_length_average",
                        "unit" : "letters" 
                    },
                    {
                        "id" : "sentence_length_average",
                        "unit" : "words"
                    },
                    {
                        "id" : "distinct_words",
                        "unit" : "words"
                    }
                    
                   ]
    """
    Extra parameters that may be available for readability in different
    languages
    """
    extra_params_by_lang = { 
                            "en" : [
                                {
                                    "id" : "syllables_per_word_max",
                                    "unit" : "syllables"
                                },
                                {
                                    "id" : "syllables_per_word_average",
                                    "unit" : "syllables"
                                 }
                            ]    
                            }
    
    @classmethod
    def get_params_by_lang(cls, lang):
        """
        Get what text params are available by language
        """
        param_result = copy.copy(ReadabilityUtil.base_params)
        if lang in ReadabilityUtil.extra_params_by_lang:
            for extra_param in ReadabilityUtil.extra_params_by_lang[lang]:
                param_result.append(extra_param) 
        
        return param_result
    
    def check_system_has_preset(self, preset_obj):
        """Check that the noted preset is present on the system
        vs. one found in a package
        """
        system_preset_obj = None
        try:
            system_preset_obj = self.get_readability_preset_by_id(preset_obj['uuid'])
        except:
            pass
        
        try:
            if system_preset_obj != preset_obj:
            #copy it in
                self.save_readability_preset(preset_obj)
        except:
            print "Error checking system has preset"

    def __init__(self, params = None):
        '''
        Constructor
        '''
        pass
    
    
    def get_package_text_json(self, package):
        return self.node_to_textinfo(package.root, [])
    
    def node_to_textinfo(self, node, dest_arr):
        this_page_contents = []
        for idevice in node.idevices:
            class_name =idevice.__class__.__name__ 
            idevice_text = ""
            if class_name in ReadabilityUtil.text_idevices:
                txt_fields = ReadabilityUtil.text_idevices[class_name]
                for field_name in txt_fields:
                    dev_content = getattr(idevice, field_name).content
                    idevice_text += strip_html_to_plaintext(dev_content)
                this_page_contents.append({ idevice.id : idevice_text})
        
        dest_arr.append({
                         'pageid' : node.id,
                         'idevices' : this_page_contents
                         })        
        
        for child in node.children:
            self.node_to_textinfo(child, dest_arr) 
        
        return dest_arr
    
    def get_package_readability_info(self, package):
        text = self.node_to_text(package.root)
        result = self.make_info_arr_for_text(text)
        num_pages = self.page_count(package.root)
        
        result["range_words_per_page"] =  {
                 "average" : round(float(result['range_word_count']['max'])
                                    /float(num_pages)),
                 "label" : x_("Words Per Page")
        }
        
        return result
    
    def make_info_arr_for_text(self, text):
        ts = TextStatistics(text)
        distinct_words = ts.get_distinct_words()
        distinct_word_count = len(distinct_words)
        
        total_word_count = ts.word_count()
        
        result = {
            "range_syllables_per_word" : {
                    "max" : ts.max_syllables_per_word(),
                    "average" : round(ts.average_syllables_per_word(), 2),
                    "label" : x_("Syllables Per Word")
            },
            "range_word_count" : {
                "max" : total_word_count,
                "label" : x_("Word Count"),
            },
            "range_words_per_sentence" : {
                "average" : ts.average_words_per_sentence(),
                "max" : ts.max_words_per_sentence(),
                "label" : x_("Words Per Sentence")
            },
            "range_different_words_total_ratio" : {
                "average" : str(round(float(total_word_count) / 
                                        float(distinct_word_count), 2)),
                 "label" : x_("Number words total per unique word")
                                             
            },
            "range_num_different_words" : {
                 "max" : distinct_word_count,
                 "label" : x_("Total number of unique words")
            },
            "info_distinct_words_in_text": distinct_words 
        }
        
        return result
    
    def page_count(self, node):
        num_pages = 1
        for child in node.children:
            num_pages += self.page_count(child)
            
        return num_pages 

        
    def node_to_text(self, node, recursive = True):
        text = ""
        for idevice in node.idevices:
            class_name =idevice.__class__.__name__ 
            if class_name in ReadabilityUtil.text_idevices:
                txt_fields = ReadabilityUtil.text_idevices[class_name]
                for field_name in txt_fields:
                    dev_content = getattr(idevice, field_name).content
                    text += dev_content
                
        for child in node.children:
            text += self.node_to_text(child)
              
        return text
    
    def _get_default_preset_dir(self):
        return G.application.config.readabilityPresetsDir
    
    def get_readability_preset_by_id(self, preset_id, extension = ".erp2", from_dir = None):
        if from_dir is None:
            from_dir = self._get_default_preset_dir()
        
        preset_filename = preset_id + extension
        preset_fh = open(from_dir/preset_filename)
        preset_obj = json.load(preset_fh, "utf-8")
        return preset_obj
    
    def save_readability_preset(self, preset_obj, extension=".erp2", from_dir = None):
        """Save the given readability preset
        if it is missing a UUID (eg newly created) then give it a UUID
        """
        if from_dir is None:
            from_dir = self._get_default_preset_dir()
        
        preset_uuid = preset_obj['uuid']
        if len(preset_uuid) == 0:
            preset_obj['uuid'] = str(uuid.uuid4())
        
        json_str = json.dumps(preset_obj, "utf-8")
        
        dest_filename = preset_obj['uuid'] + extension
        out_file = open(from_dir/dest_filename, "wb")
        out_file.write(json_str)
        out_file.flush()
        out_file.close()
        
        return preset_obj
    
    def delete_readability_preset_by_id(self, preset_id, extension = ".erp2", from_dir = None):
        if from_dir is None:
            from_dir = self._get_default_preset_dir()
        
        preset_filename = preset_id + extension
        os.remove(from_dir/preset_filename)
        return {"success" : True}
    
    def list_readability_preset_ids(self, extension_type, from_dir = None):
        """Return an array of all presets in the directory
        """
        extension = "." + extension_type
        elen = len(extension)
        result_list = []
        
        if from_dir is None:
            from_dir = G.application.config.readabilityPresetsDir
        
        for file_name in os.listdir(from_dir):
            if file_name[-elen:] == extension:
                try:
                    fh = open(from_dir / file_name, "r")
                    json_obj = json.load(fh, "utf-8")
                    fh.close()
                    result_list.append({
                            "uuid" : json_obj['uuid'],
                            "name": json_obj['name']})
                except:
                    #do nothing - junk file?
                    import traceback
                    traceback.print_last()
        
        return result_list 
                
                
    def list_readability_presets(self, extension_type):
        '''
        Will list the readability presets in the directory
        extension_type - extension without prefixed .
        '''
        extension = "." + extension_type
        result_list = []
        
        for file_name in os.listdir(G.application.config.readabilityPresetsDir):
            if file_name[-4:] == extension:
                result_list.append(file_name)
                
        
        return result_list
        
    