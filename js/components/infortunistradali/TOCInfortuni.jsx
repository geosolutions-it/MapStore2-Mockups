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
const TOC = require('../../../MapStore2/web/client/components/TOC/TOC');
const DefaultGroup = require('../../../MapStore2/web/client/components/TOC/DefaultGroup');
const DefaultLayer = require('../../../MapStore2/web/client/components/TOC/DefaultLayer');
const DefaultLayerOrGroup = require('../../../MapStore2/web/client/components/TOC/DefaultLayerOrGroup');
const BorderLayout = require('../../../MapStore2/web/client/components/layout/BorderLayout');
const Filter = require('../../../MapStore2/web/client/components/misc/Filter');
const {Grid, Row, Col, Glyphicon} = require('react-bootstrap');
const Toolbar = require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar');

const legendsImg = {
    'layer:01': require('../../plugins/dashboard/img/legend-r.png'),
    'layer:02': require('../../../assets/img/usa-legend.png'),
    'layer:03': require('../../../assets/img/unesco-legend.png')
};

class TOCTimeFilter extends React.Component {

    static propTypes = {
        show: PropTypes.bool,
        nodes: PropTypes.array,
        onClickDate: PropTypes.func,
        onClose: PropTypes.func,
        filterFunction: PropTypes.func,
        buttons: PropTypes.array
    };

    static defaultProps = {
        nodes: [{
            name: 'italy:regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            synced: false
        }],
        onClickDate: () => {},
        filterFunction: () => true,
        onClose: () => {}
    };

    state = {
        show: false,
        legendExpanded: true,
        nodes: [{
            id: 'layer:01',
            name: 'italy:regions',
            title: 'Regions',
            group: 'Default',
            visibility: true,
            expanded: true,
            synced: false,
            legendSrc: legendsImg['layer:01'],
            // mock
            timeOptions: true
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
                onUpdateNode={(id, noedTpe, obj) => {
                    this.setState({
                        nodes: this.state.nodes.map(node => {
                            return node.id === id ? {...node, ...obj} : {...node};
                        })
                    });
                }}
                activateLegendTool
                activateOpacityTool />);
    }

    renderHeader() {
        return (
            <Grid fluid style={{margin: 0}} className="ms-toc-header">
                <Row>
                    <Col xs={12}>
                        <Glyphicon glyph="1-close" style={{cursor: 'pointer'}} onClick={() => this.props.onClose()}/>
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
                            btnDefaultProps={{
                                className: 'square-button-md',
                                bsStyle: 'primary'
                            }}
                            buttons={[
                                {
                                    glyph: 'plus',
                                    tooltip: 'Add layer'
                                },
                                ...(this.props.buttons || [])
                                /*,
                                {
                                    glyph: 'calendar',
                                    tooltip: 'Filter layers by date',
                                    onClick: () => this.props.onClickDate()
                                }*/
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
            <Dock dockStyle={{height: 'calc(100% - 30px)', pointerEvents: 'auto'}} {...dockProps} isVisible={this.props.show} size={300} >
                <BorderLayout
                    header={
                        this.renderHeader()
                    }>
                    <TOC filter={() => true} nodes={emptyData(this.state.nodes.filter(this.props.filterFunction))}>
                        <DefaultLayerOrGroup groupElement={Group} layerElement={Layer}/>
                    </TOC>
                </BorderLayout>
            </Dock>
        );
    }
}

module.exports = TOCTimeFilter;
