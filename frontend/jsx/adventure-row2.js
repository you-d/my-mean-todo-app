/* ES6 syntax */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { ItemContextualMenu } from './adventure-reusable';

/****************************
 * Main Component for Row #2
 ****************************/
export class AdventureRow2 extends React.Component {
     constructor(props, context) {
         super(props, context);

         this.handleBottomPanelNavButtonPressed = this.handleBottomPanelNavButtonPressed.bind(this);
         this.handlePutItemBackToBackpack = this.handlePutItemBackToBackpack.bind(this);
     }
     handleBottomPanelNavButtonPressed(buttonId) {
         // Pass the id to AdventureRow3 through Adventure bridging function
         this.props.onPassingDataToAdventure({ "signature" : "navButtonClicked",
                                               "buttonId" : buttonId });
     }
     handlePutItemBackToBackpack(item) {
         // Pass the info about the transferred item to AdventureRow3 through
         // Adventure bridging function
         this.props.onPassingDataToAdventure({ "signature" : "putItemBackToBackpack",
                                               "item" : item });
     }
     render() {
         return (
             <div className="row">
                 <MainGameCanvasBlock />
                 <ActionPointBlock />
                 <CharStatusBlock />
                 <ActiveMissionsBlock displayMode={'normal'} />
                 <PocketBlock pocketInventoryArray={ this.props.pocketInventoryArray }
                              itemContextualMenuDirective={ this.props.itemContextualMenuDirective }
                              onPutItemBackToBackpack={ this.handlePutItemBackToBackpack } />
                 <ActiveMissionsBlock displayMode={'xs'} />
                 <BottomPanelNavButtonsBlock onButtonPressed={ this.handleBottomPanelNavButtonPressed } />
             </div>
         );
     }
 }

 /****************************
  * Sub Components for Row #2
  ****************************/
export class MainGameCanvasBlock extends React.Component {
  render() {
      return (
          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <canvas id="mainGameCanvas" width="321" height="224">
                <p>Your browser does not support the required functionality to play this game.</p>
                <p>Please update to a modern browser such as <a href="www.google.com/chrome/‎">Google Chrome</a> to play.</p>
              </canvas>
          </div>
      );
  }
}
export class ActionPointBlock extends React.Component {
  render() {
      return (
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 tab2-gameCanvasRow-col2">
              <div>
                  <div>Action Points</div>
                  <hr/>
                  <div>
                      <span>2573</span>&nbsp;&nbsp;<span>Pts</span>
                  </div>
              </div>
          </div>
      );
  }
}
export class CharStatusBlock extends React.Component {
  render() {
      return (
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 tab2-gameCanvasRow-col2-row2">
              <div>
                  <div>
                      <div>Fatique</div>
                      <div>|</div>
                      <div>++++++++++++++++++++++++++++++</div>
                      <hr/>
                  </div>
                  <div>
                      <div>Battery</div>
                      <div>|</div>
                      <div>++++++++++++++++++++++++++++++</div>
                      <hr/>
                  </div>
                  <div>
                      <div>Money</div>
                      <div>|&nbsp;</div>
                      <div>105348</div>
                      <hr/>
                  </div>
                  <div>
                      <div>Status</div>
                      <div>|&nbsp;</div>
                      <div>Fine</div>
                  </div>
              </div>
          </div>
      );
  }
}
export class ActiveMissionsBlock extends React.Component {
  constructor(props, context) {
      super(props, context);

      const defaultClassName = "col-lg-4 col-md-4 col-sm-6 col-xs-12";
      this.className = defaultClassName + " tab2-gameCanvasRow-col2-row3";
      if(this.props.displayMode == "xs") {
          this.className = defaultClassName + " tab2-gameCanvasRow-col2-row3-xs";
      }
  }
  render() {
      return (
          <div id="ActiveMissionsPanel" className={ this.className }>
             <div>
                <div>Active Missions</div>
                <hr/>
                <div>
                    <div><span>[+]</span>&nbsp;<span>Find item A</span></div>
                    <div><span>[+]</span>&nbsp;<span>Find heart shaped key</span></div>
                    <div><span>[+]</span>&nbsp;<span>Check Supermarket</span></div>
                    <div><span>[+]</span>&nbsp;<span>Hunt monster x</span></div>
                </div>
             </div>
          </div>
      );
  }
}
export class PocketBlock extends React.Component {
  constructor(props, context) {
      super(props, context);

      this.itemSelected = this.itemSelected.bind(this);
      this.handleContextualMenuButtonClicked = this.handleContextualMenuButtonClicked.bind(this);

      this.state = { itemContextualMenuDirective : {},
                     pocketInventoryArray: [] };
  }
  componentWillMount() {
      // from save game record
      this.setState({ pocketInventoryArray: this.props.pocketInventoryArray });
  }
  componentWillReceiveProps(nextProps) {
      // possible state update #1 - from the parent component
      if (nextProps.itemContextualMenuDirective != undefined) {
          // The nextProps.itemContextualMenuDirective is received from the AdventureBlock2
          // component - that is initially declared in the Adventure component.
          if (nextProps.itemContextualMenuDirective.whichComponent === "pockets" ||
              nextProps.itemContextualMenuDirective.whichComponent == "") {
            this.setState({ itemContextualMenuDirective : nextProps.itemContextualMenuDirective });
          }
      }
      if (nextProps.pocketInventoryArray != undefined) {
          // From the BackpackPanelBlock, through the Adventure class - to put an item into backpack
          this.setState({ pocketInventoryArray: nextProps.pocketInventoryArray });
      }
  }
  itemSelected(arrIdx, className, itemName) {
      // posssible state update #2 - triggered by onClick event handler in this component.
      let newContextualMenuDirective = { displayStatus: "show",
                                         whichComponent: "pockets",
                                         itemNum: arrIdx + 1,
                                         itemName: itemName,
                                         itemClassName: className };

      this.setState({ itemContextualMenuDirective : newContextualMenuDirective });
  }
  handleContextualMenuButtonClicked(item) {
      if(item.owner === "pockets") {
          let updatedPocketInventoryArray = null;
          switch(item.directive) {
              case "use":
                // update the pocketInventoryArray state
                updatedPocketInventoryArray = this.state.pocketInventoryArray;
                updatedPocketInventoryArray[item.itemNum - 1].name = "";
                updatedPocketInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_pocket";
                this.setState({ pocketInventoryArray: updatedPocketInventoryArray });
                // TODO : update the mainGame character

                // TODO : inform the Adventure about the update to update the save game

                break;
              case "putIntoBackpack":
                // update the backpackInventoryArray state
                this.props.onPutItemBackToBackpack({name: item.itemName, className:item.itemClassName });

                // update the pocketInventoryArray state
                updatedPocketInventoryArray = this.state.pocketInventoryArray;
                updatedPocketInventoryArray[item.itemNum - 1].name = "";
                updatedPocketInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_pocket";
                this.setState({ pocketInventoryArray: updatedPocketInventoryArray });

                break;
              case "discard":
                // update the pocketInventoryArray state
                updatedPocketInventoryArray = this.state.pocketInventoryArray;
                updatedPocketInventoryArray[item.itemNum - 1].name = "";
                updatedPocketInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_pocket";
                this.setState({ pocketInventoryArray: updatedPocketInventoryArray });
                // TODO : inform the Adventure about the update to update the save game

                break;
          }
      }
  }
  render() {
      let itemSelected = this.itemSelected;
      let aMemberProps = {};
      let aMemberWrapperProps = {};

      return (
        <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12 tab2-equPockets-wrapper">
            <div className="tab2-equPockets">
                <div>Pockets</div>
                <hr/>
                <div className="row">
                    { this.state.pocketInventoryArray.map(function(aMember, arrIdx) {
                          aMemberProps = {};
                          aMemberProps.key = arrIdx;
                          aMemberProps.className = aMember.className;
                          aMemberProps.onClick = "";

                          aMemberWrapperProps = {};
                          aMemberWrapperProps.key = arrIdx;
                          aMemberWrapperProps.className = "col-lg-1 col-md-1 col-sm-2 col-xs-2";

                          if (aMember.className === "gameitem_slot_notavail") {
                              // this element will not have the onClick attribute
                              return (
                                <div {...aMemberWrapperProps}>
                                    <div {...aMemberProps}>x</div>
                                </div>
                              );
                          } else if (aMember.className === "gameitem_slot_empty_pocket") {
                              // this element will not have the onClick attribute
                              return (
                                <div {...aMemberWrapperProps}>
                                    <div {...aMemberProps}>+</div>
                                </div>
                              );
                          } else {
                              // assign an id for each occupied slot, which is needed by the
                              // click event listener in contextual menu class
                              aMemberProps.id = "gameItem-pockets-" + arrIdx;
                              // this element will have the onClick attribute
                              aMemberProps.onClick = ()=> { itemSelected(arrIdx, aMember.className, aMember.name); };
                              return (
                                <div {...aMemberWrapperProps}>
                                    <div {...aMemberProps}></div>
                                </div>
                              );
                          }
                      })
                    }
                </div>
            </div>
            <ItemContextualMenu itemContextualMenuDirective={ this.state.itemContextualMenuDirective }
                                contextualMenuButtonClicked={ this.handleContextualMenuButtonClicked } />
        </div>
      );
  }
}
export class BottomPanelNavButtonsBlock extends React.Component {
  constructor(props, context) {
      super(props, context);

      this.toggleDisplayMissionsPanel = this.toggleDisplayMissionsPanel.bind(this);
      this.toggleDisplayBackpackPanel = this.toggleDisplayBackpackPanel.bind(this);
      this.toggleDisplayStorePanel = this.toggleDisplayStorePanel.bind(this);
      this.toggleDisplayDebugPanel = this.toggleDisplayDebugPanel.bind(this);
  }
  toggleDisplayMissionsPanel() {
      this.props.onButtonPressed("missions");

  }
  toggleDisplayBackpackPanel() {
      this.props.onButtonPressed("backpack");

  }
  toggleDisplayStorePanel() {
      this.props.onButtonPressed("store");

  }
  toggleDisplayDebugPanel() {
      this.props.onButtonPressed("debug");

  }
  render() {
      let toggleDisplayBackpackPanel = this.toggleDisplayBackpackPanel;
      let toggleDisplayMissionsPanel = this.toggleDisplayMissionsPanel;
      let toggleDisplayStorePanel = this.toggleDisplayStorePanel;
      let toggleDisplayDebugPanel = this.toggleDisplayDebugPanel;
      return (
        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 tab2-bottomright-box">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-3 col-xs-6" onClick={toggleDisplayMissionsPanel}>[Missions]</div>
                <div className="col-lg-6 col-md-6 col-sm-3 col-xs-6" onClick={toggleDisplayBackpackPanel}>[Backpack]</div>
                <div className="col-lg-6 col-md-6 col-sm-3 col-xs-6" onClick={toggleDisplayStorePanel}>[Store]</div>
                <div className="col-lg-6 col-md-6 col-sm-3 col-xs-6" onClick={toggleDisplayDebugPanel}>[Debug]</div>
            </div>
        </div>
      );
  }
}
