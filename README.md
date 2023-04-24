<p align="center">
<img src="./ReadMe-Images/Front-End-Project-banner.png">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML-E34F26.svg" alt="HTML badge" style="height: 25px;">
  <img src="https://img.shields.io/badge/CSS-1572B6.svg" alt="CSS badge" style="height: 25px;"> 
  <img src="https://img.shields.io/badge/JS-F7DF1E.svg" alt="JS badge" style="height: 25px;">
  <img src="https://img.shields.io/badge/NoSQL-4DB33D.svg" alt="NoSQL badge" style="height: 25px;">
  <img src="https://img.shields.io/badge/Bootstrap-563D7C.svg" alt="Bootstrap badge" style="height: 25px;">
  <img src="https://img.shields.io/badge/CSS_Normalization-008080.svg" alt="CSS Normalization badge" style="height: 25px;">
  <img src="https://img.shields.io/badge/Desktop_First_Design-333333.svg" alt="Desktop First Design badge" style="height: 30px;">
</p>



# Interactive Comment Section

My project is an interactive comment section that allows users to:
- Create new comments
- Edit existing comments
- Delete comments
- Upvote/downvote comments
- Reply to comments
- View all comments
- View comments by specific users
- Desktop/Mobile responsive design

It features a dynamic creation of the comments from a json data stored in the browsers local storage. This data consists of all the comments and their replies

It features desktop/mobile responsivity for an optimal user experience. 
<br /><br />


## Project Screenshots

![App Screenshot](./ReadMe-Images/rsz_11desktop-design.jpg)


![App Screenshot](./ReadMe-Images/rsz_1rsz_active-states.jpg)

<center>
<img src="./ReadMe-Images/rsz_mobile-design.jpg">
</center>




## Project Challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: Building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Use timestamps and dynamically track the time since the comment or reply was posted.
- **Bonus**: Implement a single voting feature; such that once a user has voted for a comment, further voting is not allowed.
<br /><br />




## Project Expected behaviour

- First-level comments should be ordered by their score, whereas nested replies are ordered by time added.
- Replying to a comment adds the new reply to the bottom of the nested replies within that comment.
- A confirmation modal should pop up before a comment or reply is deleted.
- Adding a new comment or reply uses the `currentUser` object from within the `data.json` file.
- You can only edit or delete your own comments and replies.
<br /><br />




## Project Design

This project is fundamentally made of three elements:
- a comment section element
    - comment-ID section
    - comment-info section
    - comment-message section
- a reply comment section element
    - reply vertical line
    - comment-replies section
- a reply container section element


<img src="./ReadMe-Images/rsz_comment_section_element.png" style="width:600px; height:auto">

<img src="./ReadMe-Images/rsz_comment-section-element-mobile_view_.png" style="width:600px; height:auto">

<img src="./ReadMe-Images/rsz_11rsz_2reply_container_section_element.png" style="width:600px; height:auto">

<img src="./ReadMe-Images/rsz_reply_comment_section_element.png" style="width:600px; height:auto">

<img src="./ReadMe-Images/Data1.svg" style="width:600px; height:auto">
<br /><br />




## Project WorkFlow


#### 1. Initial Structure and Styles
this is done with pure html and css.<br /> the aim is to know what html elements & classes i need,<br /> to create each element that would make up the page before any dynamic creation.

<br />

#### 2. Event Handlers for all interactive buttons
- the comment reply button
- the comment send-reply button
- the edit button
- the delete button
- the upvote & downvote button (single voting feature)

<br />

#### 3. Dynamic Tracking of the comment/reply post time
this feature makes it possible so that for each comment,<br /> you would have a clue of the exact time it was posted <br /> seconds ago, hours ago, months ago e.t.c

<br />

#### 4. Dynamic Rendering of the comments
having the structure, styles and event handlers all set <br /> it was time to use javascript to render the webpage.<br /> For now, i loaded the json in the working directory which contains comments data,<br /> into a variable called DATA as a javascript Object.
<br /><br /> Using functional programming, i could generate HTMLElements<br /> for each comment in the data and added it to the DOM, rendering the comments.

<br />

#### 5. Mobile Responsiveness Implementation
As seen in the screenshots, the "COMMENT SECTION ElEMENT"<br />
and the "REPLY COMMENT SECTION ELEMENT"<br /> for both desktop view and mobile view<br /> has slightly different structure to the mobile view.

Using a media querry of (max-width: 700px)<br />
i was able use javascript to querry the page for its widths <br />
then if it satifies the media querry, it renders the page in mobile form.

<br />

#### 6. Local Storage of Comment Data
Building a purely front-end project, <br />
the plan was to store the comments data <br />
in the local storage of user's browsers.<br />
it is from this storage the comments are <br />
Created, Read, Updated and Deleted.
<br /><br />




##  Project Spotlight: Noteworthy Features and Their Development


#### 1. Comment Identification 
every comment has an identification number.<br />
and in order to delete & edit a particular comment<br />
we need to be able to know the ID of the comment section<br />
the delete or edit button referes to.<br />

therefore the comment ID is included<br />
in the commenst section element<br />
but is made to be hidded via its display property.<br />

Also, the fact that the ID of each comment is on the page<br />
simplied the implementation of the single voting feature.<br />
More on this later.

`show snippets of getCommentSectionID & searchForCommentViaID`



<br />

#### 2. Comment Delete Feature
based on the page expected behaviour, <br />
a confirmation modal should pop up <br />
before a comment or reply is deleted. <br />

this was implemented using a bootstrap modal widget,<br />
with further tweaking added; such that,
- when the delete button is clicked, 
- a tag via a class-name is placed <br />
  on the delete button element of the comment section element; <br />
  the `show-modal` class,
- button click will cause the bootstrap modal widget to pop up,
- modal showcases two options
    - No, Cancel
    - Yes, Delete
- No, Cancel meaning "i no longer want to delete this comment". <br /> 
  this will search for the HTMLElement having the class `show-modal`<br />
  then remove the name `show-modal` from its list of class names.
- Yes, Delete will also search for the HTMLElement <br /> 
  having the class `show-modal` which is a button element
- then, it gets the comment section <br />
  wherein the button elements lies<br /> 
  and removes the comment section from the DOM
- lastly, we would use the comment section ID <br />
  to search for its comment information in the comment data <br />
  that is located in the local storage of the browser.<br />

`show snippets of handleDeleteButton(), handleModalDeleteButton(), handleModalDontDeleteButton()`

#### 3. Comment Single Voting Feature
Each user can either downvote or upvote a comment.<br />
We want to make is so that user can vote only once.<br />

This was implemented by storing an Array of IDs in the local storage of the browser.
This IDs corresponds to the IDs of the comments
user has already voted for.

Once the ID of the comment section is in this Array,<br />
the voting icon of that comment section<br />
will be made to be unclickable.<br />
this is implemented by adding/removing <br />
a class name `clickable` from the voting icon element.

Once the ID of the comment section is in this Array,<br />
no matter the clicks on the voting icon <br />
the comment score value will not increase

`show snippet of the isVotedFor()`

<br />

#### 4. Comment Time of Post Tracking Feature
we intend to dynamically track the time<br /> 
since the comment or reply was posted.

in the comment information in the comment DATA,<br />
there is a property called `createdAt` that keeps track of the date and time the comment was created.

we compare the value with the present date and time<br />
so we can know how long the comment/reply was posted.<br />

`show snippet of the getDateDiff()`


<br />

#### 5. Comment Ordering
There two types of comments.<br />
first-level comment and second-level comment.<br />
second-level comments are comments which are replies to another comments.

first-level comments are items in the `comments` property.
second-level comments are items in the `replies` property.

When rendering,<br /> 
first-level comments are to be ordered by their comment score.<br />
second-level comments are to be ordered by the time-of-post.

Therefore before rendering the list of first-level comments is sorted, then rendered.

The second-level comment will be sorted by time-of-post by default; since it is by time-of-post they are appended to the `replies` property Array.
<br /><br />



##  Project Script: functions division
Scripting is divided into Nine(9) Aspect:
- Loading Data into Browser Local Storage
- Initial Rendering of the Webpage
- Setting up of Mobile Responsiveness
- Utility Functions
- Functions for generating sections of webpage
- Functions for Handling Button Interactions
- Functions for Manipulating the Database
- Setting up the Event Handlers
