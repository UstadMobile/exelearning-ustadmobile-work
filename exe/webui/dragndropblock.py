'''
Created on Mar 28, 2014

@author: mike
'''

import logging
from exe.webui.block            import Block
from exe.engine.dragndropidevice import DragNDropIdevice
from exe.engine.extendedfieldengine        import *


class DragNDropBlock(Block):
    """Block to handle Drag and Drop Idevices"""
    
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.main_elements = idevice.main_fields.makeElementDict()
        self.area_elements = []
        for area_field in self.idevice.area_fields:
            self.area_elements.append(DragNDropAreaElement(area_field, self))


    def process(self, request):
        self.idevice.message = ""
        Block.process(self, request)
        
        if "addArea"+unicode(self.id) in request.args:
            self.idevice.add_area_fields()
            self.idevice.edit = True
            self.idevice.undo = False
        
        if field_engine_is_delete_request(request):
            return
        
        for area_el in self.area_elements:
            area_el.process(request)
            field_engine_check_delete(area_el, request, self.idevice.area_fields)
        
        
        field_engine_process_all_elements(self.main_elements, request)
        
    
    def renderEdit(self, style):
        #html  = u"<div>\n"
        html = ""
        html += common.ideviceShowEditMessage(self)
        
        main_dict = self.idevice.main_fields.getRenderDictionary(\
                         self.main_elements, "", True, editMode = True)
        
        #html += self.idevice.main_fields.renderEditInOrder(self.main_elements)
        html += "<br/>"
        #html += """<script src='/scripts/exedragndrop_edit.js' 
        #    type='text/javascript></script>"""
        
        img_width = "0"
        img_height = "0"
        imgElId = self.main_elements['mainImg'].field.id
        
        
        if self.main_elements['mainImg'].field.imageResource:
            img_width = self.main_elements['mainImg'].field.width
            img_height = self.main_elements['mainImg'].field.height
        
        
        #the drag/drop positioning area (hidden)
        
        main_dict['areas_html'] = self._renderAreasHTML(style, True)
        main_dict['add_button_text'] = common.submitButton(
                   "addArea"+unicode(self.id), _("Add Area"), 
                   extra_classes='add_item_button') 
        #html += self._renderAreasHTML(style, True)
        #html += "</div>"
        
        #html += "<div class='exednd_editor_accordion'>"
        main_dict['areas_html_edit'] = ""
        for area_el in self.area_elements:
            main_dict['areas_html_edit'] += area_el.renderEdit(style) 
        #html += "</div>"
        
        #html += "</div>"
        html += self.idevice.main_fields.applyFileTemplateToDict(main_dict, \
            "exedragndrop_edit.html", True)
        
        html += "<br/>"
        html += self.renderEditButtons()
    
        
        return html
    
    def renderPreview(self, style):
        html = self._renderDevice(style, "preview")
        return html
        
    
    def renderView(self, style):
        return self._renderDevice(style, "view")
    
    def _renderAreasHTML(self, style, preview_mode):
        areas_el_html = ""
        areas_feedback = ""
        
        for area_el in self.area_elements:
            if preview_mode:
                areas_el_html += area_el.renderPreview(style)
                areas_feedback += area_el.renderFeedbackAreas(style, \
                                                             "preview")
            else:
                areas_el_html += area_el.renderView(style)
                areas_feedback += area_el.renderFeedbackAreas(style, \
                                                             "view")
        
        
        main_dict = self.idevice.main_fields.getRenderDictionary(\
                         self.main_elements, "", preview_mode)
        main_dict['areas_html'] = areas_el_html
        main_dict['areas_feedback'] = areas_feedback
        
        html = self.idevice.main_fields.applyFileTemplateToDict(main_dict, \
            "exedragndrop_mainarea.html", preview_mode)
        
        
        return html
        
    
    def _renderDevice(self, style, view_mode_name):
        html = ""
        html += common.ideviceHeader(self, style, view_mode_name)
        preview_mode = False
        if view_mode_name == "preview":
            preview_mode = True
        
        areas_el_html = self._renderAreasHTML(style, preview_mode)
        main_dict = self.idevice.main_fields.getRenderDictionary(\
                         self.main_elements, "", preview_mode)
        
        
        
        #main_dict["areas_html"] = areas_el_html
        
        #main_html = self.idevice.main_fields.applyFileTemplateToDict(main_dict, \
        #    "exedragndrop_mainarea.html", preview_mode)
        html += areas_el_html
        
        html += common.ideviceFooter(self, style, view_mode_name)
        return html

class DragNDropAreaElement(Element):
    
    def __init__(self, field, dragndrop_block):
        Element.__init__(self, field)
        self.field = field
        self.elements = field.main_fields.makeElementDict()
        self.dragndrop_block = dragndrop_block
    
    def process(self, request):
        field_engine_process_all_elements(self.elements, request)
    
    def renderEdit(self, style):
        html = ""
        main_dict = self.field.main_fields.getRenderDictionary(\
                         self.elements, "", True, editMode = True)
        main_dict['fieldnum'] = self.field.field_num
        main_dict['fieldid'] = self.field.id
        #main_dict['target_blockid'] = self.field.main_fields.fields["exetarget"].id
        html += self.field.main_fields.applyFileTemplateToDict(main_dict, \
            "exedragndrop_area_edit.html", True)
        #html += self.field.main_fields.renderEditInOrder(self.elements)
        return html
    
    def renderView(self, style):
        return self._renderAreaEl(style, "view")
    
    def renderPreview(self, style):
        return self._renderAreaEl(style, "preview")
    
    def renderFeedbackAreas(self, style, mode_name):
        html  = ""
        preview_mode = False
        if mode_name == "preview":
            preview_mode = True
            
        main_dict = self.field.main_fields.getRenderDictionary(\
                         self.elements, "", preview_mode)

        main_dict['fieldid'] = self.field.id
        html = self.field.main_fields.applyFileTemplateToDict(main_dict, \
            "exedragndrop_area_feedback.html", preview_mode)
        return html
    
    def _renderAreaEl(self, style, mode_name):
        preview_mode = False
        if mode_name == "preview":
            preview_mode = True
            
        main_dict = self.field.main_fields.getRenderDictionary(\
                         self.elements, "", preview_mode)

        main_dict['fieldid'] = self.field.id
        main_dict['coord_field_id'] = self.elements['coords'].id
        
        pos_fields = ['left', 'top', 'width', 'height']
        pos_vals = main_dict['coords'].split(",")
        try:
            for idx in range(0, len(pos_fields)):
                main_dict[pos_fields[idx]] =  pos_vals[idx]
        except:
            pass
        
        #Because the user can choose between three types of content
        selected_content = ""
        if main_dict['type']:
            content_type = main_dict['type']
            if main_dict[content_type]:
                selected_content = main_dict[content_type]
        
        main_dict['selected_content'] = selected_content
        
        feedbackEl = ['exednd_correctfb_' + self.field.id, \
                      "exednd_wrongfb_" + self.field.id]
        if main_dict['feedbacktype'] == 'none':
            feedbackEl = ['', '']
        elif main_dict['feedbacktype'] == 'question':
            feedbackEl = ['exednd_question_fbpositive_' + \
                          self.field.idevice.id, \
                          'exednd_question_fbnegative_'  + \
                          self.field.idevice.id]
        main_dict['correctfeedbackel'] = feedbackEl[0]
        main_dict['wrongfeedbackel'] = feedbackEl[1]
        
        html = self.field.main_fields.applyFileTemplateToDict(main_dict, \
            "exedragndrop_area.html", preview_mode)
        
        return html
    
    
    
# ===========================================================================
"""Register this block with the BlockFactory"""

from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(DragNDropBlock, DragNDropIdevice)    

# ===========================================================================
