/* ========================================================================

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

======================================================================== */

/**
 * A wrapper for Cookie handling.
 */
core.Module("unify.util.Cookie", {
  /*
  ---------------------------------------------------------------------------
    USER APPLICATION METHODS
  ---------------------------------------------------------------------------
  */

  /**
   * {String|null} Returns the string value of a cookie with key value @key {String}.
   */
  get : function(key)
  {
    var start = document.cookie.indexOf(key + "=");
    var len = start + key.length + 1;

    if ((!start) && (key != document.cookie.substring(0, key.length))) {
      return null;
    }

    if (start == -1) {
      return null;
    }

    var end = document.cookie.indexOf(";", len);

    if (end == -1) {
      end = document.cookie.length;
    }

    return unescape(document.cookie.substring(len, end));
  },


  /**
   * Sets the string value of a cookie. Mendatory parameters are
   * @key {String} and @value {String}. Optional an expiry date
   * @expires {Number?null} defines days the cookie is valid, otherwise
   * the cookie is deleted after browser is closed. @path {String},
   * @domain {String?null} and @secure {Boolean?null} are other allowed
   * flags for cookie.
   */
  set : function(key, value, expires, path, domain, secure)
  {
    // Generate cookie
    var cookie = [ key, "=", escape(value) ];

    if (expires)
    {
      var today = new Date();
      today.setTime(today.getTime());

      cookie.push(";expires=", new Date(today.getTime() + (expires * 1000 * 60 * 60 * 24)).toGMTString());
    }

    if (path) {
      cookie.push(";path=", path);
    }

    if (domain) {
      cookie.push(";domain=", domain);
    }

    if (secure) {
      cookie.push(";secure");
    }

    // Store cookie
    document.cookie = cookie.join("");
  },


  /**
   * Deletes the cookie with key @key {String}. If @path {String?null}
   * and @domain {String?null} is set during set call this must also be
   * set on deletion.
   */
  del : function(key, path, domain)
  {
    if (!qx.bom.Cookie.get(key)) {
      return;
    }

    // Generate cookie
    var cookie = [ key, "=" ];

    if (path) {
      cookie.push(";path=", path);
    }

    if (domain) {
      cookie.push(";domain=", domain);
    }

    cookie.push(";expires=Thu, 01-Jan-1970 00:00:01 GMT");

    // Store cookie
    document.cookie = cookie.join("");
  }
});