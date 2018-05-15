/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const SimpleChart = require('../../old_ms2_226bfec4/web/client/components/charts/SimpleChart');

module.exports = ({legendPosition = 'auto-br', legendHeight = 200, legendWidth = 200, width, height, showLegend, ...props} = {}) => {

    const autoPosition = {
        'auto': {
            vert: 'column-reverse',
            horz: 'row-reverse'
        },
        'auto-tl': {
            vert: 'column',
            horz: 'row'
        },
        'auto-tr': {
            vert: 'column',
            horz: 'row-reverse'
        },
        'auto-bl': {
            vert: 'column-reverse',
            horz: 'row'
        },
        'auto-br': {
            vert: 'column-reverse',
            horz: 'row-reverse'
        }
    };

    if (!showLegend || props.type === 'gauge') {
        return (<SimpleChart {...props} width={width} height={height} legend={false}/>);
    }

    if (autoPosition[legendPosition]) {
        const ratio = width / height;
        if (width < legendWidth * 2 && ratio >= 1
        || height < legendHeight * 2 && ratio < 1) {
            return (<SimpleChart {...props} width={width} height={height} legend={false}/>);
        }

        if (ratio < 1) {
            return (
                <div className="ms-chart-legend" style={{width, height, flexDirection: autoPosition[legendPosition].vert}}>
                    <SimpleChart {...props} width={width} height={legendHeight} legend={{height: legendHeight, width, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                    <SimpleChart {...props} width={width} height={height - legendHeight} legend={false}/>
                </div>
            );
        }

        return (
            <div className="ms-chart-legend" style={{width, height, flexDirection: autoPosition[legendPosition].horz}}>
                <SimpleChart {...props} width={legendWidth} height={height} legend={{width: legendWidth, height, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                <SimpleChart {...props} width={width - legendWidth} height={height} legend={false}/>
            </div>
        );
    }

    switch (legendPosition) {
        case 'top':
            return (
                <div className="ms-chart-legend" style={{width, height, flexDirection: 'column'}}>
                    <SimpleChart {...props} width={width} height={legendHeight} legend={{height: legendHeight, width, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                    <SimpleChart {...props} width={width} height={height - legendHeight} legend={false}/>
                </div>
            );
        case 'bottom':
            return (
                <div className="ms-chart-legend" style={{width, height, flexDirection: 'column-reverse'}}>
                    <SimpleChart {...props} width={width} height={legendHeight} legend={{height: legendHeight, width, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                    <SimpleChart {...props} width={width} height={height - legendHeight} legend={false}/>
                </div>
            );
        case 'left':
            return (
                <div className="ms-chart-legend" style={{width, height, flexDirection: 'row'}}>
                    <SimpleChart {...props} width={legendWidth} height={height} legend={{width: legendWidth, height, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                    <SimpleChart {...props} width={width - legendWidth} height={height} legend={false}/>
                </div>
            );
        case 'right':
            return (
                <div className="ms-chart-legend" style={{width, height, flexDirection: 'row-reverse'}}>
                    <SimpleChart {...props} width={legendWidth} height={height} legend={{width: legendWidth, height, layout: 'vertical', wrapperStyle: { position: 'static'}}}/>
                    <SimpleChart {...props} width={width - legendWidth} height={height} legend={false}/>
                </div>
            );
        default:
            return (<SimpleChart {...props} width={width} height={height} legend={false}/>);
    }
};
