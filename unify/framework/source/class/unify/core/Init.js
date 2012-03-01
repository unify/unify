core.Class("unify.core.Init", {
  members : {
    main : function() {
      throw new Error("main is not implemented");
    },
    finalize : function() {}
  }
});

unify.core.Statics.annotate(unify.core.Init, {
  getApplication : function() {
    return unify.core.Init.$$application;
  }
});


(function() {
  var load = function() {
    var Application = core.Class.getByName(core.Env.getValue("application") + ".Application");
    var init = new Application();
    
    unify.core.Init.$$application = init;

    init.main();
    init.finalize();
  };
  
  //lowland.bom.Events.set(element, type, handler, capture);
  
  var events = ["error",
      "load",
      "beforeunload",
      "unload",
      "resize",
      "scroll",
      "beforeshutdown"];
      
  var addNativeListener = function(target, type, listener, useCapture) {
      if (target.addEventListener) {
        target.addEventListener(type, listener, !!useCapture);
      } else if (target.attachEvent) {
        target.attachEvent("on" + type, listener);
      } else if (typeof target["on" + type] != "undefined") {
        target["on" + type] = listener;
      } else {
        /*if (qx.core.Environment.get("qx.debug")) {
          qx.log.Logger.warn("No method available to add native listener to " + target);
        }*/
      }
    };

  addNativeListener(window, "load", load);
})();