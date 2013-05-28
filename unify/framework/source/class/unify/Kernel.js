core.Module("unify.Kernel", {
	init : function() {
		if (jasy.Env.getId) {
			core.io.Script.load("script/" + jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getId() + ".js");
		} else {
			core.io.Script.load("script/" + jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getChecksum() + ".js");
		}
	}
});

core.Function.immediate(unify.Kernel.init);
