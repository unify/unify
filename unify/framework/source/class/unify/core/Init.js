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
  getApplication : function() {
    return unify.core.Init.$$application;
  },
  
  startUp : function() {
    var Application = core.Class.getByName(core.Env.getValue("application") + ".Application");
    var init = new Application();
    
    unify.core.Init.$$application = init;

    init.main();
    init.finalize();
  }
});