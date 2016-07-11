/* ES6 syntax */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { AdventureRow1, CharLvlBlock, CharHpBlock, CharEnBlock } from './adventure-row1';
import { AdventureRow2, MainGameCanvasBlock, ActionPointBlock, CharStatusBlock,
         ActiveMissionsBlock, PocketBlock, BottomPanelNavButtonsBlock } from './adventure-row2';
import { AdventureRow3, MissionsPanelBlock, StorePanelBlock, BackpackPanelBlock,
         BackpackPanelAuxBlock, DebugPanelBlock } from './adventure-row3';

/****************************
 * Root component
 ****************************/
class Adventure extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handlePassedDataFromRow2 = this.handlePassedDataFromRow2.bind(this);
        this.handlePassedDataFromRow3 = this.handlePassedDataFromRow3.bind(this);

        // NOTE : I don't think I need the itemContextualMenuDirective state
        // as the contextual menu itself already has a state .

        this.state = { row2PanelNavBtnPressed : "",
                       pocketInventoryArray : [],
                       backpackInventoryArray : [],
                       itemContextualMenuDirective : {}
                     };
        this.toBpackTransferredItemWeight = 0;
    }
    componentWillMount() {
        /* NOTE : I DONT THINK WE NEED TO DECLARE THE itemContextualMenuDirective STATE
         * IN THIS COMPONENT TODO - Assess this
         * possible values for this.state.itemContextualMenuDirective members :
         * displayStatus => "show", "hidden" (default -> hidden)
         * whichComponent => "" (if hidden), "pockets", "backpack"
         * itemNum => "" (if hidden), pocket : 1-12, backpack : 1-36
         */
        this.setState({ pocketInventoryArray : this.props.pocketInventoryArray,
                        backpackInventoryArray : this.props.backpackInventoryArray,
                        itemContextualMenuDirective : { displayStatus: "hide",
                                                        whichComponent: "",
                                                        itemNum: "",
                                                        itemName: "",
                                                        itemClassName: ""
                                                      }
                     });
    }
    handlePassedDataFromRow2(data) {
        switch(data.signature) {
            case "navButtonClicked" :
              // to be passed to AdventureRow3 : data.signature & data.buttonId
              this.setState({ row2PanelNavBtnPressed : data });

              // When users click on any of bottom nav buttons, the active contextual menu needs to be hidden.
              let newContextualMenuDirective = { displayStatus: "hide", whichComponent: "", itemNum: "", itemName: "",
                                                 itemClassName: "" };

              // The itemContextualMenuDirective state will be passed down to both Contextual Menu
              // components in PocketBlock & BackpackPanelBlock components. In the componentWillReceiveProps(nextProps)
              // method of each child component, there is a conditional if that will check the "whichComponent" state
              // member to determine whether this passed down directive is meant to be directed to any of them.
              // If the value of "whichComponent" state member is empty, then this directive is applicable for
              // ALL contextual menu components.
              this.setState({ itemContextualMenuDirective : newContextualMenuDirective });

              break;
            case "putItemBackToBackpack" :
              // get the current state of backpackInventoryArray
              let currentBackpackInventoryArray = this.state.backpackInventoryArray;
              // find the 1st slot that's empty & availables
              for(let i=0; i<currentBackpackInventoryArray.length; i++) {
                    if (currentBackpackInventoryArray[i].className === "gameitem_slot_empty_backpack") {
                        // got it, lets update this member
                        currentBackpackInventoryArray[i].className = data.item.className;
                        currentBackpackInventoryArray[i].name = data.item.name;

                        this.toBpackTransferredItemWeight = 1;

                        break;
                    }
              }
              // Update this.state.backpackInventoryArray
              this.setState({ backpackInventoryArray : currentBackpackInventoryArray });

              break;
        } // end switch statement
    }
    handlePassedDataFromRow3(data) {
        switch(data.signature) {
            case "putItemIntoPocket" :
              // get the current state of pocketInventoryArray
              let currentPocketInventoryArray = this.state.pocketInventoryArray;
              // find the 1st slot that's empty & availables
              for(let i=0; i<currentPocketInventoryArray.length; i++) {
                  if (currentPocketInventoryArray[i].className === "gameitem_slot_empty_pocket") {
                      // got it, lets update this member
                      currentPocketInventoryArray[i].className = data.item.className;
                      currentPocketInventoryArray[i].name = data.item.name;

                      break;
                  }
              }
              // Update this.state.pocketInventoryArray
              this.setState({ pocketInventoryArray : currentPocketInventoryArray });

              break;
        } // end switch statement
    }
    render() {
        //let _this = this;
        //setTimeout(function() { _this.updateBackpackInfo(); }, 10000);

        return (
          <div>
            <AdventureRow1 />
            <AdventureRow2 onPassingDataToAdventure={ this.handlePassedDataFromRow2 }
                           pocketInventoryArray={ this.props.pocketInventoryArray }
                           itemContextualMenuDirective={ this.state.itemContextualMenuDirective } />
             { (() => {
                  if(this.toBpackTransferredItemWeight > 0) {
                    let finalDestWeight = this.toBpackTransferredItemWeight
                    this.toBpackTransferredItemWeight = 0;
                    return (
                      <AdventureRow3 onPanelNavBtnPressed={ this.state.row2PanelNavBtnPressed }
                                     onPassingDataToAdventure={ this.handlePassedDataFromRow3 }
                                     backpackInventoryArray={ this.state.backpackInventoryArray }
                                     itemContextualMenuDirective={ this.state.itemContextualMenuDirective }
                                     frmPocketTransferredItemWeight={ finalDestWeight } />
                    );
                  } else {
                    return(
                      <AdventureRow3 onPanelNavBtnPressed={ this.state.row2PanelNavBtnPressed }
                                     onPassingDataToAdventure={ this.handlePassedDataFromRow3 }
                                     backpackInventoryArray={ this.state.backpackInventoryArray }
                                     itemContextualMenuDirective={ this.state.itemContextualMenuDirective } />
                    );
                  }
               })()
             }
          </div>
        );
    }
}

let pocketInventoryArray = [ {className : "gameitem_firstaidkit", name : "first aid kit", qty : 0},
                             {className : "gameitem_slot_empty_pocket", name : "", qty : 1},
                             {className : "gameitem_h_icon", name : "h icon", qty : 2},
                             {className : "gameitem_yellow_beacon", name : "yellow beacon", qty : 3},
                             {className : "gameitem_firstaidkit", name : "first aid kit", qty : 4},
                             {className : "gameitem_ampoule", name : "ampoule", qty : 5},
                             {className : "gameitem_smallbattery", name : "small battery", qty : 6},
                             {className : "gameitem_slot_empty_pocket", name : "", qty : 7},
                             {className : "gameitem_slot_empty_pocket", name : "", qty : 8},
                             {className : "gameitem_slot_notavail", name : "", qty : 9},
                             {className : "gameitem_slot_notavail", name : "", qty : 10},
                             {className : "gameitem_slot_notavail", name : "", qty : 11}
                          ];
let backpackInventoryArray = [ {className : "gameitem_firstaidkit", name : "first aid kit", qty : 0},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 1},
                               {className : "gameitem_h_icon", name : "h icon", qty : 2},
                               {className : "gameitem_gasoline", name : "gasoline", qty : 3},
                               {className : "gameitem_yellow_beacon", name : "yellow beacon", qty : 4},
                               {className : "gameitem_firstaidkit", name : "first aid kit", qty : 5},
                               {className : "gameitem_battery", name : "battery", qty : 6},
                               {className : "gameitem_smallbattery", name : "small battery", qty : 7},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 8},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 9},
                               {className : "gameitem_battery", name : "battery", qty : 10},
                               {className : "gameitem_gasoline", name : "gasoline", qty : 11},
                               {className : "gameitem_canned_food", name : "canned food", qty : 12},
                               {className : "gameitem_fruits", name : "fruits", qty : 13},
                               {className : "gameitem_key", name : "key", qty : 14},
                               {className : "gameitem_ampoule", name : "ampoule", qty : 15},
                               {className : "gameitem_supplycrate", name : "supply crate", qty : 16},
                               {className : "gameitem_slot_empty_backpack", name : "", name : "", qty : 17},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 18},
                               {className : "gameitem_ammocrate", name : "ammo crate", qty : 19},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 20},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 21},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 22},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 23},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 24},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 25},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 26},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 27},
                               {className : "gameitem_gasoline", name : "gasoline", qty : 28},
                               {className : "gameitem_slot_empty_backpack", name : "", qty : 29},
                               {className : "gameitem_slot_notavail", name : "", qty : 30},
                               {className : "gameitem_slot_notavail", name : "", qty : 31},
                               {className : "gameitem_slot_notavail", name : "", qty : 32},
                               {className : "gameitem_slot_notavail", name : "", qty : 33},
                               {className : "gameitem_slot_notavail", name : "", qty : 34},
                               {className : "gameitem_slot_notavail", name : "", qty : 35}
                             ];

ReactDOM.render(<Adventure pocketInventoryArray={ pocketInventoryArray }
                           backpackInventoryArray={ backpackInventoryArray } />,
                document.getElementById('adventurePanel'));
