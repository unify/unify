/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**

 * Implementation of local data storages.
 */
qx.Class.define("unify.io.datastore.SQLiteAdapter", {
  type : "static",

  defer : function() {
    unify.io.datastore.SQLiteAdapter.isCapable = true;

    unify.io.datastore.SQLiteAdapter.__openDb();
  },

  statics : {
    __db : null,

    /**
     * Opens database
     */
    __openDb : function() {
      var db = unify.io.datastore.SQLiteAdapter.__db = window.openDatabase("unify", "1.0", "Unify database", 65536);

      var emptyFnt = function() {
      };

      var createFnt = function(tx, error) {
        db.transaction(function(tx) {
          tx.executeSql(
              "CREATE TABLE localstore (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)",
              [], emptyFnt, function() {
                console.warn("Creation of database failed!")
              });
        });
      }

      var selectFnt = function(tx) {
        tx.executeSql("SELECT COUNT(*) FROM localstore", [], emptyFnt, createFnt);
      };

      db.transaction(selectFnt);
    },

    /**
     * Generates unique id
     * 
     * @param len {Integer|Null} Length of uuid
     * @param radix {Integer|Null} Radix of uuid
     * 
     * @return {String} Unique ID
     */
    __uuid : function(len, radix) {
      // based on Robert Kieffer's randomUUID.js at
      // http://www.broofa.com
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [];
      radix = radix || chars.length;

      if (len) {
        for ( var i = 0; i < len; i++)
          uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high
        // bits of clock
        // sequence as
        // per rfc4122, sec. 4.1.5
        for ( var i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    },

    /**
     * Updates entry
     * 
     * @param id {String} ID of object to update
     * @param obj
     *            {Object} JSON Object to store
     * @param callback
     *            {Function} Callback function after save is done
     */
    __update : function(id, obj, callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(tx) {
        tx.executeSql("UPDATE localstore SET value=?, timestamp=? WHERE id=?", [
            qx.lang.Json.stringify(obj), (new Date().getTime()), id ], function() {
          obj.key = id;
          callback(obj);
        }, function() {
        });
      });
    },

    /**
     * Inserts entry
     * 
     * @param obj
     *            {Object} JSON Object to store
     * @param callback
     *            {Function} Callback function after save is done
     */
    __insert : function(obj, callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(t) {
        var id = (obj.key == undefined) ? unify.io.datastore.SQLiteAdapter.__uuid() : obj.key;
        delete (obj.key);
        t.executeSql("INSERT INTO localstore (id, value,timestamp) VALUES (?,?,?)", [ id,
            qx.lang.Json.stringify(obj), (new Date().getTime()) ], function() {
          obj.key = id;
          callback(obj);
        }, function() {
        });
      });
    },

    /**
     * Is environment capable to serve sqlite services?
     */
    isCapable : false,

    /**
     * Save an object to the store. If a key is present then update.
     * Otherwise create a new record.
     * 
     * @param obj
     *            {Object} JSON Object to store
     * @param callback
     *            {Function} Callback function after save is done
     */
    save : function(obj, callback) {
      callback = callback || function() {};
      if (obj.key == undefined) {
        unify.io.datastore.SQLiteAdapter.__insert(obj, callback);
      } else {
        unify.io.datastore.SQLiteAdapter.get(obj.key, function(r) {
          var isUpdate = (r != null);

          if (isUpdate) {
            var id = obj.key;
            delete (obj.key);
            unify.io.datastore.SQLiteAdapter.__update(id, obj, callback);
          } else {
            unify.io.datastore.SQLiteAdapter.__insert(obj, callback);
          }
        });
      }
    },

    /**
     * Invokes a callback on an object with the matching key.
     * 
     * @param key
     *            {Object} Key of object
     * @param callback
     *            {Function} Callback function after get is done
     */
    get : function(key, callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(t) {
        t.executeSql("SELECT value FROM localstore WHERE id = ?", [ key ], function(tx, results) {
          if (results.rows.length == 0) {
            callback(null);
          } else {
            var o = qx.lang.Json.parse(results.rows.item(0).value);
            o.key = key;
            callback(o);
          }
        }, function() {
        });
      });
    },

    /**
     * Returns all rows to a callback.
     * 
     * @param callback
     *            {Function} Callback function after all is done
     */
    all : function(callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(t) {
        t.executeSql("SELECT * FROM localstore", [], function(tx, results) {
          if (results.rows.length == 0) {
            callback( []);
          } else {
            var r = [];
            for ( var i = 0, l = results.rows.length; i < l; i++) {
              var raw = results.rows.item(i).value;
              var obj = qx.lang.Json.parse(raw);
              obj.key = results.rows.item(i).id;
              r.push(obj);
            }
            callback(r);
          }
        }, function() {
        });
      });
    },

    /**
     * Removes a json object from the store.
     * 
     * @param keyOrObj
     *            {Object} Key of object or object itself
     * @param callback
     *            {Function} Callback function after remove is done
     */
    remove : function(keyOrObj, callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(t) {
        t.executeSql("DELETE FROM localstore WHERE id = ?", [ (typeof keyOrObj == 'string') ? keyOrObj
            : keyOrObj.key ], callback, function() {
        });
      });
    },

    /**
     * Removes all documents from a store and returns self.
     * 
     * @param callback
     *            {Function} Callback function after nuke is done
     */
    nuke : function(callback) {
      unify.io.datastore.SQLiteAdapter.__db.transaction(function(tx) {
        tx.executeSql("DELETE FROM localstore", [], callback, function() {
        });
      });
    }
  }
});