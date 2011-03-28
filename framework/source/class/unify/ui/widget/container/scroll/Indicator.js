qx.Class.define("unify.ui.widget.container.scroll.Indicator", {
  extend : unify.ui.widget.container.Composite,

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

  construct : function(orientation) {
    this.base(arguments);

    this.setOrientation(orientation);

    this.setStyle({
      opacity: 0,
      zIndex: 10,
      WebkitTransitionProperty: "opacity",
      WebkitTransitionDuration: "0.25s"
    });
  },

  members : {
  
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
      var startElem = this.__startElem = elem.appendChild(doc.createElement("div"));
      var middleElem = this.__middleElem = elem.appendChild(doc.createElement("div"));
      var endElem = this.__endElem = elem.appendChild(doc.createElement("div"));

      this.__setSliderStyle(this.getOrientation() == "horizontal");

      // Listener for animation purposes
      qx.event.Registration.addListener(elem, "transitionEnd", this.__onTransitionEnd, this, false);

      return elem;
    },

    __setSliderStyle : function(horizontal) {
      var self = unify.ui.widget.container.scroll.Indicator;

      var endsize = self.ENDSIZE + "px";
      var thickness = self.THICKNESS + "px";

      var Style = qx.bom.element2.Style;
      Style.set(this.__startElem, {
        background: "rgba(0,0,0,0.5)",
        borderTopLeftRadius: "2px",
        borderTopRightRadius: "2px",
        width: horizontal?endsize:thickness,
        height: horizontal?thickness:endsize,
        top: "0px",
        left: "0px",
        position: "absolute"
      });
      Style.set(this.__middleElem, {
        background: "rgba(0,0,0,0.5)",
        width: horizontal?"1px":thickness,
        height: horizontal?thickness:"1px",
        top: "3px",
        left: "0px",
        position: "absolute",
        WebkitTransformOrigin: "left top"
      });
      Style.set(this.__endElem, {
        background: "rgba(0,0,0,0.5)",
        borderBottomLeftRadius: "2px",
        borderBottomRightRadius: "2px",
        width: horizontal?endsize:thickness,
        height: horizontal?thickness:endsize,
        top: "0px",
        left: "0px",
        position: "absolute"
      });
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
      var Style = qx.bom.element2.Style;

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
        var endpieces = unify.ui.widget.container.scroll.Indicator.ENDSIZE;
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
      var Style = qx.bom.element2.Style;
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
        qx.bom.element2.Style.set(this.getElement(), "transform", translate);

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
        qx.bom.element2.Style.set(this.getElement(), "transform", null);
        this.__isFadingOut = false;
      }
    }
  },

  destruct : function() {
    this.removeListener("changeVisibility", this._applyVisible, this);
  }
});
