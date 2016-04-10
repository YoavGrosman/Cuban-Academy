import {SalsaNight} from './collections/salsaNight';

Meteor.methods({
   createEvent(costs) {
       return SalsaNight.insert({
          createdAt: new Date(),
          dancers: 0,
          costs: costs,
          closed: false
       });
   },
   
   incDancer(eventId, amount = 1) {
       SalsaNight.update({_id: eventId}, {$inc: {dancers: amount}});
   },
   
   decDancer(eventId, amount = 1) {
       let event = SalsaNight.findOne(eventId);
       if (!event) throw new Error('Cannot find event with id ' + eventId);
       if (event.dancers - amount < 0)
        throw new Error('Cannot have negative amount of dancers in event id ' + eventId);
       
       SalsaNight.update({_id: eventId}, {$inc: {dancers: 0 - amount}});
   },
   
   closeEvening(eventId) {
       SalsaNight.update({_id: eventId}, {$set: {closed: true}});
   }
});