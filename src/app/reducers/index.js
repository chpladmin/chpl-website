import * as redux from 'redux';
import parseCertifiedProducts from './search-reducer';

import {
    REQUEST_CERTIFIED_PRODUCTS,
    RECEIVE_CERTIFIED_PRODUCTS,
} from '../actions';

function getCertifiedProducts (
    state = {
        isFetching: false,
        certifiedProducts: [],
    }, action) {
    switch (action.type) {
    case REQUEST_CERTIFIED_PRODUCTS:
        return Object.assign({}, state, {
            isFetching: true,
        })
    case RECEIVE_CERTIFIED_PRODUCTS:
        return Object.assign({}, state, {
            isFetching: false,
            certifiedProducts: action.payload.certifiedProducts,
            lastUpdated: action.payload.receivedAt,
        })
    default:
        return state
    }
}

const reducers = redux.combineReducers({
    getCertifiedProducts,
    parseCertifiedProducts,
});

export default reducers;
