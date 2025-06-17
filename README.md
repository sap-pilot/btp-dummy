# btp-dummy
Dummy app for BTP / CAP / Work-zone issue resolution


## Local Setup

Execute below to setup the app and test locally

1. `npm ci`
2. `cds watch`
3. Open browser and navigate to: http://localhost:4004/incidents/webapp/index.html 
4. Click on the 'Run' button to reproduce corresponding issue

## Remote Deployment

Execute below to build and deploy the app to Cloud Foundry & Work-zone

1. `npm ci`
2. `npm run build`
3. `cf login`
4. `npm run deploy`
5. Open Work-zone Content Manager, add 'BTP Incidents' app and assign it to Everyone role or some other dedicated role collection
6. Find and open the app via Work-zone or BTP sub-account HTML5 repository 