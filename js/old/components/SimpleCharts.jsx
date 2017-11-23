/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {BarChart, Bar, XAxis, YAxis, PieChart, Pie, Legend, Cell} = require('recharts');
const ContainerDimensions = require('react-container-dimensions').default;

const data = [
      {name: 'Res..', pv: 5000},
      {name: 'Uff..', pv: 4006},
      {name: 'Com..', pv: 2541},
      {name: 'Ind...', pv: 500},
      {name: 'Rur...', pv: 863},
      {name: 'Par...', pv: 331},
      {name: 'Par...', pv: 500}
];

const data01 = [{name: 'Res..', value: 400}, {name: 'Ind...', value: 300},
                  {name: 'Uff..', value: 300}, {name: 'Rur...', value: 200},
                  {name: 'Com..', value: 278}, {name: 'Par...', value: 5}, {name: 'Par...', value: 189}];

class Statistical extends React.Component {

    static propTypes = {
        type: PropTypes.string,
        xAxis: PropTypes.bool,
        yAxis: PropTypes.bool,
        isHorz: PropTypes.bool,
        isFull: PropTypes.bool,
        xLabel: PropTypes.string,
        yLabel: PropTypes.string,
        colors: PropTypes.array
    };

    static defaultProps = {
        type: 'bar',
        xAxis: false,
        yAxis: false,
        isHorz: false,
        isFull: false,
        xLabel: '',
        yLabel: '',
        colors: []
    };

    renderChart(width, height) {
        const {isHorz} = this.props;

        switch (this.props.type) {
            case 'bar':
                return (<BarChart width={isHorz ? width : height} height={height} data={data}
                    margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                    {this.props.xAxis && !this.props.isFull ? <XAxis tick={false}/> : null}
                    {this.props.isFull ? <XAxis dataKey="name" label={this.props.xLabel} tick/> : null}
                    {this.props.yAxis && !this.props.isFull ? <YAxis tick={false}/> : null}
                    {this.props.isFull ? <YAxis label={this.props.yLabel} tick/> : null}
                    <Bar dataKey="pv" fill="#078aa3" />
                    {/*this.props.isFull ? <Legend /> : null*/}
                </BarChart>);
            case 'pie':
                return this.props.colors.length > 0 ? (<PieChart width={isHorz ? width : height} height={height}>
                    <Pie isAnimationActive data={data01} cx={isHorz ? width / 2 : height / 2} cy={height / 2} outerRadius={height / 3} fill="#078aa3" label={false}>
                        { this.props.colors.map(c => <Cell fill={c}/>)
                }</Pie>
                {/*this.props.isFull ? <Legend/> : null*/}
                </PieChart>) : (<PieChart width={isHorz ? width : height} height={height}>
                    <Pie isAnimationActive data={data01} cx={isHorz ? width / 2 : height / 2} cy={height / 2} outerRadius={height / 3} fill="#078aa3" label={false}/>
                    {/*this.props.isFull ? <Legend/> : null*/}
                </PieChart>);
            default:
                return null;
        }
    }

    render() {
        return (
            <ContainerDimensions>
            { ({ width, height }) =>
                this.renderChart(width, height)

            }
            </ContainerDimensions>
        );
    }
}

module.exports = Statistical;
