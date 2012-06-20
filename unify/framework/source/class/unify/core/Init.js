(function() {

  var app;
  
  var getApplication = function() {
    return app;
  };
  
  var shutDown = function() {
    lowland.ObjectManager.dispose();
  };
  
  var DOMReadyEvent;
  var DOMReadyState;
  
  if (core.Env.getValue("engine") == "trident") {
    DOMReadyEvent = "readystatechange";
  } else {
    DOMReadyEvent = "DOMContentLoaded";
  }
  
  var runStartup = function() {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      lowland.bom.Events.unlisten(document, DOMReadyEvent, runStartup);
      
      var Application = core.Class.getByName(core.Env.getValue("application") + ".Application");
      var init = new Application();
      
      app = init;
  
      init.main();
      init.finalize();
      
      //lowland.bom.Events.listen(window, "shutdown", shutDown);
      //lowland.bom.Events.listen(window, "beforeunload", shutDown);
    }
  };
  
  var readyStateChange = function() {
    if (core.Env.getValue("engine") == "trident") {
      if (document.readyState === "complete") {
        runStartup();
      }
    } else {
      runStartup();
    }
  };
  
  var startUp = function() {
    if (core.Env.getValue("engine") == "trident") {
      lowland.bom.Events.listen(document, "readystatechange", readyStateChange);
    } else {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        runStartup();
      } else {
        lowland.bom.Events.listen(document, "DOMContentLoaded", readyStateChange);
      }
    }
  };
  

  core.Class("unify.core.Init", {
    include : [unify.core.Object],
    
    construct : function() {
      unify.core.Object.call(this);
    },
    
    members : {
      main : function() {
        throw new Error("main is not implemented");
      },
      finalize : function() {}
    }
  });
  
  unify.core.Statics.annotate(unify.core.Init, {
    getApplication : getApplication,
    startUp : startUp,
    shutDown : shutDown
  });

})();
