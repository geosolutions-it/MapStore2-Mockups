/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {head} = require('lodash');
const {Grid, Glyphicon, Row, Col, FormGroup, Checkbox, ControlLabel, ListGroup, ListGroupItem } = require('react-bootstrap');
const moment = require('moment');
const momentLocalizer = require('react-widgets/lib/localizers/moment');
momentLocalizer(moment);
const { DateTimePicker } = require('react-widgets');

// const TOC = require('../components/infortunistradali/TOCInfortuni');
// const DockablePanel = require('../../MapStore2/web/client/components/misc/panels/DockablePanel');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const assign = require('object-assign');

class InfortuniStradali extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func
    };

    static defaultProps = {
        onSelect: () => {}
    };

    state = {
        open: true,
        selected: false
    }

    state = {
        codes: {},
        filters: [
            {
                name: 'Periodo',
                inputs: [
                    {
                        type: 'date',
                        name: 'Da',
                        code: '001'
                    },
                    {
                        type: 'date',
                        name: 'A',
                        code: '002'
                    }
                ]
            },
            {
                name: 'Giorno della settimana',
                inputs: [
                    {
                        type: 'checkbox',
                        options: [
                            {
                                name: 'Lunedì',
                                code: '003'
                            },
                            {
                                name: 'Martedì',
                                code: '004'
                            },
                            {
                                name: 'Mercoledì',
                                code: '005'
                            },
                            {
                                name: 'Venerdì',
                                code: '006'
                            },
                            {
                                name: 'Sabato',
                                code: '007'
                            },
                            {
                                name: 'Domenica',
                                code: '008'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Tipo di infortunio',
                inputs: [
                    {
                        type: 'checkbox',
                        options: [
                            {
                                name: 'Senza Feriti',
                                code: '009'
                            },
                            {
                                name: 'Con Feriti',
                                code: '010'
                            },
                            {
                                name: 'Mortale',
                                code: '011'
                            }
                        ]
                    }
                ]
            }
        ]
    };

    getInput = (input = {}) => {
        switch (input.type) {
            case 'checkbox':
            return (
                <ListGroup>
                {input.options.map(option => (
                    <ListGroupItem
                        style={{padding: '0 10px'}}
                        active={this.state.codes[option.code]}
                        onClick={() => {
                            this.setState({codes: {...this.state.codes, [option.code]: !this.state.codes[option.code]}});
                        }}>
                        <Checkbox checked={this.state.codes[option.code]}>{option.name}</Checkbox>
                    </ListGroupItem>
                ))}
                </ListGroup>
            );
            case 'date':
            return (
                <div style={{marginBottom: 10}}>
                    <div>
                        {input.name}:&nbsp;
                    </div>
                    <div>
                        <DateTimePicker
                            time={false}
                            value={this.state.codes[input.code]}
                            onChange={date => this.setState({codes: {...this.state.codes, [input.code]: date}})}/>
                    </div>
                </div>
            );
            default:
            return null;
        }
    };

    render() {

        return (
            <BorderLayout
                className="ms-infortuni-stradali-container"
                header={
                    <Grid style={{width: '100%', marginTop: 10}} fluid>
                        <Row style={{marginTop: 10}}>
                            <Col xs={12} className="text-center">
                                <Toolbar
                                    btnDefaultProps={{
                                        bsStyle: 'primary',
                                        className: 'square-button-md'
                                    }}
                                    buttons={[
                                        {
                                            glyph: 'clear-filter',
                                            tooltip: 'Rimuovi tutti i filtri',
                                            visible: !!head(Object.keys(this.state.codes).filter(code => this.state.codes[code])),
                                            onClick: () => this.setState({codes: {}})
                                        },
                                        {
                                            glyph: 'ok',
                                            tooltip: 'Applica filtro'
                                        }
                                    ]}/>
                            </Col>
                        </Row>
                    </Grid>
                }>
                <Grid style={{width: '100%', overflow: 'auto', flex: 1}} fluid>
                    <Row>
                        {this.state.filters.map(filter => {
                            return (
                                <Col xs={12}>
                                    <FormGroup>
                                        <ControlLabel>{filter.name}</ControlLabel>
                                        {filter.inputs.map(input => {
                                            return this.getInput(input);
                                        })}
                                    </FormGroup>
                                </Col>
                            );
                        })}
                    </Row>
                </Grid>
            </BorderLayout>
        );
    }
}

module.exports = {
    InfortuniStradaliPlugin: assign(InfortuniStradali, {
        DrawerMenu: {
            name: 'backgroundswitcher',
            position: 2,
            icon: <Glyphicon glyph="filter"/>,
            buttonConfig: {
                buttonClassName: "square-button no-border",
                tooltip: "Filtra infortuni"
            },
            priority: 2
        }
    })
};
