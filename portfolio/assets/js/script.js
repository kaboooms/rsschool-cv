import {initBurgerHandler} from "./modules/burger.js";
import {initAccordionHandler} from "./modules/accordion.js";
import {initSliderHandler} from "./modules/slider.js";

window.onload = function () {
    console.log("Loaded onload")
    initBurgerHandler()
    initAccordionHandler()
    initSliderHandler()
}