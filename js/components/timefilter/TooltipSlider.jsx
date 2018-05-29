/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const Slider = require('../../../MapStore2/web/client/components/misc/Slider');

class TooltipSlider extends React.Component {
    static propTypes = {
        tooltips: PropTypes.bool
    };

    render() {
        const {tooltips} = this.props;
        return (
            <div
                className={`mapstore-slider ${tooltips && 'with-tooltip'}`}
                style={{
                    display: 'flex'
                }}>
                {tooltips && <div style={{width: 13}}/>}
                <div style={{flex: 1}}>
                    <Slider {...this.props}/>
                </div>
                {tooltips && <div style={{width: 13}}/>}
            </div>
        );
    }

}

module.exports = TooltipSlider;
