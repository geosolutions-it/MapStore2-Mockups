const React = require('react');
const PropTypes = require('prop-types');
const ContainerDimensions = require('react-container-dimensions').default;
const MapCard = require('./MapCard');

class Archive extends React.Component {

    static propTypes = {
        maps: PropTypes.array
    };

    static defaultProps = {
        maps: [
            {
                title: 'Style editor Point',
                desc: 'Style editor for PointSymbolizer',
                link: 'styleeditor',
                src: 'p.png'
            },
            {
                title: 'Style editor Line',
                desc: 'Style editor for LineSymbolizer',
                link: 'styleeditorline',
                src: 'l.png'
            },
            {
                title: 'Style editor Polygon',
                desc: 'Style editor for PolygonSymbolizer',
                link: 'styleeditorpolygon',
                src: 'po.png'
            },
            {
                title: 'Style editor Raster',
                desc: 'Style editor for RasterSymbolizer',
                link: 'styleeditorraster',
                src: 'r.png'
            },
            {
                title: 'Statistical query engine',
                desc: 'Analysis with statistical query engine mockup',
                link: 'statistical',
                src: 's.png'
            },
            {
                title: 'Widget',
                desc: 'Chart and widget mockup',
                link: 'widget',
                src: 'w.png'
            }
        ]
    };

    getCardSide = (width) => {
        const margin = 10;
        const count = width > 300 ? Math.floor(width / 300) : 1;
        return Math.floor((width - margin * (count + 1)) / count);
    }

    render() {
        const {maps} = this.props;
        return (
            <span>
                <div className="mapstore-archive-header">
                    <a href="#">
                    <div className="mapstore-archive-header-logo">
                        <div>&nbsp; MapStore Mockups</div>
                    </div>
                    </a>

                </div>
                <div className="mapstore-archive-left">

                </div>
                <div className="mapstore-archive-container">
                    <div className="mapstore-archive">
                        <ContainerDimensions>
                        { ({width}) =>
                            <span>
                                {maps.map((m, i) => <MapCard
                                    key={'map' + i}
                                    id={'map-card-' + i}
                                    title={m.title}
                                    desc={m.desc}
                                    src={m.src}
                                    link={m.link}
                                    side={this.getCardSide(width)}/>)}
                            </span>
                        }
                        </ContainerDimensions>
                    </div>
                </div>
                <div className="mapstore-archive-footer">
                </div>
            </span>
        );
    }
}

module.exports = Archive;
