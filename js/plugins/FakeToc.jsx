/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {
    OverlayTrigger,
    Tooltip
} = require('react-bootstrap');

class FakeTOC extends React.Component {

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
        const selected = this.state.selected ? ' selected' : '';
        return (
            <span>
                <button id="drawer-menu-button" type="button" className="square-button btn btn-primary" onClick={() => {
                    this.setState({ open: true});
                }}><span className="glyphicon glyphicon-1-layer"></span></button>
            <div id="mapstore-drawermenu" style={{display: this.state.open ? 'block' : 'none', overflow: 'hidden'}}>
            <div className="nav-menu" style={{zIndex: 1022, position: 'absolute', top: 0, bottom: 0, height: 'calc(100% - 30px)', transition: '-webkit-transform 0.3s ease-out', willChange: 'transform', overflowY: 'auto', width: 300, left: 0, transform: 'translateX(0%)', boxShadow: 'rgba(0, 0, 0, 0.15) 2px 2px 4px'}}>
                <div className="nav-content">
                    <div className="navHeader" style={{width: '100%', minHeight: 35}} >
                        <span className="no-border btn-default glyphicon glyphicon-1-close" style={{cursor: 'pointer'}} onClick={() => {
                            this.setState({ open: false});
                        }}></span>
                        <div className="navButtons">
                            <button type="button" className="square-button no-border btn btn-lg btn-default pull-right">
                                <span className="glyphicon glyphicon-1-layer"></span>
                            </button>
                        </div>
                    </div>
                    <div className="nav-body">
                        <div open="" className="panel panel-default">
                            <div className="panel-body">
                                <div>
                                    <div className="mapstore-toc-head toc-head-sections-3">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="mapstore-toc-head-title-container text-center no-border col-xs-12">
                                                    <div className="mapstore-toc-head-title" title="Unesco Italian Items">
                                                        <span className="glyphicon glyphicon-1-map"></span>&nbsp;&nbsp;Map Title</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="text-center col-xs-12">
                                                    <div className="mapstore-filter form-group">
                                                        <span className="input-group">
                                                            <input type="text" value="" placeholder="Filter layers" className="form-control"/>
                                                                <span className="square-button-md input-group-addon">
                                                                    <span className="text-primary glyphicon glyphicon-filter"></span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="text-center col-xs-12">
                                                        <div className="btn-group">
                                                            {this.state.selected ? <span>
                                                            <a href="#/styleeditor">
                                                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-sett">Selected layer settings</Tooltip>}>
                                                                <button type="button" className="square-button-md btn btn-primary">
                                                                    <span className="glyphicon glyphicon-wrench"></span>
                                                                </button></OverlayTrigger></a>
                                                            <a href="#/widget">
                                                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-widget">Create Widget from selected layer</Tooltip>}>
                                                                <button type="button" className="square-button-md btn btn-primary">
                                                                    <span className="glyphicon glyphicon-cog"></span>
                                                                </button>
                                                                </OverlayTrigger>
                                                                </a>
                                                            </span> : null}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mapstore-toc toc-body-sections-3">
                                            <div id="mapstore-layers" className="mapstore-layers-container">
                                                <div className="Sortable">
                                                    <div className="SortableItem group-expanded toc-default-group toc-group-1">
                                                        <div className="toc-default-group-head">
                                                            <span className="toc-layer-tool toc-grab glyphicon glyphicon-menu-hamburger"></span>
                                                            <span className="toc-layer-tool visibility-check checked glyphicon glyphicon-eye-open"></span>
                                                            <div>
                                                                <span className="toc-group-title">Default</span>
                                                                <span className="toc-status-icon glyphicon glyphicon-folder-open"></span>
                                                            </div>
                                                        </div>
                                                        <span>
                                                            <div className="toc-group-children">
                                                                <div className="Sortable">
                                                                    <div className={"SortableItem layer-collapsed toc-default-layer" + selected} onClick={() => {
                                                                        this.setState( {
                                                                            selected: !this.state.selected
                                                                        });
                                                                    }}>
                                                                        <div className="toc-default-layer-head">
                                                                            <span className="toc-layer-tool toc-grab glyphicon glyphicon-menu-hamburger"></span>
                                                                            <span className="toc-layer-tool visibility-check checked glyphicon glyphicon-eye-open"></span>
                                                                            <div className="toc-title">Layer Title</div>
                                                                            <span className="toc-layer-tool toc-legend glyphicon glyphicon-chevron-left"></span>
                                                                        </div>
                                                                        <span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div></span>);
    }
}

module.exports = {
    FakeTOCPlugin: FakeTOC
};
