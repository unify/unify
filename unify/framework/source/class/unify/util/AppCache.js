(function() {

  var appCache = window.applicationCache;
  
  core.Module("unify.util.AppCache", {
    /**
     * {Boolean} Start application caching in browser, returns <code>false</code> if app cache is not supported.
     */
    start : function() {
      if (!!appCache) {
        var iframe = document.createElement("iframe");
        core.bom.Style.set(iframe, {
          position: "absolute",
          top: "-5000px",
          width: "1px",
          height: "1px"
        });
        
        iframe.src = 'index-' + core.Env.CHECKSUM + '.html';
        
        document.body.appendChild(iframe);
        
        return true;
      } else {
        return false;
      }
    },
    
    /**
     * {String|null} Return application cache status or null if not supported
     */
    status : function() {
      if (!appCache) {
        return null;
      }
      
      switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
          return 'UNCACHED';
          break;
        case appCache.IDLE: // IDLE == 1
          return 'IDLE';
          break;
        case appCache.CHECKING: // CHECKING == 2
          return 'CHECKING';
          break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
          return 'DOWNLOADING';
          break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 4
          return 'UPDATEREADY';
          break;
        case appCache.OBSOLETE: // OBSOLETE == 5
          return 'OBSOLETE';
          break;
        default:
          return 'UKNOWN CACHE STATUS';
          break;
      };
    }
  });

})();