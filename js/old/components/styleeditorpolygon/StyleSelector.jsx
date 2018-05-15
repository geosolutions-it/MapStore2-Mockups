const React = require('react');
const PropTypes = require('prop-types');
const {Col, Glyphicon, ButtonGroup, Button, FormGroup, FormControl} = require('react-bootstrap');
const InfoPopover = require('../InfoPopover');
const Filter = require('../../../../old_ms2_226bfec4/web/client/components/misc/Filter');

class ColorSelector extends React.Component {

    static propTypes = {
        checked: PropTypes.bool,
        pointStyles: PropTypes.array,
        lineStyles: PropTypes.array,
        plygonSytle: PropTypes.array,
        selected: PropTypes.bool,
        geoserverStyles: PropTypes.array,
        onEdit: PropTypes.func,
        onCode: PropTypes.func,
        onClick: PropTypes.func,
        onChangeText: PropTypes.func
    };

    static defaultProps = {
        checked: false,
        geoserverStyles: [{
            title: 'Default',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #333333;\n\tstroke: #f2f2f2;\n}",
            glyph: 'star',
            stroke: '#f2f2f2',
            fill: '#333333',
            symbol: 'star'
        },
        {
            title: 'Custom style for points',
            desc: 'custom',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #f2f2f2;\n\tstroke: #333333;\n}",
            glyph: 'star',
            stroke: '#333333',
            fill: '#f2f2f2',
            symbol: 'star'
        },
        {
            title: 'Population in the United States',
            desc: 'population',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #aaccdd;\n\tstroke: #ddaacc;\n}",
            glyph: 'star',
            stroke: '#ddaacc',
            fill: '#aaccdd',
            symbol: 'star'
        },
        {
            title: 'Default polygon',
            desc: 'polygon',
            code: "* {\n\tmark: symbol('star');\n\tmark-size: 20;\n}\n\n:mark {\n\tfill: #00AA00;\n\tstroke: #AA00AA;\n}",
            glyph: 'star',
            stroke: '#AA00AA',
            fill: '#00AA00',
            symbol: 'star'
        }],
        pointStyles: [{
            name: 'Star Red',
            glyph: 'star',
            stroke: '#fff',
            fill: '#c00',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 200, g: 0, b: 0, a: 100},
            symbol: 'star'
        }, {
            name: 'Light Violet',
            glyph: '1-point',
            stroke: '#fa0',
            fill: '#fff',
            strokeMock: {r: 255, g: 125, b: 0, a: 100},
            fillMock: {r: 255, g: 255, b: 255, a: 100},
            symbol: 'circle'
        }, {
            name: 'Square purple',
            glyph: 'unchecked',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 255, g: 0, b: 255, a: 100},
            symbol: 'square'
        }, {
            name: 'Star pink',
            glyph: 'star',
            stroke: '#fff',
            fill: '#f0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 255, g: 0, b: 255, a: 100},
            symbol: 'star'
        }, {
            name: 'Point',
            glyph: '1-point',
            stroke: '#fff',
            fill: '#c00',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 200, g: 0, b: 0, a: 100},
            symbol: 'circle'
        }, {
            name: 'Cross',
            glyph: '1-close',
            stroke: '#fff',
            fill: '#a0f',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 125, g: 0, b: 255, a: 100},
            symbol: 'x'
        }, {
            name: 'Only labels',
            glyph: 'font',
            stroke: '#fff',
            fill: '#333',
            strokeMock: {r: 255, g: 255, b: 255, a: 100},
            fillMock: {r: 125, g: 0, b: 255, a: 100},
            symbol: 'x'
        }],
        lineStyles: [],
        plygonSytle: [],
        selected: 'point:000',
        onEdit: () => {},
        onCode: () => {},
        onClick: () => {},
        onChangeText: () => {}
    };

    componentWillMount() {
        this.setState({
            selected: this.props.selected
        });
        console.log(this.props.selected);
    }

    componentWillUpdate(newProps) {

        if (this.props.geoserverStyles.length > newProps.geoserverStyles.length) {
            this.setState({
                selected: 'point:' + newProps.geoserverStyles[0].id
            });
        } else if (this.props.geoserverStyles.length < newProps.geoserverStyles.length) {

            this.setState({
                selected: 'point:' + newProps.geoserverStyles[newProps.geoserverStyles.length - 1].id
            });
        }
    }

    render() {
        return (<span className="mapstore-style-selector m-body">
            <div className="mapstore-block-width">
                <div className="m-padding-md">
                <Filter filterPlaceholder="Filter style..."/>
                </div>
            </div>
            <div className="m-body-scroll-y">
                <div className="m-padding-grid">
            {this.props.geoserverStyles.map(p => {
                const selected = this.state.selected === 'point:' + p.id ? ' selected' : '';
                return (<div className={"mapstore-side-card m-basic" + selected} onClick={() => {
                    this.setState({
                        selected: 'point:' + p.id
                    });

                    this.props.onClick(p);
                }}>
                    <div className="mapstore-side-glyph bg-primary">
                        <Glyphicon glyph="geoserver"/>
                    </div>
                    <div className="mapstore-side-card-info">
                        <div className="mapstore-side-card-title">
                            {selected ? <FormGroup controlId="stats-title">
                                {/* placeholder as mockup*/}
                                <FormControl type="text" value={p.title} onChange={(e) => {
                                    this.props.onChangeText({desc: p.desc, title: e.target.value});
                                }}/>
                        </FormGroup> : p.title}
                        </div>
                        <div className="mapstore-side-card-desc">
                            {selected ? <FormGroup controlId="stats-title">
                                {/* placeholder as mockup*/}
                                <FormControl type="text" value={p.desc} onChange={(e) => {
                                    this.props.onChangeText({desc: e.target.value, title: p.title});
                                }}/>
                        </FormGroup> : p.desc}
                        </div>
                    </div>
                    <div className="mapstore-side-card-tool text-center">
                        {/*<Glyphicon glyph="pencil" className="text-primary" onClick={() => {
                            this.props.onCode(p);
                        }}/>*/}
                    </div>
                </div>);
            })}
        </div>
            </div>
            {/*<div className="mapstore-block-width shadow-soft-up">
                <div className="m-padding-md">
                    <Col xs={11}><Filter filterPlaceholder="Filter style..."/></Col><span className="pull-right"><InfoPopover title="Custom Styles" text="Select a style to appy it to layer or edit it by clicking on the pencil icon"/></span>
                </div>
            </div>

            <div className="m-body-scroll-y">
                <div className="m-padding-grid">
                    {this.props.pointStyles.map(p => {
                        const selected = this.state.selected === 'point:' + p.name ? ' selected' : '';
                        const bg = p.background === 'transparent' ? ' bg-osm' : '';
                        return (<div className={"mapstore-square-card m-point" + selected} onClick={() => {
                            this.setState({
                                selected: 'point:' + p.name
                            });
                            this.props.onClick(p);
                        }}>
                            <div className={"m-thumbnail" + bg} style={{
                                    textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke,
                                    color: p.fill, backgroundColor: '#333'}}>
                                <Glyphicon glyph={p.glyph}/>
                            </div>
                            <div className="m-title">{p.name}</div>
                            <div className="m-btn">

                            </div>
                        </div>);
                    })}


        </div>
    </div>*/}
    </span>);
    }
}
/*

*/
module.exports = ColorSelector;
