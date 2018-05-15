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
const TOC = require('../../old_ms2_226bfec4/web/client/components/TOC/TOC');
const DefaultGroup = require('../../old_ms2_226bfec4/web/client/components/TOC/DefaultGroup');
const DefaultLayer = require('../components/DefaultLayer');
const DefaultLayerOrGroup = require('../../old_ms2_226bfec4/web/client/components/TOC/DefaultLayerOrGroup');
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const Filter = require('../../old_ms2_226bfec4/web/client/components/misc/Filter');
const {Grid, Row, Col, Glyphicon} = require('react-bootstrap');
const Toolbar = require('../../old_ms2_226bfec4/web/client/components/misc/toolbar/Toolbar');

class TOCPlugin extends React.Component {

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
            name: 'regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: true
        }, {
            id: 'layer:03',
            name: 'regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: false,
            synced: false
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
                        <Glyphicon glyph="1-close"/>
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
        return (
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
        );
    }
}

module.exports = {
    TOCPlugin
};
