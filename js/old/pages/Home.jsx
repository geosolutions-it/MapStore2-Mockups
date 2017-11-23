/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
// const {Button, Glyphicon, Nav, NavItem} = require('react-bootstrap');
const Page = require('../../MapStore2/web/client/containers/Page');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');

/*
return (
    <div>
        <Nav bsStyle="pills">
            <NavItem eventKey={1} href="#/home">NavItem 1 content</NavItem>
            <NavItem eventKey={2} href="#/statistical">NavItem 2 content</NavItem>
        </Nav>
    </div>
);
*/
class Home extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        plugins: PropTypes.object,
        match: PropTypes.object
    };

    static defaultProps = {
        name: 'home'
    };

    render() {
        let plugins = ConfigUtils.getConfigProp("plugins") || {};

        let pagePlugins = {
            "desktop": plugins.common || [], // TODO mesh page plugins with other plugins
            "mobile": plugins.common || []
        };
        let pluginsConfig = {
            "desktop": plugins[this.props.name] || [], // TODO mesh page plugins with other plugins
            "mobile": plugins[this.props.name] || []
        };
        console.log(this.props.match.params);
        return (<Page
            id="home"
            pagePluginsConfig={pagePlugins}
            pluginsConfig={pluginsConfig}
            plugins={this.props.plugins}
            params={this.props.match.params}
            />);

    }
}

module.exports = Home;
