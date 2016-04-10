import { Template } from 'meteor/templating';
import './cashier.html';
import { SalsaNight } from '../lib/collections/salsaNight';
import { ReactiveVar } from 'meteor/reactive-var';
import { Router } from 'meteor/iron:router';

Router.route('/', function () {
  this.render('eventCreator');
});

Router.route('/salsanight', function() {
   this.render('dashboard');
});

Template.eventCreator.onCreated(function () {
    this.currEvent = new ReactiveVar(null);
    this.autorun(() => {
      this.currEvent.set(SalsaNight.find({}, {sort: {createdAt: -1}}).fetch()[0]);
    });
});

Template.dashboard.onCreated(function () {
    this.currEvent = new ReactiveVar(null);
    this.autorun(() => {
      this.currEvent.set(SalsaNight.find({}, {sort: {createdAt: -1}}).fetch()[0]);
    });
});

function getEvent() {
    return Template.instance().currEvent.get();
}

Template.eventCreator.events({
    'click .createEvent'() {
        let currEvent = getEvent();
        
        if (currEvent && !currEvent.closed) { 
            alert('הערב כבר פתוח.');
        } else {
            var eveningPrice = prompt("מה מחיר העלות של הערב", "1500");
            return Meteor.call('createEvent', eveningPrice);
        }
    },
    
    'click .addDancer'() {
        let currEvent = getEvent();
        if (!currEvent.closed)
            Meteor.call('incDancer', currEvent._id);
    },
    
    'click .removeDancer'() {
        let currEvent = getEvent();
        if (!currEvent.closed && currEvent.dancers > 0)
            Meteor.call('decDancer', currEvent._id);
    },
    
    'click .closeEvening'() {
        
        let currEvent = getEvent();
        
        if(currEvent && !currEvent.closed) {
            if(confirm("בטוח שאנחנו רוצים לסגור את הערב הכיפי הזה?"))
                Meteor.call('closeEvening', currEvent._id);
        } else {
            alert("הערב כבר סגור.");
        }
        
    }
});

Template.eventCreator.helpers({
    allEvents() {
        return SalsaNight.find({});
    },
  
    eventTime() {
        let currEvent = getEvent();
        if(currEvent && !currEvent.closed) {
            let dd = currEvent.createdAt.getDate();
            let mm = currEvent.createdAt.getMonth()+1; //January is 0!
            let yyyy = currEvent.createdAt.getFullYear();
            
            if(dd<10) {
                dd='0'+dd
            } 
            
            if(mm<10) {
                mm='0'+mm
            } 
            
            let today = dd+'/'+mm+'/'+yyyy;
            return today;
        } else {
            return 'האקדמיה סגורה כעת';
        }
    },
    
    counter() {
        let currEvent = getEvent();
        return currEvent ? currEvent.dancers : '';
    }
});

Template.dashboard.helpers({
   numbersOfDancers() {
        let currEvent = getEvent();
        return currEvent ? currEvent.dancers : 0;
   },
   costs() {
        let currEvent = getEvent();
        return currEvent ? currEvent.costs : 1500;
   },
   pricePerDancer() {
        let currEvent = getEvent();
        return (currEvent.costs / currEvent.dancers) > 40 ? '40 שקל (מחיר מקסימלי לרקדן)' : Math.floor(currEvent.costs / currEvent.dancers) + " שח";
   },
   
   isClosed() {
       let currEvent = getEvent();
       return currEvent ? currEvent.closed : true;
   }
});