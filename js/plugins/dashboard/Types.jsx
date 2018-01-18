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
const {Glyphicon, Grid, Row, Col} = require('react-bootstrap');

class Types extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        onBack: PropTypes.func,
        types: PropTypes.array,
        maps: PropTypes.array
    };

    static defaultProps = {
        maps: [],
        onClick: () => {},
        onBack: () => {},
        types: [{
            title: 'Map',
            type: 'map',
            description: 'Add a map',
            preview: <Glyphicon glyph="1-map" />
        }, {
            title: 'Chart',
            type: 'chart',
            description: 'Add a chart',
            preview: <Glyphicon glyph="stats" />
        }, {
            title: 'Table',
            type: 'table',
            description: 'Add a table',
            preview: <Glyphicon glyph="features-grid" />
    }, {
            title: 'Legend',
            type: 'legend',
            description: 'Add a legend',
            preview: <Glyphicon glyph="list" />
    }, {
            title: 'Text',
            type: 'text',
            description: 'Add a textarea',
            preview: <Glyphicon glyph="sheet" />
        }]
    };

    render() {

        return (
            <div key="ms-dashboard-types" className="ms-vertical-side">
                <BorderLayout
                    header={
                        <div className="ms-header-side">
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                                        {<div className="m-title-side">Select Widget Type</div>}
                                    </Col>
                                <Col xs={12} className="text-center">
                        <Toolbar
                            btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                            buttons={[{
                                glyph: 'arrow-left',
                                tooltip: 'Previous',
                                onClick: () => {
                                    this.props.onBack();
                                }
                            }]}/></Col></Row></Grid></div>}>
                    {this.props.types.map((s, i) => {
                        if (s.type === 'legend' && this.props.maps.length === 0) {
                            return null;
                        }
                        return <SideCard className="ms-sm" key={i} onClick={() => { this.props.onClick(s, i); }} {...s}/>;
                    })}
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Types;
