/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {connect} = require('react-redux');
const Dock = require('react-dock').default;
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const Toolbar = require('../../old_ms2_226bfec4/web/client/components/misc/toolbar/Toolbar');
const WidgetsBuilder = require('../../old_ms2_226bfec4/web/client/components/widgets/builder/WidgetsBuilder');
const {Grid, Col, Row, Nav, NavItem, Glyphicon} = require('react-bootstrap');
const tooltip = require('../../old_ms2_226bfec4/web/client/components/misc/enhancers/tooltip');
const SideCard = require('../../old_ms2_226bfec4/web/client/components/misc/cardgrids/SideCard');
const Portal = require('../../old_ms2_226bfec4/web/client/components/misc/Portal');

const HTMLViewer = require('../../old_ms2_226bfec4/web/client/components/data/identify/viewers/HTMLViewer');
const TextViewer = require('../../old_ms2_226bfec4/web/client/components/data/identify/viewers/TextViewer');
const JSONViewer = require('../../old_ms2_226bfec4/web/client/components/data/identify/viewers/JSONViewer');

const {head} = require('lodash');
const NavItemT = tooltip(NavItem);
const ReactQuill = require('react-quill');

const {setOption} = require('../actions/mockups');
// const { Combobox } = require('react-widgets');
const ResizableModal = require('../components/ResizableModal');
const sampleData = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/sampleChartData');
const SampleChart = sampleData(require('../../old_ms2_226bfec4/web/client/components/charts/SimpleChart'));
const ContainerDimensions = require('react-container-dimensions').default;

const SideCardListDraggable = require('../components/SideCardListDraggable');

const textMock = "Example of response\n" +
    "\n--------------------------------------------" +
    "\nResults for FeatureType 'http://www.openplans.org/topp:states':" +
    "\n--------------------------------------------" +
    "\nthe_geom = [GEOMETRY (Polygon) with 48 points]" +
    "\nSTATE_NAME = Wyoming" +
    "\nSTATE_FIPS = 56" +
    "\nSUB_REGION = Mtn" +
    "\nSTATE_ABBR = WY" +
    "\nLAND_KM = 251500.801" +
    "\nWATER_KM = 1848.149" +
    "\nPERSONS = 453588.0" +
    "\nFAMILIES = 119825.0" +
    "\nHOUSHOLD = 168839.0" +
    "\nMALE = 227007.0" +
    "\nFEMALE = 226581.0" +
    "\nWORKERS = 164561.0" +
    "\nDRVALONE = 153679.0" +
    "\nCARPOOL = 28109.0" +
    "\nPUBTRANS = 2963.0" +
    "\nEMPLOYED = 207868.0" +
    "\nUNEMPLOY = 13112.0" +
    "\nSERVICE = 71419.0" +
    "\nMANUAL = 29157.0" +
    "\nP_MALE = 0.5" +
    "\nP_FEMALE = 0.5" +
    "\nSAMP_POP = 83202.0" +
    "\n--------------------------------------------";

const htmlMock = require('raw-loader!./getfeatureinfo/mockhtmlresponse.txt');
const jsonMock = JSON.parse(require('raw-loader!./getfeatureinfo/mockjson.txt'));
class PanelHeader extends React.Component {
    static propTypes = {
        title: PropTypes.node,
        buttons: PropTypes.array,
        subtitle: PropTypes.node,
        onClose: PropTypes.func
    };

    static defaultProps = {
        title: 'Layer Title',
        subtitle: 'Feature Info Settings'
    };

    render() {
        return (
            <Grid fluid className="ms-panel-header">
                <Row>
                    <Col xs={4}>
                        <Glyphicon glyph="1-close" onClick={this.props.onClose}/>
                    </Col>
                    <Col xs={4}>
                        <h4>{this.props.title}</h4>
                    </Col>
                    <Col xs={4}>
                        <Glyphicon glyph="map-marker"/>
                    </Col>
                </Row>
                {(this.props.subtitle || this.props.buttons) && <Row>
                    {this.props.subtitle && <Col xs={12}>
                        <h4><strong>{this.props.subtitle}</strong></h4>
                    </Col>}
                    { this.props.buttons &&
                        <Col xs={12}>
                            <Toolbar btnDefaultProps={{ bsStyle: 'primary', className: 'square-button-md' }} buttons={this.props.buttons}/>
                        </Col>
                    }
                </Row>}
                {this.props.children}
            </Grid>
        );
    }
}

class ListChartsComponent extends React.Component {
    static propTypes = {
        charts: PropTypes.array,
        onClick: PropTypes.func,
        selected: PropTypes.array,
        onSort: PropTypes.func
    };

    static defaultProps = {
        charts: [],
        onClick: () => {},
        selected: [],
        onSort: () => {}
    };

    render() {
        const cards = this.props.charts.map(chart => {
            const select = !!head(this.props.selected.filter(sel => sel === chart.id)) ? ' ms-selected' : '';
            return {
                ...chart,
                className: 'ms-sm' + select,
                preview: <SampleChart tooltip={false} autoColorOptions={select ? {
                        base: 0,
                        range: 0,
                        s: -1.0,
                        v: 1.0
                    } : {
                        base: 190,
                        range: 0,
                        s: 0.95,
                        v: 0.63
                    }} width={45} height={52} type={chart.type} legend={false} />,
                onClick: () => {
                    this.props.onClick(chart);
                }
            };
        });
        return (
            <Row style={{margin: 0, padding: '15px 30px'}}>
                <SideCardListDraggable onSort={this.props.onSort} cards={cards}/>
            </Row>
        );
    }
}
const emptyState = require('../../MapStore2/web/client/components/misc/enhancers/emptyState');
const ListCharts = emptyState(({charts=[]}) => charts.length === 0, { glyph: 'pie-chart' })(ListChartsComponent);

let count = 0;
class DockGetfeatureInfo extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        width: PropTypes.number,
        onClose: PropTypes.func,
        openInfo: PropTypes.bool,
        setOption: PropTypes.func
    };

    static defaultProps = {
        open: true,
        width: 500,
        onClose: () => {},
        openInfo: false
    };

    state = {
        format: 'TEXT',
        page: 'format',
        step: 0,
        selected: [],
        markdown: '',
        currentChartData: {},
        charts: [],
        infoPage: 'results'
    };

    componentWillUpdate(newProps, newState) {
        if (newState.charts.length === 0 && this.state.charts.length > 0) {
            this.setState({
                infoPage: 'results'
            });
        }
    }

    renderHeader() {
        return (
            <PanelHeader>
                <Nav bsStyle="tabs" activeKey={"5"} justified>
                    <NavItemT tooltip="General" eventKey="1" ><Glyphicon glyph="wrench"/></NavItemT>
                    <NavItemT tooltip="Display" eventKey="2"><Glyphicon glyph="eye-open"/></NavItemT>
                    <NavItemT tooltip="Analysis" eventKey="3"><Glyphicon glyph="stats"/></NavItemT>
                    <NavItemT tooltip="Style" eventKey="4"><Glyphicon glyph="dropper"/></NavItemT>
                    <NavItemT tooltip="Feature Info" eventKey="5"><Glyphicon glyph="map-marker"/></NavItemT>
                </Nav>
                <Row>
                    <Col xs={12}>
                        <Toolbar
                            btnDefaultProps={{ bsStyle: 'primary', className: 'square-button-md' }}
                            buttons={[
                                {
                                    glyph: 'ext-empty',
                                    tooltip: 'Feature info formats settings',
                                    visible: this.state.page === 'chart' && !this.state.addChart,
                                    onClick: () => {
                                        this.setState({
                                            page: 'format',
                                            addChart: false
                                        });
                                    }
                                },
                                {
                                    glyph: 'arrow-left',
                                    tooltip: 'Back to previous step',
                                    visible: (!this.state.editing && this.state.page === 'chart' && !!this.state.addChart && this.state.step > 0)
                                    || (this.state.editing && this.state.page === 'chart' && !!this.state.addChart && this.state.step > 1) || false,
                                    onClick: () => {
                                        this.setState({
                                            step: this.state.step - 1
                                        });
                                    }
                                },
                                {
                                    glyph: '1-close',
                                    tooltip: 'Exit from chart editing',
                                    visible: (!this.state.editing && this.state.page === 'chart' && !!this.state.addChart && this.state.step === 0)
                                    || (this.state.editing && this.state.page === 'chart' && !!this.state.addChart && this.state.step === 1) || false,
                                    onClick: () => {
                                        this.setState({
                                            addChart: false,
                                            step: 0
                                        });
                                    }
                                },
                                {
                                    glyph: 'arrow-right',
                                    tooltip: 'Go to next step',
                                    visible: this.state.page === 'chart' && !!this.state.addChart && this.state.step > 0 && this.state.step < 2,
                                    onClick: () => {
                                        this.setState({
                                            step: this.state.step + 1
                                        });
                                    }
                                },
                                {
                                    glyph: 'trash',
                                    tooltip: 'Delete selected chart',
                                    visible: this.state.page === 'chart' && !this.state.addChart && this.state.selected.length > 0,
                                    onClick: () => {
                                        this.setState({
                                            charts: this.state.charts.filter(ch => ch.id !== this.state.selected[0]),
                                            selected: []
                                        });
                                    }
                                },
                                {
                                    glyph: 'pencil',
                                    tooltip: 'Edit selected chart',
                                    visible: this.state.page === 'chart' && !this.state.addChart && this.state.selected.length === 1,
                                    onClick: () => {
                                        this.setState({
                                            addChart: true,
                                            step: 1,
                                            editing: true,
                                            currentEdit: head(this.state.charts.filter(chart => this.state.selected[0] === chart.id ))
                                        });
                                    }
                                },
                                {
                                    glyph: 'floppy-disk',
                                    tooltip: 'Save chart',
                                    visible: this.state.page === 'chart' && !!this.state.addChart && this.state.step === 2,
                                    onClick: () => {
                                        if (this.state.editing) {
                                            this.setState({
                                                addChart: false,
                                                step: 0,
                                                charts: [...this.state.charts.filter(chart => chart.id !== this.state.selected[0]), {
                                                    ...this.state.currentEdit,
                                                    preview: 'pie-chart',
                                                    title: this.state.chartTitle || 'Get Feature Info Chart ' + this.state.currentEdit.id,
                                                    description: this.state.chartDesc,
                                                    data: {...this.state.currentChartData}
                                                }]
                                            });
                                        } else {
                                            count++;
                                            this.setState({
                                                addChart: false,
                                                step: 0,
                                                charts: [...this.state.charts, {
                                                    preview: 'pie-chart',
                                                    type: this.state.type,
                                                    title: this.state.chartTitle || 'Get Feature Info Chart id:' + count,
                                                    description: this.state.chartDesc,
                                                    id: 'id:' + count,
                                                    data: {...this.state.currentChartData}
                                                }]
                                            });
                                        }

                                    }
                                },
                                {
                                    glyph: 'pie-chart',
                                    tooltip: 'Feature info charts settings',
                                    visible: this.state.page === 'format',
                                    onClick: () => {
                                        this.setState({
                                            page: 'chart'
                                        });
                                    }
                                },
                                {
                                    glyph: 'plus',
                                    tooltip: 'Add new chart',
                                    visible: this.state.page === 'chart' && !this.state.addChart && this.state.selected.length === 0,
                                    onClick: () => {
                                        this.setState({
                                            addChart: true,
                                            chartTitle: '',
                                            chartDesc: '',
                                            currentChartData: {},
                                            currentEdit: {},
                                            editing: false
                                        });
                                    }
                                }
                            ]}/>
                    </Col>
                </Row>
            </PanelHeader>
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
        const formats = [{
            preview: 'ext-txt',
            title: 'TEXT',
            description: 'Shows feature info results as plain text'
        }, {
            preview: 'ext-html',
            title: 'HTML',
            description: 'Shows feature info results as html'
        }, {
            preview: 'ext-json',
            title: 'JSON',
            description: 'Shows feature info results as JSON'
        }, {
            preview: 'ext-empty',
            title: 'MARKDOWN',
            description: 'Customize feature info results format'
        }];

        const selectedCardId = head(formats.map((format, i) => ({title: format.title, id: 'id:' + i})).filter(format => format.title === this.state.format));

        const beforeCards = formats.filter((v, i) => i <= parseFloat(selectedCardId.id.split(':')[1]));
        const afterCards = formats.filter((v, i) => i > parseFloat(selectedCardId.id.split(':')[1]));

        return (
            <span>
                <Dock dockStyle={{height: 'calc(100% - 30px)'}} {...dockProps} isVisible={this.props.open} size={500} >
                    <BorderLayout
                        header={this.renderHeader()}>
                        {this.state.page === 'format' && <Grid fluid className="ms-panel-body">
                            {/*<Row>
                                <Col xs={6}>
                                    Format:
                                </Col>
                                <Col xs={6}>
                                    <Combobox
                                        value={this.state.format}
                                        data={[
                                            'TEXT',
                                            'JSON',
                                            'HTML',
                                            'MARKDOWN'
                                        ]}
                                        onChange={format => {
                                            this.setState({
                                                format
                                            });
                                        }}/>
                                </Col>
                            </Row>*/}

                            <Row style={{margin: 0, padding: 15}}>
                                { beforeCards.map(format => {
                                    const selected = this.state.format === format.title ? ' ms-selected' : '';
                                    return (<Col xs={12}>
                                        <SideCard
                                            preview={<Glyphicon glyph={format.preview || 'geoserver'} />}
                                            className={'ms-sm' + selected}
                                            title={format.title}
                                            description={format.description}
                                            caption={format.caption || ''}
                                            onClick={frmt => {
                                                this.setState({
                                                    format: frmt.title
                                                });
                                            }}/>
                                    </Col>);
                                })}
                            </Row>
                            { this.state.format === 'MARKDOWN' &&
                                <Row className="ms-editor-container">

                                        <div id="ms-markdown-editor">
                                            <ReactQuill
                                                bounds={"#ms-markdown-editor"}
                                                value={this.state.markdown || ''}
                                                onChange={(markdown) => {
                                                    this.setState({
                                                        markdown
                                                    });
                                                }}
                                                modules={{
                                                    toolbar: [
                                                    [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
                                                    [{ 'list': 'bullet' }, { 'align': [] }],
                                                    ['clean']
                                                ]}}/>
                                        </div>

                                </Row>
                            }
                            { this.state.format === 'TEXT' &&
                                <Row className="ms-editor-container">

                                        <div id="ms-markdown-editor">
                                            <TextViewer response={textMock} />
                                        </div>

                                </Row>

                            }
                            { this.state.format === 'HTML' &&
                                <Row className="ms-editor-container">

                                        <div id="ms-markdown-editor" className="ms-editor-html">
                                            <HTMLViewer response={htmlMock} />
                                        </div>

                                </Row>
                            }
                            { this.state.format === 'JSON' &&
                                <Row className="ms-editor-container">

                                        <div id="ms-markdown-editor">
                                            <JSONViewer response={jsonMock} />
                                        </div>

                                </Row>
                            }
                            <Row style={{margin: 0, padding: 15}}>
                                { afterCards.map(format => {
                                    return (<Col xs={12}>
                                        <SideCard
                                            preview={<Glyphicon glyph={format.preview || 'geoserver'} />}
                                            className={'ms-sm'}
                                            title={format.title}
                                            description={format.description}
                                            caption={format.caption || ''}
                                            onClick={frmt => {
                                                this.setState({
                                                    format: frmt.title
                                                });
                                            }}/>
                                    </Col>);
                                })}
                            </Row>
                        </Grid>}
                        {
                            this.state.page === 'chart' &&
                            <Grid fluid className="ms-chart-info-list" >
                                { this.state.addChart &&
                                    <WidgetsBuilder
                                        targetLayer
                                        editorData={{ ...(this.state.currentEdit && this.state.currentEdit.data || {}), type: this.state.currentEdit && this.state.currentEdit.type || this.state.type, legend: false}}
                                        step={this.state.step}
                                        onEditorChange={(key, value) => {
                                            if (key === 'type') {
                                                this.setState({ [key]: value, step: this.state.step + 1 });
                                            }
                                            if (key === 'title') {
                                                this.setState({ chartTitle: value});
                                            }
                                            if (key === 'description') {
                                                this.setState({ chartDesc: value});
                                            }
                                            this.setState({
                                                currentChartData: {...this.state.currentChartData, [key]: value}
                                            });
                                        }} />
                                }
                                { !this.state.addChart &&
                                    <ListCharts
                                        selected={this.state.selected}
                                        charts={this.state.charts}
                                        onSort={(newPos, oldCard) => {
                                            const charts = this.state.charts
                                                .reduce((a, chart, i) => {
                                                    if (oldCard.idd === i) {
                                                        return [...a];
                                                    }
                                                    if (i === newPos && i > oldCard.idd) {
                                                        return [...a, {...chart}, {...oldCard}];
                                                    }
                                                    if (i === newPos && i < oldCard.idd) {
                                                        return [...a, {...oldCard}, {...chart}];
                                                    }
                                                    return [...a, {...chart}];
                                                }, []);
                                            this.setState({
                                                charts
                                            });
                                        }}
                                        onClick={chart => {
                                            if (!!head(this.state.selected.filter(sel => sel === chart.id ))) {
                                                this.setState({
                                                    selected: this.state.selected.filter(sel => sel !== chart.id )
                                                });
                                            } else {
                                                this.setState({
                                                    selected: [chart.id]
                                                });
                                            }
                                        }}/>
                                }
                            </Grid>
                        }
                    </BorderLayout>
                </Dock>
                <Dock dockStyle={{height: 'calc(100% - 30px)'}} {...{...dockProps, position: 'right'}} isVisible={this.props.openInfo} size={500} >
                    <span className="ms-get-feature-results-panel">
                    <BorderLayout
                        header={
                            <PanelHeader
                                onClose={() => { this.props.setOption('clickMap', false); }}
                                title="Feature Info"
                                subtitle={null}
                                >
                                <Grid fluid>
                                    <Row>
                                        <Col xs={12}>
                                            <div><strong>Layer Title</strong></div>
                                            <div>Lat: 43.77323 - Long: 11.25632</div>
                                        </Col>
                                    </Row>
                                </Grid>
                                {this.state.charts.length > 0 && <Nav bsStyle="tabs" activeKey={this.state.infoPage || 'results'} justified>
                                   <NavItemT tooltip="Feature info results" eventKey="results" onClick={() => { this.setState({ infoPage: 'results'}); }}><Glyphicon glyph="ext-empty"/></NavItemT>
                                   <NavItemT tooltip="Feature Info charts" eventKey="charts" onClick={() => { this.setState({ infoPage: 'charts'}); }}><Glyphicon glyph="pie-chart"/></NavItemT>
                               </Nav>}


                                <Row>
                                    <Col xs={12}>
                                        <Toolbar
                                            btnDefaultProps={{ bsStyle: 'primary', className: 'square-button-md' }}
                                            buttons={[{
                                                glyph: 'arrow-left',
                                                tooltip: 'Previous feature',
                                                disabled: true,
                                                visible: this.state.infoPage === 'results'
                                            }, {
                                                glyph: 'arrow-right',
                                                tooltip: 'Next feature',
                                                disabled: true,
                                                visible: this.state.infoPage === 'results'
                                            }, {
                                                glyph: 'info-sign',
                                                tooltip: 'Address',
                                                onClick: () => {
                                                    this.setState({
                                                        showMoreInfo: true
                                                    });
                                                }
                                            }, {
                                                glyph: 'wrench',
                                                tooltip: 'General settings',
                                                disabled: true
                                            }]}
                                            />
                                        </Col>
                                        </Row>

                            </PanelHeader>
                        }>
                        <Grid fluid className="ms-body-double-scroll">
                            {this.state.infoPage === 'results' && <div className="ms-double-scroll">


                        { this.state.format === 'MARKDOWN' &&
                            <Row className="ms-editor-container">
                                <div className="ql-editor">
                                    <div dangerouslySetInnerHTML={{__html: this.state.markdown}}/>
                                </div>
                            </Row>
                        }
                        { this.state.format === 'TEXT' &&
                            <Row className="ms-editor-container">
                                <div id="ms-markdown-editor">
                                    <TextViewer response={textMock} />
                                </div>
                            </Row>

                        }
                        { this.state.format === 'HTML' &&
                            <Row className="ms-editor-container">
                                <div id="ms-markdown-editor" className="ms-editor-html">
                                    <HTMLViewer response={htmlMock} />
                                </div>
                            </Row>
                        }
                        { this.state.format === 'JSON' &&
                            <Row className="ms-editor-container">
                                <div id="ms-markdown-editor">
                                    <JSONViewer response={jsonMock} />
                                </div>
                            </Row>
                        }
                        </div>}
                        {this.state.infoPage === 'charts' && <div className="ms-double-scroll">
                            <Row>
                                {this.state.charts.map(chart =>
                                    <div style={{ margin: '30px 0' }}>
                                        <div className="text-center" style={{ width: 440, margin: '0 auto' }}><strong>{chart.title}</strong></div>
                                        <div className="text-center" style={{ width: 440, margin: '0 auto' }}>{chart.description}</div>
                                        <div style={{ width: 440, height: 200, margin: '10px auto 0 auto' }}>
                                            <ContainerDimensions>
                                                { ({width, height}) => <SampleChart width={width} height={height} type={chart.type} legend={false} /> }
                                            </ContainerDimensions>
                                        </div>
                                    </div>
                                )}

                            </Row>
                            </div>}
                        </Grid>
                    </BorderLayout>
                    </span>
                </Dock>
                <Portal>
                    <ResizableModal
                        title="Address"
                        size="xs"
                        show={this.state.showMoreInfo}
                        onClose={() => {
                            this.setState({
                                showMoreInfo: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'Close',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        showMoreInfo: false
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center" style={{padding: 10}}>
                                Cattedrale di Santa Maria del Fiore-DUOMO, Domplatz, Quartiere 1, Firenze, Città metropolitana di Firenze, Tuscany, 50123, Italia
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>
            </span>
        );
    }

}

const DockGetfeatureInfoPlugin = connect(state => ({
    openInfo: state.mockups && state.mockups.clickMap
}), {

    setOption
})(DockGetfeatureInfo);

module.exports = {
    DockGetfeatureInfoPlugin,
    reducers: {
        mockups: require('../reducers/mockups')
    }
};
