qx.Class.define("unify.ui.widget.basic.Atom", {
  extend: unify.ui.widget.core.Widget,
  
  construct : function(label, icon) {
    this.base(arguments, new unify.ui.widget.layout.AtomLayout);
    
    var imageWidget = this.__imageWidget = new unify.ui.widget.basic.Icon(icon);
    var labelWidget = this.__labelWidget = new unify.ui.widget.basic.Label(label);
    
    this._add(imageWidget);
    this._add(labelWidget);
  },
  
  properties : {
    direction : {
      type : "String",
      value : "top"
    }
  },
  
  members: {
    __imageWidget : null,
    __labelWidget : null,
    
    setSource : function(value) {
      this.__iconWidget.setSource(value);
    },
    
    setText : function(value) {
      this.__labelWidget.setValue(value);
    }
  }
});
