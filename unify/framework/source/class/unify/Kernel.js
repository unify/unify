core.Module("unify.Kernel", {
	init : function() {
		//core.io.Script.load("script/" + jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getChecksum() + ".js");
		
		/** #require(ext.Console) */
		
		if (jasy.Env.isSet("runtime", "browser")) {
			console.log("Browser");
			var worker = new Worker("script/kernel.js");
			worker.addEventListener("message", function(msg) {
				if (msg.data && msg.data.type == "core/debug/log") {
					console.log.apply(console, msg.data.msg);
				}
				if (msg.data && msg.data.type == "core/debug/warn") {
					console.warn.apply(console, msg.data.msg);
				}
				if (msg.data && msg.data.type == "core/debug/error") {
					console.error.apply(console, msg.data.msg);
				}
			});
			
			core.io.Script.load("script/" + jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getChecksum() + ".js");
		} else {
			/*console.log("Worker");
			console.warn("Worker warn");
			console.error("Worker err");
			
			var url = jasy.Env.getValue("unify.application.namespace") + "-" + jasy.Env.getChecksum() + ".js";
			console.log("LOAD ", url);
			try {
				importScripts(url);
			} catch (e) {
				console.log("ERROR ", {message: e.message, filename: e.fileName || url});
			}*/
		}
	}
});

setTimeout(unify.Kernel.init, 0);
