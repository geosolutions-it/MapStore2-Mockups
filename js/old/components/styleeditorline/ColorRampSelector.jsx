const React = require('react');
const PropTypes = require('prop-types');
const colorsSchema = require("../../../../old_ms2_226bfec4/web/client/components/style/EqualIntervalComponents/ColorRamp");
const ColorRampItem = require('../../../../old_ms2_226bfec4/web/client/components/style/EqualIntervalComponents/ColorRampItem');
const colors = require("../../../../old_ms2_226bfec4/web/client/components/style/EqualIntervalComponents/ExtendColorBrewer");
const Combobox = require('react-widgets').Combobox;

class ColorRampSelector extends React.Component {

    static propTypes = {
        classes: PropTypes.number,
        ramp: PropTypes.string
    };

    static defaultProps = {
        classes: 5,
        ramp: 'Blues'
    };

    componentWillMount() {
        this.setState({
            ramp: this.props.ramp
        });
    }

    getColorsSchema = () => {
        return this.props.classes ?
            colorsSchema.filter((c) => {
                return c.max >= this.props.classes;
            }, this) : colorsSchema;
    };

    getRampValue = () => {
        let ramp = this.state.ramp;
        if (!colors[this.state.ramp][this.props.classes]) {
            ramp = colorsSchema.filter((color) => { return color.max >= this.props.classes; }, this)[0].name;
        }
        return ramp;
    };

    getRamp = () => {
        return colors[this.state.ramp] ? (
            colors[this.state.ramp][5].map(c => {
                return <div style={{backgroundColor: c}}></div>;
            })
        ) : null;
    }

    render() {
        return (<div className="mapstore-color-ramp-selector">
            <div className="m-ramp-preview">
                {this.getRamp()}
            </div>
            <Combobox data={this.getColorsSchema()}
                groupBy="schema"
                textField="name"
                itemComponent={ColorRampItem}
                value={this.getRampValue()}
                onChange={(ramp) => {
                    this.setState({
                        ramp: ramp.name
                    });
                }}/>
        </div>);
    }
}

module.exports = ColorRampSelector;
