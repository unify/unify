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
  extend : unify.view.ServiceView,
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
      segmented.add({segment:"info", label:"Info"});
      
      var toolbar = new unify.ui.ToolBar(this);
      toolbar.add({jump:"weather-search", label:"Search", target:"right"});
      toolbar.add(segmented);
      layer.add(toolbar);
      
      var content = new unify.ui.Content;
      content.add("<div id='weatherDisplay'></div>");
      layer.add(content);

      var infobar = new unify.ui.ToolBar(this);
      infobar.add("<div id='cityDisplay'>City</div>");
      layer.add(infobar);
      
      return layer;
    },
    
    

    // overridden
    _renderData : function(data)
    {
      console.debug("RENDER DATA:", data)
      return;
      
      var Yql = googly.business.Yql.getInstance();
      var WeatherSearch = googly.view.WeatherSearch.getInstance();
      
      var city = WeatherSearch.getCity();
      if (city == null)
      {
        window.setTimeout(function() {
          unify.view.Navigation.getInstance().navigate(unify.view.Path.fromString("weather-search"));
        }, 100);
      }
      else
      {
        var cached = Yql.getCachedEntry("weather", {city:city});
        var results = cached.data.query.results.xml_api_reply.weather;
        
        var info = results.forecast_information;
        var currently = results.current_conditions;
        var forecast = results.forecast_conditions;
        
        var markup = "";

        document.getElementById("cityDisplay").innerHTML = info.city.data;
        
        var segment = this.getSegment();
        if (segment == "current")
        {
          markup += "<img src='http://www.google.com" + currently.icon.data + "'/>";
          markup += "<p><strong>Condition</strong>: " + currently.condition.data + "</p>";
          markup += "<p><strong>Humidity</strong>: " + currently.humidity.data + "</p>";
          markup += "<p><strong>Temp</strong>: " + currently.temp_c.data + "</p>";
          markup += "<p><strong>Wind</strong>: " + currently.wind_condition.data + "</p>";
        }
        else if (segment == "info")
        {
          markup += "<p><strong>Currently Date</strong>: " + info.current_date_time.data + "</p>";
          markup += "<p><strong>Forecast Date</strong>: " + info.forecast_date.data + "</p>";
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
        }
        
        var display = document.getElementById("weatherDisplay");
        display.innerHTML = markup;
      }
    }
  }
});
