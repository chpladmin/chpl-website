# Release Notes

## Version TBD
_Date TBD_

### New features
* Changed certification status icons
* Better sort of CQMs on Compare page
* Addition of Previous Product Owner capability

### Bugs fixed
* Merge dialog closes on submit
* Changing status & other of a CP now results in two separate reports, on different pages
* ROLE_ONC_STAFF can now see data in the following reports sections:
	* Users
	* API Key Management Activity
	* API Key Usage Activity
* Javascript errors fixed:
	* favicon.ico not found
	* CMS widget errors (i.e. property of length 'undefined')

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
* Added notice text that additional certification criteria may be required with Cert ID.
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

### New Features
* Added EHR Certification ID widget to fold out on Search page
* Added 'Cert ID' button to product search result rows

## Next version
_Date TBD_

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
