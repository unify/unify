/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Implementation for simple storage based on PhoneGap APIs.
 */
qx.Class.define("unify.storage.simple.PhoneGap",
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
      return unify.bom.client.Extension.PHONEGAP;
    },
    
    getPriority : function() {
      return 80;
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
      return 
    },
    
    getItem : function(key) {
      return 
    },
    
    removeItem : function(key) {
      return 
    },    
    
    getLength : function() {
      return 
    },
    
    clear : function() {
      return 
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
