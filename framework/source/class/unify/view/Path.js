qx.Class.define("unify.view.Path",
{
  statics :
  {
    __urlMatcher : /^([a-z-]+)(\.([a-z-]+))?(\:([a-zA-Z0-9_-]+))?$/,
    
    parseFragment : function(fragment)
    {
      var match = this.__urlMatcher.exec(fragment);
      return {
        view : RegExp.$1 || null,
        segment : RegExp.$3 || null,
        param : RegExp.$5 || null
      };
    }
  }
});
