# Loading skeletons

Every page that waits on data, public or behind a login, shows a skeleton in its own shape while it waits, never a blank area, a bare spinner or an empty state such as "No results". This guide covers the rules, the shared pieces and how to add a skeleton for a new page or feature.

## The rules

1. **The skeleton has the shape of the page it stands in for.** Lay out its shapes where the real content goes: the same columns, cards, rows, field widths and padding. Someone watching the page load should see the content fill in, and nothing should jump or move when it does.
2. **A card is drawn as a skeleton card.** Wherever the real page has a `Card`, the skeleton has a `ChplSkeletonCard`. That is the real card's rounded shape, filled in the theme's divider colour and pulsing like a standard MUI `Skeleton`, so it can't be mistaken for a loaded card. Its look is set in one place, `styles.fill` in `chpl-skeleton-card.jsx`. Never put skeleton shapes inside a real `Card`, `Paper` or other real container. The page's own backgrounds are different: they stay as they are. These are the white band behind a `ChplPageHeader` and the landing page's dark background. Without them the page would change colour when it arrives. On the landing page, the search bar, announcement and cards are each a solid rounded `Skeleton` of the real one's size, with no shapes inside.
3. **Nothing real appears until it can all appear together.** Show the whole skeleton, header included, until the data the page needs has arrived. Don't render real headings, chips or buttons around a partial skeleton.
4. **Content that doesn't wait on data stays real.** A search form the user types into, or a dialog they opened, isn't loading. Only the part that waits gets a skeleton. On CMS ID Reverse Lookup, for example, the lookup form stays real and only the results card is a skeleton.
5. **The first load gets a skeleton, and a refresh doesn't.** Once real content is on screen, keep it there while it refreshes and show the existing spinner overlay or disabled state. Swapping it for a skeleton would make it flash.
6. **Screen readers hear one status, not the shapes.** The skeleton's outer element has `role="status"` and `aria-live="polite"`, with a visually hidden label such as "Loading developer". Every shape sits inside `aria-hidden="true"`.

## Shared pieces

All of these are exported from `components/util`.

| Component | Use it for |
|---|---|
| `ChplSkeletonCard` | The container for a card's skeleton: the card's shape, filled like a standard `Skeleton`. Wraps any shapes and takes `sx` for the real card's width or margins. `skeletonLineColor` is exported alongside it for dividers inside a skeleton. |
| `ChplLoadingPage` | A whole page: a `ChplPageHeader`-shaped title over a `ChplPageBody`. Pass `children` for the page's own layout. `favorite` and `actions` add the header's star and buttons, and `subtitle` the lines of its description. |
| `ChplLoadingSection` | One card of text, a form or a table, framed by a `ChplSkeletonCard`. Set `title={false}` when it fills an area that's already open, such as a dialog. |
| `ChplLoadingCards` | Results pages built from `ChplSearchResultCard`. Describe the page's own card with `title`, `fieldGroups`, `actions` and `controls` (see below). |
| `ChplLoadingTable` | A table of shapes. It's framed by default; set `framed={false}` when it's inside another skeleton card. |

### Describing a results card

`ChplLoadingCards` mirrors `ChplSearchResultCard`, so pass it the same shape the page's cards have:

```jsx
// Developer, Product, Version | CHPL ID, Certification Date, Status | Decertification Date
<ChplLoadingCards fieldGroups={[3, 3, 1]} />

// A titled card with no buttons, and only a sort control beside the result count
<ChplLoadingCards title fieldGroups={[2]} actions={0} controls={1} />

// Fields that need their own width or height: pass the real field's style.flex
// and the number of lines its value usually takes
<ChplLoadingCards fieldGroups={[3, 3, [{ flex: '1 1 100%', lines: 3 }, { flex: '1 1 100%' }]]} />
```

- **`fieldGroups`:** one entry per row of the card's `fieldGroups`. Rows from the third on get the divider the real card has.
- **`actions`:** the number of buttons in the card's actions column. Use `0` for none.
- **`controls`:** the number of controls beside the result count, such as sort and download.

If the shape depends on a flag or a role, work it out on the page and pass the result, as `real-world-testing-view.jsx` and `svap-view.jsx` do.

### Filters

`ChplFilterSearchBar` and `ChplFilterChips` show their own skeletons while the `FilterProvider`'s `isLoading` is true, so a search page only needs `ChplLoadingCards` for its results. They can only do that if the page tells them: **every `FilterProvider` whose filter options come from a query passes `isLoading`**, from those queries' first load (`isInitialLoading` if one can be disabled). Without it, the search bar and chips render real and empty, then fill in late.

## Inline loaders stay as they are

A skeleton stands in for content that's arriving. It doesn't replace a loader that reports an action in progress: a spinner on a save or Validate button, a per-row status such as an upload still processing, a progress circle, or a small count that's being worked out. Leave those as they are.

## Adding a skeleton to a page

1. **Define the skeleton in the page's own file**, as `ChplXLoading` just above the page component. It goes above, not below, because the lint rules don't allow using a function before it's defined. Name its styles `loadingStyles`, so they don't clash with the page's `styles`. `ChplChartsLoading` in `pages/charts/charts.jsx` is an example. Build it from the shared pieces, copying the real page's layout styles: grid columns, gaps, padding and widths. When the real page puts a `Card` somewhere, put a `ChplSkeletonCard` there. If a skeleton is too large to sit comfortably in its page's file, an `x-loading.jsx` next to the page is fine, as the developer and listing pages have.
2. **Size it from what you already know.** If the number of items is known before the data arrives, draw that many. The compare page takes its product count from the URL, and the CMS widget draws one chip per selected product. Otherwise use a typical count.
3. **Return it early from the container (`x.jsx`)**, after the hooks and before the real render:

   ```jsx
   if (isLoading) {
     return <ChplChartsLoading />;
   }
   ```

4. **Write tests**, a `*.test.jsx` covering both sides: the skeleton shows while loading (find it by `role="status"`), and the real content shows once the data arrives. Also cover any empty or error state the skeleton now has to get out of the way of.

### Choosing what to wait on

The project is on react-query v4. Four things there decide what to wait on:

- **Disabled queries:** `isLoading` stays `true` for as long as a query is disabled. If a query can be disabled (`enabled: !!hash`, `enabled: listings.length > 0`), gate on `isInitialLoading` instead, or the skeleton never goes away. See `manage-subscription.jsx`.
- **`isLoading` versus `isFetching`:** `isLoading` means there's no data yet, which is when the skeleton shows. `isFetching` is also true during a refresh, which is when the existing spinner shows (rule 5). A new query key, such as a different set of selected products, has no data, so it's a first load again.
- **Loading in a queue:** if items load one after another, and a failure stops the queue, don't hold the skeleton for the whole queue. Show it until the first item arrives, as the compare page does.
- **Mutations on page load:** for a request sent as the page opens, such as unsubscribing or confirming an API key, show the skeleton until it answers, not a blank page or a half-filled one. Track whether it has answered (set a flag in both `onSuccess` and `onError`) rather than checking for a field in the result, which might be missing.
- **Third-party widgets that load their own data:** render the widget hidden behind its skeleton until it reports that it's done, and set a timeout so a failure still shows the widget's own error. Swagger UI on the API page does this with `onComplete`.

While a page's code downloads, the content area shows the shared spinner from `AppRoot`'s `Suspense` boundary. Skeletons cover waiting for data, not for code.

## Pages with skeletons

| Page | Skeleton |
|---|---|
| Search and each shortcut page (`pages/search/*`) | `ChplLoadingCards` with the page's own `fieldGroups`, `actions` and `controls` |
| Landing page | `ChplLandingPageLoading` in `landing-page.jsx`, the whole page as solid blocks until the announcements arrive |
| Developers list | `ChplLoadingCards fieldGroups={[3]} actions={0}` |
| Developer | `developer-loading.jsx` |
| Listing | `listing-loading.jsx` |
| Compare | `ChplCompareLoading` in `compare.jsx`, one column per product in the URL |
| Charts | `ChplChartsLoading` in `charts.jsx` |
| CHPL Overview | `ChplOverviewLoading` in `overview.jsx` |
| CMS ID Reverse Lookup | `ChplCmsLookupLoading` in `cms-lookup.jsx`, for the results card only |
| My Subscriptions | `ChplManageSubscriptionLoading` in `manage-subscription.jsx` |
| Confirm Your Subscription | `ChplConfirmSubscriptionLoading` in `confirm-subscription.jsx` |
| Unsubscribe | `ChplUnsubscribeAllLoading` in `unsubscribe-all.jsx`, until the unsubscribe request answers |
| API key confirmation | `ChplApiKeyConfirmLoading` in `components/api-key/api-key-confirm.jsx`, until the confirmation answers |
| CHPL API | `ChplApiSwaggerLoading` in `api.jsx`, until Swagger UI has the definition |
| CMS ID Creator widget | `ChplCmsDisplayLoading` in `cms-display.jsx`, the whole widget |

### Pages behind a login

| Page | Skeleton |
|---|---|
| System Maintenance sub-pages | `ChplSystemMaintenanceLoading` in `components/system-maintenance/system-maintenance-loading.jsx`, shared by every sub-page and sized to its cards. System jobs have `ChplSystemJobsLoading` in `system-jobs.jsx` |
| Change requests | `ChplLoadingCards` shaped by role in `change-requests-view.jsx`; one request has `ChplChangeRequestLoading` in `change-request.jsx` |
| Activity and Questionable Activity | `ChplLoadingCards` shaped to their cards |
| Complaints | `ChplLoadingCards` shaped by role; the edit form has `ChplComplaintEditLoading` |
| Users, and the users card on ONC-ACB and developer pages | `ChplUsersViewLoading` in `components/user/users-view.jsx` |
| ONC-ACBs and ONC-ATLs | `ChplOncOrganizationsLoading` in `onc-organizations.jsx`, shaped by role |
| Surveillance Reporting | `ChplSurveillanceReportingLoading` in `reporting.jsx`; one ONC-ACB's report has `ChplReportLoading` in `report.jsx` |
| Confirm Listings | `ChplConfirmListingsLoading` in `confirm-listings.jsx` |
| Confirm a listing | `ChplConfirmLoading` in `confirm.jsx`; each step has `ChplConfirmStepLoading` in `components/listing/confirm/confirm-step-loading.jsx` |
| Scheduled Reports | `ChplReportsLoading` in `reports.jsx`, both cards together |
| Compliance Dashboard | `ChplComplianceDashboardLoading` in `compliance-dashboard.jsx` |
| Listing edit, and its surveillance, requirement and non-conformity edits | form-shaped skeletons in each component |
| Join developers | `ChplJoinDevelopersLoading` in `developer-join.jsx` |

Login, registration, download, forgot password and not-found don't wait on data, so they have no skeleton. Neither do Upload, CMS, Surveillance Activity Reporting, the System Maintenance home card or the compare widget, which reads its products from local storage.
