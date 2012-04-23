/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.core.FocusHandler", {
  extend: qx.core.Object,
  type: "singleton",
  
  members : {
    __currentRoot : null,
    __focusedChild : null,
    
    /**
     * Connects to a top-level root element (which initially receives
     * all events of the root). This are normally all page and application
     * roots, but no inline roots (they are typically sitting inside
     * another root).
     *
     * @param root {qx.ui.root.Abstract} Any root
     */
    connectTo : function(root) {
      this.__currentRoot = root;
      
      root.addListener("keypress", this.__onKeyPress, this);
    },
    
    /**
     * Returns if widget is a focus root
     *
     * @param widget {unify.ui.core.Widget} Widget to check for current root
     * @return {Boolean} Is widget a focus root
     */
    isFocusRoot : function(widget) {
      return (widget == this.__currentRoot);
    },
    
    /**
     * Handler for key presses
     *
     * @param e {Event} Key press event
     */
    __onKeyPress : function(e) {
      if (e.getKeyIdentifier() != "Tab") {
        return;
      }

      // Stop all key-events with a TAB keycode
      e.stopPropagation();
      e.preventDefault();

      // Support shift key to reverse widget detection order
      var current = this.__focusedChild;
      if (!e.isShiftPressed()) {
        var next = current ? this.__getWidgetAfter(current) : this.__getFirstWidget();
      } else {
        var next = current ? this.__getWidgetBefore(current) : this.__getLastWidget();
      }

      // If there was a widget found, focus it
      if (next) {
        next.tabFocus();
        this.__focusedChild = next;
        current && current.tabBlur();
      }
    },
    
    
    
    
    
    /*
    ---------------------------------------------------------------------------
      TAB SUPPORT IMPLEMENTATION
    ---------------------------------------------------------------------------
    */

    /**
     * Compares the order of two widgets
     *
     * @param widget1 {unify.ui.core.Widget} Widget A
     * @param widget2 {unify.ui.core.Widget} Widget B
     * @return {Integer} A sort() compatible integer with values
     *   small than 0, exactly 0 or bigger than 0.
     */
    __compareTabOrder : function(widget1, widget2)
    {
      if (widget1 === widget2) {
        return 0;
      }

      // Sort-Check #1: Tab-Index
      var tab1 = widget1.getTabIndex() || 0;
      var tab2 = widget2.getTabIndex() || 0;

      if (tab1 != tab2) {
        return tab1 - tab2;
      }

      // Computing location
      var el1 = widget1.getElement();
      var el2 = widget2.getElement();

      var Location = qx.bom.element.Location;

      var loc1 = Location.get(el1);
      var loc2 = Location.get(el2);

      // Sort-Check #2: Top-Position
      if (loc1.top != loc2.top) {
        return loc1.top - loc2.top;
      }

      // Sort-Check #3: Left-Position
      if (loc1.left != loc2.left) {
        return loc1.left - loc2.left;
      }

      // Sort-Check #4: zIndex
      var z1 = widget1.getZIndex();
      var z2 = widget2.getZIndex();

      if (z1 != z2) {
        return z1 - z2;
      }

      return 0;
    },
    
    /**
     * Returns the first widget.
     *
     * @return {unify.ui.core.Widget} Retuns the first (positioned) widget from
     *    the current root.
     */
    __getFirstWidget : function() {
      return this.__getFirst(this.__currentRoot, null);
    },


    /**
     * Returns the last widget.
     *
     * @return {unify.ui.core.Widget} Returns the last (positioned) widget from
     *    the current root.
     */
    __getLastWidget : function() {
      return this.__getLast(this.__currentRoot, null);
    },


    /**
     * Returns the widget after the given one.
     *
     * @param widget {unify.ui.core.Widget} Widget to start with
     * @return {unify.ui.core.Widget} The found widget.
     */
    __getWidgetAfter : function(widget)
    {
      var root = this.__currentRoot;
      if (root == widget) {
        return this.__getFirstWidget();
      }

      /*while (widget && widget.getAnonymous()) {
        widget = widget.getLayoutParent();
      }*/

      if (widget == null) {
        return [];
      }

      var result = [];
      this.__collectAllAfter(root, widget, result);
      result.sort(this.__compareTabOrder);

      var len = result.length;
      return len > 0 ? result[0] : this.__getFirstWidget();
    },


    /**
     * Returns the widget before the given one.
     *
     * @param widget {unify.ui.core.Widget} Widget to start with
     * @return {unify.ui.core.Widget} The found widget.
     */
    __getWidgetBefore : function(widget)
    {
      var root = this.__currentRoot;
      if (root == widget) {
        return this.__getLastWidget();
      }

      /*while (widget && widget.getAnonymous()) {
        widget = widget.getLayoutParent();
      }*/

      if (widget == null) {
        return [];
      }

      var result = [];
      this.__collectAllBefore(root, widget, result);
      result.sort(this.__compareTabOrder);

      var len = result.length;
      return len > 0 ? result[len - 1] : this.__getLastWidget();
    },






    /*
    ---------------------------------------------------------------------------
      INTERNAL API USED BY METHODS ABOVE
    ---------------------------------------------------------------------------
    */

    /**
     * Collects all widgets which are after the given widget in
     * the given parent widget. Append all found children to the
     * <code>list</code>.
     *
     * @param parent {unify.ui.core.Widget} Parent widget
     * @param widget {unify.ui.core.Widget} Child widget to start with
     * @param result {Array} Result list
     * @return {void}
     */
    __collectAllAfter : function(parent, widget, result)
    {
      var children = parent.getLayoutChildren();
      var child;

      for (var i=0, l=children.length; i<l; i++)
      {
        child = children[i];

        // Filter spacers etc.
        if (!(child instanceof unify.ui.core.Widget)) {
          continue;
        }

        if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible())
        {
          if (child.isFocusable() && this.__compareTabOrder(widget, child) < 0) {
            result.push(child);
          }

          this.__collectAllAfter(child, widget, result);
        }
      }
    },


    /**
     * Collects all widgets which are before the given widget in
     * the given parent widget. Append all found children to the
     * <code>list</code>.
     *
     * @param parent {unify.ui.core.Widget} Parent widget
     * @param widget {unify.ui.core.Widget} Child widget to start with
     * @param result {Array} Result list
     * @return {void}
     */
    __collectAllBefore : function(parent, widget, result)
    {
      var children = parent.getLayoutChildren();
      var child;

      for (var i=0, l=children.length; i<l; i++)
      {
        child = children[i];

        // Filter spacers etc.
        if (!(child instanceof unify.ui.core.Widget)) {
          continue;
        }

        if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible())
        {
          if (child.isFocusable() && this.__compareTabOrder(widget, child) > 0) {
            result.push(child);
          }

          this.__collectAllBefore(child, widget, result);
        }
      }
    },


    /**
     * Find first (positioned) widget. (Sorted by coordinates, zIndex, etc.)
     *
     * @param parent {unify.ui.core.Widget} Parent widget
     * @param firstWidget {unify.ui.core.Widget?null} Current first widget
     * @return {unify.ui.core.Widget} The first (positioned) widget
     */
    __getFirst : function(parent, firstWidget)
    {
      var children = parent.getLayoutChildren();
      var child;

      for (var i=0, l=children.length; i<l; i++)
      {
        child = children[i];

        // Filter spacers etc.
        if (!(child instanceof unify.ui.core.Widget)) {
          continue;
        }

        // Ignore focus roots completely
        if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible())
        {
          if (child.isFocusable())
          {
            if (firstWidget == null || this.__compareTabOrder(child, firstWidget) < 0) {
              firstWidget = child;
            }
          }

          // Deep iteration into children hierarchy
          firstWidget = this.__getFirst(child, firstWidget);
        }
      }

      return firstWidget;
    },


    /**
     * Find last (positioned) widget. (Sorted by coordinates, zIndex, etc.)
     *
     * @param parent {unify.ui.core.Widget} Parent widget
     * @param lastWidget {unify.ui.core.Widget?null} Current last widget
     * @return {unify.ui.core.Widget} The last (positioned) widget
     */
    __getLast : function(parent, lastWidget)
    {
      var children = parent.getLayoutChildren();
      var child;

      for (var i=0, l=children.length; i<l; i++)
      {
        child = children[i];

        // Filter spacers etc.
        if (!(child instanceof unify.ui.core.Widget)) {
          continue;
        }

        // Ignore focus roots completely
        if (!this.isFocusRoot(child) && child.isEnabled() && child.isVisible())
        {
          if (child.isFocusable())
          {
            if (lastWidget == null || this.__compareTabOrder(child, lastWidget) > 0) {
              lastWidget = child;
            }
          }

          // Deep iteration into children hierarchy
          lastWidget = this.__getLast(child, lastWidget);
        }
      }

      return lastWidget;
    }
  },
  
  destruct: function(){
    this.__currentRoot=this.__focusedChild=null;
  }
});