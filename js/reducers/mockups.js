/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {SET_OPTION} = require('../actions/mockups');
const assign = require('object-assign');

function mockups(state = {}, action) {
    switch (action.type) {
        case SET_OPTION:
            return assign({}, state, {[action.key]: action.value});
        default:
            return state;
    }
}

module.exports = mockups;
