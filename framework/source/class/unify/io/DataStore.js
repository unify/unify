/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 *
 * Implementation of local data storages
 */
qx.Class.define("unify.io.DataStore", {
  type : "static",

  defer : function() {
    if (unify.io.datastore.SQLiteAdapter.isCapable) {
      unify.io.DataStore.save = unify.io.datastore.SQLiteAdapter.save;
      unify.io.DataStore.get = unify.io.datastore.SQLiteAdapter.get;
      unify.io.DataStore.all = unify.io.datastore.SQLiteAdapter.all;
      unify.io.DataStore.remove = unify.io.datastore.SQLiteAdapter.remove;
      unify.io.DataStore.nuke = unify.io.datastore.SQLiteAdapter.nuke;
    }
  },

  statics : {
    /**
     * Save an object to the store. If a key is present then update.
     * Otherwise create a new record.
     *
     * @param obj {Object} JSON Object to store
     * @param callback {Function} Callback function after save is done
     */
    save : function(obj, callback) {},

    /**
     * Invokes a callback on an object with the matching key.
     *
     * @param key {Object} Key of object
     * @param callback {Function} Callback function after get is done
     */
    get : function(key, callback) {},

    /**
     * Returns all rows to a callback.
     *
     * @param callback {Function} Callback function after all is done
     */
    all : function(callback) {},

    /**
     * Removes a json object from the store.
     *
     * @param keyOrObj {Object} Key of object or object itself
     * @param callback {Function} Callback function after remove is done
     */
    remove : function(keyOrObj, callback) {},

    /**
     * Removes all documents from a store and returns self.
     *
     * @param callback {Function} Callback function after nuke is done
     * @return this
     */
    nuke : function(callback) {}
  }
});