// TODO : Implement it
qx.Class.define("unify.ui.container.Overlay", {
  extend : unify.ui.container.Composite,
  
  events : {
    "hidden" : "qx.event.type.Event",
    "shown" : "qx.event.type.Event"
  },
  
  properties : {
    // overridden
    appearance : {
      refine: true,
      init: "overlay"
    },
    
    enableAnimation : {
      init: true
    }
  },
  
  construct : function() {
    this.base(arguments, new qx.ui.layout.Canvas());
  },
  
  members : {
    show : function() {
      this.setVisibility("visible");
      this.fireEvent("shown");
    },
    
    hide : function() {
      this.setVisibility("hidden");
      this.fireEvent("hidden");
    }
  }
});