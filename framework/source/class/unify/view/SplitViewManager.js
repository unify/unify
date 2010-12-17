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
      var PopOverManager = this.getPopOverManager();
      var masterViewManager = this.__masterViewManager;
      var detailViewManager = this.__detailViewManager;
      
      // Portrait shows only detail view manager
      if (orient == 0 || orient == 180) 
      {
        if (masterElem.parentNode == elem)
        {
          this.debug("Switching to portrait layout");
          
          elem.setAttribute("orient", "portrait");
          elem.removeChild(masterViewManager.getElement());
          PopOverManager.setViewManager(masterViewManager);
          detailViewManager.setMaster(masterViewManager);
        }
      } 
      else
      {
        if (masterElem.parentNode != elem)
        {
          this.debug("Switching to landscape layout");
          
          elem.setAttribute("orient", "landscape");
          PopOverManager.resetViewManager();
          elem.insertBefore(masterViewManager.getElement(), elem.firstChild);
          detailViewManager.resetMaster();
        }
      }
    },
    
    
    /**
     * 
     *
     */
    getPopOverManager : function()
    {
      var popOverManager = this.__popOverManager;
      if (!popOverManager) {
        popOverManager = this.__popOverManager = new unify.view.PopOverManager;
      } 
      
      return popOverManager;
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

        var elem = this.__element = document.createElement("div");
        elem.className = "split-view";
        elem.setAttribute("orient", orient == 90 || orient == 270 ? "landscape" : "portrait");
        
        if (orient == 90 || orient == 270) 
        {
          elem.appendChild(this.__masterViewManager.getElement());
          this.__detailViewManager.resetMaster();
        } 
        else 
        {
          this.getPopOverManager().setViewManager(this.__masterViewManager);
          this.__detailViewManager.setMaster(this.__masterViewManager);
        }
        
        elem.appendChild(this.__detailViewManager.getElement());
      }

      return elem;
    }
  }
});
