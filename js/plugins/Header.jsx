/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');

class HeaderPlugin extends React.Component {

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
            <div className="mapstore-header">
                <div className="m-left">
                    {/*<div>MapStore</div>*/}
                </div>
                <div className="m-right"><Toolbar btnDefaultProps={{bsStyle: 'primary', className: 'square-button'}} buttons={this.props.buttons}/></div>
            </div>
        );
    }
}

module.exports = {
    HeaderPlugin
};
