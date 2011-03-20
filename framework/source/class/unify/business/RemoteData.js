/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Remote data business object with intelligent cache managment.
 *
 * * Uses unify.bom.Storage for storing data between application runs.
 * * Supports HTTP-proxying for cross-domain communication
 * * Supports basic HTTP authentification
 * * Make use of modification dates to optimize data loading via GET
 */
qx.Class.define("unify.business.RemoteData",
{
  extend : unify.business.StaticData,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  // overridden
  construct : function()
  {
    this.base(arguments);

    /** {Map} In-Memory Cache */
    this.__cache = {};

    /** {Map} Custom http headers */
    this.__headers = {};

    /** {String} Prefix used for storage */
    var prefix = qx.lang.String.hyphenate(this.basename).substring(1);
    this.__storageDataPrefix = prefix + "/data/";
    this.__storageMetaPrefix = prefix + "/meta/";
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
    "completed" : "unify.business.CompletedEvent"
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Whether client-side storage should be used to keep data when app is relaunched */
    enableStorage :
    {
      check : "Boolean",
      init : true
    },

    /** Whether the proxy should be enabled (globally) */
    enableProxy :
    {
      check : "Boolean",
      init : false
    },

    /**
     * Option for GET request to allow the request to be successful only, if the response
     * has changed since the last request. This is done by checking the Last-Modified header.
     */
    enableCacheRefresh :
    {
      check : "Boolean",
      init : true
    },

    /** Whether automatic conversion of xml format to json format should be executed */
    enableXmlConverter :
    {
      check : "Boolean",
      init : true
    },

    /** Whether it's OK no have no content from the service (HTTP 204 response)*/
    enableNoContent :
    {
      check : "Boolean",
      init : false
    },

    /** URL of proxy to fix cross domain communication */
    proxyUrl :
    {
      check : "String",
      init : "generic-proxy.appspot.com"
    },

    /** Request mime type */
    requestType :
    {
      check : ["application/x-www-form-urlencoded", "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/x-www-form-urlencoded"
    },

    /** Response mime type */
    responseType :
    {
      check : [ "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/json"
    },

    /** Time after communication should be regarded as failed (in milliseconds) */
    timeout :
    {
      check : "Integer",
      init : 10000
    },

    /** Which authentication method is needed for all services */
    authMethod :
    {
      check : ["basic"],
      nullable : true
    },

    /** User name for authentification (basic auth) */
    user :
    {
      check : "String",
      nullable : true
    },

    /** Password for authentification (basic auth) */
    password :
    {
      check : "String",
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
          meta = qx.lang.Json.parse(meta);
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
          entry = qx.lang.Json.parse(entry);

          // Recover json/xml data
          var data = unify.bom.Storage.get(this.__storageDataPrefix + cacheId);
          var start;
          if (entry.type == "application/json")
          {
            start = new Date;
            data = qx.lang.Json.parse(data);
            this.debug("Restored JSON in: " + (new Date - start) + "ms");
          }
          else if (entry.type == "application/xml")
          {
            start = new Date;
            data = qx.xml.Document.fromString(data);
            this.debug("Recovered XML in: " + (new Date - start) + "ms");
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
      return this.__communicate(service, params, "OPTIONS");
    },


    /**
     * Sends a GET request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    get : function(service, params) {
      return this.__communicate(service, params, "GET");
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
      return this.__communicate(service, params, "POST", data);
    },


    /**
     * Sends a PUT request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    put : function(service, params) {
      return this.__communicate(service, params, "PUT");
    },


    /**
     * Sends a DELETE request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    del : function(service, params) {
      return this.__communicate(service, params, "DELETE");
    },


    /**
     * Sends a HEAD request to the given service
     *
     * @param service {String} One the supported services
     * @param params {Map?null} Optional map of params
     * @return {String} Unique ID to identify service/param combination in the "completed" event
     */
    head : function(service, params) {
      return this.__communicate(service, params, "HEAD");
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


    /**
     * Returns the cache ID for the given argument set.
     *
     * @param service {String} One the supported services
     * @param params {Map} Optional map of params
     * @return {String} Cache ID
     */
    __getCacheId : function(service, params)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (service == null) {
          throw new Error("Please define at least a service name!");
        }
      }

      return params ? service + "=" + qx.lang.Json.stringify(params) : service;
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
        } else if (qx.core.Variant.isSet("qx.debug", "on")) {
          throw new Error("Proxy could not be added to url: " + url);
        }
      }

      return url;
    },


    /**
     * Adds basic authentification data to the request given on the
     * properties {@link #user} and {@link #password}.
     *
     * @param req {qx.io.HttpRequest} Request object to modify
     */
    __addBasicAuth : function(req)
    {
      var key = this.getEnableProxy() ? "X-Proxy-Authorization" : "Authorization";
      var value = "Basic " + qx.util.Base64.encode(this.getUser() + ":" + this.getPassword());

      req.setRequestHeader(key, value);
    },


    /**
     * Adds custom request headers to the request
     *
     * @param req {qx.io.HttpRequest} Request object to modify
     */
    __addRequestHeaders : function(req)
    {
      var headers = this.__headers;
      for (var name in headers) {
        req.setRequestHeader(name, headers[name]);
      }
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
     * Main communication routine. Called by most developer-level APIs.
     *
     * @param service {String} Identifier of the service to communicate to
     * @param params {Map?null} Optional map of parameters to patch URL with / use for filter method
     * @param method {String} Any supported HTTP method: OPTIONS, GET, POST, PUT, DELETE and HEAD
     * @param data {var?null} Data to attach to a POST request
     * @return {String} Returns a unique ID based on the service/param combination
     */
    __communicate : function(service, params, method, data)
    {
      var config = this._getService(service);

      try {
        var url = this.__patchUrl(config.url, params);
      }
      catch(ex)
      {
        this.warn("Unable to communicate with service: " + service);
        this.warn("Parameter/Configuration problem: " + ex);
        return false;
      }

      // Create request object
      var HttpRequest = qx.io.HttpRequest;
      var req = new HttpRequest(url);

      // Sync mime type
      req.setResponseType(this.getResponseType());

      // Sync timeout
      req.setTimeout(this.getTimeout());

      // Enable load cache
      if (method == "GET")
      {
        req.setCache(true);
        if (this.getEnableCacheRefresh()) {
          req.setRefresh(true);
        }

        // Enable refresh if there is a usable cache entry
        var cacheModified = this.getCachedField(service, params, "modified");
        if (cacheModified != null) {
          HttpRequest.sync(url, cacheModified);
        } else {
          HttpRequest.clear(url);
        }
      }

      // Apply method
      if (method != null && method != "GET") {
        req.setMethod(method);
      }

      // Support for authentification methods
      var auth = this.getAuthMethod();
      if (auth == "basic") {
        this.__addBasicAuth(req);
      }

      // Add custom headers
      this.__addRequestHeaders(req);

      // Add post data
      if (method == "POST")
      {
        var reqType = this.getRequestType();
        if (reqType == "application/json" && typeof data != "string") {
          data = qx.lang.Json.stringify(data);
        }
        
        req.setRequestType(reqType);
        req.setData(data);
      }

      // Add listeners
      req.addListener("load", this.__onRequestDone, this);
      req.addListener("error", this.__onRequestDone, this);
      req.addListener("timeout", this.__onRequestDone, this);

      // Attach incoming data to request
      req.setUserData("service", service);
      req.setUserData("params", params);

      // Every request has a unique identifier
      var id = this.__requestCounter++;
      req.setUserData("id", id);
      this.debug("Sending request to: " + service + "[id=" + id + "]...");

      // Finally send request
      req.send();

      return id;
    },


    /**
     * Event listener for request object
     *
     * @param e {qx.event.type.Event} Event object of request
     */
    __onRequestDone : function(e)
    {
      var Json = qx.lang.Json;

      // Read event data
      var req = e.getTarget();
      var eventType = e.getType();
      var isErrornous = eventType == "error" || eventType == "timeout";
      var isMalformed = eventType == "timeout";

      // Read request specific data
      var id = req.getUserData("id");
      var service = req.getUserData("service");
      var params = req.getUserData("params");

      // Debug
      if (qx.core.Variant.isSet("qx.debug", "on")) {
        this.debug("Request done: " + service + "[id=" + id + "]");
      }

      var now = +new Date;
      var text = req.getResponseText();
      var start;

      // Prepare data (Parse JSON/XML)
      var isModified = !isMalformed && req.isModified();
      if (isModified)
      {
        if (qx.core.Variant.isSet("qx.debug", "on")) {
          this.debug("Loaded: " + text.length + " bytes in " + req.getDuration() + "ms");
        }

        var type = this.getResponseType();
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
              this.debug("Parsed JSON in: " + (new Date - start) + "ms");
              break;

            case "application/xml":
              data = req.getResponseXml();
              // Modify data and modify text
              if (this.getEnableXmlConverter())
              {
                start = new Date;
                data = unify.util.XmlToJson.convert(data);
                this.debug("Converted to JSON in: " + (new Date - start) + "ms");

                // Fix type as we now deal with JSON only
                type = "application/json";

                // Overwrite original text from service with stringified converted json
                start = new Date;
                text = Json.stringify(data);
                this.debug("Prepared to cache in: " + (new Date - start) + "ms");
              }
              break;
          }
        }

        if (this.getEnableNoContent() && req.getStatusCode() == 204)
        {
          // pass: not modified + no content
        }
        else if (!data)
        {
          this.error("Malformed data returned. Does not validate as: " + type);
          isMalformed = true;
        }
      }

      // Cache data
      if (!isErrornous && !isMalformed && this._getService(service).keep > 0)
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

            var storeData = Json.stringify(
            {
              id : id,
              created : now,
              checked : now,
              modified : modified,
              type : type
            });

            try
            {
              unify.bom.Storage.remove(storageMetaId);
              unify.bom.Storage.set(storageMetaId, storeData);
            }
            catch(ex) {
              this.warn("Could not store data: " + ex);
            }

            var storageDataId = this.__storageDataPrefix + cacheId;
            unify.bom.Storage.set(storageDataId, text);
            this.debug("Stored in: " + (new Date - start) + "ms");
          }
          else
          {
            // Parse meta data, update time field, and store again
            var meta = Json.parse(unify.bom.Storage.get(storageMetaId));
            meta.checked = now;
            unify.bom.Storage.set(storageMetaId, Json.stringify(meta));
          }
        }
      }

      // Fire event
      var args = [id, data, isModified, isErrornous, isMalformed, req];
      this.fireEvent("completed", unify.business.CompletedEvent, args);

      // Dispose request
      req.dispose();
    }
  },


  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    // Dereference native binding
    this.__cache = null;
  }
});
