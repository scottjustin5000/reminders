var CalendarEvent = function(id, description, location, startTime) {
    self = this;
    self.id = id;
    self.eventName = description;
    self.number = location;
    self.eventTime = Date.parse(startTime);
    self.smsTime = Date.parse(startTime).addMinutes(-5);
    return self;
};