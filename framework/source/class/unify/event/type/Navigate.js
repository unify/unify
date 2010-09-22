/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Event fired by {@link unify.view.mobile.NavigationManager}.
 */
qx.Class.define("unify.event.type.Navigate",
{
  extend : qx.event.type.Event,

  members :
  {
    /** {String} Current path */
    __path : null,

    /** {String} Previous path */
    __mode : null,


    /**
     * Returns current path
     *
     * @return {unify.view.mobile.NavigationPath} the path
     */
    getPath : function() {
      return this.__path;
    },
    
    
    /**
     * Returns the mode in relation to the previous path
     *
     * @see unify.view.mobile.NavigationManager#__computeMode
     * @return {String} the mode
     */
    getMode : function() {
      return this.__mode;
    },    
    
    
    /**
     * Initializes an event object.
     *
     * @param path {String} Current path
     * @param mode {String} Mode of movement
     *
     * @return {unify.event.type.Navigation} the initialized instance.
     */
    init : function(path, mode)
    {
      this.base(arguments, false, false);

      this.__path = path;
      this.__mode = mode;

      return this;
    },


    /**
     * Get a copy of this object
     *
     * @param embryo {unify.event.type.Navigation?null} Optional event class, which will
     *     be configured using the data of this event instance. The event must be
     *     an instance of this event class. If the data is <code>null</code>,
     *     a new pooled instance is created.
     *
     * @return {unify.event.type.Navigation} a copy of this object
     */
    clone : function(embryo)
    {
      var clone = this.base(arguments, embryo);

      clone.__path = this.__path;
      clone.__mode = this.__mode;
                  
      return clone;
    }
  }
});
