// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

if (!window.translations)
    translations = {};

function _(msg) {
    return translations[msg] || msg;
}

/*
 *  constants - indicating the run mode for the application
 *  As per config.py variable appMode
 */
var APPMODE_DESKTOP = "DESKTOP";
var APPMODE_WEBAPP = "WEBAPP";

/** Reference to outline (ExtJS) */

var outline = null;

Ext.Loader.setConfig({
    enabled: true,
    paths: { 'Ext.ux': 'jsui/extjs/examples/ux' }
});

var conf = {
    onRender: function() {
        var me = this;
        
        me.callParent(arguments);
        if (me.tooltip) {
            Ext.tip.QuickTipManager.register(Ext.apply({
                target: me.el,
                text: me.tooltip
            }));
        }
    }
};

//Call authoring page when zindex is modified and consider problematic plugins with no zindex support
Ext.override(Ext.WindowManager, {
    bringToFront: function(comp) {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
        if (authoringPanel.isVisible()) {
            var authoring = authoringPanel.getWin();
	        if (authoring && authoring.hideObjectTags)
	            authoring.hideObjectTags();
        }
    },
    onComponentHide: function(comp) {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
        if (authoringPanel.isVisible()) {
            if (!this.getActive()) {
		        var authoring = authoringPanel.getWin();
		        if (authoring && authoring.showObjectTags)
		            authoring.showObjectTags();
            }
        }
    },
    _hideModalMask: function() {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
		if (authoringPanel.isVisible()) {
            if (!this.getActive()) {
		        var authoring = authoringPanel.getWin();
		        if (authoring && authoring.showObjectTags)
		            authoring.showObjectTags();
            }
        }
    }
});
Ext.override(Ext.form.field.Text, conf);
Ext.override(Ext.form.field.TextArea, conf);
Ext.override(Ext.form.field.Checkbox, conf);
Ext.override(Ext.form.field.Hidden, conf);

Ext.application({
    name: 'eXe',

    stores: [
        'OutlineXmlTreeStore',
        'IdeviceXmlStore',
        'filepicker.DirectoryTree',
        'filepicker.File'
    ],

    models: [
    	'filepicker.File'
    ],
    
    controllers: [
    	'Idevice',
        'MainTab',
    	'Outline',
    	'Toolbar',
    	'filepicker.Directory',
    	'filepicker.File'
    ],
    
    getMaxHeight: function(height) {
        var vheight = Ext.ComponentQuery.query('#eXeViewport')[0].getHeight();

        return height >= vheight? vheight : height;
    },

    quitWarningEnabled: true,
    
    /** Time between attempts at reconnecting (ms)... */
    reconnectTimeInterval: 2000,
    
    /** Panel used to show user when disconnected */
    disconnectPanel: null,
    
    lastReconnectTime: 0,
    
    /** Last time a message was received from the server saying it's alive */
    lastPongTime: 0,
    
    /** Duration between pings to the server (in ms)*/
    pingIntervalDuration: 10000,
    
    /** Time allowable for an ajax reply to come back from server (in ms) */
    pingTimeout: 15000,
    
    /** 
     * Reference to interval object being used to check the connection
     * periodically
     */
    checkConnectionInterval : null,
    
    startLivePageTimer: null,

    reload: function() {
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring && authoring.submitLink) {
        	var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel(),
            	selected = outlineTreePanel.getSelectionModel().getSelection();
        	eXe.app.quitWarningEnabled = false;
        	eXe.app.on({
        		'authoringLoaded': function() {
        			nevow_clientToServerEvent('reload');
        		}
        	});
	        authoring.submitLink("changeNode", selected !== 0? selected[0].data.id : '0');
        }
    },

    gotoUrl: function(location) {
        eXe.app.quitWarningEnabled = false;
        if (location == undefined)
            location = window.top.location.pathname;
        nevow_closeLive('window.top.location = "' + location + '";');
    },
    
    outlineSelectNode: function(currentNodeId) {
    	outline = eXe.app.getController("Outline"); 
    	if (outline) {
    		outline.select(currentNodeId);
		}
    },
    
    showLoadError: function() {
    	if (eXe.app.config.loadErrors.length > 0) {
    		Ext.Msg.alert(_('Load Error'), eXe.app.config.loadErrors.pop(), eXe.app.showLoadError);
    	}
    	else
    		eXe.app.afterShowLoadErrors();
    },
    
    launch: function() {
        Ext.QuickTips.init();

        try {
            Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
        }
        catch (err) {
            console.log('Local Storage not supported');
            Ext.state.Manager.setProvider(new Ext.state.CookieProvider({expires: null}));
        }
        
        eXe.app = this;
        
        //set the last pong time to now - we are just initializing
        this.lastPongTime = new Date().getTime();
        
        eXe.app.config = config;
        
        Ext.state.Manager.set('filepicker-currentDir', eXe.app.config.lastDir);

        window.onbeforeunload = function() {
            if (eXe.app.quitWarningEnabled)
                return _("If you leave this page eXe application continues to run." +
                        " Please use the menu File->Quit if you really want to exit the application.");
        };
		/*
		window.onunload = function() {
            nevow_clientToServerEvent('quit', '', '');
        };
		*/

        langsStore.sort(function(a, b) {
            return a[1].localeCompare(b[1]);
        });

        if (Ext.isGecko || Ext.isSafari)
        	window.addEventListener('keydown', function(e) {(e.keyCode == 27 && e.preventDefault())});

        var cmp1 = Ext.create('eXe.view.ui.eXeViewport', {
            renderTo: Ext.getBody()
        });
        cmp1.show();

        setTimeout(function(){
		    Ext.get('loading').hide();
		    Ext.get('loading-mask').fadeOut();
		  }, 250);
        
        /*
	     * This is used to prime cache for what we need to show
	     * in case we lose connectivity... at which point we cant
	     * load anything more of course
	     */
	    var loadingPanel = new Ext.LoadMask(
    	    Ext.getBody(), {
    	    	msg: "Initializing...",
    	    }
        );
	    loadingPanel.show();
	    setTimeout(function() {
	    	loadingPanel.hide();
	    	loadingPanel = null;
	    }, 100);
	    
	    
        if(eXe.app.config.appMode === APPMODE_WEBAPP) {
        	if(!eXe.app.config.webservice_user) {
        		eXe.app.getController('Toolbar').showWebServiceLogin();
        	}
        }
        
        if (eXe.app.config.showPreferences) {
        	eXe.app.getController('Toolbar').toolsPreferences();
        }
        
        if (eXe.app.config.showWizard) {
        	eXe.app.getController('Toolbar').toolsWizard();
        }
        
        /* System is f***d up when you open a large file
        this.checkConnectionInterval = setInterval(function() {
        	eXe.app.checkConnectionLive();
        }, eXe.app.pingIntervalDuration);
        */
        
        /* Disabled due to new insert menu

        if (!eXe.app.config.showIdevicesGrouped) {
        	var panelResult = Ext.ComponentQuery.query('#idevice_panel');
        	if(typeof panelResult !== "undefined") {
        		var panel = panelResult[0];
        		if(panel) {
        			var button = panel.down('button');
        	
        			panel.view.features[0].disable();
        		}
        	}
        	button.setText(_('Group iDevices'));
        }
        */

        eXe.app.afterShowLoadErrors = function() {
        	if (eXe.app.config.showPreferences)
        		eXe.app.getController('Toolbar').toolsPreferences();
        };

        eXe.app.showLoadError();
        
        

    },
    
    /** 
     * Check and see if we should still be showing the disconnect
     * mask
     */
    checkDisconnectMaskDisplay: function() {
    	var timeSincePong = new Date().getTime() - 
		eXe.app.lastPongTime;

		if(timeSincePong < (eXe.app.pingIntervalDuration *2)) {
			if(eXe.app.disconnectedMask) {
				eXe.app.disconnectedMask.hide();
				eXe.app.disconnectedMask = null;
			}
		}
    },
    
    /**
     * In case connectivity is interrupted - attempt to resume it.
     */
    reconnectLivePage: function() {
    	eXe.app.lastReconnectTime = new Date().getTime();
    	
    	if(!eXe.app.disconnectedMask) {
    		eXe.app.disconnectedMask = new Ext.LoadMask(Ext.getBody(), {
    			msg: _("Connecting to server..."),
			});
    		
    		eXe.app.disconnectedMask.show();
    	}
    	
    	setTimeout(function() {
			eXe.app.checkDisconnectMaskDisplay();
		}, eXe.app.pingIntervalDuration*2);
    	
    	
    	eXe.app.startLivePageTimer = setTimeout(function() {
    		eXe.app.startLivePageTimer = null;
    		
    		/* 
        	 * must re-add because as soon as disconnect gets fired event
        	 * all existing listeners are removed
        	 */ 
        	addDisconnectListener(function() {
        		eXe.app.reconnectLivePage();
        	});
        	
    		nevow_startLivePage();
    	}, eXe.app.reconnectTimeInterval);
    },
    
    /**
     * Take the reply from the server telling us it's still alive
     */
    pong: function() {
    	eXe.app.lastPongTime = new Date().getTime();
    	Ext.ComponentQuery.query('#eXeViewport')[0].setLoading(false);
    	console.log("Pong message received");
    	eXe.app.checkDisconnectMaskDisplay();
    },
    
    /**
     * Run at an interval - send the server a ping - which should
     * result in a call to pong.  If it's been too long since our
     * last pong response; show the user that we have a connectivity
     * problem
     */
    checkConnectionLive: function() {
    	nevow_clientToServerEvent("ping", "");
    	var timeSinceLastPong = new Date().getTime() - eXe.app.lastPongTime;
    	if(timeSinceLastPong > (eXe.app.pingIntervalDuration *2)) {
    		console.log("checkConnectionLive: detect connection down!");
    		var timeSinceLastRequest = new Date().getTime() 
    			- last_server_request_time;
    		
    		if(timeSinceLastRequest > (eXe.app.pingIntervalDuration*2)) {
    			//the request is dead actually - abort and try again
    			if(last_request) {
    				last_request.abort();
    				eXe.app.reconnectLivePage();
    			}else if(!eXe.app.startLivePageTimer){
    				//see if we have a waiting timer to try to reconnect - if not make it
    				eXe.app.reconnectLivePage();
    			}
    		}
    	}else {
    		console.log("checkConnectionLive: detect connection OK");
    	}
    },

    appFolder: "jsui/app"

});
