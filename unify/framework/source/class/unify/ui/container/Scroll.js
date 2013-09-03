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
				var self = this;
				this.__showIndicators();
				this.__hideUntappedIndicators.lowDelay(1500, this);
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
		scroll: core.event.Simple,
		
		/** Event fired if scroll is ended */
		scrollend: core.event.Simple,
		
		/** Event fired if container snaped */
		snap: core.event.Simple
	},

	/*
	 ----------------------------------------------------------------------------
	 MEMBERS
	 ----------------------------------------------------------------------------
	 */

	members: {
		setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle,
		_afterAddChild : null,
		_afterRemoveChild : null,
		
		__scroller : null,
		__verticalScrollIndicator : null,
		__horizontalScrollIndicator : null,
		
		__inTouch : false,
		__inMouseWheel: false,
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
					child.forceAccelerated();
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
		 * Returns the current scroll y-position
		 */
		getScrollTop : function(){
			return this.__scrollTop;
		},
		
		/**
		 * Returns the current scroll x-position
		 */
		getScrollLeft : function(){
			return this.__scrollLeft;
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
				contentWidget.setPostLayout(Transform.accelTranslate((-left) + 'px', (-top) + 'px'));
				
				if (self.__enableScrollX) {
					self.__scrollLeft=left;
				}
				if (self.__enableScrollY) {
					self.__scrollTop=top;
				}
				
				self.__renderIndicators(left,top);
				if (event!=="cleanup" && self.hasListener("scroll")) {
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
			var scroller = this.__scroller = new core.ui.Scroller(render, options);
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
			
			if(!this.getEnableScrollY()){
				return; //nothing to do if scrolling is deactivated for Y-scrolling
			}
			
			
			this.__inMouseWheel = true;

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

			this.__showIndicators();
			this.scrollTo(null, top, false);
			
			this.addListenerOnce("scrollend", this.__onMouseWheelScrollEnd, this);
		},


		__onMouseWheelScrollEnd: function(e) {
			this.__newWheelScrollPos = null;
			this.__inMouseWheel = false;

			// We delay the hiding of the scroll indicators to make it more pleasing
			// on the eyes to show them. Since it takes some time to smoothly fade
			// them in, it could be that the indicators would otherwise not be visible
			// at all.
			this.__hideIndicators.lowDelay(250, this);
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
			var touches=e.touches;

			// Don't react if initial down happens on a form element
			if (touches[0].target.tagName && touches[0].target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			this.__scroller.doTouchStart(touches, +e.timeStamp);
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
			if (this.__enableScrollX && this.__showIndicatorX && (this.__inTouch || this.__inMouseWheel || this.__inInitPhase)) {
				this.__horizontalScrollIndicator.setVisible(true);
			}

			if (this.__enableScrollY && this.__showIndicatorY && (this.__inTouch || this.__inMouseWheel || this.__inInitPhase)) {
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
			this.__scroller.doTouchMove(e.touches, Date.now(), e.scale);
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
				this.__scroller.doTouchEnd(Date.now());
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
		
		__hideUntappedIndicators : function() {
			this.__inInitPhase = false;
			if (!this.__inTouch) {
				this.__hideIndicators();
			}
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
		},
		
		destruct : function() {
			this.getChildrenContainer().removeListener("resize", this.__updateDimensions, this);
			
			unify.ui.core.MChildControl.prototype.destruct.call(this);
			unify.ui.core.Widget.prototype.destruct.call(this);
		}
	}
});
