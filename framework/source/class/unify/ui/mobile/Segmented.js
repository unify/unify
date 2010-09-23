/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Segmented control
 */
qx.Class.define("unify.ui.mobile.Segmented",
{
  extend : unify.ui.mobile.Abstract,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(view)
  {
    this.base(arguments);

    if (qx.core.Variant.isSet("qx.debug", "on"))
    {
      if (!view || !(view instanceof unify.view.mobile.StaticView)) {
        throw new Error("Invalid view: " + view);
      }
    }

    // Remember attached view
    this.__view = view;

    // Sync selection
    var segment = view.getSegment();
    if (segment != null) {
      this.setSelected(segment);
    }

    // Register to segment change on view
    view.addListener("changeSegment", this.__onViewChangeSegment, this);
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    selected :
    {
      check : "String",
      event : "changeSelected",
      nullable : true,
      apply : "_applySelected"
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** {unify.view.mobile.StaticView} Attached view instance */
    __view : null,



    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.className = "segmented";

      return elem;
    },



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    // property apply
    _applySelected : function(value, old)
    {
      var Class = qx.bom.element2.Class;

      if (old)
      {
        var oldElem = this.query("[goto=" + old + "]");
        if (oldElem) {
          Class.remove(oldElem, "checked");
        }
      }

      if (value)
      {
        var newElem = this.query("[goto=" + value + "]");
        if (newElem) {
          Class.add(newElem, "checked");
        }
      }
    },


    /**
     * Event listener for view's changeSegment event
     *
     * @param e {qx.event.type.Data} Property data event
     */
    __onViewChangeSegment : function(e) {
      this.setSelected(e.getData());
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
      var elem = this.getElement();

      var buttonElem = document.createElement("div");
      buttonElem.setAttribute("goto", config.segment);
      buttonElem.setAttribute("rel", "segment");

      if (config.label) {
        buttonElem.innerHTML = config.label;
      } else if (config.icon) {
        buttonElem.innerHTML = "<div/>";
      }

      elem.appendChild(buttonElem);

      if (this.getSelected() == config.segment) {
        buttonElem.className = "checked";
      }

      return buttonElem;
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var view = this.__view;
    if (view)
    {
      view.removeListener("changeSegment", this.__onViewChangeSegment, this);
      this.__view = null;
    }
  }
});
