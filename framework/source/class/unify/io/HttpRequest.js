/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
     2010 Deutsche Telekom AG, http://www.telekom.com

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * A more comfortable HTTP request object than the native one under
 * {@link qx.bom.Request}.
 *
 * Converts the whole communication into a qooxdoo style class with
 * real properties. The class also fires events to allow easy access
 * to status changes.
 *
 * Caution: This class automatically disposes itself after
 * the load/error/abort/timeout events have been fired. Access to request specific
 * properties is only possible during event listeners and not afterwards
 */
qx.Class.define("unify.io.HttpRequest",
{
  extend : qx.core.Object,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param url {String} URL to load
   */
  construct : function(url)
  {
    this.base(arguments);

    // Initialize header cache
    this.__headers = {};

    // Add url
    if (url != null) {
      this.setUrl(url);
    }
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** Cached for modification dates of already loaded URLs */
    __modified : {},

    /**
     * Syncs a modification date from e.g. a business object
     *
     * This is especially useful when having implemented some kind of caching
     * using localStorage, sessionStorage etc. in such an layer. In this case
     * it might useful to bring it in sync with this class to omit
     * unnecessary data transfers.
     *
     * @param url {String} Any valid URL
     * @param modification {String} A modification data as send with the
     *   "Last-Modified" header by the server.
     */
    sync : function(url, modification) {
      this.__modified[url] = modification;
    },


    /**
     * Clears the modification data stored for the given URL.
     *
     * This is especially useful when having implemented some kind of caching
     * using localStorage, sessionStorage etc. in e.g. an business object. In this case
     * it might useful to bring the caching layer in sync with the request
     * class. For example when clearing the cache in the business object this
     * class also should be informed as no data is anymore available.
     *
     * @param url {String} Any valid URL
     */
    clear : function(url) {
      delete this.__modified[url];
    }
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fires when the request change its state, data field contains the state. */
    "change" : "qx.event.type.Data",

    /** Fires when the request reached the timeout limit. Contains the duration at which the timeout was fired. */
    "timeout" : "qx.event.type.Data",

    /** Fires when the request was completed successfully. */
    "load" : "qx.event.type.Event",

    /** Fires when the request was completed with an error. */
    "error" : "qx.event.type.Event",

    /** Fires when the request was aborted by the user. */
    "abort" : "qx.event.type.Event"
  },





  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Target url to issue the request to.
     */
    url :
    {
      check : "String",
      init : ""
    },


    /**
     * Determines what type of request to issue (GET or POST).
     */
    method :
    {
      check : [ "GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS" ],
      init : "GET"
    },


    /**
     * Set the request to asynchronous.
     */
    async :
    {
      check : "Boolean",
      init : true
    },


    /**
     * Data which should be send to the server.
     *
     * Supported types:
     *
     * String => Encode data using UTF-8 for transmission.
     *
     * Document => Serialize data into a namespace well-formed XML document and
     *   encoded using the encoding given by data.xmlEncoding, if specified, or
     *   UTF-8 otherwise. Or, if this fails because the Document cannot be
     *   serialized act as if data is null.
     */
    data :
    {
      nullable : true
    },


    /**
     * Request mime type
     */
    requestType :
    {
      check : ["application/x-www-form-urlencoded", "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/x-www-form-urlencoded"
    },


    /**
     * Response mime type
     */
    responseType :
    {
      check : [ "application/json", "application/xml", "text/plain", "text/javascript", "text/html" ],
      init : "application/json"
    },


    /**
     * Username to use for HTTP authentication.
     * Set to NULL if HTTP authentication is not used.
     */
    username :
    {
      check : "String",
      nullable : true
    },


    /**
     * Password to use for HTTP authentication.
     * Set to NULL if HTTP authentication is not used.
     */
    password :
    {
      check : "String",
      nullable : true
    },


    /**
     * Number of milliseconds before the request is being timed out.
     *
     * Defaults to 10 seconds
     */
    timeout :
    {
      check : "Integer",
      nullable : false,
      init : 10000
    },


    /**
     * Allow the request to be successful only if the response has changed since
     * the last request. This is done by checking the Last-Modified header. Default
     * value is false, ignoring the header.
     */
    refresh :
    {
      check : "Boolean",
      init : false
    },


    /**
     * Controls whether cached data is OK
     */
    cache :
    {
      check : "Boolean",
      init : false
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** {qx.bom.Request} Holds the low-level request instance */
    __req : null,

    /** {Map} Stores the headers send for the request */
    __headers : null,



    /*
    ---------------------------------------------------------------------------
      REQUEST DATA
    ---------------------------------------------------------------------------
    */

    /**
     * Assigns a label/value pair to the header to be sent with a request
     *
     * Please do prefer properties over headers if possible. The header labels
     * "Cache-Control", "If-Modified-Since", "Content-Type" and "Accept" are blocked
     * here for example.
     *
     * @param label {String} Name of the header label
     * @param value {String} Value of the header field
     * @return {void}
     */
    setRequestHeader : function(label, value)
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (label == "Cache-Control") {
          throw new Error("Configured 'Cache-Control' through headers. Please use setCache() instead!");
        }

        if (label == "If-Modified-Since") {
          throw new Error("Configured 'If-Modified-Since' through headers. Please use setRefresh() instead!");
        }

        if (label == "Content-Type") {
          throw new Error("Configured 'Content-Type' through headers. Please use setRequestType() instead!");
        }

        if (label == "Accept") {
          throw new Error("Configured 'Accept' through headers. Please use setResponseType() instead!");
        }
      }

      this.__headers[label] = value;
    },


    /**
     * Deletes a header label which should be send previously.
     *
     * @param label {String} Name of the header label
     * @return {void}
     */
    removeRequestHeader : function(label) {
      delete this.__headers[label];
    },


    /**
     * Returns the value of a given header label.
     *
     * @param label {String} Label of the header entry
     * @return {String} The value or <code>null</code> when not defined.
     */
    getRequestHeader : function(label)
    {
      var value = this.__headers[label];
      if (value === undefined) {
        value = null;
      }

      return value;
    },





    /*
    ---------------------------------------------------------------------------
      RESPONSE DATA
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the (currently downloaded) response text.
     *
     * @return {String} String version of data returned from server process
     */
    getResponseText : function()
    {
      var req = this.__req;
      if (req) {
        return req.responseText;
      }
    },


    /**
     * Returns the XML document of the response (only available if content in mimetype application/xml was send).
     *
     * @return {Element} DOM-compatible document object of data returned from server process
     */
    getResponseXml : function()
    {
      var req = this.__req;
      if (req) {
        return req.responseXML;
      }
    },


    /**
     * Returns the string value of a single header label
     *
     * Should output something similar to the following text:
     *
     * Content-Type: text/plain; charset=utf-8
     *
     * @param label {String} Name of the header label
     * @return {String} The selected header's value.
     */
    getResponseHeader : function(label)
    {
      var req = this.__req;
      if (req) {
        return req.getResponseHeader(label);
      }
    },


    /**
     * Returns complete set of headers (labels and values) as a string
     *
     * Should output something similar to the following text:
     *
     * Date: Sun, 24 Oct 2004 04:58:38 GMT
     * Server: Apache/1.3.31 (Unix)
     * Keep-Alive: timeout=15, max=99
     * Connection: Keep-Alive
     * Transfer-Encoding: chunked
     * Content-Type: text/plain; charset=utf-8
     *
     * @return {String} All headers
     */
    getAllResponseHeaders : function()
    {
      var req = this.__req;
      if (req) {
        return req.getAllResponseHeaders();
      }
    },





    /*
    ---------------------------------------------------------------------------
      MAIN CONTROL
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the duration the request needed to communicate to the server
     *
     * @return {Integer|null} The duration in milliseconds or <code>null</code> if data is not available (yet)
     */
    getDuration : function()
    {
      var req = this.__req;
      return req ? req.getDuration() : null;
    },


    /**
     * Whether the currently running or finished request returns modified results.
     *
     * @return {Boolean|null} Returns <code>true</code> when the request contains modified results.
     *     Returns <code>null</code>when the request is not yet ready.
     */
    isModified : function()
    {
      var req = this.__req;
      if (!req) {
        return null;
      }

      // Hint: modified might be 'null' but as 'null' values are never stored it is a comparison
      // of 'null' and 'undefined' which is false when using the identity operator.
      return !(req.status === 304 || req.getResponseHeader("Last-Modified") === unify.io.HttpRequest.__modified[this.getUrl()]);
    },


    /**
     * Whether the currently running or finished request is successful.
     *
     * @return {Boolean} Returns <code>true</code> when the request is successful.
     */
    isSuccessful : function()
    {
      var req = this.__req;
      return !req || req.isSuccessful();
    },


    /**
     * Returns the response status code.
     *
     * @return {Integer} Numeric code returned by server, such as 404 for "Not Found" or 200 for "OK"
     */
    getStatusCode : function()
    {
      var req = this.__req;
      if (req) {
        return req.status;
      }
    },


    /**
     * Returns the response status text. This is the human readable version of {@link #getStatusCode}.
     *
     * @return {String} String message accompanying the status code
     */
    getStatusText : function()
    {
      var req = this.__req;
      if (req) {
        return req.statusText;
      }
    },


    /**
     * Returns the current request state.
     *
     * * 0 = uninitialized
     * * 1 = sending request
     * * 2 = headers loaded
     * * 3 = loading result
     * * 4 = done
     *
     * @return {Integer|null} Ready state of the request
     */
    getReadyState : function()
    {
      var req = this.__req;
      return req ? req.readyState : null;
    },


    /**
     * Sends the configured request
     *
     * @return {void}
     */
    send : function()
    {
      // Disposing old request object
      if (this.__req)
      {
        if (this.getReadyState() !== 4) {
          throw new Error("Request is still pending at ready state: " + this.getReadyState());
        }

        this.__req.dispose();
      }

      // Create low level object
      var req = this.__req = new qx.bom.Request;

      // Bind listeners
      req.onreadystatechange = qx.lang.Function.bind(this.__onchange, this);
      req.ontimeout = qx.lang.Function.bind(this.__ontimeout, this);
      req.onload = qx.lang.Function.bind(this.__onload, this);
      req.onerror = qx.lang.Function.bind(this.__onerror, this);
      req.onabort = qx.lang.Function.bind(this.__onabort, this);

      // Read url
      var url = this.getUrl();

      // Add timeout
      req.timeout = this.getTimeout();

      // Open request
      req.open(this.getMethod(), url, this.getAsync(), this.getUsername(), this.getPassword());

      // Add cache control hint
      if (!this.getCache()) {
        req.setRequestHeader("Cache-Control", "no-cache");
      }

      // Add modified since hint
      if (this.getRefresh())
      {
        var since = unify.io.HttpRequest.__modified[url] || "Thu, 01 Jan 1970 00:00:00 GMT";
        req.setRequestHeader("If-Modified-Since", since);
      }

      // Set content type to post data type
      var method = this.getMethod();
      if ((method === "POST") || (method === "PUT")) {
        req.setRequestHeader("Content-Type", this.getRequestType());
      }

      // Set accept header to selected mimetype
      req.setRequestHeader("Accept", this.getResponseType());

      // Synchronize headers
      var headers = this.__headers;
      for (var label in headers) {
        req.setRequestHeader(label, headers[label]);
      }

      // Finally send request
      req.send(this.getData());
    },


    /**
     * Aborts a running request
     *
     * @return {void}
     */
    abort : function()
    {
      if (this.__req) {
        this.__req.abort();
      } else if (qx.core.Environment.get("qx.debug")) {
        throw new Error("Not able to abort a non-running request.");
      }
    },




    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Internal change listener
     *
     * @signature function()
     */
    __onchange : function() {
      this.fireDataEvent("change", this.getReadyState());
    },


    /**
     * Internal timeout listener
     *
     * @signature function()
     */
    __ontimeout : function() {
      this.fireDataEvent("timeout", this.getDuration());
    },


    /**
     * Internal load listener
     *
     * @signature function()
     */
    __onload : function()
    {
      // Load modification data before user fired event
      if (this.getRefresh() && this.getReadyState() == 4 && this.isSuccessful())
      {
        var modified = this.getResponseHeader("Last-Modified");
        var url = this.getUrl();
      }

      this.fireEvent("load");

      // Store modification date
      // It is important that this is stored after the user event.
      // Otherwise the modification field gets written to early and every
      // request is reported as being non-modified in application code.
      if (modified) {
        unify.io.HttpRequest.__modified[url] = modified;
      }
    },


    /**
     * Internal timeout listener
     *
     * @signature function()
     */
    __onerror : function() {
      this.fireEvent("error");
    },


    /**
     * Internal abort listener
     *
     * @signature function()
     */
    __onabort : function() {
      this.fireEvent("abort");
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    if (this.__req)
    {
      this.__req.dispose();
      this.__req = null;
    }
  }
});
