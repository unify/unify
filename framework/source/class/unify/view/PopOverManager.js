/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

qx.Class.define("unify.view.PopOverManager",
{
  extend : qx.core.Object,
  
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  construct : function()
  {
    this.base(arguments);
    
    
  },
  
  
  
  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */  
  
  properties : 
  {
    visible : 
    {
      check : "Boolean",
      init : false,
      apply : "_applyVisible"
    },
    
    viewManager : 
    {
      check : "unify.view.ViewManager",
      apply : "_applyViewManager",
      nullable : true
    }
  },
  


  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */
  
  statics : 
  {
    
  },
  
  
  
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
    
  members :
  {
    _applyViewManager : function(value, old)
    {
      if (old) {
        this.getElement().removeChild(old.getElement());
      }

      if (value) {
        this.getElement().appendChild(value.getElement());
      }
    },
    
    _applyVisible : function(value, old)
    {
      var elem = this.__element;
      if (value)
      {
        if (!elem) {
          elem = this.getElement();
        }
        
        elem.style.display = "";
      }
      else if (elem)
      {
        elem.style.display = "none";
      }
    },
    
    getElement : function()
    {
      var elem = this.__element;
      if (!elem) 
      {
        elem = this.__element = document.createElement("div");
        elem.className = "pop-over";
        elem.style.display = "none";
        document.body.appendChild(elem);
      }
      
      return elem;
    },
    
    hasViewManager : function() {
      return !!this.getViewManager();
    }
  }
})