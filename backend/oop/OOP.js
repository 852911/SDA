class User
{
  constructor(id, name, email, contact, password){
    this.name = name
    this.email = email
    this.contact = contact
    this.password = password
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
  constructor(id, name, email, contact, rollNo, degree, campus,  batch, password){
    super(id, name, email, contact, password);
    this.rollNo = rollNo;
    this.degree = degree;   // Instance of Degree
    this.campus = campus;   // Instance of Campus
    this.batch = batch;
    this.organisedGroups = [];
    this.joinedGroups = [];
    this.organisedFundRaisers = [];
    this.requestedFundRaisers = []; // add this
    this.donationsGiven = [];
    this.lostAndFoundItems = [];
  }
  organiseStudyGroup( gpName, subj){
    const group = new StudyGroup(this, gpName, subj)
    this.organisedGroups.push(group)
    this.joinedGroups.push(group)
    return group
  }
   static getSummary(totalCount) {
    return {
      totalStudents: totalCount,
      retrievedAt: new Date()
    };
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
  requestFundraiser(title, description, goalAmount) {
    const fr = new FundRaising(null, title, description, this, goalAmount, 0, []);
    this.requestedFundRaisers.push(fr);
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
  // Report a lost item
  reportLostItem(title, description) {
    const item = new LostAndFoundItem(Date.now(), title, description, this);
    this.lostAndFoundItems.push(item); // reporter = this
    return item;
  }

  // Report a found item (item reported by someone else)
  reportFoundItem(item) {
    item.markFound(this); // finder = this
    this.lostAndFoundItems.push(item); // optional: track found items too
    return item;
  }

  // Claim a lost item that was found
  claimLostItem(item) {
    item.claimItem(); // marks item as claimed
  }
}
class Degree {
  constructor(id, name, duration) {
    this.id = id;
    this.name = name;
    this.duration = duration; // e.g. 4 years
  }
}
class Campus {
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }
}
class Admin extends User{
  constructor(id, name, email, contact) {
    super(id, name, email, contact);
    this.requestedFundRaisers = [];
  }
   viewPendingFundraisers() {
    return this.requestedFundRaisers.filter(f => f.isApproved === "no");
  }

  approveFundraiser(fundraiser) {
    fundraiser.isApproved = "yes";
    // remove from pending list
    this.requestedFundRaisers = this.requestedFundRaisers.filter(f => f !== fundraiser);
    return `Fundraiser '${fundraiser.title}' approved by Admin ${this.name}`;
  }

  rejectFundraiser(fundraiser) {
    fundraiser.isApproved = "rejected";
    fundraiser.status = "closed";
    // remove from pending list
    this.requestedFundRaisers = this.requestedFundRaisers.filter(f => f !== fundraiser);
    return `Fundraiser '${fundraiser.title}' rejected by Admin ${this.name}`;
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
  constructor(message, date = new Date(), isRead = false){
    this.message = message
    this.isRead = isRead
    this.date =  new Date(date);
    this._id = null
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
  viewObj() {
    // Object format for frontend navigation
    return {
      _id: this._id,
      message: this.message,
      date: this.date,
      isRead: this.isRead,
    };
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
  constructor(id, title, discription, organiser, goalAmount, collectedAmount, donations)
  {
    this.id = id
    this.title = title
    this.discription = discription
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

class LostAndFoundItem {
  constructor(id, title, description, reporter, finder = null, isClaimed = false, dateReported = new Date()) {
    this.id = id;                 // unique identifier
    this.title = title;           // e.g., "Lost Backpack"
    this.description = description;
    this.reporter = reporter;     // the student who lost the item
    this.finder = finder;         // the student who found it (optional)
    this.isClaimed = isClaimed;   // status
    this.dateReported = new Date(dateReported);
  }

  markFound(finder) {
    this.finder = finder;       // record who found it
    this.isClaimed = false;     // not yet claimed
  }

  claimItem() {
    if (!this.finder) throw new Error("Item not found yet");
    this.isClaimed = true;      // now claimed by the reporter
  }

  viewDetails() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      reporter: this.reporter.name,
      finder: this.finder ? this.finder.name : null,
      isClaimed: this.isClaimed,
      dateReported: this.dateReported,
    };
  }
}


module.exports = { User, Student, Admin, StudyGroup, Notification, Message, FundRaising, Donation, Campus, Degree, LostAndFoundItem}; // ✅ export as object
