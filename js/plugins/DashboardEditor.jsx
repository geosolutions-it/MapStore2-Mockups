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
const {head} = require('lodash');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const emptyState = require('../../MapStore2/web/client/components/misc/enhancers/emptyState');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
const ResizableModal = require('../components/ResizableModal');
const {Table, Glyphicon, Grid, Row, Col, Pagination} = require('react-bootstrap');
const ItalyMap = require('../components/ItalyMap');
const ReactGridLayout = require('react-grid-layout');
const Thumbnail = require('../../MapStore2/web/client/components/maps/forms/Thumbnail');
const Metadata = require('../../MapStore2/web/client/components/maps/forms/Metadata');
const ContainerDimensions = require('react-container-dimensions').default;

const sampleData = require('../../MapStore2/web/client/components/widgets/enhancers/sampleChartData');
const SampleChart = sampleData(require('../../MapStore2/web/client/components/charts/SimpleChart'));

const {wizardHanlders} = require('../../MapStore2/web/client/components/misc/wizard/enhancers');
const Wizard = wizardHanlders(require('../../MapStore2/web/client/components/misc/wizard/WizardContainer'));
require('react-quill/dist/quill.snow.css');

const Sources = require('./dashboard/Sources');
const Types = require('./dashboard/Types');
const TOC = require('./dashboard/TOC');
const Builder = require('./dashboard/Builder');
const Catalog = require('./dashboard/Catalog');
const Template = require('./dashboard/Template');

const pages = {
    types: 0,
    sources: 1,
    toc: 2,
    builder: 3,
    catalog: 4,
    overlay: 5,
    template: 5
};

const mockLayer = {
    group: 'Default',
    visibility: true
};

const LayoutComponent = ({ readOnly, isEditing, isDraggable, isResizable, connectingMaps, selectedCards, currentEdit = {}, cards = [], onLayoutChange = () => {}, onResizeStop = () => {}, onClick = () => {}, renderCard = () => {}, onMouseEnter = () => {}, onMouseUp = () => {} }) =>
    <div className={"ms-dashboard-body-container" + (isEditing ? ' ms-edit' : '')}>
        <ContainerDimensions>
            { ({width}) =>

    <ReactGridLayout
        width={width - 20}
        className="ms-dashboard-layout"
        rowHeight={104}
        cols={12}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={onLayoutChange}
        onResizeStop={onResizeStop}>
        {cards.map((c) => {
            const edit = selectedCards.length === 1 && isEditing && ' ms-edit' || '';
            const selected = head(selectedCards.filter(s => s.id === c.id)) && ' ms-selected' + edit || '';
            const connectMaps = connectingMaps && c.type !== 'map' && ' ms-hide' || '';
            const hideEdit = edit && !connectingMaps && !head(selectedCards.filter(s => s.id === c.id)) && ' ms-hide' || '';
            const selectedMap = currentEdit && currentEdit.selectedMap && currentEdit.selectedMap.id === c.id && ' ms-selected' || '';
            return (
                <div
                    data-grid={{...c}}
                    key={c.id}
                    className={'ms-dashboard-card' + selected + connectMaps + selectedMap + hideEdit}
                    onClick={e => { onClick(e, c, selected); }}>

                    <div className={"ms-dashboard-card-container" + (readOnly && ' ms-read-only' || '') + (readOnly && c.type === 'map' && ' ms-with-map' || '')}>
                        {renderCard(c)}
                    </div>
                    {isDraggable && <div className="ms-grab grabbable" onMouseEnter={onMouseEnter} onMouseUp={onMouseUp}>
                        <Glyphicon glyph="menu-hamburger"/>
                    </div>}
                </div>);
        })}
    </ReactGridLayout>
    }
    </ContainerDimensions>
</div>;

const Layout = emptyState(({cards=[]}) => cards.length === 0, { glyph: 'dashboard' })(LayoutComponent);

const mockDashboard = require('./dashboard/mockDashboard');

let count = 0;
class DashboardEditorPlugin extends React.Component {

    static propTypes = {
        buttons: PropTypes.array,
        transitionProps: PropTypes.object,
        readOnly: PropTypes.bool
    };

    static defaultProps = {
        buttons: [],
        readOnly: false,
        transitionProps: {
            transitionName: "dashboard-panel-transition",
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        }
    };

    state = {
        cards: [],
        selectedCards: [],
        step: -1,
        stop: true,
        selectedNodes: [],
        isDraggable: false,
        isResizable: true,
        chartType: 'bar',
        selectedMapCard: []
    };

    componentWillMount() {
        if (this.props.readOnly) {
            this.setState({
                cards: mockDashboard
            });
        }
    }

    renderLeftColumn() {

        const buttons = [{
            glyph: 'plus',
            tooltip: 'Add a dashboard card',
            bsStyle: 'primary',
            tooltipPosition: 'right',
            visible: this.state.step === -1 && this.state.selectedCards.length === 0 && !this.props.readOnly,
            onClick: () => {
                this.setState({
                    step: 0,
                    stop: false,
                    selectedNodes: []
                });
            }
        }, /*, {
            glyph: 'th-large',
            tooltip: 'Start from a template',
            bsStyle: 'primary',
            tooltipPosition: 'right',
            visible: this.state.step === -1 && this.state.selectedCards.length === 0 && this.state.cards.length === 0,
            onClick: () => {
                this.setState({
                    step: pages.template,
                    stop: false,
                    selectedNodes: []
                });
            }
        }, */ {
            glyph: 'dashboard-save',
            tooltip: 'Save dashboard',
            bsStyle: !this.state.openSideLeft ? 'primary' : 'success',
            tooltipPosition: 'right',
            visible: this.state.step === -1 && this.state.selectedCards.length === 0 && this.state.cards.length > 0 && !this.props.readOnly,
            onClick: () => {
                this.setState({
                    showSaveModal: true
                });
            }
        }, {
            glyph: '1-close',
            tooltip: 'Close edit',
            bsStyle: 'primary',
            tooltipPosition: 'right',
            visible: !!this.state.edit && !this.state.connectingMaps,
            onClick: () => {
                this.setState({
                    showNoSavedChanges: true
                });
            }
        }, {
            glyph: 'floppy-disk',
            tooltip: 'Save your changes',
            bsStyle: 'primary',
            tooltipPosition: 'right',
            visible: !!this.state.edit && !this.state.connectingMaps,
            onClick: () => {
                this.setState({
                    step: -1,
                    edit: false,
                    stop: true,
                    selectedCards: [],
                    selectedNodes: [],
                    currentEdit: {},
                    cards: this.state.cards.map(c => c.id === this.state.currentEdit.id && {...c, ...this.state.currentEdit} || {...c} ),
                    connectingMaps: false
                });
            }
        }, {
            glyph: 'pencil',
            tooltip: 'Add a dashboard card',
            tooltipPosition: 'right',
            visible: this.state.selectedCards.length === 1 && this.state.selectedCards[0].type !== 'none' && !this.state.edit,
            onClick: () => {
                if (this.state.selectedCards[0].type === 'map') {
                    this.setState({
                        step: pages.toc,
                        edit: true,
                        currentEdit: {...this.state.selectedCards[0]},
                        statusEdit: 'edit'
                    });
                } else {
                    this.setState({
                        step: pages.builder,
                        edit: true,
                        currentEdit: {...this.state.selectedCards[0]},
                        statusEdit: 'edit'
                    });
                }
            }
        }, {
            glyph: 'trash',
            tooltip: 'Add a dashboard card',
            tooltipPosition: 'right',
            visible: this.state.selectedCards.length > 0 && !this.state.edit,
            onClick: () => {
                this.setState({
                    cards: this.state.cards.filter(c => !head(this.state.selectedCards.filter(s => s.id === c.id))),
                    selectedCards: [],
                    step: -1,
                    stop: true,
                    selectedNodes: []
                });
            }
        }];
        return (
            <div key="ms-v-bar" className="ms-vertical-toolbar" style={{order: -1}}>
                <Toolbar btnGroupProps={{vertical: true}} btnDefaultProps={{ className: 'square-button', bsStyle: 'primary'}} buttons={buttons}/>
            </div>
        );
    }

    renderMapCard(c) {
        return (
            <ContainerDimensions>
                { ({width, height}) => <ItalyMap region={c.nodes && c.nodes.length > 0 ? 'all' : 'none'} width={width} height={height}/> }
            </ContainerDimensions>
        );
    }

    renderTable() {
        return (
            <BorderLayout
                header={
                    <Grid fluid>
                        <Row>
                            <Col xs={12} className="text-center">
                                <h4>Layer Name</h4>
                            </Col>
                        </Row>
                    </Grid>
                }
                footer={
                    <Grid fluid className="text-center">
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            items={3}
                            disabled
                            maxButtons={5}
                          />
                    </Grid>
                }>
                <Table>
                    <thead>
                      <tr>
                        <th>STATE_NAME</th>
                        <th>STATE_FIPS</th>
                        <th>SUB_REGION</th>
                        <th>STATE_ABBR</th>
                        <th>LAND_KM</th>
                        <th>WATER_KM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>District of Columbia</td>
                        <td>11</td>
                        <td>S Atl</td>
                        <td>DC</td>
                        <td>159.055</td>
                        <td>17.991</td>
                      </tr>
                      <tr>
                        <td>Rhode Island</td>
                        <td>44</td>
                        <td>N Eng</td>
                        <td>RI</td>
                        <td>2706.52</td>
                        <td>538.056</td>
                      </tr>
                      <tr>
                        <td>Delaware</td>
                        <td>10</td>
                        <td>S Atl</td>
                        <td>DE</td>
                        <td>5062.456</td>
                        <td>1385.022</td>
                      </tr>
                    </tbody>
                  </Table>
              </BorderLayout>
          );
    }

    renderChartCard(card) {
        return (
            <ContainerDimensions>
                { ({width, height}) => <SampleChart width={width} height={height} type={card.chartType} legend={false} /> }
            </ContainerDimensions>
        );
    }

    renderCard(c) {

        const card = this.state.currentEdit && c.id === this.state.currentEdit.id && this.state.currentEdit || c;

        switch (card.type) {
            case 'map':
            return this.renderMapCard(card);
            case 'table':
            return this.renderTable(card);
            case 'chart':
            return this.renderChartCard(card);
            case 'legend':
            return <div style={{display: 'flex', height: '100%'}}>{card.isConnected && <div style={{margin: 'auto'}}><div>Layer Name</div><img src={require('./dashboard/img/legend.png')}/></div>}</div>;
            default:
            return card.text && <div className="ms-dashboard-text ql-editor" dangerouslySetInnerHTML={{__html: card.text}} /> || '';
        }
    }

    renderColumnsPanel() {
        return this.state.step > -1 ? (
            <div style={{order: -1}} className="ms-dashboard-wizard">
                <Wizard
                    step={this.state.step}
                    setPage={() => 0}
                    onFinish={() => {}}
                    isStepValid={ () => true} hideButtons>

                    <Types key="dashboard-types"
                        maps={this.state.cards.filter(c => c.type === 'map')}
                        onBack={() => {
                            this.setState({
                                step: -1
                            });
                        }}
                        onClick={(s) => {
                            if (s.type === 'text') {
                                this.setState({
                                    cards: [...this.state.cards, {id: 'db' + count, type: s.type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                    step: pages.builder,
                                    selectedCards: [{id: 'db' + count, type: s.type }],
                                    stop: true,
                                    edit: true,
                                    currentType: s.type,
                                    statusEdit: 'create',
                                    currentEdit: {id: 'db' + count, i: 'db' + count, type: s.type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }
                                });
                                count++;
                            } else if (s.type === 'map') {
                                this.setState({
                                    step: pages.sources,
                                    currentType: s.type
                                });
                            } else if (s.type === 'legend') {

                                this.setState({
                                    connectingMaps: true,
                                    cards: [...this.state.cards, {id: 'db' + count, type: s.type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                    step: pages.builder,
                                    selectedCards: [{id: 'db' + count, type: s.type }],
                                    stop: true,
                                    edit: true,
                                    currentType: s.type,
                                    statusEdit: 'create',
                                    currentEdit: {id: 'db' + count, i: 'db' + count, type: s.type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }
                                });
                                count++;
                            } else {
                                this.setState({
                                    step: pages.catalog,
                                    currentType: s.type
                                });
                            }
                        }}/>
                    <Sources key="dashboard-sources" onBack={() => { this.setState({ step: this.state.step - 1 }); }} onClick={(empty) => {
                        if (this.state.currentType === 'map') {
                            this.setState({
                                step: 2,
                                cards: [...this.state.cards, {id: 'db' + count, i: 'db' + count, type: this.state.currentType, empty, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                selectedCards: [{id: 'db' + count, type: this.state.currentType }],
                                stop: true,
                                edit: true,
                                emptyTOC: empty,
                                statusEdit: 'create',
                                currentEdit: {id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3, nodes: empty && [] || [{
                                    id: 'l:0',
                                    group: 'Default',
                                    name: 'Regions',
                                    visibility: true,
                                    expanded: true
                                }] }
                            });
                            count++;
                        } else {
                            this.setState({
                                step: 2
                            });
                        }

                    }}/>
                    <TOC key="dashboard-toc" nodes={this.state.currentEdit && this.state.currentEdit.nodes} empty={this.state.emptyTOC} type={this.state.currentEdit && this.state.currentEdit.type} activateOpacityTool={this.state.currentEdit && this.state.currentEdit.type === 'map'} activateLegendTool={this.state.currentEdit && this.state.currentEdit.type === 'map'} selectedNodes={this.state.selectedNodes} onSelect={(s) => {

                        this.setState({
                            selectedNodes: head(this.state.selectedNodes.filter(sN => sN === s)) ? [] : [s]
                        });

                    }} onClick={(type) => {
                        this.setState({
                            step: pages.builder,
                            cards: [...this.state.cards, {id: 'db' + count, i: 'db' + count, type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                            selectedCards: [{id: 'db' + count, type }],
                            stop: true,
                            edit: true,
                            currentType: type,
                            statusEdit: 'create',
                            currentEdit: {id: 'db' + count, i: 'db' + count, type, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }
                        });
                        count++;
                    }} onAdd={() => {
                        this.setState({
                            step: pages.catalog
                        });
                    }}/>
                <Builder statusEdit={this.state.statusEdit}
                    chartType={this.state.currentEdit && this.state.currentEdit.chartType}
                    maps={this.state.cards.filter(c => c.type === 'map')}
                    isConnected={this.state.currentEdit && this.state.currentEdit.isConnected}
                    connectingMaps={this.state.connectingMaps} text={this.state.currentEdit && this.state.currentEdit.text || ''}
                    key="dashboard-builder"
                    onClearConnection={() => {
                        this.setState({ currentEdit: {...this.state.currentEdit, selectedMap: null, isConnected: false}, connectingMaps: false});
                    }}
                    type={this.state.currentEdit && this.state.currentEdit.type || this.state.currentType}
                        onChange={(value) => {
                            this.setState({
                                currentEdit: {...this.state.currentEdit, text: value}
                            });
                        }}
                        onClick={() => {
                            this.setState({
                                connectingMaps: !this.state.connectingMaps
                            });
                        }}
                        onUpdate={(key, value) => {
                            if (key === 'type') {
                                this.setState({
                                    currentEdit: {...this.state.currentEdit, chartType: value}
                                });
                            }

                        }}/>
                    <Catalog
                        multiSelect={this.state.currentEdit && this.state.currentEdit.type === 'map'}
                        onClick={(dd) => {

                            if (this.state.currentEdit && this.state.currentEdit.type === 'map') {
                                this.setState({
                                    step: pages.toc,
                                    currentEdit: {...this.state.currentEdit, nodes: [...this.state.currentEdit.nodes, ...dd.map(d => ({...mockLayer, ...d}))]}
                                });
                            } else if (this.state.currentType === 'chart') {

                                this.setState({
                                    step: pages.builder,
                                    cards: [...this.state.cards, {id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                    selectedCards: [{id: 'db' + count, type: this.state.currentType }],
                                    stop: true,
                                    edit: true,
                                    statusEdit: 'create',
                                    currentEdit: {id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3, chartType: this.state.chartType, selectedMap: {} }
                                });
                                count++;
                            } else {

                                this.setState({
                                    step: pages.builder,
                                    cards: [...this.state.cards, {id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                    selectedCards: [{id: 'db' + count, type: this.state.currentType }],
                                    stop: true,
                                    edit: true,
                                    statusEdit: 'create',
                                    currentEdit: {id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }
                                });
                                count++;
                            }
                        }}
                        onBack={() => {
                            if (this.state.currentType === 'map') {
                                this.setState({
                                    step: pages.toc
                                });
                            } else {
                                this.setState({
                                    step: pages.types
                                });
                            }
                        }}/>
                    <Template
                        onBack={() => { this.setState({ step: -1 }); }}

                        />
                </Wizard>

            </div>
        ) : null;
    }

    render() {

        return (
            <div className="mapstore-body">
                <BorderLayout columns={!this.props.readOnly && [this.renderLeftColumn(), this.renderColumnsPanel()]}>
                    <Layout

                        cards={this.state.cards}
                        isEditing={this.state.edit}
                        readOnly={this.props.readOnly}
                        isDraggable={this.state.isDraggable && !this.props.readOnly}
                        isResizable={this.state.isResizable && !this.props.readOnly}
                        connectingMaps={this.state.connectingMaps && !this.props.readOnly}
                        selectedCards={this.state.selectedCards}
                        currentEdit={this.state.currentEdit}
                        onLayoutChange={(currentLayout, layout) => {
                            this.setState({
                                layout
                            });
                        }}
                        onResizeStop={() => {
                            this.setState({
                                resizing: true
                            });
                        }}
                        onClick={(e, c, selected) => {
                            if (!this.props.readOnly) {
                                if (!this.state.dragging && !this.state.resizing && !this.state.edit && !this.state.connectingMaps) {

                                    if (e.ctrlKey) {
                                        this.setState({ selectedCards: [...this.state.selectedCards, c], stop: true, edit: false});
                                    } else {

                                        if (selected) {
                                            this.setState({ selectedCards: [], stop: true, edit: false, step: -1});
                                        } else {
                                            this.setState({ selectedCards: [c], stop: true, edit: false});
                                        }


                                    }
                                } else {

                                    this.setState({
                                        dragging: false,
                                        resizing: false
                                    });
                                }

                                if (this.state.connectingMaps) {

                                    this.setState({ currentEdit: {...this.state.currentEdit, selectedMap: c, isConnected: true}, connectingMaps: false});

                                }
                            }

                        }}
                        renderCard={ (c) => { return this.renderCard(c); }}
                        onMouseEnter={() => { this.setState({ isDraggable: true }); }}
                        onMouseUp={() => { this.setState({ isDraggable: false }); }}
                        />
                </BorderLayout>
                <Portal>
                    <ResizableModal
                        title="Save Dashboard"
                        bodyClassName="ms-flex modal-properties-container"
                        show={this.state.showSaveModal}
                        size="sm"
                        onClose={() => {
                            this.setState({
                                showSaveModal: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'Close',
                                onClick: () => {
                                    this.setState({
                                        showSaveModal: false
                                    });
                                }
                            },
                            {
                                text: 'Save',
                                onClick: () => {
                                    this.setState({
                                        showSaveModal: false
                                    });
                                }
                            }
                        ]}>
                        <Grid fluid>
                            <Row>
                                <Col xs={12}>
                                    <Thumbnail map={{id: 0}}/>
                                </Col>
                                <Col xs={12}>
                                    <Metadata namePlaceholderText="Dashboard Name" descriptionPlaceholderText="Dashboard Description" />
                                </Col>
                            </Row>
                        </Grid>
                    </ResizableModal>
                </Portal>
                <Portal>
                    <ResizableModal
                        title={this.state.statusEdit === 'create' ? 'Exit Create Mode' : 'Exit Edit Mode'}
                        show={this.state.showNoSavedChanges}
                        bodyClassName="ms-flex ms-modal-alert-message"
                        size="sm"
                        onClose={() => {
                            this.setState({
                                showNoSavedChanges: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'No',
                                onClick: () => {
                                    this.setState({
                                        showNoSavedChanges: false
                                    });
                                }
                            },
                            {
                                text: 'Yes',
                                onClick: () => {
                                    if (this.state.statusEdit === 'create') {
                                        this.setState({
                                            step: -1,
                                            edit: false,
                                            stop: true,
                                            selectedCards: [],
                                            selectedNodes: [],
                                            currentEdit: {},
                                            statusEdit: 'none',
                                            cards: this.state.cards.filter(c => c.id !== this.state.currentEdit.id),
                                            connectingMaps: false,
                                            showNoSavedChanges: false
                                        });
                                    } else {
                                        this.setState({
                                            step: -1,
                                            edit: false,
                                            stop: true,
                                            selectedCards: [],
                                            selectedNodes: [],
                                            currentEdit: {},
                                            connectingMaps: false,
                                            showNoSavedChanges: false
                                        });
                                    }
                                }
                            }
                        ]}>
                        <Grid fluid>
                            <Row>
                                <Col xs={12}>
                                    {this.state.statusEdit === 'create' ?
                                        'Do you want to exit from create mode without save your new card?'
                                        :
                                        'Do you want to exit from edit mode without save your changes to the current card?'
                                    }
                                </Col>
                            </Row>
                            {this.state.statusEdit !== 'create' && <Row>
                                <Col xs={12} className="text-danger">
                                    <strong>Mockup Note: don't add this message</strong>
                                </Col>
                                <Col xs={12} className="text-danger">
                                    this modal should be displayed only if some changes has beeen added during the current edit session
                                </Col>
                            </Row>}
                        </Grid>
                    </ResizableModal>
                </Portal>
            </div>
        );
    }
}

module.exports = {
    DashboardEditorPlugin
};
