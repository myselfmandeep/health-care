import getToken from "../auth/get_token";
import { createConsumer } from "../channels/consumer";
import { defaultErrorMessage, removeNodes, reqHeaders, scrollToEnd, showApiErrorResponse, showApiResponse, showErrorInNotificationCard, showSuccessInNotificationCard } from "../general/helper_methods";
import { showSpinner, removeSpinner } from "../general/spinner";

sessionStorage.removeItem("chat_with");

export const usersListing = document.querySelector(".users-listing");
const chatScreen = document.querySelector(".chat-screen");
const chatTypingBox = document.querySelector(".chat-typing-box");
const searchForUsers = document.querySelector(".search-for-users");
const closeSearchUserBtn = document.querySelector(".close-search-user-btn");
// const searchUserInput = document.querySelector("#search-user-input");
const newChatBtn = document.querySelector(".new-chat-btn");
const listUsers = document.querySelector(".list-users");
const searchBtn = document.querySelector(".search-btn");
let allowModalBodyScroll = true;
let loadingChat  = false; // prevent from loading multiple chats at single chat screen

const CHAT = {
  usersListing: () => document.querySelector(".users-listing"),
  newChatBtn: () => document.querySelector(".new-chat-btn"),
  chatModal: () => document.querySelector(".chat-modal"),
  chatModalBody: () => document.querySelector(".chat-modal-body"),
  searchBar: () => document.querySelector(".user-search-bar"),
  searchBtn: () => document.querySelector(".search-btn"),
  chatScreen: () => document.querySelector(".chat-screen"),
  chatTypingBox: () => document.querySelector(".chat-typing-box"),
  activeChat: () => document.querySelector(".active-chat"),
  messageContainer: () => document.querySelector(".message-container"),
  chatScreenNotification: () => document.querySelector(".chat-sceen-notification"),
  chatModalBody: () => document.querySelector(".chat-modal-body"),
  noUserFound: () => document.querySelector(".no-user-found")
};

const chatHTML = {
  msgContainer: () => {
    return `<div class="message-container"></div>`
  },
  noMessageNotification: () => {
    return `<div class="chat-sceen-notification">
              <p>This chat doesn't have any messages</p>
            </div>`
  },
  inputBox: () => {
    return `<div class="input-box">
              <textarea id="type-message" placeholder="type message" type="text"></textarea>
            </div>
            <div class="send-button-box">
              <button id="send-button">Send</button>
            </div>`
  },
  searchUserModal: function(props={}, parentElement=null) {
    const modal =  `
      <div class="chat-modal">
        <div class="main-chat-modal">
          <div class="chat-modal-header"><input class="user-search-bar" id="type-user-name" type="text">
            <button class="search-btn">Search </button>
          </div>
          <div class="chat-modal-body">
            
          </div>
        </div>
      </div>
    `;
    parentElement.insertAdjacentHTML("afterbegin", modal);
  },
  userDetail: (user) => {
    return `
      <div class="user-detail" data-user-name="${user.name}">
        <p>
          ${user.name}
          <i>
            (${user.role})
          </i>
        </p>
        <button data-user-id="${user.id}" data-user-name="${user.name}" class="start-chat">Chat</button>
      </div>
    `;
  },
  chatUserHTML: (user) => {
    return `
      <div class="chat-user" data-user-id="${user.id}">
        ${user.name}
      </div>
    `;
  },
  clearChatBtn: (chat_id) => {
    return `
      <div data-chat-id="${chat_id}" class="clear-chat-btn">
        Clear Chat
      </div>
    `;
  },
  messageCardHTML: (message) => {
    return `
      <div data-message-id="${message.id}" class="msg ${selectClassName(message)}">
        ${message.body}
        <div class="sent-at">
          ${message.sent_at}
        </div>
        <div class="sent-at sender-name">
          ${message.sender.name}
        </div>
        <div data-delete-msg-id="${message.id}"class="delete-icon">
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
    `;
  }, 
  chatOptions: () => {
    return `
      <div class="chat-options">☰</div>
    `;
  },
  chatSideNav: () => {
    return `
      ${chatHTML.chatOptions()}
      <div class="chat-side-nav">
        <div class="close-btn">Close</div>
        <div class="clear-chat-btn">Clear Chat</div>
      </div>
    `;
  },
  noUserFound: () => {
    return `
      <div class="no-user-found">No user found</div>
    `
  }
}

const chatEventHandlers = {
  handleSideBar: function(chatOptions, sideNav) {
    const closeBtn = sideNav.querySelector(".close-btn");
    const clearChatBtn= sideNav.querySelector(".clear-chat-btn");

    chatOptions.addEventListener("click", function(event) {
      sideNav.style.width = "250px"
    });

    closeBtn.addEventListener("click", function(event) {
      sideNav.style.width = 0;
    });

    clearChatBtn.addEventListener("click", async function(event) {
      if (!!CHAT.chatScreenNotification()) {
        showSuccessInNotificationCard("This chat has no messages to clear");
        closeBtn.click();
        return
      }
      if (!confirm("Are you sure to clear chat?")) {
        return
      }
      try {
        showSpinner()
        const cs = CHAT.chatScreen()
        const id = cs.getAttribute("active-chat");
        const path = `/api/v1/chats/${id}/clear_chat?cleared_by=${localStorage.user_id}`;
        const response = await fetch(path, reqHeaders("DELETE"));
        const chat = await response.json();

        console.log(chat);

        if (response.ok) {
          showSuccessInNotificationCard("Chat cleared successfully");
          const cs = CHAT.chatScreen();
          const activeChatId = Number(cs.getAttribute("active-chat"));
          const messageContainer = cs.querySelector(".message-container");

          if (activeChatId == chat.chat_id) {
            [...messageContainer.children].forEach(msg=> {
              msg.remove();
            })

            cs.insertAdjacentHTML("afterbegin", chatHTML.noMessageNotification());
          }
        } else {
          // showErrorInNotificationCard("Failed to clear chat")
          showErrorInNotificationCard(chat)
        }
        closeBtn.click();
        removeSpinner();
      } catch (error) {
        removeSpinner();
        defaultErrorMessage(error);
      }
    });
  },

  clearChat: function(data) {
    const cs = CHAT.chatScreen();
    const activeChatId = Number(cs.getAttribute("active-chat"));
    const messageContainer = cs.querySelector(".message-container");
    const deletedMessages= data.deleted || [];

    // debugger;

    if (activeChatId == data.chat_id) {
      [...messageContainer.children].forEach(msg=> {
        const msgId = msg.dataset.messageId;
        // debugger;

        if (deletedMessages.includes(Number(msgId))) {
          msg.remove();
        }
      })
      // removeNodes(messageContainer);
      // if(!CHAT.chatScreenNotification()) {
      //   cs.insertAdjacentHTML("afterbegin", chatHTML.noMessageNotification());
      // }
    }
  },

  deleteMessage: async function(event) {
    const currentElement = event.currentTarget;
    const dataSet = currentElement.dataset;
    const msgId = dataSet.deleteMsgId
    
    const cs = CHAT.chatScreen();
    if (!cs) {
      return;
    }

    const chatId = cs.getAttribute("active-chat");
    if (!chatId) {
      return;
    }

    let userId = localStorage.user_id;
    if (!userId) {
      await getToken()
      userId = localStorage.user_id;
    }

    const confirmation = confirm("Sure to delete this message?");
    if (!confirmation) {
      return;
    }

    try {
      showSpinner();

      const path = `/api/v1/chats/${chatId}/clear_chat?cleared_by=${userId}&message_id=${msgId}`
      const response = await fetch(path, reqHeaders("DELETE"));
      const chatClear = await response.json();

      if (response.ok) {
        const msgInChatScreen = document.querySelector(`[data-message-id="${msgId}"]`);
        msgInChatScreen.remove();
      } else {
        showErrorInNotificationCard(["Failed to delete message", chatClear])
      }
    } catch (error) {
      defaultErrorMessage(error)
    } finally {
      removeSpinner()
    }

  }
}

let activeChannel;

const removeNoUserFound = function() {
  const nuf = CHAT.noUserFound();
  if (!!nuf) {
    nuf.remove();
  }
};

const clearRequestedChatDetail = function() {
  localStorage.removeItem("requestedChat");
  localStorage.removeItem("requestedUserName");
};
// const chatUserHTML = (id,name) => `<div class="chat-user active-chat" data-user-id="${id}">${name}</div>`

const selectClassName = (message) => {
  const thisUserId = localStorage.user_id;
  return message.sender.id == thisUserId ? "sent-msg" : "receive-msg";
};

const userNotFoundMessage = () => listUsers.insertAdjacentHTML("afterbegin", `<div class="start-chat no-user-found">No user found</div>`);
const clearSearchedUsers = () => [...listUsers.children].forEach(user => user.remove());
const chatInitiated = () => { console.log("chag initiated") };

const msgReceived = (data) => {
  console.log(data);

  switch (data.type) {
    case "clear_chat":
      // chatEventHandlers.clearChat(data)
      break;
    default:
      const chatScreenNotification = document.querySelector(".chat-sceen-notification");
      if (!!chatScreenNotification) { chatScreenNotification.remove()};
    
      const currentChat = document.querySelector(`[data-chat-id='${data.message.chat_id}']`);
      // debugger;
      if (!!currentChat) {
        console.log("true");
        console.log(newChatBtn);
        newChatBtn.insertAdjacentElement("afterend", currentChat);
      }
      
      console.log(data);
      // debugger;
      const messageContainer = CHAT.messageContainer();
      messageContainer.insertAdjacentHTML("beforeend", chatHTML.messageCardHTML(data.message));

      const addMsg = document.querySelector(`[data-delete-msg-id="${data.message.id}"]`);
      addMsg.addEventListener("click", chatEventHandlers.deleteMessage);
      
      messageContainer.scrollTop = messageContainer.scrollHeight;
    break;
  }
}

const chatChannel = (identity) => {
  const identifier = {channel: "ChatChannel", chat_id: identity}
  return createConsumer().subscriptions.create(identifier, {
    connected: chatInitiated,
    received: msgReceived
  })
};

const users = [...document.querySelectorAll(".chat-user")];

export async function startChatWithUserId(userId) {
  const activeChat = CHAT.activeChat();
  // debugger;
  if (!userId) { 
    return userId
  }
  if (userId == sessionStorage.chat_with) {
    return;
  }
  if (!!activeChat) { 
    activeChat.classList.remove("active-chat") 
  }
  if (!!activeChannel) {
    [...chatScreen.children].forEach(child => child.remove());
    [...chatTypingBox.children].forEach(child => child.remove());
    activeChannel.unsubscribe();
  };
  
  const latestUsersListing = document.querySelector(".users-listing");
  const user = latestUsersListing.querySelector(`[data-user-id="${userId}"]`);
  user.classList.add("active-chat");
  try {
    loadingChat = true;
    showSpinner();
    const path = `/api/v1/chats/create_chat?user_id=${userId}`
    const response = await fetch(path, reqHeaders("POST"));
    const chat  = await response.json();

    if (response.ok) {
      user.style.display = "";
      // localStorage.removeItem("requestedChat");
      // localStorage.removeItem("requestedUserName");
      CHAT.chatScreen().setAttribute("active-chat", chat.id)
      
      const messages = chat.messages; 
      chatScreen.insertAdjacentHTML("afterbegin", chatHTML.msgContainer())
      // chatScreen.insertAdjacentHTML("afterbegin", chatHTML.clearChatBtn(chat.id))
      
      chatScreen.insertAdjacentHTML("afterbegin", chatHTML.chatSideNav())
      const chatOptions = CHAT.chatScreen().querySelector(".chat-options");
      const sideNav = CHAT.chatScreen().querySelector(".chat-side-nav");

      chatEventHandlers.handleSideBar(chatOptions, sideNav)
      const messageContainer = document.querySelector(".message-container");
      sessionStorage.chat_with = userId;
      if (messages.length > 0) {
        messages.reverse().forEach(message => {
          messageContainer.insertAdjacentHTML("beforeend", chatHTML.messageCardHTML(message));
          
          const deleteIcon = document.querySelector(`[data-delete-msg-id="${message.id}"]`);
          deleteIcon.addEventListener("click", chatEventHandlers.deleteMessage)

          scrollToEnd(messageContainer);
        });
      } else {
        chatScreen.insertAdjacentHTML("afterbegin", chatHTML.noMessageNotification());
      };

      chatTypingBox.insertAdjacentHTML("afterbegin", chatHTML.inputBox());
      const sendButton = document.querySelector("#send-button");
      const initiatedChatChannel = chatChannel(chat.id);
      activeChannel = initiatedChatChannel;

      const messageInputBox = document.querySelector("#type-message");
      sendButton.addEventListener("click", async (event) => {
        const msg = messageInputBox.value
        if (!msg) { 
          return msg;
        }
        try {
          const path = `/api/v1/messages/?chat_id=${chat.id}&body=${msg}`
          const response = await fetch(path, reqHeaders("POST"))
          const message  = await response.json();
          
          if (!response.ok) {
            showErrorInNotificationCard(message, 8000)
          } else {
            messageContainer.scrollTop = messageContainer.scrollHeight 
          }
        } catch (error) {
          defaultErrorMessage(error);
        };
        messageInputBox.value = ""
        messageInputBox.focus();
      })

      let pageNo = 1;
      let nextPageAvail = true;
      messageContainer.addEventListener("scroll", async (event) => {
        const currentElement = event.currentTarget;
        const currentScrollPosition = currentElement.scrollTop;
        const containerHeight = currentElement.scrollHeight;
        
        if (currentScrollPosition == 0 && nextPageAvail) {
          pageNo++;

          const sixtyPercentHeight = containerHeight * 0.10;
          currentElement.scrollTop = sixtyPercentHeight;

          try {
            showSpinner();
            const path = `/api/v1/messages?page=${pageNo}&chat_id=${chat.id}`
            const response = await fetch(path, reqHeaders("GET"));
            const messages = await response.json();
            console.log(messages);
            removeSpinner();
            if (response.ok) {
              if (messages.length == 0) { nextPageAvail = false; return;};
              messages.forEach(message => {
                messageContainer.insertAdjacentHTML("afterbegin", chatHTML.messageCardHTML(message));
                const deleteIcon = document.querySelector(`[data-delete-msg-id="${message.id}"]`);
                deleteIcon.addEventListener("click", chatEventHandlers.deleteMessage)
              });
            } else {
              pageNo--
            };
          } catch (error) {
            removeSpinner();
            defaultErrorMessage(error);
          }
        }
      });
    } else {
      user.remove();
      showErrorInNotificationCard(chat)
    }
    clearRequestedChatDetail();
  } catch (error) {
    defaultErrorMessage(error);
  } finally {
    loadingChat = false;
    removeSpinner();
  }
}

export async function createOrFindChat(event) {
  const cUser = event.currentTarget
  const userId = cUser.dataset.userId

  if (!loadingChat) {
    startChatWithUserId(userId)
  };
};

users.forEach(user => {
  user.addEventListener("click", createOrFindChat)
});

// open chat if user clicked on chat button on previous page
(function() {
  const requestedUserId = localStorage.getItem("requestedChat");
  const requestedUserName = localStorage.getItem("requestedUserName");

  console.log([requestedUserId, requestedUserName]);
  const invalidValues = ["null", "undefined", null, undefined];
  const invalidNameId = invalidValues.some(e=> e == requestedUserId || e == requestedUserName) 
  const user = document.querySelector(".users-listing").querySelector(`[data-user-id="${requestedUserId}"]`);

  if(!!user) {
    user.click();
  } else if (!invalidNameId) {
    const idName = {id: requestedUserId, name: requestedUserName}
    // usersListing.insertAdjacentHTML("afterbegin", chatHTML.chatUserHTML(idName));    
    CHAT.newChatBtn().insertAdjacentHTML("afterend", chatHTML.chatUserHTML(idName));    

    const newUser = document.querySelector(".users-listing").querySelector(`[data-user-id="${requestedUserId}"]`);
    newUser.style.display = "none";
    newUser.addEventListener("click", createOrFindChat);
    startChatWithUserId(requestedUserId)
  } else {
    clearRequestedChatDetail();
  }
})()

let loadUsersPageNo = 1;
let isLoadingUsers = false;
const fetchUsersRecord = async function(page=1) {
  try {
    showSpinner();
    isLoadingUsers = true;
    console.log(`page-${page}`);
    const path = `/api/v1/users?page=${page}`
    const response = await fetch(path, reqHeaders("GET"));
    const users = await response.json()

    if (response.ok) {
      loadUsersPageNo++;
      console.log(users);
      // console.log(users.map(u=>u.id));
      const chatModalBody = document.querySelector(".chat-modal-body");
      users.forEach(user=> {
        
        if (!!CHAT.chatModal().querySelector(`[data-user-id="${user.id}"]`)) {
          return;
        }
        
        chatModalBody.insertAdjacentHTML("beforeend", chatHTML.userDetail(user));
        const chatUser = document.querySelector(`[data-user-id="${user.id}"]`)
        chatUser.addEventListener("click", (event) => {
          const [name, id] = [chatUser.dataset.userName, chatUser.dataset.userId]
          if (!document.querySelector(".users-listing").querySelector(`[data-user-id="${id}"]`)) {
            const AC = CHAT.activeChat();
            if(!!AC) {
              AC.classList.remove("active-chat");
            }
            const html = `<div class="chat-user active-chat" data-user-id="${id}">${name}</div>`
            newChatBtn.insertAdjacentHTML("afterend", html)
            const newUser = document.querySelector(".users-listing").querySelector(`[data-user-id="${id}"]`);
            newUser.addEventListener("click", createOrFindChat);
          }
          createOrFindChat(event); 

          CHAT.chatModal().style.display = "none";
        });
      })
      if (users.length == 0) {
        console.log("allow mbody scroll disabled");
        allowModalBodyScroll= false;
      }
    } else {
      showErrorInNotificationCard("Failed to load users");
    }
  }
  catch(error) {
    showErrorInNotificationCard("Failed to load users");
    console.log(error);
  } finally {
    isLoadingUsers = false;
    removeSpinner();
  }
};


newChatBtn.addEventListener("click", function(event) {
  let chatModal = CHAT.chatModal();

  if (!!chatModal) {
    chatModal.style.display = "";
    return;
  };

  const body = document.querySelector("body");
  chatHTML.searchUserModal({}, body);
  chatModal = CHAT.chatModal();
  const chatModalBody = document.querySelector(".chat-modal-body");
  const typeUserName = document.querySelector("#type-user-name");
  
  window.onclick = function(event) {
    if (event.target == chatModal) {
      chatModal.style.display = "none";
    }
  };

  chatModalBody.addEventListener("scroll", async function(event) {

    const container = event.currentTarget;
    const containerHeigth = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    if (document.activeElement === typeUserName || !!typeUserName.value) { 
      return;
    }
    if ((scrollTop + clientHeight) >= (containerHeigth * 0.95) && allowModalBodyScroll && !isLoadingUsers) {
      await fetchUsersRecord(loadUsersPageNo)
      chatModalBody.scrollTop = containerHeigth * 0.50
    } else {
      // console.log("else of fetch record");
    }
    
  });

  typeUserName.addEventListener("keyup", async function(event) {
    removeNoUserFound();
    
    const typedValue = event.currentTarget.value.toLowerCase().trim();
    const listedUsers = [...document.querySelectorAll("[data-user-name]")];
    
    listedUsers.forEach(user=> {
      const dataSet = user.dataset;
      const name = dataSet.userName.toLowerCase().trim();
  
      user.style.display = name.includes(typedValue) ? "flex" : "none";
    })
  })

  CHAT.searchBtn().addEventListener("click", async function(event) {
    removeNoUserFound();
    console.log(CHAT.searchBtn());
    const inputBox = event.currentTarget;
    const searchInput = CHAT.searchBar().value.trim().toLowerCase();
  
    if (searchInput.length < 3) { return showErrorInNotificationCard("Minimum 3 characters required") };
    
    try {
      const path =  `/api/v1/users/search?query=${searchInput}`
      const response = await fetch(path, reqHeaders("GET"));
      const users = await response.json();
  
      console.log(users);
      
      if (response.ok) {
        const modalBody = CHAT.chatModalBody();
        [...modalBody.children].forEach(mc=>mc.style.display = "none");
        if(users.length > 0) {
          users.forEach(user => {
            console.log(chatHTML.userDetail(user));
  
            const existingRecord = CHAT.chatModal().querySelector(`[data-user-id="${user.id}"]`);
            if (!!existingRecord) {
              console.log("existing record");
              existingRecord.parentElement.style.display = "flex";
              return;
            };
            
            modalBody.insertAdjacentHTML("afterbegin", chatHTML.userDetail(user));
  
            const userDetail = CHAT.chatModalBody().querySelector(`[data-user-id="${user.id}"]`);
            userDetail.addEventListener("click", (event) => {
              if(!CHAT.usersListing().querySelector(`[data-user-id="${user.id}"]`)) {
                newChatBtn.insertAdjacentHTML("afterend", chatHTML.chatUserHTML(user));
                CHAT.usersListing().querySelector(`[data-user-id="${user.id}"]`).addEventListener("click", createOrFindChat)
              };
  
              createOrFindChat(event)
              CHAT.chatModal().style.display = "none";
            })
          })
        } else {
          const modalBody = CHAT.chatModalBody();
          modalBody.insertAdjacentHTML("afterbegin", chatHTML.noUserFound())
        }
      }
    } catch (error) {
      defaultErrorMessage(error);
    };
  });
  fetchUsersRecord()
});
