/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const {head} = require('lodash');
const Toolbar = require('../../old_ms2_226bfec4/web/client/components/misc/toolbar/Toolbar');
const emptyState = require('../../old_ms2_226bfec4/web/client/components/misc/enhancers/emptyState');
const Portal = require('../../old_ms2_226bfec4/web/client/components/misc/Portal');
const ResizableModal = require('../components/ResizableModal');
const {Table, Glyphicon, Grid, Row, Col, Pagination, DropdownButton, MenuItem, ButtonToolbar, Button} = require('react-bootstrap');
const ItalyMap = require('../components/ItalyMap');
const ReactGridLayout = require('react-grid-layout');
const Thumbnail = require('../../old_ms2_226bfec4/web/client/components/maps/forms/Thumbnail');
const Metadata = require('../../old_ms2_226bfec4/web/client/components/maps/forms/Metadata');
const ContainerDimensions = require('react-container-dimensions').default;
const tooltip = require('../../old_ms2_226bfec4/web/client/components/misc/enhancers/tooltip');
const ButtonT = tooltip(Button);
const italy = require('../../assets/json/italy.json');
const ChartView = require('../components/ChartView');

const dataAreaItaly = italy.features.map(ft => {
    return {name: ft.properties.name, area: ft.properties.area, pv: 2, amt: 2};
});

const dataLengthItaly = italy.features.map(ft => {
    return {name: ft.properties.name, length: ft.properties.length, pv: 2, amt: 2};
});

/*[
    {name: 'A', variable: 2, pv: 2, amt: 2},
    {name: 'B', variable: 0.5, pv: 0.5, amt: 0.5},
    {name: 'C', variable: 3, pv: 3, amt: 3},
    {name: 'D', variable: 1, pv: 1, amt: 2}
];*/
/*const series = [{dataKey: "variable", color: `#078aa3`}];
const xAxis = {dataKey: "name", show: false};*/

const sampleData = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/sampleChartData');
const SampleChart = sampleData(require('../../old_ms2_226bfec4/web/client/components/charts/SimpleChart'));

const {wizardHanlders} = require('../../old_ms2_226bfec4/web/client/components/misc/wizard/enhancers');
const Wizard = wizardHanlders(require('../../old_ms2_226bfec4/web/client/components/misc/wizard/WizardContainer'));
require('react-quill/dist/quill.snow.css');

const Sources = require('./dashboard/Sources');
const Types = require('./dashboard/Types');
const TOC = require('./dashboard/TOC');
const Builder = require('./dashboard/Builder');
const Catalog = require('./dashboard/Catalog');
const Template = require('./dashboard/Template');

const WidgetContainer = require('../ms2override/WidgetContainer');
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
/*
onMouseEnter={() => {
    if (c.type === 'map') {
        onChange(cards.map(card => {
            if (card.selectedMap && card.selectedMap.id === c.id
            || card.id === c.id) {
                return {...card, hightlighted: true };
            }
            return {...card, hightlighted: false };
        }));
    } else {
        onChange(cards.map(card => {
            if (c.selectedMap && card.id === c.selectedMap.id
            || card.id === c.id) {
                return {...card, hightlighted: true };
            }
            return {...card, hightlighted: false };
        }));
    }
}}
onMouseLeave={() => {
    onChange(cards.map(card => ({...card, hightlighted: false })));
}}*/
/*
isDraggable={isDraggable}
isResizable={isResizable}
onResizeStop={onResizeStop}
*/
const LayoutComponent = ({ onChangeColor, step, onDeleteCard, onEditCard, onCardFull, fullPreview, showConnection, readOnly, isEditing, /*isDraggable, isResizable,*/ connectingMaps, selectedCards, currentEdit = {}, cards = [], onLayoutChange = () => {}, /*onResizeStop = () => {},*/ onClick = () => {}, renderCard = () => {}/*, onMouseEnter = () => {}, onMouseUp = () => {}, onMouseDown = () => {}, onMouseLeave = () => {}*/}) =>
    <div className={"ms-dashboard-body-container" + (isEditing ? ' ms-edit' : '')} style={{overflowY: fullPreview ? 'hidden' : 'auto'}}>
    <ContainerDimensions>
            { ({width}) =>

    <ReactGridLayout
        width={width - 20}
        className="ms-dashboard-layout"
        rowHeight={104}
        cols={12}
        isDraggable={!readOnly}
        isResizable={!readOnly}
        onLayoutChange={onLayoutChange}
        >
        {cards.map((c) => {
            const edit = selectedCards.length === 1 && isEditing && ' ms-edit' || '';
            const selected = head(selectedCards.filter(s => s.id === c.id)) && ' ms-selected' + edit || '';
            const connectMaps = currentEdit.type === 'map' && connectingMaps && currentEdit.id === c.id && ' ms-hide' || connectingMaps && c.type !== 'map' && ' ms-hide' || '';
            const hideEdit = edit && !connectingMaps && !head(selectedCards.filter(s => s.id === c.id)) && ' ms-hide' || '';
            const selectedMap = currentEdit && currentEdit.selectedMap && currentEdit.selectedMap.id === c.id && ' ms-selected' || '';
            const hightlighted = !edit && c.hightlighted && ' ms-hightlight' || '';

            const outline = selectedCards.length === 0 && c.color && {borderTop: '4px solid ' + c.color} || selectedCards.length === 0 && c.selectedMap && {borderTop: '4px solid ' + c.selectedMap.color} || {};

            const mapConnection = selectedCards.length === 0 && c.type === 'map' && c.selectedMap && {color: c.selectedMap.color} || null;

            return (
                <div
                    data-grid={{...c}}
                    key={c.id}
                    style={showConnection || readOnly ? outline : {}}
                    className={'ms-dashboard-card widget-card-on-map' + selected + connectMaps + selectedMap + hideEdit + hightlighted}
                    onClick={e => { onClick(e, c, selected); }}
                    >

                    {/*<div className={"ms-dashboard-card-container" + (readOnly && ' ms-read-only' || '') + (readOnly && c.type === 'map' && ' ms-with-map' || '')}>
                        {renderCard(c)}
                    </div>
                    {!readOnly && <div className="ms-grab grabbable" onMouseEnter={onMouseEnter} onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave}>
                        <Glyphicon glyph="menu-hamburger"/>
                    </div>}*/}
                    <WidgetContainer id={`widget-text-${c.id}`}
                        title={currentEdit && currentEdit.id === c.id && currentEdit.title || c.title}
                        confirmDelete={false}
                        onDelete={() => {}}
                        toggleDeleteConfirm={() => {}}
                        topLeftItems={!readOnly ? <ButtonToolbar>
                            {/* onMouseEnter={onMouseEnter} onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} */}
                            <Button bsStyle="primary-inverse" className="ms-draggable grabbable">
                                <Glyphicon glyph="menu-hamburger"/>
                            </Button>
                            {showConnection && c.type === 'map' && <ButtonT tooltip="Change color connection" bsStyle="primary-inverse" onClick={() => {
                                onChangeColor(c);
                            }}>
                                <Glyphicon glyph="dropper"/>
                            </ButtonT>}
                            {mapConnection && (showConnection || readOnly) && c.type === 'map' && <ButtonT tooltip="Synchronized center" bsStyle="primary-inverse" className="no-events">
                                <Glyphicon glyph="1-mark" style={mapConnection}/>
                            </ButtonT>}
                            {mapConnection && (showConnection || readOnly) && c.type === 'map' && <ButtonT tooltip="Synchronized zoom" bsStyle="primary-inverse" className="no-events">
                                <Glyphicon glyph="zoom-to" style={mapConnection}/>
                            </ButtonT>}
                        </ButtonToolbar> : null}
    topRightItems={step === -1 || !step ? <ButtonToolbar>
                    <DropdownButton pullRight bsStyle="default" title={<Glyphicon glyph="option-vertical" />} noCaret id="dropdown-no-caret">
                        {!readOnly && <MenuItem onClick={() => { onEditCard(c); }} eventKey="3"><Glyphicon glyph="pencil"/>&nbsp; Edit</MenuItem>}
                        {!readOnly && <MenuItem onClick={() => { onDeleteCard(c); }} eventKey="2"><Glyphicon glyph="trash"/>&nbsp; Delete</MenuItem>}
                        <MenuItem onClick={() => { onCardFull(c); }} eventKey="2"><Glyphicon glyph="resize-full"/>&nbsp; Resize</MenuItem>

                        {/*<MenuItem onClick={() => { onDeleteCard(c); }} eventKey="2"><Glyphicon glyph="trash"/>&nbsp; Show Chart Data</MenuItem>*/}
                        {c.type === 'chart' && c.chartType !== 'gauge' && <MenuItem onClick={() => { onEditCard(c, 'legend'); }} eventKey="2"><Glyphicon glyph="list"/>&nbsp; {!c.showLegend ? 'Show Legend' : 'Hide Legend'}</MenuItem>}
                        {/*<MenuItem divider />*/}

                        {c.type === 'chart' && <MenuItem onClick={() => { }} eventKey="2"><Glyphicon glyph="download"/>&nbsp; Download Data</MenuItem>}
                        {c.type === 'chart' && <MenuItem onClick={() => { }} eventKey="2"><Glyphicon glyph="download"/>&nbsp; Export Image</MenuItem>}
                    </DropdownButton>
                </ButtonToolbar> : null}>
                {renderCard(c)}
    </WidgetContainer>

                </div>);
        })}
    </ReactGridLayout>
    }
</ContainerDimensions>
    {fullPreview && !isEditing && <div className="ms-widget-full-preview widget-card-on-map">
        <WidgetContainer id={`widget-text-${fullPreview.id}`}
            title={fullPreview.title}
            confirmDelete={false}
            onDelete={() => {}}
            toggleDeleteConfirm={() => {}}
topRightItems={<ButtonToolbar>
                <Button bsStyle="primary-inverse" onClick={() => { onCardFull(); }}>
                    <Glyphicon glyph="resize-small"/>
                </Button>
            </ButtonToolbar>}>
        {renderCard({...fullPreview, fullscreen: true})}
        </WidgetContainer>
    </div>}
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

    onSave() {
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

    onClear() {
        this.setState({
            showNoSavedChanges: true
        });
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
            glyph: 'floppy-disk',
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
            glyph: this.state.showConnection ? 'bulb-on' : 'bulb-off',
            tooltip: this.state.showConnection ? 'Hide connections' : 'Show connections',
            bsStyle: this.state.showConnection ? 'success' : 'primary',
            tooltipPosition: 'right',
            visible: this.state.cards.length > 0 && this.state.step === -1 && this.state.selectedCards.length === 0 && !this.props.readOnly,
            onClick: () => {
                this.setState({
                    showConnection: !this.state.showConnection
                });
            }
        }, /*{
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
        },*/ {
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
        return this.state.step === -1 ? (
            <div key="ms-v-bar" className="ms-vertical-toolbar ms-sm" style={{order: -1}}>
                <Toolbar transitionProps={{
                    transitionName: "toolbar-btn-transition-vert",
                    transitionEnterTimeout: 300,
                    transitionLeaveTimeout: 300
                }}
                btnGroupProps={{vertical: true}}
                btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                buttons={buttons}/>
            </div>
        ) : null;
    }

    renderMapCard(c) {
        return (
            <div className="ms-widget-body" style={{ height: '100%' }} onMouseOver={() => {
                this.setState({
                    currentMap: {...c}
                });
            }} onMouseOut={() => {
                this.setState({
                    currentMap: null
                });
            }}>
                <ContainerDimensions>
                    { ({width, height}) => <ItalyMap
                    onUpdate={(key, value) => {
                        if (this.state.currentMap && this.state.currentMap.id === c.id) {
                            this.setState({
                                cards: this.state.cards.map(ca => ca.selectedMap && ca.selectedMap.id === c.id ? {...ca, [key]: value} : {...ca})
                            });
                        }
                    }}
                    center={c.center && {x: c.center.lng, y: c.center.lat}}
                    zoom={c.zoom}
                    id={c.fullscreen ? 'full' : c.id} region={c.nodes && c.nodes.length > 0 ? 'all' : 'none'} width={width - 40} height={height - 20}/> }
                </ContainerDimensions>
            </div>
        );
    }

    renderTable() {
        const properties = Object.keys({...italy.features[0].properties});
        return (
            <BorderLayout
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
                        {properties.map(pr => <th>{pr}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                        {italy.features.map(ft => (
                        <tr>
                            {
                                Object.keys(ft.properties).map(key =>
                                <td>{ft.properties[key]}</td>
                                )
                            }
                        </tr>))}
                    </tbody>
                  </Table>
              </BorderLayout>
          );
    }

    renderChartCard(card) {
        return (
            <div className="ms-widget-body" style={{ height: '100%' }}>
                <ContainerDimensions>
                    { ({width, height}) => <ChartView showLegend={card.showLegend} isAnimationActive={false} series={[{dataKey: card.chartType === 'line' ? 'length' : 'area'}]}data={card.chartType === 'line' ? [...dataLengthItaly] : [...dataAreaItaly]} xAxis={{dataKey: "name", show: true}} width={width - 40} height={height - 20} type={card.chartType}/> }
                </ContainerDimensions>
            </div>
        );
    }

    renderCounter(card) {
        return (
            <div style={{display: 'flex', width: '100%', height: '100%', overflow: 'hidden'}}>
                <div style={{margin: 'auto', fontSize: 52, textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold', overflow: 'hidden'}}>{card.value} {card.uOM}</div>
            </div>
        );
    }

    renderCard(c) {

        const card = this.state.currentEdit && c.id === this.state.currentEdit.id && this.state.currentEdit || c;

        switch (card.type) {
            case 'map':
            return this.renderMapCard(card);
            case 'counter':
            return this.renderCounter(card);
            case 'table':
            return this.renderTable(card);
            case 'chart':
            return this.renderChartCard(card);
            case 'legend':
            return <div style={{display: 'flex', height: '100%'}}>{card.isConnected && card.selectedMap.nodes && card.selectedMap.nodes.length > 0 && <div style={{margin: 'auto'}}><div>Regions of Italy</div><img src={require('./dashboard/img/legend-r.png')}/></div>}</div>;
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
                            const color = 'hsla(' + Math.floor(Math.random() * 360) + ', 100%, 50%, 0.5)';
                            this.setState({
                                step: 2,
                                cards: [...this.state.cards, {color, id: 'db' + count, i: 'db' + count, type: this.state.currentType, empty, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3 }],
                                selectedCards: [{id: 'db' + count, type: this.state.currentType }],
                                stop: true,
                                edit: true,
                                emptyTOC: empty,
                                statusEdit: 'create',
                                currentEdit: {color, id: 'db' + count, i: 'db' + count, type: this.state.currentType, x: count % 2 === 0 ? 0 : 6, y: 0, w: 6, h: 3, nodes: empty && [] || [{
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
                    }}
                    onSave={() => {
                        this.onSave();
                    }}
                    onClear={() => {
                        this.onClear();
                    }}
                    mapTitle={this.state.currentEdit && this.state.currentEdit.title}
                    onUpdateTitle={title => {
                        this.setState({
                            currentEdit: {...this.state.currentEdit, title}
                        });
                    }}
                    connectingMaps={this.state.connectingMaps}
                    onConnectingMap={() => {
                        this.setState({
                            connectingMaps: !this.state.connectingMaps
                        });
                    }}
                    maps={this.state.cards.filter(ca => ca.type === 'map')}
                    isConnected={this.state.currentEdit && this.state.currentEdit.isConnected}
                    onClearConnection={() => {
                        this.setState({ currentEdit: {...this.state.currentEdit, selectedMap: null, isConnected: false}, connectingMaps: false});
                    }}/>
                <Builder statusEdit={this.state.statusEdit}
                    counter={this.state.currentEdit && this.state.currentEdit.type === 'counter' && this.state.currentEdit}
                    chartType={this.state.currentEdit && this.state.currentEdit.chartType}
                    maps={this.state.cards.filter(c => c.type === 'map')}
                    isConnected={this.state.currentEdit && this.state.currentEdit.isConnected}
                    connectingMaps={this.state.connectingMaps} text={this.state.currentEdit && this.state.currentEdit.text || ''}
                    key="dashboard-builder"
                    title={this.state.currentEdit && this.state.currentEdit.title}
                    onUpdateCounter={(key, value) => {
                        let randomValue = {};
                        if (key === 'operation') {
                            randomValue = {value: Math.floor(Math.random() * 1000)};
                        }
                        this.setState({
                            currentEdit: {...this.state.currentEdit, [key]: value, ...randomValue}
                        });
                    }}
                    onUpdateTitle={title => {
                        this.setState({
                            currentEdit: {...this.state.currentEdit, title}
                        });
                    }}
                    onClearConnection={() => {
                        this.setState({ currentEdit: {...this.state.currentEdit, selectedMap: null, isConnected: false}, connectingMaps: false});
                    }}
                    onSave={() => {
                        this.onSave();
                    }}
                    onClear={() => {
                        this.onClear();
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
                        onDeleteCard={c => {
                            this.setState({
                                showDeleteModal: true,
                                selectedCards: [...this.state.selectedCards, c]
                            });
                        }}
                        onChangeColor= {card => {
                            const color = 'hsla(' + Math.floor(Math.random() * 360) + ', 100%, 50%, 0.5)';
                            this.setState({
                                cards: this.state.cards.map(cc => {
                                    if (cc.id === card.id) {
                                        return {...cc, color};
                                    }

                                    if (cc.selectedMap && cc.selectedMap.id === card.id) {
                                        const selectedMap = {...cc.selectedMap, color};
                                        return {...cc, selectedMap};
                                    }

                                    return {...cc};
                                })
                            });
                        }}
                        onEditCard={(c, type) => {
                            if (type === 'legend') {
                                if (c.type === 'chart') {
                                    this.setState({
                                        cards: this.state.cards.map(cc => cc.id === c.id ? {...cc, showLegend: !cc.showLegend} : {...cc})
                                    });
                                }
                            } else {
                                if (c.type === 'map') {
                                    this.setState({
                                        step: pages.toc,
                                        edit: true,
                                        currentEdit: {...c},
                                        selectedCards: [...this.state.selectedCards, c],
                                        statusEdit: 'edit'
                                    });
                                } else {
                                    this.setState({
                                        step: pages.builder,
                                        edit: true,
                                        currentEdit: {...c},
                                        selectedCards: [...this.state.selectedCards, c],
                                        statusEdit: 'edit'
                                    });
                                }
                            }

                        }}
                        onCardFull={full => {

                            this.setState({
                                fullPreview: full ? {...full} : null
                            });
                        }}
                        fullPreview={this.state.fullPreview}
                        showConnection={this.state.showConnection}
                        onChange={cards => {
                            this.setState({ cards});
                        }}
                        onMouseEnter={() => {
                            this.setState({ isDraggable: true});
                        }}
                        onMouseDown={() => {
                            this.setState({ isDraggable: true, startGrab: true});
                        }}
                        onMouseUp={() => {
                            this.setState({ isDraggable: false, startGrab: false });
                        }}
                        onMouseLeave={() => {
                            if (!this.state.startGrab) {
                                this.setState({ isDraggable: false });
                            }
                        }}

                        cards={this.state.cards}
                        isEditing={this.state.edit}
                        step={this.state.step !== -1}
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
                        onClick={(e, c /*, selected*/) => {
                            if (!this.props.readOnly) {
                                /*if (!this.state.dragging && !this.state.resizing && !this.state.edit && !this.state.connectingMaps) {

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
                                }*/

                                if (this.state.connectingMaps) {

                                    this.setState({ currentEdit: {...this.state.currentEdit, selectedMap: c, isConnected: true}, connectingMaps: false});

                                }
                            }

                        }}
                        renderCard={ (c) => { return this.renderCard(c); }}/>
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
                        size="xs"
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
                <Portal>
                    <ResizableModal
                        title="Delete Widget"
                        bodyClassName="ms-flex modal-properties-container"
                        show={this.state.showDeleteModal}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showDeleteModal: false,
                                selectedCards: []
                            });
                        }}
                        buttons={[
                            {
                                text: 'No',
                                onClick: () => {
                                    this.setState({
                                        showDeleteModal: false,
                                        selectedCards: []
                                    });
                                }
                            },
                            {
                                text: 'Yes',
                                onClick: () => {
                                    this.setState({
                                        cards: this.state.cards.filter(c => !head(this.state.selectedCards.filter(s => s.id === c.id))),
                                        selectedCards: [],
                                        step: -1,
                                        stop: true,
                                        selectedNodes: [],
                                        showDeleteModal: false

                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                Are you sure to delete selected widget?
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>
            </div>
        );
    }
}

module.exports = {
    DashboardEditorPlugin
};
