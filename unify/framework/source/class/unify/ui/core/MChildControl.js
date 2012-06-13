/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Mixin to support child controls
 *
 * Childs controls supports state bubbling
 */
core.Class("unify.ui.core.MChildControl", {
  construct : function() {
    this._applyMChildControl();
  },
  
  members : {
  
    /** {Map} Instantiated child control representations */
    __childControls : null,
  
    /**
     * {Boolean} Checks the child with given @id {String} for availability.
     */
    hasChildControl : function(id) {
      if (!this.__childControls) {
        return false;
      }

      return !!this.__childControls[id];
    },


    /**
     * {Map} Returns a map of all already created child controls
     */
    _getCreatedChildControls : function() {
      return this.__childControls;
    },


    /**
     * {unify.core.Widget} Get child control with ID @id {String}. 
     * If @notcreate {Boolean?false} is set to true the widget is 
     * created if not exist.
     */
    getChildControl : function(id, notcreate) {
      if (!this.__childControls)
      {
        if (notcreate) {
          return null;
        }

        this.__childControls = {};
      }

      var control = this.__childControls[id];
      if (control) {
        return control;
      }

      if (notcreate === true) {
        return null;
      }

      return this._createChildControl(id);
    },


    /**
     * Shows the given child control by ID
     *
     * @param id {String} ID of the child control
     * @return {unify.ui.core.Widget} the child control
     */
    _showChildControl : function(id) {
      var control = this.getChildControl(id);
      control.show();
      return control;
    },


    /**
     * Excludes the given child control by ID
     *
     * @param id {String} ID of the child control
     */
    _excludeChildControl : function(id) {
      var control = this.getChildControl(id, true);
      if (control) {
        control.exclude();
      }
    },


    /**
     * Whether the given child control is visible.
     *
     * @param id {String} ID of the child control
     * @return {Boolean} <code>true</code> when the child control is visible.
     */
    _isChildControlVisible : function(id) {
      var control = this.getChildControl(id, true);
      if (control) {
        return control.isVisible();
      }

      return false;
    },


    /**
     * Force the creation of the given child control by ID.
     *
     * Do not override this method! Override {@link #_createChildControlImpl}
     * instead if you need to support new controls.
     *
     * @param id {String} ID of the child control
     * @return {unify.ui.core.Widget} The created control
     * @throws when the control was created before
     */
    _createChildControl : function(id) {
      if (!this.__childControls) {
        this.__childControls = {};
      } else if (this.__childControls[id]) {
        throw new Error("Child control '" + id + "' already created!");
      }
      
      var control;

      var pos = id.indexOf("#");
      if (pos == -1) {
        control = this._createChildControlImpl(id);
      } else {
        control = this._createChildControlImpl(
          id.substring(0, pos), id.substring(pos + 1, id.length)
        );
      }

      if (!control) {
        throw new Error("Unsupported control: " + id);
      }
      
      control.setAppearance(this.getAppearance() + "/" + id);
      var appearanceChanged = (function(self, childId) {
        return function(parrentAppearance) {
          self.getChildControl(childId).setAppearance(parrentAppearance + "/" + childId);
        };
      })(this, id);
      
      lowland.events.EventManager.forceDirect(this, "changeAppearance");
      
      this.addListener("changeAppearance", function(e) {
        appearanceChanged(e.getData());
      }, this);

      // Establish connection to parent
      control.$$subcontrol = id;
      control.$$subparent = this;

      // Support for state forwarding
      var states = this.getAllStates();
      var forward = this._forwardStates;

      if (states && forward && control.constructor instanceof unify.ui.core.Widget.constructor)
      {
        for (var state in states)
        {
          if (forward[state]) {
            control.addState(state);
          }
        }
      }

      this.fireEvent("createChildControl", control);

      // Register control and return
      return this.__childControls[id] = control;
    },
    
    _createChildControlImpl : function(id) {
      console.error("No child control " + id);
    },

    /**
     * Dispose all registered controls. This is automatically
     * executed by the widget.
     */
    _disposeChildControls : function() {
      var controls = this.__childControls;
      if (!controls) {
        return;
      }

      var Widget = unify.ui.core.Widget;

      for (var id in controls) {
        var control = controls[id];
        if (!Widget.contains(this, control)) {
          control.destroy();
        } else {
          control.dispose();
        }
      }

      delete this.__childControls;
    },


    /**
     * Finds and returns the top level control. This is the first
     * widget which is not a child control of any other widget.
     *
     * @return {unify.ui.core.Widget} The top control
     */
    _findTopControl : function() {
      var obj = this;
      while (obj)
      {
        if (!obj.$$subparent) {
          return obj;
        }

        obj = obj.$$subparent;
      }

      return null;
    },
    
    /**
     * Wraps the updateAppearance function of a widget to support
     * child controls.
     */
    __childControlUpdateAppearanceWrapper : function() {
      var original = this.updateAppearance;
      var context = this;
      
      var newFnt = function() {
        original.call(context);
        
        // Update child controls
        var controls = this.__childControls;
        if (controls) {
          var obj;
          for (var id in controls) {
            obj = controls[id];
  
            if (obj.constructor instanceof unify.ui.core.Widget.constructor) {
              obj.updateAppearance();
            }
          }
        }
      };
      
      return newFnt;
    },
    
    /**
     * Wraps the addState function of a widget to support
     * child controls.
     */
    __childControlAddStateWrapper : function() {
      var original = this.addState;
      var context = this;
      
      var newFnt = function(state) {
        original.call(context, state);
        
        // Forward state change to child controls
        var forward = this._forwardStates;
        var controls = this.__childControls;
  
        if (forward && forward[state] && controls)
        {
          var control;
          for (var id in controls)
          {
            control = controls[id];
            if (control.constructor instanceof unify.ui.core.Widget.constructor) {
              controls[id].addState(state);
            }
          }
        }
      };
      
      return newFnt;
    },
    
    /**
     * Wraps the removeState function of a widget to support
     * child controls.
     */
    __childControlRemoveStateWrapper : function() {
      var original = this.removeState;
      var context = this;
      
      var newFnt = function(state) {
        original.call(context, state);
        
        // Forward state change to child controls
        var forward = this._forwardStates;
        var controls = this.__childControls;
  
        if (forward && forward[state] && controls)
        {
          for (var id in controls)
          {
            var control = controls[id];
            if (control.constructor instanceof unify.ui.core.Widget.constructor) {
              control.removeState(state);
            }
          }
        }
      };
      
      return newFnt;
    },
    
    /**
     * Wraps the replaceState function of a widget to support
     * child controls.
     */
    __childControlReplaceStateWrapper : function() {
      var original = this.replaceState;
      var context = this;
      
      var newFnt = function(old, value) {
        original.call(context, old, value);
        
        // Forward state change to child controls
        var forward = this._forwardStates;
        var controls = this.__childControls;
  
        if (forward && forward[value] && controls)
        {
          for (var id in controls)
          {
            var control = controls[id];
            if (control.constructor instanceof unify.ui.core.Widget.constructor) {
              control.replaceState(old, value);
            }
          }
        }
      };
      
      return newFnt;
    },
    
    /**
     * Applies the child control mixin into a widget.
     *
     * This method has to be called from the widget's constructor to
     * mangle in wrappers to support updating of child controls.
     */
    _applyMChildControl : function() {
      this.updateAppearance = this.__childControlUpdateAppearanceWrapper();
      this.addState = this.__childControlAddStateWrapper();
      this.removeState = this.__childControlRemoveStateWrapper();
      this.replaceState = this.__childControlReplaceStateWrapper();
      
      this.addListener("changeAppearance", function(e) {
        var childs = this._getCreatedChildControls();
        
        for (var id in childs) {
          childs[id].setAppearance(e.getData() + "/" + id);
        }
      }, this);
    },
    
    /**
     * Destructor
     */
    destruct : function() {
      this._disposeChildControls();
    }
  }
  
});