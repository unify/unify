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

    // Connect to view events
    view.addListener("appear", this.__onViewAppear, this);

    // Connect to global events
    qx.event.Registration.addListener(window, "resize", this.__onWindowResize, this);
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
      elem.innerHTML = '<div class="left"></div><div class="center"></div><div class="right"></div>';
      elem.className = this._cssClassName;

      return elem;
    },



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    __hasChanges : true,

    /**
     * Dynamic sizing of the center component of the bar
     *
     * @param context {String?null} Hint of change when something has changed
     */
    _syncLayout : function(context)
    {
      if (context) {
        this.__hasChanges = true;
      }

      if (!this.__view.isActive() || !this.__hasChanges) {
        return;
      }

      // Detect available width
      // ClientWidth check is faster than the function call which is needed,
      // but helps to find out quickly whether the element is visible
      var elem = this.getElement();
      if (elem.clientWidth == 0) {
        return;
      }

      var availWidth = qx.bom.element2.Dimension.getContentWidth(elem);

      // Important to reset this flag after the size has been computed successfully
      this.__hasChanges = false;

      // Lay out out center element for easy query/modify
      var centerElem = this.query(".center");
      var centerStyle = centerElem.style;

      // Reset old modifications
      centerStyle.marginRight = centerStyle.marginLeft = 0;
      centerStyle.width = "auto";

      // Measure cells
      var leftWidth = this.query(".left").offsetWidth;
      var centerWidth = centerElem.offsetWidth;
      var rightWidth = this.query(".right").offsetWidth;

      // Check whether the center can be shown completely
      var centerMaxWidth = availWidth - leftWidth - rightWidth;
      if (centerMaxWidth > centerWidth)
      {
        var maxColWidth = Math.max(leftWidth, rightWidth);
        var perfectWidth = availWidth - (maxColWidth * 2);

        if (perfectWidth > centerWidth)
        {
          // this.debug("Width correction to: " + perfectWidth);
          centerStyle.width = perfectWidth + "px";

          if (leftWidth < maxColWidth) {
            centerStyle.marginLeft = (maxColWidth - leftWidth) + "px";
          } else {
            centerStyle.marginRight = (maxColWidth - rightWidth) + "px";
          }
        }
        else
        {
          var correction = availWidth - centerWidth - leftWidth - rightWidth;
          // this.debug("Margin correction: " + correction);

          if (leftWidth < rightWidth) {
            centerStyle.marginLeft = correction + "px";
          } else {
            centerStyle.marginRight = correction + "px";
          }
        }
      }
      else
      {
        centerStyle.width = centerMaxWidth + "px";
      }
    },




    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Event listner for appear event of attached view
     */
    __onViewAppear : function() {
      this._syncLayout();
    },


    /**
     * Event listner for window resize event
     */
    __onWindowResize : function() {
      this._syncLayout("resize");
    },




    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Adds the given element
     *
     * @param config {Map} Configuration for element to add
     * @return {Element} Created DOM element
     */
    add : function(config)
    {
      var itemElem;

      if (config instanceof unify.ui.Abstract)
      {
        this.query(".center").appendChild(config.getElement());
        return;
      }

      if (config.elem)
      {
        itemElem = config.elem;
      }
      else if (config.href)
      {
        itemElem = document.createElement("a");
        itemElem.href = config.href;

        if (config.rel) {
          itemElem.setAttribute("rel", config.rel);
        }
      }
      else if (config.rel || config.jump || config.exec)
      {
        itemElem = document.createElement("div");

        if (config.rel) {
          itemElem.setAttribute("rel", config.rel);
        }

        if (config.jump) {
          itemElem.setAttribute("goto", config.jump);
        }  else if (config.exec) {
          itemElem.setAttribute("exec", config.exec);
        }
      }
      else
      {
        itemElem = document.createElement("div");
      }

      itemElem.className += " tool-button";

      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }

      var target = config.target || "center";
      var targetElem = this.query("." + target);
      if (!targetElem)
      {
        this.error("Unsupported target: " + config.target);
        return;
      }

      targetElem.appendChild(itemElem);

      // Schedule layout sync
      this._syncLayout(target);

      return itemElem;
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__view.removeListener("appear", this.__onViewAppear, this);
    this.__view = null;

    qx.event.Registration.removeListener(window, "resize", this.__onWindowResize, this);
  }
});
