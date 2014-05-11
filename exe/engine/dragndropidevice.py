'''
Created on Mar 28, 2014

@author: mike
'''

import logging
from exe.engine.idevice import Idevice
from exe.engine.extendedfieldengine import *


class DragNDropIdevice(Idevice):
    
    persistenceVersion = 1
    
    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"Drag And Drop"), 
                         x_(u"Ustad Mobile."), 
                         x_(u"""Drag/Drop items to correct locations."""), "", "")
        self.emphasis = Idevice.SomeEmphasis
        self.short_desc = "Learner has to drag and drop items into correct places"
        self.message = ""
        
        main_field_order = ["title", "instructions", "positivefeedback",\
                             "negativefeedback","mainImg", "scale"]
        
        
        fb_positive_help_msg = x_("""Enter the default 
                            feedback that will appear when an area is 
                             dragged into the correct drop target
                              area (e.g. feedback is set to by question""")
        
        fb_negative_help_msg = x_("""Enter the default 
                            feedback that will appear when an area is 
                             dragged outside the correct drop target
                              area (e.g. feedback is set to by question""")
        main_field_info  = \
            {'title' : ['text', x_('Title'), x_('Title'),
                        {"default_prompt" : x_("Type your title here")}],\
             'instructions' : ['textarea', x_('Instructions to show'), \
                               x_('Instructions'), 
                               {"default_prompt" : x_("Enter instructions for students here.  You can add images, media, etc. too.")}],\
             'mainImg' : ['image', x_('Background'), x_('Background'),
                          {"defaultval" : "exe_dnd_defaultbackgroundworld.jpg"} ],\
             'positivefeedback' : ['textarea',\
                               x_('Default Correct Answer Feedback'),\
                               fb_positive_help_msg,
                                {"default_prompt" : fb_positive_help_msg}],
             'negativefeedback' : ['textarea',\
                               x_('Default Wrong Answer Feedback'),\
                               fb_negative_help_msg, 
                               {"default_prompt" :fb_negative_help_msg }],\
             'scale' : ['choice', x_('Auto Resize'), \
                          x_('Auto Resize'),{"choices" : \
                         [['scaletofit', x_('Resize to fit screen width')],\
                         ['fixed', x_('Fixed')]]}]
             }
            
        self.area_fields = []
        
        self.main_fields = ExtendedFieldSet(self, main_field_order, main_field_info)
        self.main_fields.makeFields()
        
        self.system_scripts = ["exedragndrop.js", \
                                        "jquery-ui-1.10.4.custom.min.js"]
        
        self.add_area_fields(2)
        
    def add_area_fields(self, num_to_add = 1):
        """Add the specified number of area fields"""
        for i in range(0, num_to_add):
            newDndField = DragNDropAreaField(self)
            self.area_fields.append(newDndField)
            newDndField.field_num = str(len(self.area_fields))
            space_needed = str(i*120)
            newDndField.main_fields.makeFields()
            newDndField.main_fields.fields['coords'].content = \
                "%s,%s,100,100" % (space_needed, space_needed)
            
        

class DragNDropAreaField(Field):
    
    persistenceVersion = 1
    
    def __init__(self, idevice):
        Field.__init__(self, x_("Drag N Drop Field"), x_("Drag N Drop Field"))
        self.idevice = idevice
        
        main_field_order = ["type", "image", "richtext", "plaintext", \
                    "coords", "exetarget", "feedbacktype", \
                    "positivefeedback", "negativefeedback"]
        main_field_info = {\
           'type' : ['choice', x_('Content Type'), x_('Content Type'),\
                                {'choices' : [['richtext', x_('Rich Text')],\
                                      ['image', x_('Image')],\
                                      ['plaintext', x_('Plaintext') ] ] }],\
           'image' : ['image', x_('Image'), x_('Image for element')],\
           'richtext' : ['textarea', x_('Content'), x_('Content'),
                         {'default_prompt' : x_('Enter text, images, or media to appear inside this area')}],\
           'plaintext' : ['text', x_("Content"), x_("Content"),
                          {"default_prompt" : x_('Enter text to appear inside this area')}],\
           'feedbacktype' : ['choice', x_("Feedback Type"), x_("Feedback Type"),\
                             {"choices" : [['none', x_("No Feedback")],\
                                      ['question', x_("Use Question Default Feedback") ],\
                                      ['peranswer', x_("Use Feedback specific to this area")]]}],\
           'positivefeedback' : ['textarea', x_('Correct Answer Feedback'), \
                                 x_('Feedback on correct answer'),
                                 {"default_prompt" : """Enter the feedback 
                                 that will appear when this area is 
                                 dragged into the correct drop target
                                  area"""}],\
           'negativefeedback' : ['textarea', x_('Wrong Answer Feedback'), \
                                 x_('Feedback on wrong answer'),
                                 {"default_prompt" : """Enter the feedback that will
                                  appear when this area is dragged and 
                                  dropped outside the correct drop target 
                                  area"""}],\
           'coords' : ['text', "Coordinates", "Coordinates", \
                       {"defaultval": "0,0,50,50"}],\
           'exetarget' : ['choice', x_('Correct Drop Target'), \
                          x_('Correct Drop Target'),\
                          {"choices" : [['none', 
                             x_('Select the correct area that the student should drag this area to...')],
                                        ['none2', x_('None')]]}],
           'draggable' : ['choice', x_('Behaviour'), \
                          x_('Behaviour'),\
                          {"choices" : [['candrag', x_('User can drag')],\
                                        ['fixed', x_('Fixed')]]}],\
           'ondropinvalid' : ['choice', \
                              x_('When dropped outside correct target'),\
                              x_('When dropped outside correct target'),\
                              {"choices" : [['revert', x_('Snap back')],\
                                            ['norevert', x_('Stay')]]}\
                       ]}
            
        
        self.main_fields = ExtendedFieldSet(self.idevice, \
                            main_field_order, main_field_info)
        #used to set 
        self.field_num = ""
        
            