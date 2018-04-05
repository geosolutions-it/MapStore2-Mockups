/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const { Grid, Col, Row, FormGroup, FormControl, Navbar, NavItem, Nav, ControlLabel, Button, Glyphicon, Jumbotron } = require('react-bootstrap');
const FeaturedMapsList = require('../components/FeaturedMapsList');
const MapGrid = require('../components/maps-from-MapStore2/MapGrid');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const src = require("../../MapStore2/web/client/product/plugins/attribution/geosolutions-brand.png");
const brand = require('../../MapStore2/web/client/product/assets/img/geosolutions-brand.png');
const brandSmall = require('../../assets/img/geosolutions-brand-small.png');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const ButtonT = tooltip(Button);
const GlyphiconT = tooltip(Glyphicon);
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const ResizableModal = require('../components/ResizableModal');

class FeaturedMaps extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        right: PropTypes.number,
        fixed: PropTypes.bool,
        mobile: PropTypes.bool
    };

    static defaultProps = {
        onSelect: () => { },
        right: 0,
        fixed: true,
        mobile: false
    };

    state = {
        open: true,
        selected: false,
        sizePage: 12,
        sizePageFeatured: 4,
        featuredMaps: [
            { id: 0, title: 'Hello Map', description: 'My first map', thumbnail: '/assets/img/maps-thumbnails/histo-flowrence.png', featured: true },
            { id: 1, title: 'A new Map', description: 'My second map', featured: true },
            { id: 2, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/agr.png', featured: true },
            { id: 3, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/bolz.jpg', featured: true}
        ],
        maps: [
            { id: 0, title: 'Hello Map', description: 'My first map', thumbnail: '/assets/img/maps-thumbnails/histo-flowrence.png', featured: true },
            { id: 1, title: 'A new Map', description: 'My second map', featured: true },
            { id: 2, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/agr.png', featured: true },
            { id: 3, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/bolz.jpg', featured: true},
            { id: 4, title: 'Hello Map', description: 'My first map', thumbnail: '/assets/img/maps-thumbnails/gtopo30.png' },
            { id: 5, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/natural.jpg' },
            { id: 6, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/unesco_thumb.png' },
            { id: 7, title: 'A new Map', description: 'My second map', thumbnail: '/assets/img/maps-thumbnails/us-stats.png' },
            { id: 8, title: 'Hello Map', description: 'My first map', thumbnail: '/assets/img/maps-thumbnails/wind.png' },
            { id: 9, title: 'A new Map', description: 'My second map' },
            { id: 10, title: 'A new Map', description: 'My second map' },
            { id: 11, title: 'A new Map', description: 'My second map' },
            { id: 12, title: 'A new Map', description: 'My second map' },
            { id: 13, title: 'A new Map', description: 'My second map' },
            { id: 14, title: 'A new Map', description: 'My second map' }
        ]
    }

    renderHeader() {
        return (
            <Grid
                fluid
                className="ms-super-fake-navbar"
                style={{ width: '100%', padding: 0 }}>
                <Grid fluid style={{ width: '100%', padding: 0 }}>
                <Row className="ms-home-main-navbar">
                    <Col xs={12}>
                        <div className="ms-brand-img">
                            <a href="http://www.geo-solutions.it">
                                <img src={!this.props.mobile ? brand : brandSmall} className="mapstore-logo"/>
                            </a>
                        </div>
                        <Toolbar
                            btnDefaultProps={{
                                className: this.props.mobile ? 'square-button-md' : 'square-button',
                                bsStyle: 'primary'
                            }}
                            buttons={[
                                {
                                    glyph: 'user',
                                    bsStyle: this.state.login ? 'success' : 'primary',
                                    onClick: () => {
                                        if (this.state.login) {
                                            this.setState({
                                                login: false,
                                                loginModal: false,
                                                maps: this.state.maps.map(map => ({...map, canEdit: !this.state.login})),
                                                featuredMaps: this.state.featuredMaps.map(map => ({...map, canEdit: !this.state.login}))
                                            });
                                        } else {
                                            this.setState({
                                                loginModal: true
                                            });
                                        }
                                    }
                                }
                            ]}/>
                    </Col>
                </Row>
                </Grid>
                <Grid fluid style={{ width: '100%', padding: 0 }}>
                    <Row>
                        <Col xs={12}>
                            <Navbar
                                style={{border: 'none', margin: 0, borderTop: '1px solid #ddd'}}>
                                <Nav>
                                    {this.state.featuredMaps.length > 0 && <NavItem eventKey={1}
                                        onClick={() => {
                                            document.getElementById('featured-maps').scrollIntoView({behavior: "smooth", block: "start"});
                                        }}>
                                        <GlyphiconT tooltip="Featured Maps" glyph="star" className="ms-head-mob-icon"/><span className="ms-head-nav">Featured Maps</span>
                                    </NavItem>}
                                    <NavItem eventKey={2}
                                    onClick={() => {
                                        document.getElementById('scroll-maps').scrollIntoView({behavior: "smooth", block: "start"});
                                    }}>
                                        <GlyphiconT tooltip="Maps" glyph="1-map" className="ms-head-mob-icon"/><span className="ms-head-nav">Maps</span>
                                    </NavItem>
                                    <NavItem eventKey={2}
                                    onClick={() => {
                                        document.getElementById('scroll-examples').scrollIntoView({behavior: "smooth", block: "start"});
                                    }}>
                                        <GlyphiconT tooltip="Examples" glyph="bulb-on" className="ms-head-mob-icon"/><span className="ms-head-nav">Examples</span>
                                    </NavItem>
                                </Nav>
                            </Navbar>
                        </Col>

                    </Row>
                </Grid>
            </Grid>
        );
    }

    /*renderAddonAfter = () => {
        const remove = <Glyphicon className="searchclear" glyph="remove" onClick={this.clearSearch} key="searchbar_remove_glyphicon"/>;
        var showRemove = this.props.searchText !== "" || this.props.selectedItems && this.props.selectedItems.length > 0;
        let addonAfter = showRemove ? [remove] : [<Glyphicon glyph="search" key="searchbar_search_glyphicon"/>];
        if (this.props.loading) {
            addonAfter = [<Spinner style={{
                position: "absolute",
                right: "16px",
                top: "12px"
            }} spinnerName="pulse" noFadeIn/>, addonAfter];
        }
        if (this.props.error) {
            let tooltip = <Tooltip id="tooltip">{this.props.error && this.props.error.message || null}</Tooltip>;
            addonAfter.push(<OverlayTrigger placement="bottom" overlay={tooltip}><Glyphicon className="searcherror" glyph="warning-sign" onClick={this.clearSearch}/></OverlayTrigger>);
        }
        return <span className="input-group-addon">{addonAfter}</span>;
    };*/

    render() {

        return (
            <BorderLayout
                header={this.renderHeader()}>

                {!this.props.mobile && <img className="ms-fork-button"
                src="https://camo.githubusercontent.com/121cd7cbdc3e4855075ea8b558508b91ac463ac2/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677265656e5f3030373230302e706e67"
                alt="Fork me on GitHub"
                data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png"
                style={{
                    position: 'absolute',
                    top: 111,
                    left: 0,
                    border: 0, zIndex: 100
                }}/>}

                    <Jumbotron>
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    <h1>MapStore2</h1>
                                    <p>
                                    Modern webmapping with OL3, Leaflet and React
                                    </p>
                                </Col>
                            </Row>
                        </Grid>
                    </Jumbotron>

                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div
                                    id="map-search-bar"
                                    className={"MapSearchBar maps-search"}>
                                    <FormGroup>
                                        <div className="input-group">
                                            <FormControl
                                                key="search-input"
                                                type="text"
                                                placeholder="Search for maps"
                                                inputRef={ref => { this.input = ref; }}
                                                style={{
                                                    textOverflow: "ellipsis"
                                                }} />
                                        </div>
                                    </FormGroup>
                                </div>
                            </Col>
                        </Row>
                    </Grid>

                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <p>MapStore 2 has been developed to create, save and share in a simple and intuitive way maps and mashups created selecting contents coming from well-known sources like Google Maps and OpenStreetMap or from services provided by organizations using open protocols like OGC WMS, WFS, WMTS or TMS and so on.</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <hr />
                            </Col>
                        </Row>
                    </Grid>

                    {this.state.featuredMaps.length > 0 && <Grid>
                        <Row>
                            <Col xs={12} id="featured-maps">
                                <h3>Featured Maps</h3>
                            </Col>
                        </Row>
                        <Row className={this.props.mobile ? "ms-grid-horizontal" : ''}>
                            <MapGrid
                                viewerUrl={() => { }}
                                editMap={() => { }}
                                maps={!this.props.mobile && this.state.featuredMaps.filter((map, idx) => idx < this.state.sizePageFeatured) || this.state.featuredMaps}
                                colProps={{ className: 'ms-grid-map', xs: 12, sm: 6, md: 3 }}
                                deleteMap={() => { }}
                                openDetails={(map) => {
                                    this.updateFeaturedMaps(map);
                                }} />
                        </Row>

                        {/*!this.props.mobile && <Row>
                            <Col xs={12} className="text-center">
                            <Pagination bsSize="small" prev next first last ellipsis boundaryLinks
                                items={1}
                                maxButtons={3}
                                activePage={1}/>
                            </Col>
                        </Row>*/}

                        {!this.props.mobile && this.state.sizePageFeatured < this.state.featuredMaps.length && <Row>
                            <Col xs={12} className="text-center">
                                <Button bsStyle="primary" bsSize="sm" onClick={() => {
                                    this.setState({
                                        sizePageFeatured: this.state.sizePageFeatured + 4
                                    });
                                }}>
                                    Show more...
                                </Button>
                            </Col>
                        </Row>}

                        <Row>
                            <Col xs={12}>
                                {this.state.sizePageFeatured > this.state.featuredMaps.length && this.state.featuredMaps.length || this.state.sizePageFeatured} of {this.state.featuredMaps.length}
                                <hr />
                            </Col>
                        </Row>
                    </Grid>}

                    <Grid>
                        <Row>
                            <Col xs={12} id="scroll-maps">
                                <h3 className="pull-left">Maps</h3>
                                {this.state.login && <ButtonT
                                    style={{marginTop: 10}}
                                    className="square-button-md pull-right"
                                    bsStyle="primary"
                                    tooltip="Create new map">
                                    <Glyphicon glyph="plus"/>
                                </ButtonT>}
                            </Col>
                        </Row>
                        <Row className={this.props.mobile ? "ms-grid-horizontal" : ''}>
                            <MapGrid
                                viewerUrl={() => { }}
                                editMap={() => { }}
                                maps={!this.props.mobile && this.state.maps.filter((map, idx) => idx < this.state.sizePage) || this.state.maps}
                                colProps={{ className: 'ms-grid-map', xs: 12, sm: 6, md: 3 }}
                                deleteMap={() => { }}
                                openDetails={(map) => {
                                    this.updateFeaturedMaps(map);
                                }} />
                        </Row>
                        {/*!this.props.mobile && <Row>
                            <Col xs={12} className="text-center">
                            <Pagination bsSize="small" prev next first last ellipsis boundaryLinks
                                items={1}
                                maxButtons={3}
                                activePage={1}/>
                            </Col>
                        </Row>*/}

                        {!this.props.mobile && this.state.sizePage === 12 && <Row>
                            <Col xs={12} className="text-center">
                                <Button bsStyle="primary" bsSize="sm" onClick={() => {
                                    this.setState({
                                        sizePage: 15
                                    });
                                }}>
                                    Show more...
                                </Button>
                            </Col>
                        </Row>}

                        <Row>
                            <Col xs={12}>
                                {this.state.sizePage} of {this.state.maps.length}
                                <hr />
                            </Col>
                        </Row>
                    </Grid>

                    <Grid>
                        <Row>
                            <Col md={6} id="scroll-examples" xs={12}>
                                <h3 >Examples</h3>
                                <FeaturedMapsList />
                            </Col>
                            <Col md={6} xs={12}>
                                <h3>Keep in touch and stay up-to-date with the mailing lists</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <hr />
                            </Col>
                        </Row>
                    </Grid>

                    <Grid>
                        <Row>
                            <Col xs={12} className="text-center">
                                <div><a target="_blank" href="http://www.geo-solutions.it/"> <img src={src} width="140" title="GeoSolutions" alt="GeoSolutions" /></a> <br/><br/></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <br/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} className="text-center">
                               <small>GeoSolutions S.a.s. | Via Poggio alle Viti, 1187 - 55054 Massarosa (Lucca) - Italy info@geo-solutions.it | Tel: +39 0584 962313 | Fax: +39 0584 1660272</small>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <br/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <br/>
                            </Col>
                        </Row>
                    </Grid>

                    <ResizableModal
                        show={this.state.loginModal}
                        title="Login"
                        size={this.props.mobile ? '' : 'sm'}
                        onClose={() => {
                            this.setState({
                                loginModal: false
                            });
                        }}
                        buttons={[{
                            text: 'Sign in',
                            onClick: () => {
                                this.setState({
                                    login: true,
                                    loginModal: false,
                                    maps: this.state.maps.map(map => ({...map, canEdit: !this.state.login})),
                                    featuredMaps: this.state.featuredMaps.map(map => ({...map, canEdit: !this.state.login}))
                                });
                            }
                        }]}>
                        <Grid fluid style={{display: 'flex', height: '100%'}}>
                            <Row style={{display: 'flex', flex: 1}}>
                                <Col xs={12} style={{margin: 'auto'}}>
                                    <h3 className="text-danger">!!Simplified Login for mockup, don't change the login process!!</h3>
                                    <form>
                                        <FormGroup>
                                            <ControlLabel>Username</ControlLabel>
                                            <FormControl
                                                key="username"
                                                type="text"
                                                placeholder="Username" />
                                            </FormGroup>
                                            <FormGroup>
                                            <ControlLabel>Password</ControlLabel>
                                            <FormControl
                                                key="password"
                                                type="password"
                                                placeholder="Password" />
                                        </FormGroup>
                                    </form>
                                </Col>
                            </Row>
                        </Grid>
                    </ResizableModal>


            </BorderLayout>
        );
    }

    updateFeaturedMaps(map) {
        if (map.featured) {
            this.setState({
                featuredMaps: this.state.featuredMaps.filter(mapF => mapF.id !== map.id),
                maps: this.state.maps.map(mapI => mapI.id === map.id ? { ...mapI, featured: false } : { ...mapI })
            });
        } else {
            this.setState({
                featuredMaps: [...this.state.featuredMaps, { ...map, featured: true }],
                maps: this.state.maps.map(mapI => mapI.id === map.id ? { ...mapI, featured: true } : { ...mapI })
            });
        }
    }
}

module.exports = {
    FeaturedMapsPlugin: FeaturedMaps
};
