/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Fired by business object whenever a data communication is completed.
 */
core.Class("unify.business.CompletedEvent", {
  include : [lowland.events.Event],

  construct : function(target, context, args) { //id, data, modified, errornous, malformed, request) {
    lowland.events.Event.call(this, target);
    this.init.apply(this, args); //id, data, modified, errornous, malformed, request);
  },

  members : {
    __id : null,
    __data : null,
    __errornous : null,
    __request : null,
    __malformed : null,
    __modified : null,


    /**
     * Initialize the fields of the event. The event must be initialized before
     * it can be dispatched.
     *
     * @param id {String} Unique ID of the request.
     * @param data {String} The result data set from the request.
     * @param modified {Boolean} Whether the request comes with modified data.
     * @param errornous {Boolean} Whether the request was errornous.
     * @param malformed {Boolean} Whether the response content is malformed
     * @param request {Xhr} Request object to query communication details
     * @return {tweet.business.TwitterEvent} The initialized event instance
     */
    init : function(id, data, modified, errornous, malformed, request)
    {
      //this.base(arguments, false, false);

      this.__id = id;
      this.__data = data;
      this.__modified = modified;
      this.__errornous = errornous;
      this.__malformed = malformed;
      this.__request = request;

      return this;
    },


    /**
     * Get a copy of this object
     *
     * @param embryo {tweet.business.TwitterEvent?null} Optional event class, which will
     *     be configured using the data of this event instance. The event must be
     *     an instance of this event class. If the data is <code>null</code>,
     *     a new pooled instance is created.
     *
     * @return {tweet.business.TwitterEvent} a copy of this object
     */
    clone : function(embryo)
    {
      //var clone = this.base(arguments, embryo);
      var clone = {};

      clone.__id = this.__id;
      clone.__data = this.__data;
      clone.__modified = this.__modified;
      clone.__errornous = this.__errornous;
      clone.__malformed = this.__malformed;
      clone.__request = this.__request;

      return clone;
    },


    /**
     * Returns the ID of the request.
     *
     * @return {String} Unique ID of the request.
     */
    getId: function() {
      return this.__id;
    },


    /**
     * Returns the data gathered from the request
     *
     * @return {Map} Returns the data. Typically a JSON data structure.
     */
    getData: function() {
      return this.__data;
    },


    /**
     * Whether the request resulted in new data being returned
     *
     * Typcically only makes sense in GET requests.
     *
     * @return {Boolean} Whether the data was modified
     */
    isModified : function() {
      return this.__modified;
    },


    /**
     * Whether the request has resulted into errors.
     *
     * @return {Boolean} Whether there were errors in the request.
     */
    isErrornous : function() {
      return this.__errornous;
    },


    /**
     * Whether the request returned with malformed data
     *
     * @return {Boolean} Whether there were errors in the request.
     */
    isMalformed : function() {
      return this.__malformed;
    },


    /**
     * Returns the request object. Don't rely on this object to persist.
     * It is immediately destroyed after the function is quit.
     *
     * @return {Xhr} Request object
     */
    getRequest : function() {
      return this.__request;
    }
  }
});
