/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Model class for a path to define a position
 * inside a mobile Unify application.
 */
qx.Class.define("unify.view.mobile.NavigationPath",
{
  extend : qx.core.Object,
  
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  construct : function(manager)
  {
    this.base(arguments);
    
    this.__navigationManager = manager;
    
  },
  


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * A path divided by slashes where every part must contain
     * a view ID with an optional parameter (divided by a colon) e.g.
     * "foo/bar:123/baz"
     */
    location :
    {
      check : "String",
      nullable : true,
      apply : "_applyLocation"
    }
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
      USER API
    ---------------------------------------------------------------------------
    */

    // overridden
    toString : function() {
      return this.getLocation();
    },


    /**
     * Whether the path contains valid views.
     *
     * @return {Boolean} <code>true</code> when the path is valid
     */
    isValid : function() {
      return this.__valid;
    },


    /**
     * Returns the size (read: depth) of the location
     *
     * @return {Integer} Size of location
     */
    getSize : function() {
      return this.__size;
    },


    /**
     * Returns the view at the given index. Supports referencing from beginning, using
     * positive indexes and from back, using negative indexes. Automatically falls
     * back to last index if no index is given.
     *
     * @param index {Number?size} Position of view to return
     * @return {String} ID of view at given position
     */
    getView : function(index) {
      return this.__getPart(index).view;
    },


    /**
     * Returns the param of the view at the given index. Supports referencing from beginning, using
     * positive indexes and from back, using negative indexes. Automatically falls
     * back to last index if no index is given.
     *
     * @param index {Number?size} Position of view to return param for
     * @return {String|null} Param of view at given position
     */
    getParam : function(index) {
      return this.__getPart(index).param;
    },


    /**
     * Replaces the param of the view at the given index.
     *
     * @param param {var} Any valid parameter
     * @param index {Number} Position of view to modify
     */
    setParam : function(param, index)
    {
      var part = this.__getPart(index);
      part.param = param;
      this.__compile();
    },


    /**
     * Returns the segment of the view at the given index. Supports referencing from beginning, using
     * positive indexes and from back, using negative indexes. Automatically falls
     * back to last index if no index is given.
     *
     * @param index {Number?size} Position of view to return param for
     * @return {String|null} Segment of view at given position
     */
    getSegment : function(index){
      return this.__getPart(index).segment;
    },


    /**
     * Replaces the segment of the view at the given index.
     *
     * @param segment {var} Any valid segment name
     * @param index {Number} Position of view to modify
     */
    setSegment : function(segment, index)
    {
      var part = this.__getPart(index);
      part.segment = segment;
      this.__compile();
    },




    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    __size : 0,
    __parts : null,
    __valid : true,


    /**
     * Compiles data from parts and refreshes {@link #location} property.
     */
    __compile : function()
    {
      var parts = this.__parts;
      var part;
      var result = "";

      for (var i=0, l=parts.length; i<l; i++)
      {
        part = parts[i];

        if (i > 0) {
          result += "/";
        }

        result += part.view;

        if (part.param != null) {
          result += ":" + part.param;
        }

        if (part.segment != null) {
          result += "." + part.segment;
        }
      }

      this.setLocation(result);
    },


    /**
     * Returns the view at the given index. Supports referencing from beginning, using
     * positive indexes and from back, using negative indexes. Automatically falls
     * back to last index if no index is given.
     *
     * @param index {Number?size} Position of view to return
     * @return {String} ID of view at given position
     */
    __getPart : function(index)
    {
      var size = this.__size - 1;
      if (size < 0) {
        throw new Error("NavigationPath instance not ready!")
      } else if (index == null) {
        index = size;
      } else if (index < 0) {
        index = size + index;
      }

      var part = this.__parts[index];
      if (part == null) {
        throw new Error("No part at index: " + index);
      }

      return part;
    },


    // property apply
    _applyLocation : function(value, old)
    {
      var parts = [];
      var valid = true;

      if (value != "")
      {
        var ViewManager = this.__navigationManager.getViewManager();
        var splits = value.split("/");
        var view, segment, param, pos;

        for (var i=0, l=splits.length; i<l; i++)
        {
          view = splits[i];

          // Extract segment, if available
          pos = view.indexOf(".");
          if (pos > 0)
          {
            segment = view.substring(pos+1);
            view = view.substring(0, pos);
          }
          else
          {
            segment = null;
          }

          // Extract param, if available
          pos = view.indexOf(":");
          if (pos > 0)
          {
            param = view.substring(pos+1);
            view = view.substring(0, pos);
          }
          else
          {
            param = null;
          }

          // Validate view
          if (!ViewManager.getById(view))
          {
            this.error("Invalid path part: " + view + "." + segment + ":" + param + " => Invalid view!");
            valid = false;
          }

          // Store data
          parts.push(
          {
            view : view,
            segment : segment,
            param : param
          });
        }
      }

      this.__parts = parts;
      this.__size = parts.length;
      this.__valid = valid;
    }
  }
});
