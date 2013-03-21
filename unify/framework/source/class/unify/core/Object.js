
core.Class("unify.core.Object", {
	include : [lowland.Object],
	
	construct : function() {
		lowland.Object.call(this);
		lowland.ObjectManager.register(this);
	},
	
	members : {
		
		__disposed : false,
		
		/**
		 * {Boolean} Returns if class instance is disposed and nothing should be executed on it.
		 */
		isDisposed : function() {
			return this.__disposed;
		},
		
		/**
		 * Dispose class instance.
		 */
		dispose : function() {
			if (this.__disposed) {
				return;
			}
			if (jasy.Env.isSet("debug")) {
				console.log("DISPOSE: ", this);
			}
			this.__disposed = true;
			
			try {
				this.destruct();
			} catch (e) {
				console.error(e.message, e.stack);
			}
		},
		
		_disposeArrays : function() {
			for (var i=0,ii=arguments.length; i<ii; i++) {
				var data = arguments[i];
				if (data) {
					console.log("dispose array: ", data);
					for (var i=0,ii=data.length; i<ii; i++) {
						var d = data[i];
						if (d.dispose) {
							d.dispose();
						}
					}
					data.length = 0;
				}
			}
		},
		
		_disposeObjects : function() {
			for (var i=0,ii=arguments.length; i<ii; i++) {
				var obj = arguments[i];
				
				if (obj && obj.dispose) {
					obj.dispose();
				}
			}
		},
		
		/**
		 * Destructor
		 */
		destruct : function() {
			lowland.ObjectManager.unregister(this);
			lowland.Object.prototype.destruct.call(this);
		}
		
	}
});
