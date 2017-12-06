/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const TOC = require('../../../MapStore2/web/client/components/TOC/TOC');
const BorderLayout = require('../../../MapStore2/web/client/components/layout/BorderLayout');
const DefaultGroup = require('../../../MapStore2/web/client/components/TOC/DefaultGroup');
const DefaultLayer = require('../../../MapStore2/web/client/components/TOC/DefaultLayer');
const DefaultLayerOrGroup = require('../../../MapStore2/web/client/components/TOC/DefaultLayerOrGroup');
const {Grid, Row, Col} = require('react-bootstrap');

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
class TOCDashboard extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        filter: PropTypes.func,
        nodes: PropTypes.array,
        id: PropTypes.string,
        onSort: PropTypes.func,
        activateOpacityTool: PropTypes.bool,
        onSelect: PropTypes.func,
        selectedNodes: PropTypes.array,
        type: PropTypes.string,
        activateLegendTool: PropTypes.bool,
        empty: PropTypes.bool,
        onAdd: PropTypes.func
    };

    static defaultProps = {
        onClick: () => {},
        activateOpacityTool: true,
        onSelect: () => {},
        selectedNodes: [],
        type: '',
        activateLegendTool: true,
        onAdd: () => {}
    };
    getDefaultGroup = () => {
        return (
            <DefaultGroup visibility groupVisibilityCheckbox />);
    }
    getDefaultLayer = () => {

        return (
            <DefaultLayer selectedNodes={this.props.selectedNodes} onSelect={(s) => { this.props.onSelect(s); }} activateLegendTool={this.props.activateLegendTool} activateOpacityTool={this.props.activateOpacityTool} />);
    }

    render = () => {
        const Group = this.getDefaultGroup();
        const Layer = this.getDefaultLayer();

        return (
            <div key="ms-dashboard-sources" className="ms-vertical-side with-toc">
                <BorderLayout
                    header={
                        <div className="ms-header-side">
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                                        {<div className="m-title-side">Edit Map</div>}
                                    </Col>
                                    <Col xs={12} className="text-center">
                                        <Toolbar
                                            btnDefaultProps={{ bsSize: 'sm', bsStyle: 'primary'}}
                                            buttons={[
                                                {
                                                    visible: this.props.selectedNodes.length === 0 && this.props.type === 'map',
                                                    text: 'Add new layer',
                                                    onClick: () => {
                                                        this.props.onAdd();
                                                    }
                                                },
                                                /* {
                                                    visible: this.props.selectedNodes.length === 1,
                                                    glyph: 'stats',
                                                    tooltip: 'Add new charts from selected layer',
                                                    onClick: () => {
                                                        this.props.onClick('chart');
                                                    }
                                                },
                                                {
                                                    visible: this.props.selectedNodes.length === 1,
                                                    glyph: 'features-grid',
                                                    tooltip: 'Add new charts from selected layer',
                                                    onClick: () => {
                                                        this.props.onClick('table');
                                                    }
                                                },
                                                {
                                                    visible: this.props.selectedNodes.length > 0,
                                                    glyph: 'list',
                                                    tooltip: 'Add new legend from selected layers',
                                                    onClick: () => {
                                                        this.props.onClick('legend');
                                                    }
                                                },*/
                                                {
                                                    visible: this.props.selectedNodes.length > 0,
                                                    glyph: 'trash',
                                                    tooltip: 'Remove selected layers',
                                                    onClick: () => {

                                                    }
                                                }
                                            ]}/>
                                    </Col>
                                </Row>
                            </Grid>

                        </div>}>
                        <TOC filter={() => true} nodes={emptyData(this.props.nodes)}>
                            <DefaultLayerOrGroup groupElement={Group} layerElement={Layer}/>
                        </TOC>
                </BorderLayout>
            </div>
        );
    }
}

module.exports = TOCDashboard;
