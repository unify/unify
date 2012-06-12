/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

// TODO: #require(qx.event.handler.Orientation)

/**
 * A manager for a so-called split screen.
 *
 */
core.Class("unify.view.SplitViewManager",
{
  include : [unify.ui.container.Composite],

  /*
  ----------------------------------------------------------------------------
     CONSTRUCTOR
  ----------------------------------------------------------------------------
  */

  /**
   * @param masterViewManager {unify.view.ViewManager} The master view manager
   * @param detailViewManager {unify.view.ViewManager} The detail view manager
   * @param layout {unify.ui.layout.Base?null} Optional other layout manager than special splitview one
   */
  construct : function(masterViewManager, detailViewManager, layout)
  {
    unify.ui.container.Composite.call(this, layout || new unify.ui.layout.special.SplitView());

    this.__masterViewManager = masterViewManager;
    this.__detailViewManager = detailViewManager;

    // Configure view manager relation
    detailViewManager.setMaster(masterViewManager);

    // Attach to rotate event to control view manager visibility
    this.addNativeListener(window, "orientationchange", this.__onRotate, this);

    this.add(masterViewManager);
    this.add(detailViewManager);

    this.__onRotate();
  },



  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  members :
  {
    /** {unify.view.ViewManager} The master view manager */
    __masterViewManager : null,

    /** {unify.view.ViewManager} The detail view manager */
    __detailViewManager : null,


    //overridden
    show: function(){
      this.base(arguments);
      if(!this.isPortrait()){
        this.__masterViewManager.show();
      }
      this.__detailViewManager.show();
    },
    
    //overridden
    hide: function(){
      this.__masterViewManager.hide();
      this.__detailViewManager.hide();
      this.base(arguments);
    },

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

      var ViewOverlayManager = unify.view.helper.ViewOverlayManager.getInstance();
      var oldOrient = elem.getAttribute("orient");

      var isLandscape=!this.isPortrait();

      if(isLandscape){
        if(oldOrient != "landscape"){
          if (core.Env.getValue("debug")) {
            this.debug("Switching to landscape layout");
          }
          ViewOverlayManager.hide(master.getId(),true);
          elem.setAttribute("orient", "landscape");

          master.setDisplayMode('default');
          this.addAt(master,0);//readd master viewmanager (may have been excluded by popovermanager)
          master.show();

        }
      } else {
        if(oldOrient != "portrait"){
          if (core.Env.getValue("debug")) {
            this.debug("Switching to portrait layout");
          }
          elem.setAttribute("orient", "portrait");
          master.setDisplayMode('popover');
          master.hide();
        }
      }
    },

    /**
     * Returns if view is in portrait mode
     *
     * @param renderWidth {Number?null} Optional render width if known
     * @param renderHeight {Number?null} Optional render height if known
     *
     * @return {Boolean} View is in portrait mode
     */
    isPortrait : function(renderWidth, renderHeight) {
      if (renderWidth && renderHeight) {
        return renderWidth < renderHeight;
      } else {
        return !unify.bom.Viewport.isLandscape();
      }
    }
  }
});
