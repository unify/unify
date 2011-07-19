qx.Class.define("unify.ui.widget.container.Spacer", {
  extend: unify.ui.widget.core.Widget,
  
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