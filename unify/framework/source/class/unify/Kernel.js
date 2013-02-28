core.Module("unify.Kernel", {
	init : function() {
		core.io.Script.load("script/" + jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getChecksum() + ".js");
	}
});

setTimeout(unify.Kernel.init, 0);
