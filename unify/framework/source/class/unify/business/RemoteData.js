/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Remote data business object with intelligent cache managment.
 *
 * * Uses unify.bom.Storage for storing data between application runs.
 * * Supports HTTP-proxying for cross-domain communication
 * * Supports basic HTTP authentification
 * * Make use of modification dates to optimize data loading via GET
 */
core.Class("unify.business.RemoteData",
{
  include : [unify.business.StaticData],



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  // overridden
  construct : function()
  {
    // TODO: RIGHT?
    unify.business.StaticData.call(this);

    /** {Map} In-Memory Cache */
    this.__cache = {};

    /** {Map} Custom http headers */
    this.__headers = {};

    /** {String} Prefix used for storage */
    var prefix = this.constructor.className.hyphenate().toLowerCase();
    this.__storageDataPrefix = prefix + "/data/";
    this.__storageMetaPrefix = prefix + "/meta/";
    // TODO : lowland.events.EventManager.addListener(unify.bom.Storage,"quota_exceeded_err",this.__onQuotaExceeded,this);
  },



  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired whenever a communication with a service has been completed.
     *
     * Identify whether the event is interesting for you by the events ID property.
     */
    "completed" : unify.business.CompletedEvent
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Whether client-side storage should be used to keep data when app is relaunched */
    enableStorage : {
      type : "Boolean",
      init : true
    },

    /** Whether the proxy should be enabled (globally) */
    enableProxy : {
      type : "Boolean",
      init : false
    },

    /**
     * Option for GET request to allow the request to be successful only, if the response
     * has changed since the last request. This is done by checking the Last-Modified header.
     */
    enableCacheRefresh : {
      type : "Boolean",
      init : true
    },

    /** Whether automatic conversion of xml format to json format should be executed */
    enableXmlConverter : {
      type : "Boolean",
      init : true
    },

    /** Whether it's OK no have no content from the service (HTTP 204 response)*/
    enableNoContent : {
      type : "Boolean",
      init : false
    },

    /** URL of proxy to fix cross domain communication */
    proxyUrl : {
      type : "String",
      init : "generic-proxy.appspot.com"
    },

    /** Request mime type */
    requestType : {
      type : ["application/x-www-form-urlencoded", "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/x-www-form-urlencoded"
    },

    /** Response mime type */
    responseType : {
      type : [ "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/json"
    },

    /** Time after communication should be regarded as failed (in seconds) */
    timeout : {
      type : "Integer",
      init : 10
    },

    /** Which authentication method is needed for all services */
    authMethod : {
      type : ["basic"],
      nullable : true
    },

    /** User name for authentification (basic auth) */
    user : {
      type : "String",
      nullable : true
    },

    /** Password for authentification (basic auth) */
    password : {
      type : "String",
      nullable : true
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      OVERRIDDEN
    ---------------------------------------------------------------------------
    */

    // overridden
    _readData : function(service, params)
    {
      var entry = this.getCachedEntry(service, params);
      return entry ? entry.data : null;
    },




    /*
    ---------------------------------------------------------------------------
      PUBLIC API :: CACHE
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the cache status for the given service.
     *
     * * 0: cache is disabled
     * * 1: nothing cached
     * * 2: cache is old
     * * 3: cache is valid
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {Integer} Number from 0-3 ass listed above
     */
    getCacheStatus : function(service, params)
    {
      var keep = this._getService(service).keep;
      if (!(keep > 0)) {
        return 0;
      }

      var checked = this.getCachedField(service, params, "checked");
      return checked != null ? Math.round((new Date - checked) / 1000) > keep ? 2 : 3 : 1;
    },


    /**
     * Whether the cache is available and valid
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {Boolean} Whether cached data is available and valid
     */
    isCacheValid : function(service, params) {
      return this.getCacheStatus(service, params) == 3;
    },


    /**
     * Whether there is a cache available for the given service. This method
     * does not check the age of the cache - just if it's available.
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {Boolean} Whether cached data is available
     */
    isCached : function(service, params)
    {
      var cacheId = this.__getCacheId(service, params);
      return !!(this.__cache[cacheId] || (this.getEnableStorage() && unify.bom.Storage.get(this.__storageMetaPrefix + cacheId)));
    },


    /**
     * Returns the value of the given field inside the cache for the given service.
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @param field {String} Any supported field name: "created", "checked", "modified" and "type"
     * @return {String|Number} Value stored on the given field or <code>null</code>
     */
    getCachedField : function(service, params, field)
    {
      var cacheId = this.__getCacheId(service, params);
      var cache = this.__cache;
      var entry = cache[cacheId];

      if (entry) {
        return entry[field] || null;
      }

      if (this.getEnableStorage())
      {
        var meta = unify.bom.Storage.get(this.__storageMetaPrefix + cacheId);
        if (meta != null)
        {
          meta = JSON.parse(meta);
          return meta[field] || null;
        }
      }

      return null;
    },


    /**
     * Reads an entry (all data stored for the given service/param combination) from the cache.
     *
     * Each entry consists of
     * the keys <code>data</code> and <code>type</code>
     * (the data and type of data) and the timestamps <code>created</code>,
     * <code>checked</code> and <code>modified</code>. There is also
     * an <code>id</code> which could be used in an easy way to compare
     * whether one have used the same version of cache entry before. This
     * ID is updated every time new data was loaded.
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {Map} Returns the entry as stored in the cache.
     */
    getCachedEntry : function(service, params)
    {
      var cacheId = this.__getCacheId(service, params);
      var cache = this.__cache;
      var entry = cache[cacheId] || null;
      if (!entry && this.getEnableStorage())
      {
        entry = unify.bom.Storage.get(this.__storageMetaPrefix + cacheId);
        if (entry)
        {
          entry = JSON.parse(entry);

          // Recover json/xml data
          var data = unify.bom.Storage.get(this.__storageDataPrefix + cacheId);
          var start;
          if (entry.type == "application/json")
          {
            start = new Date;
            data = JSON.parse(data);
            if (core.Env.getValue("debug")) {
              this.debug("Restored JSON in: " + (new Date - start) + "ms");
            }
          }
          else if (entry.type == "application/xml")
          {
            start = new Date;
            throw new Error("XML not supported now"); // TODO!!!
            data = xml.Document.fromString(data);
            if (core.Env.getValue("debug")) {
              this.debug("Recovered XML in: " + (new Date - start) + "ms");
            }
          }

          // Store data
          entry.data = data;

          // Parse timestamps
          entry.created = parseInt(entry.created, 10);
          entry.checked = parseInt(entry.checked, 10);

          // Copy over to in-memory cache
          cache[cacheId] = entry;
        }
      }

      return entry;
    },


    /**
     * Clears the cache for the given service & param combination. Also
     * deletes data stored on local storage.
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     */
    clearCache : function(service, params)
    {
      var cacheId = this.__getCacheId(service, params);
      delete this.__cache[cacheId];

      if (this.getEnableStorage())
      {
        unify.bom.Storage.remove(this.__storageMetaPrefix + cacheId);
        unify.bom.Storage.remove(this.__storageDataPrefix + cacheId);
      }
    },




    /*
    ---------------------------------------------------------------------------
      PUBLIC API :: REQUESTS
    ---------------------------------------------------------------------------
    */

    /**
     * Sends a OPTIONS request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    options : function(service, params) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "OPTIONS", id);
    },


    /**
     * Sends a GET request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    get : function(service, params) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "GET", id);
    },


    /**
     * Sends a POST request to the given service. Attaches the given data to the request.
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @param data {var} Data to attach
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    post : function(service, params, data) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "POST", id, data);
    },


    /**
     * Sends a PUT request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    put : function(service, params) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "PUT", id);
    },


    /**
     * Sends a DELETE request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    del : function(service, params) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "DELETE", id);
    },


    /**
     * Sends a HEAD request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    head : function(service, params) {
      var id = this._getCommunicationId();
      return this._communicate(service, params, "HEAD", id);
    },


    /*
    ---------------------------------------------------------------------------
      PROTECTED API
    ---------------------------------------------------------------------------
    */
    /**
     * called before caching data
     *
     * override this if you want to prevent caching of data based on arbitrary conditions
     * use keep: 0 service configuration to prevent caching altogether!
     *
     * @param data {Var} Caching data
     * @return {Boolean} Is caching allowed?
     */
    _allowCaching: function(data){
       return true;
    },

    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /** {Map} In-Memory cache for reponse data */
    __cache : null,

    __storageDataPrefix : null,
    __storageMetaPrefix : null,


    /** {Integer} Number of requests made (used for unique request IDs) */
    __requestCounter : 0,


    /** {Map} Custom request headers */
    __headers : null,


    _getCommunicationId : function() {
      return this.__requestCounter++;
    },


    /**
     * Returns the cache ID for the given argument set.
     *
     * @param service {String} One the supported services
     * @param params {Map} Optional map of params
     * @return {String} Cache ID
     */
    __getCacheId : function(service, params)
    {
      if (core.Env.getValue("debug"))
      {
        if (service == null) {
          throw new Error("Please define at least a service name!");
        }
      }

      return params ? service + "=" + JSON.stringify(params) : service;
    },


    /**
     * Patches the given URL to fill template fields with
     * given params and add support for proxying of the request.
     *
     * @param url {String} The original URL
     * @param params {Map?null} Optional map of params
     * @return {String} Patched URL
     */
    __patchUrl : function(url, params)
    {
      // Replace dynamic fields in URL
      if (params)
      {
        var value;
        for (var key in params)
        {
          value = params[key];
          if (value == "" || value == null) {
            continue;
          }

          url = url.replace("{" + key + "}", params[key]);
        }
      }

      if (url.indexOf("{") > 0) {
        throw new Error("Unresolved params in template URL: " + url);
      }

      if (this.getEnableProxy())
      {
        var match = url.match(/^(https|http):\/\//);
        if (match) {
          url = match[0] + this.getProxyUrl() + "/" + url.substring(match[0].length);
        } else if (core.Env.getValue("debug")) {
          throw new Error("Proxy could not be added to url: " + url);
        }
      }

      return url;
    },


    /**
     * Sets custom request headers
     *
     * @param name {String} Name of header
     * @param value {String} Value of header
     */
    setRequestHeader : function(name, value) {
      this.__headers[name] = value;
    },

    /**
     * Checks if request is marked as modified
     *
     * @param req {Request} Request object
     * @return {Boolean} Whether the resource is modified
     */
    __isModified : function(req) {
      return !(req.getStatus() === 304 || req.getResponseHeader("Last-Modified") === unify.business.SyncRegistry.get(req.getUrl()));
    },

    /**
     * Main communication routine. Called by most developer-level APIs.
     *
     * @param service {String} Identifier of the service to communicate to
     * @param params {Map?null} Optional map of parameters to patch URL with / use for filter method
     * @param method {String} Any supported HTTP method: OPTIONS, GET, POST, PUT, DELETE and HEAD
     * @param id {Integer} Unique id of request, can be generated via _getCommunicationId
     * @param data {var?null} Data to attach to a POST request
     * @return {String} Returns a unique ID based on the service/param combination
     */
    _communicate : function(service, params, method, id, data)
    {
      console.log("COMMUNICATE ", service, params, method, id, data);
      var config = this._getService(service);

      var url;
      try {
        url = this.__patchUrl(config.url, params);
      }
      catch(ex)
      {
        this.warn("Unable to communicate with service: " + service);
        this.warn("Parameter/Configuration problem: " + ex);
        return false;
      }

      // Create request object
      var req = new lowland.bom.Xhr();
      req.setUrl(url);

      var requestHeaders = req.getRequestHeaders() || {};
      // Sync mime type
      requestHeaders.Accept = this.getResponseType();

      // Sync timeout
      req.setTimeout(this.getTimeout()*1000);

      // Enable load cache
      if (method == "GET")
      {
        req.setCache(true);
        if (this.getEnableCacheRefresh()) {
          var cacheModified = this.getCachedField(service, params, "modified");
          if (cacheModified != null) {
            unify.business.SyncRegistry.sync(url, cacheModified);
            requestHeaders["If-Modified-Since"] = cacheModified;
          } else {
            unify.business.SyncRegistry.clear(url);
            requestHeaders["If-Modified-Since"] = "Thu, 01 Jan 1970 00:00:00 GMT"
          }
        }
      }

      // Apply method
      if (method != null && method != "GET") {
        req.setMethod(method);
      }

      // Support for authentification methods
      var auth = this.getAuthMethod();
      if (auth == "basic") {
        var key = this.getEnableProxy() ? "X-Proxy-Authorization" : "Authorization";
        var value = "Basic " + lowland.util.Base64.encode(this.getUser() + ":" + this.getPassword());

        requestHeaders[key] = value;
      }

      // Add custom headers
      var headers = this.__headers;
      for (var name in headers) {
        requestHeaders[name] = headers[name];
      }

      // Add post data
      if (method == "POST")
      {
        var reqType = this.getRequestType();
        if (reqType == "application/json" && typeof data != "string") {
          data = JSON.stringify(data);
        }

        requestHeaders["Content-Type"] = reqType;
        req.setRequestData(data);
      }

      // Add listeners
      /*req.addListener("load", this.__onRequestDone, this);
      req.addListener("error", this.__onRequestDone, this);
      req.addListener("timeout", this.__onRequestDone, this);*/
      req.addListener("done", this.__onRequestDone, this);

      // Attach incoming data to request
      req.setUserData("service", service);
      req.setUserData("params", params);

      // Every request has a unique identifier
      req.setUserData("id", id);
      if (core.Env.getValue("debug")) {
        this.debug("Sending request to: " + service + "[id=" + id + "]...");
      }

      req.setRequestHeaders(requestHeaders);
      // Finally send request
      req.send();

      return id;
    },


    /**
     * Event listener for request object
     *
     * @param e {lowland.events.Event} Event object of request
     */
    __onRequestDone : function(e)
    {
      var Json = JSON;

      // Read event data
      var req = e.getTarget();
      var eventType = e.getData();
      var status = req.getStatus();
      var isErrornous = eventType == "error" || eventType == "timeout" || (status >= 400);
      var isMalformed = eventType == "timeout";
      
      // Read request specific data
      var id = req.getUserData("id");
      var service = req.getUserData("service");
      var params = req.getUserData("params");

      // Debug
      if (core.Env.getValue("debug")) {
        this.debug("Request done: " + service + "[id=" + id + "]");
      }

      var now = +new Date;
      var text = req.getResponseText();
      var start;

      // Prepare data (Parse JSON/XML)
      var isModified = !isErrornous && !isMalformed; // TODO : && this.__isModified(req);
      if (isModified)
      {
        if (core.Env.getValue("debug")) {
          //this.debug("Loaded: " + text.length + " bytes in " + req.getDuration() + "ms");//TODO replace getDuration
        }

        var type = this.getResponseType();
        //debugger;
        if (text.length > 0)
        {
          // data is only defined if response text is available
          // otherwise function scope data is "undefined"
          var data = text;
          switch(type)
          {
            case "application/json":
              start = new Date;
              try{
                data = Json.parse(text);
              } catch(ex){
                this.error("failed to parse json: "+ex);
                isMalformed=true;
              }
              if (core.Env.getValue("debug")) {
                this.debug("Parsed JSON in: " + (new Date - start) + "ms");
              }
              break;

            case "application/xml":
              data = req.getTransport().responseXML; //req.getResponseXml();
              // Modify data and modify text
              if (this.getEnableXmlConverter())
              {
                start = new Date;
                data = unify.util.XmlToJson.convert(data);
                if (core.Env.getValue("debug")) {
                  this.debug("Converted to JSON in: " + (new Date - start) + "ms");
                }
                // Fix type as we now deal with JSON only
                type = "application/json";

                // Overwrite original text from service with stringified converted json
                start = new Date;
                text = Json.stringify(data);
                if (core.Env.getValue("debug")) {
                  this.debug("Prepared to cache in: " + (new Date - start) + "ms");
                }
              }
              break;
          }
        }

        if (this.getEnableNoContent() && req.getStatus() == 204)
        {
          // pass: not modified + no content
        }
        else if (!data)
        {
          this.error("Malformed data returned. Does not validate as: " + type);
          isMalformed = true;
        }
      }//TODO add else block here to handle isModified=false response? e.g. get data from cache to enrich completed event before firing it

      // Cache data
      if (!isErrornous && !isMalformed && this._getService(service).keep > 0 && this._allowCaching(data))
      {
        var cacheId = this.__getCacheId(service, params);
        var modified = req.getResponseHeader("Last-Modified");
        var cache = this.__cache;

        if (isModified)
        {
          cache[cacheId] =
          {
            id : id,
            created : now,
            checked : now,
            modified : modified,
            data : data,
            type : type
          };
        }
        else
        {
          cache[cacheId].checked = now;
        }

        // Store additionally in local storage
        if (this.getEnableStorage())
        {
          // We split the storage of the time from the other stuff for faster access
          // without parsing the whole data into objects
          var storageMetaId = this.__storageMetaPrefix + cacheId;

          if (isModified)
          {
            start = new Date;

            var metaData = Json.stringify(
            {
              id : id,
              created : now,
              checked : now,
              modified : modified,
              type : type
            });
            var metaStored=false;
            var Storage=unify.bom.Storage;
            try
            {
              Storage.set(storageMetaId, metaData);
              metaStored=true;
              var storageDataId = this.__storageDataPrefix + cacheId;
              Storage.set(storageDataId, text);
              if (core.Env.getValue("debug")) {
                this.debug("Stored in: " + (new Date - start) + "ms");
              }
            }
            catch(ex) {
              this.warn("Could not store data: " + ex);
              if(metaStored){
                Storage.remove(storageMetaId);
              }
            }

          }
          else
          {
            // Parse meta data, update time field, and store again
            var meta = Json.parse(unify.bom.Storage.get(storageMetaId));
            meta.checked = now;
            try{
              unify.bom.Storage.set(storageMetaId, Json.stringify(meta));
            } catch(ex) {
              this.warn("Could not store data: " + ex);
            }
          }
        }
      }

      
      if (!(isErrornous || isMalformed)) {
        var lastModified = req.getResponseHeader("Last-Modified");
        if (lastModified) {
          unify.business.SyncRegistry.sync(req.getUrl(), lastModified);
        }
      }
      
      // Fire event
      var args = [id, data, isModified, isErrornous, isMalformed, req];
      this.fireSpecialEvent("completed", args);

      // Dispose request
      req.dispose();
    },

    /**
     * event handler for storage quota exceeded event.
     * purges expired data in localStorage
     */
    __onQuotaExceeded: function(){
      if(!window.localStorage){
        return;
      }
      var start = new Date();
      var services=this._getServices();
      for (var serviceName in services) {
        var keep = services[serviceName].keep;
        if(keep>0){
          this.__purgeCache(serviceName,start-keep*1000);
        }
      }
      if (core.Env.getValue("debug")){
        var end=new Date();
        this.debug('garbage collection took: '+(end-start)+'ms');
      }
    },
    /**
     * removes localStorage entries of a service that have not been accessed within its keep time
     * 
     * @param serviceName {String} Service name to purge cache of
     * @param expiredWhenCheckedBefore {Integer} Last check as timestamp
     */
    __purgeCache : function(serviceName,expiredWhenCheckedBefore) {

      var
        dataPrefix = unify.bom.Storage.__prefix + this.__storageDataPrefix + serviceName,
        metaPrefix = unify.bom.Storage.__prefix + this.__storageMetaPrefix + serviceName,
        metaRegExp = new RegExp("^" + metaPrefix + "(.*)"),
        matched,
        meta,
        key;
      if (core.Env.getValue("debug")){
        this.debug('Cached entries of service "' + serviceName + '" are expired when last checked before: ' + new Date(expiredWhenCheckedBefore));
      }
      for (key in localStorage) {
        matched = metaRegExp.exec(key);
        if (matched) {
          meta = JSON.parse(localStorage.getItem(key));
          if (meta && meta.checked && meta.checked < expiredWhenCheckedBefore) {
            if (core.Env.getValue("debug")){
              this.debug('*** Expired Cache Entry "' + key + '", checked: ' + new Date(meta.checked));
            }
            localStorage.removeItem(dataPrefix + matched[1]);
            localStorage.removeItem(key);
          }
        }
      }
    }

  }

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  /*destruct : function()
  {
    // Dereference native binding
    this.__cache = null;
    Registration.removeListener(unify.bom.Storage,"quota_exceeded_err",this.__onQuotaExceeded,this);
  }*/
});
