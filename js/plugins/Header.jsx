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
const Filter = require('../../MapStore2/web/client/components/misc/Filter');

class HeaderPlugin extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        showFilter: PropTypes.bool,
        logged: PropTypes.bool
    };

    static defaultProps = {
        title: 'MapStore',
        showFilter: true,
        logged: true
    };

    render() {
        const buttons = [
            {
                visible: true,
                text: <img src={require('../../MapStore2/web/client/components/I18N/images/flags/en-US.png')} />,
                bsStyle: 'default no-border'
            },
            {
                visible: true,
                glyph: 'user',
                bsStyle: this.props.logged ? 'success' : 'primary'
            }
        ];
        return (
            <div className="mapstore-header">
                <div className="m-left">
                    <div className="ms-logo-title">
                        <a href="#">
                            <div>{this.props.title}</div>
                        </a>
                    </div>
                </div>
                <div className="m-right">
                    <Toolbar btnDefaultProps={{bsStyle: 'primary', className: 'square-button'}} buttons={buttons}/>
                    {this.props.showFilter && <Filter filterPlaceholder="Filter maps..." />}
                </div>
            </div>
        );
    }
}

module.exports = {
    HeaderPlugin
};
