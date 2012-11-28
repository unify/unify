(function() {

	var addStatics = core.Main.addStatics;

	core.Module("unify.core.Statics", {
		annotate: function(Clazz, statics) {
			var clsname = (""+Clazz).substring(7);
			clsname = clsname.substring(0, clsname.length-1);
			addStatics(clsname, statics);
		}
	});

})();
