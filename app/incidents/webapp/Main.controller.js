sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller, Incidents) {
	"use strict";
	return Controller.extend("btp.dummy.incidents.Main", {
		onInit: function (oEvent) {
			this._incidentsModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("btp/dummy/incidents")+'/Incidents.json');
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
			const sComponentUrl = sap.ui.require.toUrl("btp/dummy/incidents");
			const sRequestUrl = (window.location.hostname == 'localhost')? oSourceObj.request.url : sComponentUrl + oSourceObj.request.url;  // change to component path for Workzone deployment
			$.ajax({
				url: sRequestUrl,
				type: oSourceObj.request.method,
				contentType: 'application/json',
				data: oSourceObj.request.method === "POST" && oSourceObj.request.data? JSON.stringify(oSourceObj.request.data) : null,
				headers: oSourceObj.request.headers || {},
				processData: false,
				context: this,
				success: function (data, textStatus, jqXHR) {
					let oHeaders = this.parseHeader(jqXHR.getAllResponseHeaders());
					let sStatusLine = `${jqXHR.status} ${jqXHR.statusText}`;
					this._incidentsModel.setProperty(`/${iIndex}/response`, {"status": sStatusLine, "headers": oHeaders, "body": data});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					let oHeaders = this.parseHeader(jqXHR.getAllResponseHeaders());
					let sStatusLine = `${jqXHR.status} ${jqXHR.statusText}`;
					this._incidentsModel.setProperty(`/${iIndex}/response`,{"error": errorThrown, "status": sStatusLine, "headers": oHeaders, "body":jqXHR.responseText});
				},
				complete: function(e) {
					this._incidentsModel.setProperty(`/${iIndex}/running`, false);
				}
			});
		},
		parseHeader: function(headerLines) {
			let oHeaders = {};
			headerLines.split("\r\n").map(((line)=>{ 
				let kv = line.split(":"); 
				let k = kv[0];
				if (k) oHeaders[k] = (kv[1]||"").trim(); 
			}));
			return oHeaders;
		}
	});
});