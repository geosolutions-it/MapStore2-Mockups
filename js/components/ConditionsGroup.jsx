const React = require('react');
const PropTypes = require('prop-types');
const StringSelect = require('./StringSelect');
const {ButtonGroup, Button, Glyphicon, Row, Col, OverlayTrigger, Tooltip} = require('react-bootstrap');
const Combobox = require('react-widgets').Combobox;
const {isEqual} = require('lodash');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class ConditionsGroup extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        components: PropTypes.array,
        onRemove: PropTypes.func,
        onlyRows: PropTypes.bool,
        onChange: PropTypes.func,
        transitionProps: PropTypes.bool
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
        }
    };

    state = {
        components: []
    };

    componentWillMount() {
        this.cnt = 0;
    }

    componentWillUpdate(newProps, newState) {
        if (this.state.components.length !== newState.components.length) {
            this.props.onChange(newState.components);
        }
        if (!isEqual(this.props.components, newProps.components)) {
            this.setState( {
                components: newProps.components
            });
        }
    }

    renderRow(id) {
        return (
            <div key={id} className="mapstore-block-width">
                <Row>
                    <Col xs={4}>
                        <Combobox value="Area" data={['Name', 'Abbr', 'Area']} placeholder=""/>
                    </Col>
                    <Col xs={2}>
                        <Combobox value="=" data={[
                            '=',
                            'like',
                            'ilike',
                            'isNull'
                        ]} placeholder=""/>
                    </Col>
                    <Col xs={5}>
                        <Combobox filter="contains" value="8000" data={['10000', '8000', '9500']} placeholder=""/>
                    </Col>
                    <Col xs={1}>
                        <ButtonGroup className="pull-right">
                            <OverlayTrigger placement="top" overlay={<Tooltip id="reset-current-filter-group">Remove condition</Tooltip>}>
                                <Button className="square-button-md no-border" onClick={() => {
                                    this.setState({
                                        components: this.state.components.filter(c => c.id !== id)
                                    });
                                }}>
                                    <Glyphicon glyph="trash"/>
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </Col>
                </Row>

            </div>
        );
    }

    render() {
        return (
            <div className="mapstore-conditions-group">
                <div className="mapstore-block-width">
                    <div className="select-in-string pull-left">
                        <div className="m-label">Match <StringSelect/> of the following contition</div>
                    </div>
                    <ButtonGroup className="pull-right">

                        {/*this.state.components && this.state.components.length > 0 && !this.props.onRemove &&
                            <OverlayTrigger placement="top" overlay={<Tooltip id="reset-current-filter">Reset filter</Tooltip>}>
                                <Button className="square-button-md no-border" onClick={() => {
                                    this.setState({
                                        components: []
                                    });
                                }}><Glyphicon glyph="refresh"/></Button>
                            </OverlayTrigger>
                        */}
                        {!this.props.onlyRows &&
                            <OverlayTrigger placement="top" overlay={<Tooltip id="add-new-group">Add new conditions group</Tooltip>}>
                                <Button className="square-button-md no-border" onClick={() => {
                                    const id = this.cnt;
                                    this.setState({
                                        components: [...this.state.components, {id, component: <ConditionsGroup onRemove={() => {
                                            this.setState({
                                                components: this.state.components.filter(c => c.id !== id)
                                            });
                                        }}/>}]
                                    });
                                    this.cnt++;
                                }}><Glyphicon glyph="list-alt"/></Button>
                            </OverlayTrigger>}
                            <OverlayTrigger placement="top" overlay={<Tooltip id="add-new-condition">Add new condition</Tooltip>}>
                                <Button className="square-button-md no-border" onClick={() => {
                                    const id = this.cnt;
                                    this.setState({
                                        components: [...this.state.components, {id, component: this.renderRow(id)}]
                                    });
                                    this.cnt++;
                                }}><Glyphicon glyph="plus"/></Button>
                            </OverlayTrigger>
                            {this.props.onRemove &&
                                <OverlayTrigger placement="top" overlay={<Tooltip id="reset-current-filter-group">Remove filter group</Tooltip>}>
                                    <Button className="square-button-md no-border" onClick={() => {
                                        this.setState({
                                            components: []
                                        });
                                        this.props.onRemove();
                                    }}><Glyphicon glyph="trash"/></Button>
                                </OverlayTrigger>
                            }
                    </ButtonGroup>
                </div>
                <ReactCSSTransitionGroup {...this.props.transitionProps}>
                    {this.state.components.map(c => c.component)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

module.exports = ConditionsGroup;
