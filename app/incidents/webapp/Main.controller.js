sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller) {
	"use strict";
	return Controller.extend("btp.dummy.incidents.Main", {
		onInit: function (oEvent) {
			this._incidentsModel = new sap.ui.model.json.JSONModel('Incidents.json');
			this.getView().setModel(this._incidentsModel, "incidents");
		},
		onRunIncident: function (oEvent) {
			let oSourceObj = oEvent.getSource().getBindingContext("incidents").getObject();
			if (!oSourceObj) {
				console.error("No source object found for the event");
				return;
			}
			let aIncidents = this._incidentsModel.getData();
			let iIndex = aIncidents.indexOf(oSourceObj);
			console.log(`## run Incidents[${iIndex}]`);
			console.log(oSourceObj.request);
			// Update the status of the incident to 'Running'
			this._incidentsModel.setProperty(`/${iIndex}/running`, true);
			$.ajax({
				url: window.location.hostname == 'localhost'? oSourceObj.request.url : oSourceObj.request.url.slice(1), // remove absolute path for Workzone deployment
				type: oSourceObj.request.method,
				contentType: 'application/json',
				data: oSourceObj.request.method === "POST" && oSourceObj.request.data? JSON.stringify(oSourceObj.request.data) : null,
				headers: oSourceObj.request.headers || {},
				processData: false,
				context: this,
				success: function (data) {
					this._incidentsModel.setProperty(`/${iIndex}/response`, data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					this._incidentsModel.setProperty(`/${iIndex}/response`,{"error": errorThrown, "responseText":jqXHR.responseText});
				},
				complete: function(e) {
					this._incidentsModel.setProperty(`/${iIndex}/running`, false);
				}
			});
		}
	});
});