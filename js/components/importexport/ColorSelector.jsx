const React = require('react');
const PropTypes = require('prop-types');
const ColorPicker = require('../../../old_ms2_226bfec4/web/client/components/style/ColorPicker');
const {Glyphicon} = require('react-bootstrap');

class ColorSelector extends React.Component {

    static propTypes = {
        color: PropTypes.shape({r: PropTypes.number, g: PropTypes.number, b: PropTypes.number, a: PropTypes.number}),
        checked: PropTypes.bool
    };

    static defaultProps = {
        color: {r: 147, g: 96, b: 237, a: 100},
        checked: false
    };

    componentWillMount() {
        this.setState({
            color: this.props.color
        });
    }

    render() {
        return (<div className="mapstore-color-selector">
            <ColorPicker text=""
                value={this.state.color}
                onChangeColor={(color) => {
                    this.setState({
                        color
                    });
                }}/>
            <Glyphicon glyph="1-stilo" />
        </div>);
    }
}

module.exports = ColorSelector;
