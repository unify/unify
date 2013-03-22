/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * #break(unify.ui.layout.queue.Manager)
 */

(function() {
	
	var widgetQueue = [];
	
	/** {String} Name of queue */
	var name = "dispose";

	core.Module("unify.ui.layout.queue.Dispose", {
		name : name,
		
		/**
		 * Add @widget {unify.ui.core.Widget} to queue.
		 */
		add : function(widget) {
			if (!widgetQueue.contains(widget)) {
				widgetQueue.push(widget);
				unify.ui.layout.queue.Manager.run(name);
			}
		},
		
		/**
		 * Flushes queue. 
		 */
		flush : function() {
			var widget;
			while ((widget = widgetQueue.shift())) {
				widget.dispose(true);
			}
		}
	});

})();
