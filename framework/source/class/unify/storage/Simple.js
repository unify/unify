/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
qx.Class.define("unify.storage.Simple",
{
  statics :
  {
    /** {Map} All supported backends */
    __backends : {},
    
    /**
     * Registers a backend aka implementation.
     * 
     * @param clazz {Class} Backend to register
     * 
     * 
     */
    registerSynchronous : function(clazz) 
    {
      if (!clazz.isSupported()) {
        return;
      }
      
      this.__backends[clazz.classname] = clazz;
    },
    
    
    register : function(clazz)
    {
      if (!clazz.isSupported()) {
        return;
      }
      
      
    },
    
    
    /**
     *
     * 
     */
    __createBackend : function() 
    {
      var clazz, backend;
      var all = this.__backends;
      var max = -1;
      
      for (var classname in all) 
      {
        clazz = all[classname];
        if (clazz.getPriority() > max)
        {
          max = clazz.getPriority();
          backend = clazz;
        }        
      }
      
      if (backend) {
        this.__backend = backend;
      } else if (qx.core.Variant.isSet("qx.debug", "on")) {
        throw new Error("No storage backend found!");
      }
    },
    
    
    /**
     *
     * 
     */
    setItem : function(key, value) 
    {
      var backend = this.__backend || this.__createBackend();
      return backend.setItem(key, value);
    },
    
    getItem : function(key)
    {
      var backend = this.__backend || this.__createBackend();
      return backend.getItem(key);
    },
    
    removeItem : function(key)
    {
      var backend = this.__backend || this.__createBackend();
      return backend.removeItem(key);
    },
    
    getLength : function()
    {
      var backend = this.__backend || this.__createBackend();
      return backend.getLength();
    },
    
    clear : function()
    {
      var backend = this.__backend || this.__createBackend();
      return backend.clear();
    }
  }  
});
