const React = require('react');
const PropTypes = require('prop-types');
const {Col, Glyphicon, ButtonGroup, Button} = require('react-bootstrap');
const InfoPopover = require('../InfoPopover');
const Filter = require('../../../../MapStore2/web/client/components/misc/Filter');
const {head} = require('lodash');

const RMap = require('../randomMap');

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
            id: 'gray-scale',
            name: 'Gray Scale',
            glyph: 'star',
            desc: 'Gray Scale template',
            stroke: '#fff',
            fill: '#c00',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 33, g: 33, b: 33, a: 100},
            symbol: 'star'
        }, {
            id: 'red-band',
            name: 'Red Band',
            glyph: '1-point',
            desc: 'Red Band template',
            stroke: '#fa0',
            fill: '#fff',
            strokeMock: {r: 255, g: 0, b: 0, a: 100},
            fillMock: {r: 255, g: 0, b: 0, a: 100},
            symbol: 'circle'
        }, {
            id: 'green-band',
            name: 'Green Band',
            glyph: 'unchecked',
            desc: 'Green Band template',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 0, g: 255, b: 0, a: 100},
            fillMock: {r: 0, g: 255, b: 0, a: 100},
            symbol: 'square'
        }, {
            id: 'blue-band',
            name: 'Blue Band',
            glyph: 'star',
            desc: 'Blue Band template',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 0, g: 0, b: 255, a: 100},
            fillMock: {r: 0, g: 0, b: 255, a: 100},
            symbol: 'star'
        }, {
            id: 'pseudo-blue',
            name: 'Pseudo',
            glyph: 'star',
            desc: 'Pseudo color template',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 0, g: 0, b: 255, a: 100},
            fillMock: {r: 0, g: 0, b: 255, a: 100},
            symbol: 'star',
            scale: {
                '0': {r: 255, g: 0, b: 0},
                '51': {r: 255, g: 255, b: 0},
                '102': {r: 0, g: 255, b: 255},
                '153': {r: 255, g: 0, b: 255},
                '255': {r: 0, g: 0, b: 255}
            }
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

    componentDidMount() {

        this.props.pointStyles.forEach(p => {

            let r = new RMap(p.id, p.id === 'gray-scale' ? null : p.fillMock.r, p.fillMock.g, p.fillMock.b, false, false, p.scale);
            r.update();
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
                            <div className={"m-thumbnail" + bg} style={{
                                    textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke,
                                    color: p.fill, backgroundColor: '#333'}}>
                                    <canvas id={p.id} style={{width: 120, height: 120}}/>
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
