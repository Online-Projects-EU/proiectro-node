# proiectro

Official TypeScript/JavaScript SDK for the [Proiect.ro](https://proiect.ro) API.

Full type safety for every endpoint, request, and response.

## Installation

```bash
npm install proiectro
```

## Quick Start

```typescript
import { client, tenantOrgs, addSubtenant } from 'proiectro';

// Authenticate (baseUrl defaults to https://proiect.ro)
client.setConfig({
  auth: () => 'your_api_key_here',
});

// Define your workspace
const workspace = { path: { tenant_path: 'my-workspace' } };

// List customers
const { data, error } = await tenantOrgs(workspace);

if (data) {
  console.log('Customers:', data);
}
```

## Authentication

Create an API key in your workspace under **Settings > API Keys**. The SDK sends it as a Bearer token automatically.

```typescript
import { client } from 'proiectro';

client.setConfig({
  auth: () => 'your_api_key_here',
});
```

The `auth` callback is called on every authenticated request. You can return the key from an environment variable, a secret manager, or any async source:

```typescript
client.setConfig({
  auth: () => process.env.PROIECTRO_API_KEY,
});
```

To point at a different server (e.g. staging or self-hosted), override the `baseUrl`:

```typescript
client.setConfig({
  baseUrl: 'https://staging.proiect.ro',
  auth: () => process.env.PROIECTRO_API_KEY,
});
```

## Workspace

Most API operations are scoped to a workspace (tenant). Define it once and spread it into every call:

```typescript
const workspace = { path: { tenant_path: 'my-workspace' } };

await tenantOrgs(workspace);
await addSubtenant({ ...workspace, body: { name: 'Acme Corp' } });
await listProjects(workspace);
```

A few operations are user-scoped (notifications, invitations) and don't need a workspace path.

## Usage Examples

### Customers

```typescript
import {
  tenantOrgs,
  addSubtenant,
  editSubtenant,
  deleteSubtenant,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List all customers
const { data: customers } = await tenantOrgs(workspace);

// Create a customer
const { data: created } = await addSubtenant({
  ...workspace,
  body: {
    name: 'Acme Corp',
    parent_id: 'org-uuid',
  },
});

// Update a customer
await editSubtenant({
  path: { tenant_path: 'my-workspace', subtenant_id: 'customer-uuid' },
  body: { name: 'Acme Corporation' },
});

// Delete a customer
await deleteSubtenant({
  path: { tenant_path: 'my-workspace', subtenant_id: 'customer-uuid' },
});
```

### Proposals

```typescript
import {
  addProposal,
  editProposal,
  changeProposalStage,
  orgProposals,
} from 'proiectro';

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
    parent_id: 'customer-uuid',
    funnel_id: 'funnel-uuid',
  },
});

// Move a proposal to the next stage
await changeProposalStage({
  ...workspace,
  body: {
    proposal_id: 'proposal-uuid',
    stage_id: 'next-stage-uuid',
  },
});
```

### Projects & Work Items

```typescript
import {
  listProjects,
  projectWorkItems,
  addWorkItem,
  updateWorkItemStatus,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List all projects
const { data: projects } = await listProjects(workspace);

// Get work items for a project
const { data: workItems } = await projectWorkItems({
  path: { tenant_path: 'my-workspace', project_id: 'project-uuid' },
});

// Create a work item
await addWorkItem({
  ...workspace,
  body: {
    name: 'Design mockups',
    project_id: 'project-uuid',
    work_item_type_id: 'type-uuid',
  },
});

// Update work item status
await updateWorkItemStatus({
  ...workspace,
  body: {
    work_item_id: 'work-item-uuid',
    status: 'in_progress',
  },
});
```

### Payments

```typescript
import {
  addPayment,
  markPaymentPaid,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// Create a payment
await addPayment({
  ...workspace,
  body: {
    proposal_id: 'proposal-uuid',
    amount: '5000.00',
    currency: 'EUR',
    due_date: '2026-03-15',
  },
});

// Mark a payment as paid
await markPaymentPaid({
  ...workspace,
  body: { payment_id: 'payment-uuid' },
});
```

### Tags

```typescript
import {
  tenantTags,
  addTag,
  tagOrg,
  untagOrg,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List all tags
const { data: tags } = await tenantTags(workspace);

// Create a tag
await addTag({
  ...workspace,
  body: { name: 'VIP', color: '#ff0000' },
});

// Tag a customer
await tagOrg({
  ...workspace,
  body: { org_id: 'customer-uuid', tag_id: 'tag-uuid' },
});
```

### Support Requests

```typescript
import {
  addInternalSupportRequest,
  mySupportRequests,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List my support requests
const { data: tickets } = await mySupportRequests(workspace);

// Create a support request
await addInternalSupportRequest({
  ...workspace,
  body: {
    title: 'Server configuration issue',
    description: 'Need help with DNS setup',
    type_id: 'type-uuid',
    severity_id: 'severity-uuid',
  },
});
```

### Team

```typescript
import {
  tenantTeam,
  inviteToTeam,
} from 'proiectro';

const workspace = { path: { tenant_path: 'my-workspace' } };

// List team members
const { data: team } = await tenantTeam(workspace);

// Invite someone to the team
await inviteToTeam({
  ...workspace,
  body: { email: 'colleague@example.com' },
});
```

## Error Handling

Every SDK function returns `{ data, error, request, response }`:

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

## Interceptors

Add request/response interceptors for logging, retries, or custom headers:

```typescript
import { client } from 'proiectro';

// Log all requests
client.interceptors.request.use((request) => {
  console.log(`${request.method} ${request.url}`);
  return request;
});

// Log all responses
client.interceptors.response.use((response) => {
  console.log(`${response.status} ${response.url}`);
  return response;
});
```

## TypeScript

Every request and response is fully typed. Your editor will autocomplete path parameters, body fields, and response shapes:

```typescript
import type { OutputTenantInfo, AddSubtenantData } from 'proiectro';
```

## Requirements

- Node.js >= 18 (uses native `fetch`)
- TypeScript >= 5.0 (optional, works with plain JavaScript too)

## API Documentation

Full API reference is available at [proiect.ro/api/v1/docs](https://proiect.ro/api/v1/docs).

## License

MIT
