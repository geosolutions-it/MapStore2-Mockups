
const React = require('react');
const PropTypes = require('prop-types');
const ComboStyle = require('./ComboStyle');

const Combobox = require('react-widgets').Combobox;
const SwitchPanel = require('./SwitchPanel');
const ColorSelector = require('./ColorSelector');
const ColorRampSelector = require('./ColorRampSelector');
const StyleSelector = require('./StyleSelector');
const MarkerList = require('./MarkerList');
const ColorPicker = require('../../../../old_ms2_226bfec4/web/client/components/style/ColorPicker');
const Codemirror = require('react-codemirror');

const {Table, Row, Col, Nav, NavItem, Button, ButtonGroup, Glyphicon} = require('react-bootstrap');
const Slider = require('react-nouislider');

class StyleEditor extends React.Component {

    static propTypes = {
        id: PropTypes.string
    };

    static defaultProps = {
        id: ''
    };

    state = {
        enableEdit: false,
        enableClassification: false,
        enableCode: false,
        classificationOption: [],
        enableList: false
    };

    renderCode() {
        return (<div className="m-body-scroll-y">
            <Codemirror value="* { stroke: #000000;
    stroke-width: 0.5;
    fill: #0099cc;
}" options={{
                mode: {name: "css"},
                lineNumbers: true
            }} />
        </div>);
    }

    renderTab() {
        return (<SwitchPanel title={"Classification"} onSwitch={(expanded) => {
            this.setState({
                enableClassification: expanded
            });
        }}>
        <div className="mapstore-block-width">
            <Button className="square-button-md pull-right no-border" onClick={() => {
                this.setState( {
                        classificationOption: [],
                        openListPanel: false
                });
            }}>
                <Glyphicon glyph="1-close"/>
            </Button>
        </div>
        <Table responsive bordered>
    <thead>
      <tr>
        <th>Color</th>
        <th>Quantity</th>
        <th>Label</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><ColorPicker text="" value={{r: 159, g: 195, b: 255, a: 100}} /></td>
        <td>0.00</td>
        <td>0.00</td>
      </tr>
      <tr>
        <td><ColorPicker text="" value={{r: 97, g: 139, b: 208, a: 100}} /></td>
        <td>63.75</td>
        <td>63.75</td>
      </tr>
      <tr>
        <td><ColorPicker text="" value={{r: 66, g: 92, b: 136, a: 100}} /></td>
        <td>127.50</td>
        <td>127.50</td>
      </tr>
      <tr>
        <td><ColorPicker text="" value={{r: 40, g: 56, b: 82, a: 100}} /></td>
        <td>191.25</td>
        <td>191.25</td>
      </tr>
      <tr>
        <td colSpan="3"><Button bsStyle="primary" className="square-button-md pull-right" >
            <Glyphicon glyph="plus"/>
        </Button> </td>

      </tr>
    </tbody>
  </Table>

        </SwitchPanel>

        );
    }

    renderEdit() {
        return (<div className="m-body-scroll-y">

            {!this.state.enableClassification ? <SwitchPanel title={"Basic"} expanded locked>
            <div style={{/*width: '50%', marginLeft: '25%'*/}}>

            <div>

                <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Marker:
                </Col>
                <Col xs={6}>
                    <MarkerList />
                </Col>
                </Row>
                </div>

            </div>
                <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Marker size:
                </Col>
                <Col xs={6}>
                    <div className="mapstore-slider with-tooltip">
                        <Slider tooltips start={20} format={{
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
                        Fill:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={{r: 147, g: 96, b: 237, a: 100}}/>
                    </Col>
                    </Row>
                </div>

                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Stroke:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={{r: 52, g: 52, b: 52, a: 100}}/>
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
                        <Slider tooltips start={20} format={{
                                       from: value => Math.round(value),
                                       to: value => Math.round(value) + ' px'
                                   }} range={{min: 0, max: 100}} />
                                   </div>
                    </Col>
                    </Row>
                </div>

</div>
            </SwitchPanel> : null}

            {this.state.openListPanel ? this.renderTab() : (<SwitchPanel title={"Classification"} onSwitch={(expanded) => {
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
                }); }} data={['Quantile', 'Equal Interval', 'Natural breaks']} placeholder="Select classification"/>
                </Col>
                </Row>
            </div>

            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Class:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    this.setState({
                    classificationOption: this.state.classificationOption.indexOf('Class') === -1 ? [...this.state.classificationOption, 'Class'] : this.state.classificationOption
                }); }} data={['5', '6', '7', '8', '9']} placeholder="Select class"/>
                </Col>
                </Row>
            </div>

            </SwitchPanel>)}

            <SwitchPanel title={"Label"}>

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
                        Color:
                    </Col>
                    <Col xs={6}>
                    <ColorSelector color={{r: 52, g: 52, b: 52, a: 100}} />
                    </Col>
                    </Row>
                </div>

            </SwitchPanel>
        </div> );
    }

    renderSimple() {
        return (
        <StyleSelector/>
        );
    }

    renderBody() {
        return this.state.enableCode ? this.renderCode() : this.renderSimple();
    }

    render() {
        return (<div className="mapstore-flex-container">
            <div className="m-header">
                <div className="mapstore-block-width">
                    <a href="#/toc"><Button className="square-button no-border">
                        <Glyphicon glyph="arrow-left"/>
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
                    <NavItem eventKey="3">Style</NavItem>
                    <NavItem eventKey="4" href="#/statistical">Analysis</NavItem>
                    <NavItem eventKey="5" disabled>Elevation</NavItem>
                </Nav>
                {!this.state.enableEdit ?
                    <ComboStyle
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
                        }}/>
                    : <div className="mapstore-block-width text-center">
                        <ButtonGroup className="pull-left m-square-group-md">
                            <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    enableEdit: false,
                                    enableClassification: false,
                                    classificationOption: [],
                                    openListPanel: false
                                });
                            }}>
                                <Glyphicon glyph="arrow-left"/>
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup className="pull-right m-square-group-md">

                            <Button bsStyle="primary" className="square-button-md" onClick={() => {
                                this.setState({
                                    openListPanel: this.state.classificationOption.length >= 3
                                });
                            }}>
                                <Glyphicon glyph="export" />
                            </Button>
                        </ButtonGroup>
                    </div>
                }


            </div>

            {this.state.enableEdit ? this.renderBody() : <div className="m-body-scroll-y no-overflow-y">{/*<Codemirror options={{
                    mode: {name: "css"},
                    lineNumbers: true
                }} />*/}<Glyphicon className="m-glyph-placeholder" glyph="1-stilo" /></div>}

            <div className="m-footer">
                <div className="mapstore-block-width">
                    <div className="mapstore-block-width">
                        <ButtonGroup className="pull-right m-square-group-md"/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

module.exports = StyleEditor;
