const React = require('react');
const PropTypes = require('prop-types');
const d3 = require('d3');
require('d3-geo');
const italy = require('../../assets/json/italy.json');

class MapD3 extends React.Component {
    static propTypes = {
        id: PropTypes.string
    };

    static defaultProps = {
        id: ''
    };

    state = {}

    componentDidMount() {
        this.renderD3();
    }

    renderD3() {
        const width = 900;
        const height = 600;

        const projection = d3.geoMercator();
        const svg = d3.select("#ms-map-d3").append("svg").attr("width", width).attr("height", height);
        const path = d3.geoPath().projection(projection);
        const g = svg.append("g");

        g.selectAll("path")
            .data(italy)
            .enter()
            .append("path")
            .attr("d", path);
    }

    render() {

        return (
            <div id="ms-map-d3" className="ms-map-d3">
            </div>
        );
    }
}

module.exports = {
    MapD3Plugin: MapD3
};
