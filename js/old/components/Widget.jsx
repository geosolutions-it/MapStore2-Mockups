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

require('react-widgets/lib/less/react-widgets.less');
const {
    Panel,
    Button,
    Glyphicon,
    Col,
    Row,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonGroup,
    Checkbox
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
                desc: 'desc',
                caption: 'caption',
                chart: <SimpleCharts/>
            }, {
                title: 'Pie chart',
                icon: 'icon',
                desc: 'desc',
                caption: 'caption',
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
        chartSequence: -1,
        selectedWidget: -1,
        resultsCards: [
            {
                id: 'layer',
                glyph: '1-layer'
            }
        ]
    };

    renderPreview() {
        return (
            <Row>
                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Bar chart info</div>
                    <div className="mapstore-step-description">Enter title and description</div>
                </Col>
                <Col xs={12} style={{height: 200}}>
                    <div className="mapstore-step-chart">
                        <SimpleCharts isHorz xAxis yAxis/>
                    </div>
                </Col>
                    <Col xs={12}>
                        <FormGroup controlId="stats-title">
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                onChange={(e) => {

                                    this.setState({
                                    attributeChartTitle: e.target.value
                                }); }}
                                type="text" placeholder="Enter title of the chart"/>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup controlId="stats-desc">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl onChange={(e) => {
                                this.setState({
                                attributeChartDesc: e.target.value
                            }); }}type="text" placeholder="Enter description of the chart"/>
                        </FormGroup>

                    </Col>
                    <Col xs={12}>
                        <FormGroup>

                            <Checkbox onChange={() => {
                                this.setState({
                                    synch: !this.state.synch
                                });
                            }}>Synchronize with map</Checkbox>

                        </FormGroup>
                    </Col>

            </Row>

        );
    }


        renderAggregation() {
            return (
                <Row>

                    <Col xs={12} className="text-center">
                        <div className="mapstore-step-title">Bar chart Aggregation type</div>
                        <div className="mapstore-step-description">Select aggregation type</div>
                    </Col>
                    <Col xs={12}>
                        <div className="mapstore-step-chart">
                        <SimpleCharts isHorz xAxis yAxis/>
                        </div>
                        </Col>
        <Col xs={12}>
                        <Combobox
                            data={[
                                'AVG'
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
                            chartSequence: this.state.chartSequence + 1
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
                            <Glyphicon glyph="cog" className="text-primary"/>
                        </div>
                    </div>
                </Col>
            );
        })
    );
    }

    renderPiePreview() {
        return (
            <Row>
                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Pie chart info</div>
                    <div className="mapstore-step-description">Enter title and description</div>
                </Col>
                <Col xs={12} style={{height: 200}}>
                    <div className="mapstore-step-chart">
                        <SimpleCharts colors={this.state.attributeColors} type="pie" isHorz xAxis yAxis/>
                    </div>
                </Col>
                    <Col xs={12}>
                        <FormGroup controlId="stats-title">
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                onChange={(e) => {

                                    this.setState({
                                    attributeChartTitle: e.target.value
                                }); }}
                                type="text" placeholder="Enter title of the chart"/>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup controlId="stats-desc">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl onChange={(e) => {
                                this.setState({
                                attributeChartDesc: e.target.value
                            }); }}type="text" placeholder="Enter description of the chart"/>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>

                            <Checkbox onChange={() => {
                                this.setState({
                                    synch: !this.state.synch
                                });
                            }}>Synchronize with map</Checkbox>

                        </FormGroup>
                    </Col>

            </Row>

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
            <Row>

                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Pie chart color palette</div>
                    <div className="mapstore-step-description">Select color palette</div>
                </Col>
    <Col xs={12}>
        {this.props.palette.map((p, idx) => <div ><div className="mapstore-color-palette-name">{p.name}</div><div className={'mapstore-color-palette-' + p.colors.length} onClick={() => {
            this.setState({
                attributeColors: this.props.palette[idx].colors,
                chartSequence: this.state.chartSequence + 1
            });
        }}>
            {p.colors.map(c => <div className="mapstore-color-palette-box" style={{backgroundColor: c}}/>)}
            </div></div>)}

            </Col>
        </Row>

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
                return this.state.chartType === 'Bar chart' ? this.renderChartX() : this.renderPieAttr();
            case 2:
                return this.state.chartType === 'Bar chart' ? this.renderChartY() : this.renderPieAggregation();
            case 3:
                return this.state.chartType === 'Bar chart' ? this.renderAggregation() : this.renderPieColor();
            case 4:
                return this.state.chartType === 'Bar chart' ? this.renderPreview() : this.renderPiePreview();
            default:
                return null;
        }
    }

    renderPreviousCancelBtn(save) {
        return (<ButtonGroup className="pull-right">
        <Button bsStyle="primary" onClick={() => {
            this.setState({
                chartSequence: this.state.chartSequence - 1
            });
        }}>
            Previous
        </Button>
        <Button bsStyle="primary"onClick={() => {
            this.setState({
                selectedWidget: -1,
                chartSequence: -1
            });
        }}>
            Cancel
        </Button>
        {save ? <Button bsStyle="primary"onClick={() => {
            this.props.onSave(this.state);
            this.setState({
                selectedWidget: -1,
                chartSequence: -1
            });

        }}>
            Save
        </Button> : null}

        </ButtonGroup>);
    }

    renderFooterChart() {
        switch (this.state.chartSequence) {
            case 0:
                return (<ButtonGroup className="pull-right">
                <Button bsStyle="primary"onClick={() => {
                    this.setState({
                        selectedWidget: -1,
                        chartSequence: -1
                    });
                }}>
                    Cancel
                </Button>
                </ButtonGroup>);
            case 1:
            return this.renderPreviousCancelBtn();
            case 2:
            return this.renderPreviousCancelBtn();
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
            <Panel header={null}>
                <Row>
                    <Col xs={12} className="text-center mapstore-sidebar-header-title">
                        <div></div>
                    </Col>
                </Row>
                <div className="mapstore-scroll-container-w">
                    <Row>
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
                                            <Glyphicon glyph="cog" className="text-primary"/>
                                        </div>
                                    </div>
                                </Col>
                            );
                        }) : this.renderBody()}


                    </Row>
                </div>
                <Row>
                    <Col xs={12} className="mapstore-side-footer">{this.renderFooter()}</Col>
                </Row>
            </Panel>
        );
    }
}

module.exports = Statistical;
