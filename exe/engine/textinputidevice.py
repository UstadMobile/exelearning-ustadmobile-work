# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
This Idevice will allow recording of text input
"""

import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.path      import Path, toUnicode
from exe.engine.resource  import Resource
from extendedfieldengine import *
log = logging.getLogger(__name__)

class TextInputIdevice(Idevice):
    
    persistenceVersion = 1
    
    def __init__(self, content=""):
        Idevice.__init__(self, x_(u"Text Input"), 
                         x_(u"UstadMobile Inc."), 
                         x_(u"""Text Input and record to XAPI."""), "", "")
        
        mainFieldOrder = ['title', 'instructions', 'rows', 'cols']
        
        mainFieldInfo = { \
                 'title' : ['text', x_('Title'), x_('Title to show'), {"default_prompt" : "Type your title here"}], \
                 'instructions' : ['textarea', x_('Instructions'), 
                                  x_('Instructions'),
                                  {"default_prompt" : x_("Put here instructions for what the user should do")}], \
                 'rows' : ['text', x_('Rows'), x_('Rows')], \
                 'cols' : ['text', x_('Cols'), x_('Cols')], \
                }
        
        self.mainFieldSet = ExtendedFieldSet(self, mainFieldOrder, mainFieldInfo)
        self.mainFieldSet.makeFields()
        self.emphasis = Idevice.SomeEmphasis
        self.message = ""

# ===========================================================================
def register(ideviceStore):
    """Register with the ideviceStore"""
    ideviceStore.extended.append(TextInputIdevice())
    

