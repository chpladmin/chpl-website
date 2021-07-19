import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import theme from '../../../themes/theme';

function ChplAttestations() {
  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Typography>
          This is a block of header text. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>API</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Statement</TableCell>
                  <TableCell width="20%">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We published APIs and allow electronic health information from such technology to be accessed, exchanged, and used without special effort through the use of APIs or successor technology or standards, as provided for under applicable law, including providing access to all data elements of a patient’s electronic health record to the extent permissible under applicable privacy laws.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We published complete business and technical documentation, including the documentation described in §170.404(a)(2)(ii), via a publicly accessible hyperlink that allows any person to directly access the information without any preconditions or additional steps.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We published all terms and conditions for our certified API technology, including any fees, restrictions, limitations, obligations, registration process requirements, or other similar requirements that would be:
                    </Typography>
                    <ol>
                      <li>Needed to develop software applications to interact with the certified API technology;</li>
                      <li>Needed to distribute, deploy, and enable the use of software applications in production environments that use the certified API technology;</li>
                      <li>Needed to use software applications, including to access, exchange, and use electronic health information by means of the certified API technology;</li>
                      <li>Needed to use any electronic health information obtained by means of the certified API technology;</li>
                      <li>Used to verify the authenticity of API Users; and</li>
                      <li>Used to register software applications.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      Any and all fees charged by us for the use of our certified API technology was described in detailed, plain language. The description of the fees included all material information, including but not limited to:
                    </Typography>
                    <ol>
                      <li>The persons or classes of persons to whom the fee applies;</li>
                      <li>The circumstances in which the fee applies; and</li>
                      <li>The amount of the fee, which for variable fees includes the specific variable(s) and methodology(ies) used to calculate the fee.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      All fees related to certified API technology not otherwise permitted by this section are prohibited from being imposed by us. The permitted fees in paragraphs §170.404(a)(3)(ii) and (iv) may include fees that result in a reasonable profit margin in accordance with § 171.302.
                    </Typography>
                    <Typography>
                      For all permitted fees, we:
                    </Typography>
                    <ol>
                      <li>Ensured that such fees are based on objective and verifiable criteria that are uniformly applied to all similarly situated API Information Sources and API Users;</li>
                      <li>Ensured that such fees imposed on API Information Sources are reasonably related to our costs to supply certified API technology to, and if applicable, support certified API technology for, API Information Sources;</li>
                      <li>Ensured that such fees to supply and, if applicable, support certified API technology are reasonably allocated among all similarly situated API Information Sources; and</li>
                      <li>Ensured that such fees are not based on whether API Information Sources or API Users are competitors, potential competitors, or will be using the certified API technology in a way that facilitates competition with us.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not charge fees for the following:
                    </Typography>
                    <ol>
                      <li>Costs associated with intangible assets other than actual development or acquisition costs of such assets;</li>
                      <li>Opportunity costs unrelated to the access, exchange, or use of electronic health information; and</li>
                      <li>Any costs that led to the creation of intellectual property if the actor charged a royalty for that intellectual property pursuant to § 171.303 and that royalty included the development costs for the creation of the intellectual property.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We kept for inspection detailed records of any fees charged with respect to the certified API technology, the methodology(ies) used to calculate such fees, and the specific costs to which such fees are attributed.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We granted an API Information Source the independent ability to permit an API User to interact with the certified API technology deployed by the API Information Source.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We provided certified API technology to an API Information Source on terms that are no less favorable than it provides to itself and its own customers, suppliers, partners, and other persons with whom it has a business relationship.
                    </Typography>
                    <Typography>
                      The terms on which we provided certified API technology was based on objective and verifiable criteria that are uniformly applied to all substantially similar or similarly situated classes of persons and requests.
                    </Typography>
                    <Typography>
                      We did not offer different terms or services based on:
                    </Typography>
                    <ol>
                      <li>Whether a competitive relationship exists or would be created;</li>
                      <li>The revenue or other value that another party may receive from using the API technology.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We had and, upon request, granted to API Information Sources and API Users all rights that may be reasonably necessary to:
                    </Typography>
                    <ol>
                      <li>Access and use our certified API technology in a production environment;</li>
                      <li>Develop products and services that are designed to interact with our certified API technology; and</li>
                      <li>Market, offer, and distribute products and services associated with our certified API technology.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not condition the receipt of the rights described in §170.404(a)(4)(ii)(A) on:
                    </Typography>
                    <ol>
                      <li>Receiving a fee, including but not limited to a license fee, royalty, or revenue-sharing arrangement;</li>
                      <li>Agreeing to not compete with us in any product, service, or market;</li>
                      <li>Agreeing to deal exclusively with us in any product, service, or market;</li>
                      <li>Obtaining additional licenses, products, or services that are not related to or can be unbundled from the certified API technology;</li>
                      <li>Licensing, granting, assigning, or transferring any intellectual property to us;</li>
                      <li>Meeting any testing or certification requirements by us; and.</li>
                      <li>Providing us or our technology with reciprocal access to application data.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We provided all support and other services reasonably necessary to enable the effective development, deployment, and use of certified API technology by API Information Sources and API Users in production environments.
                    </Typography>
                    <Typography>
                      We made reasonable efforts to maintain the compatibility of our certified API technology and to otherwise avoid disrupting the use of certified API technology in production environments.
                    </Typography>
                    <Typography>
                      Except as exigent circumstances require, prior to making changes to our certified API technology or the terms and conditions thereof, we provided notice and a reasonable opportunity for API Information Sources and API Users to update their applications to preserve compatibility with certified API technology and to comply with applicable terms and conditions.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      The following applied to us because we have a Health IT Module certified to the certification criterion adopted in § 170.315(g)(10):
                    </Typography>
                    <Typography>
                      We instituted a process to verify the authenticity of API Users that is objective and the same for all API Users and completed within ten business days of receipt of an API User’s request to register their software application for use with our Health IT Module certified to § 170.315(g)(10).
                    </Typography>
                    <Typography>
                      We registered and enabled all applications for production use within five business days of completing our verification of an API User’s authenticity, pursuant to §170.404(b)(1)(i).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      (If applicable) We published the service base URLs for all Health IT Modules certified to § 170.315(g)(10) that can be used by patients to access their electronic health information. We publicly published the service base URLs:
                    </Typography>
                    <ol>
                      <li>For all of our customers regardless of whether the Health IT Modules certified to § 170.315(g)(10) are centrally managed by us or locally deployed by an API Information Source; and</li>
                      <li>In a machine-readable format at no charge.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our certified API technology previously certified to the certification criterion in § 170.315(g)(8), we provided all API Information Sources with such certified API technology deployed with certified API technology certified to the certification criterion in § 170.315(g)(10) by no later than December 31, 2022.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      By no later than April 5, 2021, for our Health IT Module(s) certified to the certification criteria in § 170.315(g)(7), (8), or (9), we complied with §170.404, including revisions to our existing business and technical API documentation and made such documentation available via a publicly accessible hyperlink that allows any person to directly access the information without any preconditions or additional steps.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Assurances</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Statement</TableCell>
                  <TableCell width="20%">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>
                      To provide assurances satisfactory to the Secretary, we attest to not having taken any action that constitutes information blocking as defined in 42 U.S.C. 300jj-52 and § 171.103 on and after April 5, 2021, unless for legitimate purposes as specified by the Secretary; or any other action that may inhibit the appropriate exchange, access, and use of electronic health information.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We ensure that our health IT certified under the ONC Health IT Certification Program conformed to the full scope of the certification criteria.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not take any action that could interfere with a user’s ability to access or use certified capabilities for any purpose within the full scope of the technology’s certification.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      Our certified Health IT Module that is part of a health IT product which electronically stores EHI was certified to the certification criterion in § 170.315(b)(10).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We retained all records and information necessary to demonstrate initial and ongoing compliance with the requirements of the ONC Health IT Certification Program for:
                    </Typography>
                    <ol>
                      <li>A period of 10 years beginning from the date our Health IT Module(s) is first certified under the Program; or</li>
                      <li>If for a shorter period of time, a period of  years from the effective date that removes all of the certification criteria to which our health IT is certified from the Code of Federal Regulations.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      By December 31, 2023, as a health IT developer that must comply with the requirements of § 170.402(a)(4), we did or plan to provide all of our customers of certified health IT with the health IT certified to the certification criterion in § 170.315(b)(10).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      On and after December 31, 2023, as a health IT developer that must comply with the requirements of § 170.402(a)(4), we provided all of our customers of certified health IT with the health IT certified to the certification criterion in§ 170.315(b)(10).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Communication </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Statement</TableCell>
                  <TableCell width="20%">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not prohibit or restrict any communication regarding—
                      (i) The usability of our health IT;
                      (ii) The interoperability of our health IT;
                      (iii) The security of our health IT;
                      (iv) Relevant information regarding users&apos; experiences when using our health IT;
                      (v) Our business practices related to exchanging electronic health information; and
                      (vi) The manner in which a user of our health IT has used such technology.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not engage in any practice that prohibits or restricts a communication regarding the subject matters enumerated in §170.403(a)(1), unless the practice is specifically permitted by that paragraph and complies with all applicable requirements of that paragraph.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not prohibit or restrict any person or entity from communicating any information whatsoever (including proprietary information, confidential information, and intellectual property) when the communication was about one or more of the subject matters enumerated in §170.403(a)(1) and was made for any of the following purposes:
                    </Typography>
                    <ol>
                      <li>Making a disclosure required by law;</li>
                      <li>Communicating information about adverse events, hazards, and other unsafe conditions to government agencies, health care accreditation organizations, and patient safety organizations;</li>
                      <li>Communicating information about cybersecurity threats and incidents to government agencies;</li>
                      <li>Communicating information about information blocking and other unlawful practices to government agencies; or</li>
                      <li>Communicating information about our failure to comply with a Condition of Certification requirement, or with any other requirement of this part, to ONC or an ONC-ACB.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For communications about one or more of the subject matters enumerated in §170.403(a)(1) that is not entitled to unqualified protection under §170.403(a)(2)(i), we did not prohibit or restrict communications except as expressly permitted by §170.403(a)(2)(ii)(A) through (E).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We issued a written notice to all customers and those with which we have contracts or agreements containing provisions that contravene §170.403(a)(1) annually, beginning in calendar year 2021, until §170.403(b)(2)(ii) is fulfilled, stating that any communication or contract provision that contravenes paragraph (a) of this section will not be enforced by us.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not establish, renew, or enforce any contract or agreement that contravenes §170.403(a)(1).
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      If we had a contract or agreement in existence as of June 30, 2020, that contravenes §170.403(a)(1), then we amended the contract or agreement to remove or void the contractual provision that contravenes §170.403(a)(1) whenever the contract is next modified for other reasons or renewed.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Information Blocking </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Statement</TableCell>
                  <TableCell width="20%">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>
                      We did not take any action that constitutes information blocking as defined in 42 U.S.C. 300jj-52 and § 171.103 on or after April 5, 2021.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Real World Testing </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Statement</TableCell>
                  <TableCell width="20%">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>
                      As a health IT developer with Health IT Module(s) certified to any one or more 2015 Edition certification criteria in § 170.315(b), (c)(1) through (3), (e)(1), (f), (g)(7) through (10), and (h), we successfully tested the real world use of those Health IT Module(s) for interoperability (as defined in 42 U.S.C. 300jj(9) and § 170.102) in the type of setting in which such Health IT Module(s) would be/is marketed.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      As a health IT developer with Health IT Module(s) certified to any one or more of the criteria referenced in §170.405(a), we submitted to our ONC-ACB an annual real world testing plan addressing each of those certified Health IT Modules by a date determined by the ONC-ACB that enables the ONC-ACB to publish a publicly available hyperlink to the plan on CHPL no later than December 15  of each calendar year.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      The plan was approved by a health IT developer authorized representative capable of binding us for execution of the plan and included the representative’s contact information.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      The plan included all health IT certified to any one or more of the criteria referenced in §170.405(a) as of August 31 of the year in which the plan is submitted, and addressed the real world testing to be conducted in the calendar year immediately following plan submission.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      The plan addressed the following for each of the certification criterion identified in §170.405(a) of this section that are included in each Health IT Module’s scope of certification:
                    </Typography>
                    <ol>
                      <li>The testing method(s)/methodology(ies) that will be used to demonstrate real world interoperability and conformance to the full scope of the certification criterion’s requirements, including scenario- and use case-focused testing;</li>
                      <li>The care setting(s) that will be tested for real world interoperability and an explanation for our choice of care setting(s) to test;</li>
                      <li>For any standards and implementation specifications referenced by the criterion that the developer has chosen to certify to National Coordinator-approved newer versions pursuant to §170.405(b)(8) or §170.405(9), a description of how we will test and demonstrate conformance to all requirements of the criterion using all versions of the adopted standards to which each Health IT Module was certified as of August 31 of the year in which the real world testing plan is due.</li>
                      <li>A schedule of key real world testing milestones;</li>
                      <li>A description of the expected outcomes of real world testing;</li>
                      <li>At least one measurement/metric associated with the real world testing; and</li>
                      <li>A justification for our real world testing approach.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      If in the course of conducting real world testing we discovered one or more non-conformities with the full scope of any certification criterion under the Program, we reported that non-conformity to the ONC-ACB within 30 days.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For real world testing activities conducted during the immediately preceding calendar year, we submitted to our ONC-ACB an annual real world testing results report addressing each of our certified Health IT Modules that include certification criteria referenced in §170.405(a) by a date determined by the ONC-ACB that enables the ONC-ACB to publish a publicly available hyperlink to the results report on CHPL no later than March 15 of each calendar year. The real world testing results reported the following for each of the certification criteria identified in §170.405(a) that are included in the Health IT Module’s scope of certification:
                    </Typography>
                    <ol>
                      <li>The method(s) that was used to demonstrate real world interoperability;</li>
                      <li>The care setting(s) that was tested for real world interoperability;</li>
                      <li>The voluntary updates to standards and implementation specifications that the National Coordinator has approved through the Standards Version Advancement Process.</li>
                      <li>A list of the key milestones met during real world testing;</li>
                      <li>The outcomes of real world testing including a description of any challenges encountered during real world testing; and</li>
                      <li>At least one measurement/metric associated with the real world testing.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our health IT certified to § 170.315(b)(1), (b)(2), (e)(1), (g)(6), and/or (g)(9) on May 1, 2020, we:
                    </Typography>
                    <ol>
                      <li>Updated our certified health IT to be compliant with the revised versions of these criteria adopted in this final rule; and</li>
                      <li>Provided our customers of the previously certified health IT with certified health IT that meets §170.405(b)(3)(i) by December 31, 2022.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our health IT certified to § 170.315(b)(1), (b)(2), (b)(9), (e)(1), (g)(6), and/or (g)(9) prior to May 1, 2020, we:
                    </Typography>
                    <ol>
                      <li>Updated our certified health IT to be compliant with the revised versions of the Program criteria in the 2015 Edition; and</li>
                      <li>Provided our customers of the previously certified health IT with certified health IT that meets §170.405(b)(4)(i) of this section by December 31, 2022.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our health IT certified to § 170.315(b)(3) prior to June 30, 2020, we:
                    </Typography>
                    <ol>
                      <li>Updated our certified health IT to be compliant with the revised versions of this criteria adopted at § 170.315(b)(3)(ii); and</li>
                      <li>Provided our customers of the previously certified health IT with certified health IT that meets §170.405(b)(5)(i) by December 31, 2022.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our health IT certified to § 170.315 (b)(7) and/or § 170.315 (b)(8) prior to May 1, 2020 we:
                    </Typography>
                    <ol>
                      <li>Updated our certified health IT to be compliant with the revised versions of the criteria adopted in § 170.315(b)(7) and/or the revised versions of the criteria adopted in § 170.315(b)(8); and</li>
                      <li>Provided our customers of the previously certified health IT with certified health IT that meets paragraph §170.405(b)(6)(i) by December 31, 2022.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>
                      For our health IT certified to § 170.315(d)(2), (d)(3), and/or (d)(10) prior to May 1, 2020, we:
                    </Typography>
                    <ol>
                      <li>Updated our certified health IT to be compliant with § 170.210(e)(1) and the standard specified in § 170.210(h); and</li>
                      <li>Provided our customers of the previously certified health IT with certified health IT that meets paragraph §170.405(b)(7)(i) by December 31, 2022.</li>
                    </ol>
                  </TableCell>
                  <TableCell>
                    <RadioGroup>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Not Applicable" control={<Radio />} label="Not Applicable" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </ThemeProvider>
    </Container>
  );
}

export default ChplAttestations;
