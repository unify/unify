/*
===============================================================================================

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com
 Additional Authors: Dominik Göpel

 ===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * port of unify.ui.container.Scroll using Zynga Scroller for rendering
 */
/*
#ignore(core)
#ignore(core.effect)
#ignore(core.effect.Animate)
#ignore(Scroller)
 */
core.Class("unify.ui.container.Scroll", {
	include : [unify.ui.core.Widget, unify.ui.core.MRemoteChildrenHandling, unify.ui.core.MRemoteLayoutHandling, unify.ui.core.MChildControl],

	/**
	 * @param layout {unify.ui.layout.Base} Layout of container element
	 */
	construct : function(layout) {
		unify.ui.core.Widget.call(this);
		unify.ui.core.MRemoteChildrenHandling.call(this);
		unify.ui.core.MRemoteLayoutHandling.call(this);
		unify.ui.core.MChildControl.call(this);

		// Child container layout  
		this.setLayout(layout ||new unify.ui.layout.Basic());
		// Scroller layout
		this._setLayout(new unify.ui.layout.special.ScrollLayout());

		this._setStyle({
			overflow: "hidden"
		});
		var contentWidget = this.__contentWidget = this._showChildControl("content");
		this.__horizontalScrollIndicator = this._createChildControl("indicatorX");
		this.__verticalScrollIndicator = this._createChildControl("indicatorY");
		
		this._createScroller();

		this.addNativeListener("touchstart", this.__onTouchStart, this);
		this.addNativeListener("mousewheel", this.__onMouseWheel, this);
		
		this.addListener("resize", this.__updateDimensions, this);
		contentWidget.addListener("resize", this.__updateDimensions, this);
		
		this.addListener("changeVisibility", this.__onChangeVisibility, this);
		var root = this.__root = unify.core.Init.getApplication().getRoot();
		/*root.addNativeListener("touchmove", this.__onTouchMove,this);
		root.addNativeListener("touchend", this.__onTouchEnd,this);
		root.addNativeListener("touchcancel", this.__onTouchEnd,this);*/
		
		this.__inInitPhase = false;
		if ( (jasy.Env.getValue("os.name") != "android") && (jasy.Env.getValue("os.name") != "ios") ) {
			this.__inInitPhase = true;
			var cb = function() {
				this.__showIndicators();
				(function() {
					this.__inInitPhase = false;
					if (!this.__inTouch) {
						this.__hideIndicators();
					}
				}).lowDelay(1500, this);
			}.bind(this);
			this.addListener("changeVisibility", function(e) {
				if (e.getData() == "visible") {
					this.__inInitPhase = true;
					cb();
				}
			}, this);
			this.addListener("resize", cb, this);
		}
	},

	/*
	 ----------------------------------------------------------------------------
	 PROPERTIES
	 ----------------------------------------------------------------------------
	 */

	properties :
	{


		/** Whether the scroll view bounces past the edge of content and back again. */
		bounces :
		{
			init : true,
			type : "Boolean",
			apply : function(value) { this._applyScrollerProperty(value); }
		},

		/**
		 * Whether the content should be splitted into "pages" and the position
		 * is always snapped into a specific page
		 */
		paging :
		{
			init : false,
			type : "Boolean",
			apply : function(value) { this._applyScrollerProperty(value); }
		},

		/** Whether horizontal scrolling should be enabled */
		enableScrollX :
		{
			init : false,
			type : "Boolean",
			apply : function(value) { this._applyScrollerProperty(value); }
		},

		/** Whether vertical scrolling should be enabled */
		enableScrollY :
		{
			init : true,
			type : "Boolean",
			apply : function(value) { this._applyScrollerProperty(value); }
		},

		/** Whether the horizontal scroll indicator should be displayed */
		showIndicatorX :
		{
			init : true,
			type : "Boolean",
			apply : function(value) { this._applyShowIndicatorX(value); }
		},

		/** Whether the vertical scroll indicator should be displayed */
		showIndicatorY :
		{
			init : true,
			type : "Boolean",
			apply : function(value) { this._applyShowIndicatorY(value); }
		},

		scrollOnSmallContent :
		{
			init : false,
			type : "Boolean"
		},

		// overridden
		appearance :
		{
			init: "scroll"
		}
	},

	/*
	 ----------------------------------------------------------------------------
	 EVENTS
	 ----------------------------------------------------------------------------
	 */

	events :
	{
		/** Event fired if in scroll */
		scroll: lowland.events.Event,
		
		/** Event fired if scroll is ended */
		scrollend: lowland.events.Event,
		
		/** Event fired if container snaped */
		snap: lowland.events.Event
	},

	/*
	 ----------------------------------------------------------------------------
	 MEMBERS
	 ----------------------------------------------------------------------------
	 */

	members: {
		setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle,
		
		__scroller : null,
		__verticalScrollIndicator : null,
		__horizontalScrollIndicator : null,
		
		__inTouch : false,
		__showIndicatorsOnNextTouchMove: false,

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
		
		/**
		 * Returns child control widget identified by id
		 *
		 * @param id {String} ID of child widget
		 * @return {unify.ui.core.Widget}  widget
		 */
		_createChildControlImpl : function(id) {
			var child;

			switch(id){
				case "content":{
					child = this.getChildrenContainer();
					this._add(child, {
								type: "content"
							});
				}
				break;
				case "indicatorX":{
					var Indicator = this._getIndicator();
					child = new Indicator("horizontal",this);
					child.addListener("indicatorMoveStart", this.__onIndicatorMoveStart, this);
					child.addListener("indicatorMoveEnd", this.__onIndicatorMoveEnd, this);
					child.addListener("indicatorMove", this.__onIndicatorMove, this);
					var distance = Indicator.DISTANCE;
					var thickness= Indicator.THICKNESS;
					child.setHeight(thickness);
					this._add(child, {
						type: "indicatorX",
						distance: distance
					});
					
				}
				break;
				case "indicatorY":{
					var Indicator = this._getIndicator();
					var child = new Indicator("vertical",this);
					child.addListener("indicatorMoveStart", this.__onIndicatorMoveStart, this);
					child.addListener("indicatorMoveEnd", this.__onIndicatorMoveEnd, this);
					child.addListener("indicatorMove", this.__onIndicatorMove, this);
					var distance = Indicator.DISTANCE;
					var thickness= Indicator.THICKNESS;
					child.setWidth(thickness);
							this._add(child, {
								type: "indicatorY",
								distance: distance
							});
				}
				break;
				default:{
					child = unify.ui.core.MChildControl.prototype._createChildControlImpl(this,id);
				}
			}
			
			return child;
		},
		

		/**
		 * Gets inner content container
		 *
		 * @return {unify.ui.core.Widget} Content widget
		 */
		getChildrenContainer : function() {
			var contentWidget = this.__contentWidget;
			
			if (!contentWidget) {
				contentWidget = this.__contentWidget = new unify.ui.container.Composite();
			}
			
			return contentWidget;
		},

		_createElement : function() {
			return document.createElement("div");
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
		
		/**
		 * @return {unify.ui.container.scroll.IIndicator} Indicator class
		 */
		_getIndicator : function() {
			var Indicator=unify.ui.container.scroll.Indicator;
			if(unify.bom.client.System.ANDROID){
				//android renders the default indicator in a funny way (scaling the middle element does not work correctly for certain values
				//so we use a specialized one here
				Indicator=unify.ui.container.scroll.ScalingIndicator;
			}
			return Indicator;
		},


		/**
		 * (re)creates the scroller object and restores scroll position if required
		 *
		 * @return {Scroller} Zynga scroller object
		 */
		_createScroller : function() {
			this.__updateProperties();
			delete this.__scroller;
			var contentWidget = this._getScrollerContentWidget();
			var contentElement= contentWidget.getElement();
			var Style=lowland.bom.Style;
			var Transform=unify.bom.Transform;
			var self = this;

			var render = function(left, top, zoom, event) {
				self.__inAnimation = !!self.__inTouch;//TODO this evaluates to false during deceleration!
				Style.set(contentElement,"transform",Transform.accelTranslate((-left) + 'px', (-top) + 'px'));
				if (self.__enableScrollX) {
					self.__scrollLeft=left;
				}
				if (self.__enableScrollY) {
					self.__scrollTop=top;
				}
				
				self.__renderIndicators(left,top);
				
				if (self.hasListener("scroll")) {
					self.fireEvent("scroll");
				}
				if (event == "stop" || event == "stop_deceleration" || event == "stop_animation") {
					self.__hideIndicators();
					if (self.hasListener("scrollend")) {
						self.fireEvent("scrollend");
					}
					
					self.__inAnimation = false;
				}
			};
			
			var options = {
				scrollingX : this.getEnableScrollX(),
				scrollingY : this.getEnableScrollY(),
				paging : this.getPaging(),
				bouncing : this.getBounces()
			};
			var currentLeft=this.__scrollLeft;
			var currentTop=this.__scrollTop;
			var scroller = this.__scroller = new Scroller(render, options);
			this.__updateDimensions();
			
			//restore old scrollposition
			if(currentLeft||currentTop){
				scroller.scrollTo(currentLeft,currentTop,false);
			}
			
			return scroller;
		},
		
		/**
		 * get the content widget for the scroller.
		 * 
		 * defaults to the childrencontainer, override this if you want to add a custom implementation
		 * 
		 * @return {unify.ui.core.Widget} the widget that will be used as content for the scroller
		 */
		_getScrollerContentWidget: function(){
			return this.getChildrenContainer();
		},
		
		/*
		 ---------------------------------------------------------------------------
		 PROPERTY APPLY ROUTINES
		 ---------------------------------------------------------------------------
		 */
		/**
		 * must be called when a property changes that influences the scroller behavior
		 * 
		 * recreates the scroller immediatly or after the running animation ended
		 */
		_applyScrollerProperty : function(){
			if(this.__inAnimation){
				this.addListenerOnce("scrollend",this._createScroller,this);
			} else {
				this._createScroller();
			}
		},

		_applyShowIndicatorX : function() {
			this.__updateProperties();
		},
		
		_applyShowIndicatorY : function() {
			this.__updateProperties();
		},

		/**
		 * Updates dimensions of scroller to match content container
		 */
		__updateDimensions : function(){
			var scrollerDimension = this.getBounds();
			var contentDimension = this.getChildrenContainer().getBounds();

			if (scrollerDimension && contentDimension && scrollerDimension.width>0 && scrollerDimension.height>0) {
				var scrollerWidth = scrollerDimension.width;
				var scrollerHeight = scrollerDimension.height;
				var contentWidth = contentDimension.width;
				var contentHeight = contentDimension.height;
				
				this.__scroller.setDimensions(scrollerWidth, scrollerHeight, contentWidth, contentHeight);
				
				this.__clientWidth = scrollerWidth;
				this.__clientHeight = scrollerHeight;
				this.__contentWidth = contentWidth;
				this.__contentHeight = contentHeight;
			}
		},

		/**
		 * Renders scroll indicators (if enabled)
		 * @param left {Number} current scrollLeft
		 * @param top {Number} current scrollTop
		 */
		__renderIndicators : function(left,top){
			// Display scroll indicators as soon as we touch and the content is bigger than the container
			if (this.__enableScrollX && this.__showIndicatorX) {
				this.__horizontalScrollIndicator.render(left);
			}

			if (this.__enableScrollY && this.__showIndicatorY) {
				this.__verticalScrollIndicator.render(top);
			}

		},


		/**
		 * Snaps into bounds after recalculating client width and height
		 * Usable for resize of window while paging
		 */
		reflow : function() {
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

		/**
		 * Scroll to the given position
		 *
		 * @param left {Integer?null} Horizontal scroll position, keeps current if value is <code>null</code>
		 * @param top {Integer?null} Vertical scroll position, keeps current if value is <code>null</code>
		 * @param animate {Boolean?false} Whether the scrolling should happen using an animation
		 * @param zoom {Number?null} Zoom level
		 */
		__scrollTo : function(left,top,animate,zoom){
			this.__scroller.scrollTo(left,top,animate,zoom);
			if(!animate){
				this.__scrollTop=top;
				this.__scrollLeft=left;
				
				this.fireEvent("scrollend");
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
		 * @deprecated
		 * @return {Integer} cached content width
		 */
		_getContentWidth : function() {
			return this.__contentWidth;
		},
		
		/**
		 * Returns the cached content width
		 *
		 * @return {Integer} cached content width
		 */
		getContentWidth : function() {
			return this.__contentWidth;
		},

		/**
		 * Returns the cached content height
		 *
		 * @deprecated
		 * @return {Integer} cached content height
		 */
		_getContentHeight : function() {
			return this.__contentHeight;
		},
		
		/**
		 * Returns the cached content height
		 *
		 * @return {Integer} cached content height
		 */
		getContentHeight : function() {
			return this.__contentHeight;
		},

		/**
		 * getter for cached value
		 *
		 * @return {Boolean} true if both scroll axis are enabled and both indicators are visible
		 */
		getTwoAxisScroll: function(){
			return this.__twoAxisScroll;
		},

		__newWheelScrollPos : null,

		/**
		 * Handler for mouse wheel event
		 *
		 * @param e {Event} Mouse wheel event
		 */
		__onMouseWheel : function(e) {
			var newScrollPos = this.__newWheelScrollPos;
			var top;
			
			var delta = e.wheelDelta * (-60);
			
			if (newScrollPos) {
				top = newScrollPos + delta;
			} else {
				var top = this.getScrollTop() + delta;
			}
			
			var maxTop = this.__contentHeight - this.__clientHeight;
			if (top < 0) {
				top = 0;
			} else if (top > maxTop) {
				top = maxTop;
			}
			
			this.__newWheelScrollPos = top;
			
			this.scrollTo(null, top, false);
			
			this.addListenerOnce("scrollend", function() {
				this.__newWheelScrollPos = null;
			}, this);
		},

		/**
		 * Update cached scroll properties
		 */
		__updateProperties : function() {
			//cache values
			this.__enableScrollX = this.getEnableScrollX();
			this.__enableScrollY = this.getEnableScrollY();
			this.__showIndicatorX = this.getShowIndicatorX();
			this.__showIndicatorY = this.getShowIndicatorY();
			var oldTwoAxisScroll=this.__twoAxisScroll;
			this.__twoAxisScroll = this.__enableScrollX && this.__showIndicatorX && this.__enableScrollY && this.__showIndicatorY;
			//twoaxisscroll changed, indicators need to adapt to new dimensions
			if(oldTwoAxisScroll!=this.__twoAxisScroll){
				this.__horizontalScrollIndicator.initRenderingCache(this);
				this.__verticalScrollIndicator.initRenderingCache(this);
			}
		},

		__indicatorMovePos : null,

		__onIndicatorMoveStart : function(e) {
			var data = e.getData();
			
			if (data.orientation == "horizontal") {
				var pos = this.__indicatorMovePos = data.pos;
				this.__scroller.doTouchStart([{pageX: pos, pageY: 0}], +data.nativeEvent.timeStamp);
			} else {
				var pos = this.__indicatorMovePos = data.pos;
				this.__scroller.doTouchStart([{pageX: 0, pageY: pos}], +data.nativeEvent.timeStamp);
			}
		},
		
		__onIndicatorMoveEnd : function(e) {
			this.__scroller.doTouchEnd(+e.getData().nativeEvent.timeStamp);
		},
		
		__onIndicatorMove : function(e) {
			var delta;
			var pos;
			var data = e.getData();
			
			if (data.orientation == "horizontal") {
				var pos = data.pos;
				this.__scroller.doTouchMove([{pageX: pos, pageY: 0}], +data.nativeEvent.timeStamp, 1.0);
			} else {
				pos = data.pos;
				this.__scroller.doTouchMove([{pageX: 0, pageY: pos}], +data.nativeEvent.timeStamp, 1.0);
			}
		},

		__startPos : null,
		__isMoved : false,

		/**
		 * Handler for touch start event
		 *
		 * @param e {Event} Touch event
		 */
		__onTouchStart : function(e){
			this.__inTouch = true;
			
			var touch = e.touches[0];
			this.__startPos = [touch.pageX, touch.pageY];
			this.__showIndicatorsOnNextTouchMove=true;
			//TODO why is this called here? touchstart should not change the properties, so no need to recache them
			this.__updateProperties();

			if (!(this.getScrollOnSmallContent() || (this.__enableScrollX && this.__contentWidth > this.__clientWidth)
					|| (this.__enableScrollY && this.__contentHeight > this.__clientHeight))) {
				return; //neither X nor Y scroll possible, no need to try
			}

			//var ne=e.getNativeEvent();
			var ne = e;
			var touches=ne.touches;

			// Don't react if initial down happens on a form element
			if (touches[0].target.tagName && touches[0].target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			this.__scroller.doTouchStart(touches, +ne.timeStamp);
			lowland.bom.Events.preventDefault(e);
			
			var root = this.__root;
			root.addNativeListener("touchmove", this.__onTouchMove,this);
			root.addNativeListener("touchend", this.__onTouchEnd,this);
			root.addNativeListener("touchcancel", this.__onTouchEnd,this);
			
/* NEW:      var cb = function() {
				this.removeNativeListener(root, "touchmove", cb);
				this.__showIndicators.apply(this, arguments);
			}.bind(this);

			var root = unify.core.Init.getApplication().getRoot().getEventElement();
			this.addNativeListener(root, "touchmove", cb, this); */
		},

		/**
		 * shows scroll indicators depending on configuration
		 * axis must be scroll enabled and the indicator must be allowed to show
		 */
		__showIndicators: function(){
			if (this.__enableScrollX && this.__showIndicatorX && (this.__inTouch || this.__inInitPhase)) {
				this.__horizontalScrollIndicator.setVisible(true);
			}

			if (this.__enableScrollY && this.__showIndicatorY && (this.__inTouch || this.__inInitPhase)) {
				this.__verticalScrollIndicator.setVisible(true);
			}
		},
		
		/**
		 * Handler for touch move event
		 *
		 * @param e {Event} Touch event
		 */
		__onTouchMove : function(e){
			if(!this.__inTouch){
				return;
			}
			
			var touch = e.touches[0];
			var x = touch.pageX;
			var y = touch.pageY;
			
			var startPos = this.__startPos;
			
			if (Math.abs(x-startPos[0]) > 10) {
				this.__isMoved = true;
			} else if (Math.abs(y-startPos[1]) > 10) {
				this.__isMoved = true;
			}
			
			if(this.__showIndicatorsOnNextTouchMove){
				this.__showIndicatorsOnNextTouchMove=false;
				this.__showIndicators();
				
			}
			var ne=e;
			this.__scroller.doTouchMove(ne.touches, +ne.timeStamp, ne.scale);
		},
		
		/**
		 * Handler for touch end event
		 *
		 * @param e {Event} Touch event
		 */
		__onTouchEnd : function(e){
			if(!this.__inTouch){
				return;
			}
			this.__inTouch = false;
			
			var root = this.__root;
			root.removeNativeListener("touchmove", this.__onTouchMove,this);
			root.removeNativeListener("touchend", this.__onTouchEnd,this);
			root.removeNativeListener("touchcancel", this.__onTouchEnd,this);
			this.__showIndicatorsOnNextTouchMove=false;
			if (this.__isMoved) {
				this.__isMoved = false;
				this.__scroller.doTouchEnd(+e.timeStamp);
			}
		},
		
		abortTouch : function() {
			this.__onTouchEnd({
				timeStamp: (new Date).valueOf()
			});
		},
		
		/**
		 * Hides indicators
		 */
		__hideIndicators : function() {
			this.__verticalScrollIndicator.setVisible(false);
			this.__horizontalScrollIndicator.setVisible(false);
		},
		
		/**
		 * Change visibility handler
		 *
		 * @param e {Event} Visibility event
		 */
		__onChangeVisibility : function(e) {
			if (e.getData() !== "visible") {
				this.__hideIndicators();
			}
		}
	}/*,
	
	destruct : function() {
		this.removeListener("touchstart", this.__onTouchStart,this);
		this.removeListener("mousewheel", this.__onMouseWheel, this);
		
		this.removeListener("resize", this.__updateDimensions, this);
		this.getChildrenContainer().removeListener("resize", this.__updateDimensions, this);
		this.removeListener("changeVisibility", this.__onChangeVisibility, this);
	}
======= ORIGIN:
		var root = qx.core.Init.getApplication().getRoot();
		root.removeListener("touchmove", this.__onTouchMove,this);
		root.removeListener("touchend", this.__onTouchEnd,this);
		root.removeListener("touchcancel", this.__onTouchEnd,this);
	}*/
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

		/** {Integer} Height to assign to refresh area */
		__refreshHeight: null,

		/** {String} the refresh process that starts when the event is released now */
		__refreshActive: null,

		/** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
		__refreshActivate: null,

		/** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
		__refreshDeactivate: null,

		/** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
		__refreshStart: null,

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
		 * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
		 * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
		 * the official Twitter client.
		 *
		 * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
		 * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
		 * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
		 * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
		 */
		activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback) {

			var self = this;

			self.__refreshHeight = height;
			self.__refreshActivate = activateCallback;
			self.__refreshDeactivate = deactivateCallback;
			self.__refreshStart = startCallback;

		},

		/**
		 * executes pull-to-refresh programmatically
		 * @param location {String} "top" or "bottom", the location to execute it
		 */
		executePullToRefresh: function(location){
			var self=this;
			self.__refreshActive=location;
			// Use publish instead of scrollTo to allow scrolling to out of boundary position
			// We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
			var posY=(self.__refreshActive=="top")?(-self.__refreshHeight):(self.__maxScrollTop+self.__refreshHeight);
			self.__publish(self.__scrollLeft, posY , self.__zoomLevel, true);

			if (self.__refreshStart) {
				self.__refreshStart(self.__refreshActive);
			}
		},
		/**
		 * Signalizes that pull-to-refresh is finished.
		 */
		finishPullToRefresh: function() {

			var self = this;

			if (self.__refreshDeactivate) {
				self.__refreshDeactivate(self.__refreshActive);
			}
			self.__refreshActive = null;

			self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

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
				core.effect.Animate.stop(self.__isDecelerating);
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
				core.effect.Animate.stop(self.__isDecelerating);
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
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Stop animation
			if (self.__isAnimating) {
				core.effect.Animate.stop(self.__isAnimating);
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

							// Support pull-to-refresh (only when only y is scrollable)
							if (!self.__enableScrollX && self.__refreshHeight != null) {

								if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {

									self.__refreshActive = "top";
									if (self.__refreshActivate) {
										self.__refreshActivate(self.__refreshActive);
									}
								} else if (!self.__refreshActive && scrollTop >= (maxScrollTop + self.__refreshHeight)) {
									self.__refreshActive = "bottom";
									if (self.__refreshActivate) {
										self.__refreshActivate(self.__refreshActive);
									}

								} else if (self.__refreshActive && scrollTop > -self.__refreshHeight && scrollTop < (maxScrollTop + self.__refreshHeight)) {

									
									if (self.__refreshDeactivate) {
										self.__refreshDeactivate(self.__refreshActive);
									}
									self.__refreshActive=null;
								}
							}

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

							// Deactivate pull-to-refresh when decelerating
							if (!self.__refreshActive) {

								self.__startDeceleration(timeStamp);

							}
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

				if (self.__refreshActive && self.__refreshStart) {

					self.executePullToRefresh(self.__refreshActive);

				} else {

					self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
																				if (self.__callback) {
																								self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, "stop");
																				}

					// Directly signalize deactivation (nothing todo on refresh?)
					if (self.__refreshActive) {

						
						if (self.__refreshDeactivate) {
							self.__refreshDeactivate(self.__refreshActive);
						}
						self.__refreshActive = null;

					}
				}
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
				core.effect.Animate.stop(wasAnimating);
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
																				if (self.__callback) {
							self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, "stop_animation");
																				}
				};

				// When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
				self.__isAnimating = core.effect.Animate.start(step, verify, completed, 250, wasAnimating ? easeOutCubic : easeInOutCubic);

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
																if (self.__callback) {
																				self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, "stop_deceleration");
																}
			};

			// Start animation and switch on flag
			self.__isDecelerating = core.effect.Animate.start(step, verify, completed);

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
