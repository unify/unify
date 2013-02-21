/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, TELEKOM AG

===============================================================================================
*/

/**
 * EXPERIMENTAL
 * 
 * single div scroll indicator that uses pure 3d transforms to change position and size.
 * 
 * pro: faster than unify.ui.container.scroll.Indicator that uses 4 elements and shows now visual glitches on android
 * con: on scaling down, rounded borders turn back into corners
 */

(function() {

	/** {Integer} Size of the scroll indicator */
	var THICKNESS = 5;
	
	/** {Integer} Distance from edges */
	var DISTANCE = 2;

	core.Class("unify.ui.container.scroll.ScalingIndicator", {
		include : [unify.ui.core.Widget],
		implement : [unify.ui.container.scroll.IIndicator],
	
		/*
		----------------------------------------------------------------------------
			 PROPERTIES
		----------------------------------------------------------------------------
		*/
	
		properties :
		{
			/** Whether the indicator is visible */
			visible :
			{
				type : "Boolean",
				init : false,
				apply : function(value) { this._applyVisible(value); }
			},
	
			/** Parent scroller indicator belongs to */
			scroll:{
				/*type: "unify.ui.container.Scroll",*/
				init: null,
				apply: function(value) { this._applyScroll(value); }
			}
		},
		
		events : {
			indicatorMoveStart : core.event.Simple,
			indicatorMoveEnd : core.event.Simple,
			indicatorMove : core.event.Simple
		},
	
		/**
		 * @param orientation {String?null} Orientation of indicator
		 * @param scroll {unify.ui.container.Scroll} Scroller indicator is assigned to
		 */
		construct : function(orientation,scroll) {
			unify.ui.core.Widget.call(this);
	
			this.__horizontal=(orientation=="horizontal");
			this.setScroll(scroll);
			scroll.addListener("resize",this.__onScrollerResize,this);
			scroll.getChildrenContainer().addListener("resize",this.__onScrollerContentResize,this);
		},
	
		members : {
			__isFadingOut : false,
			__isVisible : false,
			__horizontal: false,
			__currentSize : null,
			__minSize:null,
			__maxSize: null,
			__currentIndicatorPosition: null,
			__minIndicatorPosition:null,
			__maxIndicatorPosition:null,
			__maxScrollPosition: null,
	
			__elem: null,
	
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
			initRenderingCache:function(scroll){
				var scrollerDimension = scroll.getBounds();
				var contentDimension = scroll.getChildrenContainer().getBounds();
	
				if (scrollerDimension && contentDimension && scrollerDimension.width>0 && scrollerDimension.height>0) {
					var scrollerWidth = scrollerDimension.width;
					var scrollerHeight = scrollerDimension.height;
					var contentWidth = contentDimension.width;
					var contentHeight = contentDimension.height;
					var twoAxisScroll=scroll.getTwoAxisScroll();
	
					// Sum of margins substracted from the client size for computing the indicator size
					var margin =  DISTANCE*2;
					if (twoAxisScroll) {
						margin += THICKNESS + DISTANCE;
					}
					var minSize=this.__minSize=THICKNESS;
					this.__minIndicatorPosition=0;
	
					if(this.__horizontal){
						this.__maxSize=(scrollerWidth>0 && contentWidth>0)?(Math.max(minSize,Math.round((scrollerWidth/contentWidth)*(scrollerWidth-margin)))):0;
						this.__maxIndicatorPosition=scrollerWidth-this.__maxSize-margin;
						this.__maxScrollPosition=contentWidth-scrollerWidth;
	
						lowland.bom.Style.set(this.__elem,{
								left:DISTANCE+"px",
								top: (scrollerHeight-THICKNESS-DISTANCE)+"px",
								height:THICKNESS+"px",
								width:this.__maxSize+"px"});
					} else {
						this.__maxSize=(scrollerHeight>0 && contentHeight>0)?(Math.max(minSize,Math.round((scrollerHeight/contentHeight)*(scrollerHeight-margin)))):0;
						this.__maxIndicatorPosition=scrollerHeight-this.__maxSize-margin;
						this.__maxScrollPosition=contentHeight-scrollerHeight;
						lowland.bom.Style.set(this.__elem,{
								top:DISTANCE+"px",
								left: (scrollerWidth-THICKNESS-DISTANCE)+"px",
								width:THICKNESS+"px",
								height:this.__maxSize+"px"
						});
					}
				}
			},
	
	
	
			/*
			---------------------------------------------------------------------------
				INTERFACE METHODS
			---------------------------------------------------------------------------
			*/
	
			// overridden
			_createElement : function()
			{
				var doc = document;
				var elem = this.__elem=doc.createElement("div");
				var baseStyles={
					width:THICKNESS+"px",
					height:THICKNESS+"px",
					borderRadius:Math.floor(THICKNESS/2)+"px",
					transitionProperty:"opacity",
					transitionDuration:"250ms",
					transitionTimingFunction:"linear",
					transform:"",
					backgroundColor:'rgba(0,0,0,0.5)',
					opacity:0,
					position:"absolute",
					zIndex: 10
				};
				lowland.bom.Style.set(elem,baseStyles);
	
				return elem;
			},
	
			//overridden
			renderLayout : function(left, top, width, height, preventSize) {
				//don't let the layout mess with our height/width calculations, this is taken care of in initRenderingCache
				return unify.ui.core.Widget.prototype.renderLayout.call(this,left,top,width,height,true);
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
			 * @param scrollPosition {Integer} current scroll position on the indicators axis
			 */
			render : function(scrollPosition) {
	
				// Omit update when invisible or fading out
				// We move the scrollbar out of view as soon as it is not visible anymore
				if (!this.__isVisible)
				{
					return;
				}
				var style={};
				var changed=false;
				var horizontal=this.__horizontal;
				var newPosition;
				var newSize;
				var maxSize=this.__maxSize;
				//bounce up/left
				if (scrollPosition < 0)
				{
					newSize = Math.max(Math.round(maxSize + scrollPosition), this.__minSize);
					newPosition=this.__minIndicatorPosition;
				}
				//bounce down/right
				else if (scrollPosition > this.__maxScrollPosition)
				{
					newSize = Math.max(Math.round(maxSize + this.__maxScrollPosition - scrollPosition),this.__minSize);
					newPosition = this.__maxIndicatorPosition;
				}
				// In range
				else
				{
					newSize=maxSize;
					newPosition=Math.round((scrollPosition/this.__maxScrollPosition)*this.__maxIndicatorPosition);
				}
	
				if(newPosition!=this.__currentIndicatorPosition){
					changed=true;
					this.__currentIndicatorPosition = newPosition;
					style.transform = this.__currentPositionTransform = horizontal ? unify.bom.Transform.accelTranslate(newPosition+"px",0) : unify.bom.Transform.accelTranslate(0,newPosition+"px");
				}
	
				if (newSize !=this.__currentSize)
				{
				 changed=true;
				 this.__currentSize=newSize;
	
				 if(horizontal){
					 style.transformOriginX=((newSize<maxSize && newPosition==this.__minIndicatorPosition)?"0%":"100%");
				 } else {
					 style.transformOriginY=((newSize<maxSize && newPosition==this.__minIndicatorPosition)?"0%":"100%");
				 }
				 var scale;
				 if(newSize<maxSize){
					 if(horizontal){
						 scale=unify.bom.Transform.accelScale((newSize/this.__maxSize),1);
					 } else {
						 scale=unify.bom.Transform.accelScale(1,(newSize/this.__maxSize));
					 }
				 } else {
					 scale=unify.bom.Transform.accelScale(1,1);
				 }
	
				 if(style.transform){
					 style.transform+=" "+scale;
				 } else {
					 style.transform=this.__currentPositionTransform+" "+scale;
				 }
				}
	
				if(changed){
					lowland.bom.Style.set(this.__elem,style);
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
			
			/**
			 * executes on update of scroll property
			 * @param scroll
			 */
			_applyScroll: function(scroll){
				this.initRenderingCache(scroll);
			}
		}
	});
	
	core.Main.addStatics("unify.ui.container.scroll.ScalingIndicator", {
		THICKNESS : THICKNESS,
		DISTANCE : DISTANCE
	});

})();
