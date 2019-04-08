<template>
  <transition name="modal">
    <div class="modal-mask" @click="close" v-show="show">
      <div class="modal-wrapper">
        <div class="modal-container default" @click.stop>
          <div class="modal-title">
            <slot name="title">
              <h2>View Event</h2>
            </slot> 
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="row">
                <div class="col-sm-4">
                  <label for="title">Title</label>
                </div>
                <div class="col-sm-8 no-padding">
                  <span>: {{ event.title }}</span>
                </div>
              </div>                  
              <div class="row">
                <div class="col-sm-4">
                  <label for="title">Description</label>
                </div>
                <div class="col-sm-8 no-padding">
                  <span>{{ ": " + event.description }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4">
                  <label for="title">Start Time</label>
                </div>
                <div class="col-sm-8 no-padding">
                  <span v-if="event.startDate != null"> : {{ months[event.startDate.month] + " " + event.startDate.day + ", " + event.startDate.year + " " + event.startTime }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4">
                  <label for="title">End Time</label>
                </div>
                <div class="col-sm-8 no-padding">
                  <span v-if="event.endDate != null">: {{ months[event.endDate.month] + " " + event.endDate.day + ", " + event.endDate.year + " " + event.endTime }}</span>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button type="reset" class="btn btn-grey" @click="close">
                Close
              </button>
              <button type="button" class="btn btn-danger" @click="remove">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "EventModal",
  props: {
    show : Boolean,
    event : Object,
    eventIndex: Number
  },
  computed: {

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
      months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
  },
  mounted() {
    
  },
  methods: {
    close() {
        this.$emit('close')       
    },
    remove(){
      this.$emit('remove', this.event, this.eventIndex)
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
      width: 400px;
      margin: 0px auto;
      padding: 10px 5px;
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
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
      word-wrap: break-word;
      word-break: break-all;
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
    .no-padding{
      padding: 0px;
    }
    @media only screen and (max-width: 600px) {
      .modal-container{
        width : 100%;
      }
    }
</style>
