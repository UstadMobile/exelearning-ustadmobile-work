'''
Created on Sep 29, 2014

@author: mike
'''

from textstatistics.textstatistics import TextStatistics

class ReadabilityUtil(object):
    '''
    classdocs
    '''
    
    text_idevices = {"FreeTextIdevice" : ["content"]
                     }
    

    def __init__(self, params):
        '''
        Constructor
        '''
        pass
    
    
    def get_package_readability_info(self, package):
        text = self.node_to_text(package.root)
        result = self.make_info_arr_for_text(text)
        num_pages = self.page_count(package.root)
        
        result["words_per_page"] =  {
                 "average" : round(float(result['word_count']['max'])
                                    /float(num_pages))
        }
        
        return result
    
    def make_info_arr_for_text(self, text):
        ts = TextStatistics(text)
        distinct_word_count = ts.word_count_distinct()
        total_word_count = ts.word_count()
        
        result = {
            "syllables_per_word" : {
                    "max" : ts.max_syllables_per_word(),
                    "average" : round(ts.average_syllables_per_word(), 2)
            },
            "word_count" : {
                "max" : total_word_count
            },
            "words_per_sentence" : {
                "average" : ts.average_words_per_sentence(),
                "max" : ts.max_words_per_sentence()
            },
            "different_words_total_ratio" : {
                "average" : "1:" + str(round(float(total_word_count) / 
                                        float(distinct_word_count), 2))
            },
            "num_different_words" : {
                 "max" : distinct_word_count
            }
                  
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
    