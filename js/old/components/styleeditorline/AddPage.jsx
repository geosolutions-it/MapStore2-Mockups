const React = require('react');
const PropTypes = require('prop-types');
const {Col, Glyphicon, ButtonGroup, Button} = require('react-bootstrap');
const InfoPopover = require('../InfoPopover');
const Filter = require('../../../../MapStore2/web/client/components/misc/Filter');
const {head} = require('lodash');
const LineThumb = require('./LineThumb');

class AddPage extends React.Component {

    static propTypes = {
        checked: PropTypes.bool,
        pointStyles: PropTypes.array,
        lineStyles: PropTypes.array,
        plygonSytle: PropTypes.array,
        selected: PropTypes.bool,
        geoserverStyles: PropTypes.array,
        onEdit: PropTypes.func,
        onCode: PropTypes.func,
        onClick: PropTypes.func
    };

    static defaultProps = {
        checked: false,
        pointStyles: [{
            name: 'Line Red',
            glyph: 'star',
            desc: 'Line solid template',
            stroke: '#fff',
            fill: '#c00',
            style: 'solid',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 200, g: 0, b: 0, a: 100},
            linecap: 'butt', // butt round square
            linejoin: 'miter', // miter round bevel
            symbol: 'star'
        }, {
            name: 'Line yellow',
            glyph: '1-point',
            desc: 'Line solid template',
            stroke: '#fa0',
            style: 'solid',
            fill: '#fff',
            strokeMock: {r: 255, g: 125, b: 0, a: 100},
            fillMock: {r: 255, g: 255, b: 255, a: 100},
            linecap: 'square', // butt round square
            linejoin: 'bevel', // miter round bevel
            symbol: 'circle'
        }, {
            name: 'Line pink',
            glyph: 'unchecked',
            style: 'solid',
            desc: 'Line solid template',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 255, g: 0, b: 255, a: 100},
            linecap: 'round', // butt round square
            linejoin: 'round', // miter round bevel
            symbol: 'square'
        }, {
            name: 'Line pink dashed',
            glyph: 'star',
            style: 'dashed',
            desc: 'Line dashed template',
            linecap: 'square', // butt round square
            linejoin: 'bevel', // miter round bevel
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 255, g: 0, b: 255, a: 100},
            symbol: 'star'
        }, {
            name: 'Line red dashed',
            glyph: '1-point',
            style: 'dashed',
            desc: 'Line dashed template',
            linecap: 'butt', // butt round square
            linejoin: 'miter', // miter round bevel
            stroke: '#fff',
            fill: '#c00',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 200, g: 0, b: 0, a: 100},
            symbol: 'circle'
        }, {
            name: 'Line purple dashed',
            glyph: '1-close',
            desc: 'Line dashed template',
            linecap: 'round', // butt round square
            linejoin: 'round', // miter round bevel
            style: 'dashed',
            stroke: '#fff',
            fill: '#a0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 125, g: 0, b: 255, a: 100},
            symbol: 'x'
        }, {
            name: 'Labels',
            glyph: 'font',
            desc: 'Only labels template',
            linecap: 'round', // butt round square
            linejoin: 'bevel', // miter round bevel
            style: 'dashed',
            stroke: '#fff',
            fill: '#333',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 125, g: 0, b: 255, a: 100},
            symbol: 'x'
        }, {
            name: 'Classification',
            glyph: 'list',
            style: 'solid',
            desc: 'Classification template',
            linecap: 'round', // butt round square
            linejoin: 'round', // miter round bevel
            stroke: '#fff',
            fill: '#333',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 125, g: 0, b: 255, a: 100},
            symbol: 'x'
        }],
        lineStyles: [],
        plygonSytle: [],
        selected: '',
        onEdit: () => {},
        onCode: () => {},
        onClick: () => {}
    };

    componentWillMount() {
        this.setState({
            selected: this.props.selected
        });
    }

    render() {
        return (

            <div className="m-body-scroll-y">
                <div className="mapstore-block-width" style={{height: '100px'}}>
                    <div className="m-padding-md">
                        <Filter filterPlaceholder="Filter style..."/>
                    </div>
                    <div className="m-padding-md text-center" style={{fontStyle: 'italic', fontSize: 12}}>
                    <Col xs={12}>{this.state.description || head(this.props.pointStyles.filter(p => this.state.selected === 'point:' + p.name)) && head(this.props.pointStyles.filter(p => this.state.selected === 'point:' + p.name)).desc || 'Select template' }</Col>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="mapstore-style-selector m-body-scroll-y" onClick={(e) => {
                    if (e.target.getAttribute('class') === 'mapstore-style-selector m-body-scroll-y'
                || e.target.getAttribute('class') === 'm-padding-grid') {
                        this.setState({
                            selected: ''
                        });

                        this.props.onClick(null);
                    }

                    // this.props.onClick({});
                }}>
                <div className="m-padding-grid">
                    {this.props.pointStyles.map(p => {
                        const selected = this.state.selected === 'point:' + p.name ? ' selected' : '';
                        const bg = p.background === 'transparent' ? ' bg-osm' : '';
                        return (<div className={"mapstore-square-card m-point" + selected}
                        onMouseOver={() => {
                            this.setState({
                                description: p.desc
                            });
                        }}
                        onMouseOut={() => {
                            this.setState({
                                description: ''
                            });
                        }}
                        onClick={() => {
                            this.setState({
                                selected: 'point:' + p.name
                            });
                            this.props.onClick(p);
                        }}>
                            <div className={"m-thumbnail" + bg} style={{backgroundColor: '#333'}}>
                                    {p.glyph !== 'font' ? <LineThumb linecap={p.linecap} linejoin={p.linejoin} style={p.style} stroke={p.fill} strokeOuter={p.stroke}/> : <div style={{textAlign: 'center', width: 120, height: 8, margin: '46px 0 0 0'}}>
                                        <div style={{textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke, color: p.fill, width: 120, height: 12, fontSize: 12}}>{'label'}</div>
                                    </div>}
                            </div>

                            <div className="m-title">{p.name}</div>
                            <div className="m-btn">
                                {/*<Glyphicon glyph="pencil" onClick={() => {
                                    this.props.onEdit(p);
                                }}/>*/}
                            </div>
                        </div>);
                    })}

</div>
        </div>
            </div>
        );
    }
}
/*

*/
module.exports = AddPage;
