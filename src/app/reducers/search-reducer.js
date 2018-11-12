import {
    PARSE_CERTIFIED_PRODUCTS,
} from '../actions';

export default function parseCertifiedProducts (
    state = {
        certifiedProducts: [],
    }, action) {
    switch (action.type) {
    case PARSE_CERTIFIED_PRODUCTS:
        return Object.assign({}, state, {
            certifiedProducts: action.payload.certifiedProducts.payload.certifiedProducts.map(listing => {
                const ret = angular.copy(listing);
                ret.mainSearch = [ret.developer, ret.product, ret.acbCertificationId, ret.chplProductNumber].join('|');
                ret.developerSearch = ret.developer;
                if (ret.previousDevelopers) {
                    ret.mainSearch += '|' + ret.previousDevelopers;
                    ret.developerSearch += '|' + ret.previousDevelopers;
                }
                ret.surveillance = angular.toJson({
                    surveillanceCount: ret.surveillanceCount,
                    openNonconformityCount: ret.openNonconformityCount,
                    closedNonconformityCount: ret.closedNonconformityCount,
                });
                return ret;
            }),
        })
    default:
        return state
    }
}
