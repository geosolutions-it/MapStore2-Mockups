/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PropTypes = require('prop-types');

const dragSource = require('react-dnd').DragSource;
const dropTarget = require('react-dnd').DropTarget;

const SideCard = require('../../MapStore2/web/client/components/misc/cardgrids/SideCard');

const cardSource = {
    beginDrag: function(props) {
        return {
            card: props.card
        };
    }
};

const cardTarget = {
    drop: function(props, monitor) {
        const card = monitor.getItem().card;
        if (card.idd !== props.card.idd) {
            props.onSort(props.card.idd, card);
        }
    }
};

const sourceCollect = function(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};

const targetCollect = function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
};

class Component extends React.Component {
    static propTypes = {
        card: PropTypes.object,
        selected: PropTypes.bool,
        isDraggable: PropTypes.bool,
        isOver: PropTypes.bool,
        isDragging: PropTypes.bool,
        onSort: PropTypes.func,
        onSelect: PropTypes.func,
        connectDragSource: PropTypes.func,
        connectDropTarget: PropTypes.func
    };

    static defaultProps = {
        card: {},
        selected: false,
        isDraggable: true,
        onSort: () => {},
        onSelect: () => {}
    };

    render() {
        const connectDragSource = this.props.connectDragSource;
        const connectDropTarget = this.props.connectDropTarget;

        const dragging = this.props.isDragging ? ' ms-dragging' : '';
        const over = this.props.isOver ? ' ms-over' : '';
        // const selected = this.props.line.selected ? ' ms-selected' : '';
        return this.props.isDraggable ? connectDragSource(connectDropTarget(
            <div>
                <SideCard {...this.props.card} draggable className={this.props.card.className + dragging + over} />
            </div>
    )) : (
            <div>
                <SideCard {...this.props.card} draggable={false} className={this.props.card.className + dragging + over} />
            </div>
        );
    }
}

const SideCardTarget = dropTarget('row', cardTarget, targetCollect)(Component);
const SideCardDraggable = dragSource('row', cardSource, sourceCollect)(SideCardTarget);

module.exports = SideCardDraggable;
