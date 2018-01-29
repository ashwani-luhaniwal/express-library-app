var express = require('express');
var router = express.Router();

/**
 * The method Response.render() is used to render a specified template along with the values of 
 * named variables passed in an object, and then send the result as a response.
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
