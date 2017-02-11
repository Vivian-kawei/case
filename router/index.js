const {get,post,success,failure} = require('./common/request');
const apiServer = require('./config').apiServer;
const express = require('express');
const router = express.Router();
 
router.post('/saveCase', function(req, res) {
  var data = JSON.parse(req.body.caseData);
  var id = req.body.caseId;
  console.log(id, data);
  if(id){
    data.id = id;
    post(`${apiServer}/pmd/update`,{
      data : data,
      success : result => success(result,res),
      failure: error => failure(error,res)
    });
  }else {
    post(`${apiServer}/pmd/create`,{
      data : data,
      success : result => success(result,res),
      failure: error => failure(error,res)
    });
  }
});

router.post('/getCase', function(req, res) {
  var {id, withDrugPlans} = req.body;
  console.log(id, withDrugPlans);
  get(`${apiServer}/pmd/get`,{
    data : { id, withDrugPlans },
    success : result => success(result,res),
    failure: error => failure(error,res)
  });
});

router.post('/addPeriod', function(req, res) {
  var { planId, name } = req.body;
  post(`${apiServer}/drugplan/add-period`,{
    data : { planId, name },
    success : result => success(result,res),
    failure: error => failure(error,res)
  });
});

router.post('/addDrug', function(req, res) {
  var { periodId, drugId, drugName, usage, dosage, unit, frequency, time, notes } = req.body;
  console.log(req.body)
  post(`${apiServer}/drugplan/add-drug`,{
    data : { periodId, drugId, drugName, usage, dosage, unit, frequency, time, notes },
    success : result => success(result,res),
    failure: error => failure(error,res)
  });
});

module.exports = router;
