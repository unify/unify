/* ************************************************************************

   Tweet

   Copyright:
     2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

qx.Theme.define("tweet.ui.desktop.theme.Appearance",
{
  extend : qx.theme.modern.Appearance,

  appearances :
  {
    "twitter-list" :
    {
      alias : "list",

      style : function(states)
      {
        return {
        };
      }
    },

    "twitter-item" :
    {
      style : function(states)
      {
        return {
          marginBottom : 1,
          padding : 10
        };
      }
    },

    "twitter-item/icon" :
    {
      include : "image",

      style : function(states)
      {
        return {
          width : 48,
          height : 48,
          marginRight : 10
        };
      }
    },

    "twitter-item/message" :
    {
      include : "label",

      style : function(states)
      {
        return {
        };
      }
    },

    "twitter-item/date" :
    {
      include : "label",

      style : function(states)
      {
        return {
          textColor : "#777"
        };
      }
    }
  }
});
