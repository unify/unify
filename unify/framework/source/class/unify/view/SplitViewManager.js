/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ***********************************************************************************************

#require(qx.event.handler.Orientation)

*********************************************************************************************** */
/**
 * A manager for a so-called split screen.
 *
 */
qx.Class.define("unify.view.SplitViewManager",
{
  extend : qx.core.Object,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  
  /**
   * @param masterViewManager {unify.view.ViewManager} The master view manager 
   * @param detailViewManager {unify.view.ViewManager} The detail view manager
   */
  construct : function(masterViewManager, detailViewManager)
  {
    this.base(arguments);

    this.__masterViewManager = masterViewManager;
    this.__detailViewManager = detailViewManager;
    
    // Configure view manager relation
    detailViewManager.setMaster(masterViewManager);
    
    // Attach to rotate event to control view manager visibility
    qx.event.Registration.addListener(window, "orientationchange", this.__onRotate, this);
  },
  


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  members :
  {
    __element : null,
  
    /** {unify.view.ViewManager} The master view manager */
    __masterViewManager : null,

    /** {unify.view.ViewManager} The detail view manager */
    __detailViewManager : null,
    
    
    /**
     * Reacts on rotate event of window
     *
     * @param e {unify.event.type.Orientation} Event object
     */
    __onRotate : function(e)
    {
      var elem = this.__element;
      if (!elem) {
        return;
      }

      var master = this.__masterViewManager;
      var masterElem = master.getElement();
      var PopOverManager = unify.view.PopOverManager.getInstance();
      var oldOrient = elem.getAttribute("orient");

      var isLandscape=qx.bom.Viewport.isLandscape();

      if(isLandscape){
        if(oldOrient != "landscape"){
          if (qx.core.Environment.get("qx.debug")) {
            this.debug("Switching to landscape layout");
          }
          PopOverManager.hide(master.getId(),true);
          elem.setAttribute("orient", "landscape");
          elem.insertBefore(masterElem, elem.firstChild);
          master.setDisplayMode('default');
          master.show();
        }
      } else {
        if(oldOrient != "portrait"){
          if (qx.core.Environment.get("qx.debug")) {
            this.debug("Switching to portrait layout");
          }
          elem.setAttribute("orient", "portrait");
          master.setDisplayMode('popover');
        }
      }
    },
    
  
    /**
     * Returns the root element of the split screen
     *
     * @return {Element} DOM element of split screen
     */
    getElement : function()
    {
      var elem = this.__element;
      if (!elem)
      {
        var isLandscape=qx.bom.Viewport.isLandscape();
        var elem = this.__element = document.createElement("div");
        elem.className = "split-view";
        elem.setAttribute("orient", isLandscape ? "landscape" : "portrait");

        var master = this.__masterViewManager;
        var detail = this.__detailViewManager;
        
        if (isLandscape)
        {
          elem.insertBefore(master.getElement(), elem.firstChild);
        } 
        else 
        {
          master.setDisplayMode('popover');
        }
        
        elem.appendChild(detail.getElement());
      }

      return elem;
    },
    
    _createWidgetElement : function() {
      var e = this.__viewcontainer = new unify.ui.container.Composite(new unify.ui.layout.SplitView());
      //this._makeNavigatable(e);
      
      e.add(this.__masterViewManager.getWidgetElement());
      e.add(this.__detailViewManager.getWidgetElement());
      
      return e;
    },
    
    _getWidgetElement : function() {
      var e = this.__widgetElement;
      if (e) {
        return e;
      }
      
      e = this.__widgetElement = this._createWidgetElement();
      
      return e;
    },
    
    getWidgetElement : function() {
      return this._getWidgetElement();
    }
  }
});
