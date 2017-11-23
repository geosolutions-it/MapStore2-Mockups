/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const ConfirmModal = require('../../../MapStore2/web/client/components/maps/modals/ConfirmModal');
const Combobox = require('react-widgets').Combobox;
const Styler = require('../components/Styler');
const InfoPopover = require('../components/InfoPopover');
const FakeToolbar = require('../components/FakeToolbar');
const FakeFooter = require('../components/FakeFooter');
const FakeNavbar = require('../components/FakeNavbar');
const FakeBackgroundSel = require('../components/FakeBackgroundSel');
const FakeIcons = require('../components/FakeIcons');
const SwitchPanel = require('../components/styleeditor/SwitchPanel');

const {head} = require('lodash');
const {
    Nav,
    NavItem,
    Panel,
    Button,
    Glyphicon,
    Grid,
    Col,
    Row,
    ButtonGroup,
    ButtonToolbar,
    DropdownButton,
    MenuItem,
    Table,
    OverlayTrigger,
    Tooltip
} = require('react-bootstrap');
const Sidebar = require('react-sidebar').default;
const Widget = require('../components/Widget');
require('./css/style.css');

const SimpleCharts = require('../components/SimpleCharts');

class Statistical extends React.Component {

    static propTypes = {
        width: PropTypes.number,
        show: PropTypes.bool,
        docked: PropTypes.bool,
        glyphs: PropTypes.array,
        analysis: PropTypes.array
    };

    static defaultProps = {
        width: 500,
        show: true,
        docked: true,
        glyphs: [
            null, null, '1-stilo', 'stats', 'cog'
        ],
        analysis: [
            {
                title: 'Join',
                icon: 'icon',
                desc: 'Join analysis',
                caption: 'analysis',
                glyph: 'link'
            }, {
                title: 'Aggregate',
                icon: 'icon',
                desc: 'Aggregate analysis',
                caption: 'analysis',
                glyph: 'th'
            }
        ]
    };

    state = {
        selectedKey: 4,
        resultsCards: [
            {
                id: 'layer',
                glyph: '1-layer'
            }
        ],
        widgetList: []
    };

    renderHeader() {
        // const editOrSelect = this.state.resultsCards.length > 1 ? 'Select or edit analysis' : 'Select analysis';
        return (
            <div style={{
                overflow: 'hidden'
            }}>
                <Row>
                    <Col xs={12}>
                        <a href="#/toc"><Button className="pull-left square-button no-border">
                            <Glyphicon glyph="1-close"/>
                        </Button></a>
                    <Button className="pull-right square-button no-border no-active">
                            <Glyphicon glyph={this.props.glyphs[this.state.selectedKey - 1]}/>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="text-center mapstore-sidebar-header-title">
                        <div>Layer Title</div>
                    </Col>
                </Row>
                <Nav bsStyle="tabs" activeKey={this.state.selectedKey} justified>
                    <NavItem eventKey={1} disabled>General</NavItem>
                    <NavItem eventKey={2} disabled>Display</NavItem>
                    <NavItem eventKey={4}>Analysis</NavItem>
                    <NavItem href="#/styleeditor">Style</NavItem>
                    <NavItem eventKey={5} disabled>Elevation</NavItem>
                </Nav>
                <div className="mapstore-result-container">
                    <ConfirmModal confirmText={'Delete'} cancelText={'Cancel'} titleText={'Delete Analysis Chain'} body={'Delete Last Analysis'} show={this.state.resultsCardsDelete} onClose={() => {
                        this.setState({
                            resultsCardsDelete: false
                        });
                    }} onConfirm={() => {
                        this.setState({
                            resultsCardsDelete: false,
                            resultsCards: this.state.resultsCards.filter((rs, idx) => idx < this.state.resultsCards.length - 1)
                        });
                    }}/>

                {/**/}
                    {/*this.state.resultsCards.map((r, idx) => {
                        const classN = idx > 0 ? "dash-line" : "";
                        return (
                            <div className={classN}>
                                {idx > 0 ? <div className="line-join">
                                </div> : null}
                                <div className={"mapstore-result-square"}>
                                    <Glyphicon glyph={r.glyph}/>
                                    {idx !== 0 && idx === this.state.resultsCards.length - 1 ? <Glyphicon glyph={'trash'}

                                        onClick={() => {
                                            this.setState({
                                                resultsCardsDelete: true
                                            });
                                        }}
                                    /> : null}
                                </div>

                            </div>
                        );
                    })*/}
                    {this.state.resultsCards.map((r, idx) => {
                        const classN = idx > 0 ? " dash-line" : "";
                        const line = idx > 0 ? ' line-join' : '';

                        return (
                            <div className={"mapstore-result-square" + classN}>
                                <div className={"m-box"}>
                                    {line ? <div className="line-join"/> : null}
                                    <Glyphicon glyph={r.glyph}/>
                                    {idx !== 0 && idx === this.state.resultsCards.length - 1 ? <Glyphicon glyph={'trash'}

                                        onClick={() => {
                                            this.setState({
                                                resultsCardsDelete: true
                                            });
                                        }}
                                    /> : null}
                                </div>

                            </div>
                        );
                    })}

                    <InfoPopover title="Analysis chain" text="Shows the sequence of the analysis. Click on analysis card, edit and save the form to add it to the chain"/>
                </div>
                <Row>
                    <Col xs={12} className="text-center mapstore-sidebar-header-title-sec text-center" style={{padding: '0 30px'}}>
                {!this.state.aggregateActive && !this.state.joinActive
                    ? null
                    : <ButtonGroup>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cancel">Cancel</Tooltip>}>
                        <Button className="square-button-md" bsStyle="primary" onClick={() => {
                            this.setState({aggregateActive: false, joinActive: false});
                        }}>
                            <Glyphicon glyph="remove-square"/>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-save">Save current analysis</Tooltip>}>
                        <Button className="square-button-md" bsStyle="primary" onClick={() => {
                            const id = this.state.joinActive ? 'join' : 'aggregate';
                            const isDisabled = head(this.state.resultsCards.filter(rs => rs.id === id));
                            if (!isDisabled) {
                                this.setState({
                                    aggregateActive: false,
                                    joinActive: false,
                                    resultsCards: [
                                        ...this.state.resultsCards, {id,
                                            glyph: this.state.joinActive
                                                ? 'link'
                                                : 'th'
                                        }
                                    ]
                                });
                            } else {
                                this.setState({
                                    aggregateActive: false,
                                    joinActive: false
                                });
                            }

                        }}>
                            <Glyphicon glyph="floppy-disk"/>
                        </Button>
                        </OverlayTrigger>
                    </ButtonGroup>
}</Col>



</Row>
</div>

        );
    }

    renderJoin() {
        return (
            <SwitchPanel title={"Join Analysis"} expanded locked>
                <Col xs={12}>
                    <div className="mapstore-block-width">
                        <Row>
                        <Col xs={6}>
                            Target layer:
                        </Col>
                        <Col xs={6} className="pull-right">

                            <Combobox
                                data={[
                                    'Unità Urbanistiche'
                                ]}
                                placeholder={'Select target layer'}
                                onChange={() => {}}
                                />

                        </Col>
                        </Row>
                    </div>
                </Col>
                <Col xs={12}>
                    <div className="mapstore-block-width">
                        <Row>
                        <Col xs={6}>
                            Target layer attribute:
                        </Col>
                        <Col xs={6} className="pull-right">
                            <Combobox
                                data={[
                                    'Abitanti',
                                    'Population'
                                ]}
                                placeholder={'Select target layer attribute'}
                                onChange={() => {}}
                                />
                        </Col>
                        </Row>
                    </div>
                </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6} >
                                Current layer attribute:
                            </Col>
                            <Col xs={6} className="pull-right">
                                <Combobox
                                    data={[
                                        'Abitanti',
                                        'Population'
                                    ]}
                                    placeholder={'Select current layer attribute'}
                                    onChange={() => {}}
                                    />
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Join type:
                            </Col>
                            <Col xs={6} className="pull-right">
                                <Combobox
                                    data={[
                                        'Left join'
                                    ]}
                                    placeholder={'Select join type'}
                                    onChange={() => {}}
                                    />
                            </Col>
                            </Row>
                        </div>
                    </Col>
            </SwitchPanel>
        );
    }

    renderAggregate() {
        return (
            <SwitchPanel title={"Aggregate Analysis"} expanded locked>
                <Col xs={12}>
                    <div className="mapstore-block-width">
                        <Row>
                        <Col xs={6}>
                            Attribute:
                        </Col>
                        <Col xs={6} className="pull-right">

                            <Combobox
                                data={[
                                    'Abitanti',
                                    'Population'
                                ]}
                                placeholder={'Select attribute'}
                                onChange={() => {}}
                                />

                        </Col>
                        </Row>
                    </div>
                </Col>
                <Col xs={12}>
                    <div className="mapstore-block-width">
                        <Row>
                        <Col xs={6}>
                            Aggregation:
                        </Col>
                        <Col xs={6} className="pull-right">
                            <Combobox
                                data={[
                                    'sum'
                                ]}
                                placeholder={'Select type'}
                                onChange={() => {}}
                                />
                        </Col>
                        </Row>
                    </div>
                </Col>

                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Group by:
                            </Col>
                            <Col xs={6} className="pull-right">
                                <Combobox
                                    data={[
                                        'geometry'
                                    ]}
                                    placeholder={'Select attribute'}
                                    onChange={() => {}}
                                    />
                            </Col>
                            </Row>
                        </div>
                    </Col>
            </SwitchPanel>
        );
    }

    renderAnalysisForm() {
        return this.state.aggregateActive
            ? this.renderAggregate()
            : this.renderJoin();
    }

    renderAnalysis() {

        // const sectionTitle = !this.state.joinActive && !this.state.aggregateActive ? : null;

        return (
            <Grid fluid>

                {/*<Row>
                    <Col xs={12} className="text-center mapstore-sidebar-header-title-sec">
                        {!this.state.aggregateActive && !this.state.joinActive ? <div>{editOrSelect}</div> : null}
                        {this.state.aggregateActive ? <div><Glyphicon glyph="th text-primary"/>&nbsp;Aggregate Analysis</div> : null}
                        {this.state.joinActive ? <div><Glyphicon glyph="link text-primary"/>&nbsp;Join Analysis</div> : null}

                    </Col>
                </Row>*/}


                <div>
                    <Row>
                        {!this.state.joinActive && !this.state.aggregateActive
                            ? this.props.analysis.map(a => {
                                const selected = head(this.state.resultsCards.filter(rs => rs.id === a.title.toLowerCase())) ? ' selected' : '';
                                return (
                                    <div className="m-padding-grid"><Col xs={12}>
                                        <div className={'mapstore-side-card' + selected} onClick={() => {
                                            this.setState({
                                                [a.title.toLowerCase() + 'Active']: true
                                            });
                                        }}>
                                            {/*<div className="mapstore-side-image"><img src={a.icon}/></div>*/}
                                            <div className="mapstore-side-glyph bg-primary">
                                                <Glyphicon glyph={a.glyph}/>
                                            </div>
                                            <div className="mapstore-side-card-info">
                                                <div className="mapstore-side-card-title">
                                                    {a.title}
                                                </div>
                                                <div className="mapstore-side-card-desc">
                                                    {a.desc}
                                                </div>
                                                <div className="mapstore-side-card-caption">
                                                    {a.caption}
                                                </div>
                                            </div>
                                            <div className="mapstore-side-card-tool text-center">
                                                {selected ? <Glyphicon glyph="pencil" className="text-primary"/> : ''}
                                            </div>
                                        </div>
                                    </Col></div>
                                );
                            })
                            : this.renderAnalysisForm()}
                    </Row>
                </div>
            </Grid>
        );
    }

    renderWidget() {
        let id = new Date();
        return (<Widget onSave={(options) => {
            this.setState({
                widgetList: [
                    ...this.state.widgetList,
                    Object.assign({}, options, {id})
                ]
            });
        }}/>);
    }

    renderBody() {
        switch (this.state.selectedKey) {
            case 4:
                return this.renderAnalysis();
            case 5:
                return this.renderWidget();
            default:
                return <Styler />;
        }
    }
    /*onSelect={(selectedKey) => {
        this.setState({selectedKey});
    }}*/
    renderContent() {
        return (
            <div className="mapstore-flex-container">
                <div className="m-header">
                    {this.renderHeader()}



                </div>
                <div className="m-body-scroll-y">

                        {this.renderBody()}

                </div>
                <div className="m-footer">
                    <div className="mapstore-block-width">
                    </div>
                </div>
            </div>
        );
    }

    renderWidgetHeader() {
        return (
            <div style={{
                overflow: 'hidden'
            }}>
                <Row>
                    <Col xs={12}>
                        <Button className="pull-left square-button">
                            <Glyphicon glyph="cog"/>
                            Widgets
                        </Button>
                        <Button className="pull-right square-button">
                            <Glyphicon glyph="1-close"/>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

    renderTable(type) {
        return type === 'Bar chart' ? (
            <div className="mapstore-widget-table">
            <Table striped>
                <thead>
                    <tr>
                        <th>Tipologie Urbane</th>
                        <th>Area (m^2)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Residenziale</td>
                        <td>5000</td>
                    </tr>
                    <tr>
                        <td>Ufficio</td>
                        <td>4006</td>
                    </tr>
                    <tr>
                        <td>Commerciale</td>
                        <td>2541</td>
                    </tr>
                    <tr>
                        <td>Industriale</td>
                        <td>500</td>
                    </tr>
                    <tr>
                        <td>Rurale</td>
                        <td>200</td>
                    </tr>
                    <tr>
                        <td>Parcheggio</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>Parco</td>
                        <td>189</td>
                    </tr>
                </tbody>
            </Table></div>
    ) : (<div className="mapstore-widget-table">
    <Table striped>
        <thead>
            <tr>
                <th>Tipologie Urbane</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Residenziale</td>
                <td>400</td>
            </tr>
            <tr>
                <td>Ufficio</td>
                <td>300</td>
            </tr>
            <tr>
                <td>Commerciale</td>
                <td>278</td>
            </tr>
            <tr>
                <td>Industriale</td>
                <td>300</td>
            </tr>
            <tr>
                <td>Rurale</td>
                <td>863</td>
            </tr>
            <tr>
                <td>Parcheggio</td>
                <td>331</td>
            </tr>
            <tr>
                <td>Parco</td>
                <td>500</td>
            </tr>
        </tbody>
    </Table></div>);
    }

    renderWidgetContent() {
        return (
            <Panel header={this.renderWidgetHeader()}>
                <div className="mapstore-scroll-container-1">
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                {this.state.widgetList.map(wL => {
                                    return (
                                        <div className="mapstore-widget-card">
                                            <div className="mapstore-widget-info">
                                                <div className="mapstore-widget-title">
                                                    {wL.synch && !wL.showTable
                                                        ? <span className="mapstore-widget-loader"/>
                                                        : null}
                                                    {wL.showTable
                                                        ? <Glyphicon onClick={() => {
                                                            this.setState({
                                                                widgetList: this.state.widgetList.map(w => {
                                                                    if (w.id === wL.id) {
                                                                        return Object.assign({}, w, {showTable: false});
                                                                    }
                                                                    return w;
                                                                })
                                                            });
                                                        }} glyph="arrow-left pull-left"/>
                                                            : null}
                                                    {wL.attributeChartTitle}
                                                    <span className="mapstore-widget-options">

                                                        {wL.showTable
                                                            ? null : <ButtonToolbar>
                                                            <DropdownButton pullRight bsStyle="default" title={< Glyphicon glyph = "option-vertical" />} noCaret id="dropdown-no-caret">
                                                                <MenuItem onClick={() => {
                                                                    this.setState({
                                                                        widgetList: this.state.widgetList.map(w => {
                                                                            if (w.id === wL.id) {
                                                                                return Object.assign({}, w, {showTable: true});
                                                                            }
                                                                            return w;
                                                                        })
                                                                    });
                                                                }} eventKey="1"><Glyphicon glyph="features-grid"/>&nbsp;Show chart data</MenuItem>
                                                                <MenuItem onClick={() => {
                                                                    this.setState({
                                                                        widgetList: this.state.widgetList.map(w => {
                                                                            if (w.id === wL.id) {
                                                                                return Object.assign({}, w, {showDelete: true});
                                                                            }
                                                                            return w;
                                                                        })
                                                                    });
                                                                }} eventKey="2"><Glyphicon glyph="trash"/>&nbsp;Delete</MenuItem>
                                                                <MenuItem eventKey="3"><Glyphicon glyph="pencil"/>&nbsp;Edit</MenuItem>
                                                                <MenuItem eventKey="3"><Glyphicon glyph="download"/>&nbsp;Download data</MenuItem>
                                                            </DropdownButton>
                                                        </ButtonToolbar>}
                                                    </span>
                                                </div>
                                                <div className="mapstore-widget-layer">
                                                    Layer Title
                                                </div>
                                                <div className="mapstore-widget-description">
                                                    {wL.attributeChartDesc}
                                                </div>

                                                {wL.attributeChartValue
                                                    ? <div className="mapstore-widget-description">
                                                            {'Attribute: ' + wL.attributeChartValue}
                                                        </div>
                                                    : null}
                                            </div>
                                            {wL.showTable
                                                ? this.renderTable(wL.chartType)
                                                : <div className="mapstore-widget-chart">
                                                    <SimpleCharts colors={wL.attributeColors} isFull xLabel={wL.attributeChartX} yLabel={wL.attributeChartY} type={wL.chartType === 'Bar chart'
                                                        ? 'bar'
                                                        : 'pie'} isHorz xAxis yAxis/>
                                                </div>}
                                            <ConfirmModal confirmText={'Delete'} cancelText={'Cancel'} titleText={'Delete Widget'} body={'Delete Widget'} show={wL.showDelete} onClose={() => {
                                                this.setState({
                                                    widgetList: this.state.widgetList.map(w => {
                                                        if (w.id === wL.id) {
                                                            return Object.assign({}, w, {showDelete: false});
                                                        }
                                                        return w;
                                                    })
                                                });
                                            }} onConfirm={() => {
                                                this.setState({
                                                    widgetList: this.state.widgetList.filter(w => w.id !== wL.id)
                                                });
                                            }}/>
                                        </div>
                                    );
                                })}
                            </Col>
                        </Row>

                    </Grid>
                </div>
                <Row>
                    <Col xs={12} className="mapstore-side-footer"/>

                </Row>
            </Panel>
        );
    }

    render() {
        const stylesLeft = {
            sidebar: {
                zIndex: 1022,
                width: this.props.width
            },
            overlay: {
                zIndex: 1021
            },
            root: {
                right: 'auto',
                // this.props.show ? 0 : 'auto',
                width: '0',
                overflow: 'visible'
            },
            content: {
                overflowY: 'auto'
            }
        };

        const stylesRight = {
            sidebar: {
                zIndex: 1022,
                width: this.state.widgetList.length > 0
                    ? this.props.width
                    : 0
            },
            overlay: {
                zIndex: 1021
            },
            root: {
                left: 'auto',
                // this.props.show ? 0 : 'auto',
                width: '0',
                overflow: 'visible'
            },
            content: {
                overflowY: 'auto'
            }
        };
        return (
            <span>
                <FakeToolbar/>
                <FakeFooter/>
                <FakeNavbar/>
                <FakeBackgroundSel/>
                <FakeIcons/>
                <Sidebar transitions={false} styles={stylesLeft} sidebarClassName="mapstore-sidebar" onSetOpen={() => {}} open={this.props.show} docked={this.props.docked} sidebar={this.renderContent()}>
                    <div/>
                </Sidebar>
                <Sidebar transitions={false} pullRight styles={stylesRight} sidebarClassName="mapstore-sidebar mapstore-sidebar-right" onSetOpen={() => {}} open={this.props.show} docked={this.props.docked} sidebar={this.renderWidgetContent()}>
                    <div/>
                </Sidebar>
            </span>
        );
    }
}

module.exports = Statistical;
