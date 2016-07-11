/* ES6 syntax */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

/****************************
 * Main Component for Row #1
 ****************************/
export class AdventureRow1 extends React.Component {
    render() {
        return (
            <div className="row tab2-statusRow">
                <CharLvlBlock />
                <CharHpBlock />
                <CharEnBlock />
            </div>
        );
    }
}
/****************************
 * Sub Components for Row #1
 ****************************/
export class CharLvlBlock extends React.Component {
    render() {
        return (
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 tab2-statusRow-left">
                <div>Lv.</div>
                <div>7</div>
                <div>+++++++++++++++++++++++++</div>
                <hr/>
            </div>
        );
    }
}
export class CharHpBlock extends React.Component {
    render() {
        return (
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 tab2-statusRow-general">
                <div>HP</div>
                <div>100</div>
                &nbsp;/&nbsp;
                <div>100</div>
                <div>+++++++++++++++++++++++++</div>
                <hr/>
            </div>
        );
    }
}
class CharEnBlock extends React.Component {
    render() {
        return (
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 tab2-statusRow-general">
                <div>EN</div>
                <div>100</div>
                &nbsp;/&nbsp;
                <div>100</div>
                <div>+++++++++++++++++++++++++</div>
                <hr/>
            </div>
        );
    }
}
