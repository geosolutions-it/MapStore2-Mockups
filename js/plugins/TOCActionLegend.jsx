/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Dock = require('react-dock').default;

const emptyData = (nodes) => [
    {
        name: "Default",
        title: "Default",
        showComponent: true,
        loadingError: '',
        visibility: true,
        nodes
    }
];
const TOC = require('../../MapStore2/web/client/components/TOC/TOC');
const DefaultGroup = require('../../MapStore2/web/client/components/TOC/DefaultGroup');
const DefaultLayer = require('../../MapStore2/web/client/components/TOC/DefaultLayer');
const DefaultLayerOrGroup = require('../../MapStore2/web/client/components/TOC/DefaultLayerOrGroup');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const Filter = require('../../MapStore2/web/client/components/misc/Filter');
const {Grid, Row, Col, Glyphicon, Button} = require('react-bootstrap');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const ActionLegend = require('../components/ActionLegend');

class TOCActionLegendPlugin extends React.Component {

    static propTypes = {
        nodes: PropTypes.array
    };

    static defaultProps = {
        nodes: [{
            name: 'italy:regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            synced: false
        }, {
            name: 'regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: true
        }, {
            name: 'regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: false
        }]
    };

    state = {
        show: false,
        nodes: [{
            id: 'layer:01',
            name: 'italy:regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: true,
            synced: false
        }, {
            id: 'layer:02',
            name: 'USA Population',
            title: 'USA Population',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: true
        }, {
            id: 'layer:03',
            name: 'Unesco Items',
            title: 'Unesco Items',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: false
        }, {
            id: 'layer:04',
            name: 'Layer empty',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: false,
            loadingError: 'Error'
        }]
    };

    getDefaultGroup = () => {
        return (
            <DefaultGroup visibility groupVisibilityCheckbox />);
    }
    getDefaultLayer = () => {

        return (
            <DefaultLayer
                onToggle={(id, expanded) => {
                    this.setState({
                        nodes: this.state.nodes.map(node => {
                            return node.id === id ? {...node, expanded: !expanded} : {...node};
                        })
                    });
                }}
                activateLegendTool
                activateOpacityTool />);
    }

    /*
    selectedNodes={this.props.selectedNodes}
    onSelect={(s) => { this.props.onSelect(s); }}
    */
    renderHeader() {
        return (
            <Grid fluid style={{margin: 0}} className="ms-toc-header">
                <Row>
                    <Col xs={12}>
                        <Glyphicon glyph="1-close" style={{cursor: 'pointer'}} onClick={() => {
                            this.setState({
                                show: false
                            });
                        }}/>
                        <Glyphicon glyph="1-layer"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="text-center text-primary">
                        <h5><strong><Glyphicon glyph="1-map"/>&nbsp;Map Title</strong></h5>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Filter filterPlaceholder="Layer filter"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="text-center">
                        <Toolbar
                            buttons={[
                                {
                                    text: 'Add Layer',
                                    bsStyle: 'primary',
                                    bsSize: 'sm'
                                }
                            ]}/>
                    </Col>
                </Row>
            </Grid>
        );
    }

    render() {
        const dockProps = {
            dimMode: "none",
            size: 0.30,
            fluid: false,
            position: "left",
            zIndex: 1030
        };
        const Group = this.getDefaultGroup();
        const Layer = this.getDefaultLayer();
        return this.state.show ? (
            <Dock dockStyle={{height: 'calc(100% - 30px)'}} {...dockProps} isVisible size={300} >
                <BorderLayout
                    header={
                        this.renderHeader()
                    }>
                    <TOC filter={() => true} nodes={emptyData(this.state.nodes)}>
                        <DefaultLayerOrGroup groupElement={Group} layerElement={Layer}/>
                    </TOC>
                </BorderLayout>
            </Dock>
        ) : (
            <div >
                <Button id="drawer-menu-button" style={{position: 'absolute'}} bsStyle="primary" className="square-button" onClick={() => {
                    this.setState({
                        show: true
                    });
                }}>
                    <Glyphicon glyph="1-layer"/>
                </Button>
                <ActionLegend
                    layers={this.state.nodes}
                    onChange={(id, key, value) => {
                        this.setState({
                            nodes: this.state.nodes.map(layer => layer.id === id ? {...layer, [key]: value} : {...layer} )
                        });
                    }}/>
            </div>
        );
    }
}

module.exports = {
    TOCActionLegendPlugin
};
