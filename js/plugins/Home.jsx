/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Grid, Row, Col, Jumbotron} = require('react-bootstrap');
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
class Home extends React.Component {

    render() {
        return (
            <div className="mapstore-body">
                <BorderLayout>

                <Grid fluid className="ms-jumbotron">
                    <Grid>
                    <Jumbotron>
                        <h1>
                            MapStore
                        </h1>
                        <p>
                            MapStore 2 has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents coming from well-known sources like Google Maps and OpenStreetMap or from services provided by organizations using open protocols like OGC WMS, WFS, WMTS or TMS and so on.<br/>Visit the home page for more details.
                        </p>
                    </Jumbotron>
                    </Grid>
                </Grid>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            download
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <img style={{width: '100%'}} src={require('../../old_ms2_226bfec4/web/client/product/assets/img/Viewer.jpg')}/>
                        </Col>
                        <Col sm={6}>
                            <h1>
                                MapStore
                            </h1>
                            <p>
                                MapStore 2 has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents coming from well-known sources like Google Maps and OpenStreetMap or from services provided by organizations using open protocols like OGC WMS, WFS, WMTS or TMS and so on.<br/>Visit the home page for more details.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <img style={{width: '100%'}} src={require('../../old_ms2_226bfec4/web/client/product/assets/img/3DViewer.jpg')}/>
                        </Col>
                        <Col sm={6}>
                            <h1>
                                MapStore
                            </h1>
                            <p>
                                MapStore 2 has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents coming from well-known sources like Google Maps and OpenStreetMap or from services provided by organizations using open protocols like OGC WMS, WFS, WMTS or TMS and so on.<br/>Visit the home page for more details.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <img style={{width: '100%'}} src={require('../../old_ms2_226bfec4/web/client/product/assets/img/MousePosition.jpg')}/>
                        </Col>
                        <Col sm={6}>
                            <h1>
                                MapStore
                            </h1>
                            <p>
                                MapStore 2 has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents coming from well-known sources like Google Maps and OpenStreetMap or from services provided by organizations using open protocols like OGC WMS, WFS, WMTS or TMS and so on.<br/>Visit the home page for more details.
                            </p>
                        </Col>
                    </Row>

                </Grid>

                    </BorderLayout>
                </div>

        );
    }
}

module.exports = {
    HomePlugin: Home
};
