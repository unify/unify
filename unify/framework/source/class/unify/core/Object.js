
core.Class("unify.core.Object", {
  include : [lowland.Object],
  
  construct : function() {
    lowland.Object.call(this);
    lowland.ObjectManager.register(this);
  },
  
  members : {
    
    __disposed : false,
    
    /**
     * {Boolean} Returns if class instance is disposed and nothing should be executed on it.
     */
    isDisposed : function() {
      return this.__disposed;
    },
    
    /**
     * Dispose class instance.
     */
    dispose : function() {
      if (this.__disposed) {
        return;
      }
      
      this.__disposed = true;
      
      this.destruct();
    },
    
    _disposeArray : function(field) {
      var data = this[field];
      if (!data) {
        return;
      }
      
      for (var i=0,ii=data.length; i<ii; i++) {
        var d = data[i];
        if (d.dispose) {
          d.dispose();
        }
      }
      
      data.length = 0;
      this[field] = null;
    },
    
    _disposeObjects : function() {
      for (var i=1,ii=arguments.length; i<ii; i++) {
        var objName = arguments[i];
        var obj = this[objName];
        
        if (obj && obj.dispose) {
          obj.dispose();
        }
        this[objName] = null;
      }
    },
    
    /**
     * Destructor
     */
    destruct : function() {
      lowland.ObjectManager.unregister(this);
      lowland.Object.prototype.destruct.call(this);
    }
    
  }
});