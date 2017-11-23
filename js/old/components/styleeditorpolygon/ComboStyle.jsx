const React = require('react');
const PropTypes = require('prop-types');
const Combobox = require('react-widgets').Combobox;
const {Row, Col, Button, ButtonGroup, Glyphicon} = require('react-bootstrap');

class ComboStyle extends React.Component {

    static propTypes = {
        onRefresh: PropTypes.func,
        onToggle: PropTypes.func,
        onCode: PropTypes.func
    };

    static defaultProps = {
        onRefresh: () => {},
        onToggle: () => {},
        onCode: () => {}
    };

    render() {
        return (
            <span>
                <div className="mapstore-block-width">
                    <ButtonGroup className="pull-right m-square-group-md">
                        <Button bsStyle="primary" className="square-button-md" onClick={() => { this.props.onToggle(); }}>
                            <Glyphicon glyph="1-stilo"/>
                        </Button>
                        <Button bsStyle="primary" className="square-button-md" onClick={() => { this.props.onCode(); }}>
                            <Glyphicon glyph="code" />
                        </Button>

                    </ButtonGroup>
                </div>
                <div className = "mapstore-block-width" > <div className="m-block-padding">
                    <Row>
                        <Col xs={10}>
                            <Combobox data={['Default', 'Custom']} placeholder="Select style"/>
                        </Col>
                        <Col xs={2}>
                            <Button bsStyle="primary" className="square-button-md pull-right" onClick={() => { this.props.onRefresh(); }}>
                                <Glyphicon glyph="refresh"/>
                            </Button>
                        </Col>
                    </Row>

                </div>
            </div>
        </span>);
    }
}

module.exports = ComboStyle;
