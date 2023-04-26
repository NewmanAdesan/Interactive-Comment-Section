



/******************************************************
 * LOAD THE JSON DATA INTO BROWSER LOCAL STORAGE
 * 
 * fetch JSON data from the file 'data.json' 
 * using XMLHttpRequest synchronously,
 * parses the JSON response into a JavaScript object.
 *
 * 
 *****************************************************/
if (!localStorage.getItem("DATA")) {
    // Create a new XMLHttpRequest Object
    let xhr = new XMLHttpRequest();

    // Set the request URL
    xhr.open('GET', "./data.json", false)

    // Send the request
    xhr.send();

    // place the database in the browser local storage
    localStorage.setItem("DATA", xhr.responseText);

    // place a flag; this flags comment user has voted for; such that user can only vote once
    localStorage.setItem("votedFor", "[]");
}






/***********************************
 * INITIAL RENDERING OF THE WEBPAGE
 ***********************************/

const DATA = getDatabase();

// a copy of DATA comments property
let comments = DATA.comments;

// sort the list of comments by their score in descending order
comments.sort((a, b) => {
    return b.score - a.score;
});

comments.forEach((commentInformation) => {
    // create a comment section for the comment
    let commentSection = generateCommentSection(commentInformation);

    // add comment section before the script element
    document.querySelector("body").insertBefore(commentSection, document.querySelector(".attribution"));

    // if CommentInformation replies property is not empty
    if (commentInformation["replies"].length > 0) {
        // place a reply container after the comment section
        let replyContainer = generateReplyContainerSection();
        insertAfterMe(replyContainer, commentSection);

        // for each comment in replies property
        commentInformation["replies"].forEach((replyCommentInformation) => {

            // create a comment section for them
            let replyCommentSection = generateCommentSection(replyCommentInformation);

            // place them in the reply container
            replyContainer.querySelector(".comment-replies").appendChild(replyCommentSection);

        });
    }

})


// create a reply comment section for the current user
let userReplyCommentSection = generateReplyCommentSection(DATA);
userReplyCommentSection.classList.add("show");

// add the users replycomment section to the body
document.querySelector("body").insertBefore(userReplyCommentSection, document.querySelector(".attribution"));






/********************************************
 *   SETTING UP THE MOBILE RESPONSIVENESS
 ********************************************/

/**
 * This function checks if the webpage is in mobile layout
 * in mobile layout, the comment section has within it a comment actions section
 * thus we would return the comment actions section element
 * 
 * if this return value is "null", it means the webpage is not in mobile layout
 * @return {HTMLElement} - HTMLElement corresponding to a comment actions section element
 */
function inMobileMode() {
    return document.querySelector(".comment-actions");
}


/**
 * This function converts a comment section element
 * from a desktop layout to a mobile layout
 * 
 * @param {HTMLElement} commentSection 
 */
function convertCommentSectionToMobile(commentSection) {
    // create a comment actions section element
    let commentActions = createDOMElement(`<div class="comment-actions" style="display: flex;"></div>`);

    // move comment score section inside the comment actions section element
    commentActions.appendChild(commentSection.querySelector(".comment-score"));

    // move buttons in the comment-info sections into the comment actions section element
    commentSection.querySelectorAll(".comment-info .clickable").forEach((button) => {
        commentActions.appendChild(button);
    })

    // add the comment actions section element into the comment block section element
    commentSection.querySelector(".comment-block").appendChild(commentActions);
}


/**
 * This function converts a comment section element
 * from a mobile layout to a desktop layout
 * 
 * @param {HTMLElement} commentSection 
 */
function convertCommentSectionToDesktop(commentSection) {
    // place it's comment-score element after the comment id section
    insertAfterMe(commentSection.querySelector(".comment-score"), commentSection.querySelector(".id"));

    // place all buttons in the comment actions section in the comment info section
    commentSection.querySelectorAll(".comment-actions .clickable").forEach((button) => {
        commentSection.querySelector(".comment-info").appendChild(button);
    });

    // remove the comment-actions element
    commentSection.querySelector(".comment-actions").remove();

}


/**
 * This function converts a reply comment section element
 * from a desktop layout to a mobile layout
 * 
 * @param {HTMLElement} replyCommentSection 
 */
function convertReplyCommentSectionToMobile(replyCommentSection) {

    /*
        <div class="add-comment" style="flex-direction:column;">
            <textarea class="comment-area clickable" placeholder="Add a comment..."
                style="width: 100%; margin-bottom: 0.6em;"></textarea>
            <div style="display:flex; width: 100%;">
                <img class="comment-photo" src="./images/avatars/image-juliusomo.png">
                <button class="comment-send-button clickable" style="margin-left:auto">SEND</button>
            </div>
        </div>
    */

    // obtain reference to the textarea, img, button
    let textarea = replyCommentSection.querySelector("textarea");
    let img = replyCommentSection.querySelector("img");
    let button = replyCommentSection.querySelector("button");

    // add the style attribute to the reply comment container
    replyCommentSection.setAttribute("style", "flex-direction:column;");

    // add the style attribute to the text area
    textarea.setAttribute("style", "width: 100%; margin-bottom: 0.6em;");

    // add the style attribute to the send button
    button.setAttribute("style", "margin-left:auto");

    // create the container for the image and button
    let div = createDOMElement(`<div style="display:flex; align-items:center; width: 100%;"></div>`);

    // place img and button into this container
    div.appendChild(img);
    div.appendChild(button);

    // append container to the reply comment container
    replyCommentSection.appendChild(div);
}


/**
 * This function converts a reply comment section element
 * from a mobile layout to a desktop layout
 * 
 * @param {HTMLElement} replyCommentSection 
 */
function convertReplyCommentSectionToDesktop(replyCommentSection) {

    // obtain reference to the textarea, img, button
    let textarea = replyCommentSection.querySelector("textarea");
    let img = replyCommentSection.querySelector("img");
    let button = replyCommentSection.querySelector("button");

    // set empty style attribute to the reply comment container
    replyCommentSection.setAttribute("style", "");

    // set empty style attribute to the text area
    textarea.setAttribute("style", "");

    // set empty style attribute to the send button
    button.setAttribute("style", "");

    // place img element before the textarea element
    replyCommentSection.insertBefore(img, textarea);

    // place img element after the textarea element
    insertAfterMe(button, textarea);

    // remove the div container previously housing the img & button element
    replyCommentSection.querySelector("div").remove();

    // change the send button event handler such that if it is mobile,
    // the reply container it corresponds to is it grand parent, not its parent

}


// Define the function to be executed when the media query matches
function handleMediaQuery(mediaQuery) {
    if (mediaQuery.matches) {
        // if any comment section is already in mobile mode; EXIT
        if (inMobileMode()) return;

        // change the structure of all comment section element
        document.querySelectorAll(".comment").forEach((commentSection) => {
            convertCommentSectionToMobile(commentSection);
        });

        // change the structure of all reply comment section element
        document.querySelectorAll(".reply-comment").forEach((replyCommentSection) => {
            convertReplyCommentSectionToMobile(replyCommentSection);
        })
    }

    else {
        // if comment section is already in desktop mode; EXIT
        if (!inMobileMode()) return;

        // change the structure of all comment section element
        document.querySelectorAll(".comment").forEach((commentSection) => {
            convertCommentSectionToDesktop(commentSection);
        });

        // change the structure of all reply comment section element
        document.querySelectorAll(".reply-comment").forEach((replyCommentSection) => {
            convertReplyCommentSectionToDesktop(replyCommentSection);
        })
    }
};

// Define the media query
const mediaQuery = window.matchMedia('(max-width: 700px)');

// Call the function initially to check if the media query matches
handleMediaQuery(mediaQuery);

// Add a listener to call the function whenever the media query matches or unmatches
mediaQuery.addListener(handleMediaQuery);






/************************************
 *         UTILITY FUNCTIONS
 ************************************/

/**
 * Returns the great-grandfather element of a given DOM element.
 * 
 * @param {HTMLElement} element - The DOM element to start from.
 * @returns {HTMLElement} - The great-grandfather element of the input element.
 */
function greatGrandFather(element) {
    return element.parentElement.parentElement.parentElement;
}


/**
 * Checks if a given DOM element's class name contains the word "comment".
 * 
 * @param {HTMLElement} element - The DOM element to check.
 * @returns {boolean} - True if the element's class contains the word "comment", false otherwise.
 */
function hasCommentClass(element) {
    return element.classList.contains("comment") ? true : false;
}


/**
 * This function inserts a new DOM element after a selected element in the DOM tree.
 * 
 * @param {HTMLElement} newElement - The new DOM element to be inserted.
 * @param {HTMLElement} selectedElement - The existing DOM element after which the new element will be inserted.
 */
function insertAfterMe(newElement, selectedElement) {
    selectedElement.insertAdjacentElement("afterend", newElement);
}


/**
 * This function creates a DOM Element based on the string "html"
 * 
 * @param {string} html - html syntax in string format
 * @param {HTMLElement} - the DOM Element 
 */
function createDOMElement(html) {
    const range = document.createRange();
    const fragment = range.createContextualFragment(html);
    return fragment.firstChild;
}


/**
 * This function calculates the time difference 
 * between the current date and a given date string 
 * and returns a string describing the difference in years, months, weeks,
 * days, hours, minutes, or seconds without accounting for leap years. 
 * 
 * While ignoring leap years introduces a small error in the result, 
 * this error is negligible for most practical purposes, 
 * and does not significantly affect the accuracy of the output. 
 * Therefore, accounting for leap years is not necessary in this function.
 * 
 * @param {string} DateString - A string representing the date (e.g. "2022-01-01")
 * @returns {string} - A string representing the time difference between the two dates
 */
function getDateDiff(DateString) {
    const now = new Date();
    const then = new Date(DateString);
    const diff = Math.abs(now.getTime() - then.getTime());
    const units = [
        { label: 'year', divisor: 365 * 24 * 60 * 60 * 1000 },
        { label: 'month', divisor: 30 * 24 * 60 * 60 * 1000 },
        { label: 'week', divisor: 7 * 24 * 60 * 60 * 1000 },
        { label: 'day', divisor: 24 * 60 * 60 * 1000 },
        { label: 'hour', divisor: 60 * 60 * 1000 },
        { label: 'minute', divisor: 60 * 1000 },
        { label: 'second', divisor: 1000 },
    ];

    for (const unit of units) {
        const count = Math.floor(diff / unit.divisor);
        if (count > 0) {
            return `${count} ${unit.label}${count === 1 ? '' : 's'} ago`;
        }
    }

    return 'now';

}


/**
 * This functions checks if user has already voted (upvote or downvote)
 * for a particular comment via the comment ID.
 * 
 * Every comment user has voted for has their ID stored 
 * in an array on the browser local storage
 * 
 * @param {Number} id - the id of the comment section
 * @return {Boolean}
 */
function isVotedFor(id) {

    // list of comment section voted for; thier id's (string format)
    let votedForList = localStorage.getItem("votedFor");

    if (votedForList) {
        // list as javascript array
        votedForList = JSON.parse(votedForList);

        // return true if id present
        if (votedForList.includes(id)) return true;
    }

    return false;
}


/**
 * This function adds an comment id to the browser local storage
 * list of comment section id already voted for.
 * 
 * @param {Number} id - id of the comment section element
 */
function voteFor(id) {

    // list of comment section voted for
    let votedForList = JSON.parse(localStorage.getItem("votedFor"));

    // add id to list if id absent
    votedForList.push(id);
    localStorage.setItem("votedFor", JSON.stringify(votedForList));

}


/**
 * This function makes it so, when hovererd on the icon it is given
 * e.g the plus icon or the minus icon in the comment score section,
 * all mouse over effect is disabled
 * 
 * @param {HTMLElement} icon
 */
function disableButtonEffect(icon) {
    // make the icon visually unclikable
    icon.classList.remove("clickable");

}






/********************************************
 * FUNCTIONS FOR GENERATING WEBPAGE ELEMENTS
 ********************************************/

/**
 * This function creates a reply-comment section with a div element with class "reply-comment"
 * which houses a user image, a text area for comments, and a send button.
 * 
 * @param {object} DATA - This object contains data about the current user.
 * we would destructure it to obtain the user profile image
 * @returns {HTMLElement} - The HTMLElement depicting the comment section.
 */
function generateReplyCommentSection({ currentUser: { image: { png } } }) {
    // create reply-comment section DOM Element
    let divElement = createDOMElement(`<div class="reply-comment">
        <img class="comment-photo" src="${png}">
        <textarea class="comment-area page-font-styles clickable" placeholder="Add a comment..."></textarea>
        <button class="comment-send-button page-font-styles clickable">SEND</button>
    </div>`);

    return divElement;
}


/**
 * a replyCommentSection is a div element with class "reply-comment show"
 * that contains "user profile picture", "user comment message", "send button"
 * 
 * This Function would place this data into an Object Notation
 * with properties "username", "content", "createdAt", "user:{image:{png}}"
 * this is based on how a commentInformation object would look like
 * 
 * @param {HTMLElement} replyCommentSection 
 * @returns {Object} 
 *  */
function generateCommentInformation(replyCommentSection) {
    let commentInformation = {
        content: replyCommentSection.querySelector("textarea").value,
        createdAt: String((new Date()).toJSON()),
        user: {
            image: {
                png: replyCommentSection.querySelector("img").getAttribute("src")
            }
        },
        score: 0,
        replies: []

    }

    // extract the username info from the image path
    commentInformation["user"]["username"] = commentInformation.user.image.png.match(/image-(.+).png/)[1];

    return commentInformation;

}


/**
 * Generate a comment score section element with an optional score value.
 * 
 * @param {object} commentInformation - Object contains the information about comment.
 * we destructure it to obtain the score information,
 * if an empty object is given, the score value will default to 0.
 * 
 * @returns {HTMLElement} The generated comment score section element.
 */
function generateCommentScoreSection({ score = 0, id }) {

    // create comment-score section DOM Element
    let divElement = createDOMElement(`<div class="comment-score">
    <svg class="icon-plus clickable" width="11" height="11" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/>
    </svg>
    <div class="score-value bold blue">${score}</div>
    <svg class="icon-minus clickable" width="11" height="3" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/>
    </svg>
  </div>`);

    // to keep the aesthetic of the comment-score section quite slim
    if (score > 0 && score < 1000) {
        divElement.querySelector(".score-value").classList.add("small-font-size");
    }
    else {
        divElement.querySelector(".score-value").classList.add("very-small-font-size");
    }


    // this is a bit tricky to understand.
    // once a comment section is dynamically generated
    // there is tendency for the viewer of the webpage 
    // to have already voted for the comment section

    // if viewer has voted for the comment section,
    // the icons of the commment-score section should no longer be clickable
    if (isVotedFor(id)) {
        disableButtonEffect(divElement.firstElementChild);
        disableButtonEffect(divElement.lastElementChild);
    }

    return divElement;
}


/**
 * Generate comment info section button element 
 * there are three types of this button element that can be in comment info
 * "delete button", "reply button", "edit button".
 * 
 * @param {string} buttonType - The type of button to generate.
 * @returns {HTMLElement} The generated comment info section button element.
 */
function generateCommentInfoButtonSection(buttonType) {
    // create comment info button section DOM Element 
    let divElement;

    // add class & inner html to the divElement based on buttonType
    switch (buttonType) {
        case "delete":
            divElement = createDOMElement(`<div type="button" class="delete-button clickable bold red" data-bs-toggle="modal" data-bs-target="#myModal">
                    <img src="./images/icon-delete.svg">
                    <span>Delete</span>
                </div>
            `);

            // make delete button a bootstrap modal button
            divElement.setAttribute("type", "button");
            divElement.setAttribute("data-bs-toggle", "modal");
            divElement.setAttribute("data-bs-target", "#myModal");
            break;
        case "reply":
            divElement = createDOMElement(`<div class="reply-button clickable bold blue">
                    <img src="./images/icon-reply.svg">
                    <span>Reply</span>
                </div>
            `);
            break;
        case "edit":
            divElement = createDOMElement(`<div class="edit-button clickable bold blue">
                    <img src="./images/icon-edit.svg">
                    <span>Edit</span>
                </div>
            `);
            break;
    }

    // return the divElement
    return divElement;
}


/**
 * Generate comment info section element 
 * this section consists of the "comment-photo", "comment-name", "comment-time"
 * and one or two "comment interaction buttons".
 * 
 * @param {object} commentInformation - Object contains the information about comment. 
 * we destructure the object to obtain information we need.
 * 
 * @returns {HTMLElement} The generated comment info section element.
 */
function generateCommentInfoSection({ user: { image: { png }, username }, createdAt }) {
    // create comment info section DOM Element
    let divElement = createDOMElement(`<div class="comment-info">
        <img class="comment-photo" src="${png}">
        <span class="comment-name bold">${username}</span>
        <span class="comment-time gray">${getDateDiff(createdAt)}</span>
  </div>`);


    /* add the comment interaction buttons to the divElement */
    // if it is the current user that has this comment info section; delete button & edit button
    if (username == getDatabase()["currentUser"]["username"]) {
        divElement.querySelector('span.comment-name').classList.add("current-user");
        divElement.appendChild(generateCommentInfoButtonSection("delete"));
        divElement.appendChild(generateCommentInfoButtonSection("edit"));
    }

    // if not, maybe using this function to generate comment info section for someone else; reply button
    else {
        divElement.appendChild(generateCommentInfoButtonSection("reply"));
    }

    // return the divElement
    return divElement;
}


/**
 * Generate comment message section element 
 * this section consists of the comment "message content" 
 * and the comment "recipient username".
 * 
 * @param {object} commentInformation - Object contains the information about comment. 
 * we destructure the object to obtain information we need.
 * i.e "message content" & "recipient username".
 * 
 * @returns {HTMLElement} The generated comment message section element.
 */
function generateCommentMessageSection({ content, replyingTo = "" }) {
    // create comment info section DOM Element
    let divElement = createDOMElement(`<div class="comment-message gray">
        <span class="bold blue">${replyingTo}</span> ${content}
    </div>`);

    // CASE: function used to generate comment message section for a comment replying to another comment
    if (replyingTo != "") {
        divElement.firstElementChild.classList.add("reply-to");
    }

    // return the Element
    return divElement;
}


/**
 * Generate comment block section element 
 * this section consists of the comment-info section 
 * and the comment-message section.
 * 
 * @param {object} commentInformation - Object contains the information about comment. 
 * @returns {HTMLElement} The generated comment block section element.
 */
function generateCommentBlockSection(commentInformation) {
    // create comment block div container
    let divElement = createDOMElement(`<div class="comment-block"></div>`);

    // add Comment Info Section to the Comment block
    divElement.appendChild(generateCommentInfoSection(commentInformation));

    // add Comment Message Section to the Comment block
    divElement.appendChild(generateCommentMessageSection(commentInformation));

    // return the Element
    return divElement;
}


/**
 * Generate comment section element.
 * a comment section consists of a "comment score section"
 * and a "comment block section".
 * 
 * @param {object} commentInformation - Object contains the information about comment.
 * @returns {HTMLElement} The generated comment section element.
 */
function generateCommentSection(commentInformation) {
    // create Comment section div Element
    let divElement = createDOMElement(`<div class="comment"></div>`);

    // a hidden tag that specifies the id of the comment section
    divElement.appendChild(createDOMElement(`<span class="hide id">${commentInformation["id"]}<span>`))

    // add the comment score section
    divElement.appendChild(generateCommentScoreSection(commentInformation));

    // add the comment block section
    divElement.appendChild(generateCommentBlockSection(commentInformation));

    // return the Element
    return divElement;

}


/**
 * Generate reply container section element.
 * every comment section should have a reply container 
 * where replies to the comment will be rendered
 * a comment with no replies would have no reply container YET.
 * 
 * 
 *  @returns {HTMLElement} The generated reply container section element.
 */
function generateReplyContainerSection() {
    // create reply container section DOM Element
    let divElement = createDOMElement(`<div class="reply-container">
        <div class="reply-vertical-line"></div>
        <div class="comment-replies"></div>
    </div>`);

    // return the Element
    return divElement;
}


/**
 * This function generates an Edit Section Element. 
 * When the "edit" button is clicked, the initial comment message section 
 * would be converted to an edit section 
 * consisting of a text area and an update button. 
 * 
 * The update button would update the comment message 
 * with the new content entered in the text area 
 * and convert the "edit section element" back to a "comment message section element". 
 * 
 * @param {string} message - The content of the comment message section
 * @param {string} replyingTo - The recipient username of the comment message
 * 
 * @return {Object} - An object containing two properties:
 *      - editSection: The generated Edit Section Element
 *      - updateButton: The update button of the Edit Section Element
 */
function generateEditSection(message, replyingTo) {

    let editSection = createDOMElement(`<div style="display:flex; flex-direction:column;"><textarea class="comment-area page-font-styles clickable" placeholder="Add a comment..."></textarea>
    <button class="comment-update-button page-font-styles clickable">UPDATE</button></div>`);

    editSection.querySelector("textarea").value = message.replace(/\n\s+/g, " ");

    // return the edit section element & and the update button
    let updateButton = editSection.querySelector(".comment-update-button");
    return { editSection, updateButton };

}






/********************************************
 * FUNCTIONS FOR HANDLING BUTTON INTERACTIONS
 ********************************************/

/**
 * Obtains the Score value of a comment section and increments it by one
 */
function increaseCommentScore(commentSection) {

    let commentScore = commentSection.querySelector(".score-value");

    let newScore = Number(commentScore.textContent.trim());

    commentScore.textContent = `${newScore + 1}`;

    updateDataIncreaseScore(commentSection);
}


/**
 * Obtains the Score value of a comment section and decrements it by one
 */
function decreaseCommentScore(commentSection) {

    let commentScore = commentSection.querySelector(".score-value");

    let newScore = Number(commentScore.textContent.trim());

    if (newScore > 0) commentScore.textContent = `${newScore - 1}`;

    updateDataDecreaseScore(commentSection);
}


/**
 * This function is an Event Handler for the Edit button 
 * it replaces the "comment message section" with an "edit section"
 * which instead consist of a textarea element and and update button
 * 
 * we also added a feature, such that whilst we are is editing 
 * if click outside the editing box, it would automatically be updated
 * 
 * @param {HTMLElement} editButton - The Edit button section element.
 */
function handleEditButton(editButton) {

    // comment section of edit button
    let commentSection = greatGrandFather(editButton);

    // comment message section element 
    let commentMessageSection = commentSection.querySelector(".comment-message");
    if (!commentMessageSection) return;

    // message
    let message = commentMessageSection.querySelector("span").nextSibling.textContent.trim();

    // replying to
    let replyingTo = commentMessageSection.querySelector("span").textContent.trim();

    // comment area section element (textarea element)
    let { editSection, updateButton } = generateEditSection(message, replyingTo);

    // replace the comment message section with the edit section
    commentMessageSection.parentNode.replaceChild(editSection, commentMessageSection);

    // Updates edit if we click outside the edit box
    const handleClick = (event) => {
        // Element that trigger the click event
        let targetElement = event.target;

        // when edit button initial click triggers it, nothing should happen
        if (targetElement.parentElement == editButton) return;

        // when the update button is clicked OR when outside the edit section is clicked
        // remove the click event on the body AND update message
        if (targetElement == updateButton || !editSection.contains(targetElement)) {
            document.querySelector("body").removeEventListener('click', handleClick);
            handleUpdateButton(updateButton, replyingTo, message);
        }
    }

    document.querySelector("body").addEventListener('click', handleClick);

}


/**
 * This function is an Event Handler for the "update button" in the "edit section"
 * it generate a new "comment message section" based on the new content
 * and replaces the "edit section"
 * 
 * @param {HTMLElement} updateButton - The update button element.
 * @param {string} replyingTo - the recipient username of the comment
 */
function handleUpdateButton(updateButton, replyingTo, previousMessage) {
    // get the edited message
    let editedMessage = updateButton.previousElementSibling.value;

    // parent of update Button
    let commentArea = updateButton.parentNode;

    // generate Comment Message Section for edited message
    let commentMessage
    if (editedMessage == "") {
        commentMessage = generateCommentMessageSection({ content: previousMessage, replyingTo });
    } else {
        commentMessage = generateCommentMessageSection({ content: editedMessage, replyingTo });
    }


    // replacing the edit section
    commentArea.parentNode.replaceChild(commentMessage, commentArea);

    // 
    updateDataEditComment(
        commentMessage.parentNode.parentNode,
        commentMessage.querySelector("span").nextSibling.textContent.trim()
    );
}


/**
 * This function is an Event Handler for the "delete button" in the "edit section"
 * this button is actually linked to a bootstrap modal component
 * additionally when this button is clicked we add a class called "show-modal" to it
 * 
 * this "show-modal" class acts as a tag. HOW?
 * on the modal, there is a "yes, delete" button 
 * this button would dismiss the modal,
 * additionally we would add an Event Handler that would obt
 * then remove the comment section of the show-modal element. 
 * 
 * @param {HTMLElement} deleteButton 
 * 
 */
function handleDeleteButton(deleteButton) {
    deleteButton.classList.add("show-modal");
}

function handleModalDeleteButton() {
    // the delete button that triggered the delete modal
    let showModalDeleteButton = document.querySelector(".show-modal");

    // comment section element of the delete button
    let commentSection = greatGrandFather(showModalDeleteButton);

    // remove comment section information from our data of comments
    updateDataDeleteComment(commentSection);

    // remove comment section from the DOM
    commentSection.remove();
}

function handleModalDontDeleteButton() {
    // the delete button that triggered the delete modal
    let showModalDeleteButton = document.querySelector(".show-modal");

    // remove "show-modal" tag since the modal is now gone
    showModalDeleteButton.classList.remove("show-modal");

}


/**
 * This function is an event handler.
 * it increases the score of the comment section
 * which the plus icon is clicked.
 * 
 * @param {HTMLElement} plusIcon - HTMLElement containing the plus icon for upvoting
 */
function handleUpvoteButton(plusIcon) {
    // get the comment section of the plus icon
    let commentSection = plusIcon.parentNode.parentNode;

    // if webpage in mobile layout
    if (!commentSection.classList.contains("comment")) commentSection = plusIcon.parentNode.parentNode.parentNode.parentNode;

    // ensures user can only vote once
    let commentID = getCommentSectionID(commentSection);
    if (!isVotedFor(commentID)) {
        // increase the score value of the comment section
        increaseCommentScore(commentSection);

        // add comment ID to list of voted for comments
        voteFor(commentID);

        // putt off all button effect of the plus & minus icon
        disableButtonEffect(plusIcon);
        disableButtonEffect(plusIcon.nextElementSibling.nextElementSibling);
    }
}


/**
 * This function is an event handler.
 * it decreases the score of the comment section
 * which the minus icon is clicked.
 * 
 * @param {HTMLElement} minusIcon - HTMLElement containing the minus icon for upvoting
 */
function handleDownvoteButton(minusIcon) {
    // get the comment section of the plus icon
    let commentSection = minusIcon.parentNode.parentNode;

    // in mobile mode, the grand father of icon is not the comment section element
    if (!commentSection.classList.contains("comment")) commentSection = commentSection.parentNode.parentNode;

    // ensures user can only vote once
    let commentID = getCommentSectionID(commentSection);
    if (!isVotedFor(commentID)) {

        // increase the score value of the comment section
        decreaseCommentScore(commentSection);

        // add comment ID to list of voted for comments
        voteFor(commentID);

        // make plus & minus icon unclikable
        disableButtonEffect(minusIcon);
        disableButtonEffect(minusIcon.previousElementSibling.previousElementSibling);

    }
}


/**
 * This function is called when a reply button is clicked.
 * it adds a comment section below the comment element associated with the reply button
 * 
 * @param {HTMLElement} targetElement - The Dom Element after which the reply comment Section will be added.
 * @return {HTMLElement} replyCommentSection
 */
function addReplyCommentSectionAfter(GGFather) {
    // obtain a reply comment section element
    let replyCommentSection = generateReplyCommentSection(getDatabase());

    // insert reply comment section immediately after grand parent element
    insertAfterMe(replyCommentSection, GGFather);

    // make the reply comment show, transitioning in smoothly
    setTimeout(() => {
        replyCommentSection.classList.add("show");
    }, 1);

    // return the reply comment section element
    return replyCommentSection;
}






/********************************************
 * FUNCTIONS FOR MANIPULATING THE DATABASE
 ********************************************/

/**
 * This is an higher order function that 
 * obtain the comment database from the local storage of the browers,
 * runs a function on the database to edit the database
 * 
 * @param {Function} editFunction - 
 */
function editDatabase(editFunction) {

    // obtain the database from browser local storage
    let DATA = JSON.parse(localStorage.getItem("DATA"));

    // run edit function on the DATA
    let returnValue = editFunction(DATA);

    // place edited data in the broser local storage
    localStorage.DATA = JSON.stringify(DATA);

    return returnValue;

}


/**
 * This function returns the database that is on the browser local storage as an object
 */
function getDatabase() {
    return JSON.parse(localStorage.getItem("DATA"));
}


/**
 * When a new Comment information is created,
 * a unique identification number is given to it.
 */
function getNewID() {

    let newID = editDatabase((DATA) => {
        DATA["totalComments"] += 1;
        return DATA["totalComments"];
    });
    return newID;
}


/**
 * This function gets the id of a comment section element
 * 
 * @param {HTMLElement} commentSection - HTMLElement depicting a comment section
 */
function getCommentSectionID(commentSection) {
    return Number(commentSection.querySelector(".id").textContent.trim());
}


/**
 * This function returns the index of a comment information
 * whose "id" property is the same as the "id" parameter
 * 
 * @param {Array} commentList - an array of comment information(object)
 * @param {Number} id 
 * @returns {Number} - returns the index of the object
 */
function searchForCommentViaID(commentList, id) {
    return commentList.findIndex((commentInformation) => commentInformation["id"] == id);
}

/**
 * This function adds information about a comment into our data of comments.
 * 
 * through a reply comment section, a comment which is a reply is generated.
 * the reply comment section is always below the comment it is replying to.
 * 
 * a reply comment can come in two ways,
 * it is either replying to a standard comment OR
 * it is replying to a comment that is replying to another comment 
 * i.e it is replying to a reply comment
 * 
 * in the first case;
 * the reply comment "comment information" 
 * would be added (at the back) to the replies property
 * of the standard comment "comment information"
 * 
 * in the second case;
 * the reply comment "comment information"
 * would be added beside the reply comment "comment information" it is replying to
 * 
 * @param {Object} commentInformation - an object whose property contains information about a comment
 * @param {HTMLElement} replyCommentSection - html element of the reply comment section used to generate the comment
 */
function updateDataAddComment(commentInformation, replyCommentSection) {
    // get the comment section that would receive the reply
    let commentSection = replyCommentSection.previousElementSibling;

    // get the id of the commentSection
    let id = getCommentSectionID(commentSection);

    // comment information is a reply to a comment which is a reply to another.
    if (commentSection.matches(".reply-container *")) {

        editDatabase((DATA) => {
            for (comment of DATA["comments"]) {
                // search for the comment section information in list of replies
                let index = searchForCommentViaID(comment["replies"], id);

                // place new comment information next to the comment section information
                if (index >= 0) {
                    comment["replies"].splice(index + 1, 0, commentInformation);
                }
            }

        });
    }

    // comment information is a reply to a comment which is not a reply to another
    else {
        editDatabase((DATA) => {
            // search for the comment section information in list of comments
            let index = searchForCommentViaID(DATA["comments"], id);

            // place new comment information inside the comment section information list of replies
            if (index >= 0) {
                DATA["comments"][index]["replies"].push(commentInformation);
            }
        })
    }
}


/**
 * This Function deletes a comment section information from the data of comment
 * it uses the id of the comment section element to know which comment information
 * in the data of comments to delete
 * 
 * @param {HTMLElement} commentSection -  HTMLElement depicting a comment section
 */
function updateDataDeleteComment(commentSection) {
    // get the id of the comment section
    let id = getCommentSectionID(commentSection);

    // get the comment information that correspond to that id and delete it
    // if comment section is a reply to another comment
    if (commentSection.matches(".reply-container *")) {
        editDatabase((DATA) => {
            for (comment of DATA["comments"]) {
                // search for the comment section information in list of replies
                let index = searchForCommentViaID(comment["replies"], id);

                // delete the comment section information
                if (index >= 0) {
                    comment["replies"].splice(index, 1);
                }
            }
        })
    }

    // if the comment section is not a reply
    else {
        editDatabase((DATA) => {
            // search for the comment section information in list of comments
            let index = searchForCommentViaID(DATA["comments"], id);

            // delete the comment section information
            if (index >= 0) {
                DATA["comments"].splice(index, 1);
            }
        })
    }
}


/**
 * This Function updates the data of comment,
 * by obtain the comment information that corresponds to the comment section element (searching by id)
 * and increasing the score value of the comment information by one
 * 
 * @param {HTMLElement} commentSection - HTMLElement corresponding to the comment section
 */
function updateDataIncreaseScore(commentSection) {

    // get the id of the comment section
    let id = getCommentSectionID(commentSection);

    editDatabase((DATA) => {
        // search through every comment information in the data for matching id
        for (comment of DATA["comments"]) {

            // check the comment
            if (comment["id"] == id) {
                comment["score"] += 1;
            }

            // check the comment list of replies
            else {
                let index = searchForCommentViaID(comment["replies"], id);
                if (index >= 0) comment["replies"][index]["score"] += 1;
            }
        }
    })

}


/**
 * This Function updates the data of comment,
 * by obtain the comment information that corresponds to the comment section element
 * and decreasing the score value of the comment information by one
 * 
 * @param {HTMLElement} commentSection - HTMLElement corresponding to the comment section
 */
function updateDataDecreaseScore(commentSection) {

    // get the id of the comment section
    let id = getCommentSectionID(commentSection);

    editDatabase((DATA) => {
        // search through every comment information in the data for matching id
        for (comment of DATA["comments"]) {

            // check the comment
            if (comment["id"] == id) {
                if (comment["score"] > 0) comment["score"] -= 1;
            }

            // check the comment list of replies
            else {
                let index = searchForCommentViaID(comment["replies"], id);
                if (index >= 0) {
                    if (comment["score"] > 0) comment["replies"][index]["score"] -= 1;
                };
            }
        }
    })

}


/**
 * This Function updates the data of comment,
 * by obtain the comment information that corresponds to the comment section element
 * and changing the comment content of the comment information.
 * 
 * @param {HTMLElement} commentSection - HTMLElement corresponding to the comment section
 * @param {string} newContent - new content for the comment
 */
function updateDataEditComment(commentSection, newContent) {

    // get the id of the comment section
    let id = getCommentSectionID(commentSection);

    editDatabase((DATA) => {
        // search through every comment information in the data for matching id
        for (comment of DATA["comments"]) {

            // check the comment
            if (comment["id"] == id) {
                comment["content"] = newContent;
            }

            // check the comment list of replies
            else {
                let index = searchForCommentViaID(comment["replies"], id);
                if (index >= 0) {
                    comment["replies"][index]["content"] = newContent;
                };
            }
        }
    })
}







/********************************************
 *      SETTING UP THE EVENT HANDLERS
 ********************************************/

/**
 * Set the Event handler of the reply-button
 */
document.querySelectorAll(".reply-button").forEach((replyButton) => {
    replyButton.addEventListener('click', () => {

        // comment section element of the reply button
        let GGFather = greatGrandFather(replyButton);

        // if the reply button has been clicked once; 
        // nothing happens if clicked again and again 
        // unless the event handler of the first is done.
        // we know if it has been clicked once if the comment section nextElementSibling is a reply comment section
        let nextElementSibling = GGFather.nextElementSibling;
        if (nextElementSibling && nextElementSibling.classList.contains("reply-comment")) return;

        // add a reply comment section after the comment section element of the reply button
        const replyCommentSection = addReplyCommentSectionAfter(GGFather);

        // if webpage in mobile format
        if (mediaQuery.matches) convertReplyCommentSectionToMobile(replyCommentSection);


        /**
         * Adding a Feature, such that 
         * if there is no content in the reply comment section
         * and the user clicks on an area outside the reply comment section
         * the generated reply comment section will be deleted
         * 
         * we will place a click event handler on the body of the html
         * 
         */
        const handleClick = (event) => {
            // Get the Element that trigger the click event
            let targetElement = event.target;

            // Exit function if clicked element is the reply button. 
            // since this initial adds click adds the reply comment section
            if (targetElement.parentElement == replyButton) return;


            // when no content and click area is outside
            if ((replyCommentSection.querySelector("textarea").value == "") && (!replyCommentSection.contains(targetElement))) {

                // Removes the reply comment section
                replyCommentSection.remove();

                // Remove the click handler on body
                document.querySelector("body").removeEventListener('click', handleClick);
            }
        }


        /**
         * Because this replyCommentSection is dynamically generated by javascript
         * we have to add the event listener for the send button of the replyCommentSection
         * right here, right now 
         */
        const handleSendButton = () => {

            // return; if textarea element is empty
            if (replyCommentSection.querySelector("textarea").value === "") return;

            // generate comment information from the reply comment section
            // this is an object with attributes that describe the comment
            let commentInformation = generateCommentInformation(replyCommentSection);

            // add the "replyingTo" property to the commentInformation
            commentInformation["replyingTo"] = GGFather.querySelector(".comment-name").textContent;

            // add "id" property to the commentInformation
            commentInformation["id"] = getNewID();

            // use comment information to create a comment section element
            let commentSection = generateCommentSection(commentInformation);

            // Event handler for the edit button
            let editButton = commentSection.querySelector(".edit-button");
            editButton.addEventListener('click', () => {
                handleEditButton(editButton);
            });

            // Event handler for the delete button
            let deleteButton = commentSection.querySelector(".delete-button");
            deleteButton.addEventListener('click', () => {
                handleDeleteButton(deleteButton);
            });

            // Event handler for the upvote button
            let upvoteButton = commentSection.querySelector(".icon-plus");
            upvoteButton.addEventListener('click', () => {
                handleUpvoteButton(upvoteButton);
            })

            // Event handler for the downvote button
            let downvoteButton = commentSection.querySelector(".icon-minus");
            downvoteButton.addEventListener('click', () => {
                handleDownvoteButton(downvoteButton);
            })

            // if in mobile mode, change comment section structure
            if (mediaQuery.matches) {
                convertCommentSectionToMobile(commentSection);
            }

            // if the comment to reply to
            // is also a reply to another comment
            if (replyCommentSection.matches('.reply-container *')) {
                insertAfterMe(commentSection, replyCommentSection);
            }

            // if the comment to reply to
            // is not a reply to another comment
            else {

                // if the comment to reply to 
                // does not have a reply container, insert one
                if (!replyCommentSection.nextElementSibling.classList.contains("reply-container")) {
                    insertAfterMe(generateReplyContainerSection(), replyCommentSection);
                }

                // place comment section inside reply container's "comment-replies" element 
                replyCommentSection.nextElementSibling.querySelector(".comment-replies").appendChild(commentSection);
            }

            // update DATA; add comment information
            updateDataAddComment(commentInformation, replyCommentSection);

            // remove reply comment section
            replyCommentSection.remove();
        };


        // Add the click handler to the body element
        document.querySelector("body").addEventListener('click', handleClick);

        // Add click handler to the send button of the reply comment section
        replyCommentSection.querySelector(".comment-send-button").addEventListener('click', handleSendButton);

    })
})


/**
 * Set the Event Handler of the Send button
 */
document.querySelectorAll(".comment-send-button").forEach((CommentSendButton) => {
    CommentSendButton.addEventListener('click', (event) => {

        // obtain the reply comment section element
        let replyCommentSection;
        if (mediaQuery.matches) replyCommentSection = CommentSendButton.parentNode.parentNode;
        else replyCommentSection = CommentSendButton.parentNode;


        // return; if textarea element is empty
        if (replyCommentSection.querySelector("textarea").value === "") return;

        // generate comment information from the reply comment section
        let commentInformation = generateCommentInformation(replyCommentSection);

        // add id to the commentInformation
        commentInformation["id"] = getNewID();

        // reset the textarea value
        replyCommentSection.querySelector("textarea").value = "";

        // create a comment section element from comment information
        let commentSection = generateCommentSection(commentInformation);

        // Event handler for the edit button
        let editButton = commentSection.querySelector(".edit-button");
        editButton.addEventListener('click', () => {
            handleEditButton(editButton);
        });

        // Event handler for the delete button
        let deleteButton = commentSection.querySelector(".delete-button");
        deleteButton.addEventListener('click', () => {
            handleDeleteButton(deleteButton);
        });

        // Event handler for the upvote button
        let upvoteButton = commentSection.querySelector(".icon-plus");
        upvoteButton.addEventListener('click', () => {
            handleUpvoteButton(upvoteButton);
        })

        // Event handler for the downvote button
        let downvoteButton = commentSection.querySelector(".icon-minus");
        downvoteButton.addEventListener('click', () => {
            handleDownvoteButton(downvoteButton);
        })

        // if in mobile mode, change comment section structure
        if (mediaQuery.matches) {
            convertCommentSectionToMobile(commentSection);
        }

        // replace the reply comment section with the comment section
        replyCommentSection.parentNode.insertBefore(commentSection, replyCommentSection);

        // add comment information to data of comments
        editDatabase((DATA) => {
            DATA["comments"].push(commentInformation);
        })
    })

});


/**
 * Set the Evenet Handler for comment Edit button
 *
 */
document.querySelectorAll(".edit-button").forEach((editButton) => {
    editButton.addEventListener('click', () => {
        handleEditButton(editButton);
    })
});


/**
* Set the Evenet Handler of the Delete button
*
*/
document.querySelectorAll(".delete-button").forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
        handleDeleteButton(deleteButton);
    });
});


/**
 * Set the Event Handler for the Modal delete button
 */
document.querySelector(".yes-delete-button").addEventListener('click', () => {
    handleModalDeleteButton();
});


/**
 * Set the Event Handler for the Modal dont delete button
 */
document.querySelector(".no-cancel-button").addEventListener('click', () => {
    handleModalDontDeleteButton();
});

/** 
 * Set the Event Handler for Upvoting
 */
document.querySelectorAll(".icon-plus").forEach((plusIcon) => {
    plusIcon.addEventListener('click', () => {
        handleUpvoteButton(plusIcon);
    })

})

/** 
 * Set the Event Handler for Downvoting
 */
document.querySelectorAll(".icon-minus").forEach((minusIcon) => {
    minusIcon.addEventListener('click', () => {
        handleDownvoteButton(minusIcon);
    })

})



