import React, { useEffect, useState } from 'react';
import {arrayOf, object} from 'prop-types';

import { reliedUponSoftware } from '../../../../shared/prop-types';

const getDisplay = (sw) => {
  return (
    <>
      { sw.certifiedProductId &&
        <a href="#/listing/{ sw.certifiedProductId }">{ sw.certifiedProductNumber }</a>
      }
      { !sw.certifiedProductId && sw.certifiedProductNumber &&
        <>
          <span className="data-item--invalid">{ sw.certifiedProductNumber }</span>
          (this CHPL Product Number is invalid)
        </>
      }
      { !sw.certifiedProductId && !sw.certifiedProductNumber && sw.name }
      { !sw.certifiedProductId && !sw.certifiedProductNumber && sw.version && sw.version !== '-1' && (' (Version ' + sw.version + ')') }
    </>
  )
}

const isAndOrOr = (subIndex, groupLength, mainIndex, groupCount) => {
  if (subIndex < (groupLength - 1)) {
    return ' OR';
  } else if (mainIndex < (groupCount - 1)) {
    return ' AND';
  }
  return '';
}

function ChplReliedUponSoftware (props) {
  if (!props.sw || props.sw.length === 0) {
    return (
      <>None</>
    );
  }

  const [software, setSoftware] = useState([]);
  const [groupCount, setGroupCount] = useState(0);
  useEffect(() => {
    let displaySw = {};
    let groupCount = 0;
    props.sw.forEach((item, arr, idx) => {
      if (item.grouping === null) {
        displaySw['defaultGroup' + idx] = [item];
        groupCount += 1;
      } else {
        if (!displaySw[item.grouping]) {
          displaySw[item.grouping] = [];
          groupCount += 1;
        }
        displaySw[item.grouping].push(item);
      }
    });
    setSoftware(displaySw);
    setGroupCount(groupCount);
  }, []);

  return (
    <ul>
      { Object.values(software).map((group, groupIndex) => {
        return group.length > 1 ? (
          <li key={'oneOf-' + groupIndex}>One of
            <ul key={'group-' + groupIndex}>
              { group.map((sw, subIndex) => (
                <li key={sw.id}>
                  { getDisplay(sw) }
                  { isAndOrOr(subIndex, group.length, groupIndex, groupCount) }
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={group[0].id}>
            { getDisplay(group[0]) }
            { groupIndex !== groupCount - 1 && ' AND' }
          </li>
        )
      })}
    </ul>
  );
}

export { ChplReliedUponSoftware };

ChplReliedUponSoftware.propTypes = {
  sw: arrayOf(reliedUponSoftware),
};
