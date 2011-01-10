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
  
  properties :
  {
    title :
    {
      check : "String",
      nullable : true,
      apply : "_applyTitle"
    },
    
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
    
    
    _applyTitle : function(value, old)
    {
      var titleElem = this.__titleElem;
      
      if (value)
      {
        if (!titleElem) 
        {
          titleElem = this.__titleElem = document.createElement("h1");
          this.add(titleElem);
        }
        
        titleElem.innerHTML = value;
        titleElem.style.display = "block";
      }
      else if (titleElem)
      {
        titleElem.innerHTML = "";
        titleElem.style.display = "none";
      }
    },




    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */
    
    __createItemElement : function(config)
    {
      var itemElem;
      
      if (config.nodeType == 1)
      {
        itemElem = config;
      }
      else if (config.href)
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

      if (typeof config.style == "string") {
        itemElem.className += " " + config.style;
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
  }
});
