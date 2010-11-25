/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class manage other classes which extend from {@link StaticView}.
 */
qx.Class.define("unify.view.mobile.ViewManager",
{
  extend : qx.core.Object,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(defaultView)
  {
    this.base(arguments);

    this.__defaultView = defaultView;

    // Initialize storage for views
    this.__views = {};
    
    this.__layerManager = new unify.ui.mobile.LayerManager(this);
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** The active view */
    view :
    {
      check : "unify.view.mobile.StaticView",
      nullable : true,
      apply : "_applyView",
      event : "changeView"
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** {Map} A map with all keys (by ID) */
    __views : null,

    __layerManager : null,
    
    __defaultView : null,

    /** {String} Mode of last view switch */
    __mode : null,



    /*
    ---------------------------------------------------------------------------
      VIEW MANAGMENT
    ---------------------------------------------------------------------------
    */

    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     */
    add : function(viewClass, isDefault)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewClass) {
          throw new Error("Invalid view class: " + viewClass);
        }
      }
      
      var id = qx.lang.String.hyphenate(viewClass.basename).substring(1);
      this.debug("Add View: " + viewClass + " as " + id);
      
      if (isDefault) 
      {
        this.debug("Default View: " + viewClass);
        this.__defaultView = viewClass;
      }

      this.__views[id] = viewClass;
    },


    /**
     * Returns the view instance stored behind the given ID.
     *
     * @param id {String} Identifier of the view.
     * @return {unify.view.mobile.Abstract} Instance derived from the StaticView class.
     */
    getById : function(id)
    {
      var view = id && this.__views[id] || null;
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!view) {
          this.warn("Unknown view ID: " + id);
        }
      }

      return view;
    },
    
    
    hasView : function(id) {
      return !!this.__views[id];
    },


    /**
     * Returns default view id (first added view)
     *
     * @return {String} ID of default view
     */
    getDefaultView : function() {
      return this.__defaultView;
    },


    /**
     * Returns the last mode for a view switch.
     *
     * See also: {@link unify.event.type.Navigate#getMode}
     *
     * @return {String} Mode of last view switch.
     */
    getMode : function() {
      return this.__mode;
    },




    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyView : function(value, old)
    {
      this.debug("View: " + value);

      if (old) {
        old.resetActive();
      }

      var LayerManager = this.__layerManager;

      if (value)
      {
        // Resume the view
        var now = (new Date).valueOf();
        value.setActive(true);
        this.debug("Activated in " + ((new Date).valueOf()-now) + "ms");

        // Switch layers
        var now = (new Date).valueOf();
        LayerManager.setLayer(value.getLayer());
        this.debug("Switched in " + ((new Date).valueOf()-now) + "ms");
      }
      else
      {
        // Hide current layer
        LayerManager.resetLayer();
      }
    }
  }
});
