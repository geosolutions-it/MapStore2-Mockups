/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */
const React = require('react');

const {wizardHanlders} = require('../../old_ms2_226bfec4/web/client/components/misc/wizard/enhancers');
const loadingState = require('../../old_ms2_226bfec4/web/client/components/misc/enhancers/loadingState')(({loading, data}) => loading || !data, {width: 500, height: 200});

const ChartType = require('./ChartType');
const wfsChartOptions = require('../../old_ms2_226bfec4/web/client/components/widgets/builder/wizard/chart/wfsChartOptions');
const ChartOptions = wfsChartOptions(require('./ChartOptions'));
const WidgetOptions = require('../../old_ms2_226bfec4/web/client/components/widgets/builder/wizard/chart/WidgetOptions');
const sampleData = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/sampleChartData');
const wpsChart = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/wpsChart');
const dependenciesToFilter = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/dependenciesToFilter');
const emptyChartState = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/emptyChartState');
const errorChartState = require('../../old_ms2_226bfec4/web/client/components/widgets/enhancers/errorChartState');
const {compose, lifecycle} = require('recompose');
const enhanchePreview = compose(
    dependenciesToFilter,
    wpsChart,
    loadingState,
    errorChartState,
    emptyChartState
);
const PreviewChart = enhanchePreview(require('../../old_ms2_226bfec4/web/client/components/charts/SimpleChart'));
const SampleChart = sampleData(require('../../old_ms2_226bfec4/web/client/components/charts/SimpleChart'));

const sampleProps = {
    width: 430,
    height: 200
};


const isChartOptionsValid = (options = {}) => options.aggregateFunction && options.aggregationAttribute && options.groupByAttributes;

const Wizard = wizardHanlders(require('../../old_ms2_226bfec4/web/client/components/misc/wizard/WizardContainer'));


const renderPreview = ({data = {}, layer, dependencies={}, setValid = () => {}}) => isChartOptionsValid(data.options)
    ? (<PreviewChart
        key="preview-chart"
        onLoad={() => setValid(true)}
        onLoadError={() => setValid(false)}
        isAnimationActive={false}
        dependencies={dependencies}
        {...sampleProps}
        type={data.type}
        legend={data.legend}
        layer={data.layer || layer}
        filter={data.filter}
        geomProp={data.geomProp}
        mapSync={data.mapSync}
        autoColorOptions={data.autoColorOptions}
        options={data.options}
        />)
    : (<SampleChart
        key="sample-chart"
        isAnimationActive={false}
        {...sampleProps}
        type={data.type}
        autoColorOptions={data.autoColorOptions}
        legend={data.legend} />);

const enhanceWizard = compose(lifecycle({
    componentWillReceiveProps: ({data = {}, valid, setValid = () => {}} = {}) => {
        if (valid && !isChartOptionsValid(data.options)) {
            setValid(false);
        }
    }})
);
module.exports = enhanceWizard(({onChange = () => {}, targetLayer, onFinish = () => {}, setPage= () => {}, setValid, data = {}, layer ={}, step=0, types, featureTypeProperties, dependencies, onClick = () => {}, isConnected, maps}) =>
    (<Wizard
        step={step}
        setPage={setPage}
        onFinish={onFinish}
        isStepValid={ n => n === 1 ? isChartOptionsValid(data.options) : true} hideButtons>
        <ChartType
            key="type"
            type={data.type}
            onSelect={ i => {
                onChange("type", i);
            }}/>
        <ChartOptions
            key="chart-options"
            featureTypeProperties={featureTypeProperties}
            types={types}
            data={data}
            targetLayer={targetLayer}
            onChange={onChange}
            maps={maps}
            onClick={onClick}
            isConnected={isConnected}
            layer={data.layer || layer}
            sampleChart={renderPreview({data, layer: data.layer || layer, dependencies, setValid: v => setValid(v && isChartOptionsValid(data.options))})}
        />
        <WidgetOptions
            key="widget-options"
            data={data}
            onChange={onChange}
            layer={data.layer || layer}
            sampleChart={renderPreview({data, layer: data.layer || layer, dependencies, setValid: v => setValid(v && isChartOptionsValid(data.options))})}
        />
</Wizard>));
