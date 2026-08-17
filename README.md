# proiectro

Official TypeScript/JavaScript SDK for the [Proiect.ro](https://proiect.ro) API.

Full type safety for every endpoint, request, and response.

## Installation

```bash
npm install proiectro
```

Requires Node.js >= 20 (uses native `fetch`). Works with TypeScript >= 5.0 or plain JavaScript.

## Quick Start

```typescript
import { client, tenantOrgs } from 'proiectro';

// Authenticate (baseUrl defaults to https://proiect.ro)
client.setConfig({
  auth: () => 'your_api_key_here',
});

// Every workspace-scoped call takes the workspace path
const workspace = { path: { tenant_path: 'my-workspace' } };

const { data, error } = await tenantOrgs(workspace);

if (data) {
  console.log('Customers:', data.orgs);
}
```

## Authentication

Create an API key in your workspace under **Settings > API Keys**. The SDK sends it as a Bearer token on every request.

```typescript
import { client } from 'proiectro';

client.setConfig({
  auth: () => process.env.PROIECTRO_API_KEY,
});
```

The `auth` callback runs on each request, so the key can come from an environment variable, a secret manager, or any async source.

An API key carries the scope it was created with (read-only or full CRUD, restricted to a team if you chose one). A call outside that scope returns `403`.

## Calling conventions

Every operation is a function named after its `operationId` in camelCase, taking one options object:

| Key | Contents |
|---|---|
| `path` | Path parameters. Nearly always includes `tenant_path` (your workspace); entity IDs go here too. |
| `body` | The JSON request body for `POST` / `PATCH` / `PUT`. |
| `query` | Query-string filters on list endpoints (`search`, `owner`, `status`, date ranges, tags/labels …). |

Every call returns `{ data, error, request, response }`. `data` is typed to the operation's `200` schema; `error` is typed to its documented error responses.

```typescript
const workspace = { path: { tenant_path: 'my-workspace' } };

// path only
await tenantOrgs(workspace);

// path + body
await addTag({ ...workspace, body: { name: 'VIP', color: '#ff0000' } });

// path with an entity id + body
await markPaymentPaid({
  path: { tenant_path: 'my-workspace', payment_id: 'payment-uuid' },
  body: { paid_date: '2026-03-15' },
});

// path + query
await listProjects({ ...workspace, query: { search: 'rollout', owner: 'member-uuid' } });
```

IDs are the `external_id` strings the API returns; dates are ISO 8601 strings (`YYYY-MM-DD` for dates, full timestamps for datetimes).

## Usage Examples

### Customers

```typescript
import { tenantOrgs, addSubtenant, editSubtenant, deleteSubtenant } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List all customers
const { data } = await tenantOrgs(workspace);

// Create a customer under your workspace
await addSubtenant({
  ...workspace,
  body: {
    parent_id: 'workspace-org-uuid',
    name: 'Acme Corp',
    timezone: 'Europe/Bucharest',
    default_currency: 'EUR',
    country: 'RO',
    manager: 'member-uuid',
  },
});

// Update a customer (send every field — this is a full update, not a patch)
await editSubtenant({
  path: { tenant_path: 'my-workspace', subtenant_id: 'customer-uuid' },
  body: {
    name: 'Acme Corporation',
    timezone: 'Europe/Bucharest',
    default_currency: 'EUR',
    country: 'RO',
    manager: 'member-uuid',
  },
});

// Delete a customer
await deleteSubtenant({
  path: { tenant_path: 'my-workspace', subtenant_id: 'customer-uuid' },
});
```

### Leads

```typescript
import { addLead, tenantAllLeads, updateLeadStatus, markLeadConverted } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// Capture an inbound lead
const { data: lead } = await addLead({
  ...workspace,
  body: {
    name: 'Jane Doe',
    company_name: 'Acme Corp',
    email: 'jane@acme.example',
    source: 'web_form',
  },
});

// List leads, filtered
await tenantAllLeads({ ...workspace, query: { status: 'new', has_email: true } });

// Move a lead through the pipeline. `updated_at` is the value you last read —
// the API rejects the write if someone else changed the lead in between.
await updateLeadStatus({
  path: { tenant_path: 'my-workspace', lead_id: 'lead-uuid' },
  body: { status: 'qualified', updated_at: '2026-03-15T10:00:00Z' },
});

// Convert it into a customer
await markLeadConverted({
  path: { tenant_path: 'my-workspace', lead_id: 'lead-uuid' },
  body: { new_org_name: 'Acme Corp', updated_at: '2026-03-15T10:05:00Z' },
});
```

### Proposals

```typescript
import { addProposal, orgProposals, changeProposalStage } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List proposals for a customer
const { data: proposals } = await orgProposals({
  path: { tenant_path: 'my-workspace', org_id: 'customer-uuid' },
});

// Create a proposal
await addProposal({
  ...workspace,
  body: {
    name: 'Q1 Consulting',
    description: 'Discovery and rollout support',
    customer: 'customer-uuid',
    owner: 'member-uuid',
    manager: 'member-uuid',
    sales_stage: 'funnel-stage-uuid',
    proposal_currency: 'EUR',
    wbsconfiguration: 'wbs-configuration-uuid',
  },
});

// Move a proposal to another funnel stage
await changeProposalStage({
  path: { tenant_path: 'my-workspace', proposal_id: 'proposal-uuid', stage_id: 'next-stage-uuid' },
  body: {},
});
```

### Projects & Work Items

```typescript
import { listProjects, projectWorkItems, addWorkItem, updateWorkItemStatus, addWorkItemComment } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List projects (all filters are optional)
const { data: projects } = await listProjects({ ...workspace, query: { lifecycle_status: ['active'] } });

// Work items of a project
const { data: workItems } = await projectWorkItems({
  path: { tenant_path: 'my-workspace', project_id: 'project-uuid' },
});

// Create a work item
await addWorkItem({
  ...workspace,
  body: {
    name: 'Design mockups',
    project_id: 'project-uuid',
    work_item_type_id: 'work-item-type-uuid',
    planned_start_date: '2026-03-01',
    planned_finish_date: '2026-03-10',
  },
});

// Report progress, or finish it
await updateWorkItemStatus({
  path: { tenant_path: 'my-workspace', work_item_id: 'work-item-uuid' },
  body: { percent_complete: 60 },
});
await updateWorkItemStatus({
  path: { tenant_path: 'my-workspace', work_item_id: 'work-item-uuid' },
  body: { finished_at: '2026-03-10T16:00:00Z' },
});

// Comment on it
await addWorkItemComment({
  ...workspace,
  body: { work_item_id: 'work-item-uuid', content: 'Mockups approved by the customer.' },
});
```

### Payments

```typescript
import { addPayment, markPaymentPaid } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// Add a payment to a proposal's payment schedule
await addPayment({
  ...workspace,
  body: {
    payment_schedule_block_id: 'schedule-block-uuid',
    name: 'Milestone 1',
    due_date: '2026-03-15',
    amount: '5000.00',
  },
});

// Mark it paid
await markPaymentPaid({
  path: { tenant_path: 'my-workspace', payment_id: 'payment-uuid' },
  body: { paid_date: '2026-03-14' },
});
```

### Documents

```typescript
import { tenantDocumentTemplatesList, generateProposalDocument, tenantDocumentsList } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// Templates available in the workspace
const { data: templates } = await tenantDocumentTemplatesList(workspace);

// Generate a numbered document for a proposal
await generateProposalDocument({
  path: { tenant_path: 'my-workspace', proposal_id: 'proposal-uuid' },
  body: { template_id: 'template-uuid' },
});

// Documents, filtered
await tenantDocumentsList({ ...workspace, query: { org_id: 'customer-uuid' } });
```

### Tags

```typescript
import { tenantTags, addTag, tagOrg, untagOrg } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

const { data: tags } = await tenantTags(workspace);

await addTag({ ...workspace, body: { name: 'VIP', color: '#ff0000' } });

// Tagging is addressed by path: (entity, tag)
await tagOrg({ path: { tenant_path: 'my-workspace', org_id: 'customer-uuid', tag_id: 'tag-uuid' } });
await untagOrg({ path: { tenant_path: 'my-workspace', org_id: 'customer-uuid', tag_id: 'tag-uuid' } });
```

### Support Requests

```typescript
import { addInternalSupportRequest, mySupportRequests } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

const { data: tickets } = await mySupportRequests(workspace);

await addInternalSupportRequest({
  ...workspace,
  body: {
    title: 'Server configuration issue',
    description: 'Need help with DNS setup',
    request_type: 'request-type-uuid',
    request_severity: 'severity-uuid',
  },
});
```

### Team

```typescript
import { tenantTeam, inviteToTeam } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

const { data: team } = await tenantTeam(workspace);

await inviteToTeam({ ...workspace, body: { email: 'colleague@example.com' } });
```

### Webhooks

Subscribe to platform events instead of polling:

```typescript
import { addWebhook, tenantWebhooks } from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

await addWebhook({
  ...workspace,
  body: {
    name: 'CRM sync',
    target_url: 'https://example.com/hooks/proiectro',
    event_types: ['changeProposalStage', 'markPaymentPaid'],
    is_active: true,
    is_secure: true,
  },
});

const { data: hooks } = await tenantWebhooks(workspace);
```

## Namespaces

| Area | Namespaces |
|---|---|
| Sales | `leads`, `proposals`, `orgs`, `rfp`, `bridge` (partnerships), `partnerportal` |
| Delivery | `projects`, `work`, `operations`, `comments`, `timers`, `booking`, `capacity`, `resources`, `holidays`, `calendar` |
| Money | `costs`, `exchange`, `analytics`, `kpis` |
| Support & assets | `support`, `assets`, `locations`, `custom_forms` |
| Documents & files | `documents`, `files`, `cdn` |
| Workspace | `tenant`, `team`, `rbac`, `tags`, `labels`, `notifications`, `feed`, `welcome`, `auth` |
| Automation | `webhooks`, `automation`, `integrations`, `portal` |

## Error Handling

```typescript
const { data, error, response } = await tenantOrgs({
  path: { tenant_path: 'my-workspace' },
});

if (error) {
  console.error('Status:', response?.status);
  console.error('Error:', error);
} else {
  console.log('Success:', data);
}
```

Validation failures come back as `422` with a field-level detail list; a permission or feature-entitlement problem is `403`; a missing entity is `404`; a conflict with the current state (a stage transition that is not allowed, a delete blocked by dependants) is `409`.

To have the SDK throw instead of returning `error`, pass `throwOnError`:

```typescript
const { data } = await tenantOrgs({ path: { tenant_path: 'my-workspace' }, throwOnError: true });
```

## Interceptors

Add request/response interceptors for logging, retries, or custom headers:

```typescript
import { client } from 'proiectro';

client.interceptors.request.use((request) => {
  console.log(`${request.method} ${request.url}`);
  return request;
});

client.interceptors.response.use((response) => {
  console.log(`${response.status} ${response.url}`);
  return response;
});
```

## TypeScript

Every request and response is fully typed. Your editor autocompletes path parameters, body fields, query filters, and response shapes:

```typescript
import type { OutputTenantInfo, AddSubtenantData, AddLeadData } from 'proiectro';
```

## API Documentation

Full API reference is available at [proiect.ro/api/v1/docs](https://proiect.ro/api/v1/docs).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
