var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // we use ejs to pass the JSON stringified isAuthOutput array to
  // the view component. From the view component (html file), we'll use ng-init
  // to pass the array into the ng-controller.
  res.render('index',
             { checkUserIsAuthenticatedResult: JSON.stringify(req.isAuthOutput) }
  );
});
module.exports = router;
