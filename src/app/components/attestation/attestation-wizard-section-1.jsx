import React from 'react';
import {
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  attestationContainerList: {
    fontSize: '0.875em',
  },
  forAssistanceContainer: {
    marginTop: '16px',
  },
});

function ChplAttestationWizardSection1() {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 1 &mdash; Introduction
      </Typography>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            <strong>
              The Conditions and Maintenance of Certification requirements, as outlined in 42 U.S.C. 300jj-11(c)(5)(D), are initial and ongoing requirements that a health IT developer of certified health IT and its certified Health IT Module(s) must meet or adhere to in order to maintain their certification status in the ONC Health IT Certification Program (Certification Program).
            </strong>
          </Typography>
          <Divider />
          <Typography gutterBottom variant="body1">
            A health IT developer of certified health IT, or its authorized representative that is capable of binding the health IT developer, must provide the Secretary of Health and Human Services an attestation of compliance with the Conditions and Maintenance of Certification requirements (
            <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-170/subpart-D/section-170.406">45 CFR 170.406</a>
            ;
            {' '}
            <a href="https://www.federalregister.gov/documents/2020/05/01/2020-07419/21st-century-cures-act-interoperability-information-blocking-and-the-onc-health-it-certification#page-25781">85 FR 25781</a>
            ). ONC-Authorized Certification Bodies (ONC-ACBs) review and submit attestations to ONC for public availability (
            <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-170/subpart-E#p-170.523(q)">45 CFR 170.523(q)</a>
            ).
          </Typography>
          <Typography gutterBottom variant="body1">
            Please proceed to review the Attestations and attest to the compliance, noncompliance, or the inapplicability of each Condition and Maintenance of Certification requirement for your health IT developer of certified health IT.
          </Typography>
          <Typography variant="body1">
            Irrespective of your attestation, note that under certain circumstances ONC may directly review the actions or practices of a health IT developer of certified health IT, or its certified health IT, to determine whether they conform to the requirements of the Certification Program (
            <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-170/subpart-E/section-170.580#p-170.580(a)(2)">45 CFR 170.580(a)(2)</a>
            ).  Determinations made pursuant to such review may, as necessary, result in corrective action and enforcement procedures under the Certification Program.
          </Typography>
        </CardContent>
      </Card>
      <Typography gutterBottom className={classes.forAssistanceContainer} variant="body1">
        For assistance with the Attestation submission process, please see the
        {' '}
        <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">Health IT Feedback and Inquiry Portal</a>
        {' '}
        to submit a ticket as applicable --
      </Typography>
      <ul className={classes.attestationContainerList}>
        <li>For questions regarding the Attestations Condition and Maintenance of Certification requirement, please select the &quot;Attestations Condition&quot; category.</li>
        <li>For questions regarding a Condition and Maintenance of Certification requirement other than Attestations, please select the relevant Condition category.</li>
        <li>For technical assistance with this process, please select the &quot;CHPL&quot; category.</li>
      </ul>
    </Container>
  );
}

export default ChplAttestationWizardSection1;

ChplAttestationWizardSection1.propTypes = {
};
