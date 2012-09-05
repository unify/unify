core.Module("unify.core.Singleton", {
	annotate : function(Clazz) {
		var instance = null;
		Clazz.getInstance = function() {
			if (!instance) {
				instance = new Clazz();
			}
			return instance;
		};
	}
});