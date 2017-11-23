const React = require('react');
const PropTypes = require('prop-types');
const {Glyphicon} = require('react-bootstrap');

class StringSelect extends React.Component {
    static propTypes = {
        options: PropTypes.array
    };

    static defaultProps = {
        options: [
            'any',
            'all',
            'none'
        ]
    };

    state = {
        selected: 'any'
    }

    render() {
        return (
            <span className="mapstore-string-select">
                <span onClick={() => {
                    const open = !this.state.open;
                    this.setState({open});
                }}>
                    <strong>{this.state.selected}</strong>
                    <Glyphicon glyph="chevron-down"/>
                </span>
                {this.state.open && <div className="m-options">
                    <ul>
                        {this.props.options.map((o, i) => <li key={i} onClick={() => {
                            this.setState({selected: o, open: false});
                        }}>{o}</li>)}
                    </ul>
                </div>}
            </span>
        );
    }
}

module.exports = StringSelect;
