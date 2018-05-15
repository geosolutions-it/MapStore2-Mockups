/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Toolbar = require('../../../old_ms2_226bfec4/web/client/components/misc/toolbar/Toolbar');
const SideCard = require('../../../old_ms2_226bfec4/web/client/components/misc/cardgrids/SideCard');
const BorderLayout = require('../../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const {Grid, Row, Col, FormGroup, FormControl, Glyphicon} = require('react-bootstrap');
const Combobox = require('react-widgets').Combobox;
const {head} = require('lodash');

class Sources extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        results: PropTypes.array,
        onBack: PropTypes.func,
        multiSelect: PropTypes.bool
    };

    static defaultProps = {
        onClick: () => {},
        onBack: () => {},
        multiSelect: true,
        results: [{
            title: 'Regions of Italy',
            description: 'population:regions_italy',
            name: 'Regions of Italy',
            id: '000-0'
        }/*, {
            title: 'OrtofotoRegione2010',
            description: 'geosolutions:OrtofotoRegione2010',
            name: 'Ortofoto Regione',
            id: '001-0'
        }, {
            title: 'A sample ArcGrid file',
            description: 'nurc:Arc_Sample',
            name: 'ArcGrid',
            id: '002-0'
        }, {
            title: 'mosaic',
            description: 'nurc:mosaic',
            name: 'Mosaic',
            id: '003-0'
        }, {
            title: 'North America sample imagery',
            description: 'nurc:Img_Sample',
            name: 'North America',
            id: '004-0'
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
                                        <div className="m-title-side">Catalog</div>
                                    </Col>
                                    <Col xs={12} className="text-center">
                                        <Toolbar
                                            btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                                            buttons={[
                                                {
                                                    glyph: 'arrow-left',
                                                    tooltip: 'Back',
                                                    onClick: () => {
                                                        this.props.onBack();
                                                    }
                                                },
                                                {
                                                    glyph: 'search',
                                                    tooltip: 'Search',
                                                    visible: this.state.selectedCards.length === 0
                                                },
                                                {
                                                    glyph: 'pencil',
                                                    tooltip: 'Edit current service',
                                                    visible: this.state.selectedCards.length === 0
                                                },
                                                {
                                                    glyph: 'pencil-add',
                                                    tooltip: 'Add new service',
                                                    visible: this.state.selectedCards.length === 0
                                                },
                                                {
                                                    glyph: 'plus',
                                                    tooltip: this.props.multiSelect ? 'Add selected layers' : 'Use selected layer',
                                                    visible: this.state.selectedCards.length > 0,
                                                    onClick: () => {
                                                        this.props.onClick(this.state.selectedCards);
                                                    }
                                                }
                                            ]}/>
                                    </Col>
                                    <Col xs={12}>
                                        <FormGroup controlId="stats-title">
                                            <Combobox
                                                value={'Catalog Service (CSW)'}
                                                data={['Catalog Service (CSW)', 'Map Service (WMS)', 'Map Tile Service (WMTS)']}
                                                placeholder="Select Operation"
                                                onChange={() => {}}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12}>
                                        <FormGroup controlId="stats-title">
                                            <FormControl type="text" placeholder="Search..." onChange = {() => {}}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>}>
                    {this.props.results.map(r => {
                        const selected = head(this.state.selectedCards.filter(s => s.title === r.title)) && ' ms-selected' || '';
                        return (<SideCard preview={<Glyphicon glyph={r.preview || 'geoserver'} />} className={'ms-sm' + selected} title={r.title} description={r.description} caption={r.caption || ''} onClick={(e) => {

                            if (e.event.ctrlKey) {
                                if (this.props.multiSelect) {
                                    this.setState({ selectedCards: [...this.state.selectedCards, r]});
                                }

                            } else {
                                if (selected) {
                                    this.setState({ selectedCards: []});
                                } else {
                                    this.setState({ selectedCards: [r]});
                                }
                            }

                        }}/>);
                    })}
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Sources;
