import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingMessages, sendBookingEmails } from './mail.js';
const request={name:'Test <Customer>',email:'customer@example.test',phone:'+44000000000',pickup:'Leeds',destination:'York',date:'2026-12-01',time:'12:30',passengers:'2',service:'Wedding Cars',notes:'<script>alert(1)</script>',vehicle:'Vintage car',duration:'1 Day'};
test('Both form types produce escaped branded HTML and plain text with all details',()=>{
 for(const journey of [true,false]){
  const {team,customer}=bookingMessages(request,journey,'SE-TEST1234');
  assert.equal(customer.to,request.email);assert.equal(team.replyTo,undefined);assert.ok(team.text.includes(request.email));
  for(const message of [team,customer]){
   assert.match(message.text,/SE-TEST1234/);assert.match(message.html,/STYLE EXPRESS/);
   assert.ok(!message.html.includes('<Customer>'));assert.match(message.html,/Test &lt;Customer&gt;/);
   assert.match(message.text,/only confirmed separately/);
   assert.ok(message.text.includes(journey?'Pick-up time (UK): 12:30':'Vehicle: Vintage car'));
  }
  if(journey)assert.ok(team.html.includes('&lt;script&gt;'));
 }
});
test('Successful enquiry sends team message followed by customer receipt with same reference',async()=>{
 const sent=[];const result=await sendBookingEmails(request,true,{sendMail:async message=>{sent.push(message);return {accepted:[message.to]}}});
 assert.equal(sent.length,2);assert.equal(result.confirmationSent,true);assert.ok(sent.every(m=>m.subject.includes(result.reference)));
});
test('Team delivery failure rejects without sending customer confirmation',async()=>{
 let count=0;await assert.rejects(sendBookingEmails(request,false,{sendMail:async()=>{count++;throw new Error('failed')}}));assert.equal(count,1);
});
test('Receipt failure preserves successful enquiry status to avoid duplicate requests',async()=>{
 let count=0;const result=await sendBookingEmails(request,true,{sendMail:async()=>{if(++count===2)throw Object.assign(new Error('failed'),{code:'ETEST'});return {accepted:['team@example.test']}}});assert.equal(result.sent,true);assert.equal(result.confirmationSent,false);
});
test('SMTP recipient rejection is treated as failed delivery',async()=>{
 await assert.rejects(sendBookingEmails(request,true,{sendMail:async()=>({rejected:['team@example.test']})}),{code:'ERECIPIENT'});
});
