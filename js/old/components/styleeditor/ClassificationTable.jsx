const React = require('react');
const PropTypes = require('prop-types');
const ColorPicker = require('../../../../old_ms2_226bfec4/web/client/components/style/ColorPicker');
const {FormGroup, FormControl, Table, Glyphicon} = require('react-bootstrap');

class ClassificationTable extends React.Component {

    static propTypes = {
        edit: PropTypes.bool,
        rows: PropTypes.array,
        onChangeText: PropTypes.func,
        onSelect: PropTypes.func
    };

    static defaultProps = {
        edit: false,
        onChangeText: () => {},
        onSelect: () => {},
        rows: [{
            color: {r: 159, g: 195, b: 255, a: 100 },
            quantity: 0.00,
            label: 0.00
        }, {
            color: {r: 97, g: 139, b: 208, a: 100 },
            quantity: 63.75,
            label: 63.75
        }, {
            color: {r: 66, g: 92, b: 136, a: 100 },
            quantity: 127.50,
            label: 127.50
        }, {
            color: { r: 40, g: 56, b: 82, a: 100 },
            quantity: 191.25,
            label: 191.25
        }, {
            color: { r: 10, g: 56, b: 82, a: 100 },
            quantity: 250.15,
            label: 250.15
        }]
    };

    componentWillMount() {
        this.setState({color: this.props.color});
    }

    componentWillUpdate(newProps) {
        if (this.props.rows.length > newProps.rows.length) {
            this.setState({selected: -1});
        }
    }

    render() {
        return !this.props.edit
            ? (
                <div className="mapstore-color-classification-table">
                    <Table responsive bordered>
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Label</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.rows.map(row => {
                                return (<tr>
                                    <td><div style={{width: '100%', height: 24, backgroundColor: 'rgba(' + row.color.r + ', ' + row.color.g + ', ' + row.color.b + ', 1)'}}></div></td>
                                    <td>{row.quantity}</td>
                                    <td>{row.label}</td>
                                </tr>);
                            })}
                        </tbody>
                    </Table>
                </div>
            )
            : (
                <div className="mapstore-color-classification-table">
                    <Table responsive bordered>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Label</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.rows.map((row, idx) => {
                                const selected = idx === this.state.selected ? 'check' : 'unchecked';
                                return (<tr>
                                    <td><Glyphicon glyph={selected} onClick={() => {
                                        this.props.onSelect(idx);
                                        this.setState({
                                            selected: idx
                                        });
                                    }}/></td>
                                    <td><ColorPicker text="" value={row.color} onChangeColor={(color) => {
                                        this.props.onChangeText({color, label: row.label, quantity: row.quantity}, idx);
                                    }}/></td>
                                    <td><FormGroup controlId="stats-title">
                                        {/* placeholder as mockup*/}
                                        <FormControl type="text" value={row.quantity} onChange={(e) => {
                                            this.props.onChangeText({color: row.color, label: row.label, quantity: e.target.value}, idx);
                                        }}/>
                                </FormGroup></td>
                                    <td><FormGroup controlId="stats-title">

                                        <FormControl type="text" value={row.label} onChange={(e) => {
                                            this.props.onChangeText({color: row.color, label: e.target.value, quantity: row.quantity}, idx);
                                        }}/>
                                </FormGroup></td>
                                </tr>);
                            })}
                        </tbody>
                    </Table>
                </div>
            );
    }
}

module.exports = ClassificationTable;
