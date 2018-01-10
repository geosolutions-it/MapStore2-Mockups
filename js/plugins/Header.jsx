/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Filter = require('../../MapStore2/web/client/components/misc/Filter');
const {ButtonGroup, Button, Glyphicon, DropdownButton, MenuItem} = require('react-bootstrap');

class HeaderPlugin extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        showFilter: PropTypes.bool,
        logged: PropTypes.bool,
        homeButton: PropTypes.bool,
        managerButton: PropTypes.bool
    };

    static defaultProps = {
        title: 'MapStore',
        showFilter: true,
        logged: true,
        homeButton: false,
        managerButton: false
    };

    render() {
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
                    <ButtonGroup>
                        <Button className="square-button no-border">
                            <img src={require('../../MapStore2/web/client/components/I18N/images/flags/en-US.png')} />
                        </Button>
                        {this.props.homeButton && <a href="#/maps-archive"><Button bsStyle="primary" className="square-button" bsStyle="primary">
                            <Glyphicon glyph="home"/>
                        </Button></a>}
                        <Button bsStyle="primary" className="square-button" bsStyle={this.props.logged ? 'success' : 'primary'}>
                            <Glyphicon glyph="user"/>
                        </Button>
                        {this.props.managerButton && <DropdownButton className="square-button" bsStyle="primary" title={<Glyphicon glyph="1-menu-manage"/>} noCaret pullRight>
                            <MenuItem eventKey="1">Manage Account</MenuItem>
                            <MenuItem eventKey="2" href="#/geofence-rules-manager">Manage GeoFence Rules</MenuItem>
                        </DropdownButton>}
                    </ButtonGroup>
                    {this.props.showFilter && <Filter filterPlaceholder="Filter maps..." />}
                </div>
            </div>
        );
    }
}

module.exports = {
    HeaderPlugin
};
