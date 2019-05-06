/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

const {Grid, Row, Col} = require('react-bootstrap');

class ArchiveCard extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        side: PropTypes.number,
        title: PropTypes.string,
        desc: PropTypes.string,
        src: PropTypes.string,
        link: PropTypes.string,
        absolute: PropTypes.bool
    };

    static defaultProps = {
        id: '',
        side: 256,
        title: '',
        desc: '',
        src: '0.png',
        link: ''
    };
    componentDidMount() {

    }
    render() {
        const {side} = this.props;
        return (
            <a href={this.props.absolute ? this.props.link : '#/' + this.props.link}>
            <div className="mapstore-archive-card" style={{width: side, height: side}} >
                <img src={require('../../assets/img/' + this.props.src)} style={{width: side}}/>
                <div className="mapstore-archive-card-info" style={{width: side, height: (side * 1 / 3), marginTop: side * 2 / 3}}>

                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <div className="mapstore-archive-card-title">
                                    {this.props.title}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <div className="mapstore-archive-card-desc">
                                    {this.props.desc}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
            </a>
        );
    }
}

module.exports = ArchiveCard;
