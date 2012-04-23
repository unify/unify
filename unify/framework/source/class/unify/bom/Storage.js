/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Local storage abstraction and helper class
 */
(function(global) {
  var prefix = (core.Env.getValue("application") || "default") + "/";
  var localStorage = global.localStorage;
  var hasLocalStorage = !!localStorage;
  
  core.Module("unify.bom.Storage", {
    /**
     * Stores the give value under the given key. The storage is permanentely but might
     * be limited in overall available size.
     *
     * fires an event if storing fails because of quota. The application should listen to this event and clean up
     *
     * @param key {String} Application-wide unique key
     * @param value {String} String value to store (JSON needs serialization first)
     */
    set : function(key, value)
    {
      if (hasLocalStorage) {
        /* TODO: if (core.Evn.getValue("os.name") == "ios" && parseFloat(core.Env.getValue("os.version") || 0) < 4.2) {
            //TODO find out exact version of fix (some time between 3.2 and 4.2)
            //fixes problem with QUOTA_EXCEEDED_ERR on older ios versions see http://stackoverflow.com/questions/2603682/
            localStorage.removeItem(this.__prefix + key, value);
        }*/
        try{
          localStorage.setItem(prefix + key, value);
        } catch(ex){
          if(ex.name=='QUOTA_EXCEEDED_ERR'){
            lowland.events.EventManager(this, 'quota_exceeded_err');
          } else {
            throw ex;
          }
        }
  
      } else {
        //TODO: Cookie.set(this.__prefix + key, value);
      }
    },
    
    /**
     * Returns the data stored under the given key.
     *
     * @param key {String} Application-wide unique key
     * @return {String} Returns the string value (JSON data needs parsing afterwards)
     */
    get : function(key) 
    {
      if (hasLocalStorage) {
        var val = localStorage.getItem(prefix + key);
        return val;
      } else {
        //TODO: return Cookie.get(this.__prefix + key);
      }     
    },
    
    /**
     * Removes the key under the given name
     *
     * @param key {String} Application-wide unique key
     */
    remove : function(key) 
    {
      if (hasLocalStorage) {
        localStorage.removeItem(prefix + key);
      } else {
        // TODO: Cookie.del(this.__prefix + key);
      }
    }
  });
})(this);
