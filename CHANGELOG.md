# Changelog

## 0.3.0

881 operations across 40 namespaces.

### New namespaces

- `leads` — capture leads, organise them in lists, move them through the pipeline
  (`updateLeadStatus`, `claimLead`, `rescheduleLead`, `disqualifyLead`), convert them into
  customers (`markLeadConverted`), import in bulk, log activities.
- `documents` — document templates and numbered series; generate documents for proposals,
  organisations, locations, assets and support requests (`generate*Document`); list and filter.
- `custom_forms` — form definitions, versions, steps and fields; submissions
  (`submitCustomForm`, `formSubmissions`, `editSubmissionStatus`).
- `timers` — add, edit and delete timers; list them.
- `comments` — one comment surface for work items, operational items and support requests,
  including the `Own` variants for editing and deleting your own comments.
- `kpis` — 22 KPI endpoints: overdue and upcoming payments, revenue at risk, projects at risk,
  stale and expiring proposals, lead pipeline health, open tickets and queue health, team workload,
  and more.
- `integrations` — `enrichCompany`: look up a Romanian company by CUI (name, registration number,
  VAT status, address) to auto-fill legal entity data.

### New operations in existing namespaces

- Projects: `archiveProject` / `unarchiveProject`; `tenantMyWorklist`.
- Rich query filters on `listProjects`, `orgProjects`, `listTasks` and `projectWorkItems` —
  `search`, `owner`, `customer`, `manager`, date ranges, `lifecycle_status`, tags and labels.
- Locations carry `latitude` / `longitude`; customers accept `domains`; payments accept
  `show_sources` and expose their `sources`; proposals expose `rejected_at` /
  `rejection_reason`; the workspace has a `lead_visibility` policy.

### Package

- Requires Node.js >= 20.

## 0.2.0

Initial public release.
