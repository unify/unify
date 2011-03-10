/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ***********************************************************************************************

#require(unify.event.handler.Orientation)

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
    qx.event.Registration.addListener(window, "rotate", this.__onRotate, this);
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
      var elem = this.__element;
      if (!elem) {
        return;
      }
      
      var orient = e.getOrientation();
      var master = this.__masterViewManager;
      var detail = this.__detailViewManager;
      var masterElem = master.getElement();
      var PopOverManager = unify.view.PopOverManager.getInstance();
      var oldOrient = elem.getAttribute("orient");

      var isLandscape=(orient == 90 || orient == 270 || orient == -90 || orient == -270);

      if(isLandscape){
        if(oldOrient != "landscape"){
          this.debug("Switching to landscape layout");

          PopOverManager.remove(master);
          elem.setAttribute("orient", "landscape");
          elem.insertBefore(masterElem, elem.firstChild);
          detail.resetStandalone();
        }
      } else {
        if(oldOrient != "portrait"){
          this.debug("Switching to portrait layout");

          elem.setAttribute("orient", "portrait");
          detail.setStandalone(true);
          PopOverManager.add(master);
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
        var orient = qx.bom.Viewport.getOrientation();
        var isLandscape=(orient == 90 || orient == 270 || orient == -90 || orient == -270);
        var elem = this.__element = document.createElement("div");
        elem.className = "split-view";
        elem.setAttribute("orient", isLandscape ? "landscape" : "portrait");
        
        var PopOverManager = unify.view.PopOverManager.getInstance();
        var master = this.__masterViewManager;
        var detail = this.__detailViewManager;
        
        if (isLandscape)
        {
          if (PopOverManager.has(master)) {
            PopOverManager.remove(master);
          }
          elem.insertBefore(master.getElement(), elem.firstChild);
          detail.resetStandalone();
        } 
        else 
        {
          detail.setStandalone(true);
          PopOverManager.add(master);
        }
        
        elem.appendChild(detail.getElement());
      }

      return elem;
    }
  }
});
