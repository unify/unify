qx.Class.define("unify.ui.widget.basic.Label", {
  extend : unify.ui.widget.core.Widget,
  
  construct : function(text) {
    this.setText(text);
  },
  
  properties : {
    text : {
      apply: "_applyText"
    }
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    },
    
    _applyText : function(value, old) {
      this.getElement().innerHTML = value;
    }
  }
});
