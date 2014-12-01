# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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

import logging
from exe.webui.renderable import _RenderablePage
import nevow
from nevow.livepage import LivePage, DefaultClientHandleFactory, _js,\
    ClientHandle, IClientHandle
from nevow import inevow, tags

from nevow import testutil, context
from nevow.flat import flatten

log = logging.getLogger(__name__)

def allClients(client1, client2):
    return True

def otherClients(client1, client2):
    return client1.handleId != client2.handleId

def allSessionClients(client1, client2):
    return client1.handleId[:32] == client2.handleId[:32]

def otherSessionClients(client1, client2):
    return otherClients(client1, client2) and allSessionClients(client1, client2)

def allSessionPackageClients(client1, client2):
    return client1.packageName == client2.packageName and allSessionClients(client1, client2)

def otherSessionPackageClients(client1, client2):
    return otherClients(client1, client2) and allSessionPackageClients(client1, client2)


class eXeClientHandle(ClientHandle):
    __implements__ = IClientHandle

    def sendScript(self, script, filter_func=None):
        """
        Send a script to the client - Note - script should be str not unicode
        """
        if not isinstance(script, _js):
            script = _js(script)
        #todo: check this is not already an instance of js
        if filter_func:
            for client in nevow.livepage.clientHandleFactory.clientHandles.values():
                if filter_func(client, self):
                    ClientHandle.send(client, script)
        else:
            ClientHandle.send(self, script)

    ## Here is some api your handlers can use to more easily manipulate the
    ## live page
    def flt(self, what, quote=True):
        return flt(what, quote=quote, client=self)


    def alert(self, what, onDone=None, filter_func=False):
        """Show the user an alert 'what'
        """
        if not isinstance(what, _js):
            what = "'%s'" % (self.flt(what), )
        if onDone:
            script = "Ext.Msg.alert('',%s, function() { %s });" % (what, onDone)
        else:
            script = "Ext.Msg.alert('',%s);" % (what, )
        if filter_func and onDone:
            for client in nevow.livepage.clientHandleFactory.clientHandles.values():
                if filter_func(client, self):
                    client.sendScript(onDone)
        self.sendScript(script)
        
    def expire_client(self):
        self.factory.deleteHandle(self.handleId)

class eXeClientHandleFactory(DefaultClientHandleFactory):
    clientHandleClass = eXeClientHandle

    def newClientHandle(self, ctx, refreshInterval, targetTimeoutCount):
        handle = DefaultClientHandleFactory.newClientHandle(self, ctx, refreshInterval, targetTimeoutCount)
        
        handle.currentNodeId = ctx.package.currentNode.id
        handle.packageName = ctx.package.name
        handle.session = ctx.session
        ctx.session.add_client_handle(handle)
        handle.factory = self
            
        log.debug('New client handle %s. Handles %s' % (handle.handleId, self.clientHandles))
        return handle

#attempt upgrade of nevow
# It seems in the new version we should really just think about
# livepage.clientFactory

theClientHandleFactory = eXeClientHandleFactory()
nevow.livepage.clientHandleFactory = theClientHandleFactory
nevow.livepage.clientFactory = theClientHandleFactory
nevow.livepage.theDefaultClientHandleFactory = theClientHandleFactory

class RenderableLivePage(_RenderablePage, LivePage):
    """
    This class is both a renderable and a LivePage/Resource
    """

    def __init__(self, parent, package=None, config=None):
        """
        Same as Renderable.__init__ but
        """
        LivePage.__init__(self)
        _RenderablePage.__init__(self, parent, package, config)
        self.clientHandleFactory = nevow.livepage.clientHandleFactory
        
        # new version of nevow wants to think about clientFactory 
        # NOT clientHandleFactory
        self.clientFactory = nevow.livepage.clientFactory

    def renderHTTP(self, ctx):
        request = inevow.IRequest(ctx)
        request.setHeader('Expires', 'Fri, 25 Nov 1966 08:22:00 EST')
        request.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
        request.setHeader("Pragma", "no-cache")
        return LivePage.renderHTTP(self, ctx)

    
    #copy from new nevow livepage.py
    def render_liveglue(self, ctx, data):
        if not self.cacheable:
            handleId = "'", self.clientFactory.newClientHandle(
                self,
                self.refreshInterval,
                self.targetTimeoutCount).handleId, "'"
        else:
            handleId = 'null'

        return [
            tags.script(type="text/javascript")[
                "var nevow_clientHandleId = ", handleId ,";"],
            tags.script(type="text/javascript",
                        src='/jsui/nevow_glue.js')
            ]

def flt(stan, quote=True, client=None):
    """Flatten some stan to a string suitable for embedding in a javascript
    string.

    If quote is True, apostrophe, quote, and newline will be quoted
    """

    fr = testutil.FakeRequest()
    ctx = context.RequestContext(tag=fr)
    ctx.remember(client, IClientHandle)
    ctx.remember(None, inevow.IData)
    fl = flatten(stan, ctx=ctx)
    if quote:
        fl = jquote(fl)
    return fl


def jquote(jscript):
    return jscript.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

    