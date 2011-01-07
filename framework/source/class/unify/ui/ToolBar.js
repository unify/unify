/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This is the basic ToolBar class for Unify interfaces. It supports
 * buttons being centered or aligned left hand and right hand side.
 */
qx.Class.define("unify.ui.ToolBar",
{
  extend : unify.ui.Abstract,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param view {unify.view.StaticView} View to connect to
   */
  construct : function(view)
  {
    this.base(arguments);

    if (qx.core.Variant.isSet("qx.debug", "on"))
    {
      if (!view || !(view instanceof unify.view.StaticView)) {
        throw new Error("Invalid view: " + view);
      }
    }

    // Remember attached view
    this.__view = view;
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

    __view : null,

    /**
     * Returns the attached view instance
     *
     * @return {unify.view.StaticView} The view instance
     */
    getView : function() {
      return this.__view || null;
    },



    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */

    /** {String} CSS class name to apply */
    _cssClassName : "tool-bar",

    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.className = this._cssClassName;

      return elem;
    },




    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */
    
    __createItemElement : function(config)
    {
      var itemElem;
      
      if (config.href)
      {
        itemElem = document.createElement("a");
        itemElem.href = config.href;

        if (config.rel) {
          itemElem.setAttribute("rel", config.rel);
        }
      }
      else if (config.rel || config.jump || config.exec || config.show)
      {
        itemElem = document.createElement("div");

        if (config.rel) {
          itemElem.setAttribute("rel", config.rel);
        }

        if (config.jump) {
          itemElem.setAttribute("goto", config.jump);
        } else if (config.exec) {
          itemElem.setAttribute("exec", config.exec);
        } else if (config.show) {
          itemElem.setAttribute("show", config.show);
        }
      }
      else
      {
        itemElem = document.createElement("div");
      }


      if (item.style) {
        itemElem.className += " " + item.style;
      }
      
      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }
      
      return itemElem;
    },
    

    /**
     * Adds the given element
     *
     * @param config {Map} Configuration for element to add
     * @return {Element} Created DOM element
     */
    add : function(config)
    {
      var itemElem;

      if (config instanceof unify.ui.Abstract) {
        itemElem = config.getElement();
      } else {
        itemElem = this.__createItemElement(config)
      }

      this.getElement().appendChild(itemElem);
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__view = null;
  }
});
