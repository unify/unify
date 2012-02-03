/**
 * @require {core.ext.Object}
 * @require {core.ext.String}
 * @require {core.ext.Function}
 */
core.Class("unify.core.Object", {
  include : [core.property.MGeneric],
  implement : [core.property.IEvent],
  
  construct : function() {
    this.__$$userdata = {};
  },
  
  members : {
    fireEvent : function(type, value, old) {
    },
    
    fireDataEvent : function(type, value, old) {
    },
    
    setUserData : function(key, value) {
      this.__$$userdata[key] = value;
    },
    
    getUserData : function(key) {
      return this.__$$userdata[key];
    },
    
    addListener : function(event, callback, context) {
    }
  }
});