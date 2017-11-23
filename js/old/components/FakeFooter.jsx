const React = require('react');
const PropTypes = require('prop-types');

class FakeFooter extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func
    };

    static defaultProps = {
        onSelect: () => {}
    };

    state = {
        open: true,
        selected: false
    }

    render() {

        return (
            <span id="mapstore-map-footer" >
                <div id="mapstore-map-footer-container" className="mapstore-map-footer " style={{zIndex: 1}}>
                    <div id="mapstore-mouseposition">
                        <button type="button" className="btn btn-sm btn-primary" style={{width: '100%'}}>
                            <span className="glyphicon glyphicon-mouse"></span>
                        </button>
                    </div>
                    <div id="mapstore-scalebox-container">
                        <span id="helpbadge-scaleBox" className="hidden  badge">?</span>
                        <div id="mapstore-scalebox">
                            <form className="form-inline">
                                <div className="form-group form-group-sm">
                                    <label className="control-label">
                                        <span>Scale:</span>
                                    </label>
                                    <select className="form-control">
                                        <option value="0">1 : 591658711</option>
                                        <option value="1">1 : 295829355</option>
                                        <option value="2">1 : 147914678</option>
                                        <option value="3">1 : 73957339</option>
                                        <option value="4">1 : 36978669</option>
                                        <option value="5">1 : 18489335</option>
                                        <option value="6">1 : 9244667</option>
                                        <option value="7">1 : 4622334</option>
                                        <option value="8">1 : 2311167</option>
                                        <option value="9">1 : 1155583</option>
                                        <option value="10">1 : 577792</option>
                                        <option value="11">1 : 288896</option>
                                        <option value="12">1 : 144448</option>
                                        <option value="13">1 : 72224</option>
                                        <option value="14">1 : 36112</option>
                                        <option value="15">1 : 18056</option>
                                        <option value="16">1 : 9028</option>
                                        <option value="17">1 : 4514</option>
                                        <option value="18">1 : 2257</option>
                                        <option value="19">1 : 1128</option>
                                        <option value="20">1 : 564</option>
                                        <option value="21">1 : 282</option>
                                        <option value="22">1 : 141</option>
                                        <option value="23">1 : 71</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="leaflet-control-attribution leaflet-control">
                        </div>

                    <div className="leaflet-control-scale leaflet-control">
                        <div className="leaflet-control-scale-line" style={{width: '45px'}}>500 km</div>
                    </div>
                </div>
            </span>
        );
    }
}

module.exports = FakeFooter;
