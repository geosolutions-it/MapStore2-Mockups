/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {createSelector} = require('reselect');
const {connect} = require('react-redux');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const Toolbar = require('../components/thematic/ToolbarT');
const {Grid, Row, Col, Glyphicon: GlyphiconRB, FormGroup, ControlLabel, FormControl, Nav, NavItem: NavItemRB } = require('react-bootstrap');
const Select = require('react-select');
const Codemirror = require('react-codemirror');
const {isEmpty} = require('lodash');
const SwitchPanel = require('../components/thematic/SwitchPanel');
const ColorSelector = require('../components/importexport/ColorSelector');
const ColorRangeSelector = require('../components/thematic/ColorRangeSelector');
const tinycolor = require('tinycolor2');
const PanelHeader = require('../../MapStore2/web/client/components/misc/panels/PanelHeader');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const Glyphicon = tooltip(GlyphiconRB);
const url = require('url');
const NavItem = tooltip(NavItemRB);

require('codemirror/mode/javascript/javascript');
class ThematicMapsEditor extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        status: PropTypes.string
    };

    static defaultProps = {
        onSelect: () => {},
        status: ''
    };

    state = {
        code: '{}',
        error: '',
        step: 1,
        cnt: 0,
        samples: 5,
        activeThematic: false,
        values: {},
        edit: true,
        fakeRanges: [
            [1, 15.2],
            [15.2, 32.7],
            [32.7, 50],
            [50, 75.4],
            [75.4, 81],
            [81, 97.9],
            [97.9, 102.3],
            [102.3, 128],
            [128, 133.1],
            [133.1, 136],
            [136, 145.8],
            [145.8, 150]
        ]
    }

    componentWillMount() {
        const path = url.parse(window.location.href, true);
        if (path && path.query && path.query.admin) {
            if (path.query.thematic) {
                this.setState({
                    code: '{"attribute" : "value"}',
                    step: 2,
                    activeThematic: true,
                    name: 'My Style',
                    ramp: {
                        name: "global.colors.blue",
                        options: {base: 190, range: 20},
                        ramp: ["#3D6466", "#407780", "#3D879A", "#3692B3", "#2996CD"],
                        schema: "sequencial"
                    },
                    values: {
                        layers: 'Regions',
                        year: '2018',
                        field: 'Population',
                        method: 'Quantile'
                    }
                });
            }
        } else {
            if (path.query.thematic) {
                this.setState({
                    code: '{"attribute" : "value"}',
                    step: 2,
                    activeThematic: true,
                    name: 'My Style',
                    ramp: {
                        name: "global.colors.blue",
                        options: {base: 190, range: 20},
                        ramp: ["#3D6466", "#407780", "#3D879A", "#3692B3", "#2996CD"],
                        schema: "sequencial"
                    },
                    edit: false,
                    values: {
                        layers: 'Regions',
                        year: '2018',
                        field: 'Population',
                        method: 'Quantile'
                    }
                });
            } else {
                this.setState({
                    edit: false
                });
            }
        }
    }

    getBody() {
        const isValid = this.validateJSON();
        const toolbarButtons = [
            {
                glyph: 'cog',
                tooltip: 'JSON configuration',
                visible: this.state.step === 2 && this.state.edit,
                onClick: () => this.setState({ step: this.state.step - 1 })
            },
            {
                glyph: 'arrow-right',
                tooltip: 'Create style classification from current JSON',
                visible: this.state.step < 2 && isValid && this.state.edit,
                onClick: () => this.setState({ step: this.state.step + 1 })
            }/*,
            {
                glyph: 'floppy-disk',
                visible: this.state.step === 2,
                onClick: () => this.setState({ step: this.state.step - 1 })
            }*/
        ];
        switch (this.state.step) {
            case 1:
            return (
                <Row>
                    <Col xs={12}>
                        <SwitchPanel
                            expanded
                            locked
                            title={<Col xs={12}>Style JSON Configuration </Col>}
                            buttons={[...toolbarButtons, {
                                component: !isValid && <Glyphicon
                                glyph="exclamation-mark"
                                className="text-danger"
                                tooltip="Invalid JSON"/>,
                                visible: !isValid ? true : false
                            }]}>
                            <Col xs={12} style={{paddingBottom: 15}}>
                                <Codemirror
                                    key={'code:' + this.state.cnt}
                                    value={this.state.code}
                                    onChange={code => this.setState({ code })}
                                    options={{
                                        theme: 'midnight',
                                        mode: {
                                            name: "javascript", json: true},
                                            lineNumbers: true
                                        }
                                    }/>
                            </Col>
                        </SwitchPanel>
                    </Col>
                </Row>
            );
            case 2:
            return (
                <Row>
                    <Col xs={12}>
                        <SwitchPanel
                            expanded
                            locked
                            buttons={toolbarButtons}
                            title={<Col xs={12}>Data</Col>}>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Name</ControlLabel>
                                    <div>
                                        <FormControl
                                            id="formControlsText"
                                            type="text"
                                            label="Text"
                                            placeholder="Enter name..."
                                            onChange={(event) => this.setState({name: event.target.value})}
                                            value={this.state.name}
                                            />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Layer</ControlLabel>
                                    <Select clearable={false}
                                        value={this.state.values.layers}
                                        onChange={({value}) => this.setState({values: {...this.state.values, layers: value}})}
                                        placeholder="Select..." options={[
                                        {
                                            value: 'Regions',
                                            label: 'Regions'
                                        },
                                        {
                                            value: 'Boundaries',
                                            label: 'Boundaries'
                                        }
                                    ]}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Year</ControlLabel>
                                    <Select clearable={false}
                                        value={this.state.values.year}
                                        placeholder="Select..."
                                        onChange={({value}) => this.setState({values: {...this.state.values, year: value}})}
                                        options={[
                                        {
                                            value: '2016',
                                            label: '2016'
                                        },
                                        {
                                            value: '2017',
                                            label: '2017'
                                        },
                                        {
                                            value: '2018',
                                            label: '2018'
                                        }
                                    ]}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Field</ControlLabel>
                                    <Select clearable={false}
                                        placeholder="Select..."
                                        value={this.state.values.field}
                                        onChange={({value}) => this.setState({values: {...this.state.values, field: value}})}
                                        options={[
                                        {
                                            value: 'Population',
                                            label: 'Population'
                                        }
                                    ]}/>
                                </FormGroup>
                            </Col>
                        </SwitchPanel>
                    </Col>
                    <Col xs={12}>
                        <SwitchPanel
                            expanded
                            locked
                            title={<Col xs={12}>Classification</Col>}
                            buttons={[
                                {
                                    glyph: 'refresh',
                                    tooltip: 'Refresh style preview'
                                }
                            ]}>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>Method</ControlLabel>
                                    <Select
                                    placeholder="Select..."
                                    value={this.state.values.method}
                                    onChange={({value}) => this.setState({values: {...this.state.values, method: value}})}
                                    clearable={false} options={[
                                        {
                                            value: 'Quantile',
                                            label: 'Quantile'
                                        },
                                        {
                                            value: 'Jenks',
                                            label: 'Jenks'
                                        },
                                        {
                                            value: 'Equal Interval',
                                            label: 'Equal Interval'
                                        },
                                        {
                                            value: 'Distinct Values',
                                            label: 'Distinct Values'
                                        }
                                    ]}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Classes</ControlLabel>
                                    <div>
                                        <FormControl
                                            id="formControlsText"
                                            type="number"
                                            label="Text"
                                            placeholder="Enter class..."
                                            value={this.state.samples}
                                            onChange={(event) => {
                                                if (!isNaN(parseFloat(event.target.value))) {
                                                    this.setState({samples: parseFloat(event.target.value), ramp: null});
                                                }
                                            }}
                                            />
                                    </div>
                                    {/*<Select value={this.state.samples + ''} clearable={false} onChange={({value}) => {
                                        this.setState({samples: parseFloat(value), ramp: null});
                                    }}options={[
                                        {
                                            value: '3',
                                            label: '3'
                                        },
                                        {
                                            value: '4',
                                            label: '4'
                                        },
                                        {
                                            value: '5',
                                            label: '5'
                                        },
                                        {
                                            value: '6',
                                            label: '6'
                                        }
                                    ]}/>*/}
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Colors</ControlLabel>
                                    <div>
                                        <ColorRangeSelector value={this.state.ramp} samples={this.state.samples} onChange={(ramp) => {
                                            this.setState({ ramp });
                                        }}/>
                                    </div>
                                </FormGroup>
                                {(this.state.ramp && this.state.ramp.ramp || []).map((backgroundColor, idx) => (
                                    <FormGroup>
                                        <ColorSelector key={backgroundColor} color={{...tinycolor(backgroundColor).toRgb(), a: 100}} />
                                        <div style={{marginLeft: 8}}>
                                            <FormControl
                                                id="formControlsText"
                                                type="text"
                                                label="Text"
                                                value={this.state.fakeRanges[idx] && this.state.fakeRanges[idx][0] || Math.random() * 100}/>
                                        </div>
                                        <div style={{marginLeft: 8}}>
                                            <FormControl
                                                id="formControlsText"
                                                type="text"
                                                label="Text"
                                                value={this.state.fakeRanges[idx] && this.state.fakeRanges[idx][1] || Math.random() * 100}/>
                                        </div>
                                    </FormGroup>
                                ))}
                            </Col>
                        </SwitchPanel>
                    </Col>
                </Row>
            );
            default:
            return null;
        }
    }
    // {/*<div className="shadow-soft" style={{ zIndex: 5, height: 156}}/>*/}
    /*
    */
    render() {
        return (<div className="shadow-soft" style={{backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, width: 500, height: 'calc(100% - 30px)'}}>
            <BorderLayout
                className="ms-side-panel toc-sett-mock"
                header={
                    <PanelHeader
                        position="left"
                        glyph="wrench"
                        title="Regions"
                        additionalRows={[
                            <Row>
                                <Col xs={12} className="text-center">
                                    <Toolbar
                                        btnDefaultProps={{
                                            bsStyle: 'primary',
                                            className: 'square-button-md'
                                        }}
                                        buttons={[{
                                            glyph: 'floppy-disk',
                                            tooltip: 'Save'
                                        }, {
                                            glyph: 'list',
                                            tooltip: 'Create a thematic style',
                                            visible: !!(this.state.edit && !this.state.activeThematic),
                                            onClick: () => this.setState({ activeThematic: true })
                                        },
                                        {
                                            glyph: 'trash',
                                            tooltip: 'Remove thematic style',
                                            visible: !!(this.state.edit && this.state.activeThematic),
                                            onClick: () => this.setState({ cnt: 1, activeThematic: false })
                                        }]} />
                                </Col>
                            </Row>,
                            <Row style={{marginBottom: 0 }}>
                                <Col xs={12} style={{padding: 0}}>
                                    <Nav justified bsStyle="tabs" activeKey="style">
                                        <NavItem tooltip="General">
                                            <Glyphicon glyph="wrench"/>
                                        </NavItem>
                                        <NavItem tooltip="Display">
                                            <Glyphicon glyph="eye-open"/>
                                        </NavItem>
                                        <NavItem tooltip="Style" eventKey="style">
                                            <Glyphicon glyph="dropper"/>
                                        </NavItem>
                                        <NavItem tooltip="Feature Info">
                                            <Glyphicon glyph="map-marker"/>
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>
                        ]}/>
                }>
                {!this.state.activeThematic ? <Grid fluid style={{ width: '100%', paddingTop: 15}}>
                    <Row>
                        <Col xs={12}>
                            <SwitchPanel
                                expanded
                                locked
                                title={<Col xs={12}>Select an available style</Col>}
                                buttons={[
                                    {
                                        glyph: 'refresh',
                                        tooltip: 'Refresh styles list'
                                    }
                                ]}>
                                <Col xs={12}>
                                    <FormGroup className="ms-form-group">
                                        <Select clearable={false} value="Default" options={[
                                                {
                                                    value: 'Default',
                                                    label: 'Default'
                                                }
                                            ]}/>
                                        {/*<ControlLabel>Style</ControlLabel>*/}
                                    </FormGroup>
                                </Col>
                            </SwitchPanel>
                        </Col>
                    </Row>
                    {/*<Row>
                        <Col xs={12}>
                            { !isValid && <Glyphicon
                                glyph="exclamation-mark"
                                className="text-danger pull-right"/>}
                            <Toolbar
                                btnGroupProps={{
                                    className: 'pull-right'
                                }}
                                btnDefaultProps={{
                                    // bsStyle: 'primary',
                                    className: 'square-button-md no-border'
                                }}
                                buttons={[
                                    {
                                        glyph: 'arrow-left',
                                        visible: this.state.step === 2,
                                        onClick: () => this.setState({ step: this.state.step - 1 })
                                    },
                                    {
                                        glyph: 'trash',
                                        onClick: () => this.setState({ code: '{}', cnt: this.state.cnt + 1 })
                                    },
                                    {
                                        glyph: 'arrow-right',
                                        visible: this.state.step < 2,
                                        disabled: !isValid,
                                        onClick: () => this.setState({ step: this.state.step + 1 })
                                    }
                                ]}/>
                        </Col>
                            </Row>*/}
                </Grid> : <Grid style={{ width: '100%', paddingTop: 15}}>
                    {this.getBody()}
                </Grid>}
            </BorderLayout>
        </div>);
    }

    validateJSON() {
        try {
            const json = JSON.parse(this.state.code);
            return !isEmpty(json);
        } catch(e) {
            return false;
        }
    }
}


const selector = createSelector([
    state => state.mockups && state.mockups.detailsPanel,
    state => state.mockups && state.mockups.clickMap
], (detailsPanel, clickMap) => ({
    right: detailsPanel && 658 || clickMap && 500 || 0
}));

const ThematicMapsEditorPlugin = connect(selector)(ThematicMapsEditor);

module.exports = {
    ThematicMapsEditorPlugin
};
