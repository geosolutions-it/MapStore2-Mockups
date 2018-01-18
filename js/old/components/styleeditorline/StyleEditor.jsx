
const React = require('react');
const PropTypes = require('prop-types');

const ConfirmModal = require('../../../../MapStore2/web/client/components/maps/modals/ConfirmModal');
const Combobox = require('react-widgets').Combobox;
const SwitchPanel = require('./SwitchPanel');
const ColorSelector = require('./ColorSelector');
const ColorRampSelector = require('./ColorRampSelector');
const StyleSelector = require('./StyleSelector');
const AddPage = require('./AddPage');
const ClassificationTable = require('./ClassificationTable');
const LineThumb = require('./LineThumb');

const MarkerList = require('./MarkerList');
const ColorPicker = require('../../../../MapStore2/web/client/components/style/ColorPicker');
const Codemirror = require('react-codemirror');
const FakeIcons = require('../FakeIcons');
const {FormGroup, FormControl, OverlayTrigger, Tooltip, Table, Row, Col, Nav, NavItem, Button, ButtonGroup, Glyphicon} = require('react-bootstrap');
const Slider = require('react-nouislider');

class StyleEditor extends React.Component {

    static propTypes = {
        id: PropTypes.string
    };

    static defaultProps = {
        id: ''
    };

    state = {
        isChanged: false,
        enableEdit: false,
        enableClassification: false,
        enableCode: false,
        classificationOption: [],
        enableList: false,
        custom: {
            id: '000',
            title: 'Default',
            code: "* {\n\tstroke: #f2f2f2, #333333;\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}",
            glyph: 'star',
            stroke: '#f2f2f2',
            fill: '#333333',
            symbol: 'star'
        },
        codeString: '* { }',
        geoserverStyles: [{
            id: '000',
            title: 'Default',
            code: "* {\n\tstroke: #f2f2f2, #333333;\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}",
            glyph: 'star',
            stroke: '#f2f2f2',
            fill: '#333333',
            symbol: 'star',
            style: 'solid'
        },
        {
            id: '001',
            title: 'Custom style for line',
            desc: 'custom',
            code: "* {\n\tstroke: #333333, #f2f2f2;\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}",
            glyph: 'star',
            stroke: '#333333',
            fill: '#f2f2f2',
            symbol: 'star',
            style: 'solid'
        },
        {
            id: '003',
            title: 'Default line',
            desc: 'line',
            code: "* {\n\tstroke: #AA00AA, #00AA00;\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}",
            glyph: 'star',
            stroke: '#AA00AA',
            fill: '#00AA00',
            symbol: 'star',
            style: 'solid'
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
        return (<SwitchPanel title={"Classification"} locked onSwitch={(expanded) => {
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

        </SwitchPanel>

        );
    }

    renderEdit() {
        return (<div className="m-body-scroll-y">

            {!this.state.enableClassification ? <SwitchPanel title={"Basic"} expanded={this.state.custom.glyph !== 'font'}>
            <div style={{/*width: '50%', marginLeft: '25%'*/}}>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Stroke:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={this.state.custom.fillMock}/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Stroke width:
                    </Col>
                    <Col xs={6}>
                        <div className="mapstore-slider with-tooltip">
                        <Slider tooltips start={2} format={{
                                       from: value => Math.round(value),
                                       to: value => Math.round(value) + ' px'
                                   }} range={{min: 0, max: 100}} />
                                   </div>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Stroke outer:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={this.state.custom.strokeMock}/>
                    </Col>
                    </Row>
                </div>


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Stroke outer width:
                    </Col>
                    <Col xs={6}>
                        <div className="mapstore-slider with-tooltip">
                        <Slider tooltips start={4} format={{
                                       from: value => Math.round(value),
                                       to: value => Math.round(value) + ' px'
                                   }} range={{min: 0, max: 100}} />
                                   </div>
                    </Col>
                    </Row>
                </div>


                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Dash offset:
                    </Col>
                    <Col xs={6}>
                        <div className="mapstore-slider with-tooltip">
                        <Slider tooltips start={this.state.custom.style === 'dashed' ? 5 : 0} format={{
                                       from: value => Math.round(value),
                                       to: value => Math.round(value) + ' px'
                                   }} range={{min: 0, max: 20}} />
                                   </div>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Line cap:
                    </Col>
                    <Col xs={6}>
                        <Combobox value={this.state.custom.linecap} data={['butt', 'square', 'round']} placeholder="Select line cap"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Line join:
                    </Col>
                    <Col xs={6}>
                        <Combobox value={this.state.custom.linejoin} data={['miter', 'round', 'bevel']} placeholder="Select line join"/>
                    </Col>
                    </Row>
                </div>

</div>
            </SwitchPanel> : null}

            {this.state.openListPanel ? this.renderTab() : (<SwitchPanel title={"Classification"} expanded={this.state.classExpanded} onSwitch={(expanded) => {
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
                    Attribute:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    this.setState({
                    classificationOption: this.state.classificationOption.indexOf('Attribute') === -1 ? [...this.state.classificationOption, 'Attribute'] : this.state.classificationOption
                }); }} data={['Tipologie Edilizie', 'Population']} placeholder="Select attribute"/>
                </Col>
                </Row>
            </div>

            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Classification:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    this.setState({
                    classificationOption: this.state.classificationOption.indexOf('Classification') === -1 ? [...this.state.classificationOption, 'Classification'] : this.state.classificationOption
                }); }} data={['Recode', 'Categorize', 'Interpolate']} placeholder="Select classification"/>
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

            </SwitchPanel>)}

            <SwitchPanel title={"Label"} expanded={this.state.custom.glyph === 'font'}>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Attribute:
                    </Col>
                    <Col xs={6}>
                    <Combobox data={['Tipologie Edilizie', 'Population']} placeholder="Select attribute"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Font family:
                    </Col>
                    <Col xs={6}>
                    <Combobox data={['OpenSans', 'Arial', 'Impact', 'Garamond']} placeholder="Select font family"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Font size:
                    </Col>
                    <Col xs={6}>
                        <div className="mapstore-slider with-tooltip">
                        <Slider tooltips start={18} format={{
                                       from: value => Math.round(value),
                                       to: value => Math.round(value) + ' px'
                                   }} range={{min: 0, max: 30}} />
                                   </div>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Font style:
                    </Col>
                    <Col xs={6}>
                        <Combobox data={['normal', 'italic', 'oblique']} placeholder="Select font style"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Font weight:
                    </Col>
                    <Col xs={6}>
                        <Combobox data={['normal', 'bold']} placeholder="Select font weight"/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Color:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={{r: 52, g: 52, b: 52, a: 100}} />
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Halo:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={{r: 240, g: 240, b: 240, a: 100}} />
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
           <SwitchPanel title={"Unit"}>
               <div className="mapstore-block-width">
                   <Row>
                   <Col xs={6}>
                       Unit of measure:
                   </Col>
                   <Col xs={6}>
                       <Combobox value="pixel" data={['pixel', 'meter']} placeholder="Select unit of measure"/>
                   </Col>
                   </Row>
               </div>
          </SwitchPanel>
        </div> );
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
        const p = Object.assign({}, this.state.custom);
        return (<span>
            {p.glyph !== 'font' ? <div style={{width: 200, height: 200, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}><LineThumb linecap={p.linecap} linejoin={p.linejoin} style={p.style} stroke={p.fill} strokeOuter={p.stroke}/></div> :
            <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke, color: p.fill, width: 132, height: 12, fontSize: 30}}>{'label'}</div>}


                <div className="shadow-soft" style={{top: 0, position: 'absolute', width: 500, height: '100%', backgroundColor: '#fff', zIndex: 5}}><div className="mapstore-flex-container">
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
                                            codeString: this.state.custom.style === 'solid' ? "* {\n\tstroke: " + this.state.custom.stroke + ", " + this.state.custom.fill + ";\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}" : "* {\n\tstroke: " + this.state.custom.stroke + ", " + this.state.custom.fill + ";\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n\tstroke-dasharray: 5 2;\n}"
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
                                codeString: this.state.custom.style === 'solid' ? "* {\n\tstroke: " + this.state.custom.stroke + ", " + this.state.custom.fill + ";\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n}" : "* {\n\tstroke: " + this.state.custom.stroke + ", " + this.state.custom.fill + ";\n\tstroke-width: 4px, 1px;\n\tz-index: 0, 1;\n\tstroke-dasharray: 5 2;\n}"
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
