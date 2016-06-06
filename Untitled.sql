SELECT * FROM ticketfix.type_status;

insert into type_status (code, description) values('new','created but not yet assigned to work');
insert into type_status (code, description) values('assigned','given to a contractor or internal staff to fix');
insert into type_status (code, description) values('in-progress','started working on it');
insert into type_status (code, description) values('blocked','something came up that work is on hold');
insert into type_status (code, description) values('complete','issue resolved');