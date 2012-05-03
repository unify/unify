/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * View class for simple services which have all the data
 * available synchronously e.g. through inlining during build. The data
 * itself must not change during runtime of the application.
 */
core.Class("unify.view.ServiceView",
{
  include : [unify.view.StaticView],


  construct : function() {
    unify.view.StaticView.call(this);
  },

  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  members :
  {
    /**
     * {String} Used internally to store the rendered variant. Needs to be undefined for views without parameters
     */
    __renderedVariant : undefined,



    /*
    ---------------------------------------------------------------------------
      IMPLEMEMTED METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _resumeView : function() {
      this._checkStatus();
    },

    // overridden
    _applyParam : function(value, old)
    {
      if (this.getActive()) {
        this._checkStatus();
      }
    },

    // overridden
    _applySegment : function(value, old)
    {
      if (this.getActive()) {
        this._checkStatus();
      }
    },



    /*
    ---------------------------------------------------------------------------
      PROTECTED API (FOR OVERRIDING)
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the business object. An instance of this class needs to
     * implement {@link unify.business.IBusinessObject} to being usable by this class.
     *
     * @abstract
     * @return {unify.business.IBusinessObject} Business object to use
     *
     */
    _getBusinessObject : function() {
      throw new Error("Please implement _getBusinessObject()");
    },


    /**
     * Returns the name of the service to call on the business object.
     *
     * @abstract
     * @return {String} Service to call on the business object
     */
    _getServiceName : function() {
      throw new Error("Please implement _getServiceName()");
    },


    /**
     * Returns a list of service parameters. Defaults to <code>null</code>
     * which is OK for simple views. Only override, when you need to send specific
     * parameters to the service.
     *
     * @return {Map|null} Parameters for service
     */
    _getServiceParams : function() {
      return null;
    },


    /**
     * Renders the given results to HTML and applies them to the GUI
     *
     * @param data {var} Data from the service
     */
    _renderData : function(data) {
      throw new Error("Please implement _renderData()");
    },


    /**
     * Returns a unique identifier for the variant to render at the moment.
     *
     * Used to identifiy complete content changes. Override this method to
     * use the <code>param</code> property for example, or some other information.
     *
     * @return {String} Unique ID for current rendered output
     */
    _getRenderVariant : function() {
      return null;
    },


    /**
     * Handler for errors on service level. Currently supported
     * error reasons:
     *
     * * "communication": IO error e.g. network down, server down
     * * "data": Data returned was not valid according to the response type
     * * "renderer": Error during rendering of data
     *
     * @param reason {var} Reason of error
     * @param detail {var} Detailed information e.g. status code, exception object, ...
     */
    _errorHandler : function(reason, detail)
    {
      this.error("Reason: " + reason);

      if (detail != null) {
        this.error("Detail: " + detail);
      }

      this.error("Please implement _errorHandler()");
    },


    /**
     * Checks whether the current changes requires a re-rendering and
     * runs it when necessary.
     */
    _checkStatus : function()
    {
      var variant = this._getRenderVariant();
      if (variant !== this.__renderedVariant)
      {
        var data = this._getBusinessObject().read(this._getServiceName(), this._getServiceParams());
        this.__renderedVariant = variant;
        this._wrappedRenderData(data);
      }
    },


    /**
     * Renders the given data to the view.
     *
     * Private method to add error handling and performance measurement to the
     * derivable method {@link #_renderServiceData}
     *
     * @param data {var} Data to render
     */
    _wrappedRenderData : function(data)
    {
      var now = (new Date).valueOf();
      /*try{*/
        this._renderData(data);
        
        // Do explicit flush to prevent layouting while animate
        if (data) {
          unify.ui.layout.queue.Manager.flush();
        }
      /*} catch(ex) {
        this.error("Failed to render \"" + this._getServiceName() + "\" data: " + ex);
        this._errorHandler("renderer", ex);
      }*/
      if (core.Env.getValue("debug")) {
        this.debug("Rendered in: " + ((new Date).valueOf() - now) + "ms");
      }
    }
  }
});
