const React = require('react');
const PropTypes = require('prop-types');
const ContainerDimensions = require('react-container-dimensions').default;

class LineThumb extends React.Component {

    static propTypes = {
        count: PropTypes.number,
        linecap: PropTypes.string,
        linejoin: PropTypes.string,
        stroke: PropTypes.string,
        strokeOuter: PropTypes.string,
        style: PropTypes.string
    };

    static defaultProps = {
        count: 20,
        linecap: 'round', // butt round square
        linejoin: 'round', // miter round bevel
        stroke: '#333',
        strokeOuter: '#fff',
        style: 'solid'
    };

    render() {
        return (
            <ContainerDimensions>
            { ({ width, height }) =>
            <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 " + width + " " + height}>
                <path strokeDasharray={this.props.style === 'dashed' ? ( width / 10 + ", " + width / 5) : ""} d={"M" + width / 5 + " " + height * 4 / 5 + " L" + width / 2 + " " + height / 5 + " L" + width * 4 / 5 + " " + height * 4 / 5} strokeLinecap={this.props.linecap} strokeLinejoin={this.props.linejoin} stroke={this.props.strokeOuter} strokeWidth="20" fill="none"/>
                <path strokeDasharray={this.props.style === 'dashed' ? ( width / 10 + ", " + width / 5) : ""} d={"M" + width / 5 + " " + height * 4 / 5 + " L" + width / 2 + " " + height / 5 + " L" + width * 4 / 5 + " " + height * 4 / 5} strokeLinecap={this.props.linecap} strokeLinejoin={this.props.linejoin} stroke={this.props.stroke} strokeWidth="15" fill="none"/>
            </svg>}
            </ContainerDimensions>
        );
    }
}

module.exports = LineThumb;
