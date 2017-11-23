/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const ContainerDimensions = require('react-container-dimensions').default;
const ArchiveCard = require('../components/ArchiveCard');
const Filter = require('../../MapStore2/web/client/components/misc/Filter');

class ArchivePlugin extends React.Component {

    static propTypes = {
        cards: PropTypes.array
    };

    static defaultProps = {
        cards: [
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
            },
            {
                title: 'Query Builder',
                desc: 'Query Builder / Advanced Search',
                link: 'query-builder',
                src: 'toscana.png'
            }
        ]
    };

    state = {
        filterText: ''
    };

    getCardSide = (width) => {
        const margin = 10;
        const count = width > 300 ? Math.floor(width / 300) : 1;
        return Math.floor((width - margin * (count + 1)) / count);
    }

    render() {
        const cards = this.props.cards.filter(c => c.title.match(this.state.filterText));
        return (
            <span>
                <div className="mapstore-archive-header">
                    <a href="#">
                    <div className="mapstore-archive-header-logo">
                        <div>&nbsp; MapStore Mockups</div>
                    </div>
                    </a>
                    <Filter filterText={this.state.filterText} onFilter={(value) => {
                        this.setState({
                            filterText: value
                        });
                    }}/>
                </div>
                <div className="mapstore-archive-left">

                </div>
                <div className="mapstore-archive-container">
                    <div className="mapstore-archive">
                        <ContainerDimensions>
                        { ({width}) =>
                            <span>
                                {cards.map((m, i) => <ArchiveCard
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

module.exports = {
    ArchivePlugin
};
