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
  extend : unify.ui.container.Composite,

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
    this.base(arguments, new unify.ui.layout.SplitView());

    this.__masterViewManager = masterViewManager;
    this.__detailViewManager = detailViewManager;
    
    // Configure view manager relation
    detailViewManager.setMaster(masterViewManager);
    
    // Attach to rotate event to control view manager visibility
    // TODO
    qx.event.Registration.addListener(window, "orientationchange", this.__onRotate, this);
    
    this.setUserData("splitViewManager", this); // TODO : Remove
    
    this.add(masterViewManager);
    this.add(detailViewManager);
  },
  


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  members :
  {
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
      var elem = this.getElement();
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
     * Inlines the master view manager into the split view
     */
    inlineMasterView : function() {
      var masterWidget = this.__masterViewManager;
      this.addAt(masterWidget, 0);
      masterWidget.show();
    }
  }
});
