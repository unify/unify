/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

core.Class("unify.ui.core.MChildrenHandling", {
  members: {
    /**
     * Add a @child {unify.ui.core.VisibleBox} widget at the specified @index {Integer}.
     * Optional an @options {Map?} map can be given defining layout data for widget.
     */
    addAt : function(child, index, options) {
      this._addAt.apply(this, arguments);
    },
    
    /**
     * Adds new a @child {unify.ui.core.VisibleBox} widget to this widget.
     * Optional an @options {Map?} map can be given defining layout data for widget.
     * This parameters are documented in each layout manager.
     */
    add : function(child, options) {
      this._add.apply(this, arguments);
    },
    
    /**
     * {Integer} Returns the index position of the given widget @child {unify.ui.core.VisibleBox}
     * if it is a child widget. Otherwise it returns <code>-1</code>.
     */
    indexOf : function(child) {
      return this._indexOf.apply(this, arguments);
    },
    
    /**
     * Set styles of @map {Map} to the element.
     */
    setStyle : function(map) {
      this._setStyle.apply(this, arguments);
    },
    
    /**
     * {var} Get style @name {String} of element. If @computed {Boolean?false} flag
     * is true style is calculated by browser.
     */
    getStyle : function(name, computed) {
      return this._getStyle.apply(this, arguments);
    },
    
    
    /**
     * {unify.ui.core.VisibleBox[]} Returns children of widget.
     */
    getChildren : function() {
      return this._getChildren.apply(this, arguments);
    },
    
    /**
     * Set a layout manager @layout {unify.ui.layout.Base} for the widget. 
     * A layout manager can only be connected with one widget. Reset the 
     * connection with a previous widget first, if you like to use it in 
     * another widget instead.
     */
    setLayout : function(layout) {
      this._setLayout.apply(this, arguments);
    },
    
    /**
     * Remove all children.
     */
    removeAll : function() {
      this._removeAll.apply(this, arguments);
    },
    
    /**
     * {unify.ui.layout.Base} Returns layout manager attached to widget
     */
    getLayout : function() {
      return this._getLayout();
    }
  }
});