/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Generic widget that depends on a slighly modified qooxdoo LayoutItem
 * This is the base of every widget in the unify widget system
 *
 * Heavily influenced by qooxdoo widget class
 */
/*
#use(unify.ui.core.EventHandler)
*/
qx.Class.define("unify.ui.core.Widget", {
  extend : qx.ui.core.LayoutItem,
  
  /**
   * @param layout {qx.ui.layout.Abstract} Layout of widget
   */
  construct : function() {
    this.base(arguments);
    
    this.__renderLayoutDone = false;
    
    this.__initializeSizing();
    this.__element = this.__createElement();
  },
  
  events : {
    /**
     * Fired on resize of the widget.
     */
    resize : "qx.event.type.Event",
    
    /**
     * Fired on move of the widget.
     */
    move : "qx.event.type.Event",
    
    /** Fired if a touch at the screen is started. */
    touchstart : "qx.event.type.Touch",

    /** Fired if a touch at the screen has ended. */
    touchend : "qx.event.type.Touch",
    
    /** Fired if a touch at the screen is started. */
    touchleave : "qx.event.type.Touch",

    /** Fired if a touch at the screen has ended. */
    touchrelease : "qx.event.type.Touch",

    /** Fired during a touch at the screen. */
    touchmove : "qx.event.type.Touch",

    /** Fired if a touch at the screen is canceled. */
    touchcancel : "qx.event.type.Touch",

    /** Fired when a finger taps on the screen. */
    tap : "qx.event.type.Touch",
    
    /** Fired if widget is focusable {@link #focusable} and gets focus */
    focus : "qx.event.type.Focus",

    /** Fired if widget is focusable {@link #focusable} and looses focus */
    blur : "qx.event.type.Focus"
  },
  
  properties : {
    /**
     * Controls the visibility. Valid values are:
     *
     * <ul>
     *   <li><b>visible</b>: Render the widget</li>
     *   <li><b>hidden</b>: Hide the widget but don't relayout the widget's parent.</li>
     *   <li><b>excluded</b>: Hide the widget and relayout the parent as if the
     *     widget was not a child of its parent.</li>
     * </ul>
     */
    visibility : {
      check : ["visible", "hidden", "excluded"],
      init : "visible",
      apply : "_applyVisibility",
      event : "changeVisibility"
    },
    
    /**
     * Appearance ID of widget used by theme system
     */
    appearance : {
      init : null,
      apply : "_applyAppearance"
    },
    
    /**
     * Parent's inset to apply to child
     */
    parentInset : {
      init : null
    },
    
    /**
     * Whether the widget is enabled. Disabled widgets are usually grayed out
     * and do not process user created events. While in the disabled state most
     * user input events are blocked. Only the {@link #mouseover} and
     * {@link #mouseout} events will be dispatched.
     */
    enabled :
    {
      check : "Boolean",
      inheritable : true,
      apply : "_applyEnabled",
      event : "changeEnabled",
      init : true
    },
    
    /**
     * Defines the tab index of an widget. If widgets with tab indexes are part
     * of the current focus root these elements are sorted in first priority. Afterwards
     * the sorting continues by rendered position, zIndex and other criteria.
     *
     * Please note: The value must be between 1 and 32000.
     */
    tabIndex :
    {
      check : "Integer",
      nullable : true,
      apply : "_applyTabIndex"
    },
    
    /**
     * Whether the widget is focusable e.g. rendering a focus border and visualize
     * as active element.
     *
     * See also {@link #isTabable} which allows runtime checks for
     * <code>isChecked</code> or other stuff to test whether the widget is
     * reachable via the TAB key.
     */
    focusable :
    {
      check : "Boolean",
      init : false,
      apply : "_applyFocusable"
    }
  },
  
  statics : {
    /**
     * Returns the widget, which contains the given DOM element.
     *
     * @param element {Element} The DOM element to search the widget for.
     * @param considerAnonymousState {Boolean?false} If true, anonymous widget
     *   will not be returned.
     * @return {qx.ui.core.Widget} The widget containing the element.
     */
    getByElement : function(element, considerAnonymousState) {
      while(element) {
        var widgetKey = element.$$widget;

        // dereference "weak" reference to the widget.
        if (widgetKey != null) {
          var widget = qx.core.ObjectRegistry.fromHashCode(widgetKey);
          // check for anonymous widgets
          if (!considerAnonymousState || !widget.getAnonymous()) {
            return widget;
          }
        }

        // Fix for FF, which occasionally breaks (BUG#3525)
        try {
          element = element.parentNode;
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  },
  
  members: {
    /** {Map} Padding of element */
    __padding : null,
    
    /** {Map} Border size of element */
    __border : null,
    
    /** {Boolean} Widget has valid rendered layout */
    __renderLayoutDone : null,
    
    /**
     * Initializes padding and border size to zero
     */
    __initializeSizing : function() {
      this.__padding = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
      this.__border = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
    },
    
    // property apply
    _applyVisibility : function(value, old)
    {
      var container = this.getElement();
      var Style = qx.bom.element.Style;
      

      if (value === "visible") {
        Style.set(container, "display", "block"); // TODO: Block right? or simply null?
      } else {
        Style.set(container, "display", "none");
      }

      // only force a layout update if visibility change from/to "exclude"
      var parent = this.$$parent;
      if (parent && (old == null || value == null || old === "excluded" || value === "excluded")) {
        parent.invalidateLayoutChildren();
      }

      // Update visibility cache
      qx.ui.core.queue.Visibility.add(this);
    },
    
    /**
     * Apply navigation on element
     *
     * @deprecated
     * @param value {Map[]} Navigation object
     */
    _applyNavigation : function(value) {
      if (value && this._hasElement()) {
        this.__applyNavigation(this.getElement(), value);
      }
    },
    
    /**
     * Apply navigation on element
     *
     * @deprecated
     * @param element {Element} DOM element to apply navigation upon
     * @param map {Map[]} Navigation object
     */
    __applyNavigation : function(element, map) {
      for (var key in map) {
        var value = map[key];
        element.setAttribute(key, value);
      }
    },
    
    // overridden
    _applyAppearance : function() {
      this.updateAppearance();
    },
    
    // property apply
    _applyEnabled : function(value, old)
    {
      if (value===false)
      {
        this.addState("disable");

        // hovered not configured in widget, but as this is a
        // standardized name in qooxdoo and we never want a hover
        // state for disabled widgets, remove this state everytime
        this.removeState("hover");

        // Blur when focused
        if (this.isFocusable()) {
          // Remove focused state
          this.removeState("active");

          // Remove tabIndex
          this._applyFocusable(false, true);
        }
/*
        // Remove draggable
        if (this.isDraggable()) {
          this._applyDraggable(false, true);
        }

        // Remove droppable
        if (this.isDroppable()) {
          this._applyDroppable(false, true);
        }*/
      }
      else
      {
        this.removeState("disable");

        // Re-add tabIndex
        if (this.isFocusable()) {
          this._applyFocusable(true, false);
        }
/*
        // Re-add draggable
        if (this.isDraggable()) {
          this._applyDraggable(true, false);
        }

        // Re-add droppable
        if (this.isDroppable()) {
          this._applyDroppable(true, false);
        }*/
      }
    },
    
    _applyTabIndex : function(value)
    {
      if (value == null) {
        value = 1;
      } else if (value < 1 || value > 32000) {
        throw new Error("TabIndex property must be between 1 and 32000");
      }
      
      this.setAttribute("tabIndex", value);
    },
    
    _applyFocusable : function(value, old)
    {
      if (value) {
        var tabIndex = this.getTabIndex();
        if (tabIndex == null) {
          tabIndex = 1;
        }

        this.setAttribute("tabIndex", tabIndex);
      } else if (old) {
        this.setAttribute("tabIndex", null);
      }
    },
    
    /**
     * Adds focus to element
     */
    tabFocus : function() {
      this.addState("active");
    },
    
    /**
     * Removes focus from element
     */
    tabBlur : function() {
      this.removeState("active");
    },
  
    __layoutManager : null,
    
    _getLayout : function() {
      return this.__layoutManager;
    },
    
    /**
     * Set a layout manager for the widget. A a layout manager can only be connected
     * with one widget. Reset the connection with a previous widget first, if you
     * like to use it in another widget instead.
     *
     * @param layout {qx.ui.layout.Abstract} The new layout or
     *     <code>null</code> to reset the layout.
     */
    _setLayout : function(layout) {
      if (qx.core.Environment.get("qx.debug")) {
        if (layout) {
          this.assertInstance(layout, qx.ui.layout.Abstract);
        }
      }
      
      if (this.__layoutManager) {
        this.__layoutManager.connectToWidget(null);
      }
      
      if (layout) {
        layout.connectToWidget(this);
      }
      
      this.__layoutManager = layout;
      qx.ui.core.queue.Layout.add(this);
    },
    
    /**
     * Returns the recommended / natural dimension of the widget's content
     *
     * @return {Map} Size hint
     */
    _getContentHint : function() {
      var layout = this.__layoutManager;
      if (layout) {
        if (this.hasLayoutChildren()) {
          var hint = layout.getSizeHint();
          
          if (!hint) {
            return {
              width: 0,
              height: 0
            };
          }
          /*if (qx.core.Environment.get("qx.debug")) {
            var msg = "The layout " + layout.toString() + " of the widget " + this.toString() + " returned an invalid size hint!";
            this.assetInteger(hint.width, "Wrong width value. " + msg);
            this.assetInteger(hint.height, "Wrong height value. " + msg);
          }*/
          
          return hint;
        } else {
          return {
            width: 0,
            height: 0
          };
        }
      } else {
        return {
          width: 100,
          height: 50
        };
      }
    },
    
    // overridden
    _computeSizeHint : function()
    {
      // Start with the user defined values
      var width = this.getWidth();
      var minWidth = this.getMinWidth();
      var maxWidth = this.getMaxWidth();

      var height = this.getHeight();
      var minHeight = this.getMinHeight();
      var maxHeight = this.getMaxHeight();

      if (qx.core.Environment.get("qx.debug"))
      {
        if (minWidth !== null && maxWidth !== null) {
          this.assert(minWidth <= maxWidth, "minWidth is larger than maxWidth!");
        }
        if (minHeight !== null && maxHeight !== null) {
          this.assert(minHeight <= maxHeight, "minHeight is larger than maxHeight!");
        }
      }

      var border = this.__border;
      var padding = this.__padding;
      var insetX = border.left + border.right + padding.left + padding.right;
      var insetY = border.top + border.bottom + padding.top + padding.bottom;

      var contentHint = {};
      if (width == null || height == null) {
        // Ask content
        contentHint = this._getContentHint();
        
        if (width == null) {
          width = contentHint.width + insetX;
        }
        if (height == null) {
          height = contentHint.height + insetY;
        }
      }

      if (minWidth == null)
      {
        minWidth = insetX;

        if (contentHint.minWidth != null) {
          minWidth += contentHint.minWidth;
        }
      }

      if (minHeight == null)
      {
        minHeight = insetY;

        if (contentHint.minHeight != null) {
          minHeight += contentHint.minHeight;
        }
      }

      if (maxWidth == null)
      {
        if (contentHint.maxWidth == null) {
          maxWidth = Infinity;
        } else {
          maxWidth = contentHint.maxWidth + insetX;
        }
      }

      if (maxHeight == null)
      {
        if (contentHint.maxHeight == null) {
          maxHeight = Infinity;
        } else {
          maxHeight = contentHint.maxHeight + insetY;
        }
      }


      // Build size hint and return
      return {
        width : width,
        minWidth : minWidth,
        maxWidth : maxWidth,
        height : height,
        minHeight : minHeight,
        maxHeight : maxHeight
      };
    },


    /*
    ---------------------------------------------------------------------------
      APPEARANCE SUPPORT
    ---------------------------------------------------------------------------
    */

    /** {String} The currently compiled selector to lookup the matching appearance */
    __appearanceSelector : null,


    /** {Boolean} Whether the selectors needs to be recomputed before updating appearance */
    __updateSelector : null,


    /**
     * Renders the appearance using the current widget states.
     */
    syncAppearance : function()
    {
      var manager = qx.theme.manager.Appearance.getInstance();
      var states = this.__states;
      var selector = this.__appearanceSelector;
      var oldStyle, newStyle, key;

      // Check for requested selector update
      if (this.__updateSelector) {
        // Clear flag
        this.__updateSelector = false;

        // Check if the selector was created previously
        if (selector) {
          // Query old style
          oldStyle = manager.styleFrom(selector, states, null, this.getAppearance());

          // Clear current selector (to force recompute)
          selector = null;
        }
      }

      // Build selector
      if (!selector) {
        selector = this.__appearanceSelector = this.getAppearance();
        if (!selector) {
          this.warn("No appearance set on " + this);
          return;
        }
      }

      // Query current selector
      newStyle = manager.styleFrom(selector, states, null, this.getAppearance());

      if (newStyle) {
        if (oldStyle) {
          var oldStyleData = {};
          for (key in oldStyle) {
            if (newData[key] === undefined) {
              oldStyleData[key] = undefined;
            }
          }
          this._setStyle(oldStyleData);
        }
        this._setStyle(newStyle);
        
      } else if (oldStyle) {
        var styleData = {};
        for (key in oldStyle) {
          styleData[key] = undefined;
        }
        this._setStyle(styleData);
      }

      this.fireDataEvent("syncAppearance", this.__states);
    },

    /**
     * Updates appearance of widget
     */
    updateAppearance : function() {
      // Clear selector
      this.__updateSelector = true;

      // Add to appearance queue
      qx.ui.core.queue.Appearance.add(this);
    },

    /**
     * Checks if appearance need to be applied to widget
     */
    checkAppearanceNeeds : function() {
      // CASE 1: Widget has never got an appearance already because it was never
      // visible before. Normally add it to the queue is the easiest way to update it.
      if (!this.__initialAppearanceApplied)
      {
        qx.ui.core.queue.Appearance.add(this);
        this.__initialAppearanceApplied = true;
      }

      // CASE 2: Widget has got an appearance before, but was hidden for some time
      // which results into maybe omitted state changes have not been applied.
      // In this case the widget is already queued in the appearance. This is basically
      // what all addState/removeState do, but the queue itself may not have been registered
      // to be flushed
      else if (this.$$stateChanges)
      {
        qx.ui.core.queue.Appearance.add(this);
        delete this.$$stateChanges;
      }
    },
    
    
    
    
    
    

    __dimensionInfo : null,

    /**
     * Returns information of position of widget
     *
     * @return {Map[]} Returns left and top position and width and height of widget
     */
    getPositionInfo : function() {
      var e = this.getElement();
      
      var pos = qx.bom.element.Location.get(e);
      var dim = this.__dimensionInfo || qx.bom.element.Dimension.getSize(e);
      
      return {
        left: pos.left,
        top: pos.top,
        width: dim.width,
        height: dim.height,
        padding: this.__padding,
        border: this.__border
      };
    },
    
    /**
     * Returns if widget is layouted
     *
     * @return {Boolean} Widget is layouted
     */
    hasRenderedLayout : function() {
      return !!this.__renderLayoutDone;
    },
    
    /**
     * Render method to apply layout on widget
     *
     * @param left {Integer} Left absolute position of widget
     * @param top {Integer} Top absolute position of widget
     * @param width {Integer} Width of widget
     * @param height {Integer} Height of widget
     * @param preventSize {Boolean?null} Prevent size of widget and ignore layout hints, use with care!
     */
    renderLayout : function(left, top, width, height, preventSize) {
      this.__dimensionInfo = {
        width: width,
        height: height
      };
      var changes = this.base(arguments, left, top, width, height);

      if(!changes) {
        return;
      }

      var parentInset = this.getParentInset();
      if(parentInset) {
        left += parentInset[0];
        top += parentInset[1];
      }
      if (!preventSize) {
        qx.bom.element.Style.setStyles(this.getElement(), {
          left: left + "px",
          top: top + "px",
          width: width + "px",
          height: height + "px"
        });
      }

      if (this._hasChildren()) {
        var padding = this.__padding;
        var border = this.__border;
        
        var innerWidth = width - (padding.left + padding.right) - (border.left + border.right);
        var innerHeight = height - (padding.top + padding.bottom) - (border.top + border.bottom);

        var children = this._getChildren();
        if (children) {
          for (var i=0,ii=children.length; i<ii; i++) {
            children[i].setParentInset([padding.left, padding.top]);
          }
        }

        if (this.__layoutManager && this.hasLayoutChildren()) {
          this.__layoutManager.renderLayout(innerWidth, innerHeight);
        } else if (this.hasLayoutChildren()) {
          throw new Error("No layout in " + this);
        }
      }
      // Fire events
      if (changes.position && this.hasListener("move")) {
        this.fireEvent("move");
      }
      if (changes.size && this.hasListener("resize")) {
        this.fireEvent("resize");
      }
      
      this.__renderLayoutDone = true;
    },

    /**
     * Returns content element to add children to
     *
     * @return {Element} DOM element
     */
    getContentElement : function() {
      return this.getElement();
    },
    
    /**
     * Renders all children of this widget
     */
    renderChildren : function() {
      /*var children = this._getChildren();
      if (children) {
        var fragment = document.createDocumentFragment();
        for (var i=0,ii=children.length; i<ii; i++) {
          var child = children[i];
          child.renderChildren();
          fragment.appendChild(child.getElement());
        }
        
        this.getContentElement().appendChild(fragment);
      }*/
    },
    
    /**
     * Returns whether the layout has children, which are layout relevant. This
     * excludes all widgets, which have a {@link qx.ui.core.Widget#visibility}
     * value of <code>exclude</code>.
     *
     * @return {Boolean} Whether the layout has layout relevant children
     */
    hasLayoutChildren : function() {
      var children = this.__widgetChildren;
      if (!children) {
        return false;
      }
      
      var child;
      for (var i=0,ii=children.length; i<ii; i++) {
        child = children[i];
        if (!child.hasUserBounds() && !child.isExcluded()) {
          return true;
        }
      }
    },
    
    /**
     * {Array} Placeholder for children list in empty widgets.
     *     Mainly to keep instance number low.
     *
     * @lint ignoreReferenceField(__emptyChildren)
     */
    __emptyChildren : [],
    
    /**
     * Returns all children, which are layout relevant. This excludes all widgets,
     * which have a {@link qx.ui.core.Widget#visibility} value of <code>exclude</code>.
     *
     * @internal
     * @return {qx.ui.core.Widget[]} All layout relevant children.
     */
    getLayoutChildren : function()
    {
      var children = this.__widgetChildren;
      if (!children) {
        return this.__emptyChildren;
      }

      var layoutChildren;
      for (var i=0, l=children.length; i<l; i++)
      {
        var child = children[i];
        if (child.hasUserBounds() || child.isExcluded())
        {
          if (layoutChildren == null) {
            layoutChildren = children.concat();
          }

          qx.lang.Array.remove(layoutChildren, child);
        }
      }

      return layoutChildren || children;
    },


    /**
     * Marks the layout of this widget as invalid and triggers a layout update.
     * This is a shortcut for <code>qx.ui.core.queue.Layout.add(this);</code>.
     */
    scheduleLayoutUpdate : function() {
      qx.ui.core.queue.Layout.add(this);
    },


    /**
     * Resets the cache for children which should be laid out.
     */
    invalidateLayoutChildren : function()
    {
      var layout = this.__layoutManager;
      if (layout) {
        layout.invalidateChildrenCache();
      }

      qx.ui.core.queue.Layout.add(this);
    },


    /*
    ---------------------------------------------------------------------------
      VISIBILITY API
    ---------------------------------------------------------------------------
    */

    /**
     * Shows the widgets.
     *
     * @return {void}
     */
    show : function() {
      this.setVisibility("visible");
    },


    /**
     * Hides the widget.
     */
    hide : function() {
      this.setVisibility("hidden");
    },


    /**
     * Excludes the widget
     */
    exclude : function() {
      this.setVisibility("excluded");
    },


    /**
     * Returns if the widget is visible.
     *
     * @return {Boolean} Returns true if the widget is visible.
     */
    isVisible : function() {
      return this.getVisibility() == "visible";
    },


    /**
     * Returns if the widget is not visible (hidden or excluded).
     * 
     * @return {Boolean} Returns true if the widget is not visible.
     */
    isHidden : function() {
      return this.getVisibility() != "visible";
    },


    /**
     * Returns if the widget is excluded from the rendering queue.
     *
     * @return {Boolean} Returns true if the widget is excluded.
     */
    isExcluded : function() {
      return this.getVisibility() == "excluded";
    },









    /*
    ---------------------------------------------------------------------------
      STATE HANDLING
    ---------------------------------------------------------------------------
    */

    /** {Map} The current widget states */
    __states : null,


    /** {Boolean} Whether the widget has state changes which are not yet queued */
    $$stateChanges : null,


    /** {Map} Can be overridden to forward states to the child controls. */
    _forwardStates : null,


    /**
     * Returns whether a state is set.
     *
     * @param state {String} the state to check.
     * @return {Boolean} whether the state is set.
     */
    hasState : function(state)
    {
      var states = this.__states;
      return !!states && !!states[state];
    },


    /**
     * Sets a state.
     *
     * @param state {String} The state to add
     * @return {void}
     */
    addState : function(state)
    {
      // Dynamically create state map
      var states = this.__states;
      if (!states) {
        states = this.__states = {};
      }

      if (states[state]) {
        return;
      }

      // Add state and queue
      this.__states[state] = true;

      // Fast path for hovered state
      if (!qx.ui.core.queue.Visibility.isVisible(this)) {
        this.$$stateChanges = true;
      } else {
        qx.ui.core.queue.Appearance.add(this);
      }
    },


    /**
     * Clears a state.
     *
     * @param state {String} the state to clear.
     * @return {void}
     */
    removeState : function(state)
    {
      // Check for existing state
      var states = this.__states;
      if (!states || !states[state]) {
        return;
      }
      
      // Clear state and queue
      delete this.__states[state];

      // Fast path for hovered state
      if (!qx.ui.core.queue.Visibility.isVisible(this)) {
        this.$$stateChanges = true;
      } else {
        qx.ui.core.queue.Appearance.add(this);
      }
    },


    /**
     * Replaces the first state with the second one.
     *
     * This method is ideal for state transitions e.g. normal => selected.
     *
     * @param old {String} Previous state
     * @param value {String} New state
     * @return {void}
     */
    replaceState : function(old, value)
    {
      var states = this.__states;
      if (!states) {
        states = this.__states = {};
      }

      if (!states[value]) {
        states[value] = true;
      }

      if (states[old]) {
        delete states[old];
      }

      if (!qx.ui.core.queue.Visibility.isVisible(this)) {
        this.$$stateChanges = true;
      } else {
        qx.ui.core.queue.Appearance.add(this);
      }
    },




    /*
    ---------------------------------------------------------------------------
      FOCUS SYSTEM USER ACCESS
    ---------------------------------------------------------------------------
    */

    /**
     * Focus this widget.
     *
     * @return {void}
     */
    focus : function()
    {
      this.getContentElement().focus();
    },


    /**
     * Remove focus from this widget.
     *
     * @return {void}
     */
    blur : function()
    {
      this.getContentElement().blur();
    },
    
    
    








    __style : null,
    __font : null,

    /**
     * Set styles to the element
     * @param map {Map} Map of styles/values to apply
     */
    setStyle : function(map) {
      this._setStyle(map);
    },

    /**
     * Set styles to the element
     * @param map {Map} Map of styles/values to apply
     */
    _setStyle : function(map) {
      map = qx.lang.Object.clone(map);
      var properties = null;
      if (map.properties) {
        properties = map.properties;
        delete map.properties;
      }
      
      var disallowedStyles = [
        "fontSize",
        "fontWeight",
        "fontFamily",
        
        "left",
        "top",
        "bottom",
        "right",
        "position",
        //"width",
        //"height",
        "visibility",
        
        "border",
        "borderSize"
      ];
      
      if (map.height) {
        this.setHeight(parseInt(map.height,10));
        delete map.height;
      }
      if (map.width) {
        this.setWidth(parseInt(map.width,10));
        delete map.height;
      }
      if (map.margin) {
        var margin = map.margin.split(" ");
        map.marginTop = margin[0];
        map.marginRight = margin[1] || margin[0];
        map.marginBottom = margin[2] || margin[0];
        map.marginLeft = margin[3] || margin[1] || margin[0];
        delete map.margin;
      }
      if (map.padding) {
        var padding = map.padding.split(" ");
        map.paddingTop = padding[0];
        map.paddingRight = padding[1] || padding[0];
        map.paddingBottom = padding[2] || padding[0];
        map.paddingLeft = padding[3] || padding[1] || padding[0];
        delete map.padding;
      }
      if (map.borderWidth) {
        var borderWidth = map.borderWidth.split(" ");
        map.borderTopWidth = borderWidth[0];
        map.borderRightWidth = borderWidth[1] || borderWidth[0];
        map.borderBottomWidth = borderWidth[2] || borderWidth[0];
        map.borderLeftWidth = borderWidth[3] || borderWidth[1] || borderWidth[0];
        delete map.borderWidth;
      }
      if (map.borderStyle) {
        var borderStyle = map.borderStyle.split(" ");
        map.borderTopStyle = borderStyle[0];
        map.borderRightStyle = borderStyle[1] || borderStyle[0];
        map.borderBottomStyle = borderStyle[2] || borderStyle[0];
        map.borderLeftStyle = borderStyle[3] || borderStyle[1] || borderStyle[0];
        delete map.borderStyle;
      }
      if (map.borderColor) {
        var borderColor = map.borderColor.split(" ");
        map.borderTopColor = borderColor[0];
        map.borderRightColor = borderColor[1] || borderColor[0];
        map.borderBottomColor = borderColor[2] || borderColor[0];
        map.borderLeftColor = borderColor[3] || borderColor[1] || borderColor[0];
        delete map.borderColor;
      }
      
      if (map.borderLeft) {
        var border = map.borderLeft.split(" ");
        map.borderLeftWidth = border[0];
        if (border[1]) map.borderLeftStyle = border[1];
        if (border[2]) map.borderLeftColor = border[2];
        delete map.borderLeft;
      }
      if (map.borderTop) {
        var border = map.borderTop.split(" ");
        map.borderTopWidth = border[0];
        if (border[1]) map.borderTopStyle = border[1];
        if (border[2]) map.borderTopColor = border[2];
        delete map.borderTop;
      }
      if (map.borderRight) {
        var border = map.borderRight.split(" ");
        map.borderRightWidth = border[0];
        if (border[1]) map.borderRightStyle = border[1];
        if (border[2]) map.borderRightColor = border[2];
        delete map.borderRight;
      }
      if (map.borderBottom) {
        var border = map.borderBottom.split(" ");
        map.borderBottomWidth = border[0];
        if (border[1]) map.borderBottomStyle = border[1];
        if (border[2]) map.borderBottomColor = border[2];
        delete map.borderBottom;
      }

      var keys = qx.lang.Object.getKeys(map);
      var style = this.__style || {};

      for (var i=0,ii=keys.length; i<ii; i++) {
        var key = keys[i];

        if (!qx.lang.Array.contains(disallowedStyles, key)) {
          // Margin handling by LayoutItem
          if (key == "marginLeft") {
            this.setMarginLeft(parseInt(map[key], 10));
          } else if (key == "marginTop") {
            this.setMarginTop(parseInt(map[key], 10));
          } else if (key == "marginRight") {
            this.setMarginRight(parseInt(map[key], 10));
          } else if (key == "marginBottom") {
            this.setMarginBottom(parseInt(map[key], 10));
          } else {
            style[key] = map[key];
          }
        } else {
          this.error("Widget style type " + key + " is not allowed");
        }
      }

      

      var font = style.font;
      if (font) {
        this.__font = font = qx.bom.Font.fromString(font);
        delete style.font;
        
        var fontStyle = qx.theme.manager.Font.getInstance().resolve(font).getStyles();
        var textColor = style.textColor;
        if (textColor) {
          style.color = qx.theme.manager.Color.getInstance().resolve(textColor);
        }
        
        style = qx.lang.Object.merge(fontStyle, style);
        
        delete style.textColor;
        
        qx.ui.core.queue.Layout.add(this);
      }
      
      this.__style = style;
      
      var padding = this.__padding = {
        left: parseInt(style.paddingLeft, 10) || 0,
        top: parseInt(style.paddingTop, 10) || 0,
        right: parseInt(style.paddingRight, 10)  || 0,
        bottom: parseInt(style.paddingBottom, 10) || 0
      };
      /*if (padding.left + padding.top + padding.right + padding.bottom > 0) {
        qx.ui.core.queue.Layout.add(this);
      }*/
      
      var border = this.__border = {
        left: parseInt(style.borderLeftWidth, 10) || 0,
        top: parseInt(style.borderTopWidth, 10) || 0,
        right: parseInt(style.borderRightWidth, 10)  || 0,
        bottom: parseInt(style.borderBottomWidth, 10) || 0
      };
      /*if (border.left + border.top + border.right + border.bottom > 0) {
        qx.ui.core.queue.Layout.add(this);
      }*/

      qx.bom.element.Style.setStyles(this.getElement(), style);
      
      if (properties) {
        var keys = qx.lang.Object.getKeys(properties);
        var firstUp = qx.lang.String.firstUp;
        
        for (var i=0,ii=keys.length; i<ii; i++) {
          var key = keys[i];
          var value = properties[key];
          
          var setter = this["set" + firstUp(key)];
          if (setter) {
            setter.call(this, value);
          } else {
            this.error("Widget has no setter for property " + key)
          }
        }
      }
    },
    
    /**
     * Get font of widget
     *
     * @return {Map[]} CSS font styles applied on widget
     */
    getFont : function() {
      var font = this.__font;
      return font ? font.getStyles() : qx.bom.Font.getDefaultStyles();
    },

    /**
     * Get style of element
     * @param name {String} Style name to return
     * @param computed {Boolean?false} Value should be computed
     */
    getStyle : function(name, computed) {
      return this._getStyle(name, computed);
    },

    /**
     * Get style of element
     * @param name {String} Style name to return
     * @param computed {Boolean?false} Value should be computed
     */
    _getStyle : function(name, computed) {
      var style = this.__style;
      var value = (style && style[name]);
      
      if (value) {
        return value;
      } else {
        return qx.bom.element.Style.get(this.getElement(), qx.bom.element.Style.property(name), computed);
      }
    },



    hasUserBounds : function() {
    
    },
    
    isExcluded : function() {
      return this.getVisibility() === "excluded";
    },
    
    __element : null,
    
    /**
     * Returns the DOM element this widget creates
     */
    getElement : function() {
      return this.__element;
    },
    
    /**
     * Returns if the DOM element is created or not
     * @return {Boolean} DOM element is created
     */
    _hasElement : function() {
      return !!this.__element;
    },
    
    /**
     * Creates DOM element
     */
    _createElement : function() {
      throw "_createElement is not implemented";
    },
    
    /**
     * Creates DOM element
     * 
     * @return {Element} DOM element of widget
     */
    __createElement : function() {
        var element = this._createElement();
        
        if (!element) {
          return null;
        }
        
        element.$$widget = this.toHashCode();

        if(qx.core.Environment.get("qx.debug")){
          element.setAttribute("unifyclass",this.classname);
        }
        qx.bom.element.Style.set(element, "position",  "absolute");
        
        var style = this.__style;
        if (style) {
          qx.bom.element.Style.setStyles(element, style);
        }
        
        return element;
    },
    
    __widgetChildren : null,

    /**
     * Returns children of widget
     * @return {unify.ui.core.Widget[]} Child widgets
     */
    getChildren : function(){
      return this._getChildren();
    },
    
    /**
     * Returns children of widget
     * @return {unify.ui.core.Widget[]} Child widgets
     */
    _getChildren : function() {
      return this.__widgetChildren;
    },
    
    /**
     * Recursively adds all children to the given queue
     *
     * @param queue {Map} The queue to add widgets to
     */
    addChildrenToQueue : function(queue)
    {
      var children = this.__widgetChildren;
      if (!children) {
        return;
      }

      var child;
      for (var i=0, l=children.length; i<l; i++)
      {
        child = children[i];
        queue.push(child);

        child.addChildrenToQueue(queue);
      }
    },
    
    /**
     * Checks if widget has children
     * @return {Boolean} Widget has children
     */
    _hasChildren : function() {
      var children = this.__widgetChildren;
      return !!(children && children.length > 0);
    },
    
    /**
     * Returns the index position of the given widget if it is
     * a child widget. Otherwise it returns <code>-1</code>.
     *
     * @param child {Widget} the widget to query for
     * @return {Integer} The index position or <code>-1</code> when
     *   the given widget is no child of this layout.
     */
    _indexOf : function(child)
    {
      var children = this.__widgetChildren;
      if (!children) {
        return -1;
      }

      return children.indexOf(child);
    },
    
    /**
     * Adds a new child widget.
     *
     * The supported keys of the layout options map depend on the layout manager
     * used to position the widget. The options are documented in the class
     * documentation of each layout manager {@link qx.ui.layout}.
     *
     * @param child {LayoutItem} the widget to add.
     * @param options {Map?null} Optional layout data for widget.
     * @return {void}
     */
    _add : function(child, options) {
      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      if (this.__widgetChildren) {
        this.__widgetChildren.push(child);
      } else {
        this.__widgetChildren = [ child ];
      }

      this.__addHelper(child, options);
    },


    /**
     * Add a child widget at the specified index
     *
     * @param child {LayoutItem} widget to add
     * @param index {Integer} Index, at which the widget will be inserted
     * @param options {Map?null} Optional layout data for widget.
     */
    _addAt : function(child, index, options)
    {
      if (!this.__widgetChildren) {
        this.__widgetChildren = [];
      }

      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      var ref = this.__widgetChildren[index];

      if (ref === child) {
        return child.setLayoutProperties(options);
      }

      if (ref) {
        qx.lang.Array.insertBefore(this.__widgetChildren, child, ref);
      } else {
        this.__widgetChildren.push(child);
      }

      this.__addHelper(child, options, index);
    },


    /**
     * Add a widget before another already inserted widget
     *
     * @param child {LayoutItem} widget to add
     * @param before {LayoutItem} widget before the new widget will be inserted.
     * @param options {Map?null} Optional layout data for widget.
     * @return {void}
     */
    _addBefore : function(child, before, options)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assertInArray(before, this._getChildren(),
          "The 'before' widget is not a child of this widget!");
      }

      if (child == before) {
        return;
      }

      if (!this.__widgetChildren) {
        this.__widgetChildren = [];
      }

      var addAtIndex = this.__widgetChildren.indexOf(before);

      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      qx.lang.Array.insertBefore(this.__widgetChildren, child, before);

      this.__addHelper(child, options, addAtIndex);
    },


    /**
     * Add a widget after another already inserted widget
     *
     * @param child {LayoutItem} widget to add
     * @param after {LayoutItem} widget, after which the new widget will
     *   be inserted
     * @param options {Map?null} Optional layout data for widget.
     * @return {void}
     */
    _addAfter : function(child, after, options)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assertInArray(after, this._getChildren(),
          "The 'after' widget is not a child of this widget!");
      }

      if (child == after) {
        return;
      }

      if (!this.__widgetChildren) {
        this.__widgetChildren = [];
      }

      var addAtIndex = this.__widgetChildren.indexOf(after)+1;

      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      qx.lang.Array.insertAfter(this.__widgetChildren, child, after);

      this.__addHelper(child, options, addAtIndex);
    },


    /**
     * Remove the given child widget.
     *
     * @param child {LayoutItem} the widget to remove
     * @return {void}
     */
    _remove : function(child)
    {
      if (!this.__widgetChildren) {
        throw new Error("This widget has no children!");
      }

      qx.lang.Array.remove(this.__widgetChildren, child);
      this.__removeHelper(child);
    },


    /**
     * Remove the widget at the specified index.
     *
     * @param index {Integer} Index of the widget to remove.
     * @return {qx.ui.core.LayoutItem} The removed item.
     */
    _removeAt : function(index)
    {
      if (!this.__widgetChildren) {
        throw new Error("This widget has no children!");
      }

      var child = this.__widgetChildren[index];

      qx.lang.Array.removeAt(this.__widgetChildren, index);
      this.__removeHelper(child);

      return child;
    },


    /**
     * Remove all children.
     */
    _removeAll : function()
    {
      if (!this.__widgetChildren) {
        return;
      }

      // Working on a copy to make it possible to clear the
      // internal array before calling setLayoutParent()
      var children = this.__widgetChildren.concat();
      this.__widgetChildren.length = 0;

      for (var i=children.length-1; i>=0; i--) {
        this.__removeHelper(children[i]);
      }

      qx.ui.core.queue.Layout.add(this);
    },




    /*
    ---------------------------------------------------------------------------
      CHILDREN HANDLING - TEMPLATE METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * This method gets called each time after a child widget was added and can
     * be overridden to get notified about child adds.
     *
     * @signature function(child)
     * @param child {qx.ui.core.LayoutItem} The added child.
     */
    _afterAddChild : null,


    /**
     * This method gets called each time after a child widget was removed and
     * can be overridden to get notified about child removes.
     *
     * @signature function(child)
     * @param child {qx.ui.core.LayoutItem} The removed child.
     */
    _afterRemoveChild : null,




    /*
    ---------------------------------------------------------------------------
      CHILDREN HANDLING - IMPLEMENTATION
    ---------------------------------------------------------------------------
    */

    /**
     * Convenience function to add a child widget. It will insert the child to
     * the parent widget and schedule a layout update.
     *
     * @param child {LayoutItem} The child to add.
     * @param options {Map|null} Optional layout data for the widget.
     * @param index {Number|null} Optional index where to add the child
     */
    __addHelper : function(child, options,index)
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        //this.assertInstance(child, unify.ui.qx.LayoutItem, "Invalid widget to add: " + child);
        this.assertInstance(child, qx.ui.core.LayoutItem, "Invalid widget to add: " + child);
        this.assertNotIdentical(child, this, "Could not add widget to itself: " + child);

        if (options != null) {
          this.assertType(options, "object", "Invalid layout data: " + options);
        }
      }

      // Remove from old parent
      var parent = child.getLayoutParent();
      if (parent && parent != this) {
        parent._remove(child);
      }
      var element = child.getElement();
      var contentElem=this.getContentElement();
      var childNodes=contentElem.childNodes;
      if(index!=null && index >=0 && index < childNodes.length){
        contentElem.insertBefore(element,childNodes[index]);
      } else {
        contentElem.appendChild(element);
      }
      
      this._getLayout().invalidateLayoutCache();

      // Remember parent
      child.setLayoutParent(this);

      qx.ui.core.queue.Visibility.add(this);

      // Import options: This call will
      //  - clear the layout's children cache as well and
      //  - add its parent (this widget) to the layout queue
      if (options) {
        child.setLayoutProperties(options);
      } else {
        this.updateLayoutProperties();
      }

      // call the template method
      if (this._afterAddChild) {
        this._afterAddChild(child);
      }
    },


    /**
     * Convenience function to remove a child widget. It will remove it
     * from the parent widget and schedule a layout update.
     *
     * @param child {LayoutItem} The child to remove.
     */
    __removeHelper : function(child)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assertNotUndefined(child);
      }

      if (child.getLayoutParent() !== this) {
        throw new Error("Remove Error: " + child + " is not a child of this widget!");
      }

      var element = child.getElement();
      this.getContentElement().removeChild(element);
      this._getLayout().invalidateLayoutCache();

      // Clear parent connection
      child.setLayoutParent(null);

      // clear the layout's children cache
      if (this.__layoutManager) {
        this.__layoutManager.invalidateChildrenCache();
      }

      // Add to layout queue
      qx.ui.core.queue.Layout.add(this);

      // call the template method
      if (this._afterRemoveChild) {
        this._afterRemoveChild(child);
      }
    }
  },
  
  destruct : function() {
    this._disposeArray("__widgetChildren");
    this._disposeObjects(
      "__layoutManager",
      "__element"
    );
  }
});
