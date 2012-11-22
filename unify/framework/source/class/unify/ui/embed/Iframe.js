/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

core.Class('unify.ui.embed.Iframe', {

  include: [
    unify.ui.core.Widget
  ],


  /**
   * Constructor
   *
   * Creates a new instance of Iframe
   */
  construct: function() {
    // Call superclass'
    unify.ui.core.Widget.call(this);

    // Set (default) values
    this.__isLoading = false;
    this.__isLoaded = false;
  },


  /*
  ******************************************************************************
    PROPERTIES
  ******************************************************************************
  */

  properties: {

    /** {String} Initial appearance selector */
    appearance: {
      init: 'iframe'
    },

    /** {String} The source location for the iframe */
    src: {
      type: 'String',
      init: '',
      nullable: false,
      apply: function(newValue, oldValue) {
        if (newValue != oldValue) {
          this.__applySrc(newValue, oldValue);
        }
      }
    }

  },


  /*
  ******************************************************************************
    MEMBERS
  ******************************************************************************
  */

  members: {

    /*
    ----------------------------------------------------------------------------
      PRIVATE
    ----------------------------------------------------------------------------
    */

    /** {Boolean} Indicates whether or not this iframe is currently loading */
    __isLoading: null,

    /** {Boolean} Indicates whether or not this iframe is completely loaded */
    __isLoaded: null,


    /**
     * Apply source
     *
     * @param newValue {String} The new source
     * @param oldValue {String} Teh current source
     */
    __applySrc: function(newValue, oldValue) {
      this.__isLoading = false;
      this.__isLoaded = false;
    },


    // -------------------------------------------------------------------------
    // Event handler
    // -------------------------------------------------------------------------

    /**
     * Handler for onload
     *
     * Called whenever the source of the iframe has been completely loaded
     *
     * @param e {Event} The onload event
     */
    __onLoad: function(e) {
      // We know that the iframe's source has been loaded, so
      // we remove event listeners
      var elem = this.getElement();
      this.addNativeListener(elem, 'load', this.__onLoad, this);

      this.__isLoading = false;
      this.__isLoaded = true;
    },


    /*
    ----------------------------------------------------------------------------
      PROTECTED
    ----------------------------------------------------------------------------
    */

    /**
     * Create element
     *
     * @return {HTMLElement} Returns a newly created iframe element
     * @overridden
     */
    _createElement: function() {
      return document.createElement('iframe');
    },


    /*
    ----------------------------------------------------------------------------
      PUBLIC
    ----------------------------------------------------------------------------
    */

    /**
     * Load
     *
     * Applies the src property to the iframe's DOM attribute, which
     * should automatically trigger loading the web page.
     */
    load: function() {
      // Check, if we have a source URL to load
      var src = this.getSrc();
      if (!src || src == '') {
        return;
      }

      // Register event listeners
      var elem = this.getElement();
      this.addNativeListener(elem, 'load', this.__onLoad, this);

      // Load source
      elem.setAttribute('src', src);

      this.__isLoading = true;
      this.__isLoaded = false;
    }
  }

});
