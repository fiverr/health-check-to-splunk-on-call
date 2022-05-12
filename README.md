# Cloudflare Health Check → Splunk On-Call [![](https://circleci.com/gh/fiverr/health-check-to-splunk-on-call/tree/master.svg?style=svg)](https://circleci.com/gh/fiverr/health-check-to-splunk-on-call/tree/master)

☁️ Cloudflare Edge Worker to relay Health Check messages to Splunk On-Call (FKA Victorops)

```mermaid
graph TD;
	A[Cloudflare Health Check] -- unhealthy --> B[Relay Worker];
	A -- healthy --> B;
	B -- critical --> C[Splunk On Call];
	B -- recovery --> C;
```

> I'm using fake keys and domain names in this document

## Splunk On-Call REST API

Retreive your API key from Splunk On-Call:

| ![](https://user-images.githubusercontent.com/516342/168111213-54090396-b025-49b9-9e00-4bc47829136b.png)
| -
| `https://alert.victorops.com/integrations/generic/20131114/alert/e948df8a-1579-4fd0-85f1-985edfa98950/$routing_key`

## Cloudflare Edge Worker

Create an edge worker with the name `health-check-to-splunk-on-call` (suggestion)

| ![](https://user-images.githubusercontent.com/516342/168106672-98198468-3d86-4c91-83c7-91266b06a825.png#gh-light-mode-only) ![](https://user-images.githubusercontent.com/516342/168106687-503b04fc-b36f-41e3-b49d-79dd231f9385.png#gh-dark-mode-only)
| -

## Cloudflare Notification Destination

Configure a notification destination webhook on Cloudflare

- **Name**: Descriptive name
- **URL**: `https://health-check-to-splunk-on-call.my-worker-subdomain.workers.dev/<ROUTING_KEY>`
- **Secret**: Splunk On-Call API key

Use the API key from Splunk On-Call as the secret:

| ![](https://user-images.githubusercontent.com/516342/168109172-c51106cd-bdd1-468c-bc79-4cd35afe6eab.png#gh-light-mode-only) ![](https://user-images.githubusercontent.com/516342/168109189-90fe24b4-fff8-4c2b-ba64-a48ef4ca9d04.png#gh-dark-mode-only)
| -

## Data Schemas

### Cloudflare Health Check Webhook Payload

- **name**: [`String`] Notification name
- **text**: [`String`] Check name, Check ID, Time, Status
- **data**:
  - **time**: [`String`] 'YYYY-MM-DD HH:mm:ss +0000 UTC'
  - **status**: Healthy | Unhealthy
  - **reason**: [`String`] Response code mismatch error, No failure
  - **name**: [`String`] test_name
  - **health_check_id**: [`String`]
  - … more arbitrary information

### Splunk On-Call REST endpoint API

> [Splunk On-Call REST endpoint documentation](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/)

- **message_type**: CRITICAL | WARNING | ACKNOWLEDGEMENT | INFO | RECOVERY
- **entity_id**: [`String`]
- **entity_display_name**: [`String`]
- **state_message**: [`String`]
- **state_start_time**: [`Number`] (Linux/Unix time)

---

## Notification

Add the Splunk relay destination to your notification.

> Make sure you choose "Becomes healthy or unhealthy" to ensure incidents will be automatically resolved when applicable.

| ![](https://user-images.githubusercontent.com/516342/168271889-bd9883ce-4af2-4091-9d41-969cdb2aa6a9.png#gh-light-mode-only) ![](https://user-images.githubusercontent.com/516342/168271877-feebdfa4-addd-48d2-bf8b-6dc58604629f.png#gh-dark-mode-only)
| -
