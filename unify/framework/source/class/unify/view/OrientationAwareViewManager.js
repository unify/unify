/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ***********************************************************************************************

#require(qx.event.handler.Orientation)

*********************************************************************************************** */
// TODO: Switch to widget system
/**
 * Specialized ViewManager that shows views fullscreen modal
 * @deprecated
 *
 */
qx.Class.define("unify.view.OrientationAwareViewManager",
{
  extend : qx.core.Object, //unify.view.ViewManager,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(managerId)
  {
    this.base(arguments,managerId);

    // Attach to rotate event to control view manager visibility
    qx.event.Registration.addListener(window, "orientationchange", this._onRotate, this);
  },
  members :
  {
    //overridden
    _createElement : function(){
      var element=this.base(arguments);
      var isLandscape=qx.bom.Viewport.isLandscape();
      element.setAttribute("orient", isLandscape ? "landscape" : "portrait");
      return element;
    },


    /**
     * Reacts on rotate event of window
     *
     * @param e {qx.event.type.Orientation} Event object
     */
    _onRotate : function(e)
    {

      if (!this.isCreated()) {
        return;
      }
      var elem=this.getElement();
      var orient = e.getOrientation();
      var oldOrient = elem.getAttribute("orient");

      var isLandscape=qx.bom.Viewport.isLandscape();

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
    qx.event.Registration.removeListener(window, "orientationchange", this._onRotate, this);
  }
});
