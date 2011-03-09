/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Generic composite container widget
 */
qx.Class.define("unify.ui.widget.container.Scroll", {
  extend : unify.ui.widget.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],

  construct : function() {
    this.base(arguments, new qx.ui.layout.Basic());
  },

  members: {
    __scrollView : null,
  
    _createElement : function() {
      var scrollView = this.__scrollView = new unify.ui.ScrollView();
      return scrollView.getElement();
    },

    getContentElement : function() {
      var scrollView = this.__scrollView;
      var contentElement;
      if (!scrollView) {
        this.getElement();
        scrollView = this.__scrollView;

        contentElement = scrollView.getContentElement();
        qx.bom.element2.Style.set(contentElement, "position", "absolute");
      } else {
        contentElement = scrollView.getContentElement()
      }

      return contentElement;
    }
  },
  
  destruct : function() {
    this.__scrollView.dispose();
    this.__scrollView = null;
  }
});
