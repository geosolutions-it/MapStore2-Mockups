/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const SwitchPanel = require('./SwitchPanel');
const ConditionsGroup = require('./ConditionsGroup');

class AttributeFilter extends React.Component {

    static propTypes = {
        conditions: PropTypes.array
    };

    static defaultProps = {
        conditions: []
    };
    state = {};

    render() {
        return (
            <SwitchPanel
                onSwitch={() => {
                    this.setState({
                        conditions: []
                    });
                }}
                title={'Attribute Filter'}
                buttons={[{
                    tooltip: 'Reset filter',
                    onClick: () => {
                        this.setState({
                            conditions: []
                        });
                    },
                    visible: this.state.conditions && this.state.conditions.length > 0,
                    glyph: 'clear-filter'
                }]}>
                <ConditionsGroup
                    components={this.state.conditions}
                    onChange={conditions => {
                        this.setState({
                            conditions
                        });
                    }}/>
            </SwitchPanel>
        );
    }
}

module.exports = AttributeFilter;
