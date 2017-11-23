/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

class FakeToolbar extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func
    };

    static defaultProps = {
        onSelect: () => {}
    };

    state = {
        open: true,
        selected: false
    }

    render() {

        return (
            <span id="navigationBar" style={{position: 'absolute', right: 0, bottom: 50, zIndex: 1}}>
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

module.exports = {
    FakeToolbarPlugin: FakeToolbar
};
