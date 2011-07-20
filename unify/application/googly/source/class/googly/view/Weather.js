/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

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
    getTitle : function(type) {
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
        city : unify.bom.Storage.get("weather/city") || "Darmstadt"
      };
    },
    

    // overridden
    _getRenderVariant : function() {
      return this.getSegment();
    },
    
    
    // overridden
    _createView : function() 
    {
      //var toolbar = new unify.ui.ToolBar;
      var toolbar = new unify.ui.widget.container.ToolBar();
      toolbar.setItems(
      [
        {
          kind : "button",
          jump : "weather-search", 
          label : "Select City"
        },
        {
          kind : "spacer"
        },
        {
          kind : "segmented",
          view : this,
          buttons : 
          [
            {
              segment: "current", 
              label: "Currently"
            },
            {
              segment: "forecast", 
              label: "Forecast"
            }
          ]
        },
        {
          kind : "spacer"
        },        
        {
          kind : "button",
          exec : "refresh", 
          label : "Refresh"
        }
      ]);
      this.add(toolbar);
      
      var weatherDisplay = this.__weatherDisplay = new unify.ui.widget.basic.Content();
    },
    
    
    /**
     * Converts temperature from Fahrenheit to Celsius
     *
     * @param fahrenheit {Number} Temperature in Fahrenheit
     * @return {Number} Temperature in Celsius
     */
    __fahrenheitToCelsius : function(fahrenheit) {
      return Math.round((5/9) * (fahrenheit-32));
    },
    
    _errorHandler : function() {
    },
    
    // overridden
    _renderData : function(data)
    {
      if (!data){
        this.__weatherDisplay.innerHTML='';
        return;
      } else {
        data = data.query.results;
      }
      
      var markup = "";

      if (data == null)
      {
        markup = "<h3>Could not find city: \"" + unify.bom.Storage.get("weather/city") + "\"</h3>";
      }
      else
      {
        var results = data.xml_api_reply.weather;
        var info = results.forecast_information;
        var currently = results.current_conditions;
        var forecast = results.forecast_conditions;
        
        markup += "<h3>" + info.city.data + "</h3>";
        
        var segment = this.getSegment();
        if (segment == "current")
        {
          markup += "<div class='cell'>";
          markup += "<h4>Now</h4>"
          markup += "<img src='http://www.google.com" + currently.icon.data + "'/>";
          markup += "<p><strong>Condition</strong>: " + currently.condition.data + "</p>";
          markup += "<p><strong>Humidity</strong>: " + currently.humidity.data + "</p>";
          markup += "<p><strong>Temp</strong>: " + this.__fahrenheitToCelsius(currently.temp_f.data) + "</p>";
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
            markup += "<p><strong>Temp</strong>: " + this.__fahrenheitToCelsius(entry.low.data) + " to " + this.__fahrenheitToCelsius(entry.high.data) + "</p>";
            markup += "</div>";
          }
          markup += "<p>Updated: " + info.forecast_date.data + "</p>";
        }
      }
      
      this.__weatherDisplay.innerHTML = markup;
    }
  }
});
