/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * port of unify.ui.container.Scroll using Zynga Scroller for rendering
 */
/*
#ignore(zynga)
#ignore(zynga.Animate)
#ignore(requestAnimationFrame)
#ignore(Scroller)
 */
qx.Class.define("unify.ui.container.ZyngaScroll", {
  extend : unify.ui.core.Widget,

  include : [unify.ui.core.MRemoteChildrenHandling],

  construct : function(layout) {
    this.__childLayout = layout || new qx.ui.layout.Basic(); // TODO: Switch over to ChildrenHandlingLayout
    this.base(arguments);
    this._setLayout(new qx.ui.layout.Canvas());

    var contentWidget = this.__contentWidget; // = new unify.ui.container.Composite(childLayout);

    this._add(contentWidget, {
      left :0,
      top: 0,
      right: 0,
      bottom: 0
    });

    var scrollIndicatorX = this.__horizontalScrollIndicator = new unify.ui.container.scroll.Indicator("horizontal");
    var scrollIndicatorY = this.__verticalScrollIndicator = new unify.ui.container.scroll.Indicator("vertical");

    var distance = unify.ui.container.scroll.Indicator.DISTANCE;

    scrollIndicatorX.setHeight(3);
    this._add(scrollIndicatorX, {
      left: 0,
      right: 0,
      bottom: distance
    });
    scrollIndicatorY.setWidth(3);
    this._add(scrollIndicatorY, {
      top: 0,
      right: distance,
      bottom: 0
    });

    this._setStyle({
      overflow: "hidden"
    });

    var client=this.getElement();
    var content=this.__contentWidget.getElement();
    var contentWidget=this.__contentWidget;
    contentWidget.setStyle({
      transitionDuration: "0s"
    });

    var self=this;
    var render = function(left, top, zoom) {
      contentWidget.setStyle({transform:'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')'});
      self.__scrollLeft=left;
      self.__scrollTop=top;
      self.__renderIndicators(left,top,zoom);
    };

    this.__scroller=new Scroller(render,{zooming:false});//TODO implement bouncing,paging and scrollX/Y limit support
    this.__updateDimensions();

    var Registration = qx.event.Registration;
    var root =document.documentElement;
    Registration.addListener(client,'touchstart',this.__onTouchStart,this);
    Registration.addListener(root,"touchmove",this.__onTouchMove,this);
    Registration.addListener(root,"touchend", this.__onTouchEnd,this);
    Registration.addListener(root,"touchcancel", this.__onTouchEnd,this);
    Registration.addListener(this,"resize",this.__updateDimensions,this);
    Registration.addListener(contentWidget,'resize',this.__updateDimensions,this);
    //TODO find out why transitionEnd is not received here
    Registration.addListener(content,"transitionEnd",this.__onTransitionEnd,this);
  },

  /*
   *****************************************************************************
   PROPERTIES
   *****************************************************************************
   */

  properties :
  {


    /** Whether the scroll view bounces past the edge of content and back again. */
    bounces :
    {
      init : true,
      check : "Boolean"
    },

    /**
     * Whether the content should be splitted into "pages" and the position
     * is always snapped into a specific page
     */
    paging :
    {
      init : false,
      check : "Boolean"
    },

    /** Whether horizontal scrolling should be enabled */
    enableScrollX :
    {
      init : true,
      check : "Boolean",
      apply : "_applyScrollMode"
    },

    /** Whether vertical scrolling should be enabled */
    enableScrollY :
    {
      init : true,
      check : "Boolean",
      apply : "_applyScrollMode"
    },

    /** Whether the horizontal scroll indicator should be displayed */
    showIndicatorX :
    {
      init : true,
      check : "Boolean",
      apply : "_applyScrollMode"
    },

    /** Whether the vertical scroll indicator should be displayed */
    showIndicatorY :
    {
      init : true,
      check : "Boolean",
      apply : "_applyScrollMode"
    },

    // overridden
    appearance :
    {
      refine: true,
      init: "scroll"
    }
  },

  /*
   *****************************************************************************
   EVENTS
   *****************************************************************************
   */

  events :
  {
    scroll: "qx.event.type.Event",
    snap: "qx.event.type.Event"
  },

  /*
   *****************************************************************************
   MEMBERS
   *****************************************************************************
   */

  members: {
    __scroller : null,
    __verticalScrollIndicator : null,
    __horizontalScrollIndicator : null,

    /*
     ---------------------------------------------------------------------------
     INTERNAL FIELDS :: DIMENSIONS
     ---------------------------------------------------------------------------
     */

    /** {Integer} Available width for content of control */
    __clientWidth : 0,

    /** {Integer} Available height for content of control */
    __clientHeight : 0,

    /** {Integer} Rendered outer width of content */
    __contentWidth : 0,

    /** {Integer} Rendered outer height of content */
    __contentHeight : 0,

    /** {Integer} Current scroll position on x-axis */
    __scrollLeft : 0,

    /** {Integer} Current scroll position on y-axis */
    __scrollTop : 0,

    /** {Integer} Minimum allowed scroll position on x-axis */
    __minScrollLeft : 0,

    /** {Integer} Minimum allowed scroll position on y-axis */
    __minScrollTop : 0,

    /*
     ---------------------------------------------------------------------------
     INTERNAL FIELDS :: PERFORMANCE SHORTHANDS
     ---------------------------------------------------------------------------
     */

    /** {Boolean} Whether there is a listener for scroll events */
    __hasScrollListener : false,

    /** {Boolean} Whether there is a listener for snap events */
    __hasSnapListener : false,

    /** {Boolean} Whether both scroll indicators are enabled */
    __twoAxisScroll : true,

    __contentWidget : null,

    getChildrenContainer : function() {
      return this.__contentWidget;
    },

    _createElement : function() {
      // Create root element
      var elem = document.createElement("div");

      var contentWidget = this.__contentWidget = new unify.ui.container.Composite();
      contentWidget.setLayout(this.__childLayout);

      return elem;
    },

    _computeSizeHint : function() {
      // Build size hint and return
      return {
        width : this.getWidth() || 10,
        minWidth : this.getMinWidth() || 10,
        maxWidth : this.getMaxWidth() || Infinity,
        height : this.getHeight() || 10,
        minHeight : this.getMinHeight() || 10,
        maxHeight : this.getMaxHeight() || Infinity
      };
    },

    /*
     ---------------------------------------------------------------------------
     PROPERTY APPLY ROUTINES
     ---------------------------------------------------------------------------
     */

    // property apply
    _applyScrollMode : function()
    {
      this.__twoAxisScroll = this.getEnableScrollX() && this.getEnableScrollY() && this.getShowIndicatorX() && this.getShowIndicatorY();
    },


    /*
     ---------------------------------------------------------------------------
     SCROLL INDICATORS
     ---------------------------------------------------------------------------
     */

    /**
     * Updates the given scroll indicator based on the given data
     *
     * @param indicator {ScrollIndicator} Instance of the scroll indicator to modify
     * @param clientSize {Integer} Size of the available space
     * @param contentSize {Integer} Size of the content
     * @param scrollPosition {Integer} Current scroll position on this axis
     */
    __updateScrollIndicator : function(indicator, clientSize, contentSize, scrollPosition)
    {
      // On initialization (these value are set-up on first touch)
      if (clientSize == 0) {
        return;
      }

      var ScrollIndicator = unify.ui.container.scroll.Indicator;

      // Sum of margins substracted from the client size for computing the indicator size
      var margin = ScrollIndicator.DISTANCE * 2;
      if (this.__twoAxisScroll) {
        margin += ScrollIndicator.THICKNESS + ScrollIndicator.DISTANCE;
      }

      // Map size of indicator to size of content
      var size = Math.max(5, Math.round((clientSize / contentSize) * (clientSize - margin)));
      var position = 0;

      // Begin out
      if (scrollPosition > 0)
      {
        size = Math.round(Math.max(size - scrollPosition, ScrollIndicator.ENDSIZE*2));
      }

      // End out
      else if (scrollPosition < -(contentSize - clientSize))
      {
        size = Math.round(Math.max(size + contentSize - clientSize + scrollPosition, ScrollIndicator.ENDSIZE*2));
        position = clientSize - margin - size;
      }

      // In range with possibility to scroll
      else if (contentSize !== clientSize)
      {
        var percent = -scrollPosition / (contentSize - clientSize);
        var avail = clientSize - margin - size;

        position = Math.round(percent * avail);
      }

      // Render
      indicator.render(ScrollIndicator.DISTANCE + position, size);
    },

    __updateDimensions : function(){
      var elem=this.getElement();
      var contentElem=this.__contentWidget.getElement();
      var rect = elem.getBoundingClientRect();
      this.__scroller.setPosition(rect.left + elem.clientLeft, rect.top + elem.clientTop);
      this.__scroller.setDimensions(elem.clientWidth,elem.clientHeight,contentElem.clientWidth,contentElem.clientHeight);

      this.__clientWidth = elem.clientWidth;
      this.__clientHeight = elem.clientHeight;
      this.__contentWidth = contentElem.clientWidth;
      this.__contentHeight = contentElem.clientHeight;
    },

    __renderIndicators : function(left,top,zoom){
      // Display scroll indicators as soon as we touch and the content is bigger than the container
      if (this.__enableScrollX && this.__showIndicatorX) {
        this.__updateScrollIndicator(this.__horizontalScrollIndicator, this.__clientWidth, this.__contentWidth, this.__scrollLeft);
      }

      if (this.__enableScrollY && this.__showIndicatorY) {
        this.__updateScrollIndicator(this.__verticalScrollIndicator, this.__clientHeight, this.__contentHeight, this.__scrollTop);
      }

    },


    /**
     * Snaps into bounds after recalculating client width and height
     * Usable for resize of window while paging
     */
    reflow : function()
    {
      //TODO find out what needs to be done besides updating the scroller
      var elem = this.getElement();
      var contentElem = this.__contentWidget.getElement();
      this.__clientWidth = elem.clientWidth;
      this.__clientHeight = elem.clientHeight;
      this.__contentWidth = Math.max(this.__clientWidth, contentElem.offsetWidth); // TODO  remove getElement()
      this.__contentHeight = Math.max(this.__clientHeight, contentElem.offsetHeight); // TODO  remove getElement()
      this.__minScrollLeft = this.__clientWidth - this.__contentWidth;
      this.__minScrollTop = this.__clientHeight - this.__contentHeight;
      /*
       if(this.__isDecelerating){
       this.__isDecelerating=false;//stop it
       // Directly hide scroll indicators
       this.__horizontalScrollIndicator.setVisible(false);
       this.__verticalScrollIndicator.setVisible(false);
       }

       this.__snapIntoBounds(false);
       */

      this.__updateDimensions();
    },


    /**
     * Returns the horizontal scroll position
     *
     * @return {Integer} Horizontal scroll position
     */
    getScrollLeft : function() {
      return this.__scrollLeft;
    },


    /**
     * Returns the vertical scroll position
     *
     * @return {Integer} Vertical scroll position
     */
    getScrollTop : function() {
      return this.__scrollTop;
    },


    /**
     * Scrolls to the given position
     *
     * @param left {Integer?null} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Integer?null} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean?false} Whether the scrolling should happen using an animation
     */
    scrollTo : function(left, top, animate)
    {
      if (left == null) {
        left = this.__scrollLeft;
      }

      if (top == null) {
        top = this.__scrollTop;
      }

      this.__scrollTo(left, top, animate);
    },

    __scrollTo : function(left,top,animate,zoom){
      this.__scroller.scrollTo(left,top,animate,zoom);
      if(!animate){
        this.__scrollTop=top;
        this.__scrollLeft=left;
      }
    },

    /**
     * Returns the cached client width
     *
     * @return {Integer} cached client width
     */
    _getClientWidth : function() {
      return this.__clientWidth;
    },

    /**
     * Returns the cached client height
     *
     * @return {Integer} cached client height
     */
    _getClientHeight : function() {
      return this.__clientHeight;
    },

    /**
     * Returns the cached content width
     *
     * @return {Integer} cached content width
     */
    _getContentWidth : function() {
      return this.__contentWidth;
    },

    /**
     * Returns the cached content height
     *
     * @return {Integer} cached content height
     */
    _getContentHeight : function() {
      return this.__contentHeight;
    },

    __onTouchStart : function(e){
      //cache values
      this.__enableScrollX = this.getEnableScrollX();
      this.__enableScrollY = this.getEnableScrollY();
      this.__showIndicatorX = this.getShowIndicatorX();
      this.__showIndicatorY = this.getShowIndicatorY();
      // Don't react if initial down happens on a form element
      var touches=e.getNativeEvent().touches;
      if (touches[0] && touches[0].target && touches[0].target.tagName.match(/input|textarea|select/i)) {
        return;
      }

      this.__scroller.doTouchStart(touches, e.getNativeEvent().timeStamp);
      e.preventDefault();
      if (this.__enableScrollX && this.__showIndicatorX) {
        this.__horizontalScrollIndicator.setVisible(true);
      }

      if (this.__enableScrollY && this.__showIndicatorY) {
        this.__verticalScrollIndicator.setVisible(true);
      }

    },
    __onTouchMove : function(e){
      var n=e.getNativeEvent();
      this.__scroller.doTouchMove(n.touches, n.timeStamp, n.scale);
    },
    __onTouchEnd : function(e){
      this.__scroller.doTouchEnd(e.getNativeEvent().timeStamp);
      //TODO remove hide indicator code when listening for transitionEnd works
      this.__verticalScrollIndicator.setVisible(false);
      this.__horizontalScrollIndicator.setVisible(false);
    },
    __onTransitionEnd : function(e){
      this.__horizontalScrollIndicator.setVisible(false);
      this.__verticalScrollIndicator.setVisible(false);
    }
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BELOW BE DRAGONS                                                                                                                         proceed with caution...  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------
Zynga Scroller files, copied into this source file to ease handling with qooxdoo build system
 --------*/
/*src/Scroller.js */
/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */
var Scroller;
(function() {

	/**
	 * A pure logic 'component' for 'virtual' scrolling/zooming.
	 */
	Scroller = function(callback, options) {

		this.__callback = callback;

		this.options = {

			/** Enable scrolling on x-axis */
			scrollingX: true,

			/** Enable scrolling on y-axis */
			scrollingY: true,

			/** Enable animations for deceleration, snap back, zooming and scrolling */
			animating: true,

			/** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
			bouncing: true,

			/** Enable locking to the main axis if user moves only slightly on one of them at start */
			locking: true,

			/** Enable pagination mode (switching between full page content panes) */
			paging: false,

			/** Enable snapping of content to a configured pixel grid */
			snapping: false,

			/** Enable zooming of content via API, fingers and mouse wheel */
			zooming: false,

			/** Minimum zoom level */
			minZoom: 0.5,

			/** Maximum zoom level */
			maxZoom: 3

		};

		for (var key in options) {
			this.options[key] = options[key];
		}

	};


	// Easing Equations (c) 2003 Robert Penner, all rights reserved.
	// Open source under the BSD License.

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeOutCubic = function(pos) {
		return (Math.pow((pos - 1), 3) + 1);
	};

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeInOutCubic = function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}

		return 0.5 * (Math.pow((pos - 2), 3) + 2);
	};


	var members = {

		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: STATUS
		---------------------------------------------------------------------------
		*/

		/** {Boolean} Whether only a single finger is used in touch handling */
		__isSingleTouch: false,

		/** {Boolean} Whether a touch event sequence is in progress */
		__isTracking: false,

		/**
		 * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
		 * a gesturestart event happens. This has higher priority than dragging.
		 */
		__isGesturing: false,

		/**
		 * {Boolean} Whether the user has moved by such a distance that we have enabled
		 * dragging mode. Hint: It's only enabled after some pixels of movement to
		 * not interrupt with clicks etc.
		 */
		__isDragging: false,

		/**
		 * {Boolean} Not touching and dragging anymore, and smoothly animating the
		 * touch sequence using deceleration.
		 */
		__isDecelerating: false,

		/**
		 * {Boolean} Smoothly animating the currently configured change
		 */
		__isAnimating: false,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: DIMENSIONS
		---------------------------------------------------------------------------
		*/

		/** {Integer} Available outer left position (from document perspective) */
		__clientLeft: 0,

		/** {Integer} Available outer top position (from document perspective) */
		__clientTop: 0,

		/** {Integer} Available outer width */
		__clientWidth: 0,

		/** {Integer} Available outer height */
		__clientHeight: 0,

		/** {Integer} Outer width of content */
		__contentWidth: 0,

		/** {Integer} Outer height of content */
		__contentHeight: 0,

		/** {Integer} Snapping width for content */
		__snapWidth: 100,

		/** {Integer} Snapping height for content */
		__snapHeight: 100,

		/** {Number} Zoom level */
		__zoomLevel: 1,

		/** {Number} Scroll position on x-axis */
		__scrollLeft: 0,

		/** {Number} Scroll position on y-axis */
		__scrollTop: 0,

		/** {Integer} Maximum allowed scroll position on x-axis */
		__maxScrollLeft: 0,

		/** {Integer} Maximum allowed scroll position on y-axis */
		__maxScrollTop: 0,

		/* {Number} Scheduled left position (final position when animating) */
		__scheduledLeft: 0,

		/* {Number} Scheduled top position (final position when animating) */
		__scheduledTop: 0,

		/* {Number} Scheduled zoom level (final scale when animating) */
		__scheduledZoom: 0,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: LAST POSITIONS
		---------------------------------------------------------------------------
		*/

		/** {Number} Left position of finger at start */
		__lastTouchLeft: null,

		/** {Number} Top position of finger at start */
		__lastTouchTop: null,

		/** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
		__lastTouchMove: null,

		/** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
		__positions: null,



		/*
		---------------------------------------------------------------------------
			INTERNAL FIELDS :: DECELERATION SUPPORT
		---------------------------------------------------------------------------
		*/

		/** {Integer} Minimum left scroll position during deceleration */
		__minDecelerationScrollLeft: null,

		/** {Integer} Minimum top scroll position during deceleration */
		__minDecelerationScrollTop: null,

		/** {Integer} Maximum left scroll position during deceleration */
		__maxDecelerationScrollLeft: null,

		/** {Integer} Maximum top scroll position during deceleration */
		__maxDecelerationScrollTop: null,

		/** {Number} Current factor to modify horizontal scroll position with on every step */
		__decelerationVelocityX: null,

		/** {Number} Current factor to modify vertical scroll position with on every step */
		__decelerationVelocityY: null,



		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/

		/**
		 * Configures the dimensions of the client (outer) and content (inner) elements.
		 * Requires the available space for the outer element and the outer size of the inner element.
		 * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
		 *
		 * @param clientWidth {Integer ? null} Inner width of outer element
		 * @param clientHeight {Integer ? null} Inner height of outer element
		 * @param contentWidth {Integer ? null} Outer width of inner element
		 * @param contentHeight {Integer ? null} Outer height of inner element
		 */
		setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {

			var self = this;

			// Only update values which are defined
			if (clientWidth) {
				self.__clientWidth = clientWidth;
			}

			if (clientHeight) {
				self.__clientHeight = clientHeight;
			}

			if (contentWidth) {
				self.__contentWidth = contentWidth;
			}

			if (contentHeight) {
				self.__contentHeight = contentHeight;
			}

			// Refresh maximums
			self.__computeScrollMax();

			// Refresh scroll position
			self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

		},


		/**
		 * Sets the client coordinates in relation to the document.
		 *
		 * @param left {Integer ? 0} Left position of outer element
		 * @param top {Integer ? 0} Top position of outer element
		 */
		setPosition: function(left, top) {

			var self = this;

			self.__clientLeft = left || 0;
			self.__clientTop = top || 0;

		},


		/**
		 * Configures the snapping (when snapping is active)
		 *
		 * @param width {Integer} Snapping width
		 * @param height {Integer} Snapping height
		 */
		setSnapSize: function(width, height) {

			var self = this;

			self.__snapWidth = width;
			self.__snapHeight = height;

		},


		/**
		 * Returns the scroll position and zooming values
		 *
		 * @return {Map} `left` and `top` scroll position and `zoom` level
		 */
		getValues: function() {

			var self = this;

			return {
				left: self.__scrollLeft,
				top: self.__scrollTop,
				zoom: self.__zoomLevel
			};

		},


		/**
		 * Returns the maximum scroll values
		 *
		 * @return {Map} `left` and `top` maximum scroll values
		 */
		getScrollMax: function() {

			var self = this;

			return {
				left: self.__maxScrollLeft,
				top: self.__maxScrollTop
			};

		},


		/**
		 * Zooms to the given level. Supports optional animation. Zooms
		 * the center when no coordinates are given.
		 *
		 * @param level {Number} Level to zoom to
		 * @param animate {Boolean ? false} Whether to use animation
		 * @param originLeft {Number ? null} Zoom in at given left coordinate
		 * @param originTop {Number ? null} Zoom in at given top coordinate
		 */
		zoomTo: function(level, animate, originLeft, originTop) {

			var self = this;

			if (!self.options.zooming) {
				throw new Error("Zooming is not enabled!");
			}

			// Stop deceleration
			if (self.__isDecelerating) {
				zynga.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			var oldLevel = self.__zoomLevel;

			// Normalize input origin to center of viewport if not defined
			if (originLeft == null) {
				originLeft = self.__clientWidth / 2;
			}

			if (originTop == null) {
				originTop = self.__clientHeight / 2;
			}

			// Limit level according to configuration
			level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

			// Recompute maximum values while temporary tweaking maximum scroll ranges
			self.__computeScrollMax(level);

			// Recompute left and top coordinates based on new zoom level
			var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
			var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;

			// Limit x-axis
			if (left > self.__maxScrollLeft) {
				left = self.__maxScrollLeft;
			} else if (left < 0) {
				left = 0;
			}

			// Limit y-axis
			if (top > self.__maxScrollTop) {
				top = self.__maxScrollTop;
			} else if (top < 0) {
				top = 0;
			}

			// Push values out
			self.__publish(left, top, level, animate);

		},


		/**
		 * Zooms the content by the given factor.
		 *
		 * @param factor {Number} Zoom by given factor
		 * @param animate {Boolean ? false} Whether to use animation
		 * @param originLeft {Number ? 0} Zoom in at given left coordinate
		 * @param originTop {Number ? 0} Zoom in at given top coordinate
		 */
		zoomBy: function(factor, animate, originLeft, originTop) {

			var self = this;

			self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);

		},


		/**
		 * Scrolls to the given position. Respect limitations and snapping automatically.
		 *
		 * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
		 * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
		 * @param animate {Boolean?false} Whether the scrolling should happen using an animation
		 * @param zoom {Number?null} Zoom level to go to
		 */
		scrollTo: function(left, top, animate, zoom) {

			var self = this;

			// Stop deceleration
			if (self.__isDecelerating) {
				zynga.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Correct coordinates based on new zoom level
			if (zoom != null && zoom !== self.__zoomLevel) {

				if (!self.options.zooming) {
					throw new Error("Zooming is not enabled!");
				}

				left *= zoom;
				top *= zoom;

				// Recompute maximum values while temporary tweaking maximum scroll ranges
				self.__computeScrollMax(zoom);

			} else {

				// Keep zoom when not defined
				zoom = self.__zoomLevel;

			}

			if (!self.options.scrollingX) {

				left = self.__scrollLeft;

			} else {

				if (self.options.paging) {
					left = Math.round(left / self.__clientWidth) * self.__clientWidth;
				} else if (self.options.snapping) {
					left = Math.round(left / self.__snapWidth) * self.__snapWidth;
				}

			}

			if (!self.options.scrollingY) {

				top = self.__scrollTop;

			} else {

				if (self.options.paging) {
					top = Math.round(top / self.__clientHeight) * self.__clientHeight;
				} else if (self.options.snapping) {
					top = Math.round(top / self.__snapHeight) * self.__snapHeight;
				}

			}

			// Limit for allowed ranges
			left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
			top = Math.max(Math.min(self.__maxScrollTop, top), 0);

			// Don't animate when no change detected, still call publish to make sure
			// that rendered position is really in-sync with internal data
			if (left === self.__scrollLeft && top === self.__scrollTop) {
				animate = false;
			}

			// Publish new values
			self.__publish(left, top, zoom, animate);

		},


		/**
		 * Scroll by the given offset
		 *
		 * @param left {Number ? 0} Scroll x-axis by given offset
		 * @param top {Number ? 0} Scroll x-axis by given offset
		 * @param animate {Boolean ? false} Whether to animate the given change
		 */
		scrollBy: function(left, top, animate) {

			var self = this;

			var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
			var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

			self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

		},



		/*
		---------------------------------------------------------------------------
			EVENT CALLBACKS
		---------------------------------------------------------------------------
		*/

		/**
		 * Mouse wheel handler for zooming support
		 */
		doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {

			var self = this;
			var change = wheelDelta > 0 ? 0.97 : 1.03;

			return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);

		},


		/**
		 * Touch start handler for scrolling support
		 */
		doTouchStart: function(touches, timeStamp) {

			// Array-like check is enough here
			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}

			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Stop deceleration
			if (self.__isDecelerating) {
				zynga.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Stop animation
			if (self.__isAnimating) {
				zynga.Animate.stop(self.__isAnimating);
				self.__isAnimating = false;
			}

			// Use center point when dealing with two fingers
			var currentTouchLeft, currentTouchTop;
			var isSingleTouch = touches.length === 1;
			if (isSingleTouch) {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			} else {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			}

			// Store initial positions
			self.__initialTouchLeft = currentTouchLeft;
			self.__initialTouchTop = currentTouchTop;

			// Store current zoom level
			self.__zoomLevelStart = self.__zoomLevel;

			// Store initial touch positions
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;

			// Store initial move time stamp
			self.__lastTouchMove = timeStamp;

			// Reset initial scale
			self.__lastScale = 1;

			// Reset locking flags
			self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
			self.__enableScrollY = !isSingleTouch && self.options.scrollingY;

			// Reset tracking flag
			self.__isTracking = true;

			// Dragging starts directly with two fingers, otherwise lazy with an offset
			self.__isDragging = !isSingleTouch;

			// Some features are disabled in multi touch scenarios
			self.__isSingleTouch = isSingleTouch;

			// Clearing data structure
			self.__positions = [];

		},


		/**
		 * Touch move handler for scrolling support
		 */
		doTouchMove: function(touches, timeStamp, scale) {

			// Array-like check is enough here
			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}

			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Ignore event when tracking is not enabled (event might be outside of element)
			if (!self.__isTracking) {
				return;
			}


			var currentTouchLeft, currentTouchTop;

			// Compute move based around of center of fingers
			if (touches.length === 2) {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			} else {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			}

			var positions = self.__positions;

			// Are we already is dragging mode?
			if (self.__isDragging) {

				// Compute move distance
				var moveX = currentTouchLeft - self.__lastTouchLeft;
				var moveY = currentTouchTop - self.__lastTouchTop;

				// Read previous scroll position and zooming
				var scrollLeft = self.__scrollLeft;
				var scrollTop = self.__scrollTop;
				var level = self.__zoomLevel;

				// Work with scaling
				if (scale != null && self.options.zooming) {

					var oldLevel = level;

					// Recompute level based on previous scale and new scale
					level = level / self.__lastScale * scale;

					// Limit level according to configuration
					level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

					// Only do further compution when change happened
					if (oldLevel !== level) {

						// Compute relative event position to container
						var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
						var currentTouchTopRel = currentTouchTop - self.__clientTop;

						// Recompute left and top coordinates based on new zoom level
						scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
						scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

						// Recompute max scroll values
						self.__computeScrollMax(level);

					}
				}

				if (self.__enableScrollX) {

					scrollLeft -= moveX;
					var maxScrollLeft = self.__maxScrollLeft;

					if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

						// Slow down on the edges
						if (self.options.bouncing) {

							scrollLeft += (moveX / 2);

						} else if (scrollLeft > maxScrollLeft) {

							scrollLeft = maxScrollLeft;

						} else {

							scrollLeft = 0;

						}
					}
				}

				// Compute new vertical scroll position
				if (self.__enableScrollY) {

					scrollTop -= moveY;
					var maxScrollTop = self.__maxScrollTop;

					if (scrollTop > maxScrollTop || scrollTop < 0) {

						// Slow down on the edges
						if (self.options.bouncing) {

							scrollTop += (moveY / 2);

						} else if (scrollTop > maxScrollTop) {

							scrollTop = maxScrollTop;

						} else {

							scrollTop = 0;

						}
					}
				}

				// Keep list from growing infinitely (holding min 10, max 20 measure points)
				if (positions.length > 60) {
					positions.splice(0, 30);
				}

				// Track scroll movement for decleration
				positions.push(scrollLeft, scrollTop, timeStamp);

				// Sync scroll position
				self.__publish(scrollLeft, scrollTop, level);

			// Otherwise figure out whether we are switching into dragging mode now.
			} else {

				var minimumTrackingForScroll = self.options.locking ? 3 : 0;
				var minimumTrackingForDrag = 5;

				var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
				var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

				self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
				self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;

				positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);

				self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

			}

			// Update last touch positions and time stamp for next event
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;
			self.__lastTouchMove = timeStamp;
			self.__lastScale = scale;

		},


		/**
		 * Touch end handler for scrolling support
		 */
		doTouchEnd: function(timeStamp) {

			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			// Ignore event when tracking is not enabled (no touchstart event on element)
			// This is required as this listener ('touchmove') sits on the document and not on the element itself.
			if (!self.__isTracking) {
				return;
			}

			// Not touching anymore (when two finger hit the screen there are two touch end events)
			self.__isTracking = false;

			// Be sure to reset the dragging flag now. Here we also detect whether
			// the finger has moved fast enough to switch into a deceleration animation.
			if (self.__isDragging) {

				// Reset dragging flag
				self.__isDragging = false;

				// Start deceleration
				// Verify that the last move detected was in some relevant time frame
				if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {

					// Then figure out what the scroll position was about 100ms ago
					var positions = self.__positions;
					var endPos = positions.length - 1;
					var startPos = endPos;

					// Move pointer to position measured 100ms ago
					for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
						startPos = i;
					}

					// If start and stop position is identical in a 100ms timeframe,
					// we cannot compute any useful deceleration.
					if (startPos !== endPos) {

						// Compute relative movement between these two points
						var timeOffset = positions[endPos] - positions[startPos];
						var movedLeft = self.__scrollLeft - positions[startPos - 2];
						var movedTop = self.__scrollTop - positions[startPos - 1];

						// Based on 50ms compute the movement to apply for each render step
						self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
						self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

						// How much velocity is required to start the deceleration
						var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;

						// Verify that we have enough velocity to start deceleration
						if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
							self.__startDeceleration(timeStamp);
						}

					}
				}
			}

			// If this was a slower move it is per default non decelerated, but this
			// still means that we want snap back to the bounds which is done here.
			// This is placed outside the condition above to improve edge case stability
			// e.g. touchend fired without enabled dragging. This should normally do not
			// have modified the scroll positions or even showed the scrollbars though.
			if (!self.__isDecelerating) {

				self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);

			}

			// Fully cleanup list
			self.__positions.length = 0;

		},



		/*
		---------------------------------------------------------------------------
			PRIVATE API
		---------------------------------------------------------------------------
		*/

		/**
		 * Applies the scroll position to the content element
		 *
		 * @param left {Number} Left scroll position
		 * @param top {Number} Top scroll position
		 * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
		 */
		__publish: function(left, top, zoom, animate) {

			var self = this;

			// Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
			var wasAnimating = self.__isAnimating;
			if (wasAnimating) {
				zynga.Animate.stop(wasAnimating);
				self.__isAnimating = false;
			}

			if (animate && self.options.animating) {

				// Keep scheduled positions for scrollBy/zoomBy functionality
				self.__scheduledLeft = left;
				self.__scheduledTop = top;
				self.__scheduledZoom = zoom;

				var oldLeft = self.__scrollLeft;
				var oldTop = self.__scrollTop;
				var oldZoom = self.__zoomLevel;

				var diffLeft = left - oldLeft;
				var diffTop = top - oldTop;
				var diffZoom = zoom - oldZoom;

				var step = function(percent, now, render) {

					if (render) {

						self.__scrollLeft = oldLeft + (diffLeft * percent);
						self.__scrollTop = oldTop + (diffTop * percent);
						self.__zoomLevel = oldZoom + (diffZoom * percent);

						// Push values out
						if (self.__callback) {
							self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);
						}

					}
				};

				var verify = function(id) {
					return self.__isAnimating === id;
				};

				var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
					if (animationId === self.__isAnimating) {
						self.__isAnimating = false;
					}

					if (self.options.zooming) {
						self.__computeScrollMax();
					}
				};

				// When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
				self.__isAnimating = zynga.Animate.start(step, verify, completed, 250, wasAnimating ? easeOutCubic : easeInOutCubic);

			} else {

				self.__scheduledLeft = self.__scrollLeft = left;
				self.__scheduledTop = self.__scrollTop = top;
				self.__scheduledZoom = self.__zoomLevel = zoom;

				// Push values out
				if (self.__callback) {
					self.__callback(left, top, zoom);
				}

				// Fix max scroll ranges
				if (self.options.zooming) {
					self.__computeScrollMax();
				}
			}
		},


		/**
		 * Recomputes scroll minimum values based on client dimensions and content dimensions.
		 */
		__computeScrollMax: function(zoomLevel) {

			var self = this;

			if (zoomLevel == null) {
				zoomLevel = self.__zoomLevel;
			}

			self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
			self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);

		},



		/*
		---------------------------------------------------------------------------
			ANIMATION (DECELERATION) SUPPORT
		---------------------------------------------------------------------------
		*/

		/**
		 * Called when a touch sequence end and the speed of the finger was high enough
		 * to switch into deceleration mode.
		 */
		__startDeceleration: function(timeStamp) {

			var self = this;

			if (self.options.paging) {

				var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
				var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
				var clientWidth = self.__clientWidth;
				var clientHeight = self.__clientHeight;

				// We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
				// Each page should have exactly the size of the client area.
				self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
				self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
				self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
				self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

			} else {

				self.__minDecelerationScrollLeft = 0;
				self.__minDecelerationScrollTop = 0;
				self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
				self.__maxDecelerationScrollTop = self.__maxScrollTop;

			}

			// Wrap class method
			var step = function(percent, now, render) {
				self.__stepThroughDeceleration(render);
			};

			// How much velocity is required to keep the deceleration running
			var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;

			// Detect whether it's still worth to continue animating steps
			// If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
			var verify = function() {
				return Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
			};

			var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
				self.__isDecelerating = false;

				// Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
				self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
			};

			// Start animation and switch on flag
			self.__isDecelerating = zynga.Animate.start(step, verify, completed);

		},


		/**
		 * Called on every step of the animation
		 *
		 * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
		 */
		__stepThroughDeceleration: function(render) {

			var self = this;


			//
			// COMPUTE NEXT SCROLL POSITION
			//

			// Add deceleration to scroll position
			var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
			var scrollTop = self.__scrollTop + self.__decelerationVelocityY;


			//
			// HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
			//

			if (!self.options.bouncing) {

				var scrollLeftFixed = Math.max(Math.min(self.__maxScrollLeft, scrollLeft), 0);
				if (scrollLeftFixed !== scrollLeft) {
					scrollLeft = scrollLeftFixed;
					self.__decelerationVelocityX = 0;
				}

				var scrollTopFixed = Math.max(Math.min(self.__maxScrollTop, scrollTop), 0);
				if (scrollTopFixed !== scrollTop) {
					scrollTop = scrollTopFixed;
					self.__decelerationVelocityY = 0;
				}

			}


			//
			// UPDATE SCROLL POSITION
			//

			if (render) {

				self.__publish(scrollLeft, scrollTop, self.__zoomLevel);

			} else {

				self.__scrollLeft = scrollLeft;
				self.__scrollTop = scrollTop;

			}


			//
			// SLOW DOWN
			//

			// Slow down velocity on every iteration
			if (!self.options.paging) {

				// This is the factor applied to every iteration of the animation
				// to slow down the process. This should emulate natural behavior where
				// objects slow down when the initiator of the movement is removed
				var frictionFactor = 0.95;

				self.__decelerationVelocityX *= frictionFactor;
				self.__decelerationVelocityY *= frictionFactor;

			}


			//
			// BOUNCING SUPPORT
			//

			if (self.options.bouncing) {

				var scrollOutsideX = 0;
				var scrollOutsideY = 0;

				// This configures the amount of change applied to deceleration/acceleration when reaching boundaries
				var penetrationDeceleration = 0.03;
				var penetrationAcceleration = 0.08;

				// Check limits
				if (scrollLeft < self.__minDecelerationScrollLeft) {
					scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
				} else if (scrollLeft > self.__maxDecelerationScrollLeft) {
					scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
				}

				if (scrollTop < self.__minDecelerationScrollTop) {
					scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
				} else if (scrollTop > self.__maxDecelerationScrollTop) {
					scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
				}

				// Slow down until slow enough, then flip back to snap position
				if (scrollOutsideX !== 0) {
					if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
						self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
					} else {
						self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
					}
				}

				if (scrollOutsideY !== 0) {
					if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
						self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
					} else {
						self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
					}
				}
			}
		}
	};

	// Copy over members to prototype
	for (var key in members) {
		Scroller.prototype[key] = members[key];
	}

})();

/*src/Animate.js*/

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */
(function(global) {

	var time = Date.now || function() {
		return +new Date();
	};

	var desiredFrames = 60;
	var millisecondsPerSecond = 1000;

	// Polyfill missing requestAnimationFrame

	if (global.requestAnimationFrame) {

		// pass

	} else {

		// requestAnimationFrame polyfill
		// http://webstuff.nfshost.com/anim-timing/Overview.html

		var postfix = "RequestAnimationFrame";
		var prefix = (function() {
			var all = "webkit,moz,o,ms".split(",");
			for (var i=0; i<4; i++) {
				if (global[all[i]+postfix] != null) {
					return all[i];
				}
			}
		})();

		if (prefix) {

			// Vendor specific implementation
			global.requestAnimationFrame = global[prefix+postfix];
			global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];

		} else {

			// Custom implementation
			var requests = {};
			var rafHandle = 1;
			var timeoutHandle = null;

			global.requestAnimationFrame = function(callback, root)
			{
				var callbackHandle = rafHandle++;

				// Store callback
				requests[callbackHandle] = callback;

				// Create timeout at first request
				if (timeoutHandle === null) {

					timeoutHandle = setTimeout(function() {

						var now = time();
						var currentRequests = requests;

						var keys = [];
						for (var key in currentRequests) {
							keys.push(key);
						}

						// Reset data structure before executing callbacks
						requests = {};
						timeoutHandle = null;

						// Process all callbacks
						for (var i=0, l=keys.length; i<l; i++) {
							currentRequests[keys[i]](now);
						}

					}, millisecondsPerSecond / desiredFrames);

				}

				return callbackHandle;
			};

			global.cancelRequestAnimationFrame = function(handle) {
				delete requests[handle];

				// Stop timeout if all where removed
				for (var key in requests) {
					return;
				}

				clearTimeout(timeoutHandle);
				timeoutHandle = null;
			};
		}
	}


	var running = {};
	var counter = 1;

	if (!window.zynga) {
		zynga = {};
	}


	/**
	 * Generic animation class with support for dropped frames both optional easing and duration.
	 *
	 * Optional duration is useful when the lifetime is defined by another condition than time
	 * e.g. speed of an animating object, etc.
	 *
	 * Dropped frame logic allows to keep using the same updater logic independent from the actual
	 * rendering. This eases a lot of cases where it might be pretty complex to figure out the state
	 * on the pure time difference.
	 */
	zynga.Animate = {

		/**
		 * Stops the given animation.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation was stopped (aka, was running before)
		 */
		stop: function(id) {
			var cleared = running[id] != null;
			if (cleared) {
				running[id] = null;
			}

			return cleared;
		},


		/**
		 * Whether the given animation is still running.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation is still running
		 */
		isRunning: function(id) {
			return running[id] != null;
		},


		/**
		 * Start the animation.
		 *
		 * @param stepCallback {Function} Pointer to function which is executed on every step.
		 *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
		 * @param verifyCallback {Function} Executed before every animation step.
		 *   Signature of the method should be `function() { return continueWithAnimation; }`
		 * @param completedCallback {Function}
		 *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
		 * @param duration {Integer} Milliseconds to run the animation
		 * @param easingMethod {Function} Pointer to easing function
		 *   Signature of the method should be `function(percent) { return modifiedValue; }`
		 * @param root {Element ? document.body} Render root, when available. Used for internal
		 *   usage of requestAnimationFrame.
		 * @return {Integer} Identifier of animation. Can be used to stop it any time.
		 */
		start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

			var start = time();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in running) {
					newRunning[usedId] = true;
				}
				running = newRunning;
			}

			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {

				// Normalize virtual value
				var render = virtual !== true;

				// Get current time
				var now = time();

				// Verification is executed before next animation step
				if (!running[id] || (verifyCallback && !verifyCallback(id))) {

					running[id] = null;
					completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
					return;

				}

				// For the current rendering to apply let's update omitted steps in memory.
				// This is important to bring internal state variables up-to-date with progress in time.
				if (render) {

					var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
					for (var j = 0; j < droppedFrames; j++) {
						step(true);
						dropCounter++;
					}

				}

				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}

				// Execute step callback, then...
				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					running[id] = null;
					completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
				} else if (render) {
					lastFrame = now;
					requestAnimationFrame(step, root);
				}
			};

			// Mark as running
			running[id] = true;

			// Init first step
			requestAnimationFrame(step, root);

			// Return unique animation ID
			return id;
		}
	};
})(this);
