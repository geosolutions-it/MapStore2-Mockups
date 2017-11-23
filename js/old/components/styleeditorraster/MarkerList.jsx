const React = require('react');
const PropTypes = require('prop-types');
const {Glyphicon} = require('react-bootstrap');

class MarkerList extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        selected: PropTypes.string,
        marker: PropTypes.array
    };

    static defaultProps = {
        onSelect: () => {},
        selected: 'star',
        marker: [{
            glyph: 'star'
        }, {
            glyph: '1-point'
        }, {
            glyph: 'unchecked'
        }, {
            glyph: 'tint'
        }, {
            glyph: '1-close'
        }]
    };
    state = {
        openPopover: false
    }

    componentWillMount() {
        this.setState({
            selected: this.props.selected
        });
    }

    render() {
        return (<div className="mapstore-marker-list">
            <div className="m-selected">
                <Glyphicon glyph={this.state.selected} onClick={() => {
                    this.setState({ openPopover: true });
                }}/>
            </div>
            {this.state.openPopover ? <div className="m-popover">
                <div className="m-marker-container">
                <div>Select marker</div>
                {this.props.marker.map(m => m.glyph === this.state.selected ? null : (<Glyphicon glyph={m.glyph} onClick={() => { this.setState({ selected: m.glyph, openPopover: false}); }}/>))}
                </div>
            </div> : null}
        </div>);
    }
}

module.exports = MarkerList;
