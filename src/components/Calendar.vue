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
    <button type="button" @click="showModal=!showModal" class="btn btn-primary">Add Event</button>
    <event-modal :show="showModal" @close="showModal=false" @submit=""></event-modal>
  </div>
</template>

<script>

import EventModal from "./modal/EventModal.vue" 
import bus from '@/service/bus'

export default {
  name: "Calendar",
  props: {
  },
  components: {
    EventModal
  },
  data() {
    return {
      showModal : false,
      month: "",
      year: "",
      dates: [['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', '']],
      days: ["SUN","MON", "TUE", "WED", "THU", "FRI", "SAT"],
      event: {
        "startTime" : "",
        "endTime" : "",
        "title" : "",
        "desc" : "",
      },
      listEvent : [],
      event : {}
    };
  },
  updated(){
  },
  mounted() {
    let date =  new Date();
    this.month = this.month_name(date.getMonth());
    this.year = date.getFullYear();
    let lastDate = new Date(date.getFullYear(), date.getMonth()+1, 0);
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.createDate(date, firstDate, lastDate) 

    bus.$on('SUBMIT_EVENT', (event) => {

        this.listEvent[this.listEvent.length] = event
                console.log('bus submit', this.listEvent)
    })
  },
  methods: {
    toggleModal(){
      this.showModal = !this.showModal
    },
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
}
.clickable-cell:hover {
  background-color: #e8ebef;
  cursor: pointer;
}
.cal-header span{
  vertical-align: middle;
  line-height: normal;
  display : inline-block;
}
.cal-header{
  height: 30px;
  line-height: 30px;
  border-top : 1px solid black;
}
.cal-cell {
  height: 75px;
  font-size: 14px;
}
.cal-cell:nth-child(1), .cal-header:nth-child(1){
  border-left : 1px solid black;
}
.calendar-content{
  margin-top: 2%;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: 'Barlow-Medium';
}

</style>
