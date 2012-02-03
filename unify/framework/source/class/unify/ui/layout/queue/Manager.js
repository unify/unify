core.Module("unify.ui.layout.queue.Manager", {
  __timer : null,
  __registration : [],
  __callstack : [],
  __schedule : {},
  
  scheduleFlush : function() {
    if (!this.__timer) {
      this.__timer = window.setTimeout(this.__flush.bind(this), 0);
    }
  },
  
  flush : function() {
    if (this.__timer) {
      window.clearTimeout(this.__timer);
    }
    
    this.__flush();
  },
  
  register : function(name, callback, context, dependsOn) {
    if (core.Env.getValue("debug")) {
      if (!name) {
        throw new Error("Parameter name not set");
      }
      if (!callback) {
        throw new Error("Parameter callback not set");
      }
    }
    
    if (this.__timer) {
      window.clearTimeout(this.__timer);
    }
    
    var registration = this.__registration;
    // Make list
    registration.push({
      name: name,
      callback: callback,
      content: context,
      dependsOn: dependsOn
    });
    
    this.__calculateDependencies();
  },
  
  __calculateDependencies : function() {
    var r = this.__registration;
    
    var independent = [];
    var dependent = [];
    
    for (var i=0,ii=r.length; i<ii; i++) {
      var item = r[i];
      var depends = item.dependsOn;
      if (depends && "string" == typeof(depends)) {
        depends = [depends];
      }
      
      if (!depends) {
        independent.push(item.name);
      } else {
        var pos = 0;
        for (var j=0,jj=dependent.length; j<jj; j++) {
          if (depends.contains(dependent[j].name)) {
            pos = j+1;
          }
        }
        dependent.insertAt(item.name, pos);
      }
    }
    this.__callstack = independent.concat(dependent);
  },
  
  clear : function() {
    if (this.__timer) {
      window.clearTimeout(this.__timer);
      this.__timer = null;
    }
    this.__registration = [];
    this.__callstack = [];
    this.__schedule = {};
  },
  
  __getCallback : function(name) {
    var registration = this.__registration;
    for (var i=0,ii=registration.length; i<ii; i++) {
      var reg = registration[i];
      if (reg.name == name) {
        return reg;
      }
    }
    
    return null;
  },
  
  run : function(name) {
    if (core.Env.getValue("debug")) {
      if (!name) {
        throw new Error("Parameter name not set");
      }
    }
    
    this.__schedule[name] = true;
    this.scheduleFlush();
  },
  
  __flush : function() {
    this.__timer = null;
    
    var schedule = this.__schedule;
    var callstack = this.__callstack;

    for (var i=0,ii=callstack.length; i<ii; i++) {
      var key = callstack[i];
      if (schedule[key]) {
        var runner = this.__getCallback(key);
        if (runner) {
          runner.callback.call(runner.context);
        } else if (core.Env.getValue("debug")) {
          throw new Error("No callback for name " + name + " registered");
        }
      }
    }
  }
});