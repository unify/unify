qx.Class.define("unify.ui.core.InteractionStateManager", {
  extend: qx.core.Object,
  type: "singleton",
  
  properties : {
    hoveredWidget : {
      nullable: true
    },
    
    pressedWidget : {
      nullable: true
    }
  }
});