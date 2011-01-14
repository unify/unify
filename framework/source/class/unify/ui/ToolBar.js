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
     PROPERTIES
  *****************************************************************************
  */
  
  construct : function(items)
  {
    this.base(arguments);
    
    this.__items = items;
    
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    parent : 
    {
      check : "unify.view.StaticView",
      nullable : true,
      apply : "_applyParent"
    },
    
    master :
    {
      check : "unify.view.StaticView",
      nullable : true,
      apply : "_applyMaster"
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
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _createElement : function()
    {
      var elem = document.createElement("div");
      elem.className = "tool-bar";

      return elem;
    },
    
    



    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Defines the items to show inside the toolbar
     *
     * @param items {Map[]} List of single item configurations
     */
    setItems : function(items)
    {
      var elem = this.getElement();
      var itemElem;

      for (var i=0, l=items.length; i<l; i++)
      {
        itemElem = this.__createItemElement(items[i]);
        elem.appendChild(itemElem);
      }
    },
    
    
    
    
    
    /*
    ---------------------------------------------------------------------------
      PRIVATE METHODS
    ---------------------------------------------------------------------------
    */
        
    __onChangeSegment : function(e)
    {
      var segmented = e.getTarget().getElement().querySelector(".segmented");
      var Class = qx.bom.element2.Class;
      
      if (segmented)
      {
        var old = segmented.querySelector(".selected");
        if (old) {
          Class.remove(old, "selected");
        }
        
        var next = segmented.querySelector("[goto='." + e.getData() + "']");
        if (next) {
          Class.add(next, "selected");
        }
      }
    },
    
    
    __createSegmentButtonElement : function(config, selected)
    {
      var buttonElem = document.createElement("div");
      buttonElem.setAttribute("goto", "." + config.segment);
      buttonElem.className = config.segment == selected ? "button selected" : "button";

      if (config.label) {
        buttonElem.innerHTML = config.label;
      } else if (config.icon) {
        buttonElem.innerHTML = "<div/>";
      }
      
      return buttonElem;
    },
    
    
    __createItemElement : function(config)
    {
      var itemElem;
      
      if (config.kind == "spacer")
      {
        itemElem = document.createElement("div");
      }
      else if (config.kind == "segmented")
      {
        itemElem = document.createElement("div");

        var view = config.view;
        var segment = view.getSegment();
        
        var buttons = config.buttons;
        for (var i=0, l=buttons.length; i<l; i++) {
          itemElem.appendChild(this.__createSegmentButtonElement(buttons[i], segment));
        }
        
        view.addListener("changeSegment", this.__onChangeSegment, this);
      }
      else if (config.kind == "header")
      {
        itemElem = document.createElement("h1");
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

      // Add kind as CSS class
      if (config.kind) {
        qx.bom.element2.Class.add(itemElem, config.kind);
      }

      if (config.style) {
        qx.bom.element2.Class.add(itemElem, config.style);
      }
      
      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }
      
      return itemElem;
    }
  }
});
