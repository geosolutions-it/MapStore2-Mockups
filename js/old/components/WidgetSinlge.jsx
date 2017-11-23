/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Combobox = require('react-widgets').Combobox;
const ColorUtils = require('../utils/ColorUtils.js');
const SwitchButton = require('./styleeditor/SwitchButton');
const SwitchPanel = require('./styleeditor/SwitchPanel');
const ColorRampSelector = require('./styleeditor/ColorRampSelector');
require('react-widgets/lib/less/react-widgets.less');
const {
    Button,
    Glyphicon,
    Col,
    Row,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonGroup,
    Checkbox,
    OverlayTrigger,
    Tooltip
} = require('react-bootstrap');

const SimpleCharts = require('./SimpleCharts');

class Statistical extends React.Component {

    static propTypes = {
        width: PropTypes.number,
        show: PropTypes.bool,
        docked: PropTypes.bool,
        glyphs: PropTypes.array,
        widget: PropTypes.array,
        charts: PropTypes.array,
        onSave: PropTypes.func,
        palette: PropTypes.array
    };

    static defaultProps = {
        width: 500,
        show: true,
        docked: true,
        glyphs: [
            null, null, '1-stilo', 'stats', 'cog'
        ],
        widget: [
            {
                title: 'Chart',
                icon: 'icon',
                desc: 'desc',
                caption: 'caption',
                glyph: 'stats'
            }/*, {
                title: 'Table',
                icon: 'icon',
                desc: 'desc',
                caption: 'caption',
                glyph: 'features-grid'
            }*/
        ],
        charts: [
            {
                title: 'Bar chart',
                icon: 'icon',
                desc: 'Create a bar chart to add to the map',
                caption: 'bar',
                chart: <SimpleCharts/>
            }, {
                title: 'Pie chart',
                icon: 'icon',
                desc: 'Create a pie chart to add to the map',
                caption: 'pie',
                chart: <SimpleCharts type="pie"/>
            }
        ],
        onSave: () => {},
        palette: [{
            name: 'Blue scale',
            colors: ColorUtils.sameToneRangeColors(190, 20, 7)
        }, {
            name: 'Red scale',
            colors: ColorUtils.sameToneRangeColors(10, 4, 7)
        }, {
            name: 'Yellow scale',
            colors: ColorUtils.sameToneRangeColors(30, 4, 7)
        }, {
            name: 'Purple scale',
            colors: ColorUtils.sameToneRangeColors(275, 4, 7)
        }, {
            name: 'Random scale',
            colors: ColorUtils.sameToneRangeColors(180, 360, 7, {base: 180, range: 360, s: 0.67, v: 0.67})
        }]
    };

    state = {
        chartSequence: 0,
        chartNext: [],
        selectedWidget: 0,
        resultsCards: [
            {
                id: 'layer',
                glyph: '1-layer'
            }
        ]
    };
    renderPreview() {
        return (
            <SwitchPanel title={"Bar chart info"} expanded locked>
                <Col xs={12} style={{height: 200, marginBottom: 40}}>
                    <div className="mapstore-step-chart">
                        <SimpleCharts isHorz xAxis yAxis isFull/>
                    </div>
                </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Title:
                            </Col>
                            <Col xs={6}>
                                <FormControl
                                    onChange={(e) => {

                                        this.setState({
                                        attributeChartTitle: e.target.value
                                    }); }}
                                    type="text" placeholder="Enter title of the chart"/>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Description:
                            </Col>
                            <Col xs={6}>
                                <FormControl onChange={(e) => {
                                    this.setState({
                                    attributeChartDesc: e.target.value
                                }); }}type="text" placeholder="Enter description of the chart"/>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Synchronize with map:
                            </Col>
                            <Col xs={6}>
                                <div className="pul-right"><SwitchButton onSwitch={(expanded) => {
                                    this.setState({
                                        synch: expanded
                                    });
                                }}/></div>
                            </Col>
                            </Row>
                        </div>
                    </Col>

            </SwitchPanel>

        );
    }


        renderAggregation() {
            return (
                <SwitchPanel title={'Bar Chart data'} expanded locked>


                    <Col xs={12}>
                        <div className="mapstore-step-chart">
                        <SimpleCharts isHorz/>
                        </div>
                        </Col>
        <Col xs={12}>
            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    X Attribute:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    const chartNext = this.state.chartNext.indexOf('x') === -1 ? [...this.state.chartNext, 'x'] : this.state.chartNext;
                    const next = chartNext.length === 3 ? this.state.chartSequence + 1 : this.state.chartSequence;
                    this.setState({
                        chartSequence: next,
                        chartNext: chartNext.length === 3 ? [] : chartNext
                }); }} data={['Tipologie Edilizie', 'Population']} placeholder="Select x attribute"/>
                </Col>
                </Row>
            </div>
            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Y Attribute:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    const chartNext = this.state.chartNext.indexOf('y') === -1 ? [...this.state.chartNext, 'y'] : this.state.chartNext;
                    const next = chartNext.length === 3 ? this.state.chartSequence + 1 : this.state.chartSequence;
                    this.setState({
                        chartSequence: next,
                        chartNext: chartNext.length === 3 ? [] : chartNext
                }); }} data={['Tipologie Edilizie', 'Population']} placeholder="Select y attribute"/>
                </Col>
                </Row>
            </div>
            <div className="mapstore-block-width">
                <Row>
                <Col xs={6}>
                    Aggregation:
                </Col>
                <Col xs={6}>
                <Combobox onChange={() => {
                    const chartNext = this.state.chartNext.indexOf('a') === -1 ? [...this.state.chartNext, 'a'] : this.state.chartNext;
                    const next = chartNext.length === 3 ? this.state.chartSequence + 1 : this.state.chartSequence;
                    this.setState({
                        chartSequence: next,
                        chartNext: chartNext.length === 3 ? [] : chartNext
                }); }} data={['Average']} placeholder="Select type"/>
                </Col>
                </Row>
            </div>

        </Col>
            </SwitchPanel>

            );
        }

    renderChartY() {
        return (<Row>

            <Col xs={12} className="text-center">
                <div className="mapstore-step-title">Bar chart Y axis</div>
                <div className="mapstore-step-description">Select attribute for y axis</div>
            </Col>
            <Col xs={12}>
                <div className="mapstore-step-chart">
                <SimpleCharts isHorz yAxis/>
                </div>
                </Col>
<Col xs={12}>
                <Combobox
                    data={[
                        'Id',
                        'Category',
                        'Population',
                        'Tipologie Urbane',
                        'Aree',
                        'Time',
                        'Geometry'
                    ]}
                    placeholder={'Select attribute'}
                    onChange={(val) => {
                        this.setState({
                        attributeChartY: 'y: ' + val,
                        chartSequence: this.state.chartSequence + 1
                    }); }}
                    />
</Col>
    </Row>);
    }

    renderChartX() {
        return (

            <Row>
                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Bar chart X axis</div>
                    <div className="mapstore-step-description">Select attribute for x axis</div>
                </Col>

            <Col xs={12}>
                <div className="mapstore-step-chart">
                    <SimpleCharts isHorz xAxis/>
                </div>
                </Col>
            <Col xs={12}>

                <Combobox
                    data={[
                        'Id',
                        'Category',
                        'Population',
                        'Tipologie Urbane',
                        'Aree',
                        'Time',
                        'Geometry'
                    ]}
                    placeholder={'Select attribute'}
                    onChange={(val) => {
                        this.setState({
                        attributeChartX: 'x: ' + val,
                        chartSequence: this.state.chartSequence + 1
                    }); }}
                    />
        </Col>
    </Row>);
    }

    renderChartType() {
        return (this.props.charts.map((a) => {
            return (
                <Col xs={12}>
                    <div className="mapstore-side-card" onClick={() => {

                        this.setState({
                            chartType: a.title,
                            chartSequence: this.state.chartSequence + 1,
                            attributeChartTitle: '',
                            attributeChartDesc: ''
                        });
                    }}>
                        <div className="mapstore-side-chart">
                            {a.chart}
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
                            {/*<Glyphicon glyph="cog" className="text-primary"/>*/}
                        </div>
                    </div>
                </Col>
            );
        })
    );
    }

    renderPiePreview() {
        return (
            <SwitchPanel title="Pie Chart info" expanded locked>
                <Col xs={12} style={{height: 200}}>
                    <div className="mapstore-step-chart">
                        <SimpleCharts colors={this.state.attributeColors} type="pie" isHorz xAxis yAxis/>
                    </div>
                </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Title:
                            </Col>
                            <Col xs={6}>
                                <FormControl
                                    onChange={(e) => {

                                        this.setState({
                                        attributeChartTitle: e.target.value
                                    }); }}
                                    type="text" placeholder="Enter title of the chart"/>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Description:
                            </Col>
                            <Col xs={6}>
                                <FormControl onChange={(e) => {
                                    this.setState({
                                    attributeChartDesc: e.target.value
                                }); }}type="text" placeholder="Enter description of the chart"/>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-block-width">
                            <Row>
                            <Col xs={6}>
                                Synchronize with map:
                            </Col>
                            <Col xs={6}>
                                <div className="pul-right"><SwitchButton onSwitch={(expanded) => {
                                    this.setState({
                                        synch: expanded
                                    });
                                }}/></div>
                            </Col>
                            </Row>
                        </div>
                    </Col>

            </SwitchPanel>

        );
    }

    renderPieAggregation() {
        return (
            <Row>

                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Pie chart Aggregation type</div>
                    <div className="mapstore-step-description">Select aggregation type</div>
                </Col>
                <Col xs={12}>
                    <div className="mapstore-step-chart">

                    <SimpleCharts type="pie" isHorz xAxis yAxis/>
                    </div>
                    </Col>
    <Col xs={12}>
                    <Combobox
                        data={[
                            'Single value'
                        ]}
                        placeholder={'Select attribute'}
                        onChange={(val) => {
                            this.setState({
                            attributeChartAggregation: val,
                            chartSequence: this.state.chartSequence + 1
                        }); }}
                        />
    </Col>
        </Row>

        );
    }

    renderPieColor() {

        return (
            <SwitchPanel title="Pie Chart data" expanded locked>

                <Col xs={12}>
                    <div className="mapstore-step-chart">

                    <SimpleCharts type="pie" isHorz xAxis yAxis/>
                    </div>
                    </Col>
    {/*<Col xs={12}>
        {this.props.palette.map((p, idx) => <div ><div className="mapstore-color-palette-name">{p.name}</div><div className={'mapstore-color-palette-' + p.colors.length} onClick={() => {
            this.setState({
                attributeColors: this.props.palette[idx].colors,
                chartSequence: this.state.chartSequence + 1
            });
        }}>
            {p.colors.map(c => <div className="mapstore-color-palette-box" style={{backgroundColor: c}}/>)}
            </div></div>)}

            </Col>*/}

            <Col xs={12}>
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
                        const chartNext = this.state.chartNext.indexOf('x') === -1 ? [...this.state.chartNext, 'x'] : this.state.chartNext;
                        const next = chartNext.length === 2 ? this.state.chartSequence + 1 : this.state.chartSequence;
                        this.setState({
                            chartSequence: next,
                            chartNext: chartNext.length === 2 ? [] : chartNext,
                            attributeColors: this.props.palette[Math.floor(Math.random() * 5)].colors
                    }); }} data={['Tipologie Edilizie', 'Population']} placeholder="Select attribute"/>
                    </Col>
                    </Row>
                </div>
                <div className="mapstore-block-width">
                    <Row>
                    <Col xs={6}>
                        Aggregation:
                    </Col>
                    <Col xs={6}>
                    <Combobox onChange={() => {
                        const chartNext = this.state.chartNext.indexOf('a') === -1 ? [...this.state.chartNext, 'a'] : this.state.chartNext;
                        const next = chartNext.length === 2 ? this.state.chartSequence + 1 : this.state.chartSequence;
                        this.setState({
                            chartSequence: next,
                            chartNext: chartNext.length === 2 ? [] : chartNext
                    }); }} data={['None', 'Aggregate']} placeholder="Select type"/>
                    </Col>
                    </Row>
                </div>

            </Col>
        </SwitchPanel>

        );
    }


    renderPieAttr() {
        return (

            <Row>
            <Col xs={12} className="text-center">
                <div className="mapstore-step-title">Pie chart data attribute</div>
                <div className="mapstore-step-description">Select an attribute to display on pie chart</div>
            </Col>

            <Col xs={12}>
                <div className="mapstore-step-chart">
                    <SimpleCharts type="pie" isHorz xAxis/>
                </div>
                </Col>
            <Col xs={12}>

                <Combobox
                    data={[
                        'Id',
                        'Category',
                        'Population',
                        'Geometry',
                        'Tipologie Urbane',
                        'Aree'
                    ]}
                    placeholder={'Select attribute'}
                    onChange={(val) => {
                        this.setState({
                        attributeChartValue: val,
                        chartSequence: this.state.chartSequence + 1
                    }); }}
                    />
            </Col>
        </Row>);
    }

    renderChart() {

        switch (this.state.chartSequence) {
            case 0:
                return this.renderChartType();
            case 1:
                return this.state.chartType === 'Bar chart' ? this.renderAggregation() : this.renderPieColor();
            case 2:
                return this.state.chartType === 'Bar chart' ? this.renderPreview() : this.renderPiePreview();
            case 3:
                return this.state.chartType === 'Bar chart' ? this.renderAggregation() : this.renderPieColor();
            case 4:
                return this.state.chartType === 'Bar chart' ? this.renderPreview() : this.renderPiePreview();
            default:
                return null;
        }
    }

    renderPreviousCancelBtn(save) {
        return (<ButtonGroup className="">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-pre">Previous panel</Tooltip>}>
        <Button className="square-button-md" bsStyle="primary" onClick={() => {
            this.setState({
                chartSequence: this.state.chartSequence - 1,
                chartNext: []
            });
        }}>
            <Glyphicon glyph="arrow-left"/>
        </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cancel">Cancel</Tooltip>}>
        <Button className="square-button-md" bsStyle="primary"onClick={() => {
            this.setState({
                selectedWidget: 0,
                chartSequence: 0,
                chartNext: []
            });
        }}>
            <Glyphicon glyph="remove-square"/>
        </Button>
        </OverlayTrigger>

        {save ? <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-save">Save current widget</Tooltip>}><Button className="square-button-md" bsStyle="primary"onClick={() => {
            this.props.onSave(this.state);
            this.setState({
                selectedWidget: 0,
                chartSequence: 0,
                chartNext: []
            });

        }}>
            <Glyphicon glyph="floppy-disk"/>
        </Button></OverlayTrigger> : null}

        </ButtonGroup>);
    }

    renderFooterChart() {
        switch (this.state.chartSequence) {
            case 0:
                return (<ButtonGroup className="">
                {/*<OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-pre">Previous panel</Tooltip>}>
                <Button className="square-button-md" bsStyle="primary"onClick={() => {
                    this.setState({
                        selectedWidget: -1,
                        chartSequence: -1
                    });
                }}>
                    <Glyphicon glyph="arrow-left"/>
                </Button>
            </OverlayTrigger>*/}
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Filter data</Tooltip>}>
                <Button className="square-button-md" bsStyle="primary">
                    <Glyphicon glyph="filter"/>
                </Button>
                </OverlayTrigger>
                </ButtonGroup>);
            case 1:
            return this.renderPreviousCancelBtn();
            case 2:
            return this.renderPreviousCancelBtn(true);
            case 3:
            return this.renderPreviousCancelBtn();
            case 4:
            return this.renderPreviousCancelBtn(true);
            default:
                return null;
        }
    }

    renderBody() {
        switch (this.state.selectedWidget) {
            case 0:
                return this.renderChart();
            case 1:
                return <div>Counter</div>;
            case 2:
                return <div>Table</div>;
            default:
                return null;
        }
    }

    renderFooter() {
        switch (this.state.selectedWidget) {
            case 0:
                return this.renderFooterChart();
            case 1:
                return <div>Counter</div>;
            case 2:
                return <div>Table</div>;
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="mapstore-flex-container">
                <div className="m-header">
                <div className="mapstore-block-width">
                <Col xs={3} className="text-center" style={{overflow: 'hidden'}}/>

                <Col xs={12} className="text-center" style={{overflow: 'hidden', lineHeight: '52px'}}>
                     <a href="#/toc" className="pull-left"><Button className="square-button no-border ">
                        <Glyphicon glyph="1-close"/>
                    </Button></a>
                <span style={{padding: '50px 0 0 0', fontSize: 16}}>Widget</span>
                    <Button className="square-button pull-right no-border">
                        <Glyphicon glyph="cog"/>
                    </Button>
                </Col>
                <Col xs={3} className="text-center" style={{overflow: 'hidden'}}/>

                </div>
                <div className="mapstore-block-width text-center">
                    <div className="m-padding-md">
                    {this.renderFooter()}
                    </div>
                </div>
                </div>
                <div className="m-body-scroll-y">


                        {this.state.selectedWidget === -1 ? this.props.widget.map((a, idx) => {
                            return (
                                <Col xs={12}>
                                    <div className="mapstore-side-card" onClick={() => {

                                        this.setState({
                                            synch: false,
                                            selectedWidget: idx,
                                            chartSequence: a.title.toLowerCase() === 'chart' ? this.state.chartSequence + 1 : -1
                                        });
                                    }}>
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
                                            {/*<Glyphicon glyph="cog" className="text-primary"/>*/}
                                        </div>
                                    </div>
                                </Col>
                            );
                        }) : this.renderBody()}



                </div>

                <div className="m-footer">
                    <div className="mapstore-block-width">
                        </div>
                </div>

            </div>
        );
    }
}

module.exports = Statistical;
