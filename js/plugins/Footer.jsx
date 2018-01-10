/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {Pagination} = require('react-bootstrap');

class FooterPlugin extends React.Component {

    static propTypes = {
        buttons: PropTypes.array,
        loading: PropTypes.bool,
        pagination: PropTypes.bool
    };

    static defaultProps = {
        buttons: [
            {visible: true, glyph: 'user'}
        ],
        loading: false
    };

    render() {

        return (
            <div className="mapstore-footer">
                <div className="m-left">
                    <div className="ms-circle-loader-md"></div>
                </div>
                <div className="m-center">
                {this.props.pagination && <Pagination next prev last first />}
                </div>
                <div className="m-right">
                    <div className="ms-logo-geosolutions">
                        <img src={require('../../assets/img/logo.png')}/>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    FooterPlugin
};
