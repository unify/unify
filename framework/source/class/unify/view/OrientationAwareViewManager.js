/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Specialized ViewManager that shows views fullscreen modal
 *
 */
qx.Class.define("unify.view.OrientationAwareViewManager",
{
  extend : unify.view.ViewManager,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(managerId)
  {
    this.base(arguments,managerId);

    // Attach to rotate event to control view manager visibility
    qx.event.Registration.addListener(window, "rotate", this.__onRotate, this);
  },
  members :
  {
    //overridden
    _createElement : function(){
      var element=this.base(arguments);
      var orient = qx.bom.Viewport.getOrientation();
      var isLandscape=(orient == 90 || orient == 270 || orient == -90 || orient == -270);
      element.setAttribute("orient", isLandscape ? "landscape" : "portrait");
      return element;
    },


    /**
     * Reacts on rotate event of window
     *
     * @param e {unify.event.type.Orientation} Event object
     */
    __onRotate : function(e)
    {

      if (!this.isCreated()) {
        return;
      }
      var elem=this.getElement();
      var orient = e.getOrientation();
      var oldOrient = elem.getAttribute("orient");

      var isLandscape=(orient == 90 || orient == 270 || orient == -90 || orient == -270);

      if(isLandscape){
        if(oldOrient != "landscape"){
          if (qx.core.Environment.get("qx.debug")) {
            this.debug("Switching to landscape layout");
          }
          elem.setAttribute("orient", "landscape");
        }
      } else {
        if(oldOrient != "portrait"){
          if (qx.core.Environment.get("qx.debug")) {
            this.debug("Switching to portrait layout");
          }
          elem.setAttribute("orient", "portrait");
        }
      }
    }
  },
  destruct : function(){
    qx.event.Registration.removeListener(window, "rotate", this.__onRotate, this);
  }
});