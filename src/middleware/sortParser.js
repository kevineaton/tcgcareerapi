/*
* sortParserlooks at the request and tries to normalize sorting
*/
export function sortParser (req, res, next) {
  const sort = {
    sortCol: 'id',
    sortDir: 'ASC'
  };

  if(req.query && req.query.sortCol){
    sort.sortCol = req.query.sortCol.toLowerCase();
  }
  if(req.query && req.query.sortDir){
    var sortTemp = req.query.sortDir.toUpperCase();
    if(sortTemp === 'ASC' || sortTemp === 'DESC'){
      sort.sortDir = sortTemp;
    }else{
      sort.sortDir = 'ASC';
    }
  } else {
    sort.sortDir = 'ASC';
  }
  
  req.sort = sort;

  return next();
}