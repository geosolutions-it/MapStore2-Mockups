/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const {head, isEqual, isNil, isNumber} = require('lodash');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
// const emptyState = require('../../MapStore2/web/client/components/misc/enhancers/emptyState');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
const ResizableModal = require('../components/ResizableModal');

const ReactDataGrid = require('react-data-grid');
const { Row: RowGrid } = ReactDataGrid;
const {/*Button,*/ Glyphicon, Row, Col, Grid, FormGroup, FormControl, NavItem, Nav} = require('react-bootstrap');
const Filter = require('../../MapStore2/web/client/components/misc/Filter');
const SideCard = require('../../MapStore2/web/client/components/misc/cardgrids/SideCard');
const ContainerDimensions = require('react-container-dimensions').default;
require('react-quill/dist/quill.snow.css');
const Combobox = require('react-widgets').Combobox;
const SwitchPanel = require('../components/SwitchPanel');
const {connect} = require('react-redux');
const {setOption} = require('../actions/mockups');
const Codemirror = require('react-codemirror');
require('codemirror/mode/sql/sql');
const ItalyMap = require('../components/ItalyMap');
const {wizardHanlders} = require('../../MapStore2/web/client/components/misc/wizard/enhancers');
const Wizard = wizardHanlders(require('../../MapStore2/web/client/components/misc/wizard/WizardContainer'));
const accessField = {
    ALLOW: {
        className: 'ms-allow-cell',
        classNameRow: 'ms-allow-row'
    },
    DENY: {
        className: 'ms-deny-cell',
        classNameRow: 'ms-deny-row'
    }
};

class GridToolbar extends React.Component {
    static propTypes = {
        onToggleFilter: PropTypes.func
    };
    componentDidMount() {
        this.props.onToggleFilter();
    }
    render() {
        return null;
    }
}
class GrabCell extends React.Component {
    static propTypes = {
        value: PropTypes.number.isRequired
    };

    componentWillMount() {
        this.setState({
            checked: false
        });
    }

    render() {
        return (
            <div className="ms-grab-cell" >
                <Glyphicon glyph="menu-hamburger"/>
            </div>
        );
    }
}

class Check extends React.Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        setOption: PropTypes.func,
        selected: PropTypes.array
    };

    componentWillMount() {
        this.setState({
            checked: false
        });
    }

    componentWillUpdate(newProps) {
        if (!isEqual(newProps.selected, this.props.selected)) {
            this.setState({
                checked: isNumber(head(newProps.selected.filter(se => se === newProps.value)))
            });
        }
    }

    render() {
        return (
            <div className="ms-check-cell" >
                <Glyphicon glyph={this.state.checked ? 'check' : 'unchecked'} onClick={() => {
                    let selected = [...this.props.selected];
                    if (!this.state.checked) {
                        selected = [...selected, this.props.value];
                    } else {
                        selected = selected.filter(s => s !== this.props.value);
                    }
                    this.props.setOption('selectedRowRules', selected);
                    this.setState({
                        checked: !this.state.checked
                    });
                }}/>
            </div>
        );
    }
}

const CheckFormatter = connect((state) => ({
    selected: state.mockups && state.mockups.selectedRowRules || []
}), {
    setOption
})(Check);

class AccessFormatter extends React.Component {
    static propTypes = {
        value: PropTypes.number.isRequired
    };

    componentWillMount() {
        this.setState({
            value: this.props.value
        });
    }

    render() {
        return (
            <div className={accessField[this.state.value].className}>
                <div>
                    {this.state.value.toUpperCase()}
                </div>
            </div>
        );
    }
}

class RowComponent extends React.Component {
    static propTypes = {
        idx: PropTypes.string.isRequired,
        row: PropTypes.object,
        selected: PropTypes.array,
        setOption: PropTypes.func
    };

    render() {
        const select = isNaN(head(this.props.selected.filter(se => se === this.props.row.check)));
        return (<div key={this.props.row.check} className={(!select && ' ms-row-select ' || '') + (accessField[this.props.row.access].classNameRow || ' ')} onClick={() => {
            let selected = [...this.props.selected];
            if (select) {
                selected = [...selected, this.props.row.check];
            } else {
                selected = selected.filter(s => s !== this.props.row.check);
            }
            this.props.setOption('selectedRowRules', selected);
        }}><RowGrid ref={ node => this.row = node } {...this.props} /></div>);
    }
}

const RowRenderer = connect((state) => ({
    selected: state.mockups && state.mockups.selectedRowRules || []
}), {
    setOption
})(RowComponent);

class WizardPage extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        cards: PropTypes.array,
        onClick: PropTypes.func,
        onBack: PropTypes.func,
        type: PropTypes.string

    };

    static defaultProps = {
        onClick: () => {

        },
        onBack: () => {

        },
        cards: [{
            title: 'OrtofotoRegione2010',
            description: 'geosolutions:OrtofotoRegione2010',
            name: 'Ortofoto Regione',
            id: '001-0'
        }, {
            title: 'A sample ArcGrid file',
            description: 'nurc:Arc_Sample',
            name: 'ArcGrid',
            id: '002-0'
        }, {
            title: 'mosaic',
            description: 'nurc:mosaic',
            name: 'Mosaic',
            id: '003-0'
        }, {
            title: 'North America sample imagery',
            description: 'nurc:Img_Sample',
            name: 'North America',
            id: '004-0'
        }],
        type: ''
    };

    renderHeader() {
        return (<Grid fluid style={{width: '100%'}}>
            <Row>
                <Col xs={12}>
                    <h4>{this.props.title}</h4>
                </Col>
                <Col xs={12}>
                    <Toolbar buttons={[{
                        glyph: 'arrow-left',
                        bsStyle: 'primary',
                        className: 'square-button-md',
                        onClick: () => {
                            this.props.onBack();
                        }
                    }]}/>
                </Col>
                <Col xs={12}>
                    <Filter filterPlaceholder="Filter..." />
                </Col>
            </Row>
        </Grid>);
    }

    render() {
        return (
            <BorderLayout header={this.renderHeader()}>
                <Grid className="ms-rule-editor" fluid style={{width: '100%'}}>
                    {this.props.cards.map(card => {
                        return (
                            <div>
                                <SideCard
                                    preview={<Glyphicon glyph={card.preview || 'geoserver'} />}
                                    className={'ms-sm'}
                                    title={card.title}
                                    description={card.description}
                                    caption={card.caption || ''}
                                    onClick={() => {
                                        this.props.onClick(card);
                                    }}/>
                            </div>
                        );
                    })}
                </Grid>
            </BorderLayout>
        );
    }
}

let count = 2;

class RulesManager extends React.Component {

    static propTypes = {
        buttons: PropTypes.array,
        transitionProps: PropTypes.object,
        readOnly: PropTypes.bool,
        position: PropTypes.string,
        selectedRow: PropTypes.array,
        setOption: PropTypes.func
    };

    static defaultProps = {
        buttons: [],
        readOnly: false,
        transitionProps: {
            transitionName: "dashboard-panel-transition",
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        },
        position: 'left'
    };

    state = {
        currentRule: {
            role: '',
            user: '',
            service: '',
            request: '',
            workspace: '',
            layer: '',
            access: '',
            ip: ''
        },
        activeKey: "1",
        _columns: [
            { key: 'grab', name: '', formatter: GrabCell, width: 35},
            { key: 'check', name: '', formatter: CheckFormatter, width: 35, filterable: true,
        filterRenderer: CheckFormatter},
            { key: 'priority', name: 'Priority', filterable: true },
            { key: 'role', name: 'Role', filterable: true },
            { key: 'user', name: 'User', filterable: true },
            { key: 'ip', name: 'IP', filterable: true},
            { key: 'service', name: 'Service', filterable: true },
            { key: 'request', name: 'Request', filterable: true },
            { key: 'workspace', name: 'Workspace', filterable: true },
            { key: 'layer', name: 'Layer', filterable: true },
            { key: 'access', name: 'Access', formatter: AccessFormatter, filterable: true }
        ],
        _rows: [{
            step: -1,
            grab: 0,
            check: 0,
            priority: 0,
            role: 'ADMIN',
            user: 'Admin',
            service: 'WFS',
            request: 'GetfeatureInfo',
            workspace: 'topp',
            layer: 'states',
            access: 'ALLOW',
            ip: '*'
        }, {
            grab: 0,
            check: 1,
            priority: 1,
            role: 'ADMIN',
            user: 'Admin',
            service: 'WFS',
            request: 'GetfeatureInfo',
            workspace: 'topp',
            layer: 'states',
            access: 'DENY',
            ip: '*'
        }]
    };

    componentWillMount() {
        this.updateBotton(this.props, this.state);
    }

    componentWillUpdate(newProps, newState) {
        if (this.props.selectedRow.length !== newProps.selectedRow.length
        || this.state.createRule !== newState.createRule
        || this.state.showGrid !== newState.showGrid) {
            this.updateBotton(newProps, newState);
        }

        if (!isEqual(newState.currentRule, this.state.currentRule)) {
            this.setState({
                isValid: this.checkValidity(newState.currentRule)
            });
        }
    }

    onAddRule() {
        this.setState({
            createRule: true,
            currentRule: {
                role: '',
                user: '',
                service: '',
                request: '',
                workspace: '',
                layer: '',
                access: '',
                ip: '*'
            },
            initialRule: {
                role: '',
                user: '',
                service: '',
                request: '',
                workspace: '',
                layer: '',
                access: '',
                ip: '*'
            },
            editState: 'create'
        });
    }

    onEditRule() {
        const currentRule = head(this.state._rows.filter(row => isNumber(this.props.selectedRow[0]) && row.check === this.props.selectedRow[0]));
        if (currentRule) {
            this.setState({
                createRule: true,
                editState: 'edit',
                currentRule,
                initialRule: {...currentRule}
            });
        }
    }

    renderLeftColumn() {
        return !this.props.position.match('center') ? (
            <div key="ms-v-bar" className="ms-vertical-toolbar ms-sm" style={{order: this.props.position.match('left') ? -1 : 1}}>
                <Toolbar btnGroupProps={{vertical: true}} btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary', tooltipPosition: this.props.position.match('left') ? 'right' : 'left'}} buttons={this.state.buttons}/>

            </div>
        ) : null;
    }

    renderEditRule(rule) {
        const rowData = [{
            label: 'Role',
            enabled: true,
            placeholder: 'Select Role',
            options: [
                'All',
                'ADMIN',
                'USER'
            ]
        }, {
            label: 'User',
            enabled: true,
            placeholder: 'Select User',
            options: [
                'All',
                'admin',
                'user001',
                'MapStoreUser'
            ]
        }, {
            label: 'IP',
            enabled: true,
            placeholder: 'Filter IP'
        }, {
            label: 'Service',
            enabled: true,
            placeholder: 'Select Service',
            options: [
                'All',
                'WMS',
                'WFS'
            ]
        }, {
            label: 'Request',
            enabled: rule && rule.service,
            placeholder: 'Select Request',
            options: rule && rule.service === 'WMS' ? [
                'All',
                'GetCapabilities',
                'GetMap',
                'GetFeatureInfo',
                'DescribeLayer',
                'GetLegendGraphic'
            ] : [
                'All',
                'GetCapabilities',
                'DescribeFeatureType',
                'GetFeature',
                'LockFeature',
                'Transaction'
            ]
        }, {
            label: 'Workspace',
            enabled: true,
            placeholder: 'Select Workspace',
            options: [
                'All',
                'topp',
                'dem'
            ]
        }, {
            label: 'Layer',
            enabled: rule && rule.workspace,
            placeholder: 'Select Layer',
            options: rule && rule.workspace === 'dem' ? [
                'All',
                'terrain',
                'Italy',
                'world'
            ] : [
                'All',
                'USA Population',
                'World Population'
            ]
        }, {
            label: 'Access',
            enabled: true,
            placeholder: 'Select Access Rule',
            options: [
                'ALLOW',
                'DENY'
            ]
        }];

        const onChange = (key, value) => {
            this.setState({
                currentRule: {...this.state.currentRule, [key]: value}
            });
        };
        return (
            <Grid className="ms-rule-editor" fluid style={{width: '100%'}}>
                {
                    rowData.map(d => {
                        return (
                            <Row className={d.enabled ? '' : 'ms-disabled'}>
                                <Col xs={12} sm={6}>
                                    {d.label}:
                                </Col>
                                <Col xs={12} sm={6}>
                                    {d.options ?
                                        <Combobox
                                            disabled={!d.enabled}
                                            value={rule && rule[d.label.toLowerCase()] || ''}
                                            filter="contains"
                                            data={d.options}
                                            placeholder={d.placeholder || ''}
                                            onChange={e => { onChange(d.label.toLowerCase(), e); }}/> :
                                        <FormGroup>
                                            <FormControl disabled={!d.enabled} value={rule && rule[d.label.toLowerCase()]} placeholder={d.placeholder || ''} type="text"
                                                onChange={e => {
                                                    onChange(d.label.toLowerCase(), e.target.value);
                                                }}
                                                />
                                        </FormGroup>

                                    }
                                </Col>
                            </Row>
                        );
                    })
                }
            </Grid>
        );
    }

    renderStyles() {
        const styles = [{
            title: 'Custom style for polygon',
            description: 'custom',
            id: '001-0'
        }, {
            title: 'New style',
            description: 'new',
            id: '002-0'
        }, {
            title: 'Polygon style',
            description: 'only polygon',
            id: '003-0'
        }];
        return (
            <Grid className="ms-rule-editor" fluid style={{width: '100%'}}>
                {styles.map((r, i) => {
                    return (
                        <div>
                            {i === 0 && <h5>Default Style</h5>}
                            <SideCard
                                preview={<Glyphicon glyph={r.preview || 'geoserver'} />}
                                className={'ms-sm'}
                                title={r.title}
                                description={r.description}
                                caption={r.caption || ''}
                                onClick={() => {}}/>
                            {i === 0 && <h5>Available Styles</h5>}
                        </div>
                    );
                })}
            </Grid>
        );
    }

    renderMap() {
        return (
            <ContainerDimensions>
                { ({width, height}) => <ItalyMap region={'all'} width={width - 40} height={height - 40}/> }
            </ContainerDimensions>
        );
    }

    renderFilters() {
        return (
            <Grid className="ms-rule-editor" fluid style={{width: '100%'}}>
                <SwitchPanel title="CQL Filter Read Rules">
                    <div style={{width: '100%'}}>
                    <ContainerDimensions>
                    {({width}) => <div style={{width}}>
                        <Codemirror
                            options={{
                            mode: {name: "sql"},
                            lineNumbers: true,
                            lineWrapping: true
                        }}/>
                    </div>}

                    </ContainerDimensions>
                    </div>
                </SwitchPanel>
                <SwitchPanel title="CQL Filter Write Rules">
                    <div style={{width: '100%'}}>
                    <ContainerDimensions>
                    {({width}) => <div style={{width}}>
                        <Codemirror
                            options={{
                            mode: {name: "sql"},
                            lineNumbers: true,
                            lineWrapping: true
                        }}/>
                    </div>}

                    </ContainerDimensions>
                    </div>
                </SwitchPanel>
                <SwitchPanel title="Region of interest" onSwitch={expanded => {
                    this.setState({
                        regionOI: expanded
                    });
                }}>
                    <Row>
                        <Col sm={6}>
                            Type:
                        </Col>
                        <Col sm={6}>
                            <Combobox
                                value={'Viewport'}
                                data={['Viewport', 'Rectangle', 'Circle', 'Polygon', 'CQL Filter']}
                                placeholder="Select Type"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            Operation:
                        </Col>
                        <Col sm={6}>
                            <Combobox
                                value={'Intersect'}
                                filter="contains"
                                data={['Intersect', 'BoundingBox', 'Is Contained', 'Contains']}
                                placeholder="Select Operation"/>
                        </Col>
                    </Row>
                </SwitchPanel>
            </Grid>
        );
    }

    renderAttributes() {
        const mockAttributes = [{
            name: 'id',
            type: 'NUMBER',
            rule: 'READ ONLY'
        }, {
            name: 'name',
            type: 'STRING',
            rule: 'NONE'
        }, {
            name: 'address',
            type: 'STRING',
            rule: 'NONE'
        }];
        return (
            <Grid className="ms-rule-editor" fluid style={{width: '100%'}}>
                <Row>
                    <Col sm={4}>
                        <strong>Name</strong>
                    </Col>
                    <Col sm={4}>
                        <strong>Type</strong>
                    </Col>
                    <Col sm={4}>
                        <strong>Rule</strong>
                    </Col>
                </Row>
                <hr/>
                {mockAttributes.map(mA => {
                    return (
                        <Row>
                            <Col sm={4}>
                                {mA.name}
                            </Col>
                            <Col sm={4}>
                                <pre>{mA.type}</pre>
                            </Col>
                            <Col sm={4}>
                                <Combobox
                                    value={mA.rule}
                                    data={[
                                        'NONE',
                                        'READ ONLY',
                                        'READ WRITE'
                                    ]}/>
                            </Col>
                        </Row>
                    );
                })}
            </Grid>
        );
    }

    renderTab() {
        switch (this.state.activeKey) {
            case "1":
            return this.renderEditRule(this.state.currentRule);
            case "2":
            return this.renderStyles(this.state.currentRule);
            case "3":
            return this.renderFilters(this.state.currentRule);
            case "4":
            return this.renderAttributes(this.state.currentRule);
            default:
            return null;
        }
    }

    renderBody() {
        const buttons = [{
            glyph: '1-close',
            tooltip: 'Exit from create rule',
            visible: this.state.createRule,
            onClick: () => {
                if (isEqual(this.state.initialRule, this.state.currentRule)) {
                    this.setState({
                        activeKey: "1",
                        createRule: false,
                        regionOI: false,
                        initialRule: {},
                        step: 0
                    });
                } else {
                    this.setState({
                        showNotComplete: true
                    });
                }
            }
        }, {
            glyph: 'floppy-disk',
            tooltip: 'Save current rule',
            visible: this.state.createRule,
            onClick: () => {
                if (this.checkValidity(this.state.currentRule)) {
                    if (this.state.editState === 'create') {
                        this.setState({
                            activeKey: "1",
                            createRule: false,
                            regionOI: false,
                            _rows: [...this.state._rows, {...this.state.currentRule, check: count, priority: count, grab: 0}],
                            step: 0
                        });
                        count++;
                    } else {
                        this.setState({
                            activeKey: "1",
                            createRule: false,
                            regionOI: false,
                            _rows: [...this.state._rows.filter(row => row.check !== this.state.currentRule.check), {...this.state.currentRule}],
                            step: 0
                        });
                    }
                } else {
                    this.setState({
                        showIncompleteModal: true
                    });
                }
            }
        }, {
            glyph: 'plus',
            tooltip: 'Add a style',
            visible: this.state.createRule && this.state.activeKey === "2",
            onClick: () => {

            }
        }];
        return (
            <BorderLayout header={<div className="ms-panel-header-container">
                <div className="ms-toolbar-container">
                    <Toolbar btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary', tooltipPosition: 'bottom'}} buttons={buttons}/>
                </div>
                <Nav bsStyle="tabs" activeKey={this.state.activeKey || "1"} justified onSelect={activeKey => {

                    if (activeKey !== this.state.activeKey) {
                        this.setState({
                            activeKey,
                            regionOI: false
                        });
                    } else {
                        this.setState({
                            activeKey
                        });
                    }

                }}>
                    <NavItem eventKey="1" >General Rule</NavItem>
                    <NavItem eventKey="2" disabled={!this.state.isValid}>Style</NavItem>
                    <NavItem eventKey="3" disabled={!this.state.isValid}>Filters</NavItem>
                    <NavItem eventKey="4" disabled={!this.state.isValid}>Attributes Rule</NavItem>
                </Nav>
            </div>}>
                {this.renderTab()}
            </BorderLayout>
        );
    }

    renderWizard() {
        return (
            <Wizard
                step={this.state.step}
                setPage={() => 0}
                onFinish={() => {}}
                isStepValid={ () => true} hideButtons>
                <WizardPage
                    title="Select Layer"
                    onBack={() => {
                        this.setState({
                            activeKey: "1",
                            createRule: false,
                            regionOI: false,
                            initialRule: {},
                            step: 0
                        });
                    }}
                    cards={[{
                        title: 'All',
                        description: 'Apply to all layers',
                        layer: 'layers',
                        workspace: 'All',
                        name: 'All',
                        id: '001-0'
                    }, {
                        title: 'OrtofotoRegione2010',
                        description: 'geosolutions:OrtofotoRegione2010',
                        layer: 'OrtofotoRegione2010',
                        workspace: 'geosolutions',
                        name: 'Ortofoto Regione',
                        id: '001-0'
                    }, {
                        title: 'A sample ArcGrid file',
                        description: 'nurc:Arc_Sample',
                        layer: 'Arc_Sample',
                        workspace: 'nurc',
                        name: 'ArcGrid',
                        id: '002-0'
                    }, {
                        title: 'mosaic',
                        description: 'nurc:mosaic',
                        layer: 'mosaic',
                        workspace: 'nurc',
                        name: 'Mosaic',
                        id: '003-0'
                    }, {
                        title: 'North America sample imagery',
                        description: 'nurc:Img_Sample',
                        layer: 'Img_Sample',
                        workspace: 'nurc',
                        name: 'North America',
                        id: '004-0'
                    }]}
                    onClick={(card) => {
                        this.setState({
                            step: 1,
                            currentRule: {...this.state.currentRule, layer: card.layer, workspace: card.workspace}
                        });
                    }}/>
                <WizardPage
                    title="Select User"
                    cards={[{
                        title: 'ALL',
                        description: 'Apply to all',
                        preview: '1-group',
                        id: '000-0'
                    }, {
                        title: 'ADMIN',
                        description: 'Apply to all admin users',
                        preview: 'user',
                        id: '001-0'
                    }, {
                        title: 'USER',
                        description: 'Apply to all users',
                        preview: 'user',
                        id: '002-0'
                    }, {
                        title: 'admin',
                        description: 'ADMIN',
                        preview: 'user',
                        id: '003-0'
                    }, {
                        title: 'user0001',
                        description: 'USER',
                        preview: 'user',
                        id: '004-0'
                    }, {
                        title: 'MapStoreUser',
                        description: 'USER',
                        preview: 'user',
                        id: '005-0'
                    }]}
                    onBack={() => {
                        this.setState({
                            step: 0
                        });
                    }}
                    onClick={(card) => {
                        this.setState({
                            step: 2,
                            currentRule: {...this.state.currentRule, user: card.title, role: card.description}
                        });
                    }}/>
                <WizardPage
                    title="Select Service"
                    cards={[{
                        title: 'All',
                        description: 'Apply to all services',
                        id: '001-0'
                    }, {
                        title: 'GetCapabilities',
                        description: 'WMS',
                        id: '001-0'
                    }, {
                        title: 'GetMap',
                        description: 'WMS',
                        id: '002-0'
                    }, {
                        title: 'GetFeatureInfo',
                        description: 'WMS',
                        id: '003-0'
                    }, {
                        title: 'DescribeLayer',
                        description: 'WMS',
                        id: '004-0'
                    }, {
                        title: 'GetLegendGraphic',
                        description: 'WMS',
                        id: '005-0'
                    }, {
                        title: 'GetCapabilities',
                        description: 'WFS',
                        id: '006-0'
                    }, {
                        title: 'DescribeFeatureType',
                        description: 'WFS',
                        id: '007-0'
                    }, {
                        title: 'GetFeature',
                        description: 'WFS',
                        id: '008-0'
                    }, {
                        title: 'LockFeature',
                        description: 'WFS',
                        id: '009-0'
                    }, {
                        title: 'Transaction',
                        description: 'WFS',
                        id: '010-0'
                    }]}
                    onBack={() => {
                        this.setState({
                            step: 1
                        });
                    }}
                    onClick={(card) => {
                        this.setState({
                            step: 3,
                            currentRule: {...this.state.currentRule, request: card.title, service: card.description}
                        });
                    }}/>
                <WizardPage
                    title="Select Access"
                    cards={[{
                        title: 'ALLOW',
                        description: ' ',
                        preview: 'ok',
                        id: '001-0'
                    }, {
                        title: 'DENY',
                        description: ' ',
                        preview: 'remove',
                        id: '002-0'
                    }]}
                    onBack={() => {
                        this.setState({
                            step: 2
                        });
                    }}
                    onClick={(card) => {
                        this.setState({
                            step: 4,
                            currentRule: {...this.state.currentRule, access: card.title}
                        });
                    }}/>
                {this.renderBody()}
            </Wizard>);
    }

    renderPanel() {
        return !this.props.position.match('center') ? (
            <div style={{order: this.props.position.match('left') ? -1 : 1, display: this.state.createRule ? 'block' : 'none'}} className="ms-rules-side">
                {this.state.editState === 'create' ? this.renderWizard() : this.renderBody()}
            </div>
        ) : null;
    }

    renderCards() {
        return (
            <BorderLayout header={
                <Grid fluid style={{width: '100%'}}>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Filter filterPlaceholder="Filter rules..." filterText={this.state.filterText} onFilter={(value) => {
                            this.setState({
                                filterText: value
                            });
                        }}/>
                    </Col>
                </Grid>
            }>
            <Grid fluid style={{width: '100%'}}>
                {this.state._rows.map(row => {
                    const show = head(Object.keys(row).filter(key => {
                        const str = row[key] + '';
                        return str.match(this.state.filterText || '');
                    }));

                    return show ? (
                        <Col xs={12} sm={4} md={3} lg={2} style={{height: 200, display: 'flex', padding: '0 4px' }} className="text-center">
                            <div className={'ms-grid-card ' + (row.access === 'DENY' ? 'ms-card-danger' : 'ms-card-success')}>
                                <h2>{row.workspace + ' : ' + row.layer}</h2>
                                <h4>{row.service + ' ' + row.request}</h4>
                                <h1><Glyphicon className={row.access === 'DENY' ? 'text-danger' : 'text-success'} glyph={row.access === 'DENY' ? 'remove' : 'ok'}/> {/*row.access*/}</h1>
                                <h3>{row.user}</h3>
                            </div>
                        </Col>
                    ) : null;
                })}
            </Grid>
            </BorderLayout>

        );
    }

    /*

    <ReactDataGrid
        onAddFilter={this.handleFilterChange}
        minWidth={width}
        columns={this.state._columns}
        rowsCount={this.state._rows.length}
        minHeight={height}
        toolbar={<GridToolbar />}
        rowRenderer={RowRenderer}
        rowGetter={(i) => {
            return this.state._rows[i];
        }}/>

        :this.state.showGrid ?
   this.renderCards(width, height)
    */

    render() {
        return (
            <div className="mapstore-body">
                <BorderLayout header={this.props.position.match('center') ? <div className="">
                    <Toolbar btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary', tooltipPosition: 'bottom'}} buttons={this.props.buttons}/>
                </div> : null} columns={this.props.position.match('left') ? [this.renderLeftColumn(), this.renderPanel()] : [this.renderPanel(), this.renderLeftColumn()]}>
                    <ContainerDimensions>
                        {({width, height}) =>

                            <ReactDataGrid
                                onAddFilter={this.handleFilterChange}
                                minWidth={width}
                                columns={this.state._columns}
                                rowsCount={this.state._rows.length}
                                minHeight={height}
                                toolbar={<GridToolbar />}
                                rowRenderer={RowRenderer}
                                rowGetter={(i) => {
                                    return this.state._rows[i];
                                }}/>

                        }
                    </ContainerDimensions>
                    {this.state.createRule && !this.props.position.match('center') && <div className="ms-overlay">
                        {this.state.createRule && this.state.activeKey === "3" && this.state.regionOI && this.renderMap()}
                    </div>}
                </BorderLayout>
                {this.props.position.match('center') &&
                <Portal>
                    <ResizableModal
                        title="Create New Rule"
                        show={this.state.createRule}
                        onClose={() => {
                            this.setState({
                                createRule: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'Close',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        createRule: false
                                    });
                                }
                            },
                            {
                                text: 'Save',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        createRule: false
                                    });
                                }
                            }
                        ]}>
                        {this.renderBody()}
                    </ResizableModal>
                </Portal>
                }

                <Portal>
                    <ResizableModal
                        title="Incomlete Form"
                        size="xs"
                        show={this.state.showIncompleteModal}
                        onClose={() => {
                            this.setState({
                                showIncompleteModal: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'Ok',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        showIncompleteModal: false
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                The form must be completed before save.
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>

                <Portal>
                    <ResizableModal
                        title="Save chenges"
                        size="xs"
                        show={this.state.showNotComplete}
                        onClose={() => {
                            this.setState({
                                showNotComplete: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'No',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        showNotComplete: false

                                    });
                                }
                            },
                            {
                                text: 'Yes',
                                bsStyle: 'primary',
                                onClick: () => {
                                    this.setState({
                                        showNotComplete: false,
                                        activeKey: "1",
                                        createRule: false,
                                        regionOI: false,
                                        initialRule: {},
                                        step: 0
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                Are you sure to close without save your changes?
                            </div>
                        </div>

                    </ResizableModal>
                </Portal>

                {/*<Button className="square-button floating-btn" bsStyle="primary"><Glyphicon glyph="plus"/></Button>*/}
            </div>
        );
    }

    handleFilterChange = (filter) => {
        let newFilters = {...this.state.filters};
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters });
    }

    checkValidity(currentRule) {

        return !head(Object.keys(currentRule).filter(r => isNil(currentRule[r])));
    }

    updateBotton(props, state) {

        this.setState({
            buttons: [{
                glyph: 'plus',
                tooltip: 'Add a Rule',
                visible: !state.createRule && props.selectedRow.length === 0,
                onClick: () => {
                    this.onAddRule();
                }
            }, {
                glyph: 'pencil',
                tooltip: 'Edit selected Rule',
                visible: props.selectedRow.length === 1 && !state.createRule,
                onClick: () => {
                    this.onEditRule();
                }
            }, {
                glyph: 'trash',
                tooltip: 'Remove selected rules',
                visible: props.selectedRow.length > 0 && !state.createRule,
                onClick: () => {
                    this.setState({
                        _rows: this.state._rows.filter(row => !isNumber(head(this.props.selectedRow.filter(r => r === row.check))))
                    });

                    this.props.setOption('selectedRowRules', []);
                }
            } /* , {
                glyph: state.showGrid ? 'th' : 'features-grid',
                tooltip: state.showGrid ? 'Display cards' : 'Display grid',
                visible: !state.createRule,
                onClick: () => {
                    this.setState({
                        showGrid: !this.state.showGrid
                    });
                }
            }*/]
        });

    }

}

const RulesManagerPlugin = connect((state) => ({
    selectedRow: state.mockups && state.mockups.selectedRowRules || []
}), {
    setOption
})(RulesManager);


module.exports = {
    RulesManagerPlugin
};