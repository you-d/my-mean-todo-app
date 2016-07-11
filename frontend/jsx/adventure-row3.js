/* ES6 syntax */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { ItemContextualMenu } from './adventure-reusable';

/****************************
 * Main Component for Row #3
 ****************************/
export class AdventureRow3 extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handlePutItemIntoPocket = this.handlePutItemIntoPocket.bind(this);
        this.handleUpdateBackpackInfo = this.handleUpdateBackpackInfo.bind(this);

        this.state = { backpackInfo : {} };
    }
    componentWillMount() {
        this.setState({ backpackInfo: { maxCapa : 0,
                                        currentCapa : 0,
                                        maxWeight : 0,
                                        currentWeight : 0 }
                      });
    }
    componentWillReceiveProps(nextProps) {
        // NOTE : frmPocketTransferredItemWeight is reset in the render function of
        // Adventure class
        if(nextProps.frmPocketTransferredItemWeight != undefined) {
          this.handleUpdateBackpackInfo(this.state.backpackInfo.maxCapa,
                                        this.state.backpackInfo.currentCapa + 1,
                                        this.state.backpackInfo.maxWeight,
                                        this.state.backpackInfo.currentWeight + nextProps.frmPocketTransferredItemWeight
                                       );
        }
    }
    handlePutItemIntoPocket(item) {
        // Pass the info about the transferred item to AdventureRow3 through
        // Adventure bridging function
        this.props.onPassingDataToAdventure({ "signature" : "putItemIntoPocket",
                                              "item" : item });
        // NOTE updating the backpack info will not be done in here
    }
    handleUpdateBackpackInfo(maxCapa, currentCapa, maxWeight, currentWeight) {
        this.setState({ backpackInfo: { maxCapa : maxCapa,
                                        currentCapa : currentCapa,
                                        maxWeight : maxWeight,
                                        currentWeight : currentWeight }
                      });
    }
    render() {
        let backpackMarkup = <div ref="backpackPanel" className="row">
                                <BackpackPanelBlock backpackInventoryArray={ this.props.backpackInventoryArray }
                                                    itemContextualMenuDirective={ this.props.itemContextualMenuDirective }
                                                    onPutItemIntoPocket={ this.handlePutItemIntoPocket }
                                                    backpackInfo={ this.state.backpackInfo }
                                                    onUpdatingBackpackInfo={ this.handleUpdateBackpackInfo } />
                                <BackpackPanelAuxBlock backpackInfo={ this.state.backpackInfo } />
                             </div>;
        let missionsMarkup = <div ref="missionsPanel" className="row mainGameControlPanelWrapper">
                                <MissionsPanelBlock />
                             </div>;
        let storeMarkup = <div ref="missionsPanel" className="row mainGameControlPanelWrapper">
                              <StorePanelBlock />
                          </div>;
        let debugMarkup = <div ref="missionsPanel" className="row mainGameControlPanelWrapper">
                              <DebugPanelBlock />
                          </div>;

        switch(this.props.onPanelNavBtnPressed.buttonId) {
            case "backpack" :
                return (backpackMarkup);
                break;
            case "missions" :
                return (missionsMarkup);
                break;
            case "store" :
                return (storeMarkup);
                break;
            case "debug" :
                return (debugMarkup);
                break;
            default :
                return (<div></div>);
        }
    }
}

/****************************
 * Sub Components for Row #3
 ****************************/
export class MissionsPanelBlock extends React.Component {
     constructor(props, context) {
         super(props, context);

         this.test = "";
     }
     componentDidMount() {
         //$("#test").html("abc");
         //$(ReactDOM.findDOMNode(this)).html("aloha");
         ReactDOM.findDOMNode(this.refs.testRef).innerHTML = "Under Construction";
     }
     render() {
         return (
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainGameControlPanel">
                 <div>Missions</div>
                 <hr/>
                 <div id="test" ref="testRef">{ this.test }</div>
             </div>
         );
     }
}
export class StorePanelBlock extends React.Component {
     constructor(props, context) {
         super(props, context);

         this.test = "";
     }
     componentDidMount() {
         //$("#test").html("abc");
         //$(ReactDOM.findDOMNode(this)).html("aloha");
         ReactDOM.findDOMNode(this.refs.testRef).innerHTML = "Under Construction";
     }
     render() {
         return (
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainGameControlPanel">
                 <div>Store</div>
                 <hr/>
                 <div id="test" ref="testRef">{ this.test }</div>
             </div>
         );
     }
}
export class BackpackPanelBlock extends React.Component {
   constructor(props, context) {
       super(props, context);

       this.itemSelected = this.itemSelected.bind(this);
       this.handleContextualMenuButtonClicked = this.handleContextualMenuButtonClicked.bind(this);

       this.state = { itemContextualMenuDirective : {},
                      backpackInventoryArray : [] };
   }
   componentWillMount() {
       // from save game record
       this.setState({ backpackInventoryArray: this.props.backpackInventoryArray });

       // initial state of backpackInfo
       let localBackpackInfo = { maxCapa: 36, currentCapa: 36, maxWeight: 36, currentWeight: 36 };
       this.props.backpackInventoryArray.map(function(aMember) {
           if(aMember.className === "gameitem_slot_notavail") {
               localBackpackInfo.maxCapa -= 1;
               localBackpackInfo.currentCapa -= 1;
               localBackpackInfo.maxWeight -= 1;
               localBackpackInfo.currentWeight -= 1;
           }
           if(aMember.className === "gameitem_slot_empty_backpack") {
               localBackpackInfo.currentCapa -= 1;
               localBackpackInfo.currentWeight -= 1;
           }
       });
       this.props.onUpdatingBackpackInfo(localBackpackInfo.maxCapa,
                                         localBackpackInfo.currentCapa,
                                         localBackpackInfo.maxWeight,
                                         localBackpackInfo.currentWeight);
   }
   componentWillReceiveProps(nextProps) {
       // possible state update #1 - from the parent component
       if (nextProps.itemContextualMenuDirective != undefined) {
           // The nextProps.itemContextualMenuDirective is received from the AdventureBlock2
           // component.
           if (nextProps.itemContextualMenuDirective.whichComponent === "backpack" ||
               nextProps.itemContextualMenuDirective.whichComponent == "") {
             this.setState({ itemContextualMenuDirective : nextProps.itemContextualMenuDirective });
           }
       }
       if (nextProps.backpackInventoryArray != undefined) {
           // Its received from the PanelBlock as an item is being put into the backpack
           this.setState({ backpackInventoryArray: nextProps.backpackInventoryArray });
       }
   }
   itemSelected(arrIdx, className, itemName) {
       // posssible state update #2 - triggered by onClick event handler in this component.
       let newContextualMenuDirective = { displayStatus: "show",
                                          whichComponent: "backpack",
                                          itemNum: arrIdx + 1,
                                          itemName: itemName,
                                          itemClassName: className };

       this.setState({ itemContextualMenuDirective : newContextualMenuDirective });
   }
   handleContextualMenuButtonClicked(item) {
       if(item.owner === "backpack") {
           let updatedBackpackInventoryArray = null;

           // update the BackpackPanelAuxBlock
           this.props.onUpdatingBackpackInfo(this.props.backpackInfo.maxCapa,
                                             this.props.backpackInfo.currentCapa -= 1,
                                             this.props.backpackInfo.maxWeight,
                                             this.props.backpackInfo.currentWeight -= 1);

           switch(item.directive) {
               case "use":
                 // update the backpackInventoryArray state
                 updatedBackpackInventoryArray = this.state.backpackInventoryArray;
                 updatedBackpackInventoryArray[item.itemNum - 1].name = "";
                 updatedBackpackInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_pocket";
                 this.setState({ backpackInventoryArray: updatedBackpackInventoryArray });
                 // TODO update the mainGame character
                 // TODO inform the Adventure about the update to update the save game

                 break;
               case "putIntoPocket":
                 // update the backpackInventoryArray state
                 this.props.onPutItemIntoPocket({name: item.itemName, className:item.itemClassName });

                 // update the backpackInventoryArray state
                 updatedBackpackInventoryArray = this.state.backpackInventoryArray;
                 updatedBackpackInventoryArray[item.itemNum - 1].name = "";
                 updatedBackpackInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_backpack";
                 this.setState({ backpackInventoryArray: updatedBackpackInventoryArray });

                 break;
               case "discard":
                 // update the backpackInventoryArray state
                 updatedBackpackInventoryArray = this.state.backpackInventoryArray;
                 updatedBackpackInventoryArray[item.itemNum - 1].name = "";
                 updatedBackpackInventoryArray[item.itemNum - 1].className = "gameitem_slot_empty_backpack";
                 this.setState({ backpackInventoryArray: updatedBackpackInventoryArray });

                 break;
           }
       }
   }
   render() {
       let itemSelected = this.itemSelected;
       let aMemberProps = {};
       let aMemberWrapperProps = {};

       return (
           <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mainGameControlPanelWrapper-2cols">
               <div className="mainGameControlPanel-2cols">
                   <div>Backpack</div>
                   <hr/>
                   <div clasName="row">
                       { this.state.backpackInventoryArray.map(function(aMember, arrIdx) {
                             aMemberProps = {};
                             aMemberProps.key = arrIdx;
                             aMemberProps.className = aMember.className;
                             aMemberProps.onClick = "";

                             aMemberWrapperProps = {};
                             aMemberWrapperProps.className = "col-lg-1 col-md-1 col-sm-1 col-xs-2 shared_gameitem_attributes_backpack";
                             aMemberWrapperProps.key = arrIdx;

                             if (aMember.className === "gameitem_slot_notavail") {
                                 // this element will not have the onClick attribute
                                 return (
                                   <div {...aMemberWrapperProps}>
                                      <div {...aMemberProps}>X</div>
                                   </div>
                                 );
                             } else if (aMember.className === "gameitem_slot_empty_backpack") {
                                 // this element will not have the onClick attribute
                                 return (
                                   <div {...aMemberWrapperProps}>
                                       <div {...aMemberProps}></div>
                                   </div>
                                 );
                             } else {
                                 // assign an id for each occupied slot, which is needed by the
                                 // click event listener in contextual menu class
                                 aMemberProps.id = "gameItem-backpack-" + arrIdx;
                                 // this element will have the onClick attribute
                                 aMemberProps.onClick = () => { itemSelected(arrIdx, aMember.className, aMember.name) };
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
export class BackpackPanelAuxBlock extends React.Component {
   constructor(props, context) {
       super(props, context);

       this.weightUnit = "kg";
   }
   render() {
       return (
           <div className="col-lg-4 col-md-4 cold-sm-12 col-xs-12 mainGameControlPanelWrapper-2cols-col2">
               <div className="mainGameControlPanel-2cols-col2">
                   <hr/>
                   <div className="row">
                       <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6">
                           <span>Capacity :</span>&nbsp;
                           { this.props.backpackInfo.currentCapa }
                           &nbsp;<span>/</span>&nbsp;
                           { this.props.backpackInfo.maxCapa }
                       </div>
                       <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6">
                           <span>Weight :</span>&nbsp;
                           { this.props.backpackInfo.currentWeight }{ this.weightUnit }
                           &nbsp;<span>/</span>&nbsp;
                           { this.props.backpackInfo.maxWeight }{ this.weightUnit }
                       </div>
                   </div>
               </div>
           </div>
       );
   }
}
export class DebugPanelBlock extends React.Component {
     constructor(props, context) {
         super(props, context);

         this.test = "";
     }
     componentDidMount() {
         //$("#test").html("abc");
         //$(ReactDOM.findDOMNode(this)).html("aloha");
         ReactDOM.findDOMNode(this.refs.testRef).innerHTML = "Under Construction";
     }
     render() {
         return (
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainGameControlPanel">
                 <div>Debug</div>
                 <hr/>
                 <div id="test" ref="testRef">{ this.test }</div>
             </div>
         );
     }
 }
