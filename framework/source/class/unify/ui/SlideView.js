/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Slide view component to have left/right sliding boxes with 100% width
 */
qx.Class.define("unify.ui.SlideView", {
  extend : unify.ui.ScrollView,

  construct : function() {
    this.base(arguments);

    this.setEnableScrollY(false);
    this.setPaging(true);
    this.setShowIndicatorX(false);
  },

  members : {
    /**
     * Adds the given HTML string, control or DOM element.
     *
     * @param obj {String|Element|unify.ui.Abstract} HTML, control or element to insert
     */
    add : function(obj) {
      this.base(arguments, obj);

      this.__resize();
    },

    /**
     * Scrolls to a specific page
     *
     * @param pageIndex {Integer} Page to show, starting with 0
     */
    scrollToPage : function(pageIndex) {
      this.scrollTo(-pageIndex*qx.bom.Document.getWidth());
    },

    // overridden
    _createElement : function() {
      var elem = this.base(arguments);

      elem.className = "scroll-view slide-view";

      var Registration = qx.event.Registration;
      Registration.addListener(window, "resize", this.__onResize, this);

      return elem;
    },

    /**
     * Window resize event handler to resize slide view and resnap into bounds of paging
     */
    __onResize : function() {
      this.__resize();

      this.reflow();
    },

    /**
     * Resize of slide view to document width
     */
    __resize : function() {
      var childs = this.getContentElement().childNodes;
      var width = qx.bom.Document.getWidth() + "px";
      for (var i=0,len=childs.length; i<len; i++) {
        childs[i].style.width = width;
      }
    }
  }
});