<template>
  <div class="calendar">
    <h1 class="header-title">Local Calendar</h1>
    
    <div class="calendar-content">
      <h3>{{ month + " " + year }}</h3>
        <div class="row">
          <div v-for="day in days" class="cal-header col-sm"><span><strong>{{ day }}</strong></span></div>
        </div>
        <div class="row" v-for="date in dates">
          <div @click="addEvent(aDate)" class="cal-cell col-sm" :class="{'font-grey' : !aDate.thisMonth, 'clickable-cell':aDate.thisMonth}" v-for="aDate in date"><span>{{ aDate.day }}</span></div> 
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  props: {
    msg: String
  },
  data() {
    return {
      month: "",
      year: "",
      dates: [['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', '']],
      days: ["SUN","MON", "TUE", "WED", "THU", "FRI", "SAT"],
    };
  },
  mounted() {
    let date =  new Date();
    this.month = this.month_name(date.getMonth());
    this.year = date.getFullYear();
    let lastDate = new Date(date.getFullYear(), date.getMonth()+1, 0);
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.createDate(date, firstDate, lastDate) 
  },
  methods: {
    month_name: function(dt) {
      let mList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];
      return mList[dt];
    },
    
    createDate(date, firstDate, lastDate) {
      if(firstDate.getDay() != 0){

          let dayBefore = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

          let lastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
          for(let i =  lastDay ; i >= 0; i--){
            this.dates[0][lastDay] = { 'day' : dayBefore, 'thisMonth' : false}
            dayBefore--; 
            lastDay--;
          }
      }

      //6 is max column index in calendar
      if(lastDate.getDay() != 6){
          let dayAfter = 1;
          let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
          for(let i =  lastDay; i <= 6; i++){
            console.log('SAMPAH', lastDay, dayAfter)
            this.dates[this.dates.length-1][lastDay] = { 'day' : dayAfter, 'thisMonth' : false}
            dayAfter++; 
            lastDay++;
          }
      }

      let i = 0;
      let day = 1;
      while(i < 5 && day <= lastDate.getDate()){
        let selectedDay = new Date(date.getFullYear(), date.getMonth(), day).getDay();

        this.dates[i][selectedDay] = { 'day' : day, 'thisMonth' : true} 
        day = day + 1; 
        if(selectedDay % 7 == 6) i++

      }
    },
    addEvent(e){
      if(e.thisMonth){
        let date = new Date();
        alert('add event' + new Date(date.getFullYear(), date.getMonth(), e.day));  
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-title{
  margin-top: 2%;
}
.cal-cell, .cal-header {
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  height: 50px;
  line-height: 50px;
}
.clickable-cell:hover {
  background-color: #e8ebef;
  cursor: pointer;
}
.cal-cell span, .cal-header span{
  vertical-align: middle;
  line-height: normal;
    display : inline-block;
}
.cal-header{
  border-top : 1px solid black;
}
.cal-cell:nth-child(1), .cal-header:nth-child(1){
  border-left : 1px solid black;
}
.calendar-content{
  margin-top: 2%;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: 'Barlow-Medium';
}
.font-grey{
  color : #b6bbc4; 
}
</style>
