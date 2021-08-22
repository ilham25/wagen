// form and element selector
const form = document.querySelector("form");

const friendNameInput = "friend-name";
const friendPhotoInput = "friend-photo";
const chatInput = "chat-input";
const fromInput = "from";
const download = document.querySelector(".download");
const clearBtn = document.querySelector(".clear");

const darkModeTrigger = document.querySelector(".dark-mode-trigger");

// target element
const nameTarget = document.querySelector(".friend-text-container .name");
const profileTarget = document.querySelector(".profile-container .profile");

// dynamic content
const chatContainer = document.querySelector(".chat-message-container ul");
const generated = document.querySelector(".chat-generator-container");
const wallpaper = document.querySelector(".container-bg");

const bodyContainer = document.querySelector("body");

const stickerListElement = document.querySelector(".sticker-list");
const statusBarClock = document.querySelector(".clock");

// global variable for chat

let messages = [];
let messageIndex = 0;
let chatFrom = "";
let stickerList = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const chat = form.elements[chatInput].value;
  const name = form.elements[friendNameInput].value;

  const checked = form.elements[fromInput].checked;
  nameTarget.innerText = name;

  handleFirstChat(checked);

  const current = new Date();

  messages.push({
    id: messageIndex,
    from: checked ? "friend" : "me",
    message: chat,
    type: "text",
    time: handleTime(current),
  });

  chatGenerator();
  form.elements[chatInput].value = "";
});

const handleTime = (current) => {
  const timeStr =
    ("0" + current.getHours()).slice(-2) +
    ":" +
    ("0" + current.getMinutes()).slice(-2);
  return timeStr;
};

const handleFirstChat = (checked) => {
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
};

const chatGenerator = () => {
  chatContainer.innerHTML = "";
  messages.forEach((item) => {
    const chat = document.createElement("li");

    const msgAccent = document.createElement("div");
    msgAccent.classList.add("message-accent");
    chat.appendChild(msgAccent);

    const msgContainer = document.createElement("div");
    msgContainer.classList.add("message-container");

    const time = document.createElement("small");
    time.classList.add("message-time");
    time.innerText = item?.time;

    switch (item?.type) {
      case "text":
        const text = document.createElement("p");
        text.innerText = item.message;
        msgContainer.appendChild(text);
        msgContainer.appendChild(time);
        break;

      case "sticker":
        const stickerMsg = document.createElement("div");
        stickerMsg.classList.add("sticker-msg");

        const stickerImg = document.createElement("img");
        stickerImg.src = item?.message;
        stickerMsg.appendChild(stickerImg);

        msgContainer.appendChild(stickerMsg);
        msgContainer.appendChild(time);

        chat.classList.add("sticker-type");
        break;

      default:
        break;
    }
    chat.classList.add(item.from);
    chat.appendChild(msgContainer);

    // check first chat each section to show accent
    item?.id === 0 && chat.classList.add("first");

    chatContainer.appendChild(chat);
  });
};

const stickerGenerator = () => {
  stickerListElement.innerHTML = "";
  stickerList.forEach((sticker) => {
    const stickerDiv = document.createElement("div");
    stickerDiv.classList.add("sticker");

    const img = document.createElement("img");
    img.src = sticker;

    stickerDiv.addEventListener("click", (e) => {
      const checked = document.querySelector("#from").checked;
      const current = new Date();

      handleFirstChat(checked);
      messages.push({
        id: messageIndex,
        from: checked ? "friend" : "me",
        message: sticker,
        type: "sticker",
        time: handleTime(current),
      });

      chatGenerator();
    });

    stickerDiv.appendChild(img);

    stickerListElement.appendChild(stickerDiv);
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
          wallpaper.setAttribute("custom", "true");
          break;

        case "sticker":
          stickerList.push(e.target.result);
          stickerGenerator();
          break;
        default:
          profileTarget.src = e.target.result;
          break;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const darkModeHandler = () => {
  bodyContainer.classList.toggle("dark");

  if (!wallpaper.getAttribute("custom")) {
    if (darkModeTrigger.checked) {
      wallpaper.src = "./img/wa-wp-dark.png";
    } else {
      wallpaper.src = "./img/wa-wp-light.png";
    }
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

setInterval(() => {
  statusBarClock.innerText = handleTime(new Date());
}, 1000);
