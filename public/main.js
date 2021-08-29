// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI, helperForAnimatingGift } from "./dom_updates.js";

const api = new APIWrapper();
var allAgArray = [];

api.setEventHandler((events) => {

    var agArray = events.filter(x => x.type === API_EVENT_TYPE.ANIMATED_GIFT);
    var theOthers = events.filter(x => x.type !== API_EVENT_TYPE.ANIMATED_GIFT);

    allAgArray = allAgArray.concat(agArray);

    //we have to sort that as m, g
    theOthers.sort(function(event1, event2) {
        return event1.type > event2.type ? -1 : 1;
    });

    //if we have any ag items, we have to sent that to our helper method
    helperForAnimatingGift(allAgArray);

    theOthers.forEach(event => {
        //we show  theothers as message
        addMessage(event);
        //We have to check again 
        helperForAnimatingGift(allAgArray);

    });

})

// NOTE: UI helper methods from `dom_updates` are already imported above.