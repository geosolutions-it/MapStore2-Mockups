/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const L = require('leaflet');
const React = require('react');
const PropTypes = require('prop-types');

const italy = require('../../assets/json/italy.json');
require('leaflet/dist/leaflet.css');
const {isObject, isEqual} = require('lodash');
// const {Map, PolygonGroup} = require('react-d3-map');
let count = 0;

const createFeature = (type = 'Polygon', coords = []) => ({
    "type": "Feature",
    "geometry": {
        "type": type,
        "coordinates": coords
    }
});

const createGeoJSON = (features = []) => ({
    "type": "FeatureCollection",
    "features": [...features]
 });

class ItalyMap extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        region: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        onUpdate: PropTypes.func,
        center: PropTypes.object,
        zoom: PropTypes.number,
        draw: PropTypes.bool,
        drawFeatures: PropTypes.array,
        onClickDrawFeature: PropTypes.func
    };

    static defaultProps = {
        id: 'test',
        region: 'all',
        width: 500,
        height: 500,
        onUpdate: () => {},
        zoom: 5,
        center: {x: 12.492373, y: 41.890251},
        draw: false,
        drawFeatures: [],
        onClickDrawFeature: () => {}
    };

    state = {};

    componentWillMount() {
        count++;
    }
    componentDidMount() {
        this.addMap();
    }

    componentWillUpdate(newProps) {
        if (this.props.region !== newProps.region) {
            this.clearLayers();
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                zoomOffset: 0,
                maxNativeZoom: 19,
                maxZoom: 23
            }).addTo(this.map);
            if (isObject(this.getData(newProps.region))) {
                L.geoJson(this.getData(newProps.region), {
                    style: () => {
                        return {fillColor: '#ffcc33', color: '#ffcc33', fillOpacity: 0.1, opacity: 1.0};
                    }
                }).addTo(this.map);
            }
        }

        if (!isEqual(this.props.center, newProps.center)) {
            this.map.setView({lng: newProps.center.x, lat: newProps.center.y}, this.props.zoom);
        }
        if (this.props.zoom !== newProps.zoom) {
            this.map.setView({lng: this.props.center.x, lat: this.props.center.y}, newProps.zoom);
        }
        if (this.props.width !== newProps.width || this.props.height !== newProps.height && this.map) {
            this.map.invalidateSize();
        }

        if (!isEqual(newProps.drawFeatures, this.props.drawFeatures) && this.drawLayer && this.drawLayer.clearLayers) {
            this.drawLayer.clearLayers();
            const json = newProps.drawFeatures.map(feat => createFeature(feat.type, feat.coords));
            this.drawLayer.addData(json);
        }
    }

    componentWillUnmount() {
        this.removeMap();
    }

    getData = (region) => {
        return !region || region === 'all' && italy || {...italy, features: italy.features.map(f => f.properties.name === region.toLowerCase() && f || null).filter(v => v)};
    }

    render() {
        return (
            <div style={{position: 'relative', width: this.props.width, height: this.props.height, overflow: 'hidden'}}>
                <div id={"map-container-mock-" + this.props.id} style={{ position: 'absolute', width: '100%', height: '100%'}}></div>
            </div>
        );
    }

    addMap = () => {
        if (!this.map) {
            this.map = L.map("map-container-mock-" + this.props.id, { center: [this.props.center.y, this.props.center.x],
    zoom: Math.round(this.props.zoom), zoomControl: false, attributionControl: false});
            this.map.on('moveend', () => {
                this.props.onUpdate('zoom', this.map.getZoom());
                this.props.onUpdate('center', this.map.getCenter());
            });
            this.props.onUpdate('zoom', this.map.getZoom());
            this.props.onUpdate('center', this.map.getCenter());
            if (isObject(this.getData(this.props.region))) {
                L.geoJson(this.getData(this.props.region), {
                    style: () => {
                        return {fillColor: '#ffcc33', color: '#ffcc33', fillOpacity: 0.1, opacity: 1.0};
                    }
                }).addTo(this.map);
            }
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                zoomOffset: 0,
                maxNativeZoom: 19,
                maxZoom: 23
            }).addTo(this.map);

            if (this.props.draw) {
                const json = this.props.drawFeatures && this.props.drawFeatures.map(feat => createFeature(feat.type, feat.coords));
                this.drawLayer = L.geoJson({...createGeoJSON(json)}, {
                    style: () => {
                        return {fillColor: '#ffcc33', color: '#ffcc33', fillOpacity: 0.1, opacity: 1.0};
                    },
                    onEachFeature: (feature, layer) => {
                        layer.on({
                            click: () => { this.props.onClickDrawFeature(feature); } // this.props.onClickDrawFeature.bind(null, feature, layer);
                        });
                    }
                }).addTo(this.map);
            }
        }
    }

    removeMap = () => {
        this.clearLayers();
        this.map.off();
        this.map.remove();
        this.map = null;
    }
    clearLayers = () => {
        this.map.eachLayer(l => {
            this.map.removeLayer(l);
        });
    }

}

module.exports = ItalyMap;
