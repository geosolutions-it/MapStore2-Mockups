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

const SquareCard = () => {

};

class Types extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        onBack: PropTypes.func,
        templates: PropTypes.array,
        maps: PropTypes.array
    };

    static defaultProps = {
        maps: [],
        onClick: () => {},
        onBack: () => {},
        templates: [{
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
            <div key="ms-dashboard-template" className="ms-vertical-side-type">
                <BorderLayout
                    header={
                        <div className="ms-header-side">
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                            <div className="m-title-side"></div>
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
                            }, {
                                glyph: 'plus',
                                tooltip: 'Use selected template',
                                onClick: () => {
                                    this.props.onClick();
                                }
                            }]}/></Col></Row></Grid></div>}>
                            {this.props.templates.map(p => {
                                const selected = this.state.selected === 'point:' + p.name ? ' selected' : '';
                                const bg = p.background === 'transparent' ? ' bg-osm' : '';
                                return (<div className={"mapstore-square-card m-point" + selected}
                                onMouseOver={() => {
                                    this.setState({
                                        description: p.desc
                                    });
                                }}
                                onMouseOut={() => {
                                    this.setState({
                                        description: ''
                                    });
                                }}
                                onClick={() => {
                                    this.setState({
                                        selected: 'point:' + p.name
                                    });
                                    this.props.onClick(p);
                                }}>
                                    <div className={"m-thumbnail" + bg} style={{
                                            textShadow: '2px 0 0 ' + p.stroke + ', -2px 0 0 ' + p.stroke + ', 0 2px 0 ' + p.stroke + ', 0 -2px 0 ' + p.stroke + ', 1px 1px ' + p.stroke + ', -1px -1px 0 ' + p.stroke + ', 1px -1px 0 ' + p.stroke + ', -1px 1px 0 ' + p.stroke,
                                            color: p.fill, backgroundColor: '#333'}}>
                                            <canvas id={p.id} style={{width: 120, height: 120}}/>
                                    </div>

                                    <div className="m-title">{p.name}</div>
                                    <div className="m-btn">
                                        {/*<Glyphicon glyph="pencil" onClick={() => {
                                            this.props.onEdit(p);
                                        }}/>*/}
                                    </div>
                                </div>);
                            })}
                </BorderLayout>
            </div>
        );
    }
}

module.exports = Types;
