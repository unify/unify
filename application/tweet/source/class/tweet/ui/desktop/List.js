/* ************************************************************************

   Tweet

   Copyright:
     2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * A Twitter typical tweet list. Contains multiple instances of
 * {@link Item}.
 *
 * Do not derives from the qooxdoo list widget because we do not need
 * any kind of selection features. This class instead derives from the
 * {@link qx.ui.core.AbstractScrollArea} to supported large lists with
 * scrolling.
 */
qx.Class.define("tweet.ui.desktop.List",
{
  extend : qx.ui.core.scroll.AbstractScrollArea,
  include : [ qx.ui.core.MRemoteChildrenHandling ],

  construct : function()
  {
    this.base(arguments);

    // Remove default sizes
    this.setWidth(null);
    this.setHeight(null);

    // Create content holder
    var content = this.__content = new qx.ui.container.Composite();
    content.setLayout(new qx.ui.layout.VBox);
    this.getChildControl("pane").add(content);
  },

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "twitter-list"
    }
  },

  members :
  {
    // overridden
    getChildrenContainer : function() {
      return this.__content;
    }
  }
});
