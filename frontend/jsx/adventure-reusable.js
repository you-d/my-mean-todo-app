/* ES6 syntax */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

/****************************
 * Reusable Components
 ****************************/
export class ItemContextualMenu extends React.Component {
   constructor(props, context) {
      super(props, context);

      this.defaultClassName = "itemContextualMenuPane ";
      this.hideMenuClassName = "itemContextualMenuPane-hide ";
      this.showPocketsMenuClassNamePrefix = "itemContextualMenuPane-pockets-item-";
      this.showBackpackMenuClassNamePrefix = "itemContextualMenuPane-backpack-item-";
      this.showMenuClassNameSuffix = "-pos ";

      this.useItemButtonPressed = this.useItemButtonPressed.bind(this);
      this.putBackItemButtonPressed = this.putBackItemButtonPressed.bind(this);
      this.putIntoPocketButtonPressed = this.putIntoPocketButtonPressed.bind(this);
      this.discardItemButtonPressed = this.discardItemButtonPressed.bind(this);
      this.hideThisContextualMenu = this.hideThisContextualMenu.bind(this);

      this.state = { finalClassName : "", owner : {} };
   }
   componentWillMount() {
      // initial state - hidden
      // Remember, componentWillReceiveProps is only called when its not an initial rendering.
      this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                      owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                    });
   }
   componentDidMount() {
      let _this = this;
      document.addEventListener("click", function(e) {
          // NOTE : do console.log, & you will find that clicking an item in backpack will mount
          // this component twice. On the contrary, clicking an item in pockets will only mount the
          // contextual menu (this object) once, which is what we want. Investigate!
          if(e.target.id.substring(0,9).localeCompare("gameItem-") != 0) {
            // clicking anywhere outside the contextual menu will hide it.
            _this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                            owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                          });
          }
      });
   }
   componentWillReceiveProps(nextProps) {
      if (nextProps.itemContextualMenuDirective != undefined) {
          switch (nextProps.itemContextualMenuDirective.displayStatus) {
              case "hide" :
                this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                                owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                              });
                break;
              case "show" :

                switch(nextProps.itemContextualMenuDirective.whichComponent) {
                    case "pockets" :
                      if(nextProps.itemContextualMenuDirective.itemNum >= 1 &&
                         nextProps.itemContextualMenuDirective.itemNum <= 12) {
                            // see if the contextual menu is currently owned by the same item
                            if (this.state.owner.name === nextProps.itemContextualMenuDirective.whichComponent &&
                                this.state.owner.itemNum.toString() === nextProps.itemContextualMenuDirective.itemNum.toString()) {
                                    // toggle off the contextual menu
                                    this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                                                    owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                                                  });
                            } else {
                                    // hide the contextual menu in the backpack component if its currently active as there can only be
                                    // a single active contextual menu on the page.
                                    this.hideThisContextualMenu("backpack");
                                    // toggle on the contextual menu
                                    this.setState({ finalClassName : this.defaultClassName +
                                                                     this.showPocketsMenuClassNamePrefix +
                                                                     nextProps.itemContextualMenuDirective.itemNum +
                                                                     this.showMenuClassNameSuffix,
                                                    owner : { name : "pockets",
                                                              itemNum : nextProps.itemContextualMenuDirective.itemNum,
                                                              itemName : nextProps.itemContextualMenuDirective.itemName,
                                                              itemClassName : nextProps.itemContextualMenuDirective.itemClassName }
                                                  });
                            }
                      }
                      break;
                    case "backpack" :
                      if(nextProps.itemContextualMenuDirective.itemNum >= 1 &&
                         nextProps.itemContextualMenuDirective.itemNum <= 36) {
                           // see if the contextual menu is currently owned by the same item
                           if (this.state.owner.name === nextProps.itemContextualMenuDirective.whichComponent &&
                               this.state.owner.itemNum.toString() === nextProps.itemContextualMenuDirective.itemNum.toString()) {
                                   // toggle off the contextual menu
                                   this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                                                   owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                                                 });
                           } else {
                                   // hide the contextual menu in the backpack component if its currently active as there can only be
                                   // a single active contextual menu on the page.
                                   this.hideThisContextualMenu("pockets");
                                   // toggle on the contextual menu
                                   this.setState({ finalClassName : this.defaultClassName +
                                                                    this.showBackpackMenuClassNamePrefix +
                                                                    nextProps.itemContextualMenuDirective.itemNum +
                                                                    this.showMenuClassNameSuffix,
                                                   owner : { name : "backpack",
                                                             itemNum : nextProps.itemContextualMenuDirective.itemNum,
                                                             itemName : nextProps.itemContextualMenuDirective.itemName,
                                                             itemClassName : nextProps.itemContextualMenuDirective.itemClassName }
                                                 });
                           }
                      }
                      break;
                    default :
                      // indiscriminately hide all contextual menu blocks
                      this.state.finalClassName = this.defaultClassName + this.hideMenuClassName + " ";
                } // end case "show" - switch statement
          } // end switch statement
      }
   }
   useItemButtonPressed(ownerName, itemNum, itemName) {
     this.hideThisContextualMenu(ownerName);

     this.props.contextualMenuButtonClicked({ directive: "use",
                                              owner: ownerName,
                                              itemNum: itemNum,
                                              itemName: itemName });

     // PHASE 2.5 : call the enpoint function of the mainGame to update the
     // state of the game character.
   }
   putBackItemButtonPressed(ownerName, itemNum, itemName, className) {
     this.hideThisContextualMenu(ownerName);

     this.props.contextualMenuButtonClicked({ directive: "putIntoBackpack",
                                              owner: ownerName,
                                              itemNum: itemNum,
                                              itemName: itemName,
                                              itemClassName: className });
   }
   putIntoPocketButtonPressed(ownerName, itemNum, itemName, className) {
     this.hideThisContextualMenu(ownerName);

     this.props.contextualMenuButtonClicked({ directive: "putIntoPocket",
                                              owner: ownerName,
                                              itemNum: itemNum,
                                              itemName: itemName,
                                              itemClassName: className });
   }
   discardItemButtonPressed(ownerName, itemNum, itemName) {
     this.hideThisContextualMenu(ownerName);

     this.props.contextualMenuButtonClicked({ directive: "discard",
                                              owner: ownerName,
                                              itemNum: itemNum,
                                              itemName: itemName });
   }
   hideThisContextualMenu(ownerName) {
     if (document.getElementById(ownerName+"ContextualMenu") != null) {
         document.getElementById(ownerName+"ContextualMenu").className = this.defaultClassName + this.hideMenuClassName + " ";
     }
     this.setState({ finalClassName : this.defaultClassName + this.hideMenuClassName + " ",
                     owner : { name : "", itemNum : "", itemName : "", itemClassName : "" }
                   });
   }
   render() {
     let contextualMenu = null;
     let useItemButtonPressed = this.useItemButtonPressed;
     let putBackItemButtonPressed = this.putBackItemButtonPressed;
     let putIntoPocketButtonPressed = this.putIntoPocketButtonPressed;
     let discardItemButtonPressed = this.discardItemButtonPressed;

     switch(this.state.owner.name.toString()) {
        case "pockets" :
            contextualMenu = <div id="pocketsContextualMenu" className={ this.state.finalClassName }>
                                  <div onClick={ () => useItemButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName) }>Use</div>
                                  <div onClick={ () => putBackItemButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName, this.state.owner.itemClassName) }>Put Back</div>
                                  <div onClick={ () => discardItemButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName) }>Discard</div>
                                  <div>[{ this.state.owner.itemNum }] { this.state.owner.itemName }</div>
                             </div>
            break;
        case "backpack" :
            contextualMenu = <div id="backpackContextualMenu" className={ this.state.finalClassName }>
                                  <div onClick={ () => useItemButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName) }>Use</div>
                                  <div onClick={ () => putIntoPocketButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName, this.state.owner.itemClassName) }>Attach to Pockets</div>
                                  <div onClick={ () => discardItemButtonPressed(this.state.owner.name, this.state.owner.itemNum, this.state.owner.itemName) }>Discard</div>
                                  <div>[{ this.state.owner.itemNum }] { this.state.owner.itemName }</div>
                             </div>
            break;
     } //  end switch statement
     return ( contextualMenu );
  }
}
