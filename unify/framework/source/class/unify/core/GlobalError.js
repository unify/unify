/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

(function(global) {
	
	var globalErrorHandling = true;
	var globalErrorHandler = [];
	var oldErrorHandler = null;
	
	var handleError = function(e, args) {
		for (var i=0,ii=globalErrorHandler.length; i<ii; i++) {
			var handler = globalErrorHandler[i];
			handler[0].call(handler[1] || this, e, args);
		}
	};
	
	if (window.onerror) {
		oldErrorHandler = window.onerror;
	}
	window.onerror = function(msg, uri, lineNumber) {
		oldErrorHandler && oldErrorHandler(msg, uri, lineNumber);
		handleError.call(this, null, [msg, uri, lineNumber]);
	};
	
	core.Module("unify.core.GlobalError", {
		/**
		 * Adds an global error handler. On error @handler {Function} will be executed in @context {Object}.
		 */
		addErrorHandler : function(handler, context) {
			globalErrorHandler.push([handler, context]);
		},
		
		/**
		 * {Function} Wraps an try catch block around @method {Function} to support global error handlers.
		 * This should be used by every browser event handler.
		 */
		observeMethod : function(method) {
			if (!globalErrorHandling) {
				return method;
			}
			
			return (function() {
				try {
					return method.apply(this, arguments);
				} catch (e) {
					handleError.call(this, e, arguments);
				}
			});
		}
	});

})(this);