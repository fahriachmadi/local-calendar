<template>
  <div class="calendar container-fluid">
    <div class="row">
      <div class="col-sm-3 col-xs-12 header-title">
        <h1>Local Calendar</h1>
        <button type="button" @click="showModal.addEvent=!showModal.addEvent" class="btn header-title btn-primary">Add Event</button>
      </div>
      <div class="col-sm-8 calendar-content">
        <h4>{{ month + " " + year }}</h4>
          <div class="row">
            <div v-for="day in days" class="cal-header display-desktop col-sm"><span ><strong>{{ day }}</strong></span></div>
            <div class="cal-header-phone display-phone col-sm"><span><strong>Date</strong></span></div>
          </div>
          <div class="row" v-for="date in dates">
            <div class="cal-cell col-sm" v-if="nowDate != null" :class="{'font-grey' : !(aDate.month == nowDate.getMonth())}" v-for="aDate in date">
              <span class="display-phone">{{ aDate.day + " " + months[aDate.month] }}</span>
              <span class="display-desktop">{{ aDate.day }}</span>
              <div @click="showEvent(event)" v-for="(event, index) in listEvent[aDate.day]" v-if="index < 3" class="event-box"> {{ event.title }}</div>
              <a @click="showMore(aDate.day)" href="#" v-if="listEvent[aDate.day] != null && listEvent[aDate.day].length > 3">{{(listEvent[aDate.day].length-3) + " more"}}</a>
            </div> 
          </div>
      </div>
    </div>
   

    <event-modal :show="showModal.addEvent" @close="showModal.addEvent=false" @submit="submitEvent"></event-modal>
    <show-event-modal :event="event" :show="showModal.viewEvent" @close="showModal.viewEvent=false"></show-event-modal>
    <default-modal :show="showModal.defaultModal" @close="showModal.defaultModal=false">
      <h4 slot="title">List Event</h4>
      <div slot="body" @click="showEvent(event)" v-for="(event, index) in listEvent[selectedMore]" class="event-box"> {{ event.title }}</div>
    </default-modal>
  </div>
</template>

<script>

import EventModal from "./modal/EventModal" 
import ShowEventModal from "./modal/ShowEventModal" 
import DefaultModal from "./modal/DefaultModal"

export default {
  name: "Calendar",
  props: {
  },
  components: {
    EventModal, ShowEventModal, DefaultModal
  },
  data() {
    return {
      showModal : {
        addEvent : false,
        viewEvent : false,
        defaultModal : false,
      },
      nowDate: null,
      month: "",
      year: "",
      dates: [['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', '']],
      days: ["SUN","MON", "TUE", "WED", "THU", "FRI", "SAT"],
      months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      listEvent : [],
      event : {},
      selectedMore: null
    };
  },
  mounted() {
    this.nowDate =  new Date();
    this.month = this.month_name(this.nowDate.getMonth());
    this.year = this.nowDate.getFullYear();
    let lastDate = new Date(this.nowDate.getFullYear(), this.nowDate.getMonth()+1, 0);
    let firstDate = new Date(this.nowDate.getFullYear(), this.nowDate.getMonth(), 1);
    this.createDate(this.nowDate, firstDate, lastDate) 
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

            this.dates[0][lastDay] = date.getMonth() == 0? { 'day' : dayBefore, 'month' : 11} : { 'day' : dayBefore, 'month' : date.getMonth()-1}
            dayBefore--; 
            lastDay--;
          }
      }

      //6 is max column index in calendar
      if(lastDate.getDay() != 6){
          let dayAfter = 1;
          let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 1).getDay();
          for(let i =  lastDay; i <= 6; i++){
            this.dates[this.dates.length-1][lastDay] = date.getMonth() == 11 ? { 'day' : dayAfter, 'month' : 0} : { 'day' : dayAfter, 'month' : date.getMonth()+1}
            dayAfter++; 
            lastDay++;
          }
      }

      let i = 0;
      let day = 1;
      while(i < 5 && day <= lastDate.getDate()){
        let selectedDay = new Date(date.getFullYear(), date.getMonth(), day).getDay();

        this.dates[i][selectedDay] = { 'day' : day, 'month' : date.getMonth()} 
        day = day + 1; 
        if(selectedDay % 7 == 6) i++

      }
    },
    showEvent(e){
      console.log('EEE', e)
      this.event = e
      this.showModal.viewEvent = true
      this.showModal.defaultModal = false
    },
    showMore(day){
      this.selectedMore = day
      this.showModal.defaultModal = true
      console.log('this showmore' , this.selectedMore)
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
  font-size: 12px;
  display: block;
  overflow: hidden;
  padding: 0px 5px;
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
  font-size: 12px;
  color: #ffffff;
  height: 15px;
  line-height: 12px;
  margin-bottom: 3px;
  cursor: pointer;
  overflow-y: hidden;
}
a:hover, a:visited, a:link, a:active
{
    text-decoration: none;
    color: #797e84;
}
.display-phone {
  display: none;
}

@media only screen and (max-width: 768px) {
  .cal-cell, .cal-header, .cal-header-phone {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    text-align: center;
  }
  .cal-header-phone{
    border-top : 1px solid black;
  }
  .display-phone{
    display: block;
  }
  .display-desktop{
    display: none;
  }
  .header-title{
    text-align: center;
  }
}
</style>
