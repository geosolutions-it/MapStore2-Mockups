/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {BarChart, Bar} = require('recharts');
const {renderCartesianTools} = require('../../MapStore2/web/client/components/charts/cartesian');

module.exports = ({width = 600, height = 300, data, series =[], colorGenerator, autoColorOptions, isAnimationActive, ...props} = {}) => {
    const seriesArray = (Array.isArray(series) ? series : [series]);
    const COLORS = colorGenerator(seriesArray.length);
    // WORKAROUND: rechart do not rerender line and bar charts when change colors.
    const key = (COLORS || ["linechart"]).join("");
    return (<BarChart key={key} autoColorOptions={autoColorOptions} width={width} height={height} data={data}>
       {seriesArray.map(({color, ...serie} = {}, i) => <Bar key={`bar-${i}`} isAnimationActive={isAnimationActive} fill={COLORS[i]} {...serie}/>)}
       {renderCartesianTools(props)}
       {props.children}
    </BarChart>);
};
