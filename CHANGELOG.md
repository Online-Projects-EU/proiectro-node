# Changelog

## 0.4.0

980 operations across 42 namespaces.

### New namespaces

- `shares` - show a customer organisation the proposals, documents and files you choose: assemble a
  share (`addShare`, `addShareProposal`, `addShareOrgDocument`, `addShareOrgFile`, ...),
  publish and unpublish it, see who opened what (`shareAccesses`).
- `sales_targets` - target schemes and their bands, and per-person sales targets
  (`addTargetScheme`, `addTargetBand`, `addSalesTarget`, ...).

### Orders and quote requests

- Customer portal: `portalOrderCatalog`, `addOrder`, `portalOrders`, `portalOrder`,
  `portalClosedOrders`, `portalCancelOrder`, `portalConfirmOrderReceipt`; quote requests with
  `portalQuoteCatalog`, `addQuoteRequest`, `portalQuoteRequests`, `portalQuoteRequest`,
  `portalWithdrawQuoteRequest`.
- Partner portal: the same flow towards a partner, from `partnerPortalOrderCatalog` and
  `addPartnerOrder` to `partnerPortalConfirmOrderReceipt`, and `addPartnerQuoteRequest`.
- Supplier side: `acceptPortalOrder`, `rejectPortalOrder`, `markPortalOrderDelivered`.
- Price lists decide which catalog items each customer and partner sees, and at what price:
  `addPriceList`, `editPriceList`, `editPriceListItems`, `deletePriceList`,
  `setOrgPriceLists`, `setBridgePriceLists`.
- Catalog items carry `available_in_customer_portal`, `available_in_partner_portals` and
  `price_lists`; customers carry `portal_ordering_enabled` and `portal_quote_requests_enabled`;
  funnels carry `used_for_orders` and `used_for_quote_requests`.

### Other new operations

- Customer portal shares: `portalShares`, `portalShare`, `portalShareProposal`, PDF downloads.
- Coordinates for locations, customer locations and assets (`setLocationCoordinates`,
  `setCustomerLocationCoordinates`, `setCustomerAssetCoordinates`); `getCustomerAsset`,
  `tenantCustomerAssets`.
- Notification preferences, for the workspace and for yourself.
- Sales: `myPipeline`, `myStageProposals`, `mySales`, `salespersonSales`,
  `listSaleActivityTypes`, `productDetails`; leads: `fastProposal`, `leadOwnerCandidates`.
- `myProfile` / `editMyProfile`, `tenantMyWorkItems`, `tenantMyBookings`,
  `myPermissionsExplain`.

### Breaking changes

- Work logs are in minutes. `addWorkLog` and `editWorkLog` take `duration` (`2`, `1h30m`, `45m`
  or `3:45`; a bare number is hours) instead of `hours`; work log responses carry `minutes`,
  `total_minutes` and `total_logged_minutes` instead of the hour fields, and delivery KPIs carry
  `minutes_logged_period` / `minutes_logged_total`.
- `projectProductDetails` is removed; use `productDetails`.
- `deleteLeadList` takes no request body.
- Member preferences no longer carry `preference_mentions`, `preference_my_number`,
  `preference_my_string` or `preference_theme`.

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
