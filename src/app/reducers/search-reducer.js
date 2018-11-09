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
                listing.mainSearch = [listing.developer, listing.product, listing.acbCertificationId, listing.chplProductNumber].join('|');
                listing.developerSearch = listing.developer;
                if (listing.previousDevelopers) {
                    listing.mainSearch += '|' + listing.previousDevelopers;
                    listing.developerSearch += '|' + listing.previousDevelopers;
                }
                listing.surveillance = angular.toJson({
                    surveillanceCount: listing.surveillanceCount,
                    openNonconformityCount: listing.openNonconformityCount,
                    closedNonconformityCount: listing.closedNonconformityCount,
                });
                return listing;
            }),
        })
    default:
        return state
    }
}
