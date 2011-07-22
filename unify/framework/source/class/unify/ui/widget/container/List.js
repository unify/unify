qx.Class.define("unify.ui.widget.container.List", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function() {
    this.base(arguments);
    
    this._setLayout(new qx.ui.layout.VBox());
  },
  
  properties : {
    data : {
      apply: "_applyData"
    }
  },
  
  members : {
    _applyData : function(data) {
      this._removeAll();
      
      var header, fields, title;
      for (header in data) {
        this._add(new unify.ui.widget.basic.Label(header));
        
        fields = data[header];
        for (title in fields) {
          this._add(new unify.ui.widget.basic.Label(title + ": " + fields[title]));
        }
      }
    }
  }
});