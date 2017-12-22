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
const {setOption} = require('../actions/mockups');

class Background extends React.Component {
    static propTypes = {
        region: PropTypes.string,
        showItaly: PropTypes.bool,
        onClick: PropTypes.func
    };

    static defaultProps = {
        region: '',
        showItaly: false,
        onClick: () => {}
    };

    render() {
        return (
            <span>
                <div className="mockups-bg" style={{position: 'absolute', width: '100%', height: '100%', cursor: 'pointer'}} onClick={this.props.onClick}>
                    <ContainerDimensions>
                        { ({width, height}) => <ItalyMap region={this.props.showItaly ? 'all' : this.props.region} width={width} height={height}/> }
                    </ContainerDimensions>
                </div>
            </span>
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
}), {
    onClick: setOption.bind(null, 'clickMap', true)
})(Background);

module.exports = {
    BackgroundPlugin,
    reducers: {
        mockups: require('../reducers/mockups')
    }
};
