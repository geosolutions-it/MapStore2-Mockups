/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

class FooterPlugin extends React.Component {

    static propTypes = {
        buttons: PropTypes.array
    };

    static defaultProps = {
        buttons: [
            {visible: true, glyph: 'user'}
        ]
    };

    render() {

        return (
            <div className="mapstore-footer">
                <div className="m-left"></div>
                <div className="m-right"></div>
            </div>
        );
    }
}

module.exports = {
    FooterPlugin
};
