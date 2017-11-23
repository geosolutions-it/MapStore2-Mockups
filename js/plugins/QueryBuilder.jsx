/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const SwitchPanel = require('../components/SwitchPanel');
const {Button, Glyphicon, Row, Col, Modal} = require('react-bootstrap');
const Combobox = require('react-widgets').Combobox;
const {setOption} = require('../actions/mockups');
const {createSelector} = require('reselect');
const {connect} = require('react-redux');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const ConditionsGroup = require('../components/ConditionsGroup');

class QueryBuilder extends React.Component {
    static propTypes = {
        onChange: PropTypes.func
    };

    static defaultProps = {
        onChange: () => {}
    };

    state = {
        geometryType: 'Viewport',
        geometryOperation: 'Intersect',
        layerSelected: 'WATER AREA',
        geometryOperationLayer: 'Intersect',
        viewportFilter: true,
        selectLayer: true,
        conditions: []
    }

    renderHeader() {
        return (
            <div className="m-header">
                <div className="mapstore-block-width">
                    <Button className="square-button pull-left no-border"><Glyphicon glyph="arrow-left"/></Button>
                    <Button className="square-button pull-right no-border"><Glyphicon glyph="filter"/></Button>
                </div>
                <div className="mapstore-block-width text-center">
                    <Toolbar
                        btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                        buttons={[{
                            glyph: 'clear-filter',
                            tooltip: 'Reset all filters',
                            visible: this.state.conditions.length > 0
                            || this.state.layerFilter
                            || this.state.geometryFilter
                            || this.state.viewportFilter
                            || this.state.selectLayer,
                            onClick: () => {
                                this.setState({
                                    layerFilter: false,
                                    geometryFilter: false,
                                    viewportFilter: false,
                                    geometryType: '',
                                    geometryOperation: '',
                                    selectLayer: false,
                                    layerSelected: '',
                                    geometryOperationLayer: '',
                                    conditions: []
                                });
                            }
                        }, {
                            glyph: 'search',
                            tooltip: 'Search'
                        }]}/>
                </div>
            </div>
        );
    }

    renderFooter() {
        return (
            <div className="m-footer">
                <div className="mapstore-block-width"></div>
            </div>
        );
    }

    render() {
        return (
            <div className="mapstore-query-builder">
                <BorderLayout
                    header={this.renderHeader()}
                    footer={this.renderFooter()}>
                    <SwitchPanel
                        onSwitch={() => {
                            this.setState({
                                conditions: []
                            });
                        }}
                        title={'Attribute Filter'}
                        buttons={[{
                            tooltip: 'Reset filter',
                            onClick: () => {
                                this.setState({
                                    conditions: []
                                });
                            },
                            visible: this.state.conditions && this.state.conditions.length > 0,
                            glyph: 'clear-filter'
                        }, {
                            tooltip: 'How to use',
                            glyph: 'question-sign'
                        }]}>
                        <ConditionsGroup
                            components={this.state.conditions}
                            onChange={conditions => {
                                this.setState({
                                    conditions
                                });
                            }}/>
                    </SwitchPanel>
                    <SwitchPanel
                        onSwitch={() => {
                            this.setState({
                                layerFilter: false,
                                geometryFilter: false,
                                viewportFilter: false,
                                geometryType: '',
                                geometryOperation: ''
                            });
                            this.props.onChange('region', '');
                        }}
                        buttons={[{
                            tooltip: 'Reset filter',
                            onClick: () => {
                                this.setState({
                                    layerFilter: false,
                                    geometryFilter: false,
                                    viewportFilter: false,
                                    geometryType: '',
                                    geometryOperation: ''
                                });
                                this.props.onChange('region', '');
                            },
                            visible: (this.state.geometryFilter || this.state.layerFilter || this.state.viewportFilter),
                            glyph: 'clear-filter'
                        }, {
                            tooltip: 'How to use',
                            glyph: 'question-sign'
                        }]}
                        title={'Region of Interest'}>
                        <div className="mapstore-block-width">
                            <Row>
                                <Col xs={6}>
                                    <div className="m-label">Type:</div>
                                </Col>
                                <Col xs={6}>
                                    <Combobox
                                        value={this.state.geometryType || ""}
                                        filter="contains"
                                        data={['Viewport', 'Rectangle', 'Circle', 'Polygon', 'Regions']}
                                        placeholder="Select Type"
                                        onChange={(value) => {

                                            if (value === 'Regions') {
                                                this.setState({
                                                    layerFilter: true,
                                                    geometryFilter: false,
                                                    viewportFilter: false,
                                                    geometryType: value
                                                });
                                            } else if (value === 'Viewport') {
                                                this.setState({
                                                    layerFilter: false,
                                                    geometryFilter: false,
                                                    viewportFilter: true,
                                                    geometryType: value
                                                });
                                                this.props.onChange('region', '');
                                            } else if (value === 'Rectangle'
                                            || value === 'Circle'
                                            || value === 'Polygon') {
                                                this.setState({
                                                    layerFilter: false,
                                                    geometryFilter: true,
                                                    viewportFilter: false,
                                                    geometryType: value
                                                });
                                                this.props.onChange('region', '');
                                            } else {
                                                this.setState({
                                                    layerFilter: false,
                                                    geometryFilter: false,
                                                    viewportFilter: false,
                                                    geometryType: value
                                                });
                                                this.props.onChange('region', '');
                                            }
                                        }}/>
                                </Col>
                            </Row>
                        </div>
                        {this.state.layerFilter && <div className="mapstore-block-width">
                            <Row>
                                <Col xs={6}>
                                    <div className="m-label">Regions:</div>
                                </Col>
                                <Col xs={6}>
                                    <Combobox value={this.state.regions || ''} data={[
                                            'Abruzzo',
                                            'Basilicata',
                                            'Calabria',
                                            'Campania',
                                            'Emilia-Romagna',
                                            'Friuli Venezia Giulia',
                                            'Lazio',
                                            'Liguria',
                                            'Lombardia',
                                            'Marche',
                                            'Molise',
                                            'Piemonte',
                                            'Puglia',
                                            'Sardegna',
                                            'Sicilia',
                                            'Toscana',
                                            'Trentino-Alto Adige',
                                            'Umbria',
                                            "Valle d'Aosta",
                                            'Veneto'
                                        ]} placeholder="Select Geometry"
                                        filter="contains"
                                        onChange={regions => {
                                            this.setState({
                                                regions
                                            });
                                            this.props.onChange('region', regions);
                                            this.setState({
                                                showModal: true
                                            });
                                        }}/>
                                </Col>
                            </Row>
                        </div>}
                        <div className="mapstore-block-width">
                            <Row>
                                <Col xs={6}>
                                    <div className="m-label">Operation:</div>
                                </Col>
                                <Col xs={6}>
                                    <Combobox
                                        value={this.state.geometryOperation || ''}
                                        filter="contains"
                                        data={['Intersect', 'BoundingBox', 'Is Contained', 'Contains']}
                                        placeholder="Select Operation"
                                        onChange={geometryOperation => {
                                            this.setState({
                                                geometryOperation
                                            });

                                        }}/>
                                </Col>
                            </Row>
                        </div>
                        {this.state.geometryFilter && <div className="mapstore-block-width text-center">
                            <Row>
                                <div className="m-label m-caption">Draw the region of interest on the map</div>
                            </Row>

                        </div>}
                    </SwitchPanel>
                    <SwitchPanel
                        onSwitch={() => {
                            this.setState({
                                selectLayer: false,
                                layerSelected: '',
                                geometryOperationLayer: ''
                            });
                        }}
                        buttons={[{
                            tooltip: 'Reset filter',
                            onClick: () => {
                                this.setState({
                                    selectLayer: false,
                                    layerSelected: '',
                                    geometryOperationLayer: ''
                                });
                            },
                            visible: this.state.selectLayer,
                            glyph: 'clear-filter'
                        }, {
                            tooltip: 'How to use',
                            glyph: 'question-sign'
                        }]}
                        title={'Layer Filter'}>
                        <div className="mapstore-block-width">
                            <Row>
                                <Col xs={6}>
                                    <div className="m-label">Layer:</div>
                                </Col>
                                <Col xs={6}>
                                    <Combobox value={this.state.layerSelected || ''} data={[
                                            'Water Areas',
                                            'Buildings'
                                        ]} placeholder="Select Layer"
                                        filter="contains"
                                        onChange={layerSelected => {
                                            this.setState({
                                                layerSelected,
                                                selectLayer: true
                                            });
                                        }}/>
                                </Col>
                            </Row>
                        </div>
                        <div className="mapstore-block-width">
                            <Row>
                                <Col xs={6}>
                                    <div className="m-label">Operation:</div>
                                </Col>
                                <Col xs={6}>
                                    <Combobox
                                        value={this.state.geometryOperationLayer || ''}
                                        filter="contains"
                                        data={['Intersect', 'BoundingBox', 'Is Contained', 'Contains']}
                                        placeholder="Select Operation"
                                        onChange={geometryOperationLayer => {
                                            this.setState({
                                                geometryOperationLayer
                                            });
                                        }}/>
                                </Col>
                            </Row>
                        </div>
                        {this.state.selectLayer && <ConditionsGroup onlyRows/>}
                    </SwitchPanel>
                </BorderLayout>

                <Modal className="m-modal-info" bsSize="large" aria-labelledby="contained-modal-title-lg" show={this.state.showModal && !this.state.lockModal}>
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-lg">Mockups info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Add label of selected region on map</p>
                        <p className="text-danger"><strong>Don't add this modal to query builder</strong></p>
                        <img src={require('../../assets/img/toscana.png')}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {
                            this.setState({
                                showModal: false,
                                lockModal: true
                            });
                        }}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const selector = createSelector([], () => ({}));

const QueryBuilderPlugin = connect(
    selector, {
        onChange: setOption
    }
)(QueryBuilder);

module.exports = {
    QueryBuilderPlugin
};
