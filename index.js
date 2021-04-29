
// This is the javascript file for index.html of "Movie Reviews".
// Allows the user to see a list of reviews from a reviews
// database (retrieved by reviews.php) and allows the user to
// submit their own review to the database through the reviews.php file.

(function() {
  "use strict";

  const BASE_URL = "reviews.php";

  /**
   * When loaded, the web page will initialize page behavior.
   */
  window.addEventListener("load", initialize);

  /**
   * Gets and populates the review portion of the page with 
   * reviews from the reviews database. Adds review posting
   * behavior to the submit button.
   */
  function initialize() {
    getReviews();
    $("submit").addEventListener("click", submitReview);
  }

  /**
   * Fetches the list of reviews from the reviews.php file.
   * Displays each review in its own box on the page.
   */
  function getReviews() {
    let url = BASE_URL + "?reviews=all";
    fetch(url, {mode : "cors"})
      .then(checkStatus)
      .then(JSON.parse)
      .then(populateReviews)
      .catch(console.log);    
  }

  /**
   * Create and adds each review to the page from the given reviewsList.
   * Adds a gray box with movie title and release year at the top, comments
   * by the reviewer below, and the score on the far right of the box.
   * @param {object} reviewsList - JSON object of reviews.
   */
  function populateReviews(reviewsList) {
    $("reviews").innerHTML = "";

    let header = document.createElement("h2");
    header.innerText = "Reviews:";
    $("reviews").appendChild(header);

    for (let i = 0; i < reviewsList.reviews.length; i++) {
      // create new review  DOM element
      let newReview = document.createElement("div");
      newReview.classList.add("review");

      // create movie title, release year, reviewer name and comments
      // DOM elements
      let info = createInfo(reviewsList, i);

      // create score DOM element
      let scoreValue = document.createElement("p");
      scoreValue.classList.add("score");
      scoreValue.innerText = reviewsList.reviews[i].score;

      // add info and score to review
      newReview.appendChild(info);
      newReview.appendChild(scoreValue);

      $("reviews").appendChild(newReview);
    }
  }

  /**
   * Creates and returns the info portion of the review
   * from the given ith review of reviewsList.
   * @param {object} reviewsList - JSON object of reviews.
   * @param {integer} i - Index of review.
   * @returns {object} DOM object of info.
   */
  function createInfo(reviewsList, i) {
    let info = document.createElement("div");
    info.classList.add("info");

    // create movie title and release year DOM elements
    let movie = document.createElement("p");
    movie.classList.add("movie-title");
    let title = reviewsList.reviews[i].title;
    let release = reviewsList.reviews[i].release;
    movie.innerText = title + " (" + release + ")";

    // create comments and reviewer DOM elements
    let quote = document.createElement("blockquote");
    let comment = document.createElement("p");
    comment.innerText = "\"" + reviewsList.reviews[i].comments + "\"";
    quote.appendChild(comment);
    let name = document.createElement("p");
    name.innerText = "- " + reviewsList.reviews[i].name;

    // adds the above created to the info DOM element
    info.appendChild(movie);
    info.appendChild(quote);
    info.appendChild(name);

    return info;
  }

  /**
   * Submits the user's added review to the database through
   * the reviews.php file. Displays the updated reviews from
   * the reviews database onto the page.
   */
  function submitReview() {
    if (checkInputs()) {
      let reviewer = $("reviewer-input").value;
      let title = $("title-input").value;
      let release = $("release-input").value;
      let score = $("score-input").value;
      let comments = $("comments-input").value;
      resetForm();

      let params = new FormData();
      params.append("author", reviewer);
      params.append("title", title);
      params.append("release_year", release);
      params.append("score", score);
      params.append("comments", comments);

      let url = BASE_URL;

      fetch(url, { method : "POST", body : params })
      .then(checkStatus)
      .then(getReviews)
      .catch(console.log);        
    }
  }

  /**
   * Resets the text inside the add review text boxes.
   */
  function resetForm() {
    $("reviewer-input").value = "";
    $("title-input").value = "";
    $("release-input").value = "";
    $("score-input").value = "";
    $("comments-input").value = "";
  }

  /**
   * Checks that the user filled in the inputs to add a review;
   * @returns {boolean} TRUE if the tex inputs (other than comments)
   * are non-empty.
   */
  function checkInputs() {
    return $("reviewer-input").value.length > 0 && $("title-input").value.length > 0 &&
           $("release-input").value.length > 0 && $("score-input").value.length > 0;
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @returns {object} DOM object associated with id.
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
     const OK = 200;
     const ERROR = 300;
     let responseText = response.text();
     if (response.status >= OK && response.status < ERROR || response.status === 0) {
       return responseText;
     } else {
       return responseText.then(Promise.reject.bind(Promise));
     }
   }

})();