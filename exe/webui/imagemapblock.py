'''
Created on Jan 30, 2014

@author: mike
'''

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element          import Element
from exe.engine.extendedfieldengine        import *

log = logging.getLogger(__name__)

class ImageMapBlock(Block):
    
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.mainElements = idevice.mainFieldSet.makeElementDict()
        
        self.map_area_elements = []
        
        for area_field in self.idevice.map_areas:
            self.map_area_elements.append(ImageMapAreaElement(area_field, self))
        
    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        self.idevice.message = ""
        Block.process(self, request)
        
        self.idevice.uploadNeededScripts()
        
        if field_engine_is_delete_request(request):
            return
        
        if "addMapArea" + unicode(self.id) in request.args:
            self.idevice.add_map_area()
            self.idevice.edit = True
            self.idevice.undo = False
        
        field_engine_process_all_elements(self.mainElements, request)
        
        for map_area_el in self.map_area_elements:
            map_area_el.process(request)
        
        
        self.idevice.title = self.mainElements['title'].renderView()
    
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += common.ideviceShowEditMessage(self)
        html += self.idevice.mainFieldSet.renderEditInOrder(self.mainElements)
        
        for area_element in self.map_area_elements:
            html += area_element.renderEdit()
        
        html += "<br/>"
        html += common.submitButton("addMapArea"+unicode(self.id), _("Add Area to Image Map"))
        html += "<br/>"
        html += self.renderEditButtons()
        
        return html
    
    def renderImageMap(self, style, preview_mode = False):
        html = u""
        view_mode_name = "view"
        if preview_mode is True:
            view_mode_name = "preview"
        
        html += common.ideviceHeader(self, style, view_mode_name)
            
        main_dict = self.idevice.mainFieldSet.getRenderDictionary(\
                         self.mainElements, "", preview_mode)
        #make area_html
        area_html = ""
        tooltips_html = u""
        for map_area_el in self.map_area_elements:
            area_html +=  map_area_el.get_area_element() 
            tooltips_html += map_area_el.get_tooltip(preview_mode) 
        
        main_dict['area_html'] = area_html  
        main_dict['tooltips_html'] = tooltips_html
        
        main_html = self.idevice.mainFieldSet.applyFileTemplateToDict(main_dict, \
            "imagemapidevice-main.html", preview_mode)
        html += main_html
        
        html += common.ideviceFooter(self, style, view_mode_name)
        
        return html
    
    def renderPreview(self, style):
        html = ""
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self.renderImageMap(style, preview_mode = True)
        html += "<br/>"
        
        
        
        html += u"</div>\n"
        return html
    
    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += self.renderImageMap(style, preview_mode = False)
        html += u"</div>\n"
        return html

class ImageMapAreaElement(Element): 
    
    persistenceVersion = 1
    
    def __init__(self, field, image_map_block):
        Element.__init__(self, field)
        self.field = field
        self.elements = field.main_fields.makeElementDict()
        self.image_map_block = image_map_block
        
    def process(self, request):
        field_engine_process_all_elements(self.elements, request)
    
    def make_crop_selector(self):
        html = ""
        img_name = self.field.idevice.get_img_filename()
        
        if img_name:
            img_path = img_name
            img_path = "resources/%s" % img_name
            img_elid = "mapselect%s" % self.id
            selection_blockid = self.elements['coords'].id
            current_selection = self.elements['coords'].renderView()
            selection_el_str = ""
            try:
                if current_selection != "":
                    current_selection_pts = current_selection.split(",")
                    selection_el_str = """,x1 : %s, y1 : %s, x2 : %s, y2 : %s""" \
                        % tuple(current_selection_pts)
                    #selection_el_str = ""
            except:
                pass
            
            
            html += 'select here:<br/>'
            html += """<img data-for-mapselect-field='%(selblockid)s'
                id='%(id)s' src='%(img_path)s'/>""" % \
                {'id' : img_elid, 'img_path' : img_path, \
                 'selblockid' : selection_blockid}
                
            html += """
            <script type="text/javascript">
            $(document).ready(function () {
                $('img#%(id)s').on("load", function() {
                    setTimeout(
                        "$('img#%(id)s').imgAreaSelect({handles: true,onSelectEnd: exeHandleImgAreaSelectFinish%(selection_el)s});",
                        3000);
                }).each(function() {
                    if(this.complete) {
                        $(this).load();
                    }
                });
            });
            </script>""" % {"id" : img_elid, "ideviceid" : self.image_map_block.id,
                            "selection_el" : selection_el_str}
                
        return html
            
    
        
    def renderEdit(self):
        html = u""
        
        html += self.make_crop_selector()
        html += self.field.main_fields.renderEditInOrder(self.elements)
        
        return html
    
    def get_area_element(self):
        field_id = self.field.id
        coords = self.field.main_fields.fields['coords'].content
        html = """<area shape='rect' alt='%(field_id)s' 
            coords='%(coords)s' data-key='%(field_id)s' href='#'/>
        """ % {'field_id' : field_id, 'coords' : coords}
        
        return html
    
    def get_tooltip(self, preview_mode = False):
        html = u""
        tooltip_id = self.field.idevice.id + "_" + self.field.id
        html += "<div id='imageMapToolTip_%s'>\n" % tooltip_id
        if preview_mode == False:
            html += self.elements['tooltip'].renderView()
        else:
            html += self.elements['tooltip'].renderPreview() 
        html += "</div>"
        
        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.imagemapidevice import ImageMapIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(ImageMapBlock, ImageMapIdevice)    
    
