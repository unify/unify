/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Experimental implementation of generic dialogs
 * Not for production
 *
 * @deprecated
 */
qx.Class.define("unify.ui.mobile.dialog.Dialog", {
  extend : unify.ui.mobile.Container,

  construct : function() {
    this.base(arguments);

    this._classNameBase = "dialog";
  },

  members : {
    __maskElement : null,
    __backgroundElement : null,
    __tabbarOldState : null,

    _classNameBase : null,

    /**
     * Handle tab bar switch
     * Decides if the dialog should handle tab bar
     */
    _handleTabBar : function() {
      return true;
    },

    /**
     * Show in view switch
     * Decides if the dialog is shown in view or as overlay
     */
    _showInView : function() {
      return false;
    },

    /**
     * Creates the mask element
     *
     * @return {Element} mask element
     */
    _createMaskElement : function()
    {
      var elem = document.createElement("div");
      qx.bom.element2.Class.add(elem, this._classNameBase + "-mask");
      return elem;
    },

    /**
     * Returns the parent layer mask to prevent interaction with parent
     *
     * @return {Element} mask element
     */
    getMaskElement : function() {
      var current = this.__maskElement;
      if (current) {
        return current;
      }

      current = this.__maskElement = this._createMaskElement();
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!current) {
          throw new Error(this.toString() + ": Implementation of _createElement did not return an element!");
        }
      }

      return current;
    },

    /**
     * Creates the background element
     *
     * @return {Element} background element
     */
    _createBackgroundElement : function()
    {
      var elem = document.createElement("div");
      qx.bom.element2.Class.add(elem, this._classNameBase + "-background");
      return elem;
    },

    /**
     * Returns the background of dialog overlay
     *
     * @return {Element} mask element
     */
    getBackgroundElement : function() {
      var current = this.__backgroundElement;
      if (current) {
        return current;
      }

      current = this.__backgroundElement = this._createBackgroundElement();
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!current) {
          throw new Error(this.toString() + ": Implementation of _createElement did not return an element!");
        }
      }

      return current;
    },

    /**
     * Shows the dialog.
     */
    show : function() {
      var BaseElement;
      if (this._showInView()) {
        BaseElement = unify.ui.mobile.LayerManager.getInstance().getLayer().getContentElement();
      } else {
        BaseElement = qx.core.Init.getApplication().getRoot();
      }

      var maskElement = this.getMaskElement();
      if (!maskElement.parentNode) {
        BaseElement.appendChild(maskElement);
      }


      var element = this.getElement();
      qx.bom.element2.Class.add(element, this._classNameBase);
      if (!element.parentNode) {
        var backgroundElement = this.getBackgroundElement();
        if (!backgroundElement.parentNode) {
          element.insertBefore(backgroundElement, element.firstChild);
        }
        BaseElement.appendChild(element);
      }

      this.__attachDefaultHandler();

      if (this._handleTabBar()) {
        var Tabbar = unify.ui.mobile.TabBar.getInstance();
        this.__tabbarOldState = Tabbar.isShown();
        if (this.__tabbarOldState) {
          Tabbar.hideImmediately();
        }
      }
    },

    /**
     * Hides the dialog.
     */
    hide : function() {
      var BaseElement;
      if (this._showInView()) {
        BaseElement = unify.ui.mobile.LayerManager.getInstance().getLayer().getContentElement();
      } else {
        BaseElement = qx.core.Init.getApplication().getRoot();
      }

      var element = this.getElement();
      if ((!element) || (!element.parentNode)) {
        return;
      }
      BaseElement.removeChild(element);

      this.__detachDefaultHandler();

      var maskElement = this.getMaskElement();
      BaseElement.removeChild(maskElement);

      if (this._handleTabBar() && this.__tabbarOldState) {
        unify.ui.mobile.TabBar.getInstance().reshowImmediately();
      }
    },

    /**
     * Attaches default listener on close buttons
     */
    __attachDefaultHandler : function() {
      var element = this.getElement();

      var closeButtons = qx.bom.Selector.query(".close", element);
      for (var i=0; i < closeButtons.length; i++) {
        qx.event.Registration.addListener(closeButtons[i], "tap", this.__defaultHandler, this);
      }
    },

    /**
     * Detaches default listener
     */
    __detachDefaultHandler : function() {
      var element = this.getElement();

      var closeButtons = qx.bom.Selector.query(".close", element);
      for (var i=0; i < closeButtons.length; i++) {
        qx.event.Registration.removeListener(closeButtons[i], "tap", this.__defaultHandler, this);
      }
    },

    /**
     * Default handler for close events
     *
     * @param e {Event} tap event
     */
    __defaultHandler : function(e) {
      this.hide();
    }
  }
});
