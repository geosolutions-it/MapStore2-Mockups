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
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const WidgetsBuilder = require('../../MapStore2/web/client/components/widgets/builder/WidgetsBuilder');
const {Grid, Col, Row, Nav, NavItem, Glyphicon} = require('react-bootstrap');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const SideCard = require('../../MapStore2/web/client/components/misc/cardgrids/SideCard');

const HTMLViewer = require('../../MapStore2/web/client/components/data/identify/viewers/HTMLViewer');
const TextViewer = require('../../MapStore2/web/client/components/data/identify/viewers/TextViewer');
const JSONViewer = require('../../MapStore2/web/client/components/data/identify/viewers/JSONViewer');

const {head} = require('lodash');
const NavItemT = tooltip(NavItem);
const ReactQuill = require('react-quill');
// const {setOption} = require('../actions/mockups');
const { Combobox } = require('react-widgets');

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
        buttons: PropTypes.array
    };

    static defaultProps = {
        title: 'Layer Title'
    };

    render() {
        return (
            <Grid fluid className="ms-panel-header">
                <Row>
                    <Col xs={4}>
                        <Glyphicon glyph="1-close"/>
                    </Col>
                    <Col xs={4}>
                        <h4>{this.props.title}</h4>
                    </Col>
                    <Col xs={4}>
                        <Glyphicon glyph="map-marker"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h4><strong>Feature Info</strong></h4>
                    </Col>
                    { this.props.buttons &&
                        <Col xs={12}>
                            <Toolbar btnDefaultProps={{ bsStyle: 'primary', className: 'square-button-md' }} buttons={this.props.buttons}/>
                        </Col>
                    }
                </Row>
                {this.props.children}
            </Grid>
        );
    }
}

class ListCharts extends React.Component {
    static propTypes = {
        charts: PropTypes.array,
        onClick: PropTypes.func,
        selected: PropTypes.array
    };

    static defaultProps = {
        charts: [],
        onClick: () => {},
        selected: []
    };

    render() {
        return (
            <Row style={{margin: 0, padding: 15}}>
                { this.props.charts.map(chart => {
                    const select = !!head(this.props.selected.filter(sel => sel === chart.id)) ? ' ms-selected' : '';
                    return (<Col xs={12}>
                        <SideCard
                            preview={<Glyphicon glyph={chart.preview || 'geoserver'} />}
                            className={'ms-sm' + select}
                            title={chart.title}
                            description={chart.description}
                            caption={chart.caption || ''}
                            onClick={() => {
                                this.props.onClick(chart);
                            }}/>
                    </Col>);
                })}
            </Row>
        );
    }
}
let count = 0;
class DockGetfeatureInfo extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        width: PropTypes.number,
        onClose: PropTypes.func
    };

    static defaultProps = {
        open: true,
        width: 500,
        onClose: () => {}
    };

    state = {
        format: 'TEXT',
        page: 'format',
        step: 0,
        selected: [],
        charts: [{
            preview: 'pie-chart',
            title: 'Pie chart for feature info',
            description: 'My custom info chart',
            id: 'id:0'
        }]
    };

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
                                    visible: !!this.state.addChart && this.state.step > 0,
                                    onClick: () => {
                                        this.setState({
                                            step: this.state.step - 1
                                        });
                                    }
                                },
                                {
                                    glyph: 'arrow-right',
                                    tooltip: 'Go to next step',
                                    visible: !!this.state.addChart && this.state.step > 0 && this.state.step < 2,
                                    onClick: () => {
                                        this.setState({
                                            step: this.state.step + 1
                                        });
                                    }
                                },
                                {
                                    glyph: 'trash',
                                    tooltip: 'Delete selected chart',
                                    visible: !this.state.addChart && this.state.selected.length > 0,
                                    onClick: () => {
                                        this.setState({
                                            charts: this.state.charts.filter(ch => ch.id !== this.state.selected[0])
                                        });
                                    }
                                },
                                {
                                    glyph: 'pencil',
                                    tooltip: 'Edit selected chart',
                                    visible: !this.state.addChart && this.state.selected.length === 1,
                                    onClick: () => {

                                    }
                                },
                                {
                                    glyph: '1-close',
                                    tooltip: 'Exit from chart editing',
                                    visible: !!this.state.addChart && this.state.step === 0,
                                    onClick: () => {
                                        this.setState({
                                            addChart: false
                                        });
                                    }
                                },
                                {
                                    glyph: 'floppy-disk',
                                    tooltip: 'Save chart',
                                    visible: !!this.state.addChart && this.state.step === 2,
                                    onClick: () => {
                                        count++;
                                        this.setState({
                                            addChart: false,
                                            step: 0,
                                            charts: [...this.state.charts, {
                                                preview: 'pie-chart',
                                                type: this.state.type,
                                                title: 'Chart for feature info n.' + count,
                                                description: 'My custom info chart n.' + count,
                                                id: 'id:' + count
                                            }]
                                        });
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
                                            addChart: true
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
                        <Grid fluid style={{ width: '100%', padding: 0 }}>
                            { this.state.addChart &&
                                <WidgetsBuilder
                                    editorData={{ type: this.state.type, legend: false}}
                                    step={this.state.step}
                                    onEditorChange={(key, value) => {
                                        if (key === 'type') {
                                            this.setState({ [key]: value, step: this.state.step + 1 });
                                        }
                                    }} />
                            }
                            { !this.state.addChart &&
                                <ListCharts
                                    selected={this.state.selected}
                                    charts={this.state.charts}
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
        );
    }

}

const DockGetfeatureInfoPlugin = connect(() => ({}), {})(DockGetfeatureInfo);

module.exports = {
    DockGetfeatureInfoPlugin,
    reducers: {
        mockups: require('../reducers/mockups')
    }
};
