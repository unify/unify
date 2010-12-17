/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

qx.Class.define("unify.bom.Storage",
{
  statics :
  {
    __localStorage : !!window.localStorage,
    __prefix : null,
    
    /**
     * Stores the give value under the given key. The storage is permanentely but might
     * be limited in overall available size.
     *
     * @param key {String} Application-wide unique key
     * @param value {String} String value to store (JSON needs serialization first)
     */
    set : function(key, value)
    {
      if (this.__localStorage) {
        localStorage.setItem(this.__prefix + key, value);
      } else {
        qx.bom.Cookie.set(this.__prefix + key, value);
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
      if (this.__localStorage) {
        return localStorage.getItem(this.__prefix + key);
      } else {
        return qx.bom.Cookie.get(this.__prefix + key);
      }     
    },
    
    /**
     * Removes the key under the given name
     *
     * @param key {String} Application-wide unique key
     */
    remove : function(key) 
    {
      if (this.__localStorage) {
        localStorage.remove(this.__prefix + key);
      } else {
        qx.bom.Cookie.del(this.__prefix + key);
      }
    }
  },
  
  defer : function(statics) 
  {
    var appId = qx.core.Setting.get("qx.application");
    statics.__prefix = appId.substring(0, appId.indexOf(".")) + "/";
  }
});