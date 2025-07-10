sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller) {
	"use strict";
	return Controller.extend("btp.dummy.incidents.Main", {
		onInit: function (oEvent) {
			this._casesModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("btp/dummy/incidents")+'/cases.json');
			this.getView().setModel(this._casesModel, "cases");
		},
		onRunIncident: function (oEvent) {
			let oSourceObj = oEvent.getSource().getBindingContext("cases").getObject();
			if (!oSourceObj) {
				console.error("No source object found for the event");
				return;
			}
			let allCases = this._casesModel.getData();
			let iIndex = allCases.indexOf(oSourceObj);
			if (oSourceObj.xhr) {
				console.log(`## abort case[${iIndex}]`);
				oSourceObj.xhr.abort();
				this._casesModel.setProperty(`/${iIndex}/running`, false);
				this._casesModel.setProperty(`/${iIndex}/response`, {"status":"Aborted"});
				oSourceObj.xhr = null;
			} else {
				console.log(`## run case[${iIndex}]`);
				console.log(oSourceObj.request);
				// Update the status of the incident to 'Running'
				this._casesModel.setProperty(`/${iIndex}/running`, true);
				this._casesModel.setProperty(`/${iIndex}/response`, {"status":"Running"});
				const sComponentUrl = sap.ui.require.toUrl("btp/dummy/incidents");
				const sRequestUrl = (window.location.hostname == 'localhost')? oSourceObj.request.url : sComponentUrl + oSourceObj.request.url;  // change to component path for Workzone deployment
				oSourceObj.xhr = $.ajax({
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
						this._casesModel.setProperty(`/${iIndex}/response`, {"status": sStatusLine, "headers": oHeaders, "body": data});
					},
					error: function (jqXHR, textStatus, errorThrown) {
						let oHeaders = this.parseHeader(jqXHR.getAllResponseHeaders());
						let sStatusLine = `${jqXHR.status} ${jqXHR.statusText}`;
						this._casesModel.setProperty(`/${iIndex}/response`,{"error": errorThrown, "status": sStatusLine, "headers": oHeaders, "body":jqXHR.responseText});
					},
					complete: function(e) {
						this._casesModel.setProperty(`/${iIndex}/running`, false);
						oSourceObj.xhr = null; // clear the xhr reference
					}
				});
			}
		},
		parseHeader: function(headerLines) {
			let oHeaders = {};
			headerLines.split("\r\n").map(((line)=>{ 
				let kv = line.split(":"); 
				let k = kv[0];
				if (k) oHeaders[k] = (kv[1]||"").trim(); 
			}));
			return oHeaders;
		},
		formatStatusIcon: function (sStatus) {
			if (sStatus && sStatus == 'Running')
				return 'sap-icon://lateness';
			else 
				return null;
		},
		formatStatusColorScheme: function (sStatus) {
			if (!sStatus)
				return 6;
			else if (sStatus.startsWith("2")) {
				return 8; // green - success
			} else if (sStatus.startsWith("4")) {
				return 1; // yellow - warning
			} else if (sStatus.startsWith("5") || sStatus.indexOf("error") > -1) {
				return 2; // red - error
			} else if (sStatus == 'Running') {
				return 7; // cyan - running
			} else if (sStatus == 'Aborted') {
				return 9; // purple - aborted
			}
			else {
				return 6; // blue - info only
			}
		}
	});
});