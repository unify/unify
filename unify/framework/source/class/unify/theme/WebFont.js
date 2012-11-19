(function() {

	var fontid = 0;
	var testString = "abcABCmmmWWW1234567890";
	//lowland.bom.Label.getTextSize("abcABCmmmWWW1234567890", style);

	core.Class("unify.theme.WebFont", {
		construct : function(font) {
			var fontName = this.__fontname = "webfont" + (fontid++);
			
			this.__initSize = lowland.bom.Label.getTextSize(testString, {
				fontFamily: fontName,
				fontSize: 50
			});
			this.__addFont(font);
			
			unify.core.Init.registerPrerunCallback(this.__testLoadingCallback, this);
		},
		
		members : {
			__initSize : null,
			__fontname : null,
			
			__testLoadingCallback : function(callback) {
				var testElement = document.createElement("span");
				core.bom.Style.set(testElement, {
					position: "absolute",
					top: "-999px",
					left: "-999px",
					fontSize: "300px",
					width: "auto",
					height: "auto",
					lineHeight: "normal",
					margin: "0",
					padding: "0",
					fontVariant: "normal",
					fontFamily: "\"" + this.__fontname + "\""
				});
				testElement.appendChild(document.createTextNode(testString));
				document.body.appendChild(testElement);
				
				var getSize = function() {
					return lowland.bom.Element.getContentSize(testElement);
				};
				
				var testSize = function(size1, size2) {
					if ((size1.width != size2.width) || (size1.height != size2.height)) {
						return true;
					} else {
						return false;
					}
				};
				
				var initSize = this.__initSize;
				var lastMeasure = { width: 0, height: 0 };
				
				var cnt = 0;
				var testFnt = function() {
					
					var size = getSize();
					
					if (testSize(size, initSize) && (size.width == lastMeasure.width) && (size.height == lastMeasure.height)) {
						document.body.removeChild(testElement);
						callback();
					} else {
						cnt++;
						
						if (cnt > 5000) {
							// If more than 5000 tests, maybe we have an issue with loading fonts, so open application anyway
							console.warn("Maybe fontloading of " + this.__fontname + " failed");
							document.body.removeChild(testElement);
							callback();
						} else {
							lastMeasure = size;
							testFnt.lowDelay(100);
						}
					}
				};
				
				testFnt();
			},
			
			__addFont : function(font) {
				var fontname = this.__fontname;
				
				var text = [
					"@font-face {",
						"font-family: '" + fontname + "';",
						"src:url('" + jasy.Asset.toUri(font+".eot") + "');",
						"src:url('" + jasy.Asset.toUri(font+".eot") + "?#iefix') format('embedded-opentype'),",
							"url('" + jasy.Asset.toUri(font+".woff") + "') format('woff'),",
							"url('" + jasy.Asset.toUri(font+".ttf") + "') format('truetype'),",
							"url('" + jasy.Asset.toUri(font+".svg") + "#" + fontname + "') format('svg');",
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