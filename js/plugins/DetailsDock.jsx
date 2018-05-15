/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {connect} = require('react-redux');
const Dock = require('react-dock').default;
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const {Button, Glyphicon} = require('react-bootstrap');
const {setOption} = require('../actions/mockups');

const mockupText = '<p><span style="color: rgb(34, 34, 34);">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui do</span><strong style="color: rgb(34, 34, 34);">lorem ipsum</strong><span style="color: rgb(34, 34, 34);">, quia&nbsp;</span><strong style="color: rgb(34, 34, 34);">dolor sit, amet, consectetur, adipisci</strong><span style="color: rgb(34, 34, 34);">&nbsp;v</span><strong style="color: rgb(34, 34, 34);">elit, sed</strong><span style="color: rgb(34, 34, 34);">&nbsp;quia non numquam&nbsp;</span><strong style="color: rgb(34, 34, 34);">eius mod</strong><span style="color: rgb(34, 34, 34);">i&nbsp;</span><strong style="color: rgb(34, 34, 34);">tempor</strong><span style="color: rgb(34, 34, 34);">a&nbsp;</span><strong style="color: rgb(34, 34, 34);">incidunt, ut labore et dolore magna</strong><span style="color: rgb(34, 34, 34);">m&nbsp;</span><strong style="color: rgb(34, 34, 34);">aliqua</strong><span style="color: rgb(34, 34, 34);">m quaerat voluptatem.&nbsp;</span><strong style="color: rgb(34, 34, 34);">Ut enim ad minim</strong><span style="color: rgb(34, 34, 34);">a&nbsp;</span><strong style="color: rgb(34, 34, 34);">veniam, quis nostru</strong><span style="color: rgb(34, 34, 34);">m&nbsp;</span><strong style="color: rgb(34, 34, 34);">exercitation</strong><span style="color: rgb(34, 34, 34);">em&nbsp;</span><strong style="color: rgb(34, 34, 34);">ullam co</strong><span style="color: rgb(34, 34, 34);">rporis suscipit&nbsp;</span><strong style="color: rgb(34, 34, 34);">labori</strong><span style="color: rgb(34, 34, 34);">o</span><strong style="color: rgb(34, 34, 34);">s</strong><span style="color: rgb(34, 34, 34);">am,&nbsp;</span><strong style="color: rgb(34, 34, 34);">nisi ut aliquid ex ea commodi consequat</strong><span style="color: rgb(34, 34, 34);">ur?&nbsp;</span><strong style="color: rgb(34, 34, 34);">Quis aute</strong><span style="color: rgb(34, 34, 34);">m vel eum&nbsp;</span><strong style="color: rgb(34, 34, 34);">iure reprehenderit,</strong><span style="color: rgb(34, 34, 34);">&nbsp;qui&nbsp;</span><strong style="color: rgb(34, 34, 34);">in</strong><span style="color: rgb(34, 34, 34);">&nbsp;ea&nbsp;</span><strong style="color: rgb(34, 34, 34);">voluptate velit esse</strong><span style="color: rgb(34, 34, 34);">, quam nihil molestiae&nbsp;</span><strong style="color: rgb(34, 34, 34);">c</strong><span style="color: rgb(34, 34, 34);">onsequatur, vel&nbsp;</span><strong style="color: rgb(34, 34, 34);">illum</strong><span style="color: rgb(34, 34, 34);">, qui&nbsp;</span><strong style="color: rgb(34, 34, 34);">dolore</strong><span style="color: rgb(34, 34, 34);">m&nbsp;</span><strong style="color: rgb(34, 34, 34);">eu</strong><span style="color: rgb(34, 34, 34);">m&nbsp;</span><strong style="color: rgb(34, 34, 34);">fugiat</strong><span style="color: rgb(34, 34, 34);">, quo voluptas&nbsp;</span><strong style="color: rgb(34, 34, 34);">nulla pariatur</strong><span style="color: rgb(34, 34, 34);">? [33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias&nbsp;</span><strong style="color: rgb(34, 34, 34);">exceptur</strong><span style="color: rgb(34, 34, 34);">i&nbsp;</span><strong style="color: rgb(34, 34, 34);">sint, obcaecat</strong><span style="color: rgb(34, 34, 34);">i&nbsp;</span><strong style="color: rgb(34, 34, 34);">cupiditat</strong><span style="color: rgb(34, 34, 34);">e&nbsp;</span><strong style="color: rgb(34, 34, 34);">non pro</strong><span style="color: rgb(34, 34, 34);">v</span><strong style="color: rgb(34, 34, 34);">ident</strong><span style="color: rgb(34, 34, 34);">, similique&nbsp;</span><strong style="color: rgb(34, 34, 34);">sunt in culpa</strong><span style="color: rgb(34, 34, 34);">,&nbsp;</span><strong style="color: rgb(34, 34, 34);">qui officia deserunt mollit</strong><span style="color: rgb(34, 34, 34);">ia&nbsp;</span><strong style="color: rgb(34, 34, 34);">anim</strong><span style="color: rgb(34, 34, 34);">i,&nbsp;</span><strong style="color: rgb(34, 34, 34);">id est laborum</strong><span style="color: rgb(34, 34, 34);">&nbsp;et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat</span>';

class DetailsDock extends React.Component {
    static propTypes = {
        open: PropTypes.bool,
        width: PropTypes.number,
        onClose: PropTypes.func
    };

    static defaultProps = {
        open: false,
        width: 658,
        onClose: () => {}
    };

    renderHeader() {
        return (
            <div className="ms-dock-panel-head">
                <Button className="square-button pull-left no-border" bsStyle="primary"><Glyphicon glyph="sheet"/><span className="ms-title">Details Sheet</span></Button>
                <Button className="square-button pull-right no-border" bsStyle="primary" onClick={() => { this.props.onClose('detailsPanel', false); }}><Glyphicon glyph="1-close"/></Button>
            </div>
        );
    }

    render() {
        const dockProps = {
            dimMode: "none",
            size: 0.30,
            fluid: false,
            position: "right",
            zIndex: 1030
        };
        return (
            <Dock dockStyle={{height: 'calc(100% - 30px)'}} {...dockProps} isVisible={this.props.open} size={658} >
                <BorderLayout
                    header={this.renderHeader()}>
                    <div className="ms-detail-body">
                        <div dangerouslySetInnerHTML={{__html: mockupText}} />
                    </div>
                </BorderLayout>
            </Dock>
        );
    }

}

const DetailsDockPlugin = connect((state) => ({
    open: state.mockups && state.mockups.detailsPanel
}), {
    onClose: setOption
})(DetailsDock);

module.exports = {
    DetailsDockPlugin,
    reducers: {
        mockups: require('../reducers/mockups')
    }
};
