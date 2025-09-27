class User
{
  constructor(id, name, email, contact){
    this.name = name
    this.email = email
    this.contact = contact
    this.notifications = []
  }
  addNotification(notification){
    this.notifications.push(notification)
  }
  removeNotification(notification) {
    const index = this.notifications.indexOf(notification);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.isRead);
  }


  viewNotification(){
    return this.notifications
  }
  setAllNotificationsRead(){
    this.notifications.forEach (n => n.markAsRead())
  }
  markNotificationAsUnRead(notification){
    const index = this.notifications.indexOf(notification)
    if(index!==-1){
      this.notifications[index].markAsUnread()
    }
  }
   markNotificationAsRead(notification){
    const index = this.notifications.indexOf(notification)
    if(index!==-1){
      this.notifications[index].markAsRead()
    }
  }
  updateContact(newContact) {
    this.contact = newContact;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
  }
}

class Student extends User{
  constructor(id, name, email, contact, rollNo, degree, batch){
    super(id, name, email, contact)
    this.rollNo = rollNo
    this.degree = degree
    this.batch = batch
    this.organisedGroups = []
    this.joinedGroups = []
    this.organisedFundRaisers = []
    this.donationsGiven = []
  }
  organiseStudyGroup( gpName, subj){
    const group = new StudyGroup(this, gpName, subj)
    this.organisedGroups.push(group)
    this.joinedGroups.push(group)
    return group
  }
  requestToJoinGroup(group) {
    group.requestToJoin(this);
  }
   leaveGroup(group) {
    const index = this.joinedGroups.indexOf(group);
    if (index !== -1) {
      this.joinedGroups.splice(index, 1);
      group.members = group.members.filter(m => m !== this);
    }
  }
  approveStudentInGroup(group, student) {
  if (group.founder === this) {
    group.approveMember(student);
  }
}

  sendMessage(to, content) {
    return new Message(to, this, content); 
  }
  donate(fundraiser, amount) {
    const donation = new Donation(this, amount, fundraiser);
    fundraiser.addDonation(donation);
    this.donationsGiven.push(donation);
    return donation;
  }
  organiseFundRaiser(id, title, goalAmount) {
    const fr = new FundRaising(id, title, this, goalAmount);
    this.organisedFundRaisers.push(fr);
    return fr;
  }
   viewOrganisedGroups() {
    return this.organisedGroups;
  }
  viewJoinedGroups() {
    return this.joinedGroups;
  }
  viewFundraisers() {
    return this.organisedFundRaisers;
  }
  viewDonations() {
    return this.donationsGiven;
  }
}

class Admin extends User{
  constructor(id, name, email, contact) {
    super(id, name, email, contact);
  }
  approveFundraiser(fundraiser) {
    fundraiser.isApproved = "yes";
    return `Fundraiser '${fundraiser.title}' approved by Admin ${this.name}`;
  }
  rejectFundraiser(fundraiser) {
    fundraiser.isApproved = "rejected";
    fundraiser.status = "closed";
    return `Fundraiser '${fundraiser.title}' rejected by Admin ${this.name}`;
  }
  removeStudyGroup(group) {
    group.members.forEach(student => {
      student.joinedGroups = student.joinedGroups.filter(g => g !== group);
      student.organisedGroups = student.organisedGroups.filter(g => g !== group);
    });
    return `Study group '${group.name}' removed by Admin ${this.name}`;
  }
  viewPendingFundraisers(fundraisersList) {
    return fundraisersList.filter(f => f.isApproved === "no");
  }
  closeFundraiser(fundraiser) {
    fundraiser.status = "closed";
    return `Fundraiser '${fundraiser.title}' has been closed by Admin ${this.name}`;
  }
}

class StudyGroup
{
  constructor(founder, gpName, subj){
    this.founder = founder
    this.name = gpName
    this.subj = subj
    this.members= []
    this.messages = []
    this.pendingRequests = []
    this.members.push(founder)
  }
  requestToJoin(student){
    if (!this.pendingRequests.includes(student) && !this.members.includes(student)) {
      this.pendingRequests.push(student);
    }
  }
  approveMember(student) {
    if (this.founder === student) return;
    const index = this.pendingRequests.indexOf(student);
    if (index !== -1) {
      this.pendingRequests.splice(index, 1);
      this.members.push(student);
      student.joinedGroups.push(this);

    }
  }
  rejectRequest(student) {
    const index = this.pendingRequests.indexOf(student);
    if (index !== -1) {
      this.pendingRequests.splice(index, 1);
    }
  }
  removeMember(student) {
    if (student === this.founder) return; // founder can't be removed
    this.members = this.members.filter(m => m !== student);
    student.joinedGroups = student.joinedGroups.filter(g => g !== this);
  }
  postMessage(from, content) {
    const msg = new Message(this, from, content);
    this.messages.push(msg);
    return msg;
  }
  viewPendingRequests() {
    return this.pendingRequests;
  }

}

class Notification{
  constructor(message){
    this.message = message
    this.isRead = false
    this.date =  new Date();
  }
   markAsRead() {
    this.isRead = true;
  }

  // mark notification as unread
  markAsUnread() {
    this.isRead = false;
  }

  // check if read
  isNotificationRead() {
    return this.isRead;
  }

  // return a formatted view of the notification
  view() {
    return `[${this.date.toLocaleString()}] ${this.isRead ? "(Read)" : "(Unread)"} - ${this.message}`;
  }
}

class Message{
  constructor(to, from, content){
    this.source = from
    this.isRead = false
    this.destination = to
    this.content = content
  }
  markAsRead() {
    this.isRead = true;
  }
  view() {
    return `[${this.date.toLocaleString()}] From: ${this.source.name} → To: ${this.destination.name} | ${this.isRead ? "(Read)" : "(Unread)"} | "${this.content}"`;
  }
}

class Donation
{
  constructor(donor, amount, fundRaiser)
  {
    this.donor = donor
    this.fundRaiser = fundRaiser
    this.amount = amount
    this.dateofDonation = new Date()
  }
  updateAmount(newAmount) {
    this.amount = newAmount;
  }
  viewDetails() {
    return `Donor: ${this.donor.name}, Fundraiser: ${this.fundRaiser.title}, Amount: ${this.amount}, Date: ${this.dateOfDonation.toLocaleString()}`;
  }
  isForFundraiser(fundraiser) {
    return this.fundRaiser === fundraiser;
  }
}

class FundRaising
{
  constructor(id, title, organiser, goalAmount, collectedAmount, donations)
  {
    this.id = id
    this.title = title
    this.organiser = organiser
    this.goalAmount = goalAmount
    this.collectedAmount = collectedAmount
    this.donations = []
    this.isApproved = "no"
    this.status = "ongoing"  //ongoing.....(complete)collectedAmount....
  }
  addDonation(donation) {
    if (this.status !== "ongoing") {
      throw new Error(`Fundraiser '${this.title}' is not active`);
    }
    this.donations.push(donation);
    this.collectedAmount += donation.amount;

    if (this.collectedAmount >= this.goalAmount) {
      this.status = "completed";  // goal reached
    }
  }
  viewDonations() {
    return this.donations.map(d => d.viewDetails());
  }
  getProgress() {
    return ((this.collectedAmount / this.goalAmount) * 100).toFixed(2) + "%";
  }
  isGoalReached() {
    return this.collectedAmount >= this.goalAmount;
  }
  closeFundraiser() {
    this.status = "closed";
  }
  viewDetails() {
    return `Fundraiser: ${this.title}, Organiser: ${this.organiser.name}, Goal: ${this.goalAmount}, Collected: ${this.collectedAmount}, Status: ${this.status}, Approved: ${this.isApproved}`;
  }
}