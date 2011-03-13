qx.Class.define("unify.ui.widget.container.NavigationBar", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function(view) {
    this.base(arguments, new qx.ui.layout.Basic());
    
    this.__view = view;
  },
  
  properties : {
    minWidth: {
      refine: true,
      init: 200
    },
    height: {
      refine: true,
      init: 42
    }
  },
  
  members : {
    __view : null,
    __navigationBar : null,
  
    _createElement : function() {
      var navBar = this.__navigationBar = new unify.ui.NavigationBar(this.__view);
      return navBar.getElement();
    },
    
    setItems : function(items) {
      this.__navigationBar.setItems(items);
    },
    
    getItems : function() {
      return this.__navigationBar.getItems();
    },
    
    resetItems : function() {
      this.__navigationBar.resetItems();
    }
  },
  
  destruct : function() {
    this.__view = null;
    this.__navigationBar.dispose();
    this.__navigationBar = null;
  }
});
