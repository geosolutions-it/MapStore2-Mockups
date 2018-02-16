const React = require('react');
const PropTypes = require('prop-types');
const {Grid, Row, Col, FormGroup, FormControl} = require('react-bootstrap');
const {isEqual, head} = require('lodash');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const draggableComponent = require('../enhancers/draggableComponent');
const draggableContainer = require('../enhancers/draggableContainer');
let cnt = 0;
class CorrdinatesRowComponent extends React.Component {

    static propTypes = {
        idx: PropTypes.number,
        component: PropTypes.object,
        onRemove: PropTypes.func,
        onChange: PropTypes.func,
        isDraggable: PropTypes.bool
    };

    render() {
        const {component, idx} = this.props;

        return (
            <Row style={{marginLeft: 0, marginRight: 0}}>
                {this.props.isDraggable && <Col xs={1}>
                    <Toolbar
                        btnDefaultProps={{ className: 'square-button-md no-border'}}
                        buttons={
                        [
                            {
                                glyph: 'menu-hamburger'
                            }
                        ]
                    }/>
                </Col>}
                <Col xs={5}>
                    <FormGroup>
                        <FormControl
                            value={component.lat}
                            placeholder="Lat"
                            onChange={e => {
                                this.props.onChange(idx, 'lat', e.target.value);
                            }}
                            type="number"/>
                    </FormGroup>
                </Col>
                <Col xs={5}>
                <FormGroup>
                    <FormControl
                        value={component.lon}
                        placeholder="Lon"
                        onChange={e => {
                            this.props.onChange(idx, 'lon', e.target.value);
                        }}
                        type="number"/>
                </FormGroup>
                </Col>
                <Col xs={this.props.isDraggable ? 1 : 2}>
                    <Toolbar
                        btnGroupProps={{ className: 'pull-right' }}
                        btnDefaultProps={{ className: 'square-button-md no-border'}}
                        buttons={
                        [
                            {
                                glyph: 'trash',
                                onClick: () => {
                                    this.props.onRemove(idx);
                                }
                            }
                        ]
                    }/>
                </Col>
            </Row>
        );
    }
}

const CorrdinatesRow = draggableComponent(CorrdinatesRowComponent);

class ConditionsGroup extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        components: PropTypes.array,
        onRemove: PropTypes.func,
        onlyRows: PropTypes.bool,
        onChange: PropTypes.func,
        transitionProps: PropTypes.bool,
        isDraggable: PropTypes.bool,
        onComplete: () => {},
        noComplete: PropTypes.bool
    };

    static defaultProps = {
        id: 0,
        components: [],
        onRemove: null,
        onlyRows: false,
        onChange: () => {},
        transitionProps: {
            transitionName: "switch-panel-transition",
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        },
        isDraggable: false,
        noComplete: false
    };

    state = {
        components: []
    };

    componentWillMount() {
        this.cnt = 0;
        this.setState( {
            components: this.props.components || []
        });
    }
/*
    componentWillReceiveProps(newProps) {
        if (newProps.components) {
            console.log(newProps.components);
            this.setState( {
                components: newProps.components
            });
        }
    }*/

    componentWillUpdate(newProps, newState) {
        if (!isEqual(this.state.components, newState.components)) {
            this.props.onChange(newState.components);
        }
    }

    render() {
        const validCoords = this.state.components.filter(cmp => !isNaN(parseFloat(cmp.lat)) && !isNaN(parseFloat(cmp.lon)));
        return (
            <Grid fluid style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <Row>
                    <Col xs={6}>
                        Coordinates Editor:
                    </Col>
                    <Col xs={6}>
                        <Toolbar
                            btnGroupProps={{ className: 'pull-right' }}
                            btnDefaultProps={{ className: 'square-button-md no-border'}}
                            buttons={[
                                {
                                    glyph: validCoords.length > 2 ? 'ok' : 'exclamation-mark',
                                    tooltip: validCoords.length > 2 ? 'Complete current geometry' : 'Add 3 valid coordinates to complete the polygon',
                                    visible: !this.props.noComplete,
                                    onClick: () => {
                                        if (validCoords.length > 2) {
                                            const components = [...this.state.components];
                                            this.props.onComplete(components);
                                            this.setState({
                                                components: []
                                            });
                                        }
                                    }
                                },
                                {
                                    glyph: 'plus',
                                    tooltip: 'Add new coordinates',
                                    onClick: () => {
                                        this.setState({
                                            components: [...this.state.components, {
                                                id: 'cmp:' + cnt
                                            }]
                                        });
                                        cnt++;
                                    }
                                }
                            ]}/>
                    </Col>
                    {this.props.isDraggable && <Col xs={1}/>}
                    <Col xs={5}>
                        Latitude
                    </Col>
                    <Col xs={5}>
                        Longitude
                    </Col>
                    <Col xs={this.props.isDraggable ? 1 : 2}/>
                </Row>
                <Row style={{flex: 1, overflowY: 'auto'}}>
                    {this.state.components.map((component, idx) => <CorrdinatesRow
                        sortId={idx}
                        key={component.id}
                        isDraggable={this.props.isDraggable}
                        onChange={(id, key, value) => {
                            this.setState({
                                components: this.state.components.map((cmp, i) => {
                                    if (i === id) {
                                        return {...cmp, [key]: value};
                                    }
                                    return {...cmp};
                                })
                            });
                        }}
                        onSort={(targetId, currentId) => {
                            this.setState({
                                components: this.state.components.reduce((allCmp, cmp, id) => {
                                    if (targetId === id) {
                                        return targetId > currentId ?
                                            [...allCmp, {...cmp}, head(this.state.components.filter((cm, i) => i === currentId))]
                                            :
                                            [...allCmp, head(this.state.components.filter((cm, i) => i === currentId)), {...cmp}];
                                    }
                                    if (currentId === id) {
                                        return [...allCmp];
                                    }
                                    return [...allCmp, {...cmp}];
                                }, []).filter(val => val)
                            });
                        }}
                        idx={idx}
                        component={component}
                        onRemove={() => {
                            this.setState({
                                components: this.state.components.filter((cmp, i) => i !== idx)
                            });
                        }}/>)}
                </Row>
            </Grid>
        );
    }
}

module.exports = draggableContainer(ConditionsGroup);
