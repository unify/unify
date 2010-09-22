/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**

 * Interface for simple storage implementations.
 * 
 */
qx.Interface.define("unify.storage.simple.ISimple",
{
  members : 
  {
    setItem : function(key, value) {},
    
    getItem : function(key) {},
    
    removeItem : function(key) {},    
    
    getLength : function() {},
    
    clear : function() {}    
  }
});
