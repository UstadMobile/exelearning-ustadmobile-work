//JQuery Plugin
(function($){
	
	/**
	 * attemptidevice - an awesome jQuery plugin. 
	 *
	 * @class myAwesomePlugin
	 * @memberOf jQuery.fn
	 */
	$.widget("um.attemptidevice", {
		options : {
			"editable" : false
		},
		
		/**
		 * Generate the html that can be saved by the backend
		 */
		idevicehtml: function() {
			var attemptMode = 
				this.editorElement.find(".attemptidevice_modeselect").val();
			var phtmlEl = $("<div/>", {
				"data-idevice-type" : 
					"attemptidevice",
				"data-attemptidevice-type" : 
					this.editorElement.find(".attemptidevice_typeselect").val(),
				"data-attemptidevice-mode" :
					attemptMode
			});
			
			if(attemptMode === "button") {
				phtmlEl.append($("<input/>", {
					"type" : "button",
					"class" : "attemptidevice_button",
					"value" : 
						this.editorElement.find(".attemptidevice_buttontext").val()
				}));
			}
			
			if(this.editorElement.find(".feedback_textarea").val()) {
				var fbVals = $("<div/>", {
					"style" : "display: none",
					"class" : "feedback_vals"
				});
				fbVals.html(this.editorElement.find(
						".feedback_textarea").val());
				phtmlEl.append(fbVals);
			}
			 
			return phtmlEl[0].outerHTML;
		},
		
		/**
		 * Main widget creation
		 */
		_create : function() {
			if(this.options['editable']) {
				this._initEditor();
			}else {
				//run in "normal" mode
				if(this.element.attr("data-attemptidevice-mode") === "button") {
					var opMode =this.element.attr(
							"data-attemptidevice-type"); 
					this._on(this.element.find(".attemptidevice_button"), 
							{"click" : opMode+"Attempt"});
				}
			}
		},
		
		startAttempt: function() {
			var result = EXETinCan.getInstance().startRegistration();
			if(result === null) {
				alert("Sorry - could not start tracking - you are not logged in");
			}else {
				alert("OK - Tracking now");
			}
		},
		
		finishAttempt: function() {
			var stmt = EXETinCan.getInstance().finishRegistration();
			if(stmt === null) {
				alert("Sorry - you are not logged in or no registration started")
			}else {
				alert("OK completed registration");
			}
		},
		
		/**
		 * Initialize the editor for this device
		 */
		_initEditor : function() {
			this.editorElement=$("<div/>", 
					{"class" : "attemptidevice_editor"});
			this.editorElement.append("<div>Type:</div>");
			this.element.after(this.editorElement);
			var selectTypeEl = $("<select/>", {
				"class" : "attemptidevice_typeselect"
			}).appendTo(this.editorElement);
			selectTypeEl.append("<option value='start'>Start Scoring</option>");
			selectTypeEl.append("<option value='finish'>Finish Scoring</option>");
			
			if(this.element.attr("data-attemptidevice-type")) {
				selectTypeEl.val(
					this.element.attr("data-attemptidevice-type"));
			}
			
			
			this.editorElement.append("<div>Mode:</div>");
			var selectModeEl = $("<select/>", {
				"class" : "attemptidevice_modeselect"
			}).appendTo(this.editorElement);
			selectModeEl.append("<option value='button'>Button</option");
			selectModeEl.append("<option value='auto'>Automatic</option>");
			
			if(this.element.attr('data-attemptidevice-mode')) {
				selectModeEl.val(
					this.element.attr('data-attemptidevice-mode'));
			}
			
			this.editorElement.append("<div>Button Text</div>");
			
			var labelInput = $("<input/>", {
				"type" : "text",
				"class" : "attemptidevice_buttontext"
			}).appendTo(this.editorElement);
			
			if(this.element.find(".attemptidevice_button").length === 1) {
				labelInput.val(
					this.element.find(".attemptidevice_button").attr('value'));
			}
			
			this.editorElement.append(
					"<div>Feedback to show on finish</div>");
			var feedbackTextarea = $("<textarea/>", {
				"class" : "feedback_textarea",
				"rows" : "5",
				"cols" : "70"
			});
			
			this.editorElement.append(feedbackTextarea);
			
			if(this.element.find(".feedback_vals").length > 0) {
				feedbackTextarea.val(this.element.find(".feedback_vals").html());
			}
		},
		
		destroy: function() {
			this.editorElement = null;
			$.widget.prototype.destroy.call( this );
		}
	});
}(jQuery));
