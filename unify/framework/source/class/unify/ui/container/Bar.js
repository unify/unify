/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.container.Bar", {
  extend: unify.ui.container.Composite,
  
  construct : function(layout) {
    this.base(arguments);
    this._setLayout(layout || new qx.ui.layout.HBox());
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "bar"
    }
  },
  
  members : {
    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */
    
    setItems : function(items) {
      var itemElem;
      
      for (var i=0, l=items.length; i<l; i++)
      {
        itemElem = this._createItemElement(items[i]);
        this._add(itemElem);
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
      var itemElem = new unify.ui.basic.NavigationButton();
      
      // rel is independently usable
      if (config.rel) {
        itemElem.setRelation(config.rel);
      }
      
      // there can be only one of [jump, exec, show]
      if (config.jump) {
        itemElem.setGoTo(config.jump);
      } else if (config.exec) {
        itemElem.setExecute(config.exec);
      } else if (config.show) {
        itemElem.setShow(config.show);
      }

      if (config.label) {
        itemElem.setValue(config.label);
      }

      return itemElem;
    }
  },
  
  destruct : function() {
    this.__view = null;
    this.__toolBar = null;
  }
});
