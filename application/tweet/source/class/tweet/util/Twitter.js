/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
qx.Class.define("tweet.util.Twitter",
{
  statics :
  {
    /** {RegExp} Matches URLs */
    __uriRegExp : /(ftp|http|https):\/\/[a-zA-Z0-9\/#\.\-\?&=_]+/g,


    /** {RegExp} Matches @user messages */
    __atRegExp : /@[a-zA-Z0-9]+/g,


    /**
     * Returns the icon URL from an status update entry
     *
     * @param entry {Map} Status update (JSON)
     * @return {String} URL of the user icon
     */
    getIcon : function(entry) {
      return entry.profile_image_url || entry.user.profile_image_url;
    },


    /**
     * Returns the HTMLified status text with linkified URLs etc.
     *
     * @param entry {Map} Status update (JSON)
     * @return {String} Nicely formatted status text
     */
    getFormattedText : function(entry)
    {
      var text = entry.text;

      this.__uriRegExp.lastIndex = 0;
      text = text.replace(this.__uriRegExp, function(match) {
        return '<a class="uri" target="_blank" href="' + match + '">' + match + '</a>';
      });

      this.__atRegExp.lastIndex = 0;
      text = text.replace(this.__atRegExp, function(match) {
        return '<span goto="user:' + match.substring(1, match.length) + '">' + match + '</span>';
      });

      return text;
    },


    /**
     * Returns a formatted date string
     *
     * @param entry {Map} Status update (JSON)
     * @return {String} Nicely formatted date
     */
    getFormattedDate : function(entry)
    {
      var date = entry.created_at;

      var tweetTimelineDate = new qx.util.format.DateFormat("EEE MMM d H:m:s Z YYYY", "en");
      var tweetSearchDate = new qx.util.format.DateFormat("EEE, d MMM YYYY H:m:s Z", "en");

      // convert to milliseconds
      var localOffset = (new Date).getTimezoneOffset() * 60 * 1000;
      var now = +(new Date);
      var parsedDate;

      try {
        parsedDate = tweetTimelineDate.parse(date);
      } catch(ex) {
        parsedDate = tweetSearchDate.parse(date);
      }

      var since = (now + localOffset - parsedDate) / 1000 / 60;

      if (since < 60) {
        return qx.locale.Manager.tr("%1 minutes", Math.floor(since));
      } else if (since < (60*24)) {
        return qx.locale.Manager.tr("%1 hours", Math.floor(since/60));
      } else {
        return qx.locale.Manager.tr("%1 days", Math.floor(since/60/24));
      }
    }
  }
});