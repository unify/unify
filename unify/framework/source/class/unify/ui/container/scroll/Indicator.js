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
  implement : [unify.ui.container.scroll.IIndicator],

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
     EVENTS
  *****************************************************************************
  */
  
  events : {
    indicatorMoveStart : "qx.event.type.Data",
    indicatorMoveEnd : "qx.event.type.Data",
    indicatorMove : "qx.event.type.Data"
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
      nullable : true
    },

    /** Whether the indicator is visible */
    visible :
    {
      check : "Boolean",
      init : false,
      apply : "_applyVisible"
    },
    
    /** parent scroll container of this indicator */
    scroll:{
      check:"unify.ui.container.Scroll",
      init: null,
      apply: "_applyScroll"
    }
  },

  /**
   * @param orientation {String?null} Orientation of indicator
   * @param scroll {unify.ui.container.Scroll} parent scroll container of this indicator
   */
  construct : function(orientation,scroll) {
    this.__horizontal=(orientation=="horizontal");
    this.setOrientation(orientation);
    this.base(arguments);

    this.setStyle({
      opacity: 0,
      zIndex: 10,
      transitionProperty: "opacity",
      transitionDuration: "0.25s"
    });

    this.setScroll(scroll);
    scroll.addListener("resize",this.__onScrollerResize,this);
    scroll.getChildrenContainer().addListener("resize",this.__onScrollerContentResize,this);
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
    
    //render cache
    __distance: null,
    __endSize: null,
    __indicatorMargin: null,
    __maxScrollPosition: null,
    __clientSize: null,
    __indicatorSize: null,
  
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
      var startElem = this.__startElem = doc.createElement("div");
      var middleElem = this.__middleElem = doc.createElement("div");
      var endElem = this.__endElem = doc.createElement("div");
      elem.appendChild(startElem);
      elem.appendChild(middleElem);
      elem.appendChild(endElem);
      
      var self = unify.ui.container.scroll.Indicator;

      // set scrollbar styles
      var Style = qx.bom.element.Style;
      var bgstyle = 'rgba(0,0,0,0.5)';
      var radiussize = '2px';
      var endsize = self.ENDSIZE + 'px';
      var thickness = self.THICKNESS + 'px';
      
      // general styles
      Style.setStyles(startElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute'
      });
      Style.setStyles(middleElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute',
        transformOrigin: 'left top'
      });
      Style.setStyles(endElem, {
        background: bgstyle,
        top: '0px',
        left: '0px',
        width: thickness,
        height: thickness,
        position: 'absolute'
      });
      
      if (this.__horizontal === true) 
      {
        // vertical scrollbar
        Style.setStyles(startElem, {
          borderTopLeftRadius: radiussize,
          borderBottomLeftRadius: radiussize,
          width: endsize
        });
        Style.setStyles(middleElem, {
          width: '1px',
          left: '3px'
        });
        Style.setStyles(endElem, {
          borderTopRightRadius: radiussize,
          borderBottomRightRadius: radiussize,
          width: endsize
        });
      } 
      else 
      {
        // vertical scrollbar
        Style.setStyles(startElem, {
          borderTopLeftRadius: radiussize,
          borderTopRightRadius: radiussize,
          height: endsize
        });
        Style.setStyles(middleElem, {
          height: '1px',
          top: '3px'
        });
        Style.setStyles(endElem, {
          borderBottomLeftRadius: radiussize,
          borderBottomRightRadius: radiussize,
          height: endsize
        });
      }

      // Listener for animation purposes
      qx.event.Registration.addListener(elem, "transitionEnd", this.__onTransitionEnd, this, false);

      return elem;
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
     * @param scrollPosition {Integer} current scrollPosition of the parent
     */
    render : function(scrollPosition) {

      var endSize=this.__endSize;
      var distance=this.__distance;
      var margin = this.__indicatorMargin;
      var maxPosition=this.__maxScrollPosition;
      var clientSize=this.__clientSize;
      var size=this.__indicatorSize;
      var position;
      //bounce up/left
      if (scrollPosition < 0)
      {
        size = Math.max(Math.round(size + scrollPosition), endSize*2);
        position=distance;
      }

      //bounce down/right
      else if (scrollPosition > maxPosition)
      {
        size = Math.max(Math.round(size + maxPosition - scrollPosition), endSize*2);
        position = clientSize - margin - size;
      }

      // In range
      else
      {
        var percent = scrollPosition / maxPosition;
        var avail = clientSize - margin - size;

        position = Math.round(percent * avail);
      }

      var Style = qx.bom.element.Style;

      if (this.__position !== position)
      {
        // Update internal fields
        this.__position = position;

        // Omit update when invisible or fading out
        // We move the scrollbar out of view as soon as it is not visible anymore
        if (this.__isVisible)
        {
          var translate = this.__horizontal ? unify.bom.Transform.accelTranslate(position+"px",0) : unify.bom.Transform.accelTranslate(0,position+"px");
          Style.set(this.getElement(), "transform", translate);
        }
      }

      if (this.__size !== size)
      {
        // Update internal field
        this.__size = size;

        // Compute sizes based on CSS stored size of end pieces
        var scaleX=1, scaleY=1, endPosX=0, endPosY=0;
        
        if (this.__horizontal)
        {
          scaleX = size - (endSize * 2);
          endPosX = size - endSize;
        }
        else
        {
          scaleY = size - (endSize * 2);
          endPosY = size - endSize;
        }

        // Apply transforms for best-in-class performance
        Style.set(this.__middleElem, "transform", unify.bom.Transform.accelScale(scaleX,scaleY));//"scale3d(" + scaleX + "," + scaleY + ",1)");
        Style.set(this.__endElem, "transform", unify.bom.Transform.accelTranslate(endPosX + "px", endPosY + "px"));
      }
    },

    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */


    // property apply
    _applyVisible : function(value) {
      // Additional storage, higher memory but reduced number of function calls in render()
      this.__isVisible = value;

      if (value)
      {
        // Recover old position
        var translate = this.__horizontal ? unify.bom.Transform.accelTranslate(this.__position + "px", 0) : unify.bom.Transform.accelTranslate(0, this.__position + "px");
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
        //TODO why is this needed (in applyvisible the position gets restored anyways)
        qx.bom.element.Style.set(this.getElement(), "transform", null);
        this.__isFadingOut = false;
      }
    },


    /**
     * executes on update of scroll property
     * @param scroll
     */
    _applyScroll: function(scroll){
      this.initRenderingCache(scroll);
    },

    /**
     *  event handler for resize of the scroll client element.
     *  
     *  updates the rendering cache
     */
    __onScrollerResize: function(){
      this.initRenderingCache(this.getScroll());
    },

    /**
     *  event handler for resize of the scroll content element
     *  
     *  updates the rendering cache
     */
    __onScrollerContentResize: function(){
      this.initRenderingCache(this.getScroll());
    },

    /**
     * initializes the rendering cache of this indicator based on the dimensions of scroll
     * @param scroll {unify.ui.container.Scroll} the parent scroll indicator
     */
    initRenderingCache : function(scroll){
      var scrollerDimension = scroll.getBounds();
      var contentDimension = scroll.getChildrenContainer().getBounds();

      if (scrollerDimension && contentDimension && scrollerDimension.width>0 && scrollerDimension.height>0) {
        var scrollerWidth = scrollerDimension.width;
        var scrollerHeight = scrollerDimension.height;
        var contentWidth = contentDimension.width;
        var contentHeight = contentDimension.height;
        
        var ScrollIndicator = this.self(arguments);

        // Sum of margins substracted from the client size for computing the indicator size
        var margin = ScrollIndicator.DISTANCE * 2;
        if (scroll.getTwoAxisScroll()) {
          margin += ScrollIndicator.THICKNESS + ScrollIndicator.DISTANCE;
        }
        this.__indicatorMargin = margin;
        this.__endSize=ScrollIndicator.ENDSIZE;
        this.__distance=ScrollIndicator.DISTANCE;
        if(this.__horizontal){
          this.__clientSize=scrollerWidth;
          this.__maxScrollPosition=Math.max(0,contentWidth-scrollerWidth);
          this.__indicatorSize=(scrollerWidth>0 && contentWidth>0)?(Math.round((scrollerWidth/contentWidth)*(scrollerWidth-margin))):0;
        } else {
          this.__clientSize=scrollerHeight;
          this.__maxScrollPosition=Math.max(0,contentHeight-scrollerHeight);
          this.__indicatorSize=(scrollerHeight>0 && contentHeight>0)?(Math.round((scrollerHeight/contentHeight)*(scrollerHeight-margin))):0;
        }
      }

    }
  }
});
