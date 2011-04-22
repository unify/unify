/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Generic widget that depends on a slighly modified qooxdoo LayoutItem
 * This is the base of every widget in the unify widget system
 */
qx.Class.define("unify.ui.widget.core.Widget", {
  extend : qx.ui.core.LayoutItem,
  include : [qx.locale.MTranslation],
  
  /**
   * @param layout {qx.ui.layout.Abstract} Layout of widget
   */
  construct : function(layout) {
    this.base(arguments);
    
    if (layout) {
      this._setLayout(layout);
    }
    
    //this._applyAppearance(this.getAppearance());
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
    
    navigation : {
      apply : "_applyNavigation",
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
    
    _applyNavigation : function(value) {
      if (value && this._hasElement()) {
        this.__applyNavigation(this.getElement(), value);
      }
    },
    
    __applyNavigation : function(element, map) {
      for (var key in map) {
        var value = map[key];
        element.setAttribute(key, value);
      }
    },
    
    
    _applyAppearance : function(value) {
      /*if (value) {
        this.debug("Get styles for key " + value);
        console.log(this, unify.ui.widget.styling.StyleManager.getInstance().getTheme().getStyles(value));
        this.setStyle(unify.ui.widget.styling.StyleManager.getInstance().getTheme().getStyles(value));
      }*/
    },
    
    // property apply
    _applyEnabled : function(value, old)
    {
      if (value===false)
      {
        this.addState("disabled");

        // hovered not configured in widget, but as this is a
        // standardized name in qooxdoo and we never want a hover
        // state for disabled widgets, remove this state everytime
        this.removeState("hovered");

        /*// Blur when focused
        if (this.isFocusable())
        {
          // Remove focused state
          this.removeState("focused");

          // Remove tabIndex
          this._applyFocusable(false, true);
        }

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
        this.removeState("disabled");

        /*// Re-add tabIndex
        if (this.isFocusable()) {
          this._applyFocusable(true, false);
        }

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

      // Ask content
      var contentHint = this._getContentHint();

      var insetX = this.__widthInset;
      var insetY = this.__heightInset;

      if (width == null) {
        width = contentHint.width + insetX;
      }

      if (height == null) {
        height = contentHint.height + insetY;
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

    checkAppearanceNeeds : function() {
    },
    
    renderLayout : function(left, top, width, height, preventSize) {
      this.base(arguments, left, top, width, height);
      
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
        var innerWidth = width - this.__widthInset;
        var innerHeight = height - this.__heightInset;

        var children = this._getChildren();
        if (children) {
          for (var i=0,ii=children.length; i<ii; i++) {
            children[i].setParentInset([this.__leftInset, this.__topInset]);
          }
        }

        if (this.__layoutManager && this.hasLayoutChildren()) {
          this.__layoutManager.renderLayout(innerWidth, innerHeight);
        } else if (this.hasLayoutChildren()) {
          throw new Error("No layout in " + this);
        }
      }
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
      var children = this._getChildren();
      if (children) {
        var fragment = document.createDocumentFragment();
        for (var i=0,ii=children.length; i<ii; i++) {
          var child = children[i];
          child.renderChildren();
          fragment.appendChild(child.getElement());
        }
        
        this.getContentElement().appendChild(fragment);
      }
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

      // Forward state change to child controls
      var forward = this._forwardStates;
      var controls = this.__childControls;

      if (forward && forward[state] && controls)
      {
        var control;
        for (var id in controls)
        {
          control = controls[id];
          if (control instanceof unify.ui.widget.core.Widget) {
            controls[id].addState(state);
          }
        }
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

      // Forward state change to child controls
      var forward = this._forwardStates;
      var controls = this.__childControls;

      if (forward && forward[state] && controls)
      {
        for (var id in controls)
        {
          var control = controls[id];
          if (control instanceof unify.ui.widget.core.Widget) {
            control.removeState(state);
          }
        }
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

      // Forward state change to child controls
      var forward = this._forwardStates;
      var controls = this.__childControls;

      if (forward && forward[value] && controls)
      {
        for (var id in controls)
        {
          var control = controls[id];
          if (control instanceof unify.ui.widget.core.Widget) {
            control.replaceState(old, value);
          }
        }
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
    __widthInset : 0,
    __heightInset : 0,
    __leftInset : 0,
    __topInset : 0,

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
      var disallowedStyles = [
        "border", // use borderLeft etc.
        "padding", // use paddingRight etc.
        "margin", // use marginBottom etc.
        
        "fontSize",
        "fontWeight",
        "fontFamily",
        
        "left",
        "top",
        "bottom",
        "right",
        "position",
        "width",
        "height",
        "visibility"
      ];

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

      var left   = (parseInt(style.borderLeft, 10)   || 0) + (parseInt(style.paddingLeft, 10)   || 0);
      var top    = (parseInt(style.borderTop, 10)    || 0) + (parseInt(style.paddingTop, 10)    || 0);
      var right  = (parseInt(style.borderRight, 10)  || 0) + (parseInt(style.paddingRight, 10)  || 0);
      var bottom = (parseInt(style.borderBottom, 10) || 0) + (parseInt(style.paddingBottom, 10) || 0);

      var font = style.font;
      if (font) {
        this.__font = font = qx.bom.Font.fromString(font);
        delete style.font;
        var fontStyle = font.getStyles();
        fontStyle.color = fontStyle.textColor;
        delete fontStyle.textColor;
        style = qx.lang.Object.merge(fontStyle, style);
        qx.ui.core.queue.Layout.add(this);
      }
      
      this.__style = style;
      this.__widthInset = left + right;
      this.__heightInset =  top + bottom;
      this.__leftInset = left;
      this.__topInset = top;

      if (this._hasElement()) {
        qx.bom.element.Style.setStyles(this.getElement(), style);
      }
    },
    
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
      } else if (this._hasElement()) {
        return qx.bom.element.Style.get(this.getElement(), name, computed);
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
      var element = this.__element;
      if (!element) {
        this.__element = element = this._createElement();
        
        element.$$widget = this.toHashCode();
        
        qx.bom.element.Style.set(element, "position",  "absolute");
        
        var style = this.__style;
        if (style) {
          qx.bom.element.Style.setStyles(element, style);
        }
        
        var navigation = this.getNavigation();
        if (navigation) {
          this.__applyNavigation(element, navigation);
        }
      }
      return element;
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
    
    __widgetChildren : null,
    
    /**
     * Returns children of widget
     * @return {unify.ui.widget.core.Widget[]} Child widgets
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
      var childs = this.__widgetChildren;
      return !! (childs && childs.length > 0)
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
    _add : function(child, options)
    {
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

      this.__addHelper(child, options);
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

      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      qx.lang.Array.insertBefore(this.__widgetChildren, child, before);

      this.__addHelper(child, options);
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

      // When moving in the same widget, remove widget first
      if (child.getLayoutParent() == this) {
        qx.lang.Array.remove(this.__widgetChildren, child);
      }

      qx.lang.Array.insertAfter(this.__widgetChildren, child, after);

      this.__addHelper(child, options);
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
     */
    __addHelper : function(child, options)
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        //this.assertInstance(child, unify.ui.widget.qx.LayoutItem, "Invalid widget to add: " + child);
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
      
      if (this._hasElement()) {
        var element = child.getElement();
        child.renderChildren();
        this.getContentElement().appendChild(element);
      }

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
