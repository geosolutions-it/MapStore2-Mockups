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
const Filter = require('../../old_ms2_226bfec4/web/client/components/misc/Filter');

class ArchivePlugin extends React.Component {

    static propTypes = {
        cards: PropTypes.array
    };

    static defaultProps = {
        cards: [
            {
                title: 'Catalog Metadata Template',
                desc: 'Improvement on catalog card and advanced options',
                link: 'https://demo.geo-solutions.it/mockups/mapstore2/catalog-template/#/viewer/openlayers/new',
                src: 'catm.png',
                absolute: true
            },
            {
                title: 'Annotation improvements',
                desc: 'Styles, get feature info and measure',
                link: 'https://demo.geo-solutions.it/mockups/mapstore2/annotation_styles/#/viewer/openlayers/new',
                src: 'anno.png',
                absolute: true
            },
            {
                title: 'Background selector improvements',
                desc: 'Background workflow of edit, save and delete actions',
                link: 'https://demo.geo-solutions.it/mockups/mapstore2/backgroundedit/#/viewer/openlayers/new',
                src: 'bg-ed.png',
                absolute: true
            },
            {
                title: 'Create new map improvements',
                desc: 'Select different EPSG before create new map',
                link: 'https://demo.geo-solutions.it/mockups/mapstore2/newmapepsg/#/viewer/openlayers/new',
                src: 'new-epsg.png',
                absolute: true
            },
            {
                title: 'Statistical query engine',
                desc: 'Thematic maps, use parameters admin and thematic to enable different conditions (eg. /?admin=true&thematic=true#/thematic-maps)',
                link: 'thematic-maps',
                src: 'sqt.png'
            },
            {
                title: 'Import and export data',
                desc: 'import/export map configuration',
                link: 'import-export',
                src: 'ie.png'
            },
            {
                title: 'Time filter',
                desc: 'time filter and small TOC updates',
                link: 'time-filter',
                src: 'tf.png'
            },
            {
                title: 'Featured maps',
                desc: 'featured maps desktop',
                link: 'featured-maps',
                src: 'hom.png'
            },
            {
                title: 'Featured maps',
                desc: 'featured maps on mobile (use mobile device)',
                link: 'home-m',
                src: 'mob.png'
            },
            {
                title: 'Legend',
                desc: 'action legend',
                link: 'action-legend',
                src: 'act.png'
            },
            {
                title: 'Style Editor Point',
                desc: 'Style Editor for PointSymbolizer',
                link: 'styleeditor',
                src: 'p.png'
            },
            {
                title: 'Style Editor Line',
                desc: 'Style Editor for LineSymbolizer',
                link: 'styleeditorline',
                src: 'l.png'
            },
            {
                title: 'Style Editor Polygon',
                desc: 'Style Editor for PolygonSymbolizer',
                link: 'styleeditorpolygon',
                src: 'po.png'
            },
            {
                title: 'Style Editor Raster',
                desc: 'Style Editor for RasterSymbolizer',
                link: 'styleeditorraster',
                src: 'r.png'
            },
            {
                title: 'Statistical Query Engine',
                desc: 'Analysis with Statistical Query Engine Mockup',
                link: 'statistical',
                src: 's.png'
            },
            {
                title: 'Dashboard Editor',
                desc: 'Dashboard Editor Workflow',
                link: 'dashboard',
                src: 'dashboard-editor-tn.png'
            },
            {
                title: 'Dashboard View',
                desc: 'Dashboard Read Only View',
                link: 'dashboard-read',
                src: 'dashboard-read-tn.png'
            },
            {
                title: 'Widget',
                desc: 'Chart and Widget Mockup',
                link: 'widget',
                src: 'w.png'
            },
            {
                title: 'Query Builder',
                desc: 'Query Builder / Advanced Search',
                link: 'query-builder',
                src: 'toscana.png'
            },
            {
                title: 'Edit Map Properties',
                desc: 'Added Details Sheet',
                link: 'maps-properties',
                src: 'm-prop.png'
            },
            {
                title: 'Rules Manager',
                desc: 'Rules Manager User Interface',
                link: 'geofence-rules-manager',
                src: 'grm.png'
            },
            {
                title: 'Get Feature Info',
                desc: 'Get Feature Info Markdown Format and Charts',
                link: 'get-feature-info',
                src: 'gfi.png'
            },
            {
                title: 'Layer Synchronized Refresh',
                desc: 'Tool to update layer after a scheduled time',
                link: 'toc-synch',
                src: 'ts.png'
            },
            {
                title: 'Annotation',
                desc: 'Tool to create annotations on map',
                link: 'annotations',
                src: 'ann.png'
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
        const cards = this.props.cards.filter(c => c.title.toLowerCase().match(this.state.filterText.toLowerCase()) || c.desc.toLowerCase().match(this.state.filterText.toLowerCase()));
        return (
            <span>
                <div className="mapstore-archive-header">
                    <a href="#">
                    <div className="mapstore-archive-header-logo">
                        <div>&nbsp; MapStore Mockups</div>
                    </div>
                    </a>
                    <Filter filterPlaceholder="Filter mockups..." filterText={this.state.filterText} onFilter={(value) => {
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
                                    absolute={m.absolute}
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
