qx.Class.define("unify.ui.widget.container.List", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function() {
    this.base(arguments);
    
    var layout = new qx.ui.layout.Grid();
    layout.setColumnFlex(1, 1);
    this._setLayout(layout);
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "list"
    },
    
    data : {
      apply: "_applyData"
    }
  },
  
  members : {
    _applyData : function(data) {
      this._removeAll();
      
      var rowCounter = 0;
      
      var header, fields, title;
      for (header in data) {
        this._add(
          new unify.ui.widget.basic.Label(header).set({
            appearance: "list.header"
          }),
          { row: rowCounter++, column: 0, colSpan: 2 }
        );
        
        fields = data[header];
        for (title in fields) {
          this._add(
            new unify.ui.widget.basic.Label(title).set({
              appearance: "list.description"
            }),
            { row: rowCounter, column: 0 }
          );
          this._add(
            new unify.ui.widget.basic.Label(fields[title]).set({
              appearance: "list.value"
            }),
            { row: rowCounter++, column: 1 }
          );
        }
      }
    }
  }
});