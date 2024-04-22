import jsPDF from 'jspdf';
import 'jspdf-autotable';

const checkCriterionIsMet = (key, criteriaMet) => {
  const keys = key.split(',');
  let index;
  let result;

  // Check for logic key values
  // | = (any criterion in list will do)
  // & = (all criteria in list must be met)
  if (keys[0] === '|') {
    keys.shift();
    result = [];
    for (index = 0; index < keys.length; ++index) {
      if (criteriaMet.findIndex((criterion) => criterion.number === keys[index]) > -1) {
        result.push(true);
      } else {
        result.push(false);
      }
    }
    return result;
  }
  if (keys[0] === '&') {
    keys.shift();
    result = true;
    for (index = 0; index < keys.length; ++index) {
      if (criteriaMet.findIndex((criterion) => criterion.number === keys[index]) > -1) {
        result = false;
      }
    }
    return [result];
  }
  if (keys.length > 1) {
    console.log(`Multiple keys without a logic key value! (${keys[0]}) ${key} -> ${keys}`);
  }
  return [(criteriaMet.findIndex((criterion) => criterion.number === keys[0]) > -1)];
};

const getPdfCriteria = () => {
  /* eslint-disable object-curly-spacing */
    return [
      {key: null, description: 'Demographics'},
      {key: '170.315 (a)(5)', description: '#170.315(a)(5)'},
      {key: null, description: 'Implantable Device List'},
      {key: '170.315 (a)(14)', description: '#170.315(a)(14)'},
      {key: null, description: 'Clinical Decision Support or Decision Support Interventions'},
      {key: '|,170.315 (a)(9),170.315 (b)(11)', description: '#170.315(a)(9) or #170.315 (b)(11)'},
      {key: null, description: 'Computerized Provider Order Entry'},
      {key: '|,170.315 (a)(1),170.315 (a)(2),170.315 (a)(3)', description: '#170.315(a)(1), #170.315(a)(2), or #170.315(a)(3)'},
      {key: null, description: 'Clinical Quality Measures-Record and Export'},
      {key: '170.315 (c)(1)', description: '#170.315(c)(1)'},
      {key: null, description: 'Transitions of Care'},
      {key: '170.315 (b)(1)', description: '#170.315(b)(1)'},
      {key: null, description: 'Application Access-Patient Selection'},
      {key: '170.315 (g)(7)', description: '#170.315(g)(7)'},
      {key: null, description: 'Application Access-Data Category Request'},
      {key: '170.315 (g)(10)', description: '#170.315(g)(10)'},
      {key: null, description: 'Application Access-All Data Request'},
      {key: '170.315 (g)(9)', description: '#170.315(g)(9)'},
      {key: null, description: 'Direct Project or Direct Project, Edge Protocol, and XDR/XDM'},
      {key: '|,170.315 (h)(1),170.315 (h)(2)', description: '#170.315(h)(1) or #170.315(h)(2)'},
    ];
  /* eslint-enable object-curly-spacing */
};

const createPdf = (data) => {
  if (!data || data === 'undefined') {
    return;
  }

  // Setup the basic data listing
  const listings = data.products.map((l, idx) => {
    let software = decodeURIComponent(l.additionalSoftware);
    if (software) {
      software = software.replace(/\+/g, ' ');
    }
    return {
      head: [[`Listing ${idx + 1}`, '']],
      body: [
        ['Certifying Body', l.acb],
        ['Practice Type', (l.practiceType ? l.practiceType : 'N/A')],
        ['Product Certification #', l.chplProductNumber],
        ['Developer', l.vendor],
        ['Product Name', l.name],
        ['Version', l.version],
        ['Classification', (l.classification ? l.classification : 'N/A')],
      ],
    };
  });

  // Setup the criteria section
  const checkImageData = [
    'data:image/jpeg;base64,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',
    'data:image/jpeg;base64,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rn51qXOewTWs/tF8KSxLzUzVmVZCUn71/aNbQxIxmav+Y3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I3k615I19DFIwma/+YSl9iala86ikKSPoa/tFuQnGpnhKUnXD5jONiW66tLTSBaUtRqAELlaEJYl8xmiNer9P5e35QpxxanHFGsqUayfhGFyZWmaCx6P0e2tYQm3cuq+rTq+knZpqVQc3pFVV/LTHomKTZLhNQC60V/K1VkVm4QqSk12aMaVwccfzHDRkWkSj606UtmNwzPRKjcMz0So3DM9EqNwzPRKjcMz0So3DM9EqNwzPRKjcMz0So3DM9EqNwzPRKjcMz0So3DM9EqNwzPRKjcMz0So3DM9EqLS5R9CdKmyIS22krWo1JSkVkmEz8+kLpNQ1qc4YHjjq211OzbnuWNOJwhybnHS88vTmA0DDUboulna5TaszCz7rA8ns+WbUTRzCqpidrC6uBvh+ub66vrUwpUrRoNXpBtnP0+MBMjJNtK/mVVrP7s/wXp/Qt+mzeksi19dW2up2bc9yxpxOEOzk46XXnM50YDIboqlXPY9qzMK4rA8ns+WaJ42q22D6ujCzn/ytajEneGfePKHAgZ/D+8NssoDbTabKUJzAfC211OzbnuWNOJwh2cnHS6+5nOjAZSKCnF+kQR7Ms501fwfLRE0+c7rql/U6lKzRAr1jaT9Sf8AXwttdTs257ljTicIdnJx0uvuZzowGXRCWa7XrKFXaAa1favVpHnx3fhLa6nZtz3LGnE4Q7OTjpdfcznRgMuoXmP/ACc+mqecTU20eKT46tI8+O78HbXU7Nue5Y04nCHZycdLr7mc6MBl1C8w3SlKN1zudphXFYnldmRSPPju/BW11OzbnuWNOJwh2cnHS6+5nOjAZdQvMN0pSjdc7naYVxWJ5XZk0jz47uSqQoyw9PC5x03pawxMemVS82FaEulKf/UXQiTp1aShdyJyqzZPLwx2K2up2bc9yxpxOEOzk46XX3M50YDLqF5hulKUbrnc7TCuKxPK7MqkefHdyHKLotyudNzr6eKwHK7IrN5Oq3RVKuex7VmYVxWB5PZ8s2XbXU7OOe5Y04nCHZycdLr7mc6MBl1C8mG6UpRuudztMK4rE8rsy6R58d3V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',
  ];
  const checkImages = [];
  const criteria = {
    head: [['2015 CMS EHR Base Criteria Met']],
    body: getPdfCriteria(),
  };

  // Start the PDF document
  const doc = new jsPDF('l', 'pt');
  const bodyStartY = 120;

  // Set document properties
  doc.setProperties({
    title: `CMS EHR ID ${data.ehrCertificationId}`,
    subject: 'CMS EHR ID components',
    author: 'CHPL',
    creator: 'CHPL',
  });

  // Add header text
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(40, 80, 'Certified Health IT Product List');

  // Add body text to PDF
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    40,
    bodyStartY,
    doc.splitTextToSize(
      'The CMS EHR Certification ID shown corresponds to the collection of products listed below. Submit this ID as part of the attestation process for the CMS EHR Incentive Programs.',
      775,
    ),
  );
  doc.text(
    40,
    bodyStartY + 30,
    doc.splitTextToSize(
      '* Additional certification criteria may need to be added in order to meet submission requirements for Medicaid and Medicare programs.',
      775,
    ),
  );

  // Add Certification ID to PDF
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(300, bodyStartY + 70, `CMS EHR ID: ${data.ehrCertificationId}`);

  // Add products table to PDF
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  listings.forEach((l, idx) => {
    doc.autoTable({
      head: l.head,
      body: l.body,
      theme: 'grid',
      headStyles: {
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
        fillColor: [0, 112, 201],
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 175 },
        1: { cellWidth: 'auto' },
      },
      startY: idx === 0 ? bodyStartY + 90 : doc.autoTable.previous.finalY + 10,
      margin: 20,
      pageBreak: 'avoid',
      tableWidth: 'auto',
    });
  });

  // Add criteria table to PDF
  if (criteria.body) {
    const fontSize = 10;
    doc.addPage();
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      head: criteria.head,
      body: criteria.body,
      headStyles: {
        valign: 'middle',
        halign: 'center',
        overflow: 'linebreak',
        cellWidth: 'auto',
        fillColor: [0, 112, 201],
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
        cellWidth: 'auto',
      },
      margin: 20,
      pageBreak: 'avoid',
      tableWidth: 'auto',
      didDrawCell(cellData) {
        if (cellData.row.section === 'body') {
          cellData.cell.x += 4;
          cellData.cell.y += 14;
          if (cellData.row.raw.key) {
            const met = checkCriterionIsMet(cellData.row.raw.key, data.criteria);
            cellData.cell.x += 32;
            const descriptionParts = cellData.row.raw.description.split('#');
            for (let partIndex = 0; partIndex < descriptionParts.length; ++partIndex) {
              const outText = descriptionParts[partIndex];
              doc.text(outText, cellData.cell.x, cellData.cell.y);
              cellData.cell.x += doc.getStringUnitWidth(outText) * fontSize;
              if (partIndex < met.length) {
                if (met[partIndex]) {
                  checkImages.push({ elem: checkImageData[1], x: cellData.cell.x, y: cellData.cell.y - 8 });
                } else {
                  checkImages.push({ elem: checkImageData[0], x: cellData.cell.x, y: cellData.cell.y - 8 });
                }
                cellData.cell.x += 12;
              }
            }
          } else {
            doc.text(cellData.row.raw.description, cellData.cell.x, cellData.cell.y);
            checkImages.push(null);
          }
        }
      },
      afterPageContent() {
        const total = checkImages.length;
        for (let index = 0; index < total; index += 1) {
          const img = checkImages.shift();
          if (img) {
            doc.addImage(img.elem, 'jpeg', img.x, img.y, 10, 10);
          }
        }
      },
    });
  } else {
    console.log(`No PDF criteria layout for ${data.year}!`);
  }

  // Output the PDF
  doc.save(`${data.ehrCertificationId}.pdf`);
};

export default createPdf;
