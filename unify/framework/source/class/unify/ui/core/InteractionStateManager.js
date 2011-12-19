qx.Class.define("unify.ui.core.InteractionStateManager", {
  extend: qx.core.Object,
  type: "singleton",
  
  properties : {
    hoveredWidget : {
      nullable: true,
      apply : "_applyHover"
    },
    
    pressedWidget : {
      nullable: true,
      apply : "_applyPress"
    }
  },
  
  members : {
    _applyHover : function(value) {
      console.log("HOVER: " + value);
    },
    
    _applyPress : function(value) {
      console.log("PRESS: " + value);
    }
  }
});