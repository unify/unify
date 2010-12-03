qx.Class.define("unify.view.Path",
{
  extend : qx.type.BaseArray,
  
  members : 
  {
    __modified : false,
    
    clone : function()
    {
      var clone = new unify.view.Path;
      var entry;
      for (var i=0, l=this.length; i<l; i++) 
      {
        entry = this[i];
        clone.push({
          view : entry.view,
          segment : entry.segment,
          param : entry.param
        });
      }
      
      return clone;
    },
    
    serialize : function()
    {
      var result = [];
      var part, temp;
      for (var i=0, l=this.length; i<l; i++) 
      {
        part = this[i];
        temp = part.view;
        if (part.segment) {
          temp += "." + part.segment;
        }
        if (part.param) {
          temp += ":" + part.param;
        }
        result.push(temp)
      }
      
      return result.join("/");
    }
  },
  
  statics :
  {
    fromString : function(str)
    {
      var obj = new unify.view.Path;
      
      if (str.length > 0) 
      {
        var fragments = str.split("/");
        for (var i=0, l=fragments.length; i<l; i++) {
          obj.push(this.parseFragment(fragments[i]));
        }
      }
      
      return obj;
    },
    
    
    __fragmentMatcher : /^([a-z-]+)?(\.([a-z-]+))?(\:([a-zA-Z0-9_-]+))?$/,
    
    parseFragment : function(fragment)
    {
      this.__fragmentMatcher.exec(fragment);
      return {
        view : RegExp.$1 || null,
        segment : RegExp.$3 || null,
        param : RegExp.$5 || null
      };
    }
  }
});
