/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

const italy = require('../../assets/json/italy.json');
const {Map, PolygonGroup} = require('react-d3-map');

class ItalyMap extends React.Component {
    static propTypes = {
        region: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number
    };

    static defaultProps = {
        region: 'all',
        width: 500,
        height: 500
    };

    render() {
        const data = !this.props.region || this.props.region === 'all' && italy || {...italy, features: italy.features.map(f => f.properties.name === this.props.region.toLowerCase() && f || null).filter(v => v)};
        return (
            <Map
                width= {this.props.width}
                height= {this.props.height}
                scale= {1 << 14}
                scaleExtent= {[1 << 10, 1 << 18]}
                center= {[9, 42]}
                clip
                bounds={[[0, 0], [this.props.width, this.props.height]]}>
                <g>
                    {this.props.region && <PolygonGroup
                        key= {"italy"}
                        data={data}
                        polygonClass= {"m-polygon-italy"}/>}
                </g>
            </Map>
        );
    }
}

module.exports = ItalyMap;
