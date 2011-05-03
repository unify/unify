/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 Sebastian Fastner, Mainz, Germany, http://www.sebastianfastner.de

   ======================================================================

   This class contains code based on the following work:

   * Prototype JS
     http://www.prototypejs.org/
     Version 1.5

     Copyright:
       (c) 2006-2007, Prototype Core Team

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Prototype Core Team

   ----------------------------------------------------------------------

     Copyright (c) 2005-2008 Sam Stephenson

     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without restriction,
     including without limitation the rights to use, copy, modify, merge,
     publish, distribute, sublicense, and/or sell copies of the Software,
     and to permit persons to whom the Software is furnished to do so,
     subject to the following conditions:

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     DEALINGS IN THE SOFTWARE.

************************************************************************ */

/**
 */
qx.Class.define("unify.bom.Hierarchy",
{
  statics :
  {

    /**
     * Get the element containing the closest parent element
     * that matches the specified selector, the starting element included.
     *
     * Closest works by first looking at the current element to see if
     * it matches the specified expression, if so it just returns the
     * element itself. If it doesn't match then it will continue to
     * traverse up the document, parent by parent, until an element
     * is found that matches the specified expression. If no matching
     * element is found then <code>null</code> will be returned.
     *
     * @param selector {String} Expression to filter the elements with
     * @return {Element|null} Found parent element which matches the expression
     */ 
    closest : function(elem, selector)
    {
      var bomSelector = qx.bom.Selector;
      
      while (elem && elem.ownerDocument)
      {
        if (bomSelector.matches(selector, [elem]).length > 0) {
          return elem;
        }

        // Try the next parent
        elem = elem.parentNode;
      }     
    }
  }
});