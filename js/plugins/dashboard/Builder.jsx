/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../../old_ms2_226bfec4/web/client/components/misc/toolbar/Toolbar');
const BorderLayout = require('../../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const ReactQuill = require('react-quill');
const WidgetsBuilder = require('../../../old_ms2_226bfec4/web/client/components/widgets/builder/WidgetsBuilder');
const {Grid, Row, Col, FormGroup, FormControl} = require('react-bootstrap');
const AttributeFilter = require('../../components/AttributeFilter');
const Select = require('react-select');
// const SwitchButton = require('../../../old_ms2_226bfec4/web/client/components/misc/switch/SwitchButton');
require('react-select/dist/react-select.css');

class Builder extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        onUpdate: PropTypes.func,
        onClearConnection: PropTypes.func,
        type: PropTypes.string,
        text: PropTypes.string,
        connectingMaps: PropTypes.bool,
        isConnected: PropTypes.bool,
        maps: PropTypes.array,
        step: PropTypes.number,
        statusEdit: PropTypes.string,
        chartType: PropTypes.string,
        onSave: PropTypes.func,
        onClear: PropTypes.func,
        onUpdateTitle: PropTypes.func,
        title: PropTypes.string,
        onUpdateCounter: PropTypes.func,
        counter: PropTypes.object
    };

    static defaultProps = {
        onClick: () => {},
        onChange: () => {},
        onUpdate: () => {},
        onClearConnection: () => {},
        type: 'text',
        text: '',
        connectingMaps: false,
        maps: [],
        step: 0,
        onSave: () => {},
        onClear: () => {},
        onUpdateTitle: () => {},
        onUpdateCounter: () => {},
        title: '',
        counter: {}
    };

    state = {
        step: 0,
        type: ''
    };

    componentWillMount() {
        if (this.props.type !== 'legend') {
            this.props.onUpdateTitle('Regions of Italy' );
        }
        this.setState({
            step: this.props.statusEdit === 'create' ? 0 : 1
        });
    }

    render() {
        const connectedButton = (this.props.type === 'table' && this.props.maps.length > 0) || (this.props.type === 'counter' && this.props.maps.length > 0) || this.props.type === 'legend' || (this.props.type === 'chart' && this.props.maps.length > 0 && this.state.step > 0) ? {
            glyph: this.props.isConnected ? 'plug' : 'unplug',
            tooltip: this.props.isConnected ? 'Clear connection' : 'Connect a Map',
            className: 'square-button-md',
            onClick: this.props.isConnected ? this.props.onClearConnection : this.props.onClick
        } : null;
        const previous = this.props.type === 'chart' && this.state.step >= 2 ? {
            glyph: 'arrow-left',
            className: 'square-button-md',
            onClick: () => {
                this.setState({
                    step: 1
                });
            }
        } : null;
        const filter = this.props.type === 'chart' && this.state.step > 0 ? {
            glyph: 'filter',
            className: 'square-button-md',
            tooltip: 'Configure a filter for the chart data'
        } : null;
        const next = this.props.type === 'chart' && this.state.step === 1 ? {
            glyph: 'arrow-right',
            className: 'square-button-md',
            onClick: () => {
                this.setState({
                    step: 2
                });
            }
        } : null;

        const save = this.props.type === 'table' || this.props.type === 'text' || this.props.type === 'counter' && this.props.counter.value
            || this.props.type === 'legend'
            || (this.props.type === 'chart' && this.state.step > 1) ? {
            glyph: 'floppy-disk',
            className: 'square-button-md',
            onClick: () => {
                this.props.onSave();
            }
        } : null;

        const close = this.props.type === 'table' || this.props.type === 'text' || this.props.type === 'counter'
            || this.props.type === 'legend'
            || (this.props.type === 'chart' && this.state.step > 1) ? {
            glyph: '1-close',
            className: 'square-button-md',
            onClick: () => {
                this.props.onClear();
            }
        } : null;

        const buttons = [previous, connectedButton, filter, next, save, close].filter(v => v);
        return (
            <div key="ms-dashboard-sources" className={this.props.type === 'legend' ? "ms-vertical-side with-toc" : "ms-vertical-side-type"}>
                <BorderLayout
                    header={
                        !this.props.connectingMaps ? <div className="ms-header-side">
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                                        <div className="m-title-side"></div>
                                    </Col>
                                    {this.props.type !== 'chart' && <Col xs={12}>
                                        <FormGroup>
                                            <FormControl
                                                value={this.props.title}
                                                placeholder="Title"
                                                onChange={e => {
                                                    this.props.onUpdateTitle(e.target.value);
                                                }}
                                                type="text"/>
                                        </FormGroup>
                                    </Col>}
                                    <Col xs={12} className="text-center">
                                    { (this.props.type === 'legend' || this.props.type === 'chart' || this.props.type === 'counter' || this.props.type === 'table' || this.props.type === 'text') &&
                                        <Toolbar
                                            btnDefaultProps={{ bsStyle: 'primary'}}
                                            buttons={buttons}/>
                                    }

                            {/*<Toolbar
                                btnDefaultProps={{ bsStyle: 'primary'}}
                                buttons={[
                                    {
                                        text: 'Connect a Map'
                                    }
                                ]}/>*/}</Col></Row></Grid></div> : null }>

                    {
                        this.props.type === 'text' && <div id="ms-details-editor">
                            <ReactQuill
                                bounds={"#ms-details-editor"}
                                value={this.props.text || ''}
                                onChange={(text) => {
                                    if (text && text !== '<p><br></p>') {
                                        this.props.onChange(text);
                                    }
                                }}
                                modules={{

                                    toolbar: [
                                    [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
                                    [{ 'list': 'bullet' }, { 'align': [] }],
                                    [{ 'color': [] }, { 'background': [] }, 'clean'], ['image', 'video', 'link']
                                ]}}/>
                        </div>
                    }

                    {
                        this.props.type === 'chart' && <div id="ms-details-editor">
                            {!this.props.connectingMaps && <WidgetsBuilder
                                step={this.state.step > 2 && 2 || this.state.step}
                                editorData={{ type: this.props.statusEdit === 'create' ? this.state.type : this.props.chartType, legend: false}}
                                isConnected={/*this.props.isConnected*/ false}
                                onClick={this.props.onClick}
                                maps={/*this.props.maps*/ []}
                                onEditorChange={(key, value) => {
                                    this.setState({ [key]: value, step: this.state.step + 1 });
                                    this.props.onUpdate(key, value);
                                    if (key === 'title') {
                                        this.props.onUpdateTitle(value);
                                    }

                                }}/>}
                                {this.props.connectingMaps && <div className="ms-dashboard-overlay">
                                    <span>Select a Map to connect with the chart</span>
                                </div>}
                        </div>
                    }
                    {
                        this.props.type === 'table' && <div id="ms-details-editor">

                            {!this.props.connectingMaps && <div className="ms-query-filter">
                                <AttributeFilter />
                            </div>}
                            {this.props.connectingMaps && <div className="ms-dashboard-overlay">
                                <span>Select a Map to connect with the table</span>
                            </div>}
                        </div>
                    }
                    {
                        this.props.type === 'legend' && <div id="ms-details-editor">
                            {this.props.connectingMaps && <div className="ms-dashboard-overlay">
                                <span>Select a map to generate a legend</span>
                            </div>}
                        </div>
                    }
                    {
                        this.props.type === 'counter' && <div id="ms-details-editor">
                            {!this.props.connectingMaps ?
                            <Grid fluid style={{ width: '100%' }}>
                                <Row>
                                    <Col xs={12}>
                                        <div style={{display: 'flex', width: '100%', overflow: 'hidden', height: 100}}>
                                            {this.props.counter.value && <div style={{margin: 'auto', fontSize: 52, textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold', overflow: 'hidden'}}>{this.props.counter.value} {this.props.counter.uOM}</div>}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        Value:
                                    </Col>
                                    <Col xs={6}>
                                        <Select
                                            clearable={false}
                                            value={this.props.counter && this.props.counter.attributeValue && {
                                                label: this.props.counter.attributeValue
                                            } || null}
                                            options={[
                                                {
                                                    label: 'area'
                                                },
                                                {
                                                    label: 'length'
                                                }
                                            ]}
                                            placeholder={'Select Attribute'}
                                            onChange={(options) => {
                                                this.props.onUpdateCounter('attributeValue', options.label);
                                            }}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        Operation:
                                    </Col>
                                    <Col xs={6}>
                                        <Select
                                            clearable={false}
                                            value={this.props.counter && this.props.counter.operation && {
                                                label: this.props.counter.operation
                                            } || null}
                                            options={[
                                                {
                                                    label: 'Average'
                                                },
                                                {
                                                    label: 'Sum'
                                                },
                                                {
                                                    label: 'Count'
                                                }
                                            ]}
                                            placeholder={'Select Operation'}
                                            onChange={(options) => {
                                                this.props.onUpdateCounter('operation', options.label);
                                            }}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        Unit of measure:
                                    </Col>
                                    <Col xs={6}>
                                        <FormGroup>
                                            <FormControl
                                                value={this.props.counter && this.props.counter.uOM}
                                                placeholder="UoM"
                                                onChange={(e) => {
                                                    this.props.onUpdateCounter('uOM', e.target.value);
                                                }}
                                                type="text"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Grid> : <div className="ms-dashboard-overlay">
                                    <span>Select a Map to connect with the counter</span>
                            </div>}
                        </div>
                    }
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Builder;
