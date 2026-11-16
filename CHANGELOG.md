# Changelog

## 0.6.0

1041 operations across 45 namespaces.

### New namespaces

- `meetings` - accept, decline or cancel a meeting request, and edit your own meeting page
  (`accept_meeting_request`, `decline_meeting_request`, `cancel_meeting_request`,
  `edit_my_meeting_page`).
- `experiments` - beliefs and how they changed over time (`tenant_beliefs`, `tenant_belief`,
  `tenant_belief_over_time`, `add_belief`, `edit_belief`, `delete_belief`, `tenant_chain`).

### Other new operations

- Feed posts: `feed_post`, `add_feed_post`, `edit_own_feed_post`, `delete_own_feed_post`, and for feed
  moderators `edit_feed_post`, `delete_feed_post`.
- Feed post comments: `list_feed_post_comments`, `add_feed_post_comment`, `edit_own_feed_post_comment`,
  `delete_own_feed_post_comment`, and for feed moderators `edit_feed_post_comment`,
  `delete_feed_post_comment`.
- Public page: `edit_tenant_public_page_settings`, `publish_public_pages`, web links
  (`add_web_link`, `edit_web_link`, `delete_web_link`, `reorder_web_links`), public forms
  (`add_public_form`, `edit_public_form`, `delete_public_form`), `add_public_share`, and the brand
  cover (`generate_upload_url_brand_cover`, `edit_brand_cover_focus`, `mark_brand_cover_as_deleted`).
- `edit_tenant_meetings_settings`.
- Messages sent about a record: `customer_asset_messages`, `location_messages`,
  `operational_work_item_messages`, `external_support_request_messages`,
  `internal_support_request_messages`.
- `email_template_defaults`, `set_email_template_default`.
- `lead_history`, `proposal_lead_history`, `analytics_sales_leads`.

### Changes

- `send_email` on accepting, rejecting and delivering portal orders, on changing or closing an external
  support request and on its comments; `mark_project_delivered` takes an optional body with
  `send_email`.
- `record_activity` when sending a document or a proposal by email.
- Processes have `allow_take_over`, and task `actions` report `can_claim`.
- Feed events carry `comment_count`, `edited`, `can_edit` and `can_delete`; the feed says `can_post`.
- Catalog items have `available_on_public_page`; legal info has `legal_brand_name`,
  `legal_contact_email` and `legal_contact_phone`.
- Sales analytics report deals and value slower than usual and what the forecast is waiting on.
  `probability_percent` on a pipeline stage can be fractional or empty.
- `EditLead.status` may be left empty.

## 0.5.0

990 operations across 43 namespaces.

### New namespace

- `time_off` - members ask for time off, change or withdraw it, and approvers list, approve or reject
  it (`add_my_time_off`, `list_my_time_off`, `list_time_off_requests`, `approve_time_off`,
  `reject_time_off`).

### Other new operations

- `import_orgs`, `import_orgs_preview`, `import_catalog`, `import_catalog_preview` - import customers
  and catalog items, with a preview first.
- `tenant_messages_list`, `org_messages`, `proposal_messages` - the messages your workspace sent.
- `generate_upload_url_catalog_picture`, `mark_catalog_picture_as_deleted` - catalog pictures.

### Changes

- `finalize_document`: `series_id` is optional; a document from a template with no series finalizes
  without a number.
- Task lists carry `actions` and `source_*`; assets accept `next_service_date`; payments accept
  `invoiced_date`.

### Breaking changes

- Removed: `generate_download_url_member_avatar`, `generate_download_url_org_branding`,
  `generate_download_url_tenant_branding`, `generate_download_url_user_avatar`,
  `generate_upload_url_org_branding`, `mark_org_branding_as_deleted`.
- `generate_upload_url_*` no longer take `attachmentNodeId` or `attachmentNodeType`.
- `mark_member_avatar_as_deleted`, `mark_tenant_branding_as_deleted` and `mark_user_avatar_as_deleted`
  no longer take a body.
- `partner_approve_product` and `partner_reject_product` take their ids from the path only.
- `list_work_item_comments` and `list_operational_work_item_comments` no longer return `attachments`.

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
