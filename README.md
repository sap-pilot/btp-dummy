# btp-dummy

Dummy app for reproducing / troubleshooting  BTP / CAP / Work-zone issues

## Local Setup

Execute below to setup the app and test locally

1. `npm ci`
2. `cds watch`
3. Open browser and navigate to: http://localhost:4004/incidents/webapp/index.html 
4. Click on the 'Run' button to reproduce corresponding issue (Note: some incidents maybe not reproducible locally, in those case follow below [Remote Deployment](#remote-deployment) steps).

## Remote Deployment

Execute below to build and deploy the app to Cloud Foundry & Work-zone as Content Provider

1. `npm ci`
2. `npm run build`
3. `cf login`
4. `npm run deploy`
5. Open BTP Cockpit -> HTML5 Applications, find and open 'btpdummyincidents' app

### Work-zone Content Provider Deployment

In case of Work-zone Content Provider (cdm) related issues, follow below steps to deploy a 'btp_dummy' content provider and 'Dummy' role/space into Work-zone: 

1. Open BTP Cockpit -> Destination, update destination 'btp-dummy-cdm-rt' URL with the correct subdomain of the subaccount.
2. Open Work-zone Content Manager, add new 'Content Provider' 
   - Title: btp_dummy
   - ID: btp_dummy
   - Design-Time Destination: btp-dummy-cdm-dt
   - Runtime Destination: btp-dummy-cdm-rt
3. Open Work-zone site settings -> Role Assignment -> Content Channels tab, turn on 'Edit' mode, assign and save newly created 'btp_dummy' Channel to the site.
4. Open BTP Cockpit -> Role Collections, find and assign ~btp_dummy_BTP_DUMMY_ROLE to test user.
5. Open Workzone and Dummy space/tab, open the 'BTP Incidnent' app to reproduce the issues.