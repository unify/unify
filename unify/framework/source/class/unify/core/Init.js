(function() {
	if (jasy.Env.isSet("runtime", "browser")) {
	var app;
	var DOMReadyEvent;


	var prerun = [];
	var registerPrerunCallback = function(callback, context) {
		prerun.push({method: callback, context: context});
	};


	// Determine the proper event for DOM is ready
	if (jasy.Env.getValue('engine') == 'trident') {
		DOMReadyEvent = 'readystatechange';
	} else {
		DOMReadyEvent = 'DOMContentLoaded';
	}


	/**
	 * Is document ready?
	 *
	 * @return {Boolean} true: Document/DOM is ready;
	 *                   false: otherwise
	 */
	var isDocReady = function() {
		var isReady = false;

		if (jasy.Env.getValue('engine') === 'trident') {
			if (document.readyState === 'complete') {
				isReady = true;
			}
		} else {
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				isReady = true;
			}
		}

		return isReady;
	};


	/**
	 * Handle document state changes
	 *
	 * Called when the state of the document changes, for example from
	 * interactive to complete.
	 *
	 * @param event {Event} The state change event
	 */
	var onDocStateChange = function(event) {
		if (isDocReady()) {
			runStartUp();
		}
	};


	/**
	 * Run start routine
	 *
	 * When the document is ready, the application is initialized.
	 */
	var runStartUp = function() {
		if (isDocReady()) {
			lowland.bom.Events.unlisten(document, DOMReadyEvent, onDocStateChange);

			var Application = core.Class.getByName(jasy.Env.getValue('application') + '.Application');
			var init = app = new Application();

			if (prerun.length <= 0) {
				init.main();
				init.finalize();
			} else {
				var preruns = prerun.length;
				
				var cbrun = function() {
					preruns--;
					if (preruns === 0) {
						init.main();
						init.finalize();
					}
				};
				
				for (var i=0,ii=prerun.length; i<ii; i++) {
					prerun[i].method.call(prerun[i].context, cbrun);
				}
			}
		}
	};


	/**
	 * Get application
	 *
	 * Returns reference to the (instantiated) application
	 *
	 * @return {var} Reference to the (instantiated) application
	 */
	var getApplication = function() {
		return app;
	};


	/**
	 * Start-up
	 */
	var startUp = function() {
		if (isDocReady()) {
			runStartUp();
		} else {
			lowland.bom.Events.listen(document, DOMReadyEvent, onDocStateChange);
		}
	};


	/**
	 * Shut-down
	 */
	var shutDown = function() {
		lowland.ObjectManager.dispose();
	};



	


	/**
	 * Init
	 */
	core.Class("unify.core.Init", {
		include : [unify.core.Object],

		construct : function() {
			unify.core.Object.call(this);
		},

		members : {
			main : function() {
				throw new Error("main is not implemented");
			},
			finalize : function() {}
		}
	});

	unify.core.Statics.annotate(unify.core.Init, {
		getApplication : getApplication,
		registerPrerunCallback : registerPrerunCallback,
		startUp : startUp,
		shutDown : shutDown
	});
	} else {
		core.Module("unify.core.Init", {
			startUp : function() {
				console.log("worker startup");
			}
		});
	}

})();

