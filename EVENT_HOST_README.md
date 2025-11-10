# Event host instructions

## Azure infrastructure setup preparation

1. Log into "nerdschool" org at https://app.terraform.io/.
2. Select "cloud-infra" under Workspaces.
3. Go to Variables tab.
4. Set `number_of_sites` to the number of event Azure Static Web App sites you want to create. Set this to RSVP count or a bit higher.
5. Select "New run" button on top right.
6. Select "Plan and apply" under Run Type, click "Start"
7. Wait for the run to complete.

Terraform source code: <https://github.com/nerdschoolbergen/cloud-infra/tree/main>

## Vending machine app

- The vending machine app is used by event attendees to register and get their own Azure Static Web App site while attending the event.
- <https://nerdschool-vending-machine.vercel.app/> is the public URL for the vending machine app.
- App source code: <https://github.com/nerdschoolbergen/cloud-infra/tree/main/vending-machine>
- The app connects to Terraform Cloud API to get the list of available event sites and allocates one site per event attendee. Each attendee gets a unique URL to their own event site and a key to deploy.
- The app sends out an email to the attendee with their unique event site URL and deployment key.
- This Google Sheet is updated for each attendee with their unique event site URL and deployment key: <https://docs.google.com/spreadsheets/d/1dhokHgE63OayadCiRg0frQO_iG7qwKa8X2e4r4DoULc/edit?gid=0#gid=0>
- If you try to register twice with the same email address, the app will prevent you from getting a second site.

### Clearing registrations

- Remove all rows from the Google Sheet: <https://docs.google.com/spreadsheets/d/1dhokHgE63OayadCiRg0frQO_iG7qwKa8X2e4r4DoULc/edit?gid=0#gid=0>
- Clear Redis cache used by the vending machine app:
  - Go to https://vercel.com/nerdschool/vending-machine
  - Select Storage tab
  - Select database
  - Select Open in Redis
  - Open Redis Insight via Launch button under "View and manage your data with Redis Insight"
  - Select Workbench tab
  - Run command: `FLUSHALL`

## Post-event cleanup

1. Log into "nerdschool" org at https://app.terraform.io/.
2. Select "cloud-infra" under Workspaces.
3. Go to Variables tab.
4. Set `number_of_sites` to 0.
5. Select "New run" button on top right.
6. Select "Plan and apply" under Run Type, click "Start"
7. Wait for the run to complete.
