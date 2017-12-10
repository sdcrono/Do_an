let service = {};

service.getDates = getDates;
service.filterWeekDays = filterWeekDays;
service.Noofmonths = Noofmonths;

module.exports = service;

function getDates(dateStart, dateEnd) {
    let currentDate = dateStart, dates = [];

    while(currentDate <= dateEnd) {
      dates.push(currentDate);
      let d = new Date(currentDate.valueOf());
      d.setDate(d.getDate() + 1);
      currentDate = d;
    }    
    return dates;
  }

function filterWeekDays(dates, includeDays) {
    let weekDays = [];
    let numberEachWeekDays = [0, 0, 0, 0, 0, 0, 0];
    dates.forEach(day => {
      includeDays.forEach(include => {
        if (day.getDay() == include) {
          weekDays.push(day);
          switch (include) {
            case 0:
              numberEachWeekDays[0]++;
              break;
            case 1:
              numberEachWeekDays[1]++;
              break;
            case 2:
              numberEachWeekDays[2]++;
              break;
            case 3:
              numberEachWeekDays[3]++;
              break;
            case 4:
              numberEachWeekDays[4]++;
              break;
            case 5:
              numberEachWeekDays[5]++;
              break;
            case 6:
              numberEachWeekDays[6]++;
              break;

          }
        }
      });
    });
    console.log(weekDays);
    return {weekDays: weekDays, numberEachWeekDays: numberEachWeekDays};
  }

  function Noofmonths(date1, date2) {
    var Nomonths;
    Nomonths= (date2.getFullYear() - date1.getFullYear()) * 12;
    Nomonths-= date1.getMonth() + 1;
    Nomonths+= date2.getMonth() +1; // we should add + 1 to get correct month number
    return Nomonths <= 0 ? 0 : Nomonths;
}

function addNewElement (arr, newElement) {
  var found = false;
  for(var i=0; element=arr[i]; i++) {
      if(element.month == newElement.month && element.year == newElement.year) {
          found = true;
          if(newElement.population === 0) {
              arr[i] = false;
          } else {
              arr[i] = newElement;
          }            
      }
  }
  if(found === false) {
      arr.push(newElement);
  }
  // removing elements
  var newArr = [];
  for(var i=0; element=arr[i]; i++) {
      if(element !== false) newArr.push(element);
  }
  return newArr;
}
