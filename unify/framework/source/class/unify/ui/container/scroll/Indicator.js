/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.container.scroll.Indicator", {
  extend : unify.ui.container.Composite,

  /*
  *****************************************************************************
     STATICs
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Size of the scroll indicator */
    THICKNESS : 5,

    /** {Integer} Size of the end pieces */
    ENDSIZE : 3,

    /** {Integer} Distance from edges */
    DISTANCE : 2
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Orientation of the scroll indicator */
    orientation :
    {
      check : ["horizontal", "vertical"],
      nullable : true,
      apply : "_applyOrientation"
    },

    /** Whether the indicator is visible */
    visible :
    {
      check : "Boolean",
      init : false,
      apply : "_applyVisible"
    }
  },

  /**
   * @param orientation {String?null} Orientation of indicator
   */
  construct : function(orientation) {
    this.base(arguments);

    this.setOrientation(orientation);

    this.setStyle({
      opacity: 0,
      zIndex: 10,
      transitionProperty: "opacity",
      transitionDuration: "0.25s"
    });
  },

  members : {
    __isFadingOut : false,
    __position : null,
    __isVisible : false,
    __horizontal : null,
    __size : null,
    __endElem : null,
    __middleElem : null,
    __startElem : null,
  
    /*
    ---------------------------------------------------------------------------
      INTERFACE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {
      var doc = document;
      var elem = doc.createElement("div");
      //elem.className = "scroll-indicator " + this.getOrientation();

      // Build sub elements
      this.__startElem = elem.appendChild(doc.createElement("div"));
      this.__middleElem = elem.appendChild(doc.createElement("div"));
      this.__endElem = elem.appendChild(doc.createElement("div"));

      this.__setSliderStyle(this.getOrientation() === "horizontal");

      // Listener for animation purposes
      qx.event.Registration.addListener(elem, "transitionEnd", this.__onTransitionEnd, this, false);

      return elem;
    },

    /**
     * Set style on slider
     *
     * @param horizontal {Boolean} Set horizontal styling
     */
    __setSliderStyle : function(horizontal) {
      var self = unify.ui.container.scroll.Indicator;

      // set scrollbar styles
      var Style = qx.bom.element.Style;
      var bgstyle = 'rgba(0,0,0,0.5)';
      var radiussize = '2px';
      var endsize = self.ENDSIZE + 'px';
      var thickness = self.THICKNESS + 'px';
      
      // general styles
      Style.setStyles(this.__startElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute'
      });
      Style.setStyles(this.__middleElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute',
        transformOrigin: 'left top'
      });
      Style.setStyles(this.__endElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute'
      });
      
      if (horizontal === true) 
      {
        // vertical scrollbar
        Style.setStyles(this.__startElem, {
          borderTopLeftRadius: radiussize,
          borderBottomLeftRadius: radiussize,
          width: endsize
        });
        Style.setStyles(this.__middleElem, {
          width: '1px',
          left: '3px'
        });
        Style.setStyles(this.__endElem, {
          borderTopRightRadius: radiussize,
          borderBottomRightRadius: radiussize,
          width: endsize
        });
      } 
      else 
      {
        // vertical scrollbar
        Style.setStyles(this.__startElem, {
          borderTopLeftRadius: radiussize,
          borderTopRightRadius: radiussize,
          height: endsize
        });
        Style.setStyles(this.__middleElem, {
          height: '1px',
          top: '3px'
        });
        Style.setStyles(this.__endElem, {
          borderBottomLeftRadius: radiussize,
          borderBottomRightRadius: radiussize,
          height: endsize
        });
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    /**
     * Move scroll indicator to given position and updates the size
     *
     * Optimized for performance. This is also basically the reason why these
     * things are NOT stored in properties. This method may be called hundreds of times
     * a second!
     *
     * @param position {Integer} Position of indicator
     * @param size {Integer} Size of indicator
     */
    render : function(position, size) {
      var Style = qx.bom.element.Style;

      if (this.__position !== position)
      {
        // Update internal fields
        this.__position = position;

        // Omit update when invisible or fading out
        // We move the scrollbar out of view as soon as it is not visible anymore
        if (this.__isVisible)
        {
          var translate = this.__horizontal ? "translate3d(" + position + "px,0,0)" : "translate3d(0," + position + "px,0)";
          Style.set(this.getElement(), "transform", translate);
        }
      }

      if (this.__size !== size)
      {
        // Update internal field
        this.__size = size;

        // Compute sizes based on CSS stored size of end pieces
        var scaleX=1, scaleY=1, endPosX=0, endPosY=0;
        var endpieces = unify.ui.container.scroll.Indicator.ENDSIZE;
        if (this.__horizontal)
        {
          scaleX = size - (endpieces * 2);
          endPosX = size - endpieces;
        }
        else
        {
          scaleY = size - (endpieces * 2);
          endPosY = size - endpieces;
        }

        // Apply transforms for best-in-class performance
        Style.set(this.__middleElem, "transform", "translate3d(0,0,0) scale(" + scaleX + "," + scaleY + ")");
        Style.set(this.__endElem, "transform", "translate3d(" + endPosX + "px," + endPosY + "px,0)");
      }
    },

    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyOrientation : function(value) {
      // Additional storage, higher memory but reduced number of function calls in render()
      var horizontal = this.__horizontal = value === "horizontal";

      if (this._hasElement()) {
        this.__setSliderStyle(horizontal);
      }
    },

    // property apply
    _applyVisible : function(value) {
      // Additional storage, higher memory but reduced number of function calls in render()
      this.__isVisible = value;

      if (value)
      {
        // Recover old position
        var translate = this.__horizontal ? "translate3d(" + this.__position + "px,0,0)" : "translate3d(0," + this.__position + "px,0)";
        qx.bom.element.Style.set(this.getElement(), "transform", translate);

        // Fade in
        this.__isFadingOut = false;
        this._setStyle({
          opacity: 1
        });
      }
      else if (!this.__isFadingOut)
      {
        // Fade out
        this.__isFadingOut = true;
        this._setStyle({
          opacity: 0
        });
      }
    },

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for transition event
     *
     * @param ev {Event} Transition event object
     */
    __onTransitionEnd : function(ev)
    {
      if (this.__isFadingOut)
      {
        qx.bom.element.Style.set(this.getElement(), "transform", null);
        this.__isFadingOut = false;
      }
    }
  },

  destruct : function() {
    this.removeListener("changeVisibility", this._applyVisible, this);
  }
});
