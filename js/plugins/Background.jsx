/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const ContainerDimensions = require('react-container-dimensions').default;
const {connect} = require('react-redux');
const ItalyMap = require('../components/ItalyMap');

class Background extends React.Component {
    static propTypes = {
        region: PropTypes.string
    };

    static defaultProps = {
        region: ''
    };

    render() {
        return (
            <div className="mockups-bg" style={{position: 'absolute', width: '100%', height: '100%'}}>
                <ContainerDimensions>
                    { ({width, height}) => <ItalyMap region={this.props.region} width={width} height={height}/> }
                </ContainerDimensions>
            </div>
        );
    }

    setDimentions = (width, height) => {
        if (width > height) {
            return {width, height: 'auto'};
        }
        return {width: 'auto', height};
    };
}

const BackgroundPlugin = connect((state) => ({
    region: state.mockups && state.mockups.region
}))(Background);

module.exports = {
    BackgroundPlugin,
    reducers: {
        mockups: require('../reducers/mockups')
    }
};
