/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const SET_OPTION = 'MOCKUPS:SET_OPTION';

function setOption(key, value) {
    return {
        type: SET_OPTION,
        key,
        value
    };
}

module.exports = {
    SET_OPTION,
    setOption
};
