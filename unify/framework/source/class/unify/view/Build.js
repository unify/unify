/*
===============================================================================================

Unify Project

Homepage: unify-project.org
License: MIT + Apache (V2)
Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

core.Class("unify.view.Build", {
	members : {
		__widgetRegistry : null,
		
		build : function(config, root) {
			var widgetRegistry = this.__widgetRegistry;
			
			if (!widgetRegistry) {
				widgetRegistry = this.__widgetRegistry = {};
			}
			
			if (!root) {
				root = this;
			}
			
			for (var i=0,ii=config.length; i<ii; i++) {
				var conf = config[i];
				var element = conf.create;
				
				if (conf.layout) {
					element.setLayout(conf.layout);
				}
				
				if (conf.appearance) {
					element.setAppearance(conf.appearance);
				}
				
				if (conf.states) {
					for (var j=0,jj=conf.states.length; j<jj; j++) {
						element.addState(conf.states[j]);
					}
				}
				
				if (conf.config) {
					element.set(conf.config);
				}
				
				if (conf.id) {
					widgetRegistry[conf.id] = element;
				}
				
				if (conf.init) {
					conf.init(element, conf.layout);
				}
				
				if (conf.children) {
					this.build(conf.children, element);
				}
				
				if (conf.listen) {
					var keys = Object.keys(conf.listen);
					
					for (var j=0, jj=keys.length; j<jj; j++) {
						var key = keys[j];
					
						element.addListener(key, conf.listen[key], this);
					}
				}
				
				if (conf.listenNative) {
					var keys = Object.keys(conf.listenNative);
					
					for (var j=0, jj=keys.length; j<jj; j++) {
						var key = keys[j];
					
						element.addNativeListener(key, conf.listenNative[key], this);
					}
				}
				
				root.add(element, conf.layoutProperties);
			}
		},
		
		widget : function(id) {
			var widgetRegistry = this.__widgetRegistry;
			return (widgetRegistry && widgetRegistry[id]) || null;
		}
	}
});