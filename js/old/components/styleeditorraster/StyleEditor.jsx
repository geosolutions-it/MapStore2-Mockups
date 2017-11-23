
const React = require('react');
const PropTypes = require('prop-types');

const ConfirmModal = require('../../../../MapStore2/web/client/components/maps/modals/ConfirmModal');
const SimpleChart = require('../../../../MapStore2/web/client/components/charts/SimpleChart');
const Combobox = require('react-widgets').Combobox;
const SwitchPanel = require('./SwitchPanel');
const ColorSelector = require('./ColorSelector');
const ColorRampSelector = require('./ColorRampSelector');
const StyleSelector = require('./StyleSelector');
const AddPage = require('./AddPage');
const ClassificationTable = require('./ClassificationTable');
const ContainerDimensions = require('react-container-dimensions').default;

const MarkerList = require('./MarkerList');
const ColorPicker = require('../../../../MapStore2/web/client/components/style/ColorPicker');
const Codemirror = require('react-codemirror');

const FakeIcons = require('../FakeIcons');
const {FormGroup, FormControl, OverlayTrigger, Tooltip, Table, Row, Col, Nav, NavItem, Button, ButtonGroup, Glyphicon} = require('react-bootstrap');
const Slider = require('react-nouislider');

const data = [
      {name: 'Page A', band1: 4000, pv: 0, band3: 2400},
      {name: 'Page B', band1: 3000, pv: 1398, band3: 2210},
      {name: 'Page C', band1: 2000, pv: 8000, band3: 2290},
      {name: 'Page D', band1: 2780, pv: 9800, band3: 2000},
      {name: 'Page E', band1: 1890, pv: 8000, band3: 2181},
      {name: 'Page F', band1: 2390, pv: 1500, band3: 2500},
      {name: 'Page G', band1: 3490, pv: 0, band3: 2100}
];

class StyleEditor extends React.Component {

    static propTypes = {
        id: PropTypes.string
    };

    static defaultProps = {
        id: ''
    };

    state = {
        typeFunction: 'gray',
        isChanged: false,
        enableEdit: false,
        enableClassification: false,
        enableCode: false,
        classificationOption: [],
        enableList: false,
        custom: {
            id: '000',
            title: 'Default',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #333333;\n\tstroke: #f2f2f2;\n}",
            glyph: 'star',
            stroke: '#f2f2f2',
            fill: '#333333',
            symbol: 'star'
        },
        codeString: '* { }',
        geoserverStyles: [{
            id: '000',
            title: 'Default',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #333333;\n\tstroke: #f2f2f2;\n}",
            glyph: 'star',
            stroke: '#f2f2f2',
            fill: '#333333',
            symbol: 'star'
        },
        {
            id: '001',
            title: 'Custom style for raster',
            desc: 'custom',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #f2f2f2;\n\tstroke: #333333;\n}",
            glyph: 'star',
            stroke: '#333333',
            fill: '#f2f2f2',
            symbol: 'star'
        },
        {
            id: '003',
            title: 'Default raster',
            desc: 'raster',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #00AA00;\n\tstroke: #AA00AA;\n}",
            glyph: 'star',
            stroke: '#AA00AA',
            fill: '#00AA00',
            symbol: 'star'
        }],
        tableRows: [{
            color: {r: 159, g: 195, b: 255, a: 100 },
            quantity: 0.00,
            label: 0.00
        }, {
            color: {r: 97, g: 139, b: 208, a: 100 },
            quantity: 63.75,
            label: 63.75
        }, {
            color: {r: 66, g: 92, b: 136, a: 100 },
            quantity: 127.50,
            label: 127.50
        }, {
            color: { r: 40, g: 56, b: 82, a: 100 },
            quantity: 191.25,
            label: 191.25
        }, {
            color: { r: 10, g: 56, b: 82, a: 100 },
            quantity: 250.15,
            label: 250.15
        } ],
        originalRows: [{
            color: {r: 159, g: 195, b: 255, a: 100 },
            quantity: 0.00,
            label: 0.00
        }, {
            color: {r: 97, g: 139, b: 208, a: 100 },
            quantity: 63.75,
            label: 63.75
        }, {
            color: {r: 66, g: 92, b: 136, a: 100 },
            quantity: 127.50,
            label: 127.50
        }, {
            color: { r: 40, g: 56, b: 82, a: 100 },
            quantity: 191.25,
            label: 191.25
        }, {
            color: { r: 10, g: 56, b: 82, a: 100 },
            quantity: 250.15,
            label: 250.15
        }],
        tableChecked: ''
    };

    componentWillMount() {
        this.count = 0;
        this.setState({
            custom: this.state.geoserverStyles[this.state.geoserverStyles.length - 1]
        });
    }

    componentWillUpdate(newProps, newState) {
        if (this.state.custom !== newState.custom) {
            if (newState.custom.glyph === 'list') {
                this.setState({
                    enableClassification: true,
                    classExpanded: true
                });
            } else {
                this.setState({
                    enableClassification: false,
                    classExpanded: false
                });
            }
        }
    }

    renderCode() {
        return (<div className="m-body-scroll-y">
            <Codemirror value={this.state.codeString} onChange={() => {
                this.setState({
                    isChanged: true
                });
            }} options={{
                mode: {name: "css"},
                lineNumbers: true
            }} />
        </div>);
    }

    renderTab() {
        return (<span><SwitchPanel title={"Classification"} locked onSwitch={(expanded) => {
            this.setState({
                enableClassification: expanded
            });
        }}>

        <ClassificationTable rows={this.state.tableRows} edit={this.state.editListPanel} onChangeText={(row, idx) => {
            this.setState({
                tableRows: this.state.tableRows.map((r, i) => idx === i ? row : r)
            });
        }}

        onSelect={(idx) => {
            this.setState({
                tableChecked: idx
            });
        }}/>

        </SwitchPanel><SwitchPanel title={"Scale"}>
            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Layer happears after:
                </Col>
                <Col xs={6}>
                    <FormControl

                        type="text" placeholder="Enter scale denominator"/>
                </Col>
                </Row>
            </div>

            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Layer happears before:
                </Col>
                <Col xs={6}>
                    <FormControl

                        type="text" placeholder="Enter scale denominator"/>
                </Col>
                </Row>
            </div>

            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Layer happears between:
                </Col>
                <Col xs={6}>
                    <Col xs={6} style={{'float': 'left', padding: 0}}>
                        <FormControl
                            type="text" />
                    </Col>
                    <Col xs={6} style={{'float': 'right', padding: 0}}>
                        <FormControl
                            type="text" />
                    </Col>
                </Col>
                </Row>
            </div>

       </SwitchPanel></span>

        );
    }


    renderRGB() {
        return (<div className="m-body-scroll-y">

            <SwitchPanel title={"Red band"} expanded>


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Band:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="1" data={['1', '2', '3']} placeholder="Select band"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Enhancement:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Normalize" data={['Normalize', 'Gamma correction', 'Histogram']} placeholder="Select enhancement"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Algorithm:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Clip" data={['Stretch', 'Clip', 'Clip to zero']} placeholder="Select algorithm"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Min value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter min value"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Max value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter max value"/>
                    </Col>
                    </Row>
                </div>


            </SwitchPanel>

            <SwitchPanel title={"Green band"} >


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Band:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="1" data={['1', '2', '3']} placeholder="Select band"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Enhancement:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Normalize" data={['Normalize', 'Gamma correction', 'Histogram']} placeholder="Select enhancement"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Algorithm:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Clip" data={['Stretch', 'Clip', 'Clip to zero']} placeholder="Select algorithm"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Min value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter min value"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Max value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter max value"/>
                    </Col>
                    </Row>
                </div>


            </SwitchPanel>

            <SwitchPanel title={"Blue band"}>


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Band:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="1" data={['1', '2', '3']} placeholder="Select band"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Enhancement:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Normalize" data={['Normalize', 'Gamma correction', 'Histogram']} placeholder="Select enhancement"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Algorithm:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Clip" data={['Stretch', 'Clip', 'Clip to zero']} placeholder="Select algorithm"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Min value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter min value"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Max value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter max value"/>
                    </Col>
                    </Row>
                </div>

            </SwitchPanel><SwitchPanel title={"Scale"}>
                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears after:
                    </Col>
                    <Col xs={6}>
                        <FormControl

                            type="text" placeholder="Enter scale denominator"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears before:
                    </Col>
                    <Col xs={6}>
                        <FormControl

                            type="text" placeholder="Enter scale denominator"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears between:
                    </Col>
                    <Col xs={6}>
                        <Col xs={6} style={{'float': 'left', padding: 0}}>
                            <FormControl
                                type="text" />
                        </Col>
                        <Col xs={6} style={{'float': 'right', padding: 0}}>
                            <FormControl
                                type="text" />
                        </Col>
                    </Col>
                    </Row>
                </div>

           </SwitchPanel>

        </div>);
    }

    renderPseudo() {
        return (<div className="m-body-scroll-y">{this.state.openListPanel ? this.renderTab() : <span><SwitchPanel title={"Pseudo"} expanded onSwitch={(expanded) => {
            this.setState({
                enableClassification: expanded
            });
        }}>

        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Color ramp:
            </Col>
            <Col xs={6}>
            <ColorRampSelector/>
            </Col>
            </Row>
        </div>
        <div className="mapstore-block-width">
        <Row>
        <Col xs={6}>
            Class:
        </Col>
        <Col xs={6}>
            <div className="mapstore-slider with-tooltip">
                <Slider tooltips start={5} range={{min: 0, max: 20}} format={{
                           from: value => Math.round(value),
                           to: value => Math.floor(value)
                       }} onChange={() => {
                           this.setState({
                           classificationOption: this.state.classificationOption.indexOf('Class') === -1 ? [...this.state.classificationOption, 'Class'] : this.state.classificationOption
                       });
                       }}/>
                </div>
        </Col>
        </Row>
        </div>
        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Min value:
            </Col>
            <Col xs={6}>
                <FormControl
                    onChange={(e) => {

                        this.setState({
                        attributeChartTitle: e.target.value
                    }); }}
                    type="text" placeholder="Enter min value"/>
            </Col>
            </Row>
        </div>

        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Max value:
            </Col>
            <Col xs={6}>
                <FormControl
                    onChange={(e) => {

                        this.setState({
                        attributeChartTitle: e.target.value
                    }); }}
                    type="text" placeholder="Enter max value"/>
            </Col>
            </Row>
        </div>

    </SwitchPanel><SwitchPanel title={"Scale"}>
        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Layer happears after:
            </Col>
            <Col xs={6}>
                <FormControl

                    type="text" placeholder="Enter scale denominator"/>
            </Col>
            </Row>
        </div>

        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Layer happears before:
            </Col>
            <Col xs={6}>
                <FormControl

                    type="text" placeholder="Enter scale denominator"/>
            </Col>
            </Row>
        </div>

        <div className="mapstore-block-width">
            <Row>
            <Col xs={6}>
                Layer happears between:
            </Col>
            <Col xs={6}>
                <Col xs={6} style={{'float': 'left', padding: 0}}>
                    <FormControl
                        type="text" />
                </Col>
                <Col xs={6} style={{'float': 'right', padding: 0}}>
                    <FormControl
                        type="text" />
                </Col>
            </Col>
            </Row>
        </div>

   </SwitchPanel></span>}</div>);
    }

    renderGray() {
        return (<div className="m-body-scroll-y">

            <SwitchPanel title={"Gray Scale"} expanded>


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Band:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="1" data={['1', '2', '3']} placeholder="Select band"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Enhancement:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Normalize" data={['Normalize', 'Gamma correction', 'Histogram']} placeholder="Select enhancement"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Algorithm:
                    </Col>
                    <Col xs={6}>
                    <Combobox value="Clip" data={['Stretch', 'Clip', 'Clip to zero']} placeholder="Select algorithm"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Min value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter min value"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Max value:
                    </Col>
                    <Col xs={6}>
                        <FormControl
                            onChange={(e) => {

                                this.setState({
                                attributeChartTitle: e.target.value
                            }); }}
                            type="text" placeholder="Enter max value"/>
                    </Col>
                    </Row>
                </div>


            </SwitchPanel>
            <SwitchPanel title={"Scale"}>
                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears after:
                    </Col>
                    <Col xs={6}>
                        <FormControl

                            type="text" placeholder="Enter scale denominator"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears before:
                    </Col>
                    <Col xs={6}>
                        <FormControl

                            type="text" placeholder="Enter scale denominator"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Layer happears between:
                    </Col>
                    <Col xs={6}>
                        <Col xs={6} style={{'float': 'left', padding: 0}}>
                            <FormControl
                                type="text" />
                        </Col>
                        <Col xs={6} style={{'float': 'right', padding: 0}}>
                            <FormControl
                                type="text" />
                        </Col>
                    </Col>
                    </Row>
                </div>

           </SwitchPanel>
        </div> );
    }

    renderEdit() {
        switch (this.state.typeFunction) {
            case 'gray':
            return this.renderGray();
            case 'rgb':
            return this.renderRGB();
            case 'pseudo':
            return this.renderPseudo();
            default:
            return null;
        }
    }

    renderSimple() {
        return (
        <StyleSelector
            selected={'point:' + this.state.geoserverStyles[this.state.geoserverStyles.length - 1].id}
            geoserverStyles={this.state.geoserverStyles}
            onChangeText={(text) => {
                this.setState({
                    geoserverStyles: this.state.geoserverStyles.map(g => g.id === this.state.custom.id ? Object.assign({}, g, text) : g)
                });
            }}
            onClick={(style) => {
                this.setState({
                    custom: style
                });
            }}
            onEdit={(style) => {
                this.setState({
                    custom: style,
                    enableEdit: true,
                    enableCode: false
                });
            }}

            onCode={(style) => {
                this.setState({
                    codeString: style.code,
                    enableEdit: true,
                    enableCode: true
                });
            }}

            />
        );
    }

    renderAdd() {
        return (<AddPage
            onClick={(style) => {
                if (style) {
                    this.setState({
                        custom: style
                    });
                } else {
                    this.setState({
                        custom: this.state.geoserverStyles[0]
                    });
                }

            }}
            onEdit={(style) => {
                this.setState({
                    custom: style,
                    addPage: false,
                    enableEdit: true,
                    enableCode: false
                });
            }}

            onCode={(style) => {
                this.setState({
                    codeString: '* {\n\n}',
                    custom: Object.assign({}, style, {glyph: ''}),
                    addPage: false,
                    enableEdit: true,
                    enableCode: true
                });
            }}/>);
    }

    renderBody() {
        return this.state.enableCode ? this.renderCode() : this.renderEdit();
    }

    renderEditStep() {
        return this.state.enableEdit ? this.renderBody() : this.renderSimple();
    }
    /*<ComboStyle
        onToggle={() => {
            this.setState({
                enableEdit: true,
                enableClassification: false,
                enableCode: false
            });
        }}

        onCode={() => {
            this.setState({
                enableEdit: true,
                enableCode: true
            });
        }}/>*/
    render() {
        // const p = Object.assign({}, this.state.custom);
        return (<span>
            {/*<FakeIcons style={p}/>*/}

                <div className="shadow-soft" style={{position: 'absolute', width: 500, height: '100%', backgroundColor: '#fff', zIndex: 5}}><div className="mapstore-flex-container">
            <div className="m-header">
                <div className="mapstore-block-width">
                    <a href="#/toc"><Button className="square-button no-border">
                        <Glyphicon glyph="1-close"/>
                    </Button></a>
                    <Button className="square-button pull-right no-border">
                        <Glyphicon glyph="1-stilo"/>
                    </Button>
                </div>
                <div className="mapstore-block-width text-center">
                    Layer Title
                </div>
                <Nav bsStyle="tabs" activeKey="3" justified>
                    <NavItem eventKey="1" disabled>General</NavItem>
                    <NavItem eventKey="2" disabled>Display</NavItem>
                    <NavItem eventKey="4" href="#/statistical">Analysis</NavItem>
                    <NavItem eventKey="3">Style</NavItem>
                    <NavItem eventKey="5" disabled>Elevation</NavItem>
                </Nav>
                {!this.state.enableEdit ?

                        <div className="mapstore-block-width text-center">

                            <ButtonGroup className="m-square-group-md">
                                {this.state.addPage ? null : <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Reload styles</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md">
                                    <Glyphicon glyph="refresh" />
                                </Button>
                                </OverlayTrigger>}
                                {!this.state.addPage ? null : <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Back to style selection</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    this.setState({ addPage: false,
                                        custom: this.state.geoserverStyles[this.state.geoserverStyles.length - 1]

                                    });
                                }}>
                                    <Glyphicon glyph="arrow-left" />
                                </Button>
                                </OverlayTrigger>}
                                {this.state.addPage ? null : <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Add new style</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    this.setState({ addPage: true});
                                }}>
                                    <Glyphicon glyph="plus" />
                                </Button>
                                </OverlayTrigger>}

                                {!this.state.addPage && (this.state.custom.code && this.state.custom.id !== '000') ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Remove Selected style</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    this.setState({
                                        showRemove: true
                                    });
                                }}>
                                    <Glyphicon glyph="trash" />
                                </Button>
                                </OverlayTrigger> : null}




                                {!this.state.addPage ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Duplicate  selected style</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    this.setState({
                                        geoserverStyles: [...this.state.geoserverStyles, Object.assign({}, this.state.custom, {id: this.count++, title: 'Copy of ' + this.state.custom.title || this.state.custom.name})],
                                        custom: Object.assign({}, this.state.custom, {id: this.count++, title: 'Copy of ' + this.state.custom.title || this.state.custom.name})
                                    });
                                }}>
                                    <Glyphicon glyph="duplicate" />
                                </Button>
                                </OverlayTrigger> : null}
                                {(this.state.custom.code && this.state.custom.id !== '000' && !this.state.addPage) || !this.state.custom.code ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Edit Selected style</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    if (this.state.custom.code) {
                                        this.setState({
                                            codeString: this.state.custom.code,
                                            enableEdit: true,
                                            enableCode: true
                                        });
                                    } else {
                                        this.setState({
                                            addPage: false,
                                            enableEdit: true,
                                            enableCode: false
                                        });
                                    }

                                }}>
                                    <Glyphicon glyph="pencil" />
                                </Button>
                            </OverlayTrigger> : null}
                                {this.state.addPage ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-code">Open textarea editor</Tooltip>}>
                                <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                    if (this.state.custom.code) {
                                        this.setState({
                                            enableEdit: true,
                                            enableCode: true,
                                            addPage: false,
                                            codeString: '* {\n\n}'
                                        });
                                    } else {
                                        this.setState({
                                            enableEdit: true,
                                            enableCode: true,
                                            addPage: false,
                                            codeString: '* {\n\n}'
                                        });
                                    }

                                }}>
                                    <Glyphicon glyph="code" />
                                </Button>
                            </OverlayTrigger> : null}

                            {this.state.addPage && !this.state.custom.code ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-save">Save current style</Tooltip>}>
                            <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    showSave: true
                                });
                            }}>
                                <Glyphicon glyph="floppy-disk"/>
                            </Button>
                        </OverlayTrigger> : null}
                            </ButtonGroup>
                        </div>
                    : <div className="mapstore-block-width text-center">
                        <ButtonGroup className="m-square-group-md">
                            {!this.state.editListPanel && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Back to select style</Tooltip>}>
                            <Button bsStyle="primary" className="square-button-md" onClick={() => {


                                if (this.state.isChanged) {
                                    this.setState({
                                            showExit: true,
                                            editListPanel: false,
                                                custom: this.state.geoserverStyles[this.state.geoserverStyles.length - 1]
                                    });
                                } else {
                                    this.setState({
                                        enableEdit: false,
                                        enableClassification: false,
                                        classificationOption: [],
                                        openListPanel: false,
                                        showExit: false,
                                        isChanged: false,
                                        editListPanel: false,
                                            custom: this.state.geoserverStyles[this.state.geoserverStyles.length - 1]
                                    });
                                }

                            }}>
                                <Glyphicon glyph="arrow-left"/>
                            </Button>
                            </OverlayTrigger>}


                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Gray scale</Tooltip>}>
                            <Button active={this.state.typeFunction === 'gray'} bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    typeFunction: 'gray'
                                });
                            }}>
                                <Glyphicon glyph="gray-scale" />
                            </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">RGB bands</Tooltip>}>
                            <Button active={this.state.typeFunction === 'rgb'} bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    typeFunction: 'rgb'
                                });
                            }}>
                                <Glyphicon glyph="rgb" />
                            </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-reload">Pseudo color</Tooltip>}>
                            <Button active={this.state.typeFunction === 'pseudo'} bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    typeFunction: 'pseudo'
                                });
                            }}>
                                <Glyphicon glyph="list" />
                            </Button>
                            </OverlayTrigger>



                            {!this.state.editListPanel && this.state.openListPanel && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Clear classification</Tooltip>}><Button bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState( {
                                        classificationOption: [],
                                        openListPanel: false,
                                        editListPanel: false
                                });
                            }}>
                                <Glyphicon glyph="1-close"/>
                            </Button></OverlayTrigger>}


                        {this.state.openListPanel && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Edit classification</Tooltip>}><Button active={this.state.editListPanel} bsStyle="primary" className="square-button-md" onClick={() => {
                            this.setState( {
                                editListPanel: !this.state.editListPanel
                            });
                        }}>
                            <Glyphicon glyph="pencil"/>
                        </Button></OverlayTrigger>}
                        {this.state.openListPanel && this.state.editListPanel && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Add new row</Tooltip>}><Button onClick={() => {
                            this.setState({
                                tableRows: [...this.state.tableRows, {quantity: 0, label: 0, color: {r: 52, g: 52, b: 52, a: 100 }}]
                            });
                        }} bsStyle="primary" className="square-button-md">
                            <Glyphicon glyph="row-add"/>
                        </Button></OverlayTrigger>}
                        {this.state.openListPanel && this.state.editListPanel && this.state.tableChecked !== '' && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-back">Remove selected row</Tooltip>}><Button bsStyle="primary" className="square-button-md" onClick={() => {
                            this.setState( {
                                tableChecked: '',
                                tableRows: this.state.tableRows.filter((r, i) => i !== this.state.tableChecked)
                            });
                        }}>
                            <Glyphicon glyph="trash"/>
                        </Button></OverlayTrigger>}
                        {!this.state.editListPanel && <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-save">Save current style</Tooltip>}>
                        <Button bsStyle="primary" className="square-button-md" onClick={() => {
                            this.setState({
                                showSave: true
                            });
                        }}>
                            <Glyphicon glyph="floppy-disk"/>
                        </Button>
                        </OverlayTrigger>}
                        {this.state.enableClassification || this.state.enableCode ? null :
                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-code">Open textarea editor</Tooltip>}>
                        <Button onClick={() => {
                            this.setState({
                                enableEdit: true,
                                enableCode: true,
                                enableClassification: false,
                                classificationOption: [],
                                openListPanel: false,
                                editListPanel: false,
                                codeString: '* {\n\n}'
                            });
                        }} bsStyle="primary" className="square-button-md" >
                             <Glyphicon glyph="code" />
                        </Button></OverlayTrigger>}

                        </ButtonGroup>
                        {/*<ButtonGroup className="pull-right m-square-group-md">


                            <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    openListPanel: this.state.classificationOption.length >= 3
                                });
                            }}>
                                <Glyphicon glyph="export" />
                            </Button>
                        </ButtonGroup>*/}
                    </div>
                }


            </div>

            {this.state.addPage ? this.renderAdd() : this.renderEditStep()}

            <div className="m-footer">
                <div className="mapstore-block-width">
                    <div className="mapstore-block-width">
                        <ButtonGroup className="pull-right m-square-group-md"/>
                    </div>
                </div>
                <ConfirmModal
                    confirmText={'Save'} cancelText={'Cancel'} titleText={'Save'} body={
                        <span>
                            <div>Save the current style</div>
                            {this.state.custom.code ? null : <FormGroup controlId="stats-title">
                                <FormControl type="text" placeholder="Enter title of the style" onChange = {(e) => {
                                    this.setState({
                                        nameStyle: e.target.value
                                    });
                                }}/>
                            </FormGroup>}
                        </span>

                    }
                    show={this.state.showSave} onClose={() => {
                        this.setState({
                            showSave: false
                        });
                    }} onConfirm={() => {
                        if (this.state.addPage) {
                            this.setState({
                              geoserverStyles: this.state.custom.code ? [...this.state.geoserverStyles] : [...this.state.geoserverStyles, Object.assign({}, this.state.custom, {
                                id: this.count++,
                                title: this.state.nameStyle
                            })],
                              enableEdit: false,
                              enableClassification: false,
                              classificationOption: [],
                              openListPanel: false,
                              showSave: false,
                              showExit: false,
                              isChanged: false,
                              addPage: false
                            });
                        } else {
                            this.setState({
                              geoserverStyles: this.state.custom.code ? [...this.state.geoserverStyles] : [...this.state.geoserverStyles, {
                                id: this.count++,
                                title: this.state.nameStyle,
                                code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #333333;\n\tstroke: #f2f2f2;\n}",
                                glyph: 'star',
                                stroke: '#f2f2f2',
                                fill: '#333333',
                                symbol: 'star'
                            }],
                            showSave: false,
                            isChanged: false,
                            openListPanel: this.state.classificationOption.length >= 3,
                            tableRows: this.state.originalRows
                          });
                        }
                    }}/>
                <ConfirmModal
                    confirmText={'Yes'} cancelText={'No'} titleText={'Exit Edit Mode'} body={'Are you sure to exit from edit mode? Note: you will lose all the changes'} show={this.state.showExit} onClose={() => {
                        this.setState({
                                showExit: false
                        });
                    }} onConfirm={() => {
                        this.setState({
                            enableEdit: false,
                            enableClassification: false,
                            classificationOption: [],
                            openListPanel: false,
                            showExit: false,
                            isChanged: false
                        });
                    }}/>

                    <ConfirmModal
                        confirmText={'Yes'} cancelText={'No'} titleText={'Delete selected sytle'} body={'Do you want to remove current style?'} show={this.state.showRemove} onClose={() => {
                            this.setState({
                                showRemove: false
                            });
                        }} onConfirm={() => {
                            this.setState({
                                showRemove: false,
                                geoserverStyles: this.state.geoserverStyles.filter(st => st.id !== this.state.custom.id),
                                custom: this.state.geoserverStyles[0]
                            });
                        }}/>
            </div></div>
        </div></span>);
    }
}

module.exports = StyleEditor;
