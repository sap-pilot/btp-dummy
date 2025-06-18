sap.ui.define([
	'sap/ui/core/UIComponent'
],
	function(UIComponent, models) {
	"use strict";

	var Component = UIComponent.extend("btp.dummy.incidents.Component", {

		metadata : {
			manifest: "json"
		},

		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
		}
	});

	return Component;

});
