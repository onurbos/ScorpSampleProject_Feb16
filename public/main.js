// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();

api.setEventHandler((events) => {

        var agArray = events.filter(x => x.type == API_EVENT_TYPE.ANIMATED_GIFT);
        var theOthers = events.filter(x => x.type != API_EVENT_TYPE.ANIMATED_GIFT);

        //sort array m to g
        theOthers.sort(function(event1, event2) {
            return event1.type == event2.type ? 0 :
                event2.type == API_EVENT_TYPE.MESSAGE ? 1 :
                event1.type == API_EVENT_TYPE.MESSAGE ? -1 : 0;
        });

        function timeOutHelper(event, lastAnimationEnd) {

            if (lastAnimationEnd + 2000 > Date.now()) {
                setTimeout(() => {
                    animateGift(event);
                    addMessage(event);
                }, (lastAnimationEnd + 2000 - Date.now()));
            } else {
                animateGift(event);
                addMessage(event);
            }

            return Date.now() + 2000;
        }

        function helper(array) {

            let lastAnimationEnd = 0;
            for (let index = 0; index < array.length; index++) {

                const event = array[index];
                let condition = event.type == API_EVENT_TYPE.MESSAGE && (event.timestamp.valueOf() + 20000 < Date.now()) || event.type == API_EVENT_TYPE.GIFT;

                if (condition) {
                    addMessage(event);
                } else if (event.type == API_EVENT_TYPE.ANIMATED_GIFT) {

                    if (!isPossiblyAnimatingGift()) {
                        lastAnimationEnd = timeOutHelper(event, lastAnimationEnd);
                    } else if (theOthers[0] && condition) {
                        addMessage(theOthers[0]);
                        theOthers.splice(0, 1);
                        index--;
                    } else {
                        lastAnimationEnd = timeOutHelper(event, lastAnimationEnd);
                    }

                }
            }
        }

        helper(agArray);
        helper(theOthers);

    })
    // NOTE: UI helper methods from `dom_updates` are already imported above.
