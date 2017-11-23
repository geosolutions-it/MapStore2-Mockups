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
const {SliderPicker, CirclePicker} = require('react-color');
const {FormGroup, Checkbox, Button, Glyphicon, Col, Row, ButtonGroup} = require('react-bootstrap');
const ColorUtils = require('../utils/ColorUtils.js');
const InfoPopover = require('../components/InfoPopover');
const Codemirror = require('react-codemirror');
const ColorPicker = require('../../../MapStore2/web/client/components/style/ColorPicker');

require('codemirror/lib/codemirror.css');

require('codemirror/mode/css/css');

class Styler extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        categories: PropTypes.array,
        palette: PropTypes.array,
        paletteGrad: PropTypes.array,
        symbols: PropTypes.array
    };

    static defaultProps = {
        id: '',
        categories: [
            {
                title: 'Solid',
                desc: 'description',
                caption: 'caption',
                className: 'mapstore-styler-solid'
            }, {
                title: 'Category',
                desc: 'description',
                caption: 'caption',
                className: 'mapstore-styler-category'
            }, {
                title: 'Gradient',
                desc: 'description',
                caption: 'caption',
                className: 'mapstore-styler-gradient'
            }
        ],
        palette: [
            {
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
                colors: ColorUtils.sameToneRangeColors(180, 360, 7, {
                    base: 180,
                    range: 360,
                    s: 0.67,
                    v: 0.67
                })
            }
        ],
        paletteGrad: [
            {
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
            }
        ],
        symbols: [
            {
                glyph: '1-point'
            }, {
                glyph: 'star'
            }, {
                glyph: 'remove'
            }, {
                glyph: 'unchecked'
            }
        ]
    };

    state = {
        stylerPage: 0,
        advanced: false,
        section: 'styler',
        glyphSymbol: '1-point',
        fillColor: {
            r: 105,
            g: 15,
            b: 100,
            a: 255
        },
        strokeColor: {
            r: 25,
            g: 80,
            b: 100,
            a: 255
        },
        symbolColor: '#f25ad1'
    };

    renderColor() {
        let title;
        let description;
        let picker;
        switch (this.state.stylerType) {
            case 'solid':
                title = 'Fill color';
                description = 'Select a solid color to fill the shape';
                picker = (<CirclePicker width={'100%'} onChange={(color) => {
                    this.setState({
                        /*stylerPage: this.state.stylerPage + 1,*/
                        fillColor: color.hex
                    });
                }}/>);
            break;
            case 'category':
                title = 'Category color';
                description = 'Select a category palette to fill the shape';
                picker = (<Col xs={12}>
                    {this.props.palette.map((p) => <div >
                        <div className="mapstore-color-palette-name">{p.name}</div>
                        <div className={'mapstore-color-palette-' + p.colors.length} onClick={() => {
                            this.setState({
                                /*stylerPage: this.state.stylerPage + 1*/
                            });
                        }}>
                            {p.colors.map(c => <div className="mapstore-color-palette-box" style={{
                                backgroundColor: c
                            }}/>)}
                        </div>
                    </div>)}
                </Col>);
            break;
            case 'gradient':
                title = 'Gradient color';
                description = 'Select a gradient palette to fill the shape';
                picker = (<Col xs={12}>
                    {this.props.paletteGrad.map((p) => <div>
                        <div className="mapstore-color-palette-name">{p.name}</div>
                        <div className={'mapstore-color-palette-' + p.colors.length} style={{
                            background: 'linear-gradient(90deg, ' + p.colors[0] + ', ' + p.colors[p.colors.length - 1] + ')'
                        }} onClick={() => {
                            this.setState({
                                /*stylerPage: this.state.stylerPage + 1*/
                            });
                        }}></div>
                    </div>)}

                </Col>);
            break;
            default:
                title = '';
                description = '';
                picker = null;
            break;
        }
        return (
            <Row>
                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">{title}</div>
                    <div className="mapstore-step-description">{description}</div>
                    {this.state.stylerType === 'solid' ? <div className="mapstore-side-card-box" style={{margin: '4px auto', border: '2px solid ' + this.state.strokeColor, backgroundColor: this.state.fillColor}}/> : null}
                </Col>
                {picker}
            </Row>

        );
    }

    renderAttribute() {
        const strokeColor = this.state.strokeColor ? '2px solid ' + this.state.strokeColor : '2px dashed #ddd';
        return this.state.stylerType === 'solid' ? (<Row>
            <Col xs={12} className="text-center">
                <div className="mapstore-step-title">Stroke color</div>
                <div className="mapstore-step-description">Select a solid color for the border of the shape</div>
                <div className="mapstore-side-card-box" style={{margin: '4px auto', border: strokeColor}}/>
            </Col>
            <CirclePicker
                width={'100%'}
                onChange={(color) => {
                    this.setState({
                        /*stylerPage: this.state.stylerPage + 1,*/
                        strokeColor: color.hex
                    });
                }}/>
            <Col xs={12}>
                {this.state.strokeColor ? <Glyphicon glyph="arrow-right" className="text-primary"
                    onClick={() => {
                        this.setState({
                            stylerPage: this.state.stylerPage + 1
                        });
                    }}/> : null}
            </Col>
        </Row>)

            : (
            <Row>
                <Col xs={12} className="text-center">
                    <div className="mapstore-step-title">Select attribute</div>
                    <div className="mapstore-step-description">Select attribute to style</div>
                </Col>

                <Col xs={12}>
                    <Combobox data={this.state.stylerType === 'category' ? ['Tipologie Edifici', 'Address'] : ['Area', 'Population']} placeholder={'Select attribute'} onChange={() => {
                        this.setState({
                            stylerPage: this.state.stylerPage + 1
                        });
                    }}/>
                </Col>
            </Row>
        );
    }

    renderType() {
        return (this.props.categories.map(a => {
            return (
                <Col xs={12}>
                    <div className="mapstore-side-card" onClick={() => {
                        this.setState({
                            stylerPage: this.state.stylerPage + 1,
                            stylerType: a.title.toLowerCase()
                        });
                    }}>
                        {/*<div className="mapstore-side-image"><img src={a.icon}/></div>*/}
                        {/*<div className="mapstore-side-glyph bg-primary">
                                <Glyphicon glyph={a.glyph}/>
                            </div>*/}
                        <div className={"mapstore-side-card-box " + a.className}/>

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
                            <Glyphicon glyph="1-stilo" className="text-primary"/>
                        </div>
                    </div>
                </Col>
            );
        }));
    }

    renderBody() {
        switch (this.state.stylerPage) {
            case 0:
                return this.renderType();
            case 1:
                return this.renderAttribute();
            case 2:
                return this.renderColor();
            default:
                return null;
        }
    }

    renderClassification() {
        return (<span className="mapstore-join-stats"><Row>
        <Col xs={12}>
            <div className="mapstore-text-combobox">Attribute: <InfoPopover text="test"/></div>
            <Combobox
                data={[
                    'Tipologia Edifici',
                    'Population'
                ]}
                placeholder={'Select attribute'}
                onChange={() => {}}
                />
        </Col>
        <Col xs={6}>
            <div className="mapstore-text-combobox">Classification: <InfoPopover text="test"/></div>
            <Combobox
                data={[
                    'Quantile'
                ]}
                placeholder={'Select calssification'}
                onChange={() => {}}
                />
        </Col>
        <div className="mapstore-margin-5-per"/>
        <Col xs={6}>
            <div className="mapstore-text-combobox">Class: <InfoPopover text="test"/></div>
            <Combobox
                data={[
                    '5',
                    '6'
                ]}
                placeholder={'Select target layer'}
                onChange={() => {}}
                />
        </Col>

        <Col xs={12}>
            {this.props.palette.map((p) => <div >
                <div className="mapstore-color-palette-name">{p.name}</div>
                <div className={'mapstore-color-palette-' + p.colors.length} onClick={() => {
                    this.setState({
                        /*stylerPage: this.state.stylerPage + 1*/
                    });
                }}>
                    {p.colors.map(c => <div className="mapstore-color-palette-box" style={{
                        backgroundColor: c
                    }}/>)}
                </div>
            </div>)}
        </Col>

    </Row></span>);
    }

    renderBodyStyle() {
        return this.state.classificationSelect ? this.renderClassification() : (
            <span className="mapstore-join-stats">
            <Row>
                {/*<Col xs={12} className="text-center"><span>
                    <div className="mapstore-style-symbol-preview"><Glyphicon style={{color: this.state.symbolColor}} glyph={this.state.glyphSymbol}/></div>
                    <div className="mapstore-style-polygon-preview" style={{backgroundColor: fillColor, border: strokeColor}}></div></span>
                </Col>*/}
                <Col xs={12}>
                    <div className="mapstore-text-combobox">Symbol:<InfoPopover text="test"/></div>
                    <div className="mapstore-text-combobox-symbol-container">
                    {this.props.symbols.map(s => <Glyphicon className={this.state.glyphSymbol === s.glyph ? 'text-primary' : ''} onClick={() => {
                        this.setState({
                            glyphSymbol: s.glyph
                        });
                    }} glyph={s.glyph}/>)}
                    </div>
                </Col>
                <Col xs={12}>
                    <div className="mapstore-text-combobox">Stroke:<InfoPopover text="test"/></div>
                     <div className="mapstore-color-picker"><ColorPicker value={this.state.strokeColor} onChangeColor={(color) => {
                        this.setState({
                            strokeColor: color
                        });
                    }} text="Click to select the color..."/></div>

                </Col>
                <Col xs={12}>
                    <div className="mapstore-text-combobox">Fill:<InfoPopover text="test"/></div>
                        <div className="mapstore-color-picker"><ColorPicker value={this.state.fillColor} onChangeColor={(color) => {
                            this.setState({
                                fillColor: color
                            });
                        }} text="Click to select the color..."/></div>
                </Col>
                {this.state.textSelect ? (<Col xs={12}>
                    <div className="mapstore-text-combobox">Text Color:<InfoPopover text="test"/></div>
                        <div className="mapstore-color-picker"><ColorPicker value={this.state.textColor} onChangeColor={(color) => {
                            this.setState({
                                textColor: color
                            });
                        }} text="Click to select the color..."/></div>
                </Col>) : null}
                <Col xs={12}>
                    <div className="mapstore-text-combobox"><FormGroup>

                        <Checkbox onChange={() => {
                            this.setState({
                                textSelect: !this.state.textSelect
                            });
                        }}>{'Text Symbolizer'}</Checkbox>

                    </FormGroup></div>
                </Col>


            </Row>
            </span>

        );
    }
    renderList() {
        return (<div className="mapstore-styler-combo">

        <Combobox
            data={[
                'Default',
                'Custom'
            ]}
            placeholder={'Select style'}
            onChange={() => {}}
            />
            <ButtonGroup className="pull-right">
                <Button className="square-button-md" bsStyle="primary" ><Glyphicon glyph="refresh"/></Button>
                <Button className="square-button-md" bsStyle="primary"
                    onClick={() => {
                        this.setState({
                            enableEditor: true
                        });
                    }}><Glyphicon glyph="pencil"/></Button>
            </ButtonGroup >
        </div>);
    }

    renderEditor() {
        return (
            <span>
                {/*<div className="mapstore-styler-title">
                    <Combobox
                        data={[
                            'AVG',
                            'Affm'
                        ]}
                        placeholder={'Select target layer'}
                        onChange={() => {}}
                        />
                </div>*/}
                    {this.state.advanced ? <div className="mapstore-styler-title">Advanced Styler<InfoPopover text="test"/></div> : <div className="mapstore-styler-title"><Glyphicon glyph="arrow-left" className="pull-left" onClick={() => {
                        this.setState({
                            enableEditor: false
                        });
                    }}/>Styler<InfoPopover text="test"/></div>}
                    <div className="mapstore-styler-switch text-center">
                        {this.state.stylerPage === 0 ? <ButtonGroup >
                            <Button className="square-button-md" bsSize="sm" bsStyle={this.state.section === 'styler' ? 'success' : 'primary'} active={!this.state.advanced} onClick={() => {
                                this.setState({
                                advanced: false,
                                section: 'styler',
                                classificationSelect: false
                            }); }}><Glyphicon glyph="1-stilo" /></Button>

                                        <Button className="square-button-md" bsStyle="primary" onClick={() => {
                                            this.setState({
                                                advanced: false,
                                                classificationSelect: true
                                            });
                                        }}>
                                            <Glyphicon glyph="list"/>
                                        </Button>

                        <Button className="square-button-md" bsSize="sm" bsStyle={this.state.advanced === 'advenced' ? 'success' : 'primary'} active={this.state.advanced} onClick={() => {
                            this.setState({
                                advanced: true,
                                section: 'advenced'
                        });
                        }}><Glyphicon glyph="forward"/></Button></ButtonGroup> : null}

                    </div>

                {this.state.advanced ? <div className="mapstore-scroll-container-code"><Codemirror key="code-mirror" options={{
                        mode: {name: "css"},
                        lineNumbers: true
                    }}/> </div> : <div className="mapstore-scroll-container">{this.renderBodyStyle()}</div>}
            </span>
        );
    }
    render() {
        return this.state.enableEditor ? this.renderEditor() : this.renderList();
    }
}



module.exports = Styler;
