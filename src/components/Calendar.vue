<template>
  <div class="calendar container-fluid">
    <div class="row">
      <div class="col-sm-3 header-title">
        <h1>Local Calendar</h1>
        <button type="button" @click="showModal=!showModal" class="btn header-title btn-primary">Add Event</button>
      </div>
      <div class="col-sm-8 calendar-content">
        <h4>{{ month + " " + year }}</h4>
          <div class="row">
            <div v-for="day in days" class="cal-header col-sm"><span><strong>{{ day }}</strong></span></div>
          </div>
          <div class="row" v-for="date in dates">
            <div class="cal-cell col-sm" :class="{'font-grey' : !aDate.thisMonth}" v-for="aDate in date">
              <span>{{ aDate.day }}</span>
              <div @click="showEvent(index)" v-for="(event, index) in listEvent[aDate.day]" v-if="index < 3" class="event-box">{{ event.title }}</div>
              <div @click="showMore()" v-if="listEvent[aDate.day] != null && listEvent[aDate.day].length > 3">{{(listEvent[aDate.day].length-3) + " more"}}</div>
            </div> 
          </div>
      </div>
    </div>
    <event-modal :show="showModal" @close="showModal=false" @submit="submitEvent"></event-modal>
    <!-- <show-event></show-event> -->
  </div>
</template>

<script>

import EventModal from "./modal/EventModal.vue" 

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
      listEvent : [],
      event : {}
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
    toggleModal(){
      this.showModal = !this.showModal
    },
    submitEvent(event){
        //make a copy of event, so don't reactive with change in modal
        let eventSubmitted  = JSON.parse(JSON.stringify(event));
        
        let startDate = event.startDate.day
        let endDate = event.endDate.day
        console.log('event START DATE END', startDate, endDate)
        if(startDate != endDate){
          if(this.listEvent[startDate] == null){
            this.listEvent[startDate] = []
          }
          if(this.listEvent[endDate] == null){
            this.listEvent[endDate] = []
          }
          this.listEvent[startDate].push(eventSubmitted)
          this.listEvent[endDate].push(eventSubmitted)  
        }else{
          console.log('this event', this.listEvent[startDate])
          if(this.listEvent[startDate] == null){
            this.listEvent[startDate] = []
          }
          this.listEvent[startDate].push(eventSubmitted)
        }
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
  text-align: left;
}
.cal-cell, .cal-header {
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  text-align: center;
}
.cal-header > span{
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
  height: 90px;
  font-size: 14px;
  display: block;
  overflow: hidden;
}
.cal-cell:nth-child(1), .cal-header:nth-child(1){
  border-left : 1px solid black;
}
.calendar-content{
  margin-top: 2%;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Helvetica';
  text-align: left;
}
.event-box {
  border: 1px solid black;
  background-color : #0a7f25;
  color: #ffffff;
  border-radius: 10px;
  height: 15px;
  line-height: 12px;
  margin-bottom: 1px;
}

</style>
