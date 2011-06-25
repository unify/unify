/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.widget.container.ToolBar", {
  extend: unify.ui.widget.container.Composite,
  
  construct : function(layout) {
    this.base(arguments);
    this._setLayout(layout || new qx.ui.layout.HBox());
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "toolbar"
    }
  },
  
  members : {
    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */
    
    setItems : function(items) {
      var elem = this.getElement();
      var itemElem;
      
      for (var i=0, l=items.length; i<l; i++)
      {
        itemElem = this._createItemElement(items[i]);
        elem._add(itemElem);
      }
    },
    
    /**
     * disables all items of this Toolbar
     */
    disable: function(){
      if (this._hasChildren) {
        var children = this._getChildren();
        for (var i=0,ii=children.length; i<ii; i++) {
          children[i].setEnabled(false);
        }
      }
    },
    
    /**
     * enables all items of this Toolbar
     */
    enable: function(){
      if (this._hasChildren) {
        var children = this._getChildren();
        for (var i=0,ii=children.length; i<ii; i++) {
          children[i].setEnabled(true);
        }
      }
    },


    /*
    ---------------------------------------------------------------------------
      PRIVATE METHODS
    ---------------------------------------------------------------------------
    */
    
    _createItemElement : function(config)
    {
      var itemElem = new unify.ui.widget.form.Button();

      var navigation = {};
      
      // rel is independently usable
      if (config.rel) {
        navigation.relation = config.rel;
      }
      
      // there can be only one of [jump, exec, show]
      if (config.jump) {
        navigation.goTo = config.jump;
      } else if (config.exec) {
        navigation.execute = config.exec;
      } else if (config.show) {
        navigation.show = config.show;
      }

      if (config.label) {
        itemElem.setValue(config.label);
      }

      itemElem.set(navigation);
      
      return itemElem;
    }
  },
  
  destruct : function() {
    this.__view = null;
    this.__toolBar = null;
  }
});
