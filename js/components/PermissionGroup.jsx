const React = require('react');
const PropTypes = require('prop-types');
const {ButtonGroup, Button, Glyphicon, Row, Col, OverlayTrigger, Tooltip} = require('react-bootstrap');
const Combobox = require('react-widgets').Combobox;
const {isEqual} = require('lodash');

class PermissionGroup extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        components: PropTypes.array,
        onRemove: PropTypes.func,
        onChange: PropTypes.func
    };

    static defaultProps = {
        id: 0,
        components: [],
        onRemove: null,
        onChange: () => {}
    };

    state = {
        components: []
    };

    componentWillMount() {
        this.cnt = 0;
        this.setState( {
            components: this.props.components.map((c) => {
                this.cnt = c.id;
                return {id: c.id, component: this.renderRow(c.id)};
            })
        });
    }

    componentWillUpdate(newProps, newState) {
        if (this.state.components.length !== newState.components.length) {
            this.props.onChange([...newState.components]);
        }
        if (!isEqual(this.props.components, newProps.components)) {
            this.setState( {
                components: [...newProps.components]
            });
        }
    }

    renderRow(id) {
        return (
            <Row key={id}>
                <Col xs={2} className="ms-col-grab ms-col">
                    <Glyphicon glyph="menu-hamburger"/>
                </Col>
                <Col xs={5} className="ms-col">
                    <Combobox value="everyone" data={['everyone', 'admins']} placeholder=""/>
                </Col>
                <Col xs={3} className="ms-col">
                    <Combobox filter="contains" value="can view" data={['can edit', 'can view']} placeholder=""/>
                </Col>
                <Col xs={2} className="ms-col">
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
        );
    }

    render() {
        return (
            <div className="mapstore-permission-group">
                <Row>
                    <Col xs={10} className="ms-col">
                        <div>Groups Permissions</div>
                    </Col>
                    <Col xs={2} className="ms-col">
                        <ButtonGroup className="pull-right">
                            <OverlayTrigger placement="top" overlay={<Tooltip id="add-new-condition">Add new condition</Tooltip>}>
                                <Button className="square-button-md no-border" onClick={() => {
                                    const id = this.cnt;
                                    this.setState({
                                        components: [...this.state.components, {id, component: this.renderRow(id)}]
                                    });
                                    this.cnt++;
                                }}><Glyphicon glyph="plus"/></Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </Col>
                </Row>
                <span>
                    {this.state.components.map(c => c.component)}
                </span>
            </div>
        );
    }
}

module.exports = PermissionGroup;
