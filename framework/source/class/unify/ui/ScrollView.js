/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Component for "virtual" scrolling through mouse or touch controls.
 *
 * Features:
 *
 * * Scrolling could be enabled/disabled separately for each axis.
 * * Indicator style is changable through an API call (per instance)
 * * Flips back when scrolling out of allowed ranges.
 * * Smooth animations for deleleration and flip back
 * * Page based scrolling where the content is auto-splitted into pages which are used for snapping into
 *
 * Technical:
 *
 * * Frame based animation which is able to drop frames when needed.
 * * Animation could be disabled on slow systems
 *
 */
qx.Class.define("unify.ui.ScrollView",
{
  extend : unify.ui.Container,



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Whether features like flip-back or motion scrolling should be enabled */
    animated :
    {
      init : true,
      check : "Boolean"
    },

    /** Whether the scroll view bounces past the edge of content and back again. */
    bounces :
    {
      init : !unify.bom.client.System.ANDROID,
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

  members :
  {
    /*
    ---------------------------------------------------------------------------
      SETTINGS
    ---------------------------------------------------------------------------
    */

    /**
     * {Integer} Number of pixels the finger needs to be moved until we switch
     * into dragging mode.
     */
    __minimumTrackingForDrag : 5,

    /**
     * {Time} Duration of animation to flip back when moved outside the
     * ScrollView's boundaries
     */
    __pagingTransitionDuration : "0.25s",

    /**
     * {Integer} Minimum size of incicator during normal drag sesssions (inside valid
     * boundaries of the ScrollView)
     */
    __minIndicatorLength : 34,

    /**
     * {Number} Acceleration used for animations during touch sequences
     */
    __acceleration : 15,

    /**
     * {Integer} Maximum milliseconds to respect for computing the speed
     * of the deleleration. When the last move was longer ago than this value
     * then there will not be any deceleration animation.
     */
    __maxTrackingTime : 100,

    /**
     * {Number} This is the factor applied to every iteration of the animation
     * to slow down the process. This should emulate natural behavior where
     * objects slow down when the initiator of the movement is removed
     */
    __decelerationFrictionFactor : 0.95,

    /**
     * {Number} Renders a animation step every x milliseconds.
     */
    __desiredAnimationFrameRate : 1000 / 60,

    /**
     * {Number} Minimum velocity. A velocity under this value immediately stops the animation.
     */
    __minVelocity : 0.01,

    /**
     * {Number} Minimum velocity to display scroll indicator. A velocity
     * under this value immediately hides the scroll indicators. This value
     * is typically higher than the value above as scroll indicators are
     * faded out slowly.
     */
    __minVelocityToHideScrollIndicators : 0.05,

    /**
     * {Number} Deceleration performance when passing client's boundaries
     * (bouncing need to be activated).
     */
    __penetrationDeceleration : 0.03,

    /**
     * {Number} Deceleration performance in paging mode
     */
    __penetrationDecelerationWithPaging : 0.15,

    /**
     * {Number} Acceleration performance when snapping back to client's
     * boundaries (bouncing need to be activated).
     */
    __penetrationAcceleration : 0.08,

    /**
     * {Number) Minium velocity to switch into animation when the user
     * removes the finger from the screen
     */
    __minVelocityForDeceleration : 1,

    /**
     * {Number} Minium velocity to animate paging. This requires more user
     * effort than the normal scrolling.
     */
    __minVelocityForDecelerationWithPaging : 4,



    /*
    ---------------------------------------------------------------------------
      INTERNAL FIELDS :: OBJECT REFERENCES
    ---------------------------------------------------------------------------
    */

    /** {Element} DOM element which holds the content of the control */
    __contentElem : null,

    /** {ScrollIndicator} Instance of a ScrollIndicator used for horizontal indication */
    __horizontalScrollIndicator : null,

    /** {ScrollIndicator} Instance of a ScrollIndicator used for vertical indication */
    __verticalScrollIndicator : null,



    /*
    ---------------------------------------------------------------------------
      INTERNAL FIELDS :: STATUS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether a touch event sequence is in progress */
    __isTracking : false,

    /**
     * {Boolean} Whether the user has moved by such a distance
     * that we have enabled dragging mode. Hint: It's only enabled
     * after some pixels of movement to not interrupt with clicks etc.
     */
    __isDragging : false,

    /**
     * {Boolean} Not touching and dragging anymore, and smoothly animating the
     * touch sequence using deceleration
     */
    __isDecelerating : false,



    /*
    ---------------------------------------------------------------------------
      INTERNAL FIELDS :: PROPERTY SHORTHANDS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Cache field for same named property */
    __bounces : true,

    /** {Boolean} Cache field for same named property */
    __paging : false,

    /** {Boolean} Cache field for same named property */
    __enableScrollX : true,

    /** {Boolean} Cache field for same named property */
    __enableScrollY : true,

    /** {Boolean} Cache field for same named property */
    __showIndicatorX : true,

    /** {Boolean} Cache field for same named property */
    __showIndicatorY : true,



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
      INTERNAL FIELDS :: START POSITIONS
    ---------------------------------------------------------------------------
    */

    /** {Integer} Left scroll position at begin of touch sequence */
    __startScrollLeft : null,

    /** {Integer} Top scroll position at begin of touch sequence */
    __startScrollTop : null,

    /** {Integer} Left position of finger at start */
    __startTouchLeft : null,

    /** {Integer} Top position of finger at start */
    __startTouchTop : null,



    /*
    ---------------------------------------------------------------------------
      INTERNAL FIELDS :: DECELERATION SUPPORT
    ---------------------------------------------------------------------------
    */

    /** {Date} Timestamp of last move of finger. Used to limit tracking range for deleration speed. */
    __lastTouchMove : null,

    /** {Date} Timestamp of */
    __decelTrackingTime : null,

    /** {Integer} Left position at last segment of tracking */
    __decelTrackingTouchLeft : null,

    /** {Integer} Top position at last segment of tracking */
    __decelTrackingTouchTop : null,

    /** {Integer} Minimum left scroll position during deceleration */
    __minDecelScrollLeft : null,

    /** {Integer} Minimum top scroll position during deceleration */
    __minDecelScrollTop : null,

    /** {Integer} Maximum left scroll position during deceleration */
    __maxDecelScrollLeft : null,

    /** {Integer} Maximum top scroll position during deceleration */
    __maxDecelScrollTop : null,

    /** {Timeout} Pointer to timer used for deceleration animation */
    __decelTimer : null,

    /** {Date} Timestamp of last rendered frame */
    __lastFrame : null,

    /** {Number} Current factor to modify horizontal scroll position with on every step */
    __decelVelocityX : null,

    /** {Number} Current factor to modify vertical scroll position with on every step */
    __decelVelocityY : null,






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




    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {
      // Create root element
      var elem = document.createElement("div");
      elem.className = "scroll-view";

      // Add content element
      var contentElem = document.createElement("div");
      contentElem.className = "content";
      elem.appendChild(contentElem);
      this.__contentElem = contentElem;

      // Add scroll indicators
      var ScrollIndicator = unify.ui.ScrollIndicator;
      var indicatorX = this.__horizontalScrollIndicator = new ScrollIndicator("horizontal");
      elem.appendChild(indicatorX.getElement());
      var indicatorY = this.__verticalScrollIndicator = new ScrollIndicator("vertical");
      elem.appendChild(indicatorY.getElement());

      // Initialize properties
      this.__scrollTo(0, 0);

      // Add event listeners
      var Registration = qx.event.Registration;
      var root = document.documentElement;
      Registration.addListener(elem, "utouchstart", this.__onTouchStart, this);
      Registration.addListener(contentElem, "transitionEnd", this.__onTransitionEnd, this);
      Registration.addListener(root, "utouchmove", this.__onTouchMove, this);
      Registration.addListener(root, "utouchend", this.__onTouchEnd, this);
      Registration.addListener(root, "utouchcancel", this.__onTouchEnd, this);

      return elem;
    },


    // overridden
    getContentElement : function() {
      return this.__contentElem;
    },




    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyScrollMode : function(value)
    {
      this.__twoAxisScroll = this.getEnableScrollX() && this.getEnableScrollY() &&
        this.getShowIndicatorX() && this.getShowIndicatorY();
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

      var ScrollIndicator = unify.ui.ScrollIndicator;

      // Sum of margins substracted from the client size for computing the indicator size
      var margin = ScrollIndicator.DISTANCE * 2;
      if (this.__twoAxisScroll) {
        margin += ScrollIndicator.THICKNESS + ScrollIndicator.DISTANCE;
      }

      // Map size of indicator to size of content
      var size = Math.max(this.__minIndicatorLength, Math.round((clientSize / contentSize) * (clientSize - margin)));
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




    /*
    ---------------------------------------------------------------------------
      OFFSET PROPERTY METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Applies the scroll position to the content element
     *
     * @param left {Integer} Left scroll position
     * @param top {Integer} Top scroll position
     * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
     */
    __scrollTo : function(left, top, animate)
    {
      var oldLeft = this.__scrollLeft;
      var oldTop = this.__scrollTop;

      // Store values internally
      this.__scrollLeft = left;
      this.__scrollTop = top;

      // Round values, as done by the client to omit useless events and indicator updates
      var round = Math.round;
      left = round(left);
      top = round(top);

      var contentElem = this.__contentElem;
      var Style = qx.bom.element.Style;
      if (animate)
      {
        Style.set(contentElem, "transitionDuration", this.__pagingTransitionDuration);
        Style.set(contentElem, "transform", "translate3d(" + left + "px, " + top + "px, 0)");
      }
      else if (left != round(oldLeft) || top != round(oldTop))
      {
        Style.set(contentElem, "transform", "translate3d(" + left + "px, " + top + "px, 0)");

        if (this.__hasScrollListener) {
          this.fireEvent("scroll");
        }

        if (this.__enableScrollX && this.__showIndicatorX) {
          this.__updateScrollIndicator(this.__horizontalScrollIndicator, this.__clientWidth, this.__contentWidth, this.__scrollLeft);
        }

        if (this.__enableScrollY && this.__showIndicatorY) {
          this.__updateScrollIndicator(this.__verticalScrollIndicator, this.__clientHeight, this.__contentHeight, this.__scrollTop);
        }
      }
    },


    /**
     * Snaps the content element into the bounds of the client area. This makes sense as
     * soon as bounces or paging is enabled because these may result into the being rendered
     * outside the normal conditions.
     *
     * For paging we are flipping to the page which best matches the current position
     * (biggest overlay). For bouncing we normalize a position which is outside the content
     * boundaries e.g. user scrolls outside the content (begin & end) and we jump back
     * to put the content back into the client's area.
     *
     * @param animate {Boolean?false} Whether the snapping should happen animated or not
     */
    __snapIntoBounds : function(animate)
    {
      var scrollLeft = 0;
      var scrollTop = 0;

      var modified = false;

      var oldScrollLeft = this.__scrollLeft;
      var oldScrollTop = this.__scrollTop;

      if (this.__paging)
      {
        var clientWidth = this.__clientWidth;
        var clientHeight = this.__clientHeight;

        scrollLeft = Math.round(oldScrollLeft / clientWidth) * clientWidth;
        scrollTop = Math.round(oldScrollTop / clientHeight) * clientHeight;

        modified = true;
      }
      else if (this.__bounces)
      {
        scrollLeft = Math.min(Math.max(this.__minScrollLeft, oldScrollLeft), 0);
        scrollTop = Math.min(Math.max(this.__minScrollTop, oldScrollTop), 0);

        modified = scrollLeft != oldScrollLeft || scrollTop != oldScrollTop;
      }

      if (modified) {
        this.__scrollTo(scrollLeft, scrollTop, animate);
      }
    },


    /**
     * Snaps into bounds after recalculating client width and height
     * Usable for resize of window while paging
     */
    reflow : function()
    {
      var elem = this.getElement();
      var contentElem = this.__contentElem;
      this.__clientWidth = elem.clientWidth;
      this.__clientHeight = elem.clientHeight;
      this.__contentWidth = Math.max(this.__clientWidth, contentElem.offsetWidth);
      this.__contentHeight = Math.max(this.__clientHeight, contentElem.offsetHeight);
      this.__minScrollLeft = this.__clientWidth - this.__contentWidth;
      this.__minScrollTop = this.__clientHeight - this.__contentHeight;
      if(this.__isDecelerating){
        this.__isDecelerating=false;//stop it
        // Directly hide scroll indicators
        this.__horizontalScrollIndicator.setVisible(false);
        this.__verticalScrollIndicator.setVisible(false);
      }
      this.__snapIntoBounds(false);
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




    /*
    ---------------------------------------------------------------------------
      TOUCH EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Event listener for user initiated touchstart event
     *
     * @param ev {unify.event.type.Touch} Touch event object
     */
    __onTouchStart : function(ev)
    {
      // Already tracking? Multi finger gesture?
      if (this.__isTracking) {
        return;
      }

      // Resetting runtime flags
      this.__isTracking = true;
      this.__isDragging = false;

      // Shorthands for element access
      var elem = this.getElement();
      var contentElem = this.__contentElem;

      // Stop native event behavior when touching inside the ScrollView
      ev.preventDefault();
      
      // Immediately stop of types of animation/transition
      this.__isDecelerating = false;
      window.clearTimeout(this.__decelTimer);
      qx.bom.element.Style.set(contentElem, "transitionDuration", "0s");

      // Cache dimensions
      this.__clientWidth = elem.clientWidth;
      this.__clientHeight = elem.clientHeight;
      this.__contentWidth = Math.max(this.__clientWidth, contentElem.offsetWidth);
      this.__contentHeight = Math.max(this.__clientHeight, contentElem.offsetHeight);
      this.__minScrollLeft = this.__clientWidth - this.__contentWidth;
      this.__minScrollTop = this.__clientHeight - this.__contentHeight;

      // Cache property access
      this.__bounces = this.getBounces();
      this.__paging = this.getPaging();
      this.__enableScrollX = this.getEnableScrollX();
      this.__enableScrollY = this.getEnableScrollY();
      this.__showIndicatorX = this.getShowIndicatorX();
      this.__showIndicatorY = this.getShowIndicatorY();

      // Whether scroll event is needed
      // This is detected only once in a drag session to not
      // call the quite massive event system when not required
      this.__hasScrollListener = this.hasListener("scroll");
      
      // Whether snap event is needed
      // This is detected only once in a drag session to not
      // call the quite massive event system when not required
      this.__hasSnapListener = this.hasListener("snap");

      // Do an initial correction, in most cases does not modify anything
      this.__snapIntoBounds(false);

      // Store positions of scrolling/finger at start
      this.__startScrollLeft = this.__scrollLeft;
      this.__startScrollTop = this.__scrollTop;
      this.__startTouchLeft = ev.getDocumentLeft();
      this.__startTouchTop = ev.getDocumentTop();

      // Last event time and position at this time
      this.__decelTrackingTime = ev.getTimeStamp();
      this.__decelTrackingTouchLeft = this.__scrollLeft;
      this.__decelTrackingTouchTop = this.__scrollTop;
    },


    /**
     * Event listener for user initiated touchmove event
     *
     * @param ev {unify.event.type.Touch} Touch event object
     */
    __onTouchMove : function(ev)
    {
      // Ignore event when tracking is not enabled (no touchstart event on element)
      // This is required as this listener ("touchmove") sits on the document and not on the element itself.
      if (!this.__isTracking) {
        return;
      }

      // Prepare commonly used data
      var moveX = ev.getDocumentLeft() - this.__startTouchLeft;
      var moveY = ev.getDocumentTop() - this.__startTouchTop;

      // Are we already is dragging mode?
      if (this.__isDragging)
      {
        // Event is processed. Stop others from doing it again.
        ev.stopPropagation();

        var scrollLeft, scrollTop;

        if (this.__enableScrollX)
        {
          scrollLeft = this.__startScrollLeft + moveX;
          var minScrollLeft = this.__minScrollLeft;

          // Whether we slow down on the edges or just cut on these limits
          if (this.__bounces) {
            scrollLeft -= ((scrollLeft < minScrollLeft) ? (scrollLeft - minScrollLeft) : ((scrollLeft > 0) ? scrollLeft : 0)) / 2;
          } else {
            scrollLeft = Math.min(Math.max(minScrollLeft, scrollLeft), 0);
          }
        }
        else
        {
          // Keep position
          scrollLeft = this.__scrollLeft;
        }

        if (this.__enableScrollY)
        {
          scrollTop = this.__startScrollTop + moveY;
          var minScrollTop = this.__minScrollTop;

          // Whether we slow down on the edges or just cut on these limits
          if (this.__bounces) {
            scrollTop -= ((scrollTop < minScrollTop) ? (scrollTop - minScrollTop) : ((scrollTop > 0) ? scrollTop : 0)) / 2;
          } else {
            scrollTop = Math.min(Math.max(minScrollTop, scrollTop), 0);
          }
        }
        else
        {
          // Keep position
          scrollTop = this.__scrollTop;
        }

        // Sync scroll position
        this.__scrollTo(scrollLeft, scrollTop);

        // Remember timestamp of last move
        this.__lastTouchMove = ev.getTimeStamp();

        // Only the last segment of the move is respected for deceleration
        if ((this.__lastTouchMove - this.__decelTrackingTime) > this.__maxTrackingTime)
        {
          this.__decelTrackingTime = this.__lastTouchMove;
          this.__decelTrackingTouchLeft = scrollLeft;
          this.__decelTrackingTouchTop = scrollTop;
        }
      }

      // Otherwise found out whether we are switching into dragging mode now.
      else if ((this.__enableScrollX && Math.abs(moveX) >= this.__minimumTrackingForDrag) || (this.__enableScrollY && Math.abs(moveY) >= this.__minimumTrackingForDrag))
      {
        // Enable dragging (live manipulation of scroll position by the user)
        this.__isDragging = true;

        // Ignore first movement and start at zero as soon as we pass over the minimum tracking offset
        // This somehow torpedates the naming with "start" in front :)
        this.__startTouchLeft = ev.getDocumentLeft();
        this.__startTouchTop = ev.getDocumentTop();

        // Display scroll indicators as soon as we touch and the content is bigger than the container
        if (this.__enableScrollX && this.__showIndicatorX) {
          this.__horizontalScrollIndicator.setVisible(true);
        }

        if (this.__enableScrollY && this.__showIndicatorY) {
          this.__verticalScrollIndicator.setVisible(true);
        }
      }
    },


    /**
     * Event listener for user initiated touchend event
     *
     * @param ev {unify.event.type.Touch} Touch event object
     */
    __onTouchEnd : function(ev)
    {
      // Ignore event when tracking is not enabled (no touchstart event on element)
      // This is required as this listener ("touchmove") sits on the document and not on the element itself.
      if (!this.__isTracking) {
        return;
      }

      // Not touching anymore
      this.__isTracking = false;

      // Be sure to reset the dragging flag now. Here we also detect whether
      // the finger has moved fast enough to switch into a deceleration animation.
      if (this.__isDragging)
      {
        // Disable dragging
        this.__isDragging = false;

        // As we have processed the event here it should
        // not be of interest for other components
        ev.stopPropagation();

        // Start deceleration
        if (this.getAnimated() && (ev.getTimeStamp() - this.__lastTouchMove) <= this.__maxTrackingTime) {
          this.__startAnimation(ev);
        }
      }
      else
      {
        // Click on natively focusable element
        var target = ev.getTarget();
        if (document.activeElement != target && target.tabIndex == 0) {
          target.focus();
        }
      }

      // If this was a slower move it is per default non delerated, but this
      // still means that we want snap back to the bounds which is done here.
      // This is placed outside the condition above to improve edge case stability
      // e.g. touchend fired without enabled dragging. This should normally do not
      // have modified the scroll positions or even showed the scrollbars.
      if (!this.__isDecelerating)
      {
        // Snap back using animations
        this.__snapIntoBounds(this.getAnimated());

        // Fade out the scroll indicators
        this.__horizontalScrollIndicator.setVisible(false);
        this.__verticalScrollIndicator.setVisible(false);
      }
    },


    /**
     * Event listener for transition end event on the content element.
     *
     * This method is called after the content was snapped back into the boundaries.
     *
     * @param ev {qx.event.type.Event} Event object
     */
    __onTransitionEnd : function(ev)
    {
      // Disable transition on content element
      qx.bom.element.Style.set(this.__contentElem, "transitionDuration", "0s");

      // Now, fire the scroll event
      if (this.__hasScrollListener) {
        this.fireEvent("scroll");
      }
      
      // fire snap event
      if (this.__hasSnapListener) {
        this.fireEvent("snap");
      }
    },





    /*
    ---------------------------------------------------------------------------
      ANIMATION (DECELERATION) SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Called when a touch sequence end and the speed of the finger was high enough
     * to switch into deceleration mode.
     *
     * @param ev {unify.event.type.Touch} Touch event object
     */
    __startAnimation : function(ev)
    {
      // Compute distance based on time difference and acceleration
      var steps = (ev.getTimeStamp() - this.__decelTrackingTime) / this.__acceleration;

      // Compute velocity based on time difference and distance
      this.__decelVelocityX = (this.__scrollLeft - this.__decelTrackingTouchLeft) / steps;
      this.__decelVelocityY = (this.__scrollTop - this.__decelTrackingTouchTop) / steps;

      // Copy over minimum scroll positions
      // This might be modified afterwards when paging is enabled
      this.__minDecelScrollLeft = this.__minScrollLeft;
      this.__minDecelScrollTop = this.__minScrollTop;

      // Same for max values, but the limit is here zero.
      this.__maxDecelScrollLeft = 0;
      this.__maxDecelScrollTop = 0;

      // Check whether we have paging enabled
      if (this.__paging)
      {
        var scrollLeft = this.__scrollLeft,
            scrollTop = this.__scrollTop,
            clientWidth = this.__clientWidth,
            clientHeight = this.__clientHeight;

        this.__minDecelScrollLeft = Math.max(this.__minScrollLeft, Math.floor(scrollLeft / clientWidth) * clientWidth);
        this.__minDecelScrollTop = Math.max(this.__minScrollTop, Math.floor(scrollTop / clientHeight) * clientHeight);
        this.__maxDecelScrollLeft = Math.min(0, Math.ceil(scrollLeft / clientWidth) * clientWidth);
        this.__maxDecelScrollTop = Math.min(0, Math.ceil(scrollTop / clientHeight) * clientHeight);
      }




      //
      // INITIATE ANIMATION
      //

      // Check wether we have enough velocity to start into animation mode
      var minimumVelocity = this.__paging ? this.__minVelocityForDecelerationWithPaging : this.__minVelocityForDeceleration;
      if (Math.abs(this.__decelVelocityX) > minimumVelocity || Math.abs(this.__decelVelocityY) > minimumVelocity)
      {
        // Enable deceleration flag
        this.__isDecelerating = true;

        // Point of rendering last frame is now
        this.__lastFrame = new Date();

        // Initiate first animation step after a timeout
        this.__decelTimer = qx.lang.Function.delay(this.__stepThroughAnimation, this.__desiredAnimationFrameRate, this);
      }
    },


    /**
     * Called on every step of the animation
     *
     * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
     */
    __stepThroughAnimation : function(inMemory)
    {
      // Disable if deceleration has been stopped somehow already
      if (!this.__isDecelerating) {
        return;
      }

      // Get current date
      var now = new Date();


      //
      // SUPPORT OF SKIPPED FRAMES (UNDER HIGH CPU CONDITIONS)
      //

      // For the current rendering to apply let's update omitted steps in memory first
      if (!inMemory)
      {
        var droppedFrames = Math.round((now - this.__lastFrame) / this.__desiredAnimationFrameRate) - 1;
        for (var j=0; j<droppedFrames; j++) {
          this.__stepThroughAnimation(true);
        }
      }



      //
      // COMPUTE NEXT SCROLL POSITION
      //

      // Add deceleration to scroll position
      var scrollLeft = this.__scrollLeft + this.__decelVelocityX;
      var scrollTop = this.__scrollTop + this.__decelVelocityY;


      //
      // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
      //

      if (!this.__bounces)
      {
        var scrollLeftFixed = Math.min(Math.max(this.__minScrollLeft, scrollLeft), 0);
        if (scrollLeftFixed != scrollLeft)
        {
          scrollLeft = scrollLeftFixed;
          this.__decelVelocityX = 0;
        }

        var scrollTopFixed = Math.min(Math.max(this.__minScrollTop, scrollTop), 0);
        if (scrollTopFixed != scrollTop)
        {
          scrollTop = scrollTopFixed;
          this.__decelVelocityY = 0;
        }
      }


      //
      // UPDATE SCROLL POSITION
      //

      if (inMemory)
      {
        // In memory update of data without applying
        this.__scrollLeft = scrollLeft;
        this.__scrollTop = scrollTop;
      }
      else
      {
        this.__scrollTo(scrollLeft, scrollTop);
      }


      //
      // SLOW DOWN
      //

      if (!this.__paging)
      {
        // Slow down velocity on every iteration
        this.__decelVelocityX *= this.__decelerationFrictionFactor;
        this.__decelVelocityY *= this.__decelerationFrictionFactor;
      }


      //
      // TEST FOR ABILITY TO FINISH ANIMATION RIGHT NOW
      //

      // Find out whether we are still moving fast enough to show scroll indicators
      // and also, if they are not visible anymore, if we are fast enough to still
      // do the deceleration
      // Hint: reducing by percents would really slowly reach zero and we try to
      // stop as soon as the movement is not user detectable anymore
      if (!inMemory)
      {
        var absVelocityX = Math.abs(this.__decelVelocityX);
        var absVelocityY = Math.abs(this.__decelVelocityY);

        if (absVelocityX <= this.__minVelocityToHideScrollIndicators && absVelocityY <= this.__minVelocityToHideScrollIndicators)
        {
          // Directly hide scroll indicators
          this.__horizontalScrollIndicator.setVisible(false);
          this.__verticalScrollIndicator.setVisible(false);
          
          // Detect whether it's still worth to continue animating steps
          // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
          if (absVelocityX <= this.__minVelocity && absVelocityY <= this.__minVelocity)
          {
            this.__isDecelerating = false;
            // fire snap event
            if (this.__hasSnapListener) {
              this.fireEvent("snap");
            }
            return;
          }
        }
      }


      //
      // SCHEDULE NEXT ITERATION
      //

      if (!inMemory) {
        this.__decelTimer = qx.lang.Function.delay(this.__stepThroughAnimation, this.__desiredAnimationFrameRate, this);
      }


      //
      // BOUNCING SUPPORT
      //

      if (this.__bounces)
      {
        var scrollOutsideX = 0;
        var scrollOutsideY = 0;

        // Check limits
        if (scrollLeft < this.__minDecelScrollLeft) {
          scrollOutsideX = this.__minDecelScrollLeft - scrollLeft;
        } else if (scrollLeft > this.__maxDecelScrollLeft) {
          scrollOutsideX = this.__maxDecelScrollLeft - scrollLeft;
        }

        if (scrollTop < this.__minDecelScrollTop) {
          scrollOutsideY = this.__minDecelScrollTop - scrollTop;
        } else if (scrollTop > this.__maxDecelScrollTop) {
          scrollOutsideY = this.__maxDecelScrollTop - scrollTop;
        }

        // Tweak deceleration to bounce back
        var acceleration = this.__penetrationAcceleration;
        var deceleration = this.__paging ? this.__penetrationDecelerationWithPaging : this.__penetrationDeceleration;
        if (scrollOutsideX != 0)
        {
          // Slow down until slow enough, then flip back to snap position
          if (scrollOutsideX * this.__decelVelocityX <= 0) {
            this.__decelVelocityX += scrollOutsideX * deceleration;
          } else {
            this.__decelVelocityX = scrollOutsideX * acceleration;
          }
        }

        if (scrollOutsideY != 0)
        {
          // Slow down until slow enough, then flip back to snap position
          if (scrollOutsideY * this.__decelVelocityY <= 0) {
            this.__decelVelocityY += scrollOutsideY * deceleration;
          }  else {
            this.__decelVelocityY = scrollOutsideY * acceleration;
          }
        }
      }



      //
      // REMEMBER POINT OF LAST RENDERING
      //

      if (!inMemory) {
        this.__lastFrame = now;
      }
    }
  }
});
