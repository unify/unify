/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * Root widget bound to the root DOM element
 */
core.Class("unify.view.ViewportRoot", {
  include : [unify.ui.core.Widget, unify.ui.core.MChildrenHandling],
  
  /**
   * Constructor of root widget with @rootElement {Element} as root element everything
   * is painted to, @rootEventElement {Element} as element all root events are bound to and
   * @viewportElement {Element} as calculation base for out of layout elements like
   * popovers.
   * Optional a @layout {unify.ui.layout.Base?null} can be given.
   */
  construct : function(rootElement,rootEventElement,viewportElement,layout) {
    this.__rootElement = rootElement;
    this.__rootEventElement = rootEventElement;
    this.__viewportElement = viewportElement;
    
    unify.ui.core.Widget.call(this);
    this._setLayout(layout || new unify.ui.layout.Canvas());
    
    this.addNativeListener(window, "resize", this.__onResize, this);
    this.addNativeListener(window, "scroll", this.__onScroll, this);
  },
  
  properties : {
    /** {String} Appearance ID of widget used by theme system */
    appearance : {
      init: "root"
    }
  },
  
  members : {
    /**
     * Set styles of @map {Map} to the element.
     */
    setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle,
    
    // Root element the whole application is based upon
    __rootElement : null,
    
    // Root element that global events use
    __rootEventElement : null,
    
    // Size hint
    __rootSizeHint : null,
    
    // overridden
    _createElement : function() {
      var div = document.createElement("div");
      
      var pos = {
        position: "absolute",
        left: 0,
        top: 0
      };
      core.bom.Style.set(div, pos);
      
      this.__viewportElement.appendChild(div);
      
      return div;
    },
    
    /**
     * {Map} Return calculated and cached width and size of root element.
     */
    getBounds : function() {
      var size = this.getSizeHint();
      
      return {
        left: 0,
        top: 0,
        width: size.width,
        height: size.height
      };
    },
    
    /**
     * {Integer} Get nesting level (= depth in widget tree).
     */
    getNestingLevel : function() {
      return 0;
    },
    
    /**
     * {Element} Returns root event element every root event is bound to.
     */
    getEventElement : function() {
      return this.__rootEventElement;
    },
    
    /**
     * {Element} Returns viewport element every out of layout element is painted into, e.g. popovers.
     */
    getViewportElement : function() {
      return this.__viewportElement;
    },
    
    /**
     * Resize handler to start relayouting
     */
    __onResize : function() {
      var sizeHint = this._getSizeHint();
      var rootSizeHint = this.__rootSizeHint;
      
      if ((!rootSizeHint) || (sizeHint.width != rootSizeHint.width || sizeHint.height != rootSizeHint.height)) {
        this.__rootSizeHint = null;
        
        this.invalidateLayoutChildren();
        unify.ui.layout.queue.Layout.add(this);
      }
    },
    
    __onScroll : function(e) {
      var children = this.getChildren();
      
      var left = window.pageXOffset + "px";
      var top = window.pageYOffset + "px";
      
      for (var i=0,ii=children.length; i<ii; i++) {
        var child = children[i];
        
        var trigger = child.getTrigger && child.getTrigger();
        
        if (!trigger) {
          core.bom.Style.set(child.getElement(), {
            "transform" : "translate(" + left + "," + top + ")"
          });
        }
      }
      
      unify.ui.core.PopOverManager.getInstance().move(window.pageXOffset, window.pageYOffset);
    },
    
    /** {Map} Returns fixed size hint of base layer size */
    getSizeHint : function() {
      var rootSizeHint = this.__rootSizeHint;
      if (rootSizeHint) {
        return rootSizeHint;
      }
      
      rootSizeHint = this.__rootSizeHint = this._getSizeHint();
      return rootSizeHint;
    },
    
    /**
     * Returns size hint of root element, this is always dimension of root element (most of the time browser viewport)
     *
     * @return {Map} Calculated size of root element
     */
    _getSizeHint : function() {
      var myWidth = 0, myHeight = 0;
      if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
      }
      
      return {
        width: myWidth,
        height: myHeight
      };
    },
    
    /**
     * Render method to apply layout on widget's DOM element. This method applies
     * @left {Integer} and @top {Integer} position and @width {Integer} and 
     * @height {Integer} of element. Optional if @preventSize {Boolean?false} is
     * set to true the original DOM element size is not changed. This is only
     * useful if element is an root DOM element.
     */
    renderLayout : function(left, top, width, height, preventSize) {
      unify.ui.core.Widget.prototype.renderLayout.call(this, left, top, width, height, true);
    }
  }/*,
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  }*/
});