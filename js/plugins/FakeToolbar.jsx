/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {createSelector} = require('reselect');
const {connect} = require('react-redux');

class FakeToolbar extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        right: PropTypes.number,
        fixed: PropTypes.bool
    };

    static defaultProps = {
        onSelect: () => {},
        right: 0,
        fixed: true
    };

    state = {
        open: true,
        selected: false
    }

    render() {

        return (
            <span id="navigationBar" style={{position: 'absolute', right: this.props.fixed ? 0 : this.props.right, bottom: 50, zIndex: 1}}>
                <span id="navigationBar-container" className="mapToolbar btn-group-vertical">

                    <button id="locate-btn" disabled="" type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-1-position-1"></span>

                    </button>
                    <button id="zoomin-btn" type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                    <button id="zoomout-btn" type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-minus"></span>

                    </button>
                    <button id="fullscreen-btn" type="button" className="square-button btn btn-primary" style={{width: '100%'}}>
                        <span className="glyphicon glyphicon-1-full-screen"></span>
                    </button>
                    <button id="mapstore-zoomtomaxextent" type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-resize-full"></span>
                    </button>
                    <button id="globeviewswitcher-btn" type="button" className="square-button btn btn-primary" style={{width: '100%'}}>
                        <span className="glyphicon glyphicon-globe"></span>
                    </button>
                    <button draggable="false" type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-map-marker"></span>
                    </button>
                    <button type="button" className="square-button btn btn-primary">
                        <span className="glyphicon glyphicon-option-horizontal"></span>
                    </button>
                </span>
            </span>);
    }
}


const selector = createSelector([
    state => state.mockups && state.mockups.detailsPanel,
    state => state.mockups && state.mockups.clickMap
], (detailsPanel, clickMap) => ({
    right: detailsPanel && 658 || clickMap && 500 || 0
}));

const FakeToolbarPlugin = connect(selector)(FakeToolbar);

module.exports = {
    FakeToolbarPlugin
};
