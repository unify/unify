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
  
  construct : function(items)
  {
    this.base(arguments);
    
    this.__items = items;
    
  },
  
  
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
  
  members :
  {
    __items : null,
    
    /*
    ---------------------------------------------------------------------------
      OVERRIDEABLE METHODS
    ---------------------------------------------------------------------------
    */
    
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
        itemElem = this._createItemElement(items[i]);
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
      var 
        Class = qx.bom.element2.Class,
        allSegmented = e.getTarget().getElement().querySelectorAll(".segmented");
        
      for (var i = 0, l =  allSegmented.length; i < l; i += 1) 
      {
        if (allSegmented[i])
        {
          var old = allSegmented[i].querySelector(".selected");
          if (old) 
          {
            Class.remove(old, "selected");
          }

          var next = allSegmented[i].querySelector("[goto='." + e.getData() + "']");
          if (next) 
          {
            Class.add(next, "selected");
          }
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
    
    
    _createItemElement : function(config)
    {
      var itemElem;
      
      // create base element
      itemElem = document.createElement(config.kind == "header" ? "h1" : "div");
      
      // special segment handling
      if (config.kind == "segmented")
      {
        var view = config.view;
        var segment = view.getSegment();
        
        var buttons = config.buttons;
        for (var i=0, l=buttons.length; i<l; i++) {
          itemElem.appendChild(this.__createSegmentButtonElement(buttons[i], segment));
        }
        view.addListener("changeSegment", this.__onChangeSegment, this);
      }
      
      // rel is independently usable
      if (config.rel) {
        itemElem.setAttribute("rel", config.rel);
      }
      
      // there can be only one of [jump, exec, show]
      if (config.jump) {
        itemElem.setAttribute("goto", config.jump);
      } else if (config.exec) {
        itemElem.setAttribute("exec", config.exec);
      } else if (config.show) {
        itemElem.setAttribute("show", config.show);
      }
      
      // spacer sizing
      if (config.size) {
        itemElem.setAttribute("style", 'max-width: ' + config.size + '; min-width: ' + config.size + ';');
      }
      
      // add kind as CSS class
      if (config.kind) {
        qx.bom.element2.Class.add(itemElem, config.kind);
      }
      
      // add additional classes
      if (config.addclass) {
        qx.bom.element2.Class.add(itemElem, config.addclass);
      }
      
      if (config.style) {
        qx.bom.element2.Class.add(itemElem, config.style);
      }
      
      // add label or icon container
      if (config.label) {
        itemElem.innerHTML = config.label;
      } else if (config.icon) {
        itemElem.innerHTML = "<div/>";
      }
      
      return itemElem;
    }
  }
});
