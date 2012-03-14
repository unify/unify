/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * XML to JSON converter with the intention to create a small as possible
 * JSON result.
 *
 * Depending on the structure of the an element the complexity
 * of its JSON result may differ e.g. elements which only contain attributes
 * are simply converted to a map, while elements with children and no attributes
 * are converted to arrays etc.
 */

(function() {
  
  /**
   * {Map} internal converter map for automatic conversion of some special text nodes
   */
  var CONVERTXMLMAP  = {
    "FALSE" : false,
    "false" : false,
    "False" : false,

    "TRUE" : true,
    "true" : true,
    "True" : true,

    "NULL" : null,
    "null" : null,
    "Null" : null
  };

  
  
  core.Module("unify.util.XmlToJson", {
  
    /**
     * Converts XML to JSON
     *
     * TODO: CDATA sections???
     *
     * @param xmlNode
     *            {Node|Document} XML document or XML node to convert to
     *            JSON
     * @return {Object|null} JSON object or null when element is empty
     */
    convert : function(xmlNode)
    {
      var json = {};
      var child = xmlNode.childNodes;
      var attrs = xmlNode.attributes;
      var map = CONVERTXMLMAP;
      var current, key, type, value, i, len;
  
      // Process children
      if ((child.length == 1) && (child[0].nodeType == 3))
      {
        value = child[0].nodeValue;
        if (value in map) {
          value = map[value];
        }
        if (attrs.length) {
          json.text = value;
        } else {
          return value;
        }
      }
      else if (child.length)
      {
        for (i=0, len=child.length; i<len; i++)
        {
          current = child[i];
          key = current.nodeName;
          value = current.nodeValue;
          type = current.nodeType;
  
          // If key name is already in json convert to array
          var used = json[key];
          if (used)
          {
            // Remap content to array... this might happen when multiple elements
            // with the same tag name exist
            if (!(used instanceof Array)) {
              used = json[key] = [ used ];
            }
  
            if (type == 3) {
              used.push(value in map ? map[value] : value);
            } else {
              used.push(this.convert(current));
            }
          }
          else
          {
            if (type == 3) {
              json[key] = value in map ? map[value] : value;
            } else {
              json[key] = this.convert(current);
            }
          }
        }
      }
  
      // Add attributes
      if (attrs)
      {
        for (i=0, len=attrs.length; i<len; i++)
        {
          current = attrs[i];
  
          // Check whether key is in json, if so add "@" in front of attribute name
          key = current.name;
          json[key in json ? "@"+key : key] = current.value;
        }
      }
  
      // Quick validation if there is really content which was converted
      for (key in json) {
        return json;
      }
  
      return null;
    }
  });

})();