/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Implementation for simple storage based on HTML5 local storage.
 * 
 * Adds support for namespacing to run multiple applications on the same domain.
 */
qx.Class.define("unify.storage.simple.LocalStorage",
{
  extend : qx.core.Object,
  type : "singleton",
  implement : unify.storage.simple.ISimple,  


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  
  construct : function()
  {
    this.base(arguments);
    
    this.__prefix = qx.core.Init.getApplication().getNamespace() + "/";
  },
  
  
  
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */  

  statics : 
  {
    isSupported : function() {
      return !!window.localStorage;
    },
    
    getPriority : function() {
      return 100;
    }
  },
  
  
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */  
  
  members :
  {
    __prefix : null,
    
    setItem : function(key, value) {
      return localStorage[this.__prefix + key] = value;
    },
    
    getItem : function(key) {
      return localStorage[this.__prefix + key];
    },
    
    removeItem : function(key) {
      return delete localStorage[this.__prefix + key];
    },    
    
    getLength : function() {
      return localStorage.length;
    },
    
    clear : function() {
      return localStorage.clear();
    }
  },
  
  
  
  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */
    
  defer : function(statics) 
  {
    if (statics.isSupported()) {
      unify.storage.Simple.register(statics);
    }
  }
});

