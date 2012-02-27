/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.container.Bar", {
  include: [unify.ui.container.Composite],
  
  construct : function(layout) {
    unify.ui.container.Composite.call(this);
    this._setLayout(layout || new unify.ui.layout.HBox());
  },
  
  properties : {
    // overridden
    appearance : {
      init: "bar"
    }
  },
  
  members : {
    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */
    
    /**
     * Set items on bar
     *
     * @param items {Array} Items to be added to bar
     * @return {Array} array of created widgets for each item in items
     */
    setItems : function(items) {
      var createdItems=[];
      
      for (var i=0, l=items.length; i<l; i++)
      {
        var itemConf=items[i];
        createdItems.push(this.addItem(itemConf));
      }
      return createdItems;
    },

    /**
     * adds an item to this bar
     * @param itemConfig {Object} configuration map for the item
     * @return the created item widget (see _createItemElement)
     */
    addItem : function(itemConfig){
      var itemElem = this._createItemElement(itemConfig);
      if(itemConfig.position){
        this.add(itemElem,{position:itemConfig.position});
      } else {
        this.add(itemElem);//TODO allow this? defaults to right
      }
      return itemElem;
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
    
    /**
     * Creates a item element from js config object
     *
     * @param config {Map} Config of item
     * @return {unify.ui.basic.NavigationButton} Created item
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
        this._setItemLabel(itemElem,config.label);
      }

      return itemElem;
    },

    /**
     * sets the item label text
     * @param itemElem {Object} the item to set the text on
     * @param text {String} the text to set
     */
    _setItemLabel : function(itemElem,text){
        itemElem.setValue(text);
    }
  }
});
