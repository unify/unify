qx.Class.define("unify.ui.widget.container.ToolBar", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function(view) {
    this.base(arguments, new qx.ui.layout.Basic());
    
    this.__view = view;
  },
  
  members : {
    __view : null,
    __toolBar : null,
  
    _createElement : function() {
      var toolBar = this.__toolBar = new unify.ui.ToolBar(this.__view);
      return toolBar.getElement();
    },
    
    setItems : function(items) {
      this.__toolBar.setItems(items);
    },
    
    setParent : function(view) {
      this.__toolBar.setParent(view);
    },
    
    setMaster : function(view) {
      this.__toolBar.setMaster(view);
    }
  },
  
  destruct : function() {
    this.__view = null;
    this.__toolBar.dispose();
    this.__toolBar = null;
  }
});
