qx.Class.define("unify.ui.container.Spacer", {
  extend: unify.ui.core.Widget,
  
  construct : function() {
    this.base(arguments);
    this.setLayoutProperties({flex: 1});
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  }
});