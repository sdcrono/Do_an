import { Component, OnInit } from '@angular/core';
import { AlertService, EmployeesService } from '../../_services/index';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: any;
  employeesFilter: any;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();

  constructor(
    private alertService: AlertService,
    private employeesService: EmployeesService
  ) { }

  ngOnInit() {
    this.getEmployeeList();
  }

  getEmployeeList() {
    this.employeesService.getAll().subscribe(employees => {
      this.employees = employees;
      this.employeesFilter = this.employees.map(employee => {
        let salary = 0;
        let salariesSame = employee.employeeprofile.salaries.filter(salary => {
          if (salary.monthApply === +this.month && salary.yearApply === this.year)
            return salary;
        });
        let salariesNear = employee.employeeprofile.salaries.filter(salary => {
          if (salary.monthApply < +this.month && salary.yearApply === this.year)
            return salary;
        });
        let salariesFar = employee.employeeprofile.salaries.filter(salary => {
          if (salary.yearApply < this.year)
            return salary;
        });
        salary = salariesSame.length === 0 ? salary : salariesSame[salariesSame.length - 1].salary;
        salary = salariesNear.length === 0 ? salary : salariesNear[salariesNear.length - 1].salary;
        salary = salariesFar.length === 0 ? salary : salariesFar[salariesFar.length - 1].salary;
        let dayOffMonth = 0
        // tính sớ ngày off trong tháng và phải trước ngày hôm nay
        let contractSalary = employee.employeeprofile.day_off && employee.employeeprofile.day_off.forEach(day_off => {
          let date = new Date(day_off.date);
          let today = new Date();
          const mont = date.getMonth();
          if (date < today)
            if ((date.getMonth() + 1) === +this.month && date.getFullYear() === this.year)
              dayOffMonth++;
        })

        //đầu tiên tính lương bình thường của 1 tháng
        let newSalary = ((22 - dayOffMonth) / 22) * salary;
        // salary = Math.round(salary / 1000) * 1000
        // salary = !isNaN(salary) ? salary : 0;
        let today = new Date();
        let createDay = new Date(employee.created_at);     

        //xét nếu tháng nằm trước ngày tạo hoặc tháng sau tháng của ngày hôm nay thì mặc định bằng 0
        if ((today.getMonth()+1 < +this.month && today.getFullYear() <= this.year) || (createDay.getMonth()+1 > +this.month && createDay.getFullYear() >= this.year)) {
          newSalary = 0;
          salary = 0;
        }
        //xét nếu ngày hôm nay có tháng năm trùng tháng năm đang xét
        if (today.getMonth()+1 === +this.month && today.getFullYear() === this.year) {
          let firstDayofMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          let numberOfWorkingDate = this.countDays(firstDayofMonth, today, [1,2,3,4,5])
          //ta tính được số ngày làm việc từ đầu tháng tới ngày hôm nay và chia 22 tính ra lương
          newSalary = ((numberOfWorkingDate - dayOffMonth) / 22) * salary;
        }
        //nếu ngày tạo có tháng năm trùng
        if (createDay.getMonth()+1 === +this.month && createDay.getFullYear() === this.year) {
          let firstDayofMonth = new Date(createDay.getFullYear(), createDay.getMonth(), 1);
          //tính ra số ngày phải bỏ đi do những ngày đó trước ngày tạo
          let numberOfNotStartingDate = this.countDays(firstDayofMonth, createDay, [1,2,3,4,5]);
          let numberOfWorkingDate = 0;
          //Nếu ngày hôm nay cũng nằm trong tháng năm đang xét
          if (today.getMonth()+1 === +this.month && today.getFullYear() === this.year) {
            // tính ra số ngày làm việc từ ngày tạo tới hôm nay rồi chia số đó cho 22 tính ra lương
            numberOfWorkingDate = this.countDays(createDay, today, [1,2,3,4,5]);
            newSalary = ((numberOfWorkingDate - dayOffMonth) / 22) * salary;
          }
          // Nếu chỉ có ngày tạo có tháng năm trùng
          else {            
            // chỉ cần trừ số ngày bỏ đi và ngày nghỉ
            newSalary = ((22 - numberOfNotStartingDate - dayOffMonth) / 22) * salary;
          }
        } 

        newSalary = Math.round(newSalary / 1000) * 1000
        newSalary = !isNaN(newSalary) ? newSalary : 0;

        let employeeFilter = Object.assign({}, employee, { net: newSalary });
        return employeeFilter;
      });
      // employees.forEach(employee => {
      //   console.log("Employees ", employee);
      // });
    });
  }

  deactive(id: any) {
    let req = {
      id: id
    };
    console.log(id);
    this.employeesService.delete(req).subscribe(result => {
      console.log(result);
      this.alertService.success('Xóa thành công', false);
      this.getEmployeeList();
    }, err => {
      console.log(err);
      this.alertService.error(err, false);
    });
  }

  changeFilter() {
    let employeesFilter = this.employees.map(employee => {
      let salary = 0;
      let salariesSame = employee.employeeprofile.salaries.filter(salary => {
        if (salary.monthApply === +this.month && salary.yearApply === this.year)
          return salary;
      });
      let salariesNear = employee.employeeprofile.salaries.filter(salary => {
        if (salary.monthApply < +this.month && salary.yearApply === this.year)
          return salary;
      });
      let salariesFar = employee.employeeprofile.salaries.filter(salary => {
        if (salary.yearApply < this.year)
          return salary;
      });
      salary = salariesSame.length === 0 ? salary : salariesSame[salariesSame.length - 1].salary;
      salary = salariesNear.length === 0 ? salary : salariesNear[salariesNear.length - 1].salary;
      salary = salariesFar.length === 0 ? salary : salariesFar[salariesFar.length - 1].salary;
      let dayOffMonth = 0
      let contractSalary = employee.employeeprofile.day_off && employee.employeeprofile.day_off.forEach(day_off => {
        let date = new Date(day_off.date);
        let today = new Date();
        const mont = date.getMonth();
        if (date < today)
          if ((date.getMonth() + 1) === +this.month && date.getFullYear() === this.year)
            dayOffMonth++;
      })
      let newSalary = ((22 - dayOffMonth) / 22) * salary;
      // salary = ((22 - dayOffMonth) / 22) * salary;
      // salary = Math.round(salary / 1000) * 1000
      // salary = !isNaN(salary) ? salary : 0;
      let today = new Date();
      let createDay = new Date(employee.created_at);

      if ((today.getMonth()+1 < +this.month && today.getFullYear() <= this.year) || (createDay.getMonth()+1 > +this.month && createDay.getFullYear() >= this.year)) {
        newSalary = 0;
        salary = 0;
      }
      if ((today.getFullYear() < this.year) || (createDay.getFullYear() > this.year)) {
        newSalary = 0;
        salary = 0;
      }
      if (today.getMonth()+1 === +this.month && today.getFullYear() === this.year) {
        let firstDayofMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let numberOfWorkingDate = this.countDays(firstDayofMonth, today, [1,2,3,4,5])
        newSalary = ((numberOfWorkingDate - dayOffMonth) / 22) * salary;
      }
      if (createDay.getMonth()+1 === +this.month && createDay.getFullYear() === this.year) {
        let firstDayofMonth = new Date(createDay.getFullYear(), createDay.getMonth(), 1);
        let numberOfNotStartingDate = this.countDays(firstDayofMonth, createDay, [1,2,3,4,5]);
        let numberOfWorkingDate = 0;
        if (today.getMonth()+1 === +this.month && today.getFullYear() === this.year) {
          numberOfWorkingDate = this.countDays(createDay, today, [1,2,3,4,5]);
          newSalary = ((numberOfWorkingDate - dayOffMonth) / 22) * salary;
        }
        else {            
          newSalary = ((22 - numberOfNotStartingDate - dayOffMonth) / 22) * salary;
        }
      } 
      newSalary = Math.round(newSalary / 1000) * 1000
      newSalary = !isNaN(newSalary) ? newSalary : 0;

      let employeeFilter = Object.assign({}, employee, { net: newSalary });
      return employeeFilter;
    });

    this.employeesFilter = employeesFilter;
    console.log(this.employeesFilter);
  }

  getDates(dateStart, dateEnd) {
    let currentDate = dateStart, dates = [];

    while (currentDate <= dateEnd) {
      dates.push(currentDate);
      let d = new Date(currentDate.valueOf());
      d.setDate(d.getDate() + 1);
      currentDate = d;
    }

    return dates;
  }

  filterWeekDays(dates, includeDays) {
    let weekDays = [];

    dates.forEach(day => {
      includeDays.forEach(include => {
        if (day.getDay() == include) {
          weekDays.push(day);
        }
      });
    });
    return weekDays;
  }

  countDays(dateStart, dateEnd, includeDays) {
    let workingDateofMonth = this.filterWeekDays(this.getDates(dateStart, dateEnd), includeDays);
    return workingDateofMonth.length;
  }

  refresh(id: any) {
    this.getEmployeeList();
  }

}
