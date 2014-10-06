'''
Created on Oct 6, 2014

@author: mike
'''

import logging
import json
from twisted.web.resource      import Resource
from exe.webui.renderable      import RenderableResource
from exe.webui.webservice.exebackendservice import EXEBackEndService

class LoginPage(RenderableResource):
    """
    The LoginPage manages logging the user in or out through the backend
    provider
    """
    
    name = 'loginpage'
    
    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
    
    def render(self, request):
        result = EXEBackEndService.get_instance().authenticate_session(
                                           request.getSession(),
                                           request.args['username'][0],
                                           request.args['password'][0])
        return json.dumps(result)
        
    
    