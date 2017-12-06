/*
* Copyright 2016, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const assign = require('object-assign');
const PropTypes = require('prop-types');
const _ = require('lodash');
const Select = require('react-select');
const Spinner = require('react-spinkit');
const {Button, Glyphicon} = require('react-bootstrap');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');

require('react-select/dist/react-select.css');

/**
* Map permission editor
*/
class PermissionEditor extends React.Component {
    static propTypes = {
        // props
        id: PropTypes.string,
        user: PropTypes.object,
        onGroupsChange: PropTypes.func,
        onAddPermission: PropTypes.func,
        buttonSize: PropTypes.string,
        includeCloseButton: PropTypes.bool,
        map: PropTypes.object,
        style: PropTypes.object,
        fluid: PropTypes.bool,
        // CALLBACKS
        onErrorCurrentMap: PropTypes.func,
        onUpdateCurrentMap: PropTypes.func,
        onNewGroupChoose: PropTypes.func,
        onNewPermissionChoose: PropTypes.func,
        availablePermissions: PropTypes.arrayOf(PropTypes.string),
        availableGroups: PropTypes.arrayOf(PropTypes.object),
        updatePermissions: PropTypes.func,
        groups: PropTypes.arrayOf(PropTypes.object),
        newGroup: PropTypes.object,
        newPermission: PropTypes.string
    };

    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps = {
        id: "PermissionEditor",
        onGroupsChange: ()=> {},
        onAddPermission: ()=> {},
        onNewGroupChoose: ()=> {},
        onNewPermissionChoose: ()=> {},
        user: {
            name: "Guest"
        },
        style: {},
        buttonSize: "small",
        // CALLBACKS
        onErrorCurrentMap: ()=> {},
        onUpdateCurrentMap: ()=> {},
        availablePermissions: ["canRead", "canWrite"],
        availableGroups: [{groupName: 'everybody', id: 0}, {groupName: 'geosolutions', id: 1}],
        updatePermissions: () => {},
        groups: ['everybody', 'everybody']
    };

    onNewGroupChoose = (selected) => {
        // TODO: use _.find(this.props.availableGroups,['id', _.toInteger(id)]) when lodash will be updated to version 4
        this.props.onNewGroupChoose(_.find(this.props.availableGroups, (o)=> o.id === selected.value));
    };

    onAddPermission = () => {
        // Check if the new permission will edit ad existing one
        if (this.isPermissionPresent(this.props.newGroup.groupName)) {
            this.props.onGroupsChange(
                {
                    SecurityRuleList: {
                        SecurityRule: this.props.map.permissions.SecurityRuleList.SecurityRule.map(
                                function(rule) {
                                    if (rule.group && rule.group.groupName === this.props.newGroup.groupName) {
                                        if (this.props.newPermission === "canWrite") {
                                            return assign({}, rule, {canRead: true, canWrite: true});
                                        }
                                        return assign({}, rule, {canRead: true, canWrite: false});
                                    }
                                    return rule;
                                }, this
                            ).filter(rule => rule.canRead || rule.canWrite)
                    }
                }
            );

        } else {
            this.props.onAddPermission({
                canRead: true,
                canWrite: this.props.newPermission === "canWrite",
                group: this.props.newGroup
            });
        }
    };

    onChangePermission = (index, input) => {
        if (this.props.map.permissions) {
            this.props.onGroupsChange(
                {
                    SecurityRuleList: {
                        SecurityRule: this.props.map.permissions.SecurityRuleList.SecurityRule.map(
                        function(rule) {
                            if (rule.group && rule.group.groupName === this.localGroups[index].name) {
                                if (input === "canWrite") {
                                    return assign({}, rule, {canRead: true, canWrite: true});
                                } else if (input === "canRead") {
                                    return assign({}, rule, {canRead: true, canWrite: false});
                                }
                                // TODO: this entry is useless, it should be removed from the array
                                return assign({}, rule, {canRead: false, canWrite: false});
                            }
                            return rule;
                        }, this
                     ).filter(rule => rule.canRead || rule.canWrite)
                    }
                }
         );
        }
    };

    getSelectableGroups = () => {
        return this.props.availableGroups && this.props.availableGroups.filter( (group) => {
            return !this.isPermissionPresent(group.groupName);
        }).map((group) => ({label: group.groupName, value: group.id}));
    };

    getPermissonLabel = (perm) => {
        switch (perm) {
        case "canRead":
            return 'Can Read'; // LocaleUtils.getMessageById(this.context.messages, "map.permissions.canView");
        case "canWrite":
            return 'Can Edit'; // LocaleUtils.getMessageById(this.context.messages, "map.permissions.canWrite");
        default:
            return perm;
        }
    };

    getAvailablePermissions = () => {
        return this.props.availablePermissions.map((perm) => ({value: perm, label: this.getPermissonLabel(perm)}));
    };

    renderPermissionRows = () => {
        if (this.localGroups.length === 0) {
            return <div className="ms-permission-row"><Message msgId="map.permissions.noRules" /></div>;
        }
        return this.localGroups.map((group, index) => {
            return (
                <div key={index} className="ms-permission-row">
                    <div className="ms-permission-title">{group.name || 'everybody'}</div>
                    <Select
                        ref={"permChoice" + index}
                        onChange={(sel) => {this.onChangePermission.call(this, index, sel.value ); }}
                        clearable={false}
                        options={this.getAvailablePermissions()}
                        value={group.permission}/>
                    <Button
                        key={"deleteButton" + index}
                        ref="deleteButton"
                        className="square-button-md no-border"
                        onClick={this.onChangePermission.bind(this, index, "delete")}><Glyphicon glyph="trash"/></Button>
                </div>
            );
        });
    };

    render() {
        // Hack to convert map permissions to a simpler format, TODO: remove this
        if (this.props.map && this.props.map.permissions && this.props.map.permissions.SecurityRuleList && this.props.map.permissions.SecurityRuleList.SecurityRule) {
            this.localGroups = this.props.map.permissions.SecurityRuleList.SecurityRule.map(function(rule) {
                if (rule && rule.group && rule.canRead) {
                    return {name: rule.group.groupName, permission: rule.canWrite ? "canWrite" : "canRead" };
                }
            }
            ).filter(rule => rule);  // filter out undefined values
        } else {
            this.localGroups = this.props.groups;
        }
        return (
            <div>
                <div><Message msgId="groups" /> <Message msgId="permissions" /></div>
                <div className="ms-permission-row ms-row-head">
                    <Select
                        noResultsText={LocaleUtils.getMessageById(this.context.messages, "map.permissions.noResult")}
                        ref="newGroup"
                        isLoading={!this.getSelectableGroups()}
                        clearable={false}
                        placeholder={LocaleUtils.getMessageById(this.context.messages, "map.permissions.selectGroup")}
                        options={this.getSelectableGroups()}
                        value={this.props.newGroup && this.props.newGroup.id}
                        onChange={this.onNewGroupChoose}/>
                    <Select
                        ref="newChoice"
                        clearable={false}
                        options={this.getAvailablePermissions()}
                        value={this.props.newPermission || _.head(this.props.availablePermissions)}
                        onChange={(sel) => {this.props.onNewPermissionChoose(sel && sel.value); }}/>
                    <Button
                        ref="buttonAdd"
                        disabled={!(this.props.newGroup && this.props.newGroup.id && this.props.newGroup.id.toString())}
                        className="square-button-md no-border"
                        onClick={this.onAddPermission} ><Glyphicon glyph="plus"/></Button>
                </div>
                {this.props.map && this.props.map.permissionLoading ?
                    <tr><td colSpan="3"><div><Spinner noFadeIn overrideSpinnerClassName="spinner" spinnerName="circle" /></div></td></tr>
                    : this.renderPermissionRows()}
            </div>
        );
    }

    isPermissionPresent = (group) => {
        return this.props.map && this.props.map.permissions && this.props.map.permissions.SecurityRuleList && this.props.map.permissions.SecurityRuleList.SecurityRule &&
            _.findIndex(this.props.map.permissions.SecurityRuleList.SecurityRule, (o) => o.group && o.group.groupName === group) >= 0;
    };
}

module.exports = PermissionEditor;
