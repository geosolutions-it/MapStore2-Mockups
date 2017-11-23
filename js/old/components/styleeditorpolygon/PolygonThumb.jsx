const React = require('react');
const PropTypes = require('prop-types');
const ContainerDimensions = require('react-container-dimensions').default;

const perc = (v, l) => {
    return (v * l) / 100;
};


const d = (width, height) => {
    return 'M' + perc(40, width) + ',' + perc(20, height)
    + ' L' + perc(70, width) + ',' + perc(25, height)
    + ' L' + perc(80, width) + ',' + perc(70, height)
    + ' L' + perc(60, width) + ',' + perc(90, height)
    + ' L' + perc(20, width) + ',' + perc(80, height)
    + ' L' + perc(25, width) + ',' + perc(50, height) + ' Z';
};
class PolygonThumb extends React.Component {

    static propTypes = {
        stroke: PropTypes.string,
        fill: PropTypes.string
    };

    static defaultProps = {
        stroke: '#333',
        fill: '#fff'
    };

    render() {
        return (
            <ContainerDimensions>
            { ({ width, height }) =>
            <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 " + width + " " + height}>
                <path d={d( width, height)} stroke={this.props.stroke} strokeWidth={perc(2, width)} fill={this.props.fill}/>
            </svg>}
            </ContainerDimensions>
        );
    }
}

module.exports = PolygonThumb;
