/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const moment = require('moment');
const momentLocalizer = require('react-widgets/lib/localizers/moment');
const Toolbar = require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const {head} = require('lodash');
const {Calendar} = require('react-widgets');
const {ListGroup, ListGroupItem, Glyphicon: GlyphiconRB, Button: ButtonRB} = require('react-bootstrap');
const BorderLayout = require('../../../MapStore2/web/client/components/layout/BorderLayout');
const Filter = require('../../../MapStore2/web/client/components/misc/Filter');
const SideCard = require('./SideCardM');
momentLocalizer(moment);
const tooltip = require('../../../MapStore2/web/client/components/misc/enhancers/tooltip');
const Button = tooltip(ButtonRB);
const Glyphicon = tooltip(GlyphiconRB);

const DayComponent = ({ highlighted = [], date, label }) => head(highlighted.filter(high => high.value && high.value === moment(date).format('MM/DD/YYYY'))) ? (
    <div style={{ color: '#ffffff', backgroundColor: '#5a9aab', margin: '0 .25em' }}>
      {label}
    </div>
) : (
    <div>
      {label}
    </div>
);

class DateFilter extends React.Component {
    static propTypes = {
        effectiveDates: PropTypes.array,
        onToggleFilter: PropTypes.func,
        width: PropTypes.number,
        toggle: PropTypes.bool,
        style: PropTypes.object,
        dropUp: PropTypes.bool
    };

    static defaultProps = {
        effectiveDates: [
            {
                value: '01/04/2018',
                label: '4 Jan 2018',
                code: 'AR 190'
            },
            {
                value: '02/01/2018',
                label: '1 Feb 2018',
                code: 'AR 191'
            },
            {
                value: '03/01/2018',
                label: '1 Mar 2018',
                code: 'AR 192'
            },
            {
                value: '03/29/2018',
                label: '29 Mar 2018',
                code: 'AR 193'
            },
            {
                value: '04/26/2018',
                label: '26 Apr 2018',
                code: 'AR 194'
            },
            {
                value: '05/24/2018',
                label: '24 May 2018',
                code: 'AR 195'
            },
            {
                value: '06/21/2018',
                label: '21 Jun 2018',
                code: 'AR 196'
            },
            {
                value: '07/19/2018',
                label: '19 Jul 2018',
                code: 'AR 197'
            },
            {
                value: '08/16/2018',
                label: '16 Aug 2018',
                code: 'AR 198'
            },
            {
                value: '09/13/2018',
                label: '13 Sep 2018',
                code: 'AR 199'
            },
            {
                value: '10/11/2018',
                label: '11 Oct 2018',
                code: 'AR 200'
            },
            {
                value: '11/08/2018',
                label: '8 Nov 2018',
                code: 'AR 201'
            },
            {
                value: '12/06/2018',
                label: '6 Dec 2018',
                code: 'AR 202'
            }
        ],
        onToggleFilter: () => {},
        width: 350,
        style: {},
        dropUp: false
    };

    state = {
        filterText: '',
        expanded: true
    };

    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 5,
                    left: 305,
                    width: this.props.width,
                    // width: this.props.width,
                    zIndex: 5000,
                    display: 'flex',
                    ...this.props.style
                }}>
                {!this.state.expanded && this.props.toggle && !this.props.dropUp && <Button
                    bsStyle="primary"
                    tooltip="Expand date filter"
                    tooltipPosition="bottom"
                    className="square-button shadow"
                    onClick={() => this.setState({expanded: true})}>
                    <Glyphicon glyph="calendar"/>
                </Button>}
                {!(!this.state.expanded && this.props.toggle) && <SideCard
                    title={this.state.date ? 'Effective date' : 'Date not selected'}
                    dropUp={this.props.dropUp}
                    preview={
                        this.props.toggle ? <Glyphicon
                            tooltip="Collapse date filter"
                            tooltipPosition="bottom"
                            glyph="resize-small glyph-btn"
                            onClick={() => this.setState({expanded: false})}
                            style={{
                                fontSize: 12
                            }}/> : null
                    }
                    description={
                        this.state.date && <div style={{display: 'flex', margin: 0}}>
                            <div style={{flex: 1, margin: 0}}>
                                {moment(this.state.date).format('DD MMM YYYY')}
                            </div>
                            <div style={{
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Glyphicon
                                    glyph="1-close glyph-btn"
                                    tooltip="Clear date"
                                    tooltipPosition="bottom"
                                    onClick={() => this.setState({date: null})}
                                    style={{
                                        fontSize: 12
                                    }}/>
                            </div>
                        </div>
                    }
                    size="sm"
                    className="ms-date-filter"
                    style={{
                        transform: 'unset',
                        backgroundColor: '#ffffff',
                        margin: 0
                    }}
                    body={
                        <div>
                            {this.state.calendar && <Calendar
                                dayComponent={props => <DayComponent highlighted={this.props.effectiveDates} {...props}/>}
                                value={this.state.date}
                                onChange={date => this.setState({date})}/>}
                            {this.state.datesList &&
                            <BorderLayout
                                header={
                                    <div style={{margin: '0 8px 8px 8px'}}>
                                        <Filter
                                            filterText={this.state.filterText}
                                            filterPlaceholder="Filter dates"
                                            onFilter={filterText => this.setState({filterText})}/>
                                    </div>
                                }>
                                <ListGroup
                                    style={{
                                        margin: 0,
                                        height: 250
                                    }}>
                                    {this.props.effectiveDates
                                        .filter(date =>
                                            !this.state.filterText
                                            || date.value && date.value.indexOf(moment(this.state.filterText).format('MM/DD/YYYY')) !== -1
                                            || date.label && date.label.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1
                                            || date.code && date.code.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1
                                        )
                                        .map(date => (
                                            <ListGroupItem
                                                active={date.value === moment(this.state.date).format('MM/DD/YYYY')}
                                                onClick={() => this.setState({date: date.value && moment(date.value, 'MM/DD/YYYY').toDate() || null})}>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{flex: 1}}>
                                                        <strong>{date.code}</strong>
                                                    </div>
                                                    <div style={{flex: 2}}>
                                                        {date.label}
                                                    </div>
                                                </div>
                                            </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </BorderLayout>}
                        </div>
                    }
                    tools={
                        <Toolbar
                            btnDefaultProps={{
                                bsStyle: 'primary',
                                className: 'square-button-md',
                                tooltipPosition: 'bottom'
                            }}
                            buttons={[
                                {
                                    glyph: 'calendar',
                                    active: !!this.state.calendar,
                                    bsStyle: this.state.calendar ? 'success' : 'primary',
                                    tooltip: 'Select a date from calendar',
                                    onClick: () => this.setState({ calendar: !this.state.calendar, datesList: false})
                                },
                                {
                                    glyph: 'list',
                                    active: !!this.state.datesList,
                                    tooltip: 'Select a date from predefined list',
                                    bsStyle: this.state.datesList ? 'success' : 'primary',
                                    onClick: () => this.setState({ datesList: !this.state.datesList, calendar: false })
                                },
                                {
                                    glyph: this.state.hideLayers ? 'eye-close' : 'eye-open',
                                    active: !!this.state.hideLayers,
                                    tooltip: this.state.hideLayers ? 'Show layers without time data' : 'Hide layers without time data',
                                    bsStyle: this.state.hideLayers ? 'success' : 'primary',
                                    onClick: () => {
                                        this.props.onToggleFilter(!this.state.hideLayers);
                                        this.setState({ hideLayers: !this.state.hideLayers });
                                    }
                                }
                            ]}
                            />
                    }
                />}
                {!this.state.expanded && this.props.toggle && this.props.dropUp && <Button
                    bsStyle="primary"
                    tooltip="Expand date filter"
                    tooltipPosition="bottom"
                    className="square-button shadow"
                    style={{
                        alignSelf: 'end'
                    }}
                    onClick={() => this.setState({expanded: true})}>
                    <Glyphicon glyph="calendar"/>
                </Button>}
            </div>
        );
    }

}

module.exports = DateFilter;
