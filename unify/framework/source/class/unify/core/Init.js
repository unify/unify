(function() {

  var app;
  
  var getApplication = function() {
    return app;
  };
  
  var shutDown = function() {
    lowland.ObjectManager.dispose();
  };
  
  var startUp = function() {
    var Application = core.Class.getByName(core.Env.getValue("application") + ".Application");
    var init = new Application();
    
    app = init;

    init.main();
    init.finalize();
    
    //lowland.bom.Events.listen(window, "shutdown", shutDown);
    lowland.bom.Events.listen(window, "beforeunload", shutDown);
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