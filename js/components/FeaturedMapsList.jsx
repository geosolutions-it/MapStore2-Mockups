const React = require('react');
const PropTypes = require('prop-types');
const {Carousel} = require('react-bootstrap');
const ContainerDimensions = require('react-container-dimensions').default;
const baseRatio = 9 / 16;

class FeaturedMapsList extends React.Component {

    static propTypes = {
        maps: PropTypes.array,
        ratio: PropTypes.number,
        padding: PropTypes.number
    };

    static defaultProps = {
        maps: [
            {
                id: 'viewer',
                title: 'Viewer',
                description: 'Simple Viewer',
                src: require('../../MapStore2/web/client/product/assets/img/Viewer.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/histo-flowrence.png'
            },
            {
                id: '3dviewer',
                title: '3D Viewer',
                description: 'Simple CesiumJS based 3D Viewer',
                src: require('../../MapStore2/web/client/product/assets/img/3DViewer.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'mouseposition',
                title: 'Mouse Position Control',
                description: 'Custom examples',
                src: require('../../MapStore2/web/client/product/assets/img/MousePosition.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'scalebar',
                title: 'Scale Control',
                description: 'Custom examples',
                src: require('../../MapStore2/web/client/product/assets/img/ScaleBar.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'featuregrid',
                title: 'Feature Editor',
                description: 'Custom examples',
                src: require('../../MapStore2/web/client/product/assets/img/FeatureGrid.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'print',
                title: 'Printing',
                description: 'Custom examples',
                src: require('../../MapStore2/web/client/product/assets/img/Print.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'plugins',
                title: 'Plugins',
                description: 'Build your own application',
                src: require('../../MapStore2/web/client/product/assets/img/Plugins.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            },
            {
                id: 'api',
                title: 'API',
                description: 'Use APIs to include a MapStore2 map in your application',
                src: require('../../MapStore2/web/client/product/assets/img/Api.jpg'),
                thumbnail: '/assets/img/maps-thumbnails/gtopo30.png'
            }
        ],
        padding: 30
    };

    state = {
        images: {}
    };

    render() {
        return (
            <ContainerDimensions>
            {({width}) => (
                <Carousel
                    className="ms-featured-map-carousel"
                    slide={false}
                    style={{
                        width: width - this.props.padding,
                        height: width * (this.props.ratio || baseRatio)
                    }}>
                    {this.props.maps.map( map =>
                        (<Carousel.Item>
                            <div
                                style={{
                                    width: width - this.props.padding,
                                    height: width * (this.props.ratio || baseRatio),
                                    overflow: 'hidden'
                                }}>
                                {/*<GlyphiconT
                                    tooltip="Remove current map from featured maps"
                                    tooltipPosition="bottom"
                                    className="ms-remove-current"
                                glyph="1-close"/>*/}
                                <img
                                    width={this.state.images['map-' + map.id] ? width - this.props.padding : 'auto'}
                                    height={this.state.images['map-' + map.id] ? 'auto' : width * (this.props.ratio || baseRatio)}
                                    alt={'map-' + map.id}
                                    src={map.src || map.thumbnail}
                                    onLoad={e => {
                                        const imgWidth = e.target.naturalWidth;
                                        const imgHeight = e.target.naturalHeight;
                                        const ratio = imgHeight / imgWidth;
                                        this.setState({
                                            images: {...this.state.images, ['map-' + map.id]: ratio > (this.props.ratio || baseRatio)}
                                        });
                                    }}
                                    style={{
                                        width: this.state.images['map-' + map.id] ? width - this.props.padding : 'auto',
                                        height: this.state.images['map-' + map.id] ? 'auto' : width * (this.props.ratio || baseRatio)
                                    }}/>
                            </div>
                            <Carousel.Caption>
                                <h3>{map.title}</h3>
                                <p>{map.description}</p>
                                {/*<Toolbar
                                    btnDefaultProps={{
                                        bsStyle: 'primary',
                                        className: 'square-button-md'
                                    }}
                                    buttons={[{
                                        glyph: 'trash'
                                    },
                                    {
                                        glyph: 'wrench'
                                    },
                                    {
                                        glyph: 'heart'
                                    }]}/>*/}
                            </Carousel.Caption>
                        </Carousel.Item>)
                    )}
                </Carousel>
            )}
            </ContainerDimensions>
        );
    }
}

module.exports = FeaturedMapsList;
