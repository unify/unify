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
  extend : unify.ui.ToolBar,
  
  
  
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
      throw new Error("Invalid view! NavigationBar must be attached to a view!");
    }
    
    this.__view = view;
    
    // listen for any changes to occour after creation of the nav bar
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
     * custom bar items displayed on the left of the navigation bar
     */
    leftItems :
    {
      check : "Array",
      nullable : true,
      apply : "_applyLeftItems"
    },
    
    /** 
     * custom bar items displayed in the center of the navigation bar
     */
    centerItem :
    {
      check : "Object",
      nullable : true,
      apply : "_applyCenterItem"
    },
    
    /** 
     * custom bar items displayed on the right of the navigation bar
     */
    rightItems :
    {
      check : "Array",
      nullable : true,
      apply : "_applyRightItems"
    },
    
    /*
     * used to store the heading
     */
    centerHeading :
    {
      check : "String",
      nullable : true
    }
    
  },
  
  
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
    
  members :
  {
    // overridden - also handles parent handling
    _createElement : function()
    {
      var doc = document;
      
      var elem = doc.createElement("div");
      elem.className = "navigation-bar";
      
      var leftElem = this.__leftElem = doc.createElement("div");
      leftElem.className = "left";
      elem.appendChild(leftElem);
      
      var centerElem = this.__centerElem = doc.createElement("div");
      centerElem.className = "center";
      // put title in center
      var titleElem = this.__titleElem = doc.createElement("h1");
      centerElem.appendChild(titleElem);
      
      titleElem.innerHTML = this.__view.getTitle();
      elem.appendChild(centerElem);
      
      var rightElem = this.__rightElem = doc.createElement("div");
      rightElem.className = "right";
      elem.appendChild(rightElem);
      
      this.__onViewChangeParent();
      this.__onViewChangeMaster();
      this._applyLeftItems(this.getLeftItems());
      this._applyCenterItem(this.getCenterItem());
      this._applyRightItems(this.getRightItems());
      return elem;
    },
    
    _applyLeftItems: function(items) {
      var elem = this.__leftElem;
      if (elem) {
        elem.innerHTML = '';
        var parentElem= this.__parentElem;
        if(parentElem){
          elem.appendChild(parentElem);
        }
        var masterElem= this.__masterElem;
        if(masterElem){
          elem.appendChild(masterElem);
        }
        if (items) {
          for (var i = 0,ii = items.length; i < ii; i++) {
            elem.appendChild(this.__createItemElement(items[i]));
          }
        }
      }
    },
    
    _applyCenterItem: function(item) {
      var elem = this.__centerElem;
      if (elem) {
        // only fill center if this is a "segmented" item (otherwise heding is shown)
        if (item && item.kind === 'segmented') {
          this.setCenterHeading(elem.innerHTML);
          elem.innerHTML = '';
          elem.appendChild(this.__createItemElement(item));
        } else if(this.getCenterHeading() !== null) {
          elem.innerHTML = this.getCenterHeading();
        }
      }
    },
    
    _applyRightItems: function(items) {
      var elem = this.__rightElem;
      if (elem) {
        elem.innerHTML = '';
        if (items) {
          for (var i = 0,ii = items.length; i < ii; i++) {
            elem.appendChild(this.__createItemElement(items[i]));
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
    this.__parentElem = this.__masterElem = this.__titleElem = this.__leftElem  =this.__rightElem = null;
    var view = this.__view;
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeParent", this.__onViewChangeParent, this);
    view.removeListener("changeMaster", this.__onViewChangeMaster, this);
  }
});
