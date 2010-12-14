/* ************************************************************************

  googly

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Answers View
 */
qx.Class.define("googly.view.Weather", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Weather";
    },
    
    
    // overridden
    getDefaultSegment : function() {
      return "current";
    },
    

    // overridden
    _getBusinessObject : function() {
      return googly.business.Yql.getInstance();
    },
    

    // overridden
    _getServiceName : function() {
      return "weather";
    },
    
    
    // overridden
    _getServiceParams : function() 
    {
      return {
        city : unify.storage.Simple.getItem("weather/city")
      };
    },
    

    // overridden
    _getRenderVariant : function() {
      return this.getSegment();
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      
      var segmented = new unify.ui.Segmented(this);
      segmented.add({segment:"current", label:"Currently"});
      segmented.add({segment:"forecast", label:"Forecast"});
      
      var toolbar = new unify.ui.ToolBar(this);
      toolbar.add({jump:"weather-search", label:"Search", target:"right"});
      toolbar.add(segmented);
      layer.add(toolbar);
      
      var weatherDisplay = this.__weatherDisplay = document.createElement("div");
      weatherDisplay.className = "content";
      layer.add(weatherDisplay);

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      if (data) {
        data = data.query.results;
      }
      
      if (data == null)
      {
        window.setTimeout(function() {
          unify.view.Navigation.getInstance().navigate(unify.view.Path.fromString("weather-search"));
        }, 100);
      }
      else
      {
        var results = data.query.results.xml_api_reply.weather;
        var info = results.forecast_information;
        var currently = results.current_conditions;
        var forecast = results.forecast_conditions;
        
        var markup = "";

        markup += "<h3>" + info.city.data + "</h3>";
        
        var segment = this.getSegment();
        if (segment == "current")
        {
          markup += "<div class='cell'>";
          markup += "<h4>Now</h4>"
          markup += "<img src='http://www.google.com" + currently.icon.data + "'/>";
          markup += "<p><strong>Condition</strong>: " + currently.condition.data + "</p>";
          markup += "<p><strong>Humidity</strong>: " + currently.humidity.data + "</p>";
          markup += "<p><strong>Temp</strong>: " + currently.temp_c.data + "</p>";
          markup += "</div>";
          markup += "<p>Updated: " + info.current_date_time.data + "</p>";
        }
        else
        {
          for (var i=0, l=forecast.length; i<l; i++)
          {
            var entry = forecast[i];
            markup += "<div class='cell'>";
            markup += "<h4>" + entry.day_of_week.data + "</h4>";
            markup += "<img src='http://www.google.com" + entry.icon.data + "'/>";
            markup += "<p><strong>Condition</strong>: " + entry.condition.data + "</p>";
            markup += "<p><strong>Temp</strong>: " + entry.low.data + " - " + entry.high.data + "</p>";
            markup += "</div>";
          }
          markup += "<p>Updated: " + info.forecast_date.data + "</p>";
        }
        
        this.__weatherDisplay.innerHTML = markup;
      }
    }
  }
});
