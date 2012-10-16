(function() {

	var fontid = 0;

	core.Class("unify.theme.WebFont", {
		construct : function(font) {
			this.__fontname = "webfont" + (fontid++);
			
			this.__addFont(font);
		},
		
		members : {
			__fontname : null,
			
			__addFont : function(font) {
				var fontname = this.__fontname;
				
				var text = [
					"@font-face {",
						"font-family: '" + fontname + "';",
						"src:url('" + jasy.Asset.toUri(font+".eot") + "');",
						"src:url('" + jasy.Asset.toUri(font+".eot") + "?#iefix') format('embedded-opentype'),",
							"url('" + jasy.Asset.toUri(font+".svg") + "#icomoon') format('svg'),",
							"url('" + jasy.Asset.toUri(font+".woff") + "') format('woff'),",
							"url('" + jasy.Asset.toUri(font+".ttf") + "') format('truetype');",
							"font-weight: normal;",
							"font-style: normal;",
					"}"
				].join("\n");
				
				lowland.bom.Style.addStyleText(text);
			},
			
			fontValue : function() {
				var ret = {
					fontFamily: this.__fontname,
					speak: "none",
					fontWeight: "normal"
				};
				
				if (jasy.Env.getValue("engine") == "webkit") {
					ret.fontSmoothing = "antialiased";
				}
				
				return ret;
			}
		}
	});

})();