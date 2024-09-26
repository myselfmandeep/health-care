import { fadeOutElement } from "./helper_methods";

const errorMessagesContainer = document.querySelector(".flash-alerts-popup");
setTimeout(()=> fadeOutElement(errorMessagesContainer, 3000), 10000)