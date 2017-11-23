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
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonGroup,
    ButtonToolbar,
    DropdownButton,
    MenuItem,
    Table
} = require('react-bootstrap');
const Sidebar = require('react-sidebar').default;
const Widget = require('../components/WidgetSinlge');
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');


const SimpleCharts = require('../components/SimpleCharts');


class Side extends React.Component {

    static propTypes = {
        id: PropTypes.string

    };

    static defaultProps = {
        id: ''
    };

    state = {
        widgetList: []
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

    renderWidgetHeader() {
        return (
            <div style={{
                overflow: 'hidden'
            }}>
                <Row>
                    <Col xs={12}>
                        <Button className="pull-left square-button">
                            <Glyphicon glyph="dashboard"/>

                        </Button>
                        <div style={{'float': 'left', lineHeight: '52px'}}>Dashboard</div>
                        <Button className="pull-right square-button">
                            <Glyphicon glyph="1-close"/>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

    renderCard(wL) {
        const title = wL.attributeChartTitle;
        const info = !wL.attributeChartTitle && !wL.attributeChartDesc || wL.showTable ? null : <InfoPopover placement="top" title={title} text={'layer: Layer Title, description:' + wL.attributeChartDesc}/>;
        return (
            <div className="mapstore-widget-card">
                <div className="mapstore-widget-info">
                    <div className="mapstore-widget-title">
                        {wL.synch && !wL.showTable
                            ? <span className="mapstore-widget-loader"/>
                        : info}
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
                        <span className="m-title">{title}</span>
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
                                    <MenuItem eventKey="4"><Glyphicon glyph="1-close"/>&nbsp;Collapse card</MenuItem>
                                </DropdownButton>
                            </ButtonToolbar>}
                        </span>
                    </div>
                </div>
                {wL.showTable
                    ? this.renderTable(wL.chartType)
                    : <div className="mapstore-widget-chart">
                        <SimpleCharts colors={wL.attributeColors} xLabel={wL.attributeChartX} yLabel={wL.attributeChartY} type={wL.chartType === 'Bar chart'
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
        /*const stylesRight = {
            sidebar: {
                zIndex: 1022,
                width: this.state.widgetList.length > 0
                    ? 500
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
        };*/
        const id = new Date();
        const layout = this.state.widgetList.map((wL, i) => {return {sm: {i: 'wg' + i, x: i, y: 0, w: 2, h: 1}}; });

        return (
            <span>

                <ResponsiveReactGridLayout style={{left: '500px', bottom: 30, minHeight: '238px', width: 'calc(100% - 552px)', position: 'absolute', zIndex: 2}} className="layout" layout={layout} rowHeight={208} compactType={'horizontal'}
                    breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 7, md: 6, sm: 5, xs: 4, xxs: 4}}>

      {this.state.widgetList.map((wL, i) => {
          return (<div key={'wg' + i} className="widget-card-on-map" data-grid={layout[i].sm} >
               {this.renderCard(wL)}
          </div>);
      })}
    </ResponsiveReactGridLayout>


                <FakeIcons/>
                <FakeToolbar/>
                <FakeFooter/>
                <FakeNavbar/>
                <FakeBackgroundSel/>
                {<div className="shadow-soft" style={{
                    position: 'absolute',
                    width: 500,
                    height: '100%',
                    backgroundColor: '#fff',
                    zIndex: 5
                }}>
                    {<Widget onSave={(options) => {
                        this.setState({
                            widgetList: [
                                ...this.state.widgetList,
                                Object.assign({}, options, {id})
                            ]
                        });
                    }}/>}

                    {/*<WidgetsBuilder />*/}

            </div>}

                {/*<Sidebar pullRight styles={stylesRight} sidebarClassName="mapstore-sidebar mapstore-sidebar-right" onSetOpen={() => {}} open docked sidebar={this.renderWidgetContent()}>
                    <div/>
                </Sidebar>*/}
            </span>
        );
    }
}

module.exports = Side;
