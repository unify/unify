/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * Class to manage syncs
 */
core.Module("unify.business.SyncRegistry", {
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
   * @param modified {String} A modification data as send with the
   *   "Last-Modified" header by the server.
   */
  sync : function(url, modified) {
    this.__modified[url] = modified;
  },
  
  /**
   * Clears information
   *
   * @param url {String} URL of resource
   */
  clear : function(url) {
    delete this.__modified[url];
  },
  
  /**
   * Get modified object
   *
   * @param url {String} URL of resource
   * @return {String} Modification date string
   */
  get : function(url) {
    return this.__modified[url];
  }
});