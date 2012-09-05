core.Module("unify.bom.Element", {
	contains : function(root, element) {
		var p = element;
		while (p) {
			if (p === root) {
				return true;
			}
			
			p = p.parentNode;
		}
		
		return (p === root);
	}
});