/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Node = require('../../../MapStore2/web/client/components/TOC/Node');
const {isObject, isArray} = require('lodash');
const {Grid, Row, Col, Glyphicon: GlyphiconRB} = require('react-bootstrap');
const VisibilityCheck = require('../../../MapStore2/web/client/components/TOC/fragments/VisibilityCheck');
const Title = require('../../../MapStore2/web/client/components/TOC/fragments/Title');
const SideCard = require('./SideCardM');
const LayersTool = require('../../../MapStore2/web/client/components/TOC/fragments/LayersTool');
const tooltip = require('../../../MapStore2/web/client/components/misc/enhancers/tooltip');
const Glyphicon = tooltip(GlyphiconRB);
const Slider = require('react-nouislider');
const {isNumber} = require('lodash');

class DefaultLayer extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        propertiesChangeHandler: PropTypes.func,
        onToggle: PropTypes.func,
        onContextMenu: PropTypes.func,
        onSelect: PropTypes.func,
        style: PropTypes.object,
        sortableStyle: PropTypes.object,
        activateLegendTool: PropTypes.bool,
        activateOpacityTool: PropTypes.bool,
        visibilityCheckType: PropTypes.string,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array,
        additionalTools: PropTypes.array,
        legendOptions: PropTypes.object,
        currentLocale: PropTypes.string,
        selectedNodes: PropTypes.array,
        filterText: PropTypes.string,
        onUpdateNode: PropTypes.func,
        titleTooltip: PropTypes.bool,
        showFullTitleOnExpand: PropTypes.bool
    };

    static defaultProps = {
        style: {},
        sortableStyle: {},
        propertiesChangeHandler: () => {},
        onToggle: () => {},
        onContextMenu: () => {},
        onSelect: () => {},
        activateLegendTool: false,
        activateOpacityTool: true,
        visibilityCheckType: "glyph",
        additionalTools: [],
        currentLocale: 'en-US',
        selectedNodes: [],
        filterText: '',
        onUpdateNode: () => {},
        titleTooltip: false,
        showFullTitleOnExpand: false
    };

    renderCollapsible = () => {
        const layerOpacity = this.props.node.opacity !== undefined ? Math.round(this.props.node.opacity * 100) : 100;
        return (
            <div key="legend" position="collapsible" className="collapsible-toc" style={{padding: 0}}>
                <Grid fluid>
                    {this.props.showFullTitleOnExpand ? <Row><Col xs={12} className="toc-full-title">{this.getTitle(this.props.node)}</Col></Row> : null}
                    {this.props.activateLegendTool ?
                    <Row>
                        <Col xs={12}>
                            <img src={this.props.node.legendSrc}/>
                        </Col>
                    </Row> : null}
                    <Row>
                        <Col xs={12}>
                            <small>Opacity: <input
                            type="text"
                            value={parseFloat(layerOpacity)}
                            onChange={(e) => {
                                if (e.target.value && isNumber(parseFloat(e.target.value))) {
                                    this.props.onUpdateNode(this.props.node.id, 'layers', {opacity: parseFloat(e.target.value) / 100});
                                } else {
                                    this.props.onUpdateNode(this.props.node.id, 'layers', {opacity: 0});
                                }
                            }}
                            style={{
                                border: 'none',
                                width: 25,
                                textAlign: 'right',
                                paddingRight: 4
                            }}/>%</small>
                        </Col>
                    </Row>
                </Grid>
                <Slider start={[layerOpacity]}
                        disabled={!this.props.node.visibility}
                        range={{min: 0, max: 100}}
                        format={{
                            from: value => Math.round(value),
                            to: value => Math.round(value) + ' %'
                        }}
                        onSlide={(opacity) => {
                            if (isArray(opacity) && opacity[0]) {
                                this.props.onUpdateNode(this.props.node.id, 'layers', {opacity: parseFloat(opacity[0].replace(' %', '')) / 100});
                            }
                        }}/>
            </div>);
    };

    renderVisibility = () => {
        return this.props.node.loadingError === 'Error' ?
            (<LayersTool key="loadingerror"
                glyph="exclamation-mark text-danger"
                tooltip="toc.loadingerror"
                className="toc-error"/>)
            :
            (<VisibilityCheck key="visibilitycheck"
                tooltip={this.props.node.loadingError === 'Warning' ? 'toc.toggleLayerVisibilityWarning' : 'toc.toggleLayerVisibility'}
                node={this.props.node}
                checkType={this.props.visibilityCheckType}
                propertiesChangeHandler={this.props.propertiesChangeHandler}/>);
    }

    renderToolsLegend = (isEmpty) => {
        return this.props.node.loadingError === 'Error' || isEmpty ?
                null
                :
                (<LayersTool
                    node={this.props.node}
                    tooltip="toc.displayLegendAndTools"
                    key="toollegend"
                    className="toc-legend"
                    ref="target"
                    glyph="chevron-left"
                    onClick={(node) => this.props.onToggle(node.id, node.expanded)}/>);
    }

    renderNode = (grab, hide, selected, error, warning, other) => {
        const layerOpacity = this.props.node.opacity !== undefined ? Math.round(this.props.node.opacity * 100) : 100;
        const isEmpty = !this.props.activateLegendTool && !this.props.activateOpacityTool;
        return (
            <Node className={'toc-default-layer' + hide + selected + error + warning} sortableStyle={this.props.sortableStyle} style={this.props.style} type="layer" {...other}>
                <SideCard
                    className="toc-default-layer-head"
                    preview={<div style={{display: 'flex'}}>
                        {grab}
                        {this.renderVisibility()}
                    </div>}
                    title={<Title tooltip={this.props.titleTooltip} filterText={this.props.filterText} node={this.props.node} currentLocale={this.props.currentLocale} onClick={this.props.onSelect} onContextMenu={this.props.onContextMenu}/>}
                    tools={<div style={{display: 'flex'}}>
                        {this.props.node.timeOptions && <Glyphicon glyph="calendar" tooltipPosition="bottom" tooltip="Supported date filter" style={{cursor: 'default'}}/>}
                        {this.props.node.loading ? <div className="toc-inline-loader"></div> : this.renderToolsLegend(isEmpty)}
                    </div>}
                    size="sm"
                    style={{transform: 'unset', boxShadow: 'none', padding: 0, overflow: 'visible'}}
                    body={
                        this.props.node.expanded || this.props.node.loadingError ? null : <Slider start={[layerOpacity]}
                        disabled={!this.props.node.visibility}
                        range={{min: 0, max: 100}}
                        format={{
                            from: value => Math.round(value),
                            to: value => Math.round(value) + ' %'
                        }}
                        onChange={(opacity) => {
                            if (isArray(opacity) && opacity[0]) {
                                this.props.onUpdateNode(this.props.node.id, 'layers', {opacity: parseFloat(opacity[0].replace(' %', '')) / 100});
                            }
                        }}/>
                    }/>
                {isEmpty ? null : this.renderCollapsible()}
            </Node>
        );
    }

    render() {
        let {children, propertiesChangeHandler, onToggle, ...other } = this.props;

        const hide = !this.props.node.visibility || this.props.node.invalid ? ' visibility' : '';
        const selected = this.props.selectedNodes.filter((s) => s === this.props.node.id).length > 0 ? ' selected' : '';
        const error = this.props.node.loadingError === 'Error' ? ' layer-error' : '';
        const warning = this.props.node.loadingError === 'Warning' ? ' layer-warning' : '';
        const grab = other.isDraggable ? <LayersTool key="grabTool" tooltip="toc.grabLayerIcon" className="toc-grab" ref="target" glyph="menu-hamburger"/> : <span className="toc-layer-tool toc-grab"/>;
        const filteredNode = this.filterLayers(this.props.node) ? this.renderNode(grab, hide, selected, error, warning, other) : null;

        return !this.props.filterText ? this.renderNode(grab, hide, selected, error, warning, other) : filteredNode;
    }
    getTitle = (layer) => {
        const translation = isObject(layer.title) ? layer.title[this.props.currentLocale] || layer.title.default : layer.title;
        return translation || layer.name;
    }
    filterLayers = (layer) => {
        const translation = isObject(layer.title) ? layer.title[this.props.currentLocale] || layer.title.default : layer.title;
        const title = translation || layer.name;
        return title.toLowerCase().includes(this.props.filterText.toLowerCase());
    }
}

module.exports = DefaultLayer;
