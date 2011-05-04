qx.Class.define("unify.ui.widget.basic.Image", {
  extend: unify.ui.widget.core.Widget,
  
  construct : function(source) {
    this.base(arguments);
    if (source) {
      this.setSource(source);
    }
  },
  
  properties : {
    source : {
      apply : "_applySource"
    }
  },
  
  members: {
    _createElement : function() {
      var e = document.createElement("img");
      var source = this.getSource();
      if (source) {
        e.setAttribute("src", source);
      }
      
      return e;
    },
    
    _applySource : function(value) {
      if (this._hasElement()) {
        var e = this.getElement();
        e.setAttribute("src", value);
      }
    }
  }
});
