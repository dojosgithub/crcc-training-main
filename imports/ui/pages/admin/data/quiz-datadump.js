
import { Session } from 'meteor/session';

const XLSX = require('xlsx');

import { Util } from '/imports/api/lib/util.js'

import { Clients } from '/both/api/collections/clients.js';

import '/imports/ui/pages/admin/data/quiz-datadump.html';
// import '/imports/ui/stylesheets/admin/data/quiz-datadump.less';

let _selfQuizDatadump;

Template.QuizDatadump.onCreated(function() {
	_selfQuizDatadump = this;

	_selfQuizDatadump.clients = [];

	Tracker.autorun(() => {
		let _clients = Clients.find().fetch();
		
		if(_clients && _clients.length > 0) {
			_clients.sort((a, b) => {
				return a.name.localeCompare(b.name);
			})
			_selfQuizDatadump.clients = _clients;
			Session.set("QuizDatadump.clients", _clients);
		}
	});	

});

Template.QuizDatadump.onRendered(function() {

});

Template.QuizDatadump.helpers({
	Clients() {
		if(Session.get("QuizDatadump.clients")) {
			return Session.get("QuizDatadump.clients");
		}		
	},
	BUs() {
		return Session.get("QuizDatadump.bus");	
	},
	Modules() {
		return Session.get("QuizDatadump.modules");	
	},
	Module() {
		return Session.get("QuizDatadump.module");	
	},
	Data() {
		if(Session.get("QuizDatadump.data")) {
			return Session.get("QuizDatadump.data");
		}
	},
	DataUsers() {
		if(Session.get("QuizDatadump.data.users")) {
			return Session.get("QuizDatadump.data.users");
		}
	}				
});

Template.QuizDatadump.events({
	'change #sel_clients'(e, tpl) {
		e.preventDefault();		

		let _cid = $("#sel_clients").val();

		if(_cid !== '-1') {

			$('#sel_bus').prop('selectedIndex',0);
			$('#sel_modules').prop('selectedIndex',0);

			let _client = Clients.findOne(_cid);

			if(_client) {
				// console.log(_client, _client.bus);
				let _bus = [];
				_client.bus.forEach((b) => {
					if(b.status === 1) {
						_bus.push(b)
					}
				});

				_bus.sort((a, b) => {
					return a.name.localeCompare(b.name);
				})

				Session.set("QuizDatadump.bus", _bus);
			}

			Session.set("QuizDatadump.client._id", _cid);

		} else {
			Session.set("QuizDatadump.bus", null);
		}

		Session.set("QuizDatadump.modules", null);
		Session.set("QuizDatadump.module", null);

	},
	'change #sel_bus'(e, tpl) {
		e.preventDefault();

		let _bid = $("#sel_bus").val();

		if(_bid !== '-1') {

			$('#sel_modules').prop('selectedIndex',0);

			let _obj = {
				clientId: Session.get("QuizDatadump.client._id"),
				buId: _bid === 'all' ? null : _bid				
			};

			// if(_bid === 'all') {
			// 	_obj['buId'] = null;				
			// } else {
			// 	_obj['buId'] = _bid;
			// }

			Session.set("QuizDatadump.obj", _obj);
			// Session.set("QuizDatadump.module", null);

			// console.log(_obj);

			Meteor.call("TrainingModules.byClient", _obj, (err, res) => {
				if(err) {
					toastr.error("Something went wrong. Please try again.");
					Session.set("QuizDatadump.modules", null);
				} else {
					
					// console.log(res);
					// console.log(Session.get("QuizDatadump.module"));

					if(res) {
						if(res.length > 0) {
							let _trModules = res;

							_trModules.sort((a,b) => {
								return a.moduleName.localeCompare(b.moduleName);
							});

							Session.set("QuizDatadump.modules", _trModules);

						} else {
							toastr.warning("No training modules to view.");
							Session.set("QuizDatadump.modules", null);
						}
					} else {
						toastr.error("Something went wrong. Please try again.");
						Session.set("QuizDatadump.modules", null);
					}
				}
			})

		} else {
			Session.set("QuizDatadump.modules", null);
		}

		Session.set("QuizDatadump.module", null);

	},
	'change #sel_modules'(e, tpl) {
		e.preventDefault();

		let _module = $("#sel_modules").val();

		if(_module !== '-1') {
			let _obj = Session.get("QuizDatadump.obj");

			let _datadumpObj = {
				clientId: _obj.clientId,
				buId: _obj.buId,
				moduleId: _module === 'all' ? null : _module 
			}

			// console.log(_datadumpObj);
			Session.set("QuizDatadump.datadumpObj", _datadumpObj);

		} else {
			Session.set("QuizDatadump.module", null);
		}

		Session.set("QuizDatadump.module", _module);
	},
	'click .btn-submit-quiz-datadump'(e, tpl) {
		e.preventDefault();

		if(confirm("Are you sure to proceed?")) {
			let _obj = Session.get("QuizDatadump.datadumpObj");

			if(_obj) {
				// toastr.info("Not fully implemented yet.");

				// console.log(_obj);
				$('.btn-submit-quiz-datadump').button('loading');
				
				Meteor.call("TrainingModuleScores.QuizDatadump.data", _obj, (err, res) => {
					if(err) {
						toastr.error("Something went wrong. Please try again.");
					} else {
						// console.log(res);
						if(res) {
							if(res && res.length > 0) {
								
								let 
									_users = [],
									_dataObj = {
										clientName: null,
										buName: null,
										moduleName: null
									};

								let _data = res.map((d,i) => {
									if(d.scores) {
										d.scores.sort((a,b) => {
											return a.firstName.localeCompare(b.firstName);
										});

										if(i === 0) {											
											_users = d.scores;
											_dataObj.clientName = d.clientName;
											_dataObj.moduleName = d.moduleName;
											if(_obj.buId) {
												_dataObj.buName = d.buName;
											}
										}										

										d.countIdentified = 0;
										d.scores.forEach((s) => {
											if(s.feedback === "Correct") {
												d.countIdentified++;
											}
										});

									}

									return d;
								});
								// console.log(_data);

								Session.set("QuizDatadump.data", _data);
								Session.set("QuizDatadump.data.users", _users);
								Session.set("QuizDatadump.data.obj", _dataObj);
							}
						} else {
							toastr.error("Something went wrong. Please try again.");							
						}
					}
					$('.btn-submit-quiz-datadump').button('reset');				
				});
				
			}
		}
	},
	'click .btn-select-table'(e, tpl) {
		e.preventDefault();

		let _table = document.getElementById('tbl_quiz_datadump_data');
		selectElementContents(_table);
	},
	'click .btn-export-table'(e, tpl) {
		e.preventDefault();

    let 
      // _tables = document.getElementsByTagName("table"),
      _table = document.getElementById("tbl_quiz_datadump_data"),
      _wb = XLSX.utils.table_to_book(_table, {sheet:"Quiz Score Datadump"}),
      _obj = Session.get("QuizDatadump.data.obj");

    let _buName = _obj.buName ? _obj.buName : 'All';

    let _fileBase = _obj.clientName + '-' + _buName + '-' + _obj.moduleName + '-';    		
      

		XLSX.write(_wb, {bookType:'xlsx', bookSST:true, type: 'base64'});
   	XLSX.writeFile(_wb, 'Quiz-Datadump-'+ _fileBase + Util.dateHMS(new Date)+'.xlsx');
	}
})

function selectElementContents(el) {
	var body = document.body, range, sel;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();
	}
}



