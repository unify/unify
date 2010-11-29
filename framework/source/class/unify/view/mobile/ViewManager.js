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

  construct : function(managerId)
  {
    this.base(arguments);

    this.__views = {};
    this.__id = managerId || this.getHashCode();
    this.debug("Initialize View Manager: " + this.__id);
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

    __id : null,
    


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
      var id = qx.lang.String.hyphenate(viewClass.basename).substring(1);
      this.debug("Adding view: " + id);
      
      if (isDefault) {
        this.__defaultView = viewClass;
      }

      this.__views[id] = viewClass;
    },
    
    
    getId : function() {
      return this.__id;
    },
    


    /**
     * Returns the view instance stored behind the given ID.
     *
     * @param id {String} Identifier of the view.
     * @return {unify.view.mobile.Abstract} Instance derived from the StaticView class.
     */
    getById : function(id) {
      return id && this.__views[id] || null;
    },
    
    
    hasView : function(id) {
      return id && !!this.__views[id];
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
     * Update given views
     * 
     * @param views {Map[]} List of affected views
     * @return {}
     */
    update : function(views)
    {
      this.debug("Updating views...");
      
      var parent = null;
      
      for (var i=0, l=views.length; i<l; i++)
      {
        var config = views[i];

        // Create view instance, if not done yet
        var view = config.view.getInstance();

        // Update configuration
        parent != null ? view.setParent(parent) : view.resetParent();

        var segment = config.segment;
        segment != null ? view.setSegment(segment) : view.resetSegment();

        var param = config.param;
        param != null ? view.setParam(param) : view.resetParam();
        
        // Setup parent
        parent = view;
      }
      
      // Activate last view
      if (view) {
        this.setView(view);
      }
    },
    
    
    getMode : function() {
      // FIXME
      return null;
    },




    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyView : function(value, old)
    {
      this.debug("Activating view: " + value);

      if (old) {
        old.resetActive();
      }

      var LayerManager = this.__layerManager;
      if (!LayerManager) {
        LayerManager = this.__layerManager = new unify.ui.mobile.LayerManager(this);
      }

      // Resume/Switch the view
      value.setActive(true);
      LayerManager.setLayer(value.getLayer());
    }
  }
});
