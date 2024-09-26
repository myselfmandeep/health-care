import { fadeOutElement } from "./helper_methods";

const flashMessagesContainer = document.querySelector(".flash-alert-messages");
setTimeout(() => fadeOutElement(flashMessagesContainer), 3500);
