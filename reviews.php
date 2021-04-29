<?php 
/*
 * reviews.php web service that gets and outputs a JSON object of a list of reviews
 * and their associated information. Also handles post requests by uploading the given
 * review parameters to a reviews database.
 *
 * Web service details:
 *   Required GET parameters:
 *     - reviews OR
 *     - author, title, release_year, score, comments
 *   examples
 *     - reviews=all
 *     - author=Kyle
 *     - title=Transformers
 *     - release_year=2007
 *     - score=67
 *     - comments=meh
 *   Output Format:
 *   - JSON
 *   Output Details:
 *     - If the reviews parameter is passed and is set to all, it will output a JSON object with
 *     an array of reviews and information for each inlcuding name, title,
 *     release, score, and comments.
 *     - If the reviews parameter is passed with anything other than all,
 *       then it will output an error message
 */

  include("common.php");

  $db = get_PDO();

  /* 
   * Checks if the reviews query is set. Then checks if it is "all".
   * Gets and the reviews from the reviews database.
   */
  if (isset($_GET["reviews"])) {
    $reviews = $_GET["reviews"];
    if ($reviews === "all") {
      get_all_reviews($db);
    }
  }

  /* 
   * Outputs a JSON object of an array of reviews with information including
   * author, title, release_year, score, and comments. Outputs an error
   * if there were any complications making the query to the database.
   * @param {object} $db - PDO object
   */
  function get_all_reviews($db) {
    try {
      $result = array();
        $result["reviews"] = [];

      $rows = $db->query("SELECT * FROM reviews");
      header("Content-type: application/json");
      foreach ($rows as $row) {
        $reviewer = $row["author"];
        $movie_title = $row["title"];
        $release_year = $row["release_year"];
        $score_value = $row["score"];
        $comments = $row["comments"];

        $review = array("name" => $reviewer,
                      "title" => $movie_title,
                      "release" => $release_year,
                      "score" => $score_value,
                      "comments" => $comments);

            array_push($result["reviews"], $review);
      }

      echo json_encode($result);

    } catch (PDOException $ex) {
      handle_error("Cannot query from the database.", $ex);
    }
  }

  /* 
   * Checks that author, title, release_year, score, and comments are set.
   * Uploads the given information to the reviews database as a new review.
   * Outputs an error if there were any complications making the query to the database.
   */
  if (isset($_POST["author"]) && isset($_POST["title"]) && isset($_POST["release_year"])
      && isset($_POST["score"]) && isset($_POST["comments"])) {
    try {
      $qry = "INSERT INTO Reviews (author, title, release_year, score, comments) 
            VALUES (:author, :title, :release, :score, :comments );";
      $stmt = $db->prepare($qry);
      $params = array("author" => $_POST["author"], 
                      "title" => $_POST["title"],
                      "release" => $_POST["release_year"], 
                      "score" => $_POST["score"],
                      "comments" => $_POST["comments"]);
      $stmt->execute($params);

    } catch (PDOException $ex) {
          handle_error("Sorry, I could not insert the review into the database.", $ex);
    }
  }

?>