const React = require('react');
const PropTypes = require('prop-types');
const {Glyphicon} = require('react-bootstrap');

class FakeIcons extends React.Component {

    static propTypes = {
        style: PropTypes.object,
        count: PropTypes.number
    };

    static defaultProps = {
        style: {
            glyph: 'star',
            stroke: '#fff',
            fill: '#c00'
        },
        count: 20
    };

    componentWillMount() {
        this.icons = [];
        for (let i = 0; i < this.props.count; i++) {
            this.icons.push([Math.random() * 100, Math.random() * 100]);
        }
    }

    render() {
        const p = Object.assign({}, this.props.style);
        return (<span>
            {this.icons.map(i => <div style={{top: i[0] + '%', left: i[1] + '%'}} className="fake-icons">
            {p.glyph === 'font' ?
                <div style={{textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke, color: p.fill, width: 120, height: 12, fontSize: 30}}>{'label'}</div>
             : <Glyphicon style={{
                textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke,
                color: p.fill
            }} glyph={p.glyph === 'list' ? '' : p.glyph}/>}

            </div>)}</span>
        );
    }
}

module.exports = FakeIcons;
