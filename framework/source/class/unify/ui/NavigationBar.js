/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * The NavigationBar may be used as the first control of the {@link Layer}
 * for showing a title and offering simple navigation options. Like a {@link ToolBar}
 * it might show additional buttons on the right side for navigation proposes.
 * The left side is used for a backward navigation
 */
qx.Class.define("unify.ui.NavigationBar",
{
  extend : unify.ui.Abstract,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param view {unify.view.Static} View controller to connect to
   */
  construct : function(view)
  {
    this.base(arguments);

    if (!view || !(view instanceof unify.view.StaticView)) {
      throw new Error("Invalid view! NavigationBar must be attached to a view!")
    }
    
    this.__view = view;

    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeParent", this.__onViewChangeParent, this);
    view.addListener("changeMaster", this.__onViewChangeMaster, this);
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    
    
    /** 
     * custom bar items displayed on the right of the navigation bar when
     * this item is the top item.
     */
    items :
    {
      check : "Array",
      nullable : true,
      apply : "_applyItems"
    }
  },
  
  
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
    
  members :
  {
    _createElement : function()
    {
      var doc = document;
      
      var elem = doc.createElement("div");
      elem.className = "navigation-bar";
      
      var leftElem = this.__leftElem = doc.createElement("div");
      leftElem.className = "left";
      elem.appendChild(leftElem);

      var titleElem = this.__titleElem = doc.createElement("h1");
      titleElem.innerHTML = this.__view.getTitle();
      elem.appendChild(titleElem);
      
      var rightElem = this.__rightElem = doc.createElement("div");
      rightElem.className = "right";
      elem.appendChild(rightElem);
      
      this.__onViewChangeParent();
      this.__onViewChangeMaster();

      this._applyItems(this.getItems());
      return elem;      
    },

    __createItem : function(config)
    {
      var itemElem;
      
      if (config.rel || config.jump || config.exec || config.show)
      {
        itemElem = document.createElement("div");

        if (config.rel) {
          itemElem.setAttribute("rel", config.rel);
        }

        if (config.jump) {
          itemElem.setAttribute("goto", config.jump);
        } else if (config.exec) {
          itemElem.setAttribute("exec", config.exec);
        } else if (config.show) {
          itemElem.setAttribute("show", config.show);
        }
      }
      else
      {
        itemElem = document.createElement("div");
      }
      
      // Add kind as CSS class
      if (config.kind) {
        qx.bom.element2.Class.add(itemElem, config.kind);
      }

      if (config.style) {
        qx.bom.element2.Class.add(itemElem, config.style);
      }
      
      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }      
      
      return itemElem;
    },

    _applyItems: function(items) {
      var elem = this.__rightElem;
      if (elem) {
        elem.innerHTML = '';
        if (items) {
          for (var i = 0,ii = items.length; i < ii; i++) {
            elem.appendChild(this.__createItem(items[i]));
          }
        }
      }
    },
    
    
    
    /*
    ---------------------------------------------------------------------------
      EVENT LISTENER
    ---------------------------------------------------------------------------
    */

    /**
     * Event listener for parent changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeParent : function(e)
    {
      var parentElem = this.__parentElem;
      if (!parentElem) 
      {
        parentElem = this.__parentElem = document.createElement("div");
        parentElem.setAttribute("rel", "parent");
        parentElem.className = "button";
        this.__leftElem.appendChild(parentElem);
      }
      
      var parent = this.__view.getParent();
      parentElem.innerHTML = parent ? parent.getTitle("parent") : "";
      parentElem.style.display = parent ? "" : "none";
    },


    /**
     * Event listener for master changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeMaster : function(e)
    {
      var masterElem = this.__masterElem;
      if (!masterElem)
      {
        masterElem = this.__masterElem = document.createElement("div");
        masterElem.className = "button";
        this.__leftElem.appendChild(masterElem);
      }
      var master = this.__view.getMaster();
      if(master){
        masterElem.setAttribute("show", master.getId());
        var currentMasterView=master.getCurrentView();
        masterElem.innerHTML = currentMasterView?currentMasterView.getTitle("parent") : "";
        masterElem.style.display = "";
      } else {
        masterElem.style.display="none";
      }
    },


    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     *
     * @param e {qx.event.type.Data} Property change event
     */
    __onViewChangeTitle : function(e) {
      this.__titleElem.innerHTML = this.__view.getTitle();
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var view = this.__view
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeParent", this.__onViewChangeParent, this);
    view.removeListener("changeMaster", this.__onViewChangeMaster, this);
  }
});
