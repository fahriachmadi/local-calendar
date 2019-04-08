<template>
  <transition name="modal">
    <div class="modal-mask" @click="close" v-show="show">
      <div class="modal-wrapper">
        <div class="modal-container default" @click.stop>
          <div class="modal-title">
            <slot class="col-sm-12 col-xs-12" name="title">
              <h2>Add Event</h2>
            </slot> 
          </div>
          <form @submit.prevent="action()">
          <div class="modal-body">
            <slot name="body">
              
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-3">
                      <label for="title">Title</label>
                    </div>
                    <div class="col-md-8 no-padding">
                      <input class="form-control" v-model="form.title" type="text" placeholder="Event Name" required />
                    </div>
                  </div>                  
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-3">
                      <label for="title">Description</label>
                    </div>
                    <div class="col-md-8 no-padding">
                      <input class="form-control" v-model="form.description" type="text" placeholder="Description"/>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-12 col-md-3">
                      <label for="title">Start Time</label>
                    </div>
                    <div class="col-6 col-md-4 no-padding">
                      <select class="custom-select" v-model="form.startDate" required>
                        <option :value="form.startDate" disabled hidden>{{ months[form.startDate.month] + " " + form.startDate.day + ", " + form.startDate.year }}</option>
                        <option v-for="date in dates"  :value="date">{{ months[date.month] + " " + date.day + ", " + date.year }}</option>
                      </select>
                    </div>
                    <div class="col-6 col-md-2 no-padding">
                      <select class="custom-select" v-model="form.startTime" required>
                        <option :value="form.startTime" disabled hidden>{{ form.startTime }}</option>
                        <option v-for="time in times" :value="time">{{ time }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-12 col-md-3">
                      <label for="title">End Time</label>
                    </div>
                    <div class="col-6 col-md-4 no-padding">
                      <select class="custom-select" v-model="form.endDate" required>
                        <option :value="form.endDate" disabled hidden>{{ months[form.endDate.month] + " " + form.endDate.day + ", " + form.endDate.year }}</option>
                        <option v-for="date in dates"  :value="date">{{ months[date.month] + " " + date.day + ", " + date.year }}</option>
                      </select>
                    </div>
                    <div class="col-6 col-md-2 no-padding">
                      <select class="custom-select" v-model="form.endTime" required>
                        <option :value="form.endTime" disabled hidden>{{ form.endTime }}</option>
                        <option v-for="time in times" :value="time">{{ time }}</option>
                      </select>
                    </div>
                  </div>
                </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button type="submit" class="btn btn-primary">Yes</button>
              <button type="reset" class="btn btn-danger" @click="close">
                Cancel
              </button>
            </slot>
          </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "EventModal",
  props: {
    show : Boolean
  },
  data(){
    return {
      form : {
        title : null,
        description : null,
        startDate : "",
        endDate : "",
        startTime : "",
        endTime : "",  
      },
      times : [],
      dates: [],
      months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      
    }
  },
  watch:{
    show : function(){
      if(this.show == true) {this.resetForm();}
    }

  },
  mounted() {
    this.setTime();
    
    document.addEventListener("keydown", (e) => {
      if (this.show && e.keyCode == 27) {
        this.close();

      }
    });
  },
  methods: {
    setTime(){
      for(let i = 0; i<24; i++){
        for(let j = 0; j<60; j=j+30){
          this.times.push(this.formatTime(i, j))
        }
        
      }

      let date = new Date();
      let lastDate = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()
      for(let i = 1; i<= lastDate; i++){
        // this.dates.push(this.months[date.getMonth()] + " " + i + ", " + date.getFullYear())
        this.dates.push({"year" : date.getFullYear(), "month": date.getMonth(), "day" : i})
      }
      this.form.startDate = { "year" : date.getFullYear(), "month" :  date.getMonth(), "day": date.getDate()};
      this.form.endDate = this.form.startDate;

      let nowHour = date.getHours() 
      let nowMinute = date.getMinutes()
      this.form.startTime = nowMinute <= 30 ? this.formatTime(nowHour, 30) : this.formatTime(nowHour, 0)

      this.form.endTime = nowMinute > 30 ? this.formatTime(nowHour, 30): this.formatTime((nowHour+1), 0) 
    },

    formatTime(hour, minute){
      let time = hour<10 ? "0" + hour : hour; 
          time = minute<10 ? time+":"+"0" + minute : time + ":" + minute;
          return time; 
    },
    close() {
        this.$emit('close')       
    },
    resetForm(){
      this.form.title = ""
      this.form.description = ""
    },
    action(){

      this.$emit('submit', this.form)
      this.close()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-mask {
      position: fixed;
      z-index: 7;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.67);
      display: flex;
      transition: opacity .3s ease;
    }

    .modal-wrapper {
      display: block;
      vertical-align: middle;
    }

    .modal-container {
      width: 500px;
      margin: 0px auto;
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
    }

    @media only screen and (max-width: 768px) {
      .modal-container{
        width : 400px;
      }
    }
     @media only screen and (max-width: 600px) {
      .modal-container{
        width : 300px;
      }
    }
    .modal-header h3 {
      margin-top: 0;
      color: #42b983;
    }

    .modal-body {
      display: inline-block;
      width: 100%;
      margin: 20px 0;
      text-align: left;
    }
    form label{
      vertical-align: middle;
    }

    .modal-footer{
      text-align : center;
    }

    .modal-enter {
      opacity: 0;
    }

    .modal-leave-active {
      opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
</style>
