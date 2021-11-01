# Release Notes

## Version 11.22.1
_1 November 2021_

### Flagged Features
* Enable view/edit of Conformance Methods

### Bug Fixes
* Display added Optional Standards in Listing Report

### Flagged Bug Fixes
* Enable progress through confirmation wizard ignoring "warning" checkbox

---

## Version 11.22.0
_18 October 2021_

### Features
* Disallow editing of Certification Date directly

### User Interface Updates
* Update text describing API Documentation

### Bug Fixes
* Give user an error message when saving Developer with bad URL
* Require at least one Certification Status history item on edit

### Flagged Features
* Require user to attest before submitting Attestations

---

## Version 11.21.0
_5 October 2021_

### Features
* Revise list of test tools to select for a 2015 Edition listing
* Create new UX for Job Scheduling schedule selector
* Give user warning when they are about to be logged out

### User Interface Updates
* Update Login component with new look & feel
* Display Overview and CHPL API pages in new style

### Bug Fixes
* Hide Test Functionality edit on criteria that has no available Test Functionality to select
* Allow editing of Relevant Surveillance for 2015 Cures Edition Listings
* Show error messages when password reset request fails

---

## Version 11.20.1
_7 September 2021_

### Technical Update
* Update Quarterly Surveillance Reporting to use non-deprecated fields

---

## Version 11.20.0
_31 August 2021_

### Features
* Track Analytics separately on Cures vs. non-Cures criteria
* Require confirmation of cancel and delete in certain circumstances

---

## Version 11.19.0
_23 August 2021_

### Features
* Add new Non-conformity close date field to CHPL
* Indicate when API Key registration email was not sent
* Report errors on user invitation failure
* Enable ONC_STAFF users to get to allowed reports
* Allow download of SVAP Reports for authorized users

### User Interface Updates
* Use updated link for ONC "Contact Us" form
* Update description of Surveillance and Non-conformity types in hover text

### Bug Fixes
* Allow removal of invalid Criteria objects

### Flagged Bug Fixes
* Stop displaying invalid Test Standards

---

## Version 11.18.0
_9 August 2021_

### Features
* Require Complaint dates to be "logical"

### User Interface Updates
* Display Complaints in updated UX

### Flagged Features
* Add Attestation change request

### Flagged Bug Fixes
* Re-enable invitation of ROLE_DEVELOPER users

---

## Version 11.17.0
_2 August 2021_

### Features
* Enable Real World Testing data entry / view for all 2015 Edition Listings

### Flagged Features
* Display "Promoting Interoperability" where applicable

### Bug Fixes
* Provide correct link in Search Results download file

---

## Version 11.16.0
_12 July 2021_

### Features
* Listing Report filter by ONC-ACB changed to use acbId
* Create visible display of non-production environments
* Show "Retired" filters when filtering on Practice Type

### Bug Fixes
* Restore "Confirmation" screen on Change Request submission
* Stop showing Product Contact information on Merge

---

## Version 11.15.0
_28 June 2021_

### Features
* Generate Surveillance Activity Report as Excel spreadsheet
* Make Phone Number not required on user edit
* Add Login page to use when user navigates to page without being logged in
* Direct all page load errors to custom 404 page
* Provide custom 404 page

### Flagged Features
* Use new UI for Criteria View/Edit
* Enable view/edit of Optional Standards

---

## Version 11.14.0
_2 June 2021_

### Features
* Update README documentation
* Add developer column to version activity report

### Bug Fixes
* Require name when saving filters
* Show G1/G2 measure changes in Listing history component
* Filter Listings by Compliance correctly when "Matching All" is selected

### User Interface Updates
* Display Listing History in updated style

---

## Version 11.13.0
_17 May 2021_

### Features
* Display more Listing data in Complaints download file
* Use new style of component for Meaningful Use User Information Upload
* Show & allow edit of Service Base URL List value
* Remove obsolete "Background Jobs" administration page

### Bug Fixes
* Create link between ICS source/inherited listings correctly

---

## Version 11.12.0
_4 May 2021_

### Features
* API Key registration requires confirmation of email
* Indicate "Processing" of pending Listings

### Bug Fixes
* Display SED changes in Listing Reports correctly
* Disable double-click on Listing confirmation

---

## Version 11.11.0
_19 April 2021_

### Features
* Show Listing Surveillance data on Developer pages
* Do not allow users to create new test standard during edit

### Flagged Features
* Use updated Developer inspection screen during upload/confirm workflow

---

## Version 11.10.0
_5 April 2021_

### Features
* Allow download of Complaint data
* Add "Informed ONC per 170.523" option to Complaints
* Display Direct Review data on Corrective Action collection page
* Allow splitting of Version

---

## Version 11.9.0
_22 March 2021_

### Features
* Display ONC-ATL report in updated style
* Remove Direct Review field that should have no data
* Allow ROLE_ONC_STAFF to access Complaints
* Allow ROLE_ONC_STAFF to access quarterly surveillance data
* Expand analytics collected via Google Tag Manager

---

## Version 11.8.0
_8 March 2021_

### Features
* Allow split of Product in new UX
* Update Surveillance Reporting for 2021 requirements
* Remove unused API Call Usage report
* Support display & edit of SVAP Notice

---

## Version 11.7.0
_22 February 2021_

### Features
* Enable Standards Version Advancement Process Administration
* Expand Surveillance Filter on Search page to consider Direct Reviews
* Allow ROLE_ONC_STAFF to see & manage Background and Scheduled Jobs

### Flagged Features
* Change "Standard" to "Optional Standard"

---

## Version 11.6.0
_8 February 2021_

### Features
* Allow download of up to 1000 results on the Search page
* Display errors if API reports them during state change

### Flagged Features
* Implement new workflow for Inspect/Confirm
* Allow upload of Listings with variable column sets

---

## Version 11.5.0
_25 January 2021_

### Features
* Edit SVAP information for specific criteria in listing details
* Display accurate responsible user information for User Reports
* Turn on all retired items when "Select all" is used with retired options
* Display API Key Management report in new style
* Tell user about Developer Merge processing
* Support Version merge on Developers page

### Flagged Features
* Display RWT upload only when RWT is available

### User Interface Updates
* Indicate new quarterly frequency of 2014 Download File Generation

### Bug Fixes
* Display "Cures Update" information on relelvant SED updates in Listing reports
* Require at least one Non-conformity when Surveillance Result is "Non-Conformity"
* Restore "link to edit" from Listing Reports

---

## Version 11.4.0
_14 December 2020_

### Features
* Enable ROLE_ONC_STAFF user type
* Make "username" not required for new users
* Let users download Direct Review activity
* Display and edit updated g1g2 measures

### Bug Fixes
* Allow users to confirm Listings with acknowledged warnings

---

## Version 11.3.0
_30 November 2020_

### Features
* Add upload for Real World Testing

### Flagged Features
* Allow basic editing of Listing in new UX

### User Interface Updates
* Rearrange basic information for Listings

---

## Version 11.2.0
_16 November 2020_

### Features
* Use updated UI/UX for Announcements Report
* Remove friendly name for developer and product POC
* Display information about all Listings on Developer page on load

### User Interface Updates
* Indicate "Charts" are no longer in beta
* Add relevant ONC-ACB(s) to Product list on Developer page

### Bug Fixes
* Redirect to home page if requested Developer doesn't exist

---

## Version 11.1.0
_19 October 2020_

### Features
* Add ability to validate and save Real World Testing data
* Allow Product merge in new UI/UX

### Bug Fixes
* Display correct chart data for logged in users
* Display Mandatory Disclosures URL

### Flagged Bug Fixes
* Display Direct Reviews on appropriate Listing screens

---

## Version 11.0.0
_5 October 2020_

### User Interface Updates
* Implement major style upgrade

### Features
* Enable editing of Version in new UX

### Flagged Features
* Display message on Direct Reviews when Jira doesn't respond

### Bug Fixes
* Restore ability to edit friendly name for POC
* Display errors when editing Users

---

## Version 10.53.0
_21 September 2020_

### Features
* Add ability to handle Java 8 updated date and time datatypes
* Show all User Actions across time in Report
* Allow Product editing on Developer page

### User Interface Updates
* Display CQM Versions in correct order

---

## Version 10.52.0
_8 September 2020_

### Features
* Add "Ignore warnings" checkbox when editing or confirming certified product

### Bug Fixes
* Allow multiple API Documentation uploads without page reload

---

## Version 10.51.0
_18 August 2020_

### Flagged Features
* Display Direct Review data on Developers pages

### Bug Fixes
* Remove no longer required Transparency Attestation validation logic
* Only remove one of duplicate values in Criteria edit
* Display modifications to new fields in Listing Reports

---

## Version 10.50.0
_10 August 2020_

### Features
* Allow users to see User reports through all time

### Flagged Features
* Allow Developer Users to manage their Developer on their public page

### Bug Fixes
* Display / hide bad data related to bad input on Listing inspect

---

## Version 10.49.0
_27 July 2020_

### Features
* Enable Developer merge in new workflow
* Stop allowing multiple values for certain criteria data elements

### Flagged Features
* Display direct review on listing details page

### Bug Fixes
* Show correct error messages on password change

### UI updates
* Add "accessibility assistance" text to new user registration page

---

## Version 10.48.0
_13 July 2020_

### Features
* Display notification of Split action to initiating user
* Use new style for ONC-ACB activity reports

### User Interface Updates
* Use new link for CHPL Public User Guide

---

## Version 10.47.0
_24 June 2020_

### Features
* Add "Removed | " to display of removed criteria in several places

### User Interface Updates
* Change tool-tip text for two new criteria data fields

### Bug Fixes
* Require URL fields on criteria edit to be "shaped" like URLs

---

## Version 10.46.0
_15 June 2020_

### Features
* Add filters to Complaints pages

### User Interface Updates
* Add description of new values in tool-tip

### Bug Fixes
* Show Developer activity with better formatting in Excel
* Display correct error messages on account creation
* Use correct validator to show invalid Dates
* Only display applicable Test Standards in upload/confirm edit workflow

---

## Version 10.45.0
_1 June 2020_

### Features
* Implement Split of Developers in new UI
* Allow Version Report activity across any date range

### Flagged Features
* Update text on main search page to reflect post effective-rule-date changes
* Remove 2014 Charts

---

## Version 10.44.0
_18 May 2020_

### Flagged Features
* Update Developer edit to use new style

---

## Version 10.43.0
_4 May 2020_

### Features
* Add new standardized date range picker
* Update reports pages to support searches across all time
  * Products
  * Developers

### Flagged Features
* Add user guidance to CMS Widget
* Add selector for Cures Update criteria in charts
* Distinguish between Cures Update nonconformities in charts
* Indicate frequency of download file generation
* Add filter for 2015 Cures Update certification edition to main search

### Bug Fixes
* Activity in product history and activity report does not show correct for criteria edits during listing edit (#742)
* Show Product Split and Merge in Product reports

---

## Version 10.42.0
_20 April 2020_

### Features
* Change the order of display of revised criteria so "Cures Update" is first

### Flagged Features
* Stop displaying Transparency Attestations on Developers list
* Display "Cures Update" everywhere it's appropriate
* Allow Developers to submit Change Requests to change contact information

### Bug Fixes
* Show Transparency Attestation on Developer list

### Flagged Bug Fixes
* Show "Acting Organization" correctly for ONC-ACBs

---

## Version 10.41.0
_10 April 2020_

### Flagged Features
* Stop displaying "Removed" attribute

---

## Version 10.40.0
_8 April 2020_

### Features
* Add ONC-ACB filter for Listing Reports page
* Only allow ROLE_DEVELOPER to withdraw a Change Request

### Flagged Features
* Allow administration of Developer users
* Put Cures Update criteria in separate filter

### User Interface Updates
* Indicate "Cures Update" status on pending listings
* Display Listing's Cures Update status

---

## Version 10.39.0
_23 March 2020_

### Features
* Only display test functionality control if there are options
* Support upload of Self-developer field
* Enable sorting of test functionality
* Distinguish between identically numbered criteria in Surveillance Non-Conformities

### Bug Fixes
* Restore 2014 Edition filter functionality

### UI Updates
* Display Transparency Attestation in such a way as to indicate that it's no longer part of the rule

### Flagged Features
* Update description of Base EHR in CMS ID Creator Download
* Allow Change Request management by administrators
* Disallow generation of CMS EHR IDs containing any 2014 Edition Listings
* Update 2015 CMS EHR ID generation to handle removed and added criteria
* Restrict ONC-ACB Users from modifying any 2014 Edition listings
* Restrict ONC-ACB Users from modifying any criteria marked as removed
* Restrict ACBs from viewing Transparency Attestation near or in editable scenarios
* Stop allowing ONC-ACBs to add/edit surveillance and/or non-conformities associated to 2014 Edition Criteria
* Update transparency attestations to work in accordance with new Cures rule

---

## Version 10.38.0
_9 March 2020_

### Features
* Handle criteria with identical numbers

### Flagged Features
* Add text description to CQM section
* Display criteria differently depending on "removed" and "retired" states
* Allow different display of Listings report

### User Interface Updates
* Add indication on criteria when removed

### Bug Fixes
* Add BOM to allow for display of extended characters in CSV files
* Use correct title for Confirm Listings page
* Show Criteria in SED when they should be seen

---

## Version 10.37.1
_20 February 2020_

### Bug Fixes
* Disable submission of "self-developer" change
* Allow Developers to submit CRs

---

## Version 10.37.0
_11 February 2020_

### Bug Fixes
* Improve error message when no upload templates are available

### Flagged Features
* Update text on Inactive Collections page

### Features
* Add view of all system triggers on Scheduled Jobs page
* Display Transparency Attestation with newly formatted object
* Display "Self-developer" field for all Developers

---

## Version 10.36.0
_27 January 2020_

### Flagged Features
* Show new criteria on API Documentation page
* Do not allow ONC-ACBs to edit 2014 listings
* Add new Listing Reports page

### Features
* Disable editing of certification criteria under certain conditions
* Handle new criteria fields for view/edit
* Display Developers on public page w/Products/Versions/Listings

---

## Version 10.35.0
_2 January 2020_

### Features
* Add logic so admin/onc can edit listing if dev banned on old screen
* Make Complaint Status Type a result of close date existence
* Restrict ONC-ACB from creating surveillance with removed criteria
* Allow larger value to be entered in the test data alteration field

---

## Version 10.34.0
_20 December 2019_

### Flagged Features
* Create Change Request Administration view page

---

## Version 10.33.0
_16 December 2019_

### Features
* Support custom parameters for recurring triggers

### Flagged Features
* Create Developer dashboard

---

## Version 10.32.0
_2 December 2019_

### Features
* Update scheduled jobs to work correctly with UTC time

### User interface changes
* Indicate when certification criteria have been removed
* Indicate when Macra Measure(s) have been removed

---

## Version 10.31.0
_18 November 2019_

### Features
* Display the API Key Management Report is in the new style

---

## Version 10.30.0
_4 November 2019_

### Flagged Feature
* To be inserted later

---

## Version 10.29.0
_24 October 2019_

### Features
* Allow jobs to display text, date, and select for additional job data

---

## Version 10.28.0
_21 October 2019_

### Features
* Add details to version activity download

### Flagged Features
* Add ability to edit basic information Certified Products on details page
* Add ROLE_DEVELOPER User type
* Allow ROLE_DEVELOPER to create "Change Requests" to change their Organization's website

### Bug Fixes
* Add missing Product activity data to downloadable file
* Show correct error message when field is too long
* Display error message on CMS ID gen failure
* Enable next for new developer and add error reporting

---

## Version 10.27.0
_7 October 2019_

### Features
* Disable next on developer inspect product page without save or valid system data
  * Disable next button on developer inspect product page when there is no valid system data loaded, either via default, or via the save button itself
  * Fix attestation not being displayed for the system developer even if saved in the system
* Add organizations to user update activity display

### User Interface Updates
* Update sign up text to support Developers

### Bug Fixes
* Add Details column and merge, split activity details for Developer Reports

---

## Version 10.26.0
_23 September 2019_

### Features
* Add new "Organizations" navigation item for logged in users
  * Complete change / upgrade of ONC-ACB and ONC-ATL management screens
  * Add new Organizations - Developer page
  * Includes support for Edit, Merge, Split
  * Add support for Product editing on new Organizations - Developer page
  * Includes Edit, Merge, and Split
  * Add support for Version editing on new Organizations - Developer - Product page
  * Includes Edit, Merge, and Split

### Flagged Feature
* Allow ONC-ACBs to generate their required quarterly and annual Surveillance Reports

### User Interface Updates
* Standardize button display on complaints
* Improve display of User Organizations

---

## Version 10.25.0
_10 September 2019_

### Features
* Update user information to include
  * Last Logged In Date
  * Organization(s) user is associated with
* Update the API Key Usage report UI to be consistent with other reports
* Provide new UI/UX for user management

### Display changes
* Use correct title for ONC-ATL

---

## Version 10.24.1
_26 August 2019_

### User Interface Updates
* Change title of Complaints page
* Turn off EDGE's telephone number detection "feature"

### Bug Fixes
* Limit access to pages / features with explicit ROLE lists
* Update surveillance filter to work correctly when navigating back to search
* Use correct link on Manage Surveillance page based on active flag

---

## Version 10.24.0
_12 August 2019_

### Features
* Improve Surveillance Management UX
  * New navigation for upload, confirm, manage
  * Added "view all surveillance" capability

### Flagged Features
* Support entry and edit of complaints

---

## Version 10.23.0
_29 July 2019_

### Flagged Features
* Complete revamp of administration navigation
* Add "Save Search" functionality to admin reports

---

## Version 10.22.0
_22 July 2019_

### New Features
* Updated announcement activity reports to use announcement metadata

---

## Version 10.21.0
_17 June 2019_

### New features
* Updated user and user action activity reports to use activity metadata
* Allow splitting of Versions
* Display history past split/merge in Listing history popup

---

## Version 10.20.0
_3 June 2019_

### New features
* Use new endpoints for better ONC-ACB and ONC-ATL report activity
* Add link to FF4j admin console for ROLE_ADMIN

---

## Version 10.19.0
_20 May 2019_

### New features
* Updated product and version activity reports to use activity metadata
* Use new endpoints for better ONC-ACB and ONC-ATL report activity
* Rearrange text on Overview page
* Restrict / require Users to only be one ROLE

### Bug Fixes
* Allow upload of files from Edge
* Fix deleting of scheduled jobs when multiple jobs are assigned to the same ACB
* Fix routing to password reset page

---

## Version 10.18.0
_8 May 2019_

### New Features
* Use /collections/decertified-developers endpoint instead of deprecated /decertifications/developers
* Show "history popup" on all Listings
* Updated security for edit/split/merge of developers, products, and versions
* Updated text and column headings on the Decertified Products and Inactive Certificates pages
* Updated language on Charts page
* Shrink main header navigation on page scroll

### Text changes
* Tweak text on unsupported browsers page to confirm IE is not supported

---

## Version 10.17.0
_22 April 2019_

### New features
* Use new Activity end points
  * Listing reports
  * Developer reports
* Show Developer/Product/Version name changes in Listing history popup

### Bug Fixes
* Fix behavior of left-side links on the Overview page

---

## Version 10.16.0
_8 April 2019_

### New features
* Use new endpoints for better responsiveness on Listing confirmation page
* Use new Activity end points for Listing reports
* Redirect users using unsupported browsers to a page telling them that

### Bug fixes
* Allow editing of SED Participants

---

## Version 10.15.0
_27 March 2019_

### New features
* Provide "Clear Selection(s)" link for multi-select lists
* Allow ROLE_ADMIN to confirm listing
* Allow users to impersonate other users as appropriate

### Bug fixes and cleanup
* Remove unusable corrective action plan activity reports
* Remove unused "compliance terms accepted" on user creation
* Remove references to "Pending" ACB

### Bug fixes
* Use correct ROLE on surveillance initiation

---

## Version 10.14.0
_11 March 2019_

### New features
* Removed old UI based caching
* Force "no-cache" GET of details after Listing update
* Add validation capability to ai-expandable-list control
* Validate retired test tools based on workflow and ICS
* Allow splitting of a developer with multiple products

### Bug fixes
* Show user as logged out when JWT has expired

---

## Version 10.13.0
_25 February 2019_

### New features
* Update the language on the Overview page
* Tweak CMS download workflow to reduce unnecessary network calls

### Bug fixes
* Remove unusable "file documentation upload" section from surveillance inspect workflow

---

## Version 10.12.0
_11 February 2019_

### New features
* Support new ROLE_ONC role
* Allow ROLE_ADMIN and ROLE_ONC to manage pending surveillances
* Add ability for ROLE_ADMIN to run Quartz system jobs on demand
* Allow edit of retirement dates for ACBs/ATLs
* Default search filter changed for ACBs. Leaves "recently retired" ACBs defaulted to on. "Recent" is defined as "about four months"
* Slightly improve performance on mobile by removing "sticky" header/footer
* Populate ACB filter automatically on Collections pages

### Bug fixes
* Allow logged in users to see download files

---

## Version 10.11.0
_28 January 2019_

### New features
* Support new ROLE_ONC role

---

## Version 10.10.0
_14 January 2019_

### New features
* Allow download of Search results

### Bugs fixed
* Fix navigation related to ATL management
* Re-enable editing of certified product certification criteria

---

## Version 10.9.0
_17 December 2018_

### New features
* Change /authorize call to not use deprecated endpoint
* Change API key registration call to not use deprecated endpoint
* Handle retired ONC-ACBs / ONC-ATLs

---

## Version 10.8.0
_3 December 2018_

### New features
* Add updated favicons; support app/mobile pinning
* Add sorting to functionality tested
* Add support for resetting password via generated link
* Add "user must reset password on next login" workflow
* Allow ROLE_ADMIN to upload API Documentation data file
* Display API Documentation data file for public

---

## Version 10.7.0
_19 November 2018_

### New features
* Updated ONC contact information
* Cache three network calls for varying timeouts
  * /collections/certified_products for five minutes
  * /certified_products/{productId}/details for fifteen minutes
  * /data/search_options for five minutes
* Add validation to surveillance "sites passed" and "total sites" for randomized surveillance activities

---

## Version 10.6.0
_5 November 2018_

### New features
* Removed reliance on deprecated API endpoints

### Bugs Fixed
* Stop displaying QMS changes when there aren't any
* Show proper error message when username is more than 25 characters and allow the user to proceed
* Allow user to fix data and continue account creation when there is a validation error
* Prevent user from submitting form when more than 25 character have been entered for username

---

## Version 10.5.0
_22 October 2018_

### New Features
* Enable comparison of all products in CMS widget
* Allow edit / display of Listing specific MUU numbers and history
* Updated the collection pages to refresh data automatically on a timer

### Bugs Fixed
* Display 'Other Certified Product Activity' when only one thing has been changed

---

## Version 10.4.0
_8 October 2018_

### New Features
* Add [AngularJS directive](https://github.com/ghostbar/angular-zxcvbn) to display a password strength meter based on a port of [zxcvbn](https://github.com/dropbox/zxcvbn)
* Add Developer Status to search results page, when Developer is not "Active"
* Add Last Used Date and Delete Warning Sent Date to the API Key Management page
* Modified how the session timeout works to always log the user out and display the login component when appropriate

---

## Version 10.3.0
_24 September 2018_

### New Features
* Add informative popups to Certification Criteria attributes
* Add info for 2014 cms id widget
* Display change of CHPL Product Number in Details History popup
* Tweak scheduled job modal to work with triggers that default to weekly
* Display change of CHPL Product Number in Details History popup

---

## Version 10.2.0
_10 September 2018_

### New Features
* Support "full name" and "friendly name" for Users/Contact
* Add reason for developer ban
* Automatically select the ROLE if there's only one available in user invitation workflow
* Add explanatory text related to uploading Surveillance and Certified Products
* Add info messages for missing CMS ID criteria

---

## Version 10.1.0
_27 August 2018_

### New Features
* Add certification title to uniqe products chart on hover-over
* Allow selection of ACB for ACB specific triggers
* Support multiple ACBs in required job schedulers
* Display current time in UTC on job scheduler

### Text changes
* Add introductory text to several charts

---

## Version 10.0.0
_16 August 2018_

### Major changes
* Upgraded to AngularJS 1.7.x
* Removed dependency on bower; replaced with yarn & webpack
* Removed most gulp scripts

### New Features
* Add nonconformity chart to charts page
* Add job selection when adding a new trigger
* Display existing job when editing existing trigger
* Integrated CRON control with the job's frequency
* Add functionality for managing "Ban Developer" notification
  * Updated edit of Listing screen to reflect changes in Developer Ban workflow

---

## Version 9.25.0
_7 August 2018_

### Minor Changes
* Update access to certain reports

---

## Version 9.24.0
_16 July 2018_

### New Features
* In the Edit Criteria modal, modified how the user selects multiple values to associate to a criteria
* Removed 'Product wide Relied Upon Software' for new 2014 and 2015 listings

---

## Version 9.23.0
_5 July 2018_

### New Features
* Filter 2014 test functionalities based on practice type and certification criterion
* Add http existence check to all outgoing urls
* Show announcements directly after login

### Text Change
* Change CMS FAQ link in Inactive certificates and decertified products

---

## Version 9.22.0
_18 June 2018_

### New Features
* Updated display of error messages when editing a product to support multiple error messages
* Updated display of error messages when merging a developer to support multiple error messages
* Show QMS standards under (g)(4) criteria details
* Add "Scheduled Jobs" section for Quartz jobs

---

## Version 9.21.0
_4 June 2018_

### New Features
* Changed corrective action plan report to pull from new API endpoint
* Added "New vs. Incumbent Developer" charts to Charts! page
* Added "Count of Developers & Products" charts to Charts! page

### Bug Fixes
* Remove "N/A" from editing possibilities where N/A
* Change error message for system down for maintenance page
* Widen datepicker dropdown for collections pages

---

## Version 9.20.0
_21 May 2018_

### New Features
* Added "Criterion / Product" chart to Charts! page

### Bug Fixes
* Fixed bug that did not show SED End Testing Date on inspect or management
* Fixed bug that showed two web site disclaimers on api documentation collection

---

## Version 9.19.0
_7 May 2018_

### Minor Features
* Add more information to "eye" display
  * CQM changes
  * g1/g2 success & macra measure changes

### Bug Fixes
* Show Listing information in "manage surveillance" search results
* Fix bug that incorrectly showed qms boolean
* Fixed bug where some Listings didn't show history when eye was clicked

---

## Version 9.18.0
_23 April 2018_

### Major Feature
* Support for multiple ATLs per Listing
  * Display of ATLs on Listing Details page
  * Upload/confirm of multiple ATLs
  * Edit of Listings to support multiple ATLs
  * Reports updated to display changes in ATLs

### Minor Feature
* Added "error" page to use during deployments

### Bug Fix
* Fix display of SED editing during confirm workflow

---

## Version 9.17.0
_9 April 2018_

### Minor Features
* Add SLI to the default options in main & collections pages
* Add ability to add G1/G2 measures for non-attested criteria

---

## Version 9.16.1
_27 March 2018_

### Text tweaks
Added "disclaimer" regarding beta status of Charts page

---

## Vertion 9.16.0
_26 March 2018_

### Minor features
* Added Participant/Age chart to /charts page
* Added Participant/Education chart to /charts page
* Added Participant/Gender chart to /charts page
* Added Participant/Professional Experience chart to /charts page
* Added Participant/Product Experience chart to /charts page
* Added Participant/Computer Experience chart to /charts page

---

## Version 9.15.0
_12 March 2018_

### Minor features
* Added /charts page that displays the SED/Participant count chart

---

## Version 9.14.1
_22 February 2018_

### Bug fixed
* Enable editing of CQM-Criteria relationships for 2015 Edition Listings

---

## Version 9.14.0
_12 February 2018_

### Major features
* Allow view/edit of fuzzy matching choices

### Minor features
* Added "Reason for Change" fields when Questionable Activity happens
* Display "Reason for Status Change" in Reports

---

## Version 9.13.0
_1 February 2018_

### Administration modifications
* Make "Reason for status change" not required in all cases
* Update SED display to show criteria tested for SED without UCD Processes

---

## Version 9.12.2
_29 January 2018_

### Text changes
* Update notice for XML file definition "as-of" date

---

## Version 9.12.1
_25 January 2018_

### Bug fixed
* Require "earliest" status of CHPL Listing to be "Active"

---

## Version 9.12.0
_17 January 2018_

### Minor features
* Update messaging wrt surveillance activity upload
* Allow editing of certfication status history
  * Including "Reason for Status Change"
* Tweaking of text on "Banned Developers / Decertified Products" collection pages

---

## Version 9.11.0
_2 January 2018_

### Minor features
* Added ids to some buttons/links
* Take out Questionable Activity Certified Products reports page
* Require ICS Source for 2015 Listings with ICS=true during edit

### Bugs fixed
* Removed duplicate 'external link' disclaimer from Transparency Attestation collection

---

## Version 9.10.0
_18 December 2017_

### New features
* ROLE management
  * Change ROLE_ACB_ADMIN to ROLE_ACB
  * Change ROLE_ATL_ADMIN to ROLE_ATL
  * Remove ROLE_ACB_STAFF
  * Remove ROLE_ATL_STAFF
* Removed "Reports" from navigation for ROLE_ATL

### Bugs fixed
* Editing UCD Processes works
* Allow confirmation of "new" Values during Confirm
  * QMS Standards
  * UCD Processes

---

## Version 9.9.0
_5 December 2017_

### New features
* Display / edit Test Data & Test Procedures
  * Updated activity reports to parse TD & TP as well

### Bugs fixed
* Re-enabled SED Task / Participant editing when criteria added with SED

---

## Version 9.8.1
_20 November 2017_

### Bugs fixed
* Fixed issue with Report activity date range spanning DST boundaries

---

##Version 9.8.0
_6 November 2017_

### New features
* Add "2015 SED Products" Collection to shortcuts
* Includes download all SED details button

### Text changes
* Usability Report -> Full Usability Report

---

## Version 9.7.0
_23 October 2017_

### New features
* Incorporate upload-template-version errors & warnings

### Bug fixed
* Fixed "Save as Developer Information" to work again

---

## Version 9.6.1
_12 October 2017_

### Bugs fixed
* Allow editing of Certification Criteria details
* Allow creation of SED Task during upload/confirm

---

## Version 9.6.0
_10 October 2017_

### New features
* Show error message when 404 error on Details page
* Removed "All Products" from Download page options
* Update to match standardized API modifications
* Change ordering of a listings details to Criteria, CQMs, SED, G1/G2, Surveillance, Additional Info
* On SED Details page
  * Change 'SED Intended User Description' header to 'Description of Intended Users'
  * Change SED 'Testing Completion Date' header to 'Date SED Testing was Completed'
  * Change download button text to 'Download SED Details'
  * Add criteria title to criteria list

---

## Version 9.5.1
_25 September 2017_

### Typos Fixed
* Changed date of deprecation for XML file to 10 October

---

## Version 9.5.0
_25 September 2017_

### New features
* Add visualization of ICS Inheritance relationships
  * Improved "Confirm" workflow related to ICS Inheritance
* Marked "Complete listing (xml)" as deprecated on Download page
* Allow Authorized Users to view appropriate running Jobs

---

## Version 9.4.0
_11 September 2017_

### New features
* Improved SED view/edit
* Add indicator to criteria edit screen when "phantom" data exists

### Text changes
* Added "date of last modification" for XSD files

---

## Version 9.3.2
_14 August 2017_

### Bug fixed
* Re-enabled CQM filter

---

## Version 9.3.1
_14 August 2017_

### New features
* Updated Products: Corrective Action Collection
* Change ICS Code validation to require two digits

---

## Version 9.3.0
_31 July 2017_

### New features
* Added "certification status" to filter for API Doc collection
* Add "toaster" when Listing cache is evicted due to Admin activity
* Implemented length restrictions on Listing elements
* Implement min/max length restrictions on CHPL Product Number Code values

### Text changes
* Changed wording of G1/G2 accordion

---

## Version 9.2.0
_17 July 2017_

### New features
* Added "Transparency Attestations" for Developers Collection
* Tweaked "CMS ID Lookup" download to have a filename
* Pending Surveillance UX changed for better responsiveness
* Return to "blue screen with buttons" on "Logo" click
* Allow "Details" button on search results to open in new window

---

## Version 9.1.0
_3 July 2017_

### New features
* ICS Family Tree work
  * Allow admins to build family tree links on edit/upload of Listing
  * Display simple family tree data on Listing details page
  * Display activity of family tree changes "Other" Activity report
* Allow scrolling on CMS ID & Compare widgets
* Ellipsis long names on CMS ID & Compare widgets
* Links to Listing details from CAP Collection open "Surveillance Activity" accordion
* Added "Measures Successfully Tested" accordion element
* Updated CA Collection table to multi-sort

### Text changes
* Change "Additional Software" to "Relied Upon Software"

---

## Version 9.0.0
_19 June 2017_

### Big changes
* Reworked entire general public Navigation
  * Added "Collections"/"Shortcuts"
  * Consolidated top and bottom nav

### New features
* Added 'download definition file' download option
* Triggers retired items on main filter when retired items are selected
  * Trigger: Selecting any of:
    * "Retired" status
    * "2011" edition
    * Retired ACB
    * 2011 Criteria
    * 2014 CQM
  * Turns on all of:
    * "Retired" status
    * "2011" edition
    * All retired ACBs
* Changed admin Notifications section to just "Subscription Management"
* Added "API Documentation" collection
* Added Listing History explanatory text
* Updated summary description of surveillance result

---

## Version 8.5.0
_5 June 2017_

### New features
* Allow Closed CAP with open Nonconformity
* Refresh main search page results on interval to get data changes without requiring page refresh
* Display addition of criteria in Listing activity popup

---

## Version 8.4.1
_24 May 2017_

### Bug fix
* Allow navigation to last elements of Admin section

---

## Version 8.4.0
_22 May 2017_

### New Features
* Updated Pending Listing workflow
  * Allow mass reject
  * Display errors if Listing was previously "completed"
* Displayed filtered Test Standards on Criteria editing
* Added GTM tracking to Search - Criteria/CQMs/Surveillance filters
* Added "Questionable Activity Report"
* Added filtering by Certification Date
* Added "select all" & "reset" to checkbox list filters
* Made "Surveillance Activity Notifications" visible
* Default to all time on single product activity report

### Text edits
* Added description to Nonconformities page
* Added note about 2011 Decertified Products

---

## Version 8.3.0
_8 May 2017_

### New Features
* Allow optionally banning Developers on appropriate status change
* Tweaked GTM events and expanded the events that are tracked
* Show description instead of just name on Functionality Tested & Standard
* Changed description of "Non-conformities" file on download page
* Allow Privacy & Security value: `Approach 1;Approach 2`
* Update Activity reports for greater usability
* Added section for Notifications: Surveillance Activity, though currently hidden
* Displayed filtered Test Functionalities on Criteria editing

### Bugs fixed
* Fixed bug related to Merged Developer status history
* Fixed bug related to too long Name/Additional Software in CMS PDF generation
* Viewing previously viewed/compared clears all filters to allow it

---

## Version 8.2.0
_24 April 2017_

### New features
* Added Google Tag Manager event tracking
* Added POC to Product level; refactored Contact as separate component
* Allow splitting of Products along Version lines
* Show retired/deleted ONC-ACBs on main page search filter

---

## Version 8.1.0
_10 April 2017_

### New features
* When uploading or editing a surveillance activity nonconformity, show an error to require the "Date Corrective Action Plan Must Be Completed" when there is a value for "Date Corrective Action Plan Was Approved"
* When uploading or editing a surveillance activity nonconformity, show errors that break rules for "Corrective Action Plan End Date"
* Changes to display of Banned Developers
* Allow editing of Developer Status History
* When creating or editing a surveillance activity nonconformity, show an error to require the "Date Corrective Action Plan Must Be Completed" when there is a value for "Date Corrective Action Plan Was Approved"
* Built "Nonconformities" page
* Allow Additional Software version to be not required
* Made 'surveillance activity' a main filter
* Searching for "Developer" specifically now searches in previous developers

### Bugs fixed
* Filtering for some CQMs would return improper results. Ex: filters for CMS2 would return products without CMS2 but with CMS22

---

## Version 8.0.0
_27 March 2017_

### New features
* Updated front end UI to do all search/filter on front end
* Updated surveillance filters (Never NC, Open NC, Closed NC)
* Displayed certification status icon legend as modal
* Moved QMS & Accessibility info from 'additional information' to relevant criteria
* Rearranged Resources navigation
* Add "Surveillance initiated by" to Surveillance Activity
* Required users to enter surveillance end date if no open Non-Conformites exist
* Don't show "CertID" button for Retired products
* Don't show unnecessary elements of widget for 2014/2015 and 2015 CMS IDs
* Moved Compare to widget on navigation bar
* Moved Previously Viewed/Previously Compared to filter section
* Added columns to search result for Certification Date & CHPL ID
* Updated text on Resources/Overview

---

## Version 7.3.1
_13 March 2017_

### Text changes
* Added login warning text
* Updated product details history text
* Added tooltips to surveillance details headers

---

## Version 7.3.0
_27 February 2017_

### New features
* Added authorization parameter for specific surveillance download file
* Restricted basic surveillance to ROLE_ADMIN & CMS_STAFF

---

## Version 7.2.1
_21 February 2017_

### Bugs fixed
* Fixed typo on Decertified Products Page
* Added "external link" indicator to sample application
* 2016 -> 2015 on Resources page

---

## Version 7.2.0
_7 February 2017_

### Features Added
* Added "Meaningful Use Users Accurate As Of Date" value
  * CMS Management allows editing
  * Decertified Developers/Products displays
* Removed OBE Google Analytics code
* Display/edit of G1/G2 MACRA measures
* Default ROLE lists to ROLE lengths
* Rearranged navigation
* Changed default filters to "Active" or "Suspended by..." only
* Changed Suspended Developer page text
* Fix collapsing nav on small screen
* Added pop-up notification if CHPL ID Changes
* Added Inactive Certificates page
* Moved CMS Widget to nav bar
  * Added +/- CertID buttons to /compare & /details
* Changed "ATL" to "ONC-ATL"
* Update certification status icons

---

## Version 7.1.0
_23 January 2017_

### Features Added
* Added status for Withdrawn by Developer Under Surveillance/Review
  * Notify users when status change will cause Developer suspension
* Allowed retired test tools to be used IFF `ICS===true`
* Update download file name for CMS lookup
* Tweaks to surveillance display
* Update ui-bootstrap to use font-awesome icons
* Fixed reports ACB -> ONC-ACB
* Renamed decertified developers on nav bar
* Defaulted criteria filter to folded shut
* Fix decertified pages to show "0"
* Modify PDF CMS ID file to work with Adobe Reader

### Bugs fixed
* Upload workflow doesn't find products

---

## Version 7.0.0
_6 January 2017_

### Features Added
* Added new Surveillance Reporting UI
* Add meaningfulUseUser upload functionality under CMS Management
* Added parameter to configuration for allowing CAP management
* Added icons for new "... by ONC" certification statuses
* Only ONC Admins can edit Products in "...by ONC" status
* Updated framework/angular/modules
* Provided download of surveillance activity on Resources page
* Extracted CMS Widget to be more standalone / based on Angular
  * Removed jQuery as a dependency in the process
* Added "Decertification" section to navigation
* Added Certified Product history popup on /details page
* Gave site appropriate favicon

### Bugs Fixed
* Fixed viewing of Version during product confirm workflow

---

## Version 6.1.0
_22 November 2016_

### Features Added
* Added text to Resources page under API Section

### Bugs Fixed
* "Save as Developer Information" bug fixed

---

## Version 6.0.0
_15 November 2016_

### New features
* Changed certification status icons
* Better sort of CQMs on Compare page
* Addition of Previous Product Owner capability
* Improved text on Resources page
* Updated filter UI

### Bugs fixed
* Merge dialog closes on submit
* Changing status & other activity of a CP now results in two separate reports, on different pages
* ROLE_ONC_STAFF can now see data in the following reports sections:
  * Users
  * API Key Management Activity
  * API Key Usage Activity

---

## Version 5.2.0
_21 October 2016_

### New features
* Added option to download csv summaries of 2014/2015 products to resources page
* Added Developer status display / edit
* Added role 'ROLE_ONC_STAFF'
* Allowed ROLE_ONC_STAFF access to all reports areas, including those previously restricted to ROLE_ADMIN only
* Update search results display to not suggest row is clickable
* Added better error message display to forms where forms could be invalid
* Improved Compare page functionality

### Bugs fixed
* Don't show errors about new style CHPL Product Numbers on old style products

---

## Version 5.1.0
_4 October 2016_

### New features
* Added certification status icon to search results
* Changed randomized surveillance text:
  Was randomized surveillance conducted? = yes/no
* Updated certification statuses
* Removed OBE API Documentation / Terms Of Use fields
* Added 'CHPL Product(s)' column to CMS Download file
* Added pattern requirements to CHPL Product Number editing
* Implemented 'retirement' of Test Tools

---

## Version 5.0.0
_19 September 2016_

### New features
* Changed Cert ID lookup not found error message to include the ID
* Changed Cert ID lookup invalid format error message to include the ID
* Added link to remove all selected products from widget
* Changed widget border color to match widget header color
* Integrated CQM c3/c4 access
  * Updated reports to display changes
  * Display / allow edit of c3/c4 for 2015 product CQMS
* Updated links in /overview
* Integrated view/edit developers with changes to /developers call
* Changed calls to Certification ID API to use new operations search and create
* Changed CommonService CmsDownload function call to Certification IDs API (call /certification_ids/ instead of /certification_ids/all)
* Optimized CertID add/remove button in product listing so that isProductInCart() calls are reduced from three to one

### Bugs fixed
* Allowed editing of "Product Wide Additional Software"

---

## Version 4.0.0
_30 August 2016_

### New features
* Added CMS ID download for CMS_STAFF members
* Added API Key filter to UI
* Activity uses start/end dates for date range
* Split API Key into two sections
* Enhanced "Certified Product" activity reports
  * Split into four groups: uploads, status changes, corrective action plans, other
  * Needs additional API calls to get better status on CAP stuff
* Moved ACB Certification ID
* Added navigation to Overview page
* Enhanced Developer activity report
* Enhanced Product activity report
* Add option to download Edition specific product listing

### Bugs fixed
* Certification Date in activity report was reported at wrong time zone
* Fixed widget overrunning cookie 4K limit by switching to using local storage instead

---

## Version 3.0.0
_10 August 2016_

### New features
* Added tooltips to Test Standards, Test Functionality, Clinical Quality Measures
* Removed 'visibleOnChpl'
* Display error message on failed Developer Merge
* Added Criteria Met to generated Certification ID PDF
* Re-colored widget header and buttons to a blue-on-gold scheme
* Added new controller for CertId widget being used on the Search page
* Added CertId javascript files to karma config
* Add ROLE_CMS_STAFF as a ROLE

### Bugs fixed
* Fixed widget initialization by adding missing controller reference

---

## Version 2.0.0
_2 August 2016_

### New features
* Updated editing of CP to use select boxes in place of free text where appropriate
  * Also added ability to add new values to select boxes where required
* Updated README to indicate naming changes for analytics files
* Changed 'contact' email
* Updated 'merge developers' to include Contact information

### Bugs fixed
* Change Version activity table column name
* Show all "criteria affected" on QMS during CP Inspect
* Display SED Participant age changes in reports

---

## Version 1.7.0
_25 July 2016_

### New features
* Clear filters replaces clear results
* "Enter" in developer/product/version filter submits filter
* Adding filter resets filter select
* Added SED Task Rating Standard Deviation
* Cached search results time out after config time

### Bugs Fixed
* Fixed Cert ID Widget not intializing
* Fixed Cert ID Lookup to persist lookup information when leaving page
* Added 'Accessibility Standards' to CP managmement screens

---

## Version 1.6.1
_30 June 2016_

### New Features
* Added EHR Certification ID Lookup to resources page
* Added EHR Certification ID widget to fold out on Search page
* Added 'Cert ID' button to product search result rows
* Added Download PDF button to widget
* Changed CQM percentages to show only for 2014 certification in widget
* Simplified Cert ID Lookup results table formatting
* Added button for CSV download of Cert ID Lookup results
* Added notice text that additional certification criteria may be required with Cert ID
* Added Details button to Cert ID Lookup results

### Bugs Fixed
* Changed Lookup CSV column header names
* Fixed issue where IE could not download the Lookup CSV
* Fixed long product names in cert ID widget
* Fixed missing "N/A" in Cert ID PDF
* Fixed Cert ID Lookup results header always showing
* Fixed widget product list buttons size
* Fixed Cert ID format checking for Cert ID Lookup input field
* Fixed column alignments in widget for IE
* Fixed issue where jQuery wasn't able to initialize widget elements by using a workaround within the angular controller

---

## Version 1.6.0
_16 June 2016_

### New Features
* Allow filter by certification status
* Restrict editing of certification status to valid values

---

## Verion 1.5.1
_13 June 2016_

### New features
* Allow edit of 2015 CQM c1/c2 certs
* Added address and contact information of developers to product details page
* Display 2015 c1/c2 values

---

## Version 1.5.0
_24 May 2016_

### New features
* Changed SED Participant ages to an age range
* Added missing CP details
* Added Developer contact information
* Added c1/c2 to CQM display for 2015 products

---

## Version 1.4.0
_16 May 2016_

### New features
* Expanded CAP Activity reporting
  * Linked IDs where possible
  * Exploded "updated CAP" activity
  * Added ACB column and sorting
* Templated commonModule file
* Updated front facing UI for CAP
* Display warning message if Test Tool or Functionality Tested isn't found
* Updated display of SED Test Tasks

---

## Version 1.3.0
_27 April 2016_

### New features
* Added 'generic' CAP fields
* Surveillance Transparency -> Nonconformity in filter
* Modified Nonconformity values

---

## Version 1.2.0
_20 April 2016_

### Bugs fixed
* Display developer name on product ownership activity change
* Display activity with Timezone offsets

---

## Version 1.1.0
_12 April 2016_

### New features
* Allow editing of new style CHPL Product Number
* Show attestation status for each developer/acb in 'developer codes' table
* Shows Developer editing errors on mouseover of 'confirm' button
* Improved display of Reports
* Allow ACB/ATL admins to edit their name
* Show 'Version' activity

### Bugs fixed
* Display / edit all dates as UTC
* Display correct warning/success formating on login messages
* Correctly save changes to SED Test Participants
* Allow admins to change certification date of CP

---

## Version 1.0.0
_30 March 2016_

### New features
* Added direct link to CP activity by CP id
* Added visible indicator to 'questionable' modification activities
* Updated pages to use new array of transparency attestations

---

## Version 0.5.0
_25 March 2016_

### New features
* Improved 508 compliance
* View/edit groupings of additional software works
* Added 'show developer codes' to admin screen
* Modal-ized certification criteria editing
* SED Task/Participant editing / confirming
* Added API Registration
* Improved Certified Product 'changes' descriptions
* Added sort by version

---

## Version 0.4.0
_14 March 2016_

### New features
* Made 'Home' and 'logo' links clear search results
* Added 'external link' indicator to Swagger License link
* Better display of errors when editing a Certified Product
* Limited file upload to CSV only
* Removed 'additional information' accordion during upload/confirm
* Added error handling to announcements
* Further 508 compliance work
* Clarification of Additional Software
* Expanded page titles

---

## Version 0.3.3
_29 February 2016_

### New features
* Added list of recommended web browsers
* Allowed editing of all most new 2014 fields
* Added Terms of Service for API Key usage
* Integrated with more robust UCD objects
* Prepended ai-a links with http as needed
* Improved UI of Announcements in Overview
* Made Developer website an 'external link'

---

## Version 0.3.2
_23 February 2016_

### Bugs fixed
* Added visual indicator for product summary details
* Added visual indicator for compare fold out
* Updated color contrast on search results compare/clear buttons
* Changed headers in product summary details to grey

---

## Version 0.3.1
_22 February 2016_

### Bugs fixed
* Rearranged product listing information
* Added 'N/A' instead of blanks

---

## Version 0.3.0
_18 February 2016_

### New features
* Implemented 'complicated' password requirements
* Added 'Compliance attestation' on user creation
* Added 'deep link' to edit from details page
* Updated admin navigation to show available pages
* Update wrt 508 compliance
  * Added tab navigation to search results
  * Added 'external link' indicator
  * Added 'skip to main content' keyboard link
* Blended 'Surveillance' with 'Corrective Action Plan'
* Updated Surveillance and Corrective Action Plan to satisfy requirements
* Combined API & Product Listing into single 'Resources' page

### Bugs fixed
* Change password requires old password and not username
* Allowed editing of ATL for certified products
* Truncated too-long compare button titles

---

## Version 0.2.0
_3 February 2016_

### New or updated features
* Already logged in user with link for additional permissions gets new permissions automatically when link followed
* Added helpful error messages for form validation
* Integrated with ACB & ATL 'undelete' feature
* Removed ability to change ACB & ATL name for any but ROLE_ADMIN
* Integrated with Announcements API feature

### Bugs fixed
* Removed Swagger validator badge
* Enter submits login/change password action
* Login form stays open on un/pw or email error

---

## Version 0.1.1
_12 January 2016_

### New or updated features
* Improved search/filter navigation / usability
* Incorporated SwaggerUI API documentation

### Bugs fixed
* 'Results per page' display fixed
* Fixed bug with 'cancel' login directive

---

## Version 0.1.0
_5 January 2016_

New or updated features
* Added 'api-key usage' reporting
* Updated search workflow / filtering
* Improved Admin UI
* Added download XML file
* Integrated with 'Search by HAS CAP' API update
* Removed display of Modular/Complete EHR
* Added UI to manage / view ATLs
* Updated UI for Product Details
* Updated UI for Search screen
* Connected to ATL APIs
* Integrated ICS/QMS/SED CP upload processing

Bugs fixed
* Logging in shows appropriately visible options
* Logging out clears away admin screen info

---

## Version 0.0.2
_7 December 2015_

New or updated features
* Added 'Actions by User' reporting
* Integrated with Corrective Action Plan API
* Integrated with Surveillance API
* Updated to use new CQM format from API
* Added password strength requirements
* Require ACBs to have address/website information

Bugs fixed
* Logging in from /admin reflects in log-in dropdown
* Fixed issue with user potentially having previously logged in user's permissions
* Developer edits correctly show without required page refresh

---

## Version 0.0.1
_13 November 2015_

First release
