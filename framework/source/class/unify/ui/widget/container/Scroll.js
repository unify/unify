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
  extend : unify.ui.widget.container.Composite,
  
  construct : function(layout) {
    this.base(arguments, layout || new qx.ui.layout.Basic());
  },

  members: {
    __scrollView : null,
    
    __enableScrollX : null,
    __enableScrollY : null,

    renderLayout : function(left, top, width, height) {
      this.base(arguments, left, top, width, height);
      this.__scrollView.reflow();
    },
  
    _createElement : function() {
      var scrollView = this.__scrollView = new unify.ui.ScrollView();
      var enableScrollX = this.__enableScrollX;
      var enableScrollY = this.__enableScrollY;
      
      if (enableScrollX != null) {
        scrollView.setEnableScrollX(enableScrollX);
      }
      if (enableScrollY != null) {
        scrollView.setEnableScrollY(enableScrollY);
      }
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
    },
    
    setEnableScrollX : function(value) {
      var scrollView = this.__scrollView;
      
      if (scrollView) {
        scrollView.setEnableScrollX(value);
      }
      this.__enableScrollX = value;
    },
    
    setEnableScrollY : function(value) {
      var scrollView = this.__scrollView;
      
      if (scrollView) {
        scrollView.setEnableScrollY(value);
      }
      this.__enableScrollY = value;
    }
  },
  
  destruct : function() {
    this.__scrollView.dispose();
    this.__scrollView = null;
  }
});
