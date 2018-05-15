const React = require('react');
const PropTypes = require('prop-types');
// const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const SideGrid = require('./maps-from-MapStore2/action-legend/cardgrids/SideGrid');
const {Grid, Col, Row, Glyphicon, Button, Panel} = require('react-bootstrap');
const Slider = require('react-nouislider');
const {isNil} = require('lodash');
const {Resizable} = require('react-resizable');
const ContainerDimensions = require('react-container-dimensions').default;
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const ButtonT = tooltip(Button);
const legendsImg = {
    'layer:01': require('../plugins/dashboard/img/legend-r.png'),
    'layer:02': require('../../assets/img/usa-legend.png'),
    'layer:03': require('../../assets/img/unesco-legend.png')
};

class ActionLegend extends React.Component {

    static propTypes = {
        expanded: PropTypes.bool,
        layers: PropTypes.array,
        onChange: PropTypes.func,
        onExpand: PropTypes.func,
        onResize: PropTypes.func,
        height: PropTypes.number,
        onClick: PropTypes.func
    };

    static defaultProps = {
        expanded: false,
        layers: [],
        onChange: () => {},
        onExpand: () => {},
        onResize: () => {},
        onClick: () => {},
        height: 260
    };

    state = {
        expanded: false,
        height: 260
    };

    componentWillMount() {
        this.setState({
            expanded: this.props.expanded,
            height: this.props.height
        });
    }

    componentDidMount() {
        /* mockup */
        const body = document.querySelector('#ms-action-legend .panel-body');
        this.setState({
            bodyHeight: body && body.clientHeight || undefined,
            height: body && body.clientHeight || this.state.height
        });
        /* end mockup */
    }


    componentWillReceiveProps(newProps) {
        this.setState({
            expanded: newProps.expanded,
            height: newProps.height
        });
    }

    renderHeader() {
        return (
            <Grid fluid>
            <Row>
                <Col xs={9} style={{padding: 0}}>
                    <ButtonT
                        tooltip="Open advanced TOC"
                        tooltipPosition="bottom"
                        bsStyle="primary"
                            className="square-button"
                            onClick={() => {
                                this.props.onClick();
                            }}>
                        <Glyphicon glyph="1-layer"/>
                    </ButtonT>
                </Col>
                <Col xs={3} style={{padding: 4}}>
                    <Button
                        className="pull-right no-border square-button-md"
                        onClick={() => {
                            this.setState({
                                expanded: !this.state.expanded
                            });
                            this.props.onExpand(!this.state.expanded);
                        }}>
                        <Glyphicon glyph={this.state.expanded ? "chevron-down" : "chevron-left"} />
                    </Button>
                </Col>
                </Row>
            </Grid>
        );
    }

    renderCardBody(layer) {
        return (
            <span>
                <Grid fluid>
                    <Row>
                        <Col xs={12}>
                            <img
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    marginLeft: 24,
                                    marginBottom: 10
                                }}
                                src={legendsImg[layer.id]}/>
                            </Col>
                    </Row>
                </Grid>
                <div className="mapstore-slider" onClick={(e) => { e.stopPropagation(); }}>
                    <Slider
                    disabled={!layer.visibility}
                    start={[isNil(layer.opacity) ? 100 : layer.opacity * 100 ]}
                    range={{min: 0, max: 100}}
                    onChange={(value) => {
                        this.props.onChange(layer.id, 'opacity', (value[0] / 100).toFixed(2));
                    }}/>
                </div>
            </span>
        );
    }

    render() {
        return (
            <ContainerDimensions>
                {({height}) =>
                <Resizable
                height={this.state.height}
                axis="y"
                minConstraints={[200, 150]}
                maxConstraints={[600, this.state.bodyHeight && this.state.bodyHeight < height - 155 ? this.state.bodyHeight + 80 : height - 155]}
                onResize={(e, data) => {
                    this.setState({
                        height: data.size.height
                    });
                    this.props.onResize(data.size.height);

                    /* mockup */
                    const body = document.querySelector('#ms-action-legend .panel-body');
                    this.setState({
                        bodyHeight: body && body.clientHeight || undefined
                    });
                    /* end mockup */
                }}>
                    <Panel
                        className="ms-action-legend"
                        id="ms-action-legend"
                        collapsible
                        header={this.renderHeader()}
                        expanded={this.state.expanded}
                        footer={this.state.expanded && <Grid fluid/>}
                        style={this.state.height && this.state.expanded ? {height: this.state.height} : {}}>
                        <SideGrid
                            size="sm"
                            items={
                                this.props.layers.filter(layer => !layer.loadingError).map(layer => ({
                                    title: layer.title,
                                    preview: <Glyphicon className="text-primary" glyph={layer.visibility ? 'eye-open' : 'eye-close'} onClick={() => this.props.onChange(layer.id, 'visibility', !layer.visibility)}/>,
                                    className: layer.visibility ? '' : ' ms-no-visible',
                                    body: layer.visibility ? this.renderCardBody(layer) : null
                                }))}/>
                    </Panel>
                </Resizable>
                }
            </ContainerDimensions>
        );
    }
}

module.exports = ActionLegend;
