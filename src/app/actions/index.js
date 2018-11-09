/* eslint-disable no-console,angular/log */
import fetch from 'cross-fetch'

export const REQUEST_CERTIFIED_PRODUCTS = 'REQUEST_CERTIFIED_PRODUCTS';
export const RECEIVE_CERTIFIED_PRODUCTS = 'RECEIVE_CERTIFIED_PRODUCTS';
export const PARSE_CERTIFIED_PRODUCTS = 'PARSE_CERTIFIED_PRODUCTS';

export function requestCertifiedProducts () {
    return {
        type: REQUEST_CERTIFIED_PRODUCTS,
        payload: {},
    };
}

export function receiveCertifiedProducts (json) {
    return {
        type: RECEIVE_CERTIFIED_PRODUCTS,
        payload: {
            certifiedProducts: json.results,
            receivedAt: Date.now(),
        },
    };
}

export function parseCertifiedProducts (listings) {
    return {
        type: PARSE_CERTIFIED_PRODUCTS,
        payload: {
            certifiedProducts: listings,
        },
    };
}

function fetchCertifiedProducts () {
    return (dispatch) => {
        dispatch(requestCertifiedProducts());
        return fetch('http://localhost:3000/rest/collections/certified_products', {
            headers: {
                'API-Key': '12909a978483dfb8ecd0596c98ae9094',
            },
        })
            .then(response => response.json())
            .then(json => dispatch(receiveCertifiedProducts(json)))
            .then(listings => dispatch(parseCertifiedProducts(listings)))
    }
}

function shouldFetchCertifiedProducts (state) {
    if (!state.getCertifiedProducts) {
        return true;
    } else if (state.getCertifiedProducts.isFetching) {
        return false;
    } else if ((Date.now() - state.getCertifiedProducts.lastUpdated) > (1000 * 60)) { // one minute refresh
        return true;
    }
    return true;
}

export function fetchCertifiedProductsIfNeeded () {
    return (dispatch, getState) => {
        if (shouldFetchCertifiedProducts(getState())) {
            return dispatch(fetchCertifiedProducts())
        } else {
            return Promise.resolve();
        }
    }
}

export default {
    fetchCertifiedProductsIfNeeded,
    requestCertifiedProducts,
    receiveCertifiedProducts,
    parseCertifiedProducts,
};
