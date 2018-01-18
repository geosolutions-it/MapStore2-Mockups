/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const SideCard = require('../../../MapStore2/web/client/components/misc/cardgrids/SideCard');
const BorderLayout = require('../../../MapStore2/web/client/components/layout/BorderLayout');
const {Grid, Row, Col, Glyphicon} = require('react-bootstrap');

class Sources extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        maps: PropTypes.array,
        onBack: PropTypes.func
    };

    static defaultProps = {
        onClick: () => {},
        onBack: () => {},
        maps: [{
            title: 'Empty Map',
            description: 'Create a new map',
            type: 'empty'
        }, {
            title: 'Regions of Italy Map',
            description: 'Id, name, area and lenght data'
        }/*, {
            title: 'Tessuto Urbanizzato Bolzano',
            description: 'Tessuto Urbanizzato del comune di Bolzano'
        }, {
            title: 'MS2 GTOPO30'
        }, {
            title: 'Unesco Italian Items',
            description: 'nurc:mosaic'
        }, {
            title: 'LaMMa Current Temperature Southern Europe',
            description: 'Current Temperature Southern Europe from meteo stations.Credits to LaMMa.'
        }, {
            title: 'Historical Maps of Florence'
        }*/]
    };

    state = {
        selectedCards: []
    };

    render() {

        return (
            <div key="ms-dashboard-sources" className="ms-vertical-side">
                <BorderLayout
                    header={
                        <div className="ms-header-side">
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                                        <div className="m-title-side">Maps</div>
                                    </Col>
                                    <Col xs={12} className="text-center">
                                        <Toolbar
                                            btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                                            buttons={[
                                                {
                                                    glyph: 'arrow-left',
                                                    tooltip: 'Previous',
                                                    onClick: () => {
                                                        this.props.onBack();
                                                    }
                                                }
                                            ]}/>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>}>

                    {this.props.maps.map(r => {
                        const selected = /*head(this.state.selectedCards.filter(s => s.title === r.title)) && 'ms-selected' || */'';
                        return (<SideCard preview={<Glyphicon glyph={r.preview || '1-map'} />} className={"ms-sm" + selected} title={r.title} description={r.description} caption={r.caption || ''} onClick={() => {
                            this.props.onClick(r.type);
                        }}/>);
                    })}
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Sources;
