/*
 * Copyright 2017, Stefano Bovio @allyoucanmap.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const SideCardDraggable = require('./SideCardDraggable');

const dragDropContext = require('react-dnd').DragDropContext;
const html5Backend = require('react-dnd-html5-backend');

class SideCardListDraggable extends React.Component {
    static propTypes = {
        cards: PropTypes.array,
        onSort: PropTypes.func,
        onSelect: PropTypes.func,
        isDraggable: PropTypes.bool
    };

    static defaultProps = {
        cards: [],
        onSort: () => {},
        onSelect: () => {},
        isDraggable: true
    };

    render() {
        return (
            <span>
                {this.props.cards.map((card, idd) => {
                    return (
                        <SideCardDraggable
                            onSort={this.props.onSort}
                            card={{...card, idd}}
                            key={idd}
                            sortData={idd}
                            isDraggable={this.props.isDraggable}
                            onSelect={this.props.onSelect}/>
                    );
                })}
            </span>
        );
    }
}

module.exports = dragDropContext(html5Backend)(SideCardListDraggable);
