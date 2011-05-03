/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

qx.Class.define("unify.test.io.UriTest",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    __fromStringUri : null,
    __cloneUri : null,
    __uri : null,
    __strUri : null,
    __protocol : null,
    __user : null,
    __password : null,
    __host : null,
    __port : null,
    __path : null,
    __query : null,
    __anchor : null,
  
    /**
     * Initialize testing variables
     */
    setUp : function()
    {
      this.__protocol="http";
      this.__user="testuser";
      this.__password="testpasswort"
      this.__host="www.telekom.de";
      this.__port="1234";
      this.__path="/testpath";
      this.__query="?key1=1&key2=2"
      this.__anchor="testAnchor";
      this.__strUri=this.__protocol+"://"+this.__user+":"+this.__password+"@"+this.__host+":"+this.__port+this.__path+this.__query+"#"+this.__anchor;
      this.__uri = new unify.io.Uri(this.__strUri);
      this.__cloneUri = this.__uri.clone();
      this.__fromStringUri = unify.io.Uri.fromString(this.__strUri);
    },

    /**
     * Testing the Objects of null values
     */
    testNotNull : function()
    {
      this.assertNotNull(this.__uri,"Uri is null");
      this.assertNotNull(this.__cloneUri,"Uri Clone is null");
      this.assertNotNull(this.__fromStringUri,"Uri From String is null");
    },

    /**
     * Check properties are correct from the create with the constructor
     */
    testPropertiesFromCreate : function()
    {
      this.assertEquals(this.__protocol,this.__uri.getProtocol(),"Error create protocol");
      this.assertEquals(this.__user,this.__uri.getUser(),"Error create user");
      this.assertEquals(this.__password,this.__uri.getPassword(),"Error create password");
      this.assertEquals(this.__host,this.__uri.getHost(),"Error create host");
      this.assertEquals(this.__port,this.__uri.getPort(),"Error create port");
      this.assertEquals(this.__path,this.__uri.getPath(),"Error create path");
      this.assertEquals(this.__anchor,this.__uri.getAnchor(),"Error create anchor");
      this.assertEquals(this.__strUri,this.__uri.toString(),"Error create toString");
    },

    /**
     * Check properties of the new Clone Object from the clone function
     */
    testPropertiesFromCreateClone : function()
    {
      this.assertEquals(this.__protocol,this.__cloneUri.getProtocol(),"Error create protocol");
      this.assertEquals(this.__user,this.__cloneUri.getUser(),"Error create user");
      this.assertEquals(this.__password,this.__cloneUri.getPassword(),"Error create password");
      this.assertEquals(this.__host,this.__cloneUri.getHost(),"Error create host");
      this.assertEquals(this.__port,this.__cloneUri.getPort(),"Error create port");
      this.assertEquals(this.__path,this.__cloneUri.getPath(),"Error create path");
      this.assertEquals(this.__anchor,this.__cloneUri.getAnchor(),"Error create anchor");
      this.assertEquals(this.__strUri,this.__cloneUri.toString(),"Error create toString");
    },

    /**
     * Check properties from the Object which create by the static method fromString()
     *
     */
    testPropertiesFromStaticFromString : function()
    {
      this.assertEquals(this.__protocol,this.__fromStringUri.getProtocol(),"Error create protocol");
      this.assertEquals(this.__user,this.__fromStringUri.getUser(),"Error create user");
      this.assertEquals(this.__password,this.__fromStringUri.getPassword(),"Error create password");
      this.assertEquals(this.__host,this.__fromStringUri.getHost(),"Error create host");
      this.assertEquals(this.__port,this.__fromStringUri.getPort(),"Error create port");
      this.assertEquals(this.__path,this.__fromStringUri.getPath(),"Error create path");
      this.assertEquals(this.__anchor,this.__fromStringUri.getAnchor(),"Error create anchor");
      this.assertEquals(this.__strUri,this.__fromStringUri.toString(),"Error create toString");
    },

    /**
     * Check the Params-Functions of the Objects
     */
    testParams : function()
    {
      this.assertEquals("1",this.__uri.getParam("key1"),"Error getParam key1");
      this.assertEquals("2",this.__uri.getParam("key2"),"Error getParam key2");
      this.__uri.addParam("key3","3");
      this.assertEquals("3",this.__uri.getParam("key3"),"Error getParam key3");
      this.__uri.removeParam("key3");
      this.assertNull(this.__uri.getParam("key3"),"Error: Param key 3 was deleted.")

      this.assertEquals("1",this.__cloneUri.getParam("key1"),"Error getParam key1");
      this.assertEquals("2",this.__cloneUri.getParam("key2"),"Error getParam key2");
      this.__cloneUri.addParam("key3","3");
      this.assertEquals("3",this.__cloneUri.getParam("key3"),"Error getParam key3");
      this.__cloneUri.removeParam("key3");
      this.assertNull(this.__cloneUri.getParam("key3"),"Error: Param key 3 was deleted.")

      this.assertEquals("1",this.__fromStringUri.getParam("key1"),"Error getParam key1");
      this.assertEquals("2",this.__fromStringUri.getParam("key2"),"Error getParam key2");
      this.__fromStringUri.addParam("key3","3");
      this.assertEquals("3",this.__fromStringUri.getParam("key3"),"Error getParam key3");
      this.__fromStringUri.removeParam("key3");
      this.assertNull(this.__fromStringUri.getParam("key3"),"Error: Param key 3 was deleted.")
    }
  }
});
