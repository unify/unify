/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Basic implementation of a list
 */
qx.Class.define("unify.ui.container.List", {
  extend: unify.ui.container.Composite,
  
  construct : function() {
    this.base(arguments);
    
    var layout = new qx.ui.layout.VBox();
    this._setLayout(layout);
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "list"
    },
    
    /**
     * Data of list
     */
    data : {
      apply: "_applyData"
    }
  },
  
  members : {
    _applyData : function(data) {
      this._removeAll();
      
      var header, fields, title;
      for (header in data) {
        this._add(
          new unify.ui.basic.Label(header).set({
            appearance: "list.header"
          })
        );
        
        var containerLayout = new qx.ui.layout.Grid();
        containerLayout.setColumnFlex(0, 1);
        var container = new unify.ui.container.Composite(containerLayout);
        container.setAppearance("list.content");
        var rowCounter = 0;
        
        fields = data[header];
        for (title in fields) {
          container.add(
            new unify.ui.basic.Label(title).set({
              appearance: "list.description"
            }),
            { row: rowCounter, column: 0 }
          );
          container.add(
            new unify.ui.basic.Label(fields[title]).set({
              appearance: "list.value"
            }),
            { row: rowCounter++, column: 1 }
          );
          
          this._add(container);
        }
      }
    }
  }
});