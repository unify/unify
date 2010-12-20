/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * A view is basically a combination two parts from the typical MVC model:
 * a controller for the UI and the UI itself. It creates the UI logic
 * and binds it into the application logic / business layer.
 *
 * Each view consists at least of a {@link unify.ui.Layer} which
 * creates and manages the top level DOM element of each view. A view might
 * be fullscreen or add different numbers of bars e.g. {@link unify.ui.Tabbar},
 * {@link unify.ui.Titlebar}, {@link unify.ui.Toolbar}, etc.
 *
 * A view is controlled by the {@link Manager} which toggles the visibility
 * of the layers and manage their insertion to the DOM.
 *
 * The instance of the view is created as soon as needed in a lazy pattern.
 * Each view is a singleton which may be used at different positions in navigation
 * e.g. list->entry->user->list->entry. Each view is identified in history by
 * the hyphenated class name e.g. myapp.view.MailList => "mail-list".
 *
 * Applications using this view-controller based Unify architecture got a lot
 * of functionality of typical iPhone application with automatic navigation paths,
 * history managment, recovery, automatic transitions etc. This might not make
 * a lot of sense sense for application doing mostly fullscreen things like games.
 */
qx.Class.define("unify.view.StaticView",
{
  extend : qx.core.Object,
  include : [qx.locale.MTranslation],
  type : "abstract",


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the view appears on the screen */
    "appear" : "qx.event.type.Event",

    /** Fired when the view disappears on the screen */
    "disappear" : "qx.event.type.Event",

    /** Fired every time the title may have changed through new conditions */
    "changeTitle" : "qx.event.type.Event"
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Attached view manager instance */
    manager : 
    {
      check : "unify.view.ViewManager",
      nullable : true
    },
    
    /** Reference to master view manager (this view can not be registered there) */
    master : 
    {
      check : "unify.view.ViewManager",
      nullable : true,
      apply : "_applyMaster"
    },
    
    /** The parent of the view. This is normally managed automatically by the ViewManager */
    parent :
    {
      check : "unify.view.StaticView",
      nullable : true,
      event : "changeParent"
    },

    /** Whether the view is active */
    active :
    {
      check : "Boolean",
      init : false,
      apply : "_applyActive",
      event : "changeActive"
    },

    /** The current param of this view (for dynamic content) */
    param :
    {
      check : "String",
      nullable : true,
      apply : "_applyParam"
    },

    /** Support for segment switches in the view */
    segment :
    {
      check : "String",
      nullable : true,
      apply : "_applySegment",
      event : "changeSegment"
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
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /** {unify.ui.Layer} Stores the layer instance of the view. */
    __layer : null,


    /**
     * Returns the ID of the view. This ID is constructed by its classname
     *
     * @return {String} View ID
     */
    getId : function() {
      return qx.lang.String.hyphenate(this.constructor.basename).substring(1);
    },


    /**
     * Parametrized views may have a default parameter which is
     * auto-selected by the view manager when no explicit parameter
     * is given.
     *
     * @return {String|null} Default to <code>null</code>
     */
    getDefaultSegment : function() {
      return null;
    },


    /**
     * Returns the layer of this view. Dynamically creates it if not yet happened.
     *
     * @final
     * @return {unify.ui.Layer} Layer instance
     */
    getLayer : function() {
      return this.__layer || this.create();
    },


    /**
     * Returns the DOM element of this view.
     *
     * @return {Element} DOM element of the view (root element)
     */
    getElement : function() {
      return this.getLayer().getElement();
    },


    /**
     * Returns the title of the view
     *
     * @param type {String} One of "short", "title-bar", "tab-bar", "up", etc. Support depends on view.
     * @return {String} Title of the view
     */
    getTitle : function(type) {
      return "Default";
    },


    /**
     * Whether the DOM reprensentation of this view is created.
     *
     * @final
     * @return {Boolean} <code>true</code> when the layer is created
     */
    isCreated : function() {
      return !!this.__layer;
    },


    /**
     * Whether the view is rendered modally.
     *
     * This is useful for dialog to create items, complex
     * selections (date, time, ...), etc.
     *
     * @return {Boolean} Whether the view is modal.
     */
    isModal : function() {
      return false;
    },




    /*
    ---------------------------------------------------------------------------
      LIFE CYCLE
    ---------------------------------------------------------------------------
    */

    /**
     * Create the DOM representation of the view
     *
     * @final override {@link #_createView} instead
     */
    create : function()
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (this.__layer) {
          throw new Error(this.toString + ": Is already created!");
        }
      }

      // Create and store layer reference
      var now = (new Date).valueOf();
      var layer = this.__layer = this._createView();
      this.debug("Created in: " + ((new Date).valueOf() - now) + "ms");

      return layer;
    },


    // property apply
    _applyActive : function(value, old)
    {
      if (value)
      {
        // Check whether we need to create the layer
        if (!this.__layer) {
          this.create();
        }

        this._resumeView();
      }
      else
      {
        this._pauseView();
      }
    },




    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE INTERFACE
    ---------------------------------------------------------------------------
    */

    /**
     * Method which creates the layer required by {@link #getLayer}. This should
     * be overwritten in derived classes to create the visual representation as
     * needed.
     *
     * @abstract
     * @return {unify.ui.Layer} Return the layer instance of this view.
     */
    _createView : function()
    {
      if (qx.core.Variant.isSet("qx.debug", "on")) {
        throw new Error(this.toString() + " needs implementation for _createView()!")
      }
    },


    /**
     * This method is executed when the view is going to be activated.
     */
    _resumeView : function() {
      // Nothing to do here
    },


    /**
     * This method is executed when the view is going to be deactivated.
     */
    _pauseView : function() {
      // Nothing to do here
    },



    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY
    ---------------------------------------------------------------------------
    */
    
    // property apply
    _applyMaster : function(value, old) 
    {
      if (value) {
        this.debug("Show button for MasterViewManager: " + value);
      }
      else {
        this.debug("Hide button for MasterViewManager: " + old);
      }
    },
    
    
    // property apply
    _applyParam : function() {
      // nothing to do here
    },


    // property apply
    _applySegment : function() {
      // nothing to do here
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this.__layer = null;
  }
});
