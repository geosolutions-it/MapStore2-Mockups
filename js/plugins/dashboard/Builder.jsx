/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const BorderLayout = require('../../../MapStore2/web/client/components/layout/BorderLayout');
const ReactQuill = require('react-quill');
const WidgetsBuilder = require('../../../MapStore2/web/client/components/widgets/builder/WidgetsBuilder');
const {Grid, Row, Col} = require('react-bootstrap');
const AttributeFilter = require('../../components/AttributeFilter');

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
        chartType: PropTypes.string
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
        step: 0
    };

    state = {
        step: 0,
        type: ''
    };

    componentWillMount() {
        this.setState({
            step: this.props.statusEdit === 'create' ? 0 : 1
        });
    }

    render() {
        const connectedButton = (this.props.type === 'table' && this.props.maps.length > 0) || this.props.type === 'legend' || (this.props.type === 'chart' && this.props.maps.length > 0 && this.state.step > 0) ? {
            text: this.props.isConnected ? 'Clear Connected Map' : 'Connect a Map',
            onClick: this.props.isConnected ? this.props.onClearConnection : this.props.onClick,
            className: 'ms-btn-sm'
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
        const next = this.props.type === 'chart' && this.state.step === 1 ? {
            glyph: 'arrow-right',
            className: 'square-button-md',
            onClick: () => {
                this.setState({
                    step: 2
                });
            }
        } : null;

        const buttons = [previous, connectedButton, next].filter(v => v);
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
                                    <Col xs={12} className="text-center">
                                    { (this.props.type === 'legend' || this.props.type === 'chart' || this.props.type === 'table') &&
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
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Builder;
