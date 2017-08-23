import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	// Statistics
	statMembers: String;
	statActiveMembers: String;
	statIndeptedMembers: String;
	statUnpaidAmount: String;
	constructor(private memSvc: MembersService) { }

	ngOnInit() {
		var user = JSON.parse(localStorage.getItem('user'));
		this.memSvc.getStatistics(user.id).subscribe(stats => {
			this.statMembers = JSON.stringify(stats.members);
			this.statActiveMembers = JSON.stringify(stats.activeMembers);
			this.statIndeptedMembers = JSON.stringify(stats.indeptedMembers);
			this.statUnpaidAmount = JSON.stringify(stats.unpaidAmount);
		},
		err =>{
			console.log(err);
			return false;
		});
	}

}
