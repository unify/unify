qx.Class.define("unify.ui.widget.basic.Content", {
  extend : unify.ui.widget.core.Widget,
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  }
});
