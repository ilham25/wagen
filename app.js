// form and element selector
const form = document.querySelector("form");

const friendNameInput = "friend-name";
const friendPhotoInput = "friend-photo";
const chatInput = "chat-input";
const fromInput = "from";
const download = document.querySelector(".download");
const clearBtn = document.querySelector(".clear");

// target element
const nameTarget = document.querySelector(".friend-text-container .name");
const profileTarget = document.querySelector(".profile-container .profile");

// dynamic content
const chatContainer = document.querySelector(".chat-message-container ul");
const generated = document.querySelector(".chat-generator-container");
const wallpaper = document.querySelector(".container-bg");

// global variable for chat

let messages = [];
let messageIndex = 0;
let chatFrom = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const chat = form.elements[chatInput].value;
  const name = form.elements[friendNameInput].value;

  const checked = form.elements[fromInput].checked;
  nameTarget.innerText = name;

  // reset id to 0 for first chat in each section
  if (checked) {
    if (chatFrom !== "checked") {
      messageIndex = 0;
      chatFrom = "checked";
    } else if (chatFrom === "checked") {
      chatFrom = "checked";
      messageIndex++;
    }
  } else {
    if (chatFrom !== "unChecked") {
      messageIndex = 0;
      chatFrom = "unChecked";
    } else if (chatFrom === "unChecked") {
      chatFrom = "unChecked";
      messageIndex++;
    }
  }

  messages.push({
    id: messageIndex,
    from: checked ? "friend" : "me",
    message: chat,
  });

  chatGenerator();
  form.elements[chatInput].value = "";
});

const chatGenerator = () => {
  chatContainer.innerHTML = "";
  messages.forEach((item) => {
    const chat = document.createElement("li");

    const msgAccent = document.createElement("div");
    msgAccent.classList.add("message-accent");
    chat.appendChild(msgAccent);

    const text = document.createElement("p");
    text.innerText = item.message;
    chat.appendChild(text);
    chat.classList.add(item.from);

    // check first chat each section to show accent
    item?.id === 0 && chat.classList.add("first");

    chatContainer.appendChild(chat);
  });
};

const readURL = (input, type) => {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      switch (type) {
        case "profile":
          profileTarget.src = e.target.result;
          break;

        case "wallpaper":
          wallpaper.src = e.target.result;
          break;
        default:
          profileTarget.src = e.target.result;

          break;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

download.addEventListener("click", () => {
  domtoimage.toBlob(generated).then(function (blob) {
    window.saveAs(blob, "wa-message-gen.png");
  });
});

clearBtn.addEventListener("click", () => {
  messages = [];
  messageIndex = 0;
  chatFrom = "";

  chatGenerator();
});
