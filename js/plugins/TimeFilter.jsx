/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

const TOCTimeFilter = require('../components/timefilter/TOCTimeFilter');
const ResizableModal = require('../../MapStore2/web/client/components/misc/ResizableModal');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const {Glyphicon, Grid, Row, Col, Radio, Checkbox, Button: ButtonRB} = require('react-bootstrap');
const {DateTimePicker} = require('react-widgets');
const moment = require('moment');
const momentLocalizer = require('react-widgets/lib/localizers/moment');
const Select = require('react-select');
const {head} = require('lodash');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const Button = tooltip(ButtonRB);
momentLocalizer(moment);

const DayComponent = ({ highlighted = [], date, label }) => head(highlighted.filter(high => high.value && high.value === moment(date).format('MM/DD/YYYY'))) ? (
    <div style={{ color: '#ffffff', backgroundColor: '#5a9aab', margin: '0 .25em' }}>
      {label}
    </div>
) : (
    <div>
      {label}
    </div>
);

class TimeFilter extends React.Component {

    static propTypes = {
        buttons: PropTypes.array,
        customDate: PropTypes.array
    };

    static defaultProps = {
        buttons: [],
        customDate: [
            {
                value: '05/26/2018',
                label: '05/26/2018'
            },
            {
                value: '05/21/2018',
                label: '05/21/2018'
            },
            {
                value: '05/16/2018',
                label: '05/16/2018'
            }
        ]
    };

    state = {
        showFilter: false,
        selectCustom: true
    };

    render() {

        return (
            <span>
                <TOCTimeFilter
                    filterFunction={(layer) => !this.state.hideLayers || this.state.hideLayers && layer.timeOptions}
                    onClickDate={() => this.setState({
                        showFilter: true
                    })}/>
                <ResizableModal
                    size="sm"
                    title={<span><Glyphicon glyph="calendar"/>&nbsp;Filter layers by date</span>}
                    onClose={() => this.setState({
                        showFilter: false
                    })}
                    show={this.state.showFilter}
                    buttons={[
                        {
                            text: 'Close',
                            bsStyle: 'primary',
                            onClick: () => this.setState({
                                showFilter: false
                            })
                        }
                    ]}>
                    <BorderLayout
                        header={
                            <Grid fluid style={{width: '100%'}}>
                                <Row style={{minHeight: 40}}>
                                    <Col xs={12}>
                                        {(this.state.date || this.state.hideLayers) && <Button
                                            className="square-button-md"
                                            tooltip="Clear filter"
                                            onClick={() => this.setState({
                                                date: null,
                                                hideLayers: false,
                                                selectCustom: true
                                            })}
                                            disabled={!(this.state.date || this.state.hideLayers)}
                                            style={{
                                                marginTop: 8,
                                                border: 'none',
                                                'float': 'right'
                                            }}>
                                            <Glyphicon glyph="clear-filter"/>
                                        </Button>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <div className="ms-date-form"
                                            onClick={() => !this.state.selectCustom && this.setState({selectCustom: true})}
                                            style={{opacity: !this.state.selectCustom ? 0.5 : 1.0}}>
                                            <Radio
                                                readOnly
                                                value={this.state.date && moment(this.state.date).format('MM/DD/YYYY') || ''}
                                                checked={this.state.selectCustom}
                                                onClick={() => this.setState({selectCustom: true})}/>
                                            <div>
                                                <small><i>Custom dates</i></small>
                                                <DateTimePicker
                                                    dayComponent={props => <DayComponent highlighted={this.props.customDate} {...props}/>}
                                                    disabled={!this.state.selectCustom}
                                                    placeholder="Select a custom date"
                                                    time={false}
                                                    value={this.state.date}
                                                    onChange={date => this.setState({date})}
                                                    />
                                            </div>
                                        </div>
                                        <div className="ms-date-form"
                                            onClick={() => this.state.selectCustom && this.setState({selectCustom: false})}
                                            style={{opacity: this.state.selectCustom ? 0.5 : 1.0}}>
                                            <Radio
                                                readOnly
                                                checked={!this.state.selectCustom}
                                                onClick={() => this.setState({selectCustom: false})}/>
                                            <div>
                                                <small><i>Predefined dates</i></small>
                                                <Select
                                                    options={this.props.customDate}
                                                    name={name}
                                                    disabled={this.state.selectCustom}
                                                    // multi={type === 'multiselect'}
                                                    value={this.state.date && moment(this.state.date).format('MM/DD/YYYY') || ''}
                                                    // isLoading={loading}
                                                    placeholder="Select a predefined date"
                                                    onChange={(value) => {
                                                        this.setState({date: value && moment(value, 'MM/DD/YYYY').toDate() || null});
                                                    }}
                                                    simpleValue/>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Checkbox
                                            readOnly
                                            checked={this.state.hideLayers}
                                            onChange={() => this.setState({ hideLayers: !this.state.hideLayers })}>
                                            <small><i>Hide layers without time data</i></small>
                                        </Checkbox>
                                    </Col>

                                </Row>
                            </Grid>
                        }>
                        <div style={{display: 'flex', flex: 1, height: '100%', width: '100%'}}>
                            <div style={{margin: 'auto'}} className="text-center">
                                <h2 >{this.state.date && moment(this.state.date).format('DD MMM YYYY') || <Glyphicon glyph="calendar" style={{fontSize: 40}}/>}</h2>
                            </div>
                        </div>
                    </BorderLayout>
                </ResizableModal>

                {this.state.date && <div className="ms-date-overlay">
                    {this.state.date && moment(this.state.date).format('DD MMM YYYY')}
                </div>}
            </span>
        );
    }
}

module.exports = {
    TimeFilterPlugin: TimeFilter
};
